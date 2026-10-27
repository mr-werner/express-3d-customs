import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

// Blueprint WebStudio client editor support. The site keeps all its content in code as defaults
// (site-fields.js); the client's published edits are fetched at load and laid over them.
// Edits are flat field values (text, links, photos, colors, sizes, lists) plus a `layout`:
// the site's pages, each a list of sections (the site's own designed sections, which can be
// hidden or moved, and sections added from the library in sections.jsx).
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
const ID_PATTERN = /^[a-z0-9][a-z0-9_-]{0,40}$/i;
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_PAGES = 12;
const MAX_SECTIONS = 40;
export const HOME_ID = "home";

export const EDIT_MODE =
  typeof window !== "undefined" && window.parent !== window && new URLSearchParams(window.location.search).has("bws-edit");

// Every value from the database is checked against its field before it reaches the page
export function clean(field, value) {
  if (value === undefined || value === null) return undefined;
  if (field.type === "size") {
    const number = Number(value);
    if (!Number.isFinite(number)) return undefined;
    return Math.min(field.max, Math.max(field.min, number));
  }
  if (field.type === "list") {
    if (!Array.isArray(value)) return undefined;
    return value.slice(0, field.max || 40).map((item) => cleanItem(field.itemFields, item));
  }
  if (typeof value !== "string") return undefined;
  const text = value.slice(0, field.maxLength || 4000);
  switch (field.type) {
    case "select":
      return field.options.some(([option]) => option === text) ? text : undefined;
    case "color":
      return /^#[0-9a-f]{6}$/i.test(text) ? text : undefined;
    case "link":
      return text === "" || /^(https?:\/\/|mailto:|tel:|#|\/)/i.test(text.trim()) ? text.trim() : undefined;
    case "image":
      return text === "" || /^(https:\/\/|\/)/i.test(text.trim()) ? text.trim() : undefined;
    case "email":
      return text === "" || /^[^\s@<>]+@[^\s@<>]+\.[a-z]{2,}$/i.test(text.trim()) ? text.trim() : undefined;
    case "phone":
      return /^[0-9+().\s-]*(ext\.?\s*\d+)?$/i.test(text.trim()) ? text.trim() : undefined;
    default:
      return text;
  }
}

// One object of fields (a list item or a section), every key present and checked
function cleanItem(fields, item) {
  const source = item && typeof item === "object" ? item : {};
  const result = {};
  for (const field of fields) {
    const value = clean(field, source[field.key]);
    result[field.key] = value === undefined ? field.default : value;
  }
  return result;
}

export function defaultLayout(builtins) {
  return { pages: [{ id: HOME_ID, title: "Home", slug: "", nav: false, sections: builtins.map((b) => ({ id: b.id, type: "builtin" })) }] };
}

// Checks a layout against the site's sections. The home page always exists and keeps every
// designed section (hidden ones too), and designed sections only live on the home page,
// since the menu links to them there.
export function cleanLayout(input, builtins, sectionTypes, styleFields) {
  const fallback = defaultLayout(builtins);
  if (!input || !Array.isArray(input.pages)) return fallback;
  const builtinIds = new Set(builtins.map((b) => b.id));
  const typeMap = Object.fromEntries(sectionTypes.map((t) => [t.type, t]));
  const seenPages = new Set();
  const seenSlugs = new Set([""]);
  const seenSections = new Set();
  const pages = [];

  for (const raw of input.pages.slice(0, MAX_PAGES)) {
    if (!raw || !ID_PATTERN.test(String(raw.id)) || seenPages.has(raw.id)) continue;
    const isHome = raw.id === HOME_ID;
    const slug = isHome ? "" : String(raw.slug || "").toLowerCase();
    if (!isHome && (!SLUG_PATTERN.test(slug) || seenSlugs.has(slug))) continue;
    seenPages.add(raw.id);
    seenSlugs.add(slug);

    const sections = [];
    for (const s of Array.isArray(raw.sections) ? raw.sections.slice(0, MAX_SECTIONS) : []) {
      if (!s || !ID_PATTERN.test(String(s.id)) || seenSections.has(s.id)) continue;
      if (s.type === "builtin") {
        if (!isHome || !builtinIds.has(s.id)) continue;
        sections.push({ id: s.id, type: "builtin", hidden: s.hidden === true });
      } else if (typeMap[s.type]) {
        sections.push({ id: s.id, type: s.type, hidden: s.hidden === true, ...cleanItem([...styleFields, ...typeMap[s.type].fields], s) });
      } else {
        continue;
      }
      seenSections.add(s.id);
    }
    // A designed section missing from an older layout comes back where it was in the original
    if (isHome) {
      builtins.forEach((b, index) => {
        if (!seenSections.has(b.id)) sections.splice(Math.min(index, sections.length), 0, { id: b.id, type: "builtin", hidden: false });
      });
    }
    const title = typeof raw.title === "string" && raw.title.trim() ? raw.title.trim().slice(0, 60) : "Untitled page";
    pages.push({ id: raw.id, title: isHome ? "Home" : title, slug, nav: !isHome && raw.nav !== false, sections });
  }

  if (!pages.some((p) => p.id === HOME_ID)) pages.unshift(fallback.pages[0]);
  pages.sort((a, b) => (a.id === HOME_ID ? -1 : b.id === HOME_ID ? 1 : 0));
  return { pages };
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

// c("key") reads a field's current value
export function useSite() {
  return useContext(SiteContext).c;
}

// The current page, every page, and navigation between them
export function usePages() {
  const { layout, page, navigate } = useContext(SiteContext);
  return { pages: layout.pages, page, navigate };
}

// Props that mark an element as editable, so a click in the editor jumps to its field
export function ed(key, sizeKey) {
  if (!EDIT_MODE) return {};
  return sizeKey ? { "data-bws": key, "data-bws-size": sizeKey } : { "data-bws": key };
}

// Text that disappears when the client clears it
export function T({ k, as: Tag = "span", children, ...props }) {
  const c = useSite();
  const value = c(k);
  if (!value) return null;
  return (
    <Tag {...props} {...ed(k)}>
      {children}
      {value}
    </Tag>
  );
}

function pathSlug() {
  return decodeURIComponent(window.location.pathname.replace(/^\/+|\/+$/g, "")).toLowerCase();
}

const EDIT_CSS = `
[data-bws] { cursor: pointer; }
[data-bws]:hover { outline: 2px dashed #0869e8; outline-offset: 3px; }
section[data-bws]:hover { outline-offset: -3px; }
.bws-flash { animation: bws-flash 1.4s ease-out; }
@keyframes bws-flash { 0%, 40% { outline: 3px solid #0869e8; outline-offset: -3px; box-shadow: inset 0 0 0 9999px rgba(8, 105, 232, .06); } 100% { outline: 3px solid transparent; outline-offset: -3px; } }
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
      setRect(target.isConnected ? target.getBoundingClientRect() : null);
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

// What the editor needs to know about a field (drops the parts that only matter here)
function schemaOf(field) {
  const { key, label, group, type, default: value, min, max, step, unit, help, rows, placeholder, options, itemFields, itemLabel, showIf, optional } = field;
  return {
    key, label, group, type, default: value, min, max, step, unit, help, rows, placeholder, options, itemLabel, showIf, optional,
    itemFields: itemFields?.map(schemaOf),
  };
}

export function SiteContentProvider({ fields, groups, builtins, sectionTypes, styleFields, initial, children }) {
  const fieldMap = useMemo(() => Object.fromEntries(fields.map((f) => [f.key, f])), [fields]);
  const [overrides, setOverrides] = useState(initial || {});
  const [slug, setSlug] = useState(() => (typeof window === "undefined" ? "" : pathSlug()));

  const values = useMemo(() => {
    const merged = {};
    for (const field of fields) {
      const value = clean(field, overrides[field.key]);
      merged[field.key] = value === undefined ? field.default : value;
    }
    return merged;
  }, [fields, overrides]);

  const layout = useMemo(
    () => cleanLayout(overrides.layout, builtins, sectionTypes, styleFields),
    [overrides.layout, builtins, sectionTypes, styleFields]
  );
  const page = layout.pages.find((p) => p.slug === slug) || layout.pages[0];

  const c = useCallback((key) => values[key], [values]);
  const post = useCallback((message) => window.parent.postMessage({ source: SOURCE, ...message }, "*"), []);

  const navigate = useCallback((nextSlug, hash = "") => {
    const path = `/${nextSlug}${EDIT_MODE ? window.location.search : ""}${hash}`;
    if (`/${pathSlug()}` !== `/${nextSlug}`) window.history.pushState(null, "", path);
    setSlug(nextSlug);
    if (hash) requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView());
    else window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onPop = () => setSlug(pathSlug());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Colors and sizes are CSS variables on the root element
  useEffect(() => {
    const root = document.documentElement;
    for (const field of fields) {
      if (!field.cssVar) continue;
      const value = values[field.key];
      root.style.setProperty(field.cssVar, field.type === "size" ? `${value}${field.cssUnit ?? field.unit ?? ""}` : value);
    }
  }, [fields, values]);

  useEffect(() => {
    if (EDIT_MODE) post({ type: "page", id: page.id });
  }, [page.id, post]);

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
      } else if (message.type === "page" && typeof message.slug === "string") {
        navigate(message.slug);
      } else if (message.type === "focus" && typeof message.key === "string") {
        // Wait a frame so a just-added section or a page switch has rendered
        requestAnimationFrame(() => {
          const el = [...document.querySelectorAll("[data-bws]")].find((node) => node.getAttribute("data-bws") === message.key);
          if (!el) return;
          el.scrollIntoView({ block: el.tagName === "SECTION" ? "start" : "center", behavior: "smooth" });
          el.classList.remove("bws-flash");
          void el.offsetWidth;
          el.classList.add("bws-flash");
        });
      }
    }

    // In the editor a click selects a field instead of following links; links to other
    // pages of the site still switch pages so the client can find them
    function onClick(event) {
      const el = event.target.closest?.("[data-bws]");
      const link = event.target.closest?.("a[href]");
      const pageLink = event.target.closest?.("[data-bws-page]");
      if (pageLink && !el) return;
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
    post({
      type: "ready",
      fields: fields.map(schemaOf),
      groups,
      builtins,
      sectionTypes: sectionTypes.map((t) => ({ type: t.type, label: t.label, description: t.description, defaults: t.defaults, fields: t.fields.map(schemaOf) })),
      styleFields: styleFields.map(schemaOf),
      defaultLayout: defaultLayout(builtins),
    });

    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("click", onClick, true);
      style.remove();
    };
  }, [fields, groups, builtins, sectionTypes, styleFields, post, navigate]);

  function onDrag(key, value) {
    setOverrides((current) => ({ ...current, [key]: value }));
    post({ type: "change", key, value });
  }

  const context = useMemo(() => ({ c, layout, page, navigate }), [c, layout, page, navigate]);

  return (
    <SiteContext.Provider value={context}>
      {children}
      {EDIT_MODE && <SizeHandle fields={fieldMap} values={values} onDrag={onDrag} />}
    </SiteContext.Provider>
  );
}
