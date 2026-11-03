import React, { memo, useEffect, useRef } from "react";
import markup from "./designer-markup.html?raw";
import "./designer-plugin.css";

// The 3D cover designer: script.js is the shop's own new Chime Cover Builder (desktop app, Nov 2026),
// with the pattern data and Three.js files served unchanged from public/designer/. config.js keeps the
// live site's pricing and colors. Wall and face thickness stay at the shop's standard 2 mm (hidden inputs),
// and the builder's production-only 3MF export is left out of this customer-facing page.
const SCRIPTS = [
  "config.js",
  "vendor/three.min.js",
  "vendor/OrbitControls.js",
  "arches-pattern-data.js",
  "angles-pattern-data.js",
  "diamonds-pattern-data.js",
  "flowers-pattern-data.js",
  "lines-pattern-data.js",
  "petals-pattern-data.js",
  "squares-pattern-data.js",
  "stars-pattern-data.js",
  "triangles-pattern-data.js",
  "wedge-bloom-pattern-data.js",
  "side-diamonds-data.js",
  "side-squiggles-data.js",
  "side-footballs-data.js",
  "side-hex-gems-data.js",
  "script.js",
  "theme.js",
];

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = src;
    el.async = false;
    el.onload = resolve;
    el.onerror = () => reject(new Error(`Could not load ${src}`));
    document.body.appendChild(el);
  });
}

let loading = null;
function loadDesigner() {
  if (!loading) loading = SCRIPTS.reduce((chain, file) => chain.then(() => loadScript(`/designer/${file}`)), Promise.resolve());
  return loading;
}

function setSelect(select, match) {
  if (!select) return false;
  const option = Array.from(select.options).find((o) => o.value === match || o.text === match);
  if (!option) return false;
  select.value = option.value;
  select.dispatchEvent(new Event("input", { bubbles: true }));
  select.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}

// Used by the pattern and color sections to load a choice into the designer.
export function applyToDesigner({ pattern, color }) {
  if (pattern) setSelect(document.querySelector("#frontPattern"), pattern);
  if (color) {
    setSelect(document.querySelector("#faceColorSelect"), color);
    setSelect(document.querySelector("#wallColorSelect"), color);
  }
  // On phones jump straight to the 3D view; on desktop show the whole designer.
  const narrow = window.matchMedia("(max-width: 980px)").matches;
  const target = narrow ? document.querySelector("#coverPreview") : document.querySelector("#designer .configurator") || document.querySelector("#designer");
  target?.scrollIntoView({ behavior: "smooth", block: narrow ? "center" : "start" });
}

// The builder script binds to its elements once, so the same elements are kept for the whole visit
// and moved back in whenever the designer page is shown again.
let host = null;
function designerHost() {
  if (!host) {
    host = document.createElement("div");
    host.className = "e3d-chime-configurator";
    host.dataset.productId = "12";
    host.innerHTML = markup;
    wirePreviewControls(host);
  }
  return host;
}

const WIDTH_KEY = "e3d-designer-options-width";
const redraw = () => window.dispatchEvent(new Event("resize"));

// Full screen mode and the drag handle that trades width between the options and the preview.
function wirePreviewControls(root) {
  const panel = root.querySelector(".preview-panel");
  const grid = root.querySelector(".configurator");
  const fullButton = root.querySelector("[data-pv-full]");
  const fullLabel = root.querySelector("[data-pv-full-label]");
  const handle = root.querySelector("[data-pv-resize]");

  const isFull = () => document.fullscreenElement === panel || panel.classList.contains("is-fullscreen");
  const syncFull = () => {
    const on = isFull();
    fullLabel.textContent = on ? "Exit full screen" : "Full screen";
    fullButton.setAttribute("aria-pressed", String(on));
    document.documentElement.classList.toggle("pv-locked", panel.classList.contains("is-fullscreen"));
    requestAnimationFrame(redraw);
  };
  fullButton.addEventListener("click", () => {
    if (isFull()) {
      if (document.fullscreenElement) document.exitFullscreen();
      panel.classList.remove("is-fullscreen");
    } else if (panel.requestFullscreen) {
      panel.requestFullscreen().catch(() => panel.classList.add("is-fullscreen")).finally(syncFull);
      return;
    } else {
      panel.classList.add("is-fullscreen"); // iPhone Safari has no element full screen
    }
    syncFull();
  });
  document.addEventListener("fullscreenchange", syncFull);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panel.classList.contains("is-fullscreen")) { panel.classList.remove("is-fullscreen"); syncFull(); }
  });

  const setWidth = (px) => {
    const max = Math.max(320, grid.clientWidth - 420);
    const width = Math.round(Math.min(max, Math.max(300, px)));
    grid.style.setProperty("--opts-w", `${width}px`);
    redraw();
    return width;
  };
  try { const saved = Number(localStorage.getItem(WIDTH_KEY)); if (saved) grid.style.setProperty("--opts-w", `${saved}px`); } catch {}
  const save = (width) => { try { localStorage.setItem(WIDTH_KEY, String(width)); } catch {} };
  handle.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    handle.setPointerCapture(event.pointerId);
    const left = grid.getBoundingClientRect().left;
    let width = 0;
    const move = (e) => { width = setWidth(e.clientX - left - 12); };
    const up = () => { handle.removeEventListener("pointermove", move); if (width) save(width); };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up, { once: true });
    handle.addEventListener("pointercancel", up, { once: true });
  });
  handle.addEventListener("keydown", (event) => {
    const current = root.querySelector(".controls-panel").getBoundingClientRect().width;
    if (event.key === "ArrowLeft") save(setWidth(current - 40));
    if (event.key === "ArrowRight") save(setWidth(current + 40));
  });
}

function Designer() {
  const slot = useRef(null);
  useEffect(() => {
    const el = designerHost();
    slot.current.appendChild(el);
    loadDesigner()
      .then(() => window.dispatchEvent(new Event("resize")))
      .catch((error) => console.error(error));
    return () => el.remove();
  }, []);
  return <div ref={slot} className="designer-slot" />;
}

export default memo(Designer);
