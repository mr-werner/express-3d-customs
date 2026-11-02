import blueprintLogo from "./assets/blueprint-webstudio-logo.png";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, CheckCircle2, Minus, Plus, X } from "lucide-react";

// Blueprint WebStudio client-preview card + feedback form. Express 3D Customs asked for this redesign,
// so there's no offer countdown; the notes panel sends their feedback to Justin. Only access-code holders reach
// this page, so it asks for notes only (the proxy in api/demo-interest.js fills in who it's from).

export const STUDIO_PHONE = "+17205156647";
export const STUDIO_EMAIL = "hello@blueprintwebstudio.com";
export const STUDIO_WEBSITE = "https://blueprintwebstudio.com";
export const CLIENT_PORTAL = "https://www.blueprintwebstudio.com/portal";

let COMPANY = "";
let STUDIO_SOURCE = "";

const DRAFT_KEY = "e3d-feedback-draft";

function readDraft() {
  try { return window.localStorage.getItem(DRAFT_KEY) || ""; } catch { return ""; }
}

function saveDraft(value) {
  try {
    if (value) window.localStorage.setItem(DRAFT_KEY, value);
    else window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    // The draft still lives in memory for this visit
  }
}

// A small notes panel docked above the preview card, so the client can keep browsing and add notes as they go.
// The draft is kept when the panel is minimized or closed, and in this browser between visits, until it's sent.
function FeedbackPanel({ draft, onDraft, minimized, onMinimize, onClose }) {
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const textRef = useRef(null);

  useEffect(() => {
    if (!minimized && status !== "sent") textRef.current?.focus();
  }, [minimized, status]);

  async function submit(event) {
    event.preventDefault();
    if (status === "sending" || !draft.trim()) return;
    if (website) { setStatus("sent"); return; }
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
          budget: "Existing client",
          message: draft.trim(),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to send your notes.");
      onDraft("");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Please try again.");
    }
  }

  return (
    <section className={`feedback-panel${minimized ? " is-minimized" : ""}`} aria-labelledby="feedback-title">
      <div className="feedback-panel-head">
        <button type="button" className="feedback-panel-title" id="feedback-title" onClick={() => onMinimize(!minimized)} aria-expanded={!minimized}>
          Your notes{minimized && draft.trim() ? <span className="feedback-panel-saved"> · draft saved</span> : null}
        </button>
        <div className="feedback-panel-actions">
          <button type="button" onClick={() => onMinimize(!minimized)} aria-label={minimized ? "Expand notes" : "Minimize notes"}>
            {minimized ? <Plus size={18} /> : <Minus size={18} />}
          </button>
          <button type="button" onClick={onClose} aria-label="Close notes (your draft is kept)"><X size={18} /></button>
        </div>
      </div>
      {!minimized && (
        status === "sent" ? (
          <div className="feedback-panel-body feedback-panel-sent">
            <CheckCircle2 size={28} />
            <p><strong>Thanks, sent to Justin.</strong> He'll work your notes into the next version.</p>
            <button type="button" className="feedback-panel-send" onClick={() => setStatus("idle")}>Add more notes</button>
          </div>
        ) : (
          <form onSubmit={submit} className="feedback-panel-body">
            <p className="feedback-panel-hint">Keep browsing and jot things down as you go: copy, photos, prices, the designer, colors.</p>
            <textarea
              ref={textRef}
              value={draft}
              onChange={(e) => onDraft(e.target.value)}
              required
              maxLength={3000}
              rows={6}
              aria-label="Your notes"
              placeholder="e.g. Swap the hero photo, add the felt insert option, change the FAQ wording..."
            />
            <div className="interest-honeypot" aria-hidden="true"><label>Website<input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label></div>
            {error && <p className="interest-error" role="alert">{error}</p>}
            <button type="submit" className="feedback-panel-send" disabled={status === "sending" || !draft.trim()}>{status === "sending" ? "Sending..." : "Send to Justin"}</button>
            <p className="feedback-panel-privacy">Your draft is saved in this browser until you send it.</p>
          </form>
        )
      )}
    </section>
  );
}

export function ConceptWidget({ company, abbr }) {
  COMPANY = company;
  STUDIO_SOURCE = `${abbr}.blueprintwebstudio.com`;
  const [collapsed, setCollapsed] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);
  const [showForm, setShowForm] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [draft, setDraft] = useState(readDraft);
  const updateDraft = useCallback((value) => { setDraft(value); saveDraft(value); }, []);
  // The preview card folds away while notes are open, so the notes and the page both have room
  const openForm = () => { setShowForm(true); setMinimized(false); setCollapsed(true); };

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
    <div className="concept-dock">
      {showForm && <FeedbackPanel draft={draft} onDraft={updateDraft} minimized={minimized} onMinimize={setMinimized} onClose={() => setShowForm(false)} />}
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
            <button type="button" className="concept-widget-cta" onClick={openForm}>{draft.trim() ? "Continue your notes" : "Send Feedback"} <ArrowUpRight size={18} /></button>
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
    </div>
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
