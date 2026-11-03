// Newest written reviews from the Express3DCustoms Etsy shop, through the Etsy Open API v3.
// Vercel's CDN keeps each answer for about a month, so the site refreshes its reviews roughly monthly
// without calling Etsy on every visit.
//
// Environment variables (set on the Vercel project):
//   ETSY_API_KEY        the app's keystring from etsy.com/developers (required for live reviews)
//   ETSY_SHARED_SECRET  the app's shared secret, when Etsy asks for "keystring:secret" (optional)
//   ETSY_SHOP_ID        the numeric shop id, to skip the lookup by shop name (optional)
// Without a key this answers with an empty list and the page shows its built-in reviews instead.
const SHOP_NAME = "Express3DCustoms";
const API = "https://openapi.etsy.com/v3/application";
const MONTH = 60 * 60 * 24 * 30;
const MAX_REVIEWS = 24;

function etsyKey() {
  const key = process.env.ETSY_API_KEY;
  if (!key) return null;
  const secret = process.env.ETSY_SHARED_SECRET;
  return secret && !key.includes(":") ? `${key}:${secret}` : key;
}

async function etsy(path, key) {
  const response = await fetch(`${API}${path}`, { headers: { "x-api-key": key, Accept: "application/json" } });
  if (!response.ok) throw new Error(`Etsy answered ${response.status} for ${path.split("?")[0]}`);
  return response.json();
}

function formatDate(seconds) {
  return new Date(seconds * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Denver" });
}

export default async function handler(req, res) {
  res.setHeader("Allow", "GET");
  if (req.method !== "GET") return res.status(405).json({ reviews: [] });

  const key = etsyKey();
  if (!key) {
    res.setHeader("Cache-Control", "public, s-maxage=3600");
    return res.status(200).json({ source: "none", reviews: [] });
  }

  try {
    let shopId = process.env.ETSY_SHOP_ID;
    if (!shopId) {
      const shops = await etsy(`/shops?shop_name=${encodeURIComponent(SHOP_NAME)}`, key);
      shopId = shops.results?.find((s) => s.shop_name?.toLowerCase() === SHOP_NAME.toLowerCase())?.shop_id ?? shops.results?.[0]?.shop_id;
      if (!shopId) throw new Error("Shop not found");
    }
    const data = await etsy(`/shops/${shopId}/reviews?limit=100`, key);
    const reviews = (data.results || [])
      .filter((r) => r.rating >= 4 && String(r.review || "").trim().length >= 12)
      .sort((a, b) => (b.created_timestamp || b.create_timestamp) - (a.created_timestamp || a.create_timestamp))
      .slice(0, MAX_REVIEWS)
      .map((r) => ({
        // The API does not share buyer names
        name: "Etsy buyer",
        date: formatDate(r.created_timestamp || r.create_timestamp),
        rating: r.rating,
        text: String(r.review).trim().replace(/\s+/g, " ").slice(0, 600),
        photo: r.image_url_fullxfull || undefined,
      }));
    res.setHeader("Cache-Control", `public, s-maxage=${MONTH}, stale-while-revalidate=${MONTH}`);
    return res.status(200).json({ source: "etsy", updated: new Date().toISOString(), reviews });
  } catch (error) {
    console.error("reviews:", error.message);
    res.setHeader("Cache-Control", "public, s-maxage=3600");
    return res.status(200).json({ source: "error", reviews: [] });
  }
}
