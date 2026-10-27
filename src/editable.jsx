import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

// Blueprint WebStudio client editor support. The site keeps all its content in code as defaults
// (site-fields.js); the client's published edits are fetched at load and laid over them.
// Opened inside the portal editor with ?bws-edit=1, the site also takes live drafts from the
// editor, reports clicks on editable elements, and shows drag handles for size fields.
// Same file in every editable client site; only site-fields.js changes.

const SOURCE = "bws-editor";
const EDITOR_ORIGINS = [
  /^https:\/\/(www\.)?blueprintwebstudio\.com$/,
  /^https:\/\/blueprint-digital-[a-z0-9-]+\.vercel\.app$/,
  /^http:\/\/localhost(:\d+)?$/,
];
const LOAD_TIMEOUT_MS = 1500;

export const EDIT_MODE =
  typeof window !== "undefined" && window.parent !== window && new URLSearchParams(window.location.search).has("bws-edit");

// Every value from the database is checked against its field before it reaches the page
function clean(field, value) {
  if (value === undefined || value === null) return undefined;
  if (field.type === "size") {
    const number = Number(value);
    if (!Number.isFinite(number)) return undefined;
    return Math.min(field.max, Math.max(field.min, number));
  }
  if (typeof value !== "string") return undefined;
  const text = value.slice(0, field.max || 4000);
  switch (field.type) {
    case "color":
      return /^#[0-9a-f]{6}$/i.test(text) ? text : undefined;
    case "link":
      return text === "" || /^(https?:\/\/|mailto:|tel:|#|\/)/i.test(text.trim()) ? text.trim() : undefined;
    case "image":
      return /^(https:\/\/|\/)/i.test(text.trim()) ? text.trim() : undefined;
    case "email":
      return text === "" || /^[^\s@<>]+@[^\s@<>]+\.[a-z]{2,}$/i.test(text.trim()) ? text.trim() : undefined;
    case "phone":
      return /^[0-9+().\s-]*(ext\.?\s*\d+)?$/i.test(text.trim()) ? text.trim() : undefined;
    default:
      return text;
  }
}

// Waits briefly for the published edits that index.html started fetching, so visitors
// see the edited page on first paint instead of a flash of the original
export async function loadPublished() {
  if (EDIT_MODE || typeof window === "undefined" || !window.__BWS_CONTENT__) return {};
  const timeout = new Promise((resolve) => setTimeout(() => resolve(null), LOAD_TIMEOUT_MS));
  const result = await Promise.race([window.__BWS_CONTENT__, timeout]).catch(() => null);
  return result && typeof result.content === "object" && result.content ? result.content : {};
}

const SiteContext = createContext(null);

export function useSite() {
  return useContext(SiteContext);
}

// Props that mark an element as editable, so a click in the editor jumps to its field
export function ed(key, sizeKey) {
  if (!EDIT_MODE) return {};
  return sizeKey ? { "data-bws": key, "data-bws-size": sizeKey } : { "data-bws": key };
}

const EDIT_CSS = `
[data-bws] { cursor: pointer; }
[data-bws]:hover { outline: 2px dashed #0869e8; outline-offset: 3px; }
.bws-flash { animation: bws-flash 1.4s ease-out; }
@keyframes bws-flash { 0%, 40% { outline: 3px solid #0869e8; outline-offset: 4px; box-shadow: 0 0 0 9999px rgba(8, 105, 232, .08); } 100% { outline: 3px solid transparent; outline-offset: 4px; } }
.bws-handle { position: fixed; z-index: 2147483000; width: 22px; height: 22px; margin: -11px 0 0 -11px; border: 3px solid #fff; border-radius: 50%; background: #0869e8; box-shadow: 0 2px 8px rgba(0,0,0,.35); cursor: nwse-resize; touch-action: none; }
.bws-handle-label { position: fixed; z-index: 2147483000; padding: 3px 8px; border-radius: 6px; background: #03152c; color: #fff; font: 600 12px/1.4 system-ui, sans-serif; pointer-events: none; transform: translate(-100%, -150%); white-space: nowrap; }
`;

// Drag handle for the size field of the element under the pointer
function SizeHandle({ fields, values, onDrag }) {
  const [target, setTarget] = useState(null);
  const [rect, setRect] = useState(null);
  const drag = useRef(null);

  useEffect(() => {
    function onOver(event) {
      if (drag.current) return;
      const el = event.target.closest?.("[data-bws-size]");
      if (el) setTarget(el);
    }
    document.addEventListener("pointerover", onOver);
    return () => document.removeEventListener("pointerover", onOver);
  }, []);

  useEffect(() => {
    if (!target) return undefined;
    let frame = 0;
    const update = () => {
      setRect(target.getBoundingClientRect());
      frame = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(frame);
  }, [target]);

  const field = target ? fields[target.getAttribute("data-bws-size")] : null;
  if (!field || !rect || rect.width === 0) return null;

  function onPointerDown(event) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, width: rect.width, height: rect.height, value: values[field.key] };
  }

  function onPointerMove(event) {
    const start = drag.current;
    if (!start) return;
    // Height-based fields follow vertical drags, width-based ones horizontal drags
    const ratio =
      field.axis === "x" ? (start.width + event.clientX - start.x) / start.width : (start.height + event.clientY - start.y) / start.height;
    const step = field.step || 1;
    const next = Math.min(field.max, Math.max(field.min, Math.round((start.value * ratio) / step) * step));
    if (next !== values[field.key]) onDrag(field.key, next);
  }

  function onPointerUp() {
    drag.current = null;
  }

  return (
    <>
      <span className="bws-handle-label" style={{ left: rect.right, top: rect.bottom }}>
        {field.label}: {values[field.key]}
        {field.unit || ""}
      </span>
      <span
        className="bws-handle"
        style={{ left: rect.right, top: rect.bottom }}
        role="slider"
        aria-label={field.label}
        aria-valuemin={field.min}
        aria-valuemax={field.max}
        aria-valuenow={values[field.key]}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />
    </>
  );
}

export function SiteContentProvider({ fields, groups, initial, children }) {
  const fieldMap = useMemo(() => Object.fromEntries(fields.map((f) => [f.key, f])), [fields]);
  const [overrides, setOverrides] = useState(initial || {});

  const values = useMemo(() => {
    const merged = {};
    for (const field of fields) {
      const value = clean(field, overrides[field.key]);
      merged[field.key] = value === undefined ? field.default : value;
    }
    return merged;
  }, [fields, overrides]);

  const c = useCallback((key) => values[key], [values]);

  // Colors and sizes are CSS variables on the root element
  useEffect(() => {
    const root = document.documentElement;
    for (const field of fields) {
      if (!field.cssVar) continue;
      const value = values[field.key];
      root.style.setProperty(field.cssVar, field.type === "size" ? `${value}${field.cssUnit ?? field.unit ?? ""}` : value);
    }
  }, [fields, values]);

  const post = useCallback((message) => window.parent.postMessage({ source: SOURCE, ...message }, "*"), []);

  // Editor wiring: tell the editor what can be edited, then follow its drafts
  useEffect(() => {
    if (!EDIT_MODE) return undefined;

    const style = document.createElement("style");
    style.textContent = EDIT_CSS;
    document.head.appendChild(style);

    function onMessage(event) {
      if (!EDITOR_ORIGINS.some((pattern) => pattern.test(event.origin)) || event.data?.source !== SOURCE) return;
      const message = event.data;
      if (message.type === "content" && message.content && typeof message.content === "object") {
        setOverrides(message.content);
      } else if (message.type === "focus" && typeof message.key === "string") {
        const el = [...document.querySelectorAll("[data-bws]")].find((node) => node.getAttribute("data-bws") === message.key);
        if (el) {
          el.scrollIntoView({ block: "center", behavior: "smooth" });
          el.classList.remove("bws-flash");
          void el.offsetWidth;
          el.classList.add("bws-flash");
        }
      }
    }

    // In the editor a click selects a field instead of following links or opening things
    function onClick(event) {
      const el = event.target.closest?.("[data-bws]");
      const link = event.target.closest?.("a[href]");
      if (el) {
        event.preventDefault();
        event.stopPropagation();
        post({ type: "select", key: el.getAttribute("data-bws") });
      } else if (link && !link.getAttribute("href").startsWith("#")) {
        event.preventDefault();
      }
    }

    window.addEventListener("message", onMessage);
    document.addEventListener("click", onClick, true);
    const schema = fields.map(({ key, label, group, type, default: value, min, max, step, unit, help, rows, placeholder }) => ({
      key, label, group, type, default: value, min, max, step, unit, help, rows, placeholder,
    }));
    post({ type: "ready", fields: schema, groups });

    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("click", onClick, true);
      style.remove();
    };
  }, [fields, groups, post]);

  function onDrag(key, value) {
    setOverrides((current) => ({ ...current, [key]: value }));
    post({ type: "change", key, value });
  }

  return (
    <SiteContext.Provider value={c}>
      {children}
      {EDIT_MODE && <SizeHandle fields={fieldMap} values={values} onDrag={onDrag} />}
    </SiteContext.Provider>
  );
}
