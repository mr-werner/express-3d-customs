import blueprintLogo from "./assets/blueprint-webstudio-logo.png";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, CheckCircle2, Minus, Plus, X } from "lucide-react";

// Blueprint WebStudio client-preview card + feedback form. Express 3D Customs asked for this redesign,
// so there's no offer countdown; the form sends their feedback to Justin.

export const STUDIO_PHONE = "+17205156647";
export const STUDIO_EMAIL = "hello@blueprintwebstudio.com";
export const STUDIO_WEBSITE = "https://blueprintwebstudio.com";
export const CLIENT_PORTAL = "https://www.blueprintwebstudio.com/portal";

let COMPANY = "";
let STUDIO_SOURCE = "";

function FeedbackModal({ onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", website: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const previousFocus = document.activeElement;
    modalRef.current?.focus();
    const handleEscape = (event) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
      previousFocus?.focus?.();
    };
  }, [onClose]);

  function update(field, value) { setForm((prev) => ({ ...prev, [field]: value })); }

  async function submit(event) {
    event.preventDefault();
    if (status === "sending") return;
    if (form.website) { setStatus("sent"); return; }
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/demo-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospect: COMPANY,
          source: STUDIO_SOURCE,
          page: window.location.href,
          action: "Client Feedback",
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          budget: "Existing client",
          message: form.message.trim(),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to send your message.");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Please try again.");
    }
  }

  return (
    <div className="interest-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="interest-modal" role="dialog" aria-modal="true" aria-labelledby="interest-title" ref={modalRef} tabIndex={-1}>
        <button type="button" className="interest-close" onClick={onClose} aria-label="Close feedback form"><X size={24} /></button>
        <span className="interest-kicker">BLUEPRINT WEBSTUDIO · CLIENT PREVIEW</span>
        {status === "sent" ? (
          <div className="interest-success">
            <CheckCircle2 size={44} />
            <h2 id="interest-title">Thanks, got it.</h2>
            <p>Your notes went straight to Justin at Blueprint WebStudio. He'll work them into the next version and follow up.</p>
            <button type="button" className="interest-submit" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <h2 id="interest-title">What should change?</h2>
            <p className="interest-intro">Point out anything to fix, add or reword: copy, photos, prices, the designer, colors. It all goes to Justin.</p>
            <form onSubmit={submit} className="interest-form">
              <label>Name <span>*</span><input value={form.name} onChange={(e) => update("name", e.target.value)} required maxLength={120} autoComplete="name" /></label>
              <label>Email <span>*</span><input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required maxLength={254} autoComplete="email" /></label>
              <label>Phone<input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} maxLength={40} autoComplete="tel" /></label>
              <label>Your notes <span>*</span><textarea value={form.message} onChange={(e) => update("message", e.target.value)} required maxLength={3000} rows={5} placeholder="e.g. Swap the hero photo, add the felt insert option, change the FAQ wording..." /></label>
              <div className="interest-honeypot" aria-hidden="true"><label>Website<input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update("website", e.target.value)} /></label></div>
              {error && <p className="interest-error" role="alert">{error}</p>}
              <button type="submit" className="interest-submit" disabled={status === "sending"}>{status === "sending" ? "Sending..." : "Send Feedback"}</button>
              <p className="interest-privacy">Sent privately to Blueprint WebStudio.</p>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

export function ConceptWidget({ company, abbr }) {
  COMPANY = company;
  STUDIO_SOURCE = `${abbr}.blueprintwebstudio.com`;
  const [collapsed, setCollapsed] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);
  const [showForm, setShowForm] = useState(false);
  const closeForm = useCallback(() => setShowForm(false), []);

  // Tuck the card away once the visitor scrolls into the designer so it doesn't cover the price.
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 500) {
        setCollapsed(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <aside className={`concept-widget${collapsed ? " is-collapsed" : ""}`} aria-label="Client preview from Blueprint WebStudio">
        <div className="concept-widget-head">
          <span>CLIENT PREVIEW · NOT YET LIVE</span>
          <button type="button" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? "Expand preview card" : "Collapse preview card"} aria-expanded={!collapsed}>
            {collapsed ? <Plus size={20} /> : <Minus size={20} />}
          </button>
        </div>
        {!collapsed && (
          <div className="concept-widget-body">
            <h2>Your new site, in progress</h2>
            <span className="concept-widget-label">PREPARED FOR {company.toUpperCase()}</span>
            <p>Click around, try the designer, and tell us what to change.</p>
            <button type="button" className="concept-widget-cta" onClick={() => setShowForm(true)}>Send Feedback <ArrowUpRight size={18} /></button>
            <div className="concept-widget-links">
              {STUDIO_PHONE && <a href={`tel:${STUDIO_PHONE}`}>Call</a>}
              <a href={`mailto:${STUDIO_EMAIL}`}>Email</a>
              <a href={STUDIO_WEBSITE} target="_blank" rel="noopener noreferrer">Website</a>
              <a href={CLIENT_PORTAL} target="_blank" rel="noopener noreferrer">Client sign in</a>
            </div>
          </div>
        )}
        <div className="concept-widget-footer">
          <a className="concept-widget-brand" href={STUDIO_WEBSITE} target="_blank" rel="noopener noreferrer" aria-label="Visit Blueprint WebStudio"><span className="studio-logo-mask" style={{ WebkitMaskImage: `url(${blueprintLogo})`, maskImage: `url(${blueprintLogo})` }} aria-hidden="true" /><span>Blueprint WebStudio</span></a>
          <span>Preview build</span>
        </div>
      </aside>
      {showForm && <FeedbackModal onClose={closeForm} />}
    </>
  );
}

export function StudioCredit() {
  return (
    <a className="footer-studio-brand" href={STUDIO_WEBSITE} target="_blank" rel="noopener noreferrer" aria-label="Website by Blueprint WebStudio">
      <span>Website by</span>
      <span className="studio-logo-mask" style={{ WebkitMaskImage: `url(${blueprintLogo})`, maskImage: `url(${blueprintLogo})` }} aria-hidden="true" />
      <strong>Blueprint WebStudio</strong>
    </a>
  );
}
