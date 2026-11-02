// Same-origin proxy: keeps the Resend API key on the main Blueprint WebStudio project.
// The feedback form only asks for notes (the page is behind the client's access code), so the
// sender fields the upstream needs are filled in here.
const CLIENT_NAME = "Express 3D Customs (concept review)";
const CLIENT_EMAIL = "Not asked: sent from the access-code concept review";
const UPSTREAM = "https://www.blueprintwebstudio.com/api/demo-interest";

export default async function handler(req, res) {
  res.setHeader("Allow", "POST, OPTIONS");
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ success: false, message: "Method not allowed" });
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { name, email, phone, budget, message } = body;
    if (!String(message || "").trim()) return res.status(400).json({ success: false, message: "Please add your notes." });
    const payload = {
      prospect: "Express 3D Customs",
      source: "e3d.blueprintwebstudio.com",
      page: "https://e3d.blueprintwebstudio.com",
      action: String(body.action || "Client Feedback").slice(0, 100),
      name: String(name || CLIENT_NAME).slice(0, 200),
      email: String(email || CLIENT_EMAIL).slice(0, 320),
      phone: String(phone || "").slice(0, 100),
      budget: String(budget || "Existing client").slice(0, 100),
      message: String(message || "").slice(0, 4000),
    };
    const upstream = await fetch(UPSTREAM, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12000),
    });
    const data = await upstream.json().catch(() => ({}));
    return res.status(upstream.status).json({
      success: upstream.ok && data.success === true,
      message: data.message || (upstream.ok ? undefined : "The email service is unavailable. Please try again."),
    });
  } catch (error) {
    console.error("Demo interest proxy error:", error);
    return res.status(502).json({ success: false, message: "Could not reach the email service. Please try again shortly." });
  }
}
