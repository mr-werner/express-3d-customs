import React, { memo, useEffect } from "react";
import markup from "./designer-markup.html?raw";
import "./designer-plugin.css";

// The live 3D cover designer from express3dcustoms.com (their own e3d-chime-configurator plugin, v1.0.25).
// The plugin's script, pattern data and Three.js files are served unchanged from public/designer/.
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

function Designer() {
  useEffect(() => {
    loadDesigner().catch((error) => console.error(error));
  }, []);
  return <div className="e3d-chime-configurator" data-product-id="12" dangerouslySetInnerHTML={{ __html: markup }} />;
}

export default memo(Designer);
