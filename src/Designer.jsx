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
  const target = narrow ? document.querySelector("#coverPreview") : document.querySelector("#designer");
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
  }
  return host;
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
