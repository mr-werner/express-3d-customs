const IN_TO_MM = 25.4;
const E3D_SETTINGS = (window.E3D_CHIME_CONFIG && window.E3D_CHIME_CONFIG.settings) ? window.E3D_CHIME_CONFIG.settings : {};
const settingNumber = function(key, fallback) { const value = Number(E3D_SETTINGS[key]); return Number.isFinite(value) ? value : fallback; };
const settingBool = function(key, fallback) { return typeof E3D_SETTINGS[key] === 'boolean' ? E3D_SETTINGS[key] : fallback; };
const settingText = function(key, fallback) { return (typeof E3D_SETTINGS[key] === 'string' && E3D_SETTINGS[key].length) ? E3D_SETTINGS[key] : fallback; };
const MODEL_SCALE = 0.028;
const WALL_MM = 2;
const FACE_INSET_MM = 2;
const CHAMFER_DEPTH_MM = 3;
const INTERNAL_FACE_WALL_CHAMFER_MM = 1;
const EXPORT_INTERIOR_CLEARANCE_MM = 1;
const CORNER_FILLET_MM = 3;
const BELL_CLEARANCE_MM = 4;
const MIN_BELL_WEB_MM = 14;
const DEFAULT_CAMERA_POSITION = E3D_SETTINGS.cameraReset && typeof E3D_SETTINGS.cameraReset === 'object' ? {
  x: settingNumberFromObject(E3D_SETTINGS.cameraReset, 'x', -4.6),
  y: settingNumberFromObject(E3D_SETTINGS.cameraReset, 'y', 3.05),
  z: settingNumberFromObject(E3D_SETTINGS.cameraReset, 'z', 5.85)
} : { x: -4.6, y: 3.05, z: 5.85 };
function settingNumberFromObject(obj, key, fallback) { const value = Number(obj && obj[key]); return Number.isFinite(value) ? value : fallback; }
const CAMERA_ANGLES = E3D_SETTINGS.cameraAngles && typeof E3D_SETTINGS.cameraAngles === 'object' ? E3D_SETTINGS.cameraAngles : {};
const AUTO_VIEW_DURATION_MS = settingNumber('autoViewDurationMs', 700);
const DIMENSION_AUTO_FIT_DELAY_MS = 450;
const SIDE_LAYOUT_INPUT_DELAY_MS = 850;
const PATTERN_SAFE_MARGINS = E3D_SETTINGS.patternSafeMargins && typeof E3D_SETTINGS.patternSafeMargins === 'object' ? E3D_SETTINGS.patternSafeMargins : { front: 2.5, side: 0 };
const LABEL_OFFSETS = E3D_SETTINGS.labelOffsets && typeof E3D_SETTINGS.labelOffsets === 'object' ? E3D_SETTINGS.labelOffsets : {};

const PRICE_BASE = settingNumber("priceBase", 16.16);
const PRICE_MULTIPLIER = settingNumber("priceMultiplier", 1.185);
const PRICE_EXPONENT = settingNumber("priceExponent", 0.5753);
const DUAL_COLOR_MIN_VOLUME = settingNumber("dualColorMinVolume", 30);
const DUAL_COLOR_MAX_VOLUME = settingNumber("dualColorMaxVolume", 400);
const DUAL_COLOR_MIN_ADDON = settingNumber("dualColorMinAddon", 3);
const DUAL_COLOR_MAX_ADDON = settingNumber("dualColorMaxAddon", 6);
const PREMIUM_COLOR_LABELS = Array.isArray(E3D_SETTINGS.premiumColorLabels) && E3D_SETTINGS.premiumColorLabels.length ? E3D_SETTINGS.premiumColorLabels : ["Gold", "Silver", "Copper"];
const PREMIUM_COLOR_ADDON = settingNumber("premiumColorAddon", 2);
const OVERSIZE_THRESHOLD_IN = settingNumber("oversizeThresholdIn", 10);
const MAX_DIMENSION_IN = settingNumber("maxDimensionIn", 16);
const OVERSIZE_FEE_ADDON = settingNumber("oversizeFeeAddon", 10);
const OVERSIZE_SHIPPING_ADDON = settingNumber("oversizeShippingAddon", 5);
const PRICE_CARD_MESSAGE = settingText("priceCardMessage", "Live estimate before tax, shipping, or final design review.");
const PRICE_LABELS = {
  volume: settingText("priceVolumeLabel", "Volume"),
  size: settingText("priceSizeLabel", "Size price"),
  dualColor: settingText("priceDualColorLabel", "Dual color"),
  premiumColor: settingText("pricePremiumColorLabel", "Premium color"),
  oversize: settingText("priceOversizeLabel", "Oversize add-on")
};
const OVERSIZE_WARNING_TEMPLATE = settingText("oversizeWarningText", "Any dimension {threshold} in or larger adds a ${fee} oversized fee and ${shipping} additional shipping. Maximum dimension is {max} in.");
const BELL_VALIDATION_TEXT = settingText("bellValidationText", "Enter both bell diameter and bell face from wall. Bell face from wall must be equal to or greater than bell diameter.");

// Edit pattern options here. The labels populate the selectors automatically.
const BUILT_IN_FRONT_PATTERNS = ["Arches", "Angles", "Diamonds", "Flowers", "Lines", "Petals", "Squares", "Stars", "Triangles", "Wedge Bloom", "Blank"];
const BUILT_IN_SIDE_PATTERNS = ["Blank", "Diamonds", "Squiggles", "Footballs", "Hex Gems"];
const CUSTOM_FRONT_PATTERN_DATA = Array.isArray(E3D_SETTINGS.customFrontPatterns) ? E3D_SETTINGS.customFrontPatterns.filter(function(pattern) { return pattern && pattern.name && Array.isArray(pattern.paths) && Array.isArray(pattern.viewBox); }) : [];
const CUSTOM_SIDE_PATTERN_DATA = Array.isArray(E3D_SETTINGS.customSidePatterns) ? E3D_SETTINGS.customSidePatterns.filter(function(pattern) { return pattern && pattern.name && Array.isArray(pattern.paths) && Array.isArray(pattern.viewBox); }) : [];
const CUSTOM_FRONT_PATTERN_NAMES = CUSTOM_FRONT_PATTERN_DATA.map(function(pattern) { return pattern.name; });
const CUSTOM_SIDE_PATTERN_NAMES = CUSTOM_SIDE_PATTERN_DATA.map(function(pattern) { return pattern.name; });
function applyPatternDisplayOrder(names, order) {
  const uniqueNames = Array.from(new Set(names.filter(Boolean)));
  if (!Array.isArray(order) || !order.length) return uniqueNames;
  const ordered = [];
  order.forEach(function(name) { if (uniqueNames.indexOf(name) !== -1 && ordered.indexOf(name) === -1) ordered.push(name); });
  uniqueNames.forEach(function(name) { if (ordered.indexOf(name) === -1) ordered.push(name); });
  return ordered;
}
const FRONT_PATTERNS = applyPatternDisplayOrder(BUILT_IN_FRONT_PATTERNS.concat(CUSTOM_FRONT_PATTERN_NAMES.filter(function(name) { return BUILT_IN_FRONT_PATTERNS.indexOf(name) === -1; })), E3D_SETTINGS.frontPatternOrder);
const SIDE_PATTERNS = applyPatternDisplayOrder(BUILT_IN_SIDE_PATTERNS.concat(CUSTOM_SIDE_PATTERN_NAMES.filter(function(name) { return BUILT_IN_SIDE_PATTERNS.indexOf(name) === -1; })), E3D_SETTINGS.sidePatternOrder);
const PATTERN_SCALES = E3D_SETTINGS.patternScales && typeof E3D_SETTINGS.patternScales === "object" ? E3D_SETTINGS.patternScales : { front: {}, side: {} };

// Edit color options here. Add another label and hex value to offer more filament colors.
const DEFAULT_COLOR_OPTIONS = [
  { label: "Black", value: "#050505", renderValue: "#060606", roughness: 0.74, metalness: 0.0 },
  { label: "White", value: "#e0deda", renderValue: "#d8d6ce", roughness: 0.78, metalness: 0.0 },
  { label: "Gold", value: "#e1c156", renderValue: "#d2a311", roughness: 0.22, metalness: 0.72 },
  { label: "Silver", value: "#7d7d7d", renderValue: "#8f9291", roughness: 0.2, metalness: 0.78 },
  { label: "Copper", value: "#66302a", renderValue: "#b85a3e", roughness: 0.24, metalness: 0.72 },
  { label: "Beige", value: "#eae9d4", renderValue: "#c8bd95", roughness: 0.82, metalness: 0.0 },
  { label: "Gray", value: "#8c8d90", renderValue: "#768288", roughness: 0.78, metalness: 0.0 },
  { label: "Yellow", value: "#e4c207", renderValue: "#d8b900", roughness: 0.62, metalness: 0.0 },
  { label: "Orange", value: "#e55d06", renderValue: "#d85f08", roughness: 0.62, metalness: 0.0 },
  { label: "Red", value: "#931721", renderValue: "#b51f28", roughness: 0.64, metalness: 0.0 },
  { label: "Light Blue", value: "#2799f1", renderValue: "#209ee3", roughness: 0.6, metalness: 0.0 },
  { label: "Blue", value: "#0141ab", renderValue: "#0750cf", roughness: 0.6, metalness: 0.0 },
  { label: "Navy Blue", value: "#18215a", renderValue: "#172e7a", roughness: 0.66, metalness: 0.0 },
  { label: "Teal", value: "#018794", renderValue: "#00aeb8", roughness: 0.62, metalness: 0.0 },
  { label: "Emerald Green", value: "#01342c", renderValue: "#026345", roughness: 0.62, metalness: 0.0 },
  { label: "Custom color", value: "custom", roughness: 0.56, metalness: 0.0 }
];
const COLOR_OPTIONS = Array.isArray(E3D_SETTINGS.colors) && E3D_SETTINGS.colors.length ? E3D_SETTINGS.colors : DEFAULT_COLOR_OPTIONS;

const DEFAULT_WIDTH_IN = settingNumber("defaultWidthIn", 6.75);
const DEFAULT_HEIGHT_IN = settingNumber("defaultHeightIn", 4.75);
const DEFAULT_DEPTH_IN = settingNumber("defaultDepthIn", 2);

const DEFAULT_COLOR = COLOR_OPTIONS.find(function(color) { return color.label === "Gold"; }) || COLOR_OPTIONS.find(function(color) { return color.value !== "custom"; }) || { label: "White", value: "#e0deda", renderValue: "#d8d6ce", roughness: 0.78, metalness: 0 };
const state = { bellCutoutEnabled: false, autoViewEnabled: settingBool('autoViewDefault', true), widthMm: DEFAULT_WIDTH_IN * IN_TO_MM, heightMm: DEFAULT_HEIGHT_IN * IN_TO_MM, depthMm: DEFAULT_DEPTH_IN * IN_TO_MM, frontPattern: "Blank", sidePattern: "Blank", sideShapeCount: 5, sideShapeSizeMm: 30, sideShapeSpacingMm: 10, sideShapeHeightMm: 8, faceColor: DEFAULT_COLOR.renderValue || DEFAULT_COLOR.value, wallColor: DEFAULT_COLOR.renderValue || DEFAULT_COLOR.value, faceColorLabel: DEFAULT_COLOR.label, wallColorLabel: DEFAULT_COLOR.label, faceRoughness: Number(DEFAULT_COLOR.roughness) || 0.78, faceMetalness: Number(DEFAULT_COLOR.metalness) || 0, wallRoughness: Number(DEFAULT_COLOR.roughness) || 0.78, wallMetalness: Number(DEFAULT_COLOR.metalness) || 0, bellCount: 1, bellSpacingMm: 0, bellDepthMm: 0, bellProjectionMm: 0, bellCutoutWidthMm: 0, bellCutoutDepthMm: 0, bellCutoutsMm: [], showDimensions: settingBool('dimensionLabelsDefault', true), lightBrightness: 1, priceBreakdown: null };
const els = {
  canvas: document.querySelector("#coverPreview"),
  dimensionUnit: document.querySelector("#dimensionUnit"), unitLabels: document.querySelectorAll("[data-unit-label]"), widthIn: document.querySelector("#widthInInput"), heightIn: document.querySelector("#heightInInput"), depthIn: document.querySelector("#depthInInput"),
  widthMm: document.querySelector("#widthMmInput"), heightMm: document.querySelector("#heightMmInput"), depthMm: document.querySelector("#depthMmInput"),
  autoViewToggle: document.querySelector("#autoViewToggle"), bellCutoutEnabled: document.querySelector("#bellCutoutEnabled"), bellCutoutBody: document.querySelector("#bellCutoutBody"), bellUnit: document.querySelector("#bellUnitSelect"), bellUnitLabels: document.querySelectorAll("[data-bell-unit-label]"), bellCount: document.querySelectorAll('input[name="bellCount"]'), bellSpacingField: document.querySelector("#bellSpacingField"), bellSpacingIn: document.querySelector("#bellSpacingInInput"), bellDepthIn: document.querySelector("#bellDepthInInput"), bellProjectionIn: document.querySelector("#bellProjectionInInput"),
  bellSpacingMm: document.querySelector("#bellSpacingMmInput"), bellDepthMm: document.querySelector("#bellDepthMmInput"), bellProjectionMm: document.querySelector("#bellProjectionMmInput"), bellMergeNotice: document.querySelector("#bellMergeNotice"), bellCutoutReadout: document.querySelector("#bellCutoutReadout"), bellError: document.querySelector("#bellError"),
  inchesReadout: document.querySelector("#inchesReadout"), millimetersReadout: document.querySelector("#millimetersReadout"), centimetersReadout: document.querySelector("#centimetersReadout"),
  dimensionError: document.querySelector("#dimensionError"), oversizeWarning: document.querySelector("#oversizeWarning"), frontPattern: document.querySelector("#frontPattern"), sidePattern: document.querySelector("#sidePattern"), sidePatternControls: document.querySelector("#sidePatternControls"), sideShapeCount: document.querySelectorAll('input[name="sideShapeCount"]'), sideShapeSize: document.querySelector("#sideShapeSizeInput"), sideShapeSpacing: document.querySelector("#sideShapeSpacingInput"), sidePatternError: document.querySelector("#sidePatternError"),
  faceColorSelect: document.querySelector("#faceColorSelect"), wallColorSelect: document.querySelector("#wallColorSelect"), faceCustomColorRow: document.querySelector("#faceCustomColorRow"), faceCustomColorInput: document.querySelector("#faceCustomColorInput"), colorModeNote: document.querySelector("#colorModeNote"), faceColorLabelText: document.querySelector("#faceColorLabelText"), wallColorGroup: document.querySelector("#wallColorGroup"), wallColorLabelText: document.querySelector("#wallColorLabelText"),
  faceSwatches: document.querySelector("#faceColorSwatches"), wallSwatches: document.querySelector("#wallColorSwatches"), notes: document.querySelector("#notesInput"), form: document.querySelector("#quoteForm"),
  summaryCard: document.querySelector("#summaryCard"), summaryContent: document.querySelector("#summaryContent"), previewCaption: document.querySelector("#previewCaption"),
  frontLabel: document.querySelector("#frontLabel"), sideLabel: document.querySelector("#sideLabel"), fitCheckCard: document.querySelector("#fitCheckCard"), fitCheckStatus: document.querySelector("#fitCheckStatus"), fitCheckTitle: document.querySelector("#fitCheckTitle"), fitCheckList: document.querySelector("#fitCheckList"), priceTotal: document.querySelector("#priceTotal"), priceMessage: document.querySelector("#priceMessage"), priceBreakdown: document.querySelector("#priceBreakdown"), resetCamera: document.querySelector("#resetCameraButton"), standardReset: document.querySelector("#standardResetButton"), copyConfig: document.querySelector("#copyConfigButton"), dimensionToggle: document.querySelector("#dimensionToggle"), lightBrightness: document.querySelector("#lightBrightness"), lightBrightnessValue: document.querySelector("#lightBrightnessValue")
};
let renderer, scene, camera, controls, coverGroup, labelGroup, lightRig, syncingUnits = false, syncingBellUnits = false, cameraTransitionFrame = null, dimensionFitTimer = null, sideLayoutTimer = null, lastDimensionFitSignature = "";

applyAdminDefaultsToControls(); populateControls(); initScene(); bindEvents(); setupExportButtons(); setupMeasurementHelp(); updateDimensionUnitUI(); updateBellUnitUI(); updateBellCutoutToggleUI(); syncMetricFromActiveUnit(); syncBellMetricFromActiveUnit(); updateFromInputs(); lastDimensionFitSignature = getDimensionFitSignature(); animate();

function applyAdminDefaultsToControls() {
  if (els.dimensionToggle) els.dimensionToggle.checked = state.showDimensions;
  if (els.autoViewToggle) els.autoViewToggle.checked = state.autoViewEnabled;
}

function populateControls() {
  FRONT_PATTERNS.forEach(function(pattern) { els.frontPattern.add(new Option(pattern, pattern)); });
  SIDE_PATTERNS.forEach(function(pattern) { els.sidePattern.add(new Option(pattern, pattern)); });
  COLOR_OPTIONS.forEach(function(color) {
    if (!color || !color.label || color.value === undefined) return;
    els.faceColorSelect.add(new Option(color.label, color.value));
    if (color.value !== "custom") els.wallColorSelect.add(new Option(color.label, color.value));
  });

  const defaultOption = COLOR_OPTIONS.find(function(color) { return color && color.label === "Gold" && color.value !== "custom"; }) ||
    COLOR_OPTIONS.find(function(color) { return color && color.value !== "custom"; });

  if (defaultOption) {
    els.faceColorSelect.value = defaultOption.value;
    els.wallColorSelect.value = defaultOption.value;
  }

  buildColorSwatches(els.faceSwatches, els.faceColorSelect, "face");
  buildColorSwatches(els.wallSwatches, els.wallColorSelect, "wall");
}

function buildColorSwatches(container, select, target) {
  COLOR_OPTIONS.filter(function(color) { return color.value !== "custom"; }).forEach(function(color) {
    const swatch = document.createElement("button");
    swatch.type = "button";
    swatch.className = "swatch";
    if (isPremiumColorLabel(color.label)) swatch.classList.add("is-premium");
    swatch.dataset.value = color.value;
    swatch.style.backgroundColor = color.value;
    swatch.title = color.label + (isPremiumColorLabel(color.label) ? " - premium color" : "");
    swatch.setAttribute("aria-label", "Choose " + color.label + (isPremiumColorLabel(color.label) ? " premium" : "") + " for " + target + " color");
    swatch.addEventListener("click", function() {
      if (isAutoViewEnabled()) snapCameraToColorView();
      select.value = color.value;
      updateFromInputs();
    });
    container.appendChild(swatch);
  });
}

function updateSwatchSelection(container, value) {
  if (!container) return;
  Array.from(container.querySelectorAll(".swatch")).forEach(function(swatch) {
    swatch.classList.toggle("is-selected", swatch.dataset.value === value);
  });
}

function getPatternScale(kind, patternName) {
  const typeScales = PATTERN_SCALES && PATTERN_SCALES[kind] && typeof PATTERN_SCALES[kind] === "object" ? PATTERN_SCALES[kind] : {};
  const saved = typeScales[patternName] || {};
  const data = kind === "front"
    ? CUSTOM_FRONT_PATTERN_DATA.find(function(pattern) { return pattern.name === patternName; })
    : CUSTOM_SIDE_PATTERN_DATA.find(function(pattern) { return pattern.name === patternName; });
  const sxRaw = saved.x ?? saved.scaleX ?? data?.scaleX ?? 100;
  const syRaw = saved.y ?? saved.scaleY ?? data?.scaleY ?? 100;
  const offsetXRaw = saved.offsetX ?? data?.offsetX ?? 0;
  const offsetYRaw = saved.offsetY ?? data?.offsetY ?? 0;
  const rotationRaw = saved.rotation ?? data?.rotation ?? 0;
  const sx = Math.max(0.5, Math.min(2, (Number(sxRaw) || 100) / 100));
  const sy = Math.max(0.5, Math.min(2, (Number(syRaw) || 100) / 100));
  const ox = Math.max(-0.5, Math.min(0.5, (Number(offsetXRaw) || 0) / 100));
  const oy = Math.max(-0.5, Math.min(0.5, (Number(offsetYRaw) || 0) / 100));
  const rotation = THREE.MathUtils.degToRad(Math.max(-180, Math.min(180, Number(rotationRaw) || 0)));
  return { x: sx, y: sy, offsetX: ox, offsetY: oy, rotation: rotation };
}


function getSvgArtworkBounds(pathElements, fallbackViewBox) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  pathElements.forEach(function(pathElement) {
    try {
      const box = pathElement.getBBox();
      if (!box || !Number.isFinite(box.x) || !Number.isFinite(box.y) || !Number.isFinite(box.width) || !Number.isFinite(box.height)) return;
      if (box.width <= 0 || box.height <= 0) return;
      minX = Math.min(minX, box.x);
      minY = Math.min(minY, box.y);
      maxX = Math.max(maxX, box.x + box.width);
      maxY = Math.max(maxY, box.y + box.height);
    } catch (err) {}
  });
  if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY) || maxX <= minX || maxY <= minY) {
    return {
      x: fallbackViewBox[0],
      y: fallbackViewBox[1],
      w: fallbackViewBox[2],
      h: fallbackViewBox[3]
    };
  }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

function shouldTrimSvgPatternToArtwork(data) {
  return !!(data && (data.id || data.source || data.trimToArtwork));
}

function getFacePatternSvgData(patternName) {
  if (patternName === "Angles") return window.ANGLES_PATTERN_SVG || null;
  if (patternName === "Diamonds") return window.DIAMONDS_PATTERN_SVG || null;
  if (patternName === "Flowers") return window.FLOWERS_PATTERN_SVG || null;
  if (patternName === "Lines") return window.LINES_PATTERN_SVG || null;
  if (patternName === "Petals") return window.PETALS_PATTERN_SVG || null;
  if (patternName === "Squares") return window.SQUARES_PATTERN_SVG || null;
  if (patternName === "Stars") return window.STARS_PATTERN_SVG || null;
  if (patternName === "Triangles") return window.TRIANGLES_PATTERN_SVG || null;
  if (patternName === "Wedge Bloom") return window.WEDGE_BLOOM_PATTERN_SVG || null;
  if (patternName === "Arches") return window.ARCHES_PATTERN_SVG || null;
  const customPattern = CUSTOM_FRONT_PATTERN_DATA.find(function(pattern) { return pattern.name === patternName; });
  return customPattern || null;
}

function initScene() {
  scene = new THREE.Scene(); scene.background = new THREE.Color(0x202929);
  const wrap = els.canvas.parentElement;
  camera = new THREE.PerspectiveCamera(38, wrap.clientWidth / wrap.clientHeight, 0.1, 220); resetCameraPosition();
  renderer = new THREE.WebGLRenderer({ canvas: els.canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); renderer.shadowMap.enabled = false;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.NoToneMapping;
  controls = new THREE.OrbitControls(camera, renderer.domElement); controls.enableDamping = true; controls.minDistance = 6; controls.maxDistance = 40; controls.target.set(0, 0, 0);
  controls.addEventListener("start", cancelDimensionAutoFit);
  renderer.domElement.addEventListener("pointerdown", cancelDimensionAutoFit);
  renderer.domElement.addEventListener("wheel", cancelDimensionAutoFit, { passive: true });
  // Locked neutral 5000K-style preview lighting. Keep this bright and right/front biased for color matching.
  const ambient = new THREE.AmbientLight(0xffffff, 0.32); scene.add(ambient);
  const key = new THREE.DirectionalLight(0xffffff, 0.58); key.position.set(7.2, 1.25, 2.2); scene.add(key);
  const sheen = new THREE.DirectionalLight(0xffffff, 0.32); sheen.position.set(5.8, 0.85, 1.75); scene.add(sheen);
  const softFill = new THREE.DirectionalLight(0xffffff, 0.1); softFill.position.set(-4, 3, -5); scene.add(softFill);
  // Baseline brightness is calibrated to the previous 170% setting.
  lightRig = { ambient: { light: ambient, base: 0.5712 }, key: { light: key, base: 1.0353 }, sheen: { light: sheen, base: 0.5712 }, softFill: { light: softFill, base: 0.1785 } };
  applyLightBrightness();
  coverGroup = new THREE.Group(); labelGroup = new THREE.Group(); scene.add(coverGroup, labelGroup);
  window.addEventListener("resize", resizeRenderer); resizeRenderer();
}


function setupMeasurementHelp() {
  const modal = document.querySelector("#measurementHelpModal");
  const modalTitle = document.querySelector("#measurementHelpTitle");
  const modalImage = document.querySelector("#measurementHelpImage");
  if (!modal || !modalTitle || !modalImage) return;

  let lastHelpButton = null;

  function openHelp(button) {
    const imageSrc = button.dataset.helpImage;
    const title = button.dataset.helpTitle || "Measurement example";
    if (!imageSrc) return;
    lastHelpButton = button;
    modalTitle.textContent = title;
    modalImage.src = imageSrc;
    modalImage.alt = title + " measurement example";
    modal.hidden = false;
    document.body.classList.add("measurement-modal-open");
    const closeButton = modal.querySelector("[data-close-measurement-help]");
    if (closeButton) closeButton.focus({ preventScroll: true });
  }

  function closeHelp() {
    modal.hidden = true;
    modalImage.src = "";
    document.body.classList.remove("measurement-modal-open");
    if (lastHelpButton) lastHelpButton.focus({ preventScroll: true });
  }

  document.querySelectorAll(".help-icon[data-help-image]").forEach(function(button) {
    button.addEventListener("click", function(event) {
      event.preventDefault();
      event.stopPropagation();
      openHelp(button);
    });
  });

  modal.querySelectorAll("[data-close-measurement-help]").forEach(function(control) {
    control.addEventListener("click", closeHelp);
  });

  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" && !modal.hidden) closeHelp();
  });
}

function bindEvents() {
  if (els.bellCutoutEnabled) {
    els.bellCutoutEnabled.addEventListener("change", function() {
      updateBellCutoutToggleUI();
      if (els.bellCutoutEnabled.checked && isAutoViewEnabled()) snapCameraToBottomView();
      updateFromInputs();
    });
  }
  [els.widthIn, els.heightIn, els.depthIn].forEach(function(input) { input.addEventListener("input", function() { if (syncingUnits) return; syncMetricFromActiveUnit(); updateFromInputs(); requestDimensionAutoFit(); }); });
  els.dimensionUnit.addEventListener("change", function() { setActiveInputsFromMillimeters(); updateDimensionUnitUI(); updateFromInputs(); requestDimensionAutoFit(); });
  els.bellCount.forEach(function(input) { input.addEventListener("change", function() { updateBellSpacingVisibility(); updateFromInputs(); }); });
  els.sideShapeCount.forEach(function(input) { input.addEventListener("change", updateFromInputs); });
  els.bellUnit.addEventListener("change", function() { setBellActiveInputsFromMillimeters(); updateBellUnitUI(); updateFromInputs(); });
  [els.bellSpacingIn, els.bellDepthIn, els.bellProjectionIn].forEach(function(input) { input.addEventListener("input", function() { if (syncingBellUnits) return; syncBellMetricFromActiveUnit(); updateFromInputs(); }); });
  const bellInputs = Array.from(els.bellCount).concat([els.bellUnit, els.bellSpacingIn, els.bellDepthIn, els.bellProjectionIn]);
  bellInputs.forEach(function(input) {
    input.addEventListener("focus", function() { if (isAutoViewEnabled()) snapCameraToBottomView(); });
    input.addEventListener("blur", function() {
      window.setTimeout(function() {
        if (isAutoViewEnabled() && !bellInputs.includes(document.activeElement)) {
          resetCameraPosition();
          controls.target.set(0, 0, 0);
          controls.update();
        }
      }, 0);
    });
  });
  [els.sideShapeSize, els.sideShapeSpacing].forEach(function(input) {
    if (!input) return;
    input.addEventListener("input", requestSideLayoutUpdate);
    input.addEventListener("change", flushSideLayoutUpdate);
    input.addEventListener("blur", flushSideLayoutUpdate);
  });
  [els.frontPattern, els.sidePattern, els.faceColorSelect, els.wallColorSelect, els.faceCustomColorInput].forEach(function(input) { if (input) input.addEventListener("input", updateFromInputs); });
  attachSelectViewSnap(els.frontPattern, snapCameraToFrontView);
  attachSelectViewSnap(els.sidePattern, snapCameraToLeftSideView);
  attachSelectViewSnap(els.faceColorSelect, snapCameraToColorView);
  attachSelectViewSnap(els.wallColorSelect, snapCameraToColorView);
  attachSelectViewSnap(els.faceCustomColorInput, snapCameraToColorView);
  els.resetCamera.addEventListener("click", function() { resetCameraPosition(); controls.target.set(0, 0, 0); controls.update(); });
  if (els.standardReset) els.standardReset.addEventListener("click", resetToStandardCover);
  if (els.copyConfig) els.copyConfig.addEventListener("click", copyConfigurationSummary);
  document.querySelectorAll("[data-view-preset]").forEach(function(button) {
    button.addEventListener("click", function() { snapToViewPreset(button.dataset.viewPreset); });
  });
  els.dimensionToggle.addEventListener("change", function() { state.showDimensions = els.dimensionToggle.checked; buildCover(); });
  if (els.autoViewToggle) { els.autoViewToggle.addEventListener("change", function() { state.autoViewEnabled = els.autoViewToggle.checked; }); }
  els.lightBrightness.addEventListener("input", function() { state.lightBrightness = Number(els.lightBrightness.value) / 100; applyLightBrightness(); });
  els.form.addEventListener("submit", function(event) {
    event.preventDefault();
    if (!readDimensions() || !readBellDimensions()) return;
    submitConfiguredCoverToCart();
  });
}

function applyLightBrightness() {
  if (!lightRig) return;
  Object.keys(lightRig).forEach(function(name) {
    lightRig[name].light.intensity = lightRig[name].base * state.lightBrightness;
  });
  if (els.lightBrightnessValue) els.lightBrightnessValue.textContent = Math.round(state.lightBrightness * 100) + "%";
}

function syncMetricFromActiveUnit() {
  syncingUnits = true;
  const factor = getActiveUnitToMmFactor();
  els.widthMm.value = toFixedSmart(Number(els.widthIn.value) * factor, 1);
  els.heightMm.value = toFixedSmart(Number(els.heightIn.value) * factor, 1);
  els.depthMm.value = toFixedSmart(Number(els.depthIn.value) * factor, 1);
  updateDimensionReadouts(); syncingUnits = false;
}

function setActiveInputsFromMillimeters() {
  syncingUnits = true;
  const factor = getMmToActiveUnitFactor();
  const digits = els.dimensionUnit.value === "in" ? 3 : els.dimensionUnit.value === "cm" ? 2 : 1;
  els.widthIn.value = toFixedSmart(state.widthMm * factor, digits);
  els.heightIn.value = toFixedSmart(state.heightMm * factor, digits);
  els.depthIn.value = toFixedSmart(state.depthMm * factor, digits);
  updateDimensionReadouts(); syncingUnits = false;
}

function getActiveUnitToMmFactor() {
  if (els.dimensionUnit.value === "cm") return 10;
  if (els.dimensionUnit.value === "mm") return 1;
  return IN_TO_MM;
}

function getMmToActiveUnitFactor() {
  if (els.dimensionUnit.value === "cm") return 0.1;
  if (els.dimensionUnit.value === "mm") return 1;
  return 1 / IN_TO_MM;
}

function updateDimensionUnitUI() {
  const label = els.dimensionUnit.value;
  els.unitLabels.forEach(function(item) { item.textContent = label; });
  const step = label === "in" ? "0.125" : label === "cm" ? "0.1" : "0.1";
  const max = label === "in" ? MAX_DIMENSION_IN : label === "cm" ? MAX_DIMENSION_IN * 2.54 : MAX_DIMENSION_IN * IN_TO_MM;
  [els.widthIn, els.heightIn, els.depthIn].forEach(function(input) {
    input.step = step;
    input.max = toFixedSmart(max, label === "in" ? 3 : 1);
  });
}

function syncBellMetricFromActiveUnit() {
  syncingBellUnits = true;
  const factor = getBellActiveUnitToMmFactor();
  els.bellSpacingMm.value = bellValueOrBlank(els.bellSpacingIn.value, factor, 1);
  els.bellDepthMm.value = bellValueOrBlank(els.bellDepthIn.value, factor, 1);
  els.bellProjectionMm.value = bellValueOrBlank(els.bellProjectionIn.value, factor, 1);
  syncingBellUnits = false;
}

function setBellActiveInputsFromMillimeters() {
  syncingBellUnits = true;
  const factor = getMmToBellActiveUnitFactor();
  const digits = els.bellUnit.value === "in" ? 3 : 1;
  els.bellSpacingIn.value = bellValueOrBlank(els.bellSpacingMm.value, factor, digits);
  els.bellDepthIn.value = bellValueOrBlank(els.bellDepthMm.value, factor, digits);
  els.bellProjectionIn.value = bellValueOrBlank(els.bellProjectionMm.value, factor, digits);
  syncingBellUnits = false;
}

function getBellActiveUnitToMmFactor() {
  return els.bellUnit.value === "mm" ? 1 : IN_TO_MM;
}

function getMmToBellActiveUnitFactor() {
  return els.bellUnit.value === "mm" ? 1 : 1 / IN_TO_MM;
}

function updateBellUnitUI() {
  const unit = els.bellUnit.value;
  els.bellUnitLabels.forEach(function(item) { item.textContent = unit; });
  const step = unit === "in" ? "0.125" : "0.1";
  const max = unit === "in" ? 12 : 304.8;
  [els.bellSpacingIn, els.bellDepthIn, els.bellProjectionIn].forEach(function(input) {
    input.step = step;
    input.max = toFixedSmart(max, unit === "in" ? 3 : 1);
    input.placeholder = unit;
  });
  updateBellSpacingVisibility();
}

function updateBellCutoutToggleUI() {
  const enabled = !!(els.bellCutoutEnabled && els.bellCutoutEnabled.checked);
  state.bellCutoutEnabled = enabled;
  if (els.bellCutoutBody) els.bellCutoutBody.hidden = !enabled;
  [els.bellUnit, els.bellSpacingIn, els.bellDepthIn, els.bellProjectionIn].concat(Array.from(els.bellCount || [])).forEach(function(input) {
    if (input) input.disabled = !enabled;
  });
  if (!enabled) {
    state.bellCutoutWidthMm = 0;
    state.bellCutoutDepthMm = 0;
    state.bellCutoutsMm = [];
    if (els.bellError) els.bellError.textContent = "";
    if (els.bellMergeNotice) { els.bellMergeNotice.hidden = true; els.bellMergeNotice.textContent = ""; }
    if (els.bellCutoutReadout) els.bellCutoutReadout.textContent = "No bell cutout";
  }
  updateBellSpacingVisibility();
}

function updateBellSpacingVisibility() {
  const enabled = !!(els.bellCutoutEnabled && els.bellCutoutEnabled.checked);
  const count = getSelectedBellCount();
  const isSingle = count === 1;
  els.bellSpacingField.hidden = false;
  els.bellSpacingField.classList.toggle("is-disabled", isSingle || !enabled);
  els.bellSpacingIn.disabled = !enabled || isSingle;
  if (isSingle) {
    els.bellSpacingIn.value = "0";
    els.bellSpacingMm.value = "0";
  } else if (els.bellSpacingIn.value === "" && els.bellSpacingMm.value === "") {
    els.bellSpacingIn.value = "0";
    els.bellSpacingMm.value = "0";
  }
}

function getSelectedBellCount() {
  const selected = Array.from(els.bellCount).find(function(input) { return input.checked; });
  return clamp(Math.round(Number(selected ? selected.value : 1)), 1, 3);
}

function bellValueOrBlank(value, factor, digits) {
  const number = Number(value);
  if (!value || !Number.isFinite(number) || number <= 0) return "";
  return toFixedSmart(number * factor, digits);
}

function updateDimensionReadouts() {
  const h = Number(els.heightMm.value), w = Number(els.widthMm.value), d = Number(els.depthMm.value);
  els.inchesReadout.textContent = toFixedSmart(h / IN_TO_MM, 3) + " H x " + toFixedSmart(w / IN_TO_MM, 3) + " W x " + toFixedSmart(d / IN_TO_MM, 3) + " D";
  els.millimetersReadout.textContent = toFixedSmart(h, 1) + " H x " + toFixedSmart(w, 1) + " W x " + toFixedSmart(d, 1) + " D";
  els.centimetersReadout.textContent = toFixedSmart(h / 10, 2) + " H x " + toFixedSmart(w / 10, 2) + " W x " + toFixedSmart(d / 10, 2) + " D";
}

function updateFromInputs() {
  if (!readDimensions()) return;
  readBellDimensions();
  state.frontPattern = els.frontPattern.value; state.sidePattern = els.sidePattern.value;
  readSidePatternControls();
  applyColorSelection("face", els.faceColorSelect, els.faceCustomColorRow, els.faceCustomColorInput);
  applyColorSelection("wall", els.wallColorSelect, null, null);
  updateColorModeControls();
  updateSwatchSelection(els.faceSwatches, els.faceColorSelect.value);
  updateSwatchSelection(els.wallSwatches, els.wallColorSelect.value);
  els.previewCaption.textContent = toFixedSmart(state.widthMm / IN_TO_MM, 3) + "\" W x " + toFixedSmart(state.heightMm / IN_TO_MM, 3) + "\" H x " + toFixedSmart(state.depthMm / IN_TO_MM, 3) + "\" D / " + toFixedSmart(state.widthMm, 1) + " x " + toFixedSmart(state.heightMm, 1) + " x " + toFixedSmart(state.depthMm, 1) + " mm";
  updatePreviewBadges();
  updatePricing();
  validateSidePatternLayout(false);
  state.showDimensions = els.dimensionToggle.checked;
  buildCover();
  updateFitCheck();
}

function requestSideLayoutUpdate() {
  if (sideLayoutTimer) window.clearTimeout(sideLayoutTimer);
  sideLayoutTimer = window.setTimeout(function() {
    sideLayoutTimer = null;
    updateFromInputs();
  }, SIDE_LAYOUT_INPUT_DELAY_MS);
}

function flushSideLayoutUpdate() {
  if (!sideLayoutTimer) return;
  window.clearTimeout(sideLayoutTimer);
  sideLayoutTimer = null;
  updateFromInputs();
}

function resetToStandardCover() {
  els.dimensionUnit.value = "in";
  els.heightIn.value = toFixedSmart(DEFAULT_HEIGHT_IN, 3);
  els.widthIn.value = toFixedSmart(DEFAULT_WIDTH_IN, 3);
  els.depthIn.value = toFixedSmart(DEFAULT_DEPTH_IN, 3);
  els.frontPattern.value = "Arches";
  els.sidePattern.value = "Blank";
  setSideShapeCount(5);
  if (els.sideShapeSize) els.sideShapeSize.value = "30";
  if (els.sideShapeSpacing) els.sideShapeSpacing.value = "10";
  els.faceColorSelect.value = DEFAULT_COLOR.value;
  els.wallColorSelect.value = DEFAULT_COLOR.value;
  if (els.bellCutoutEnabled) els.bellCutoutEnabled.checked = false;
  updateDimensionUnitUI();
  syncMetricFromActiveUnit();
  updateBellCutoutToggleUI();
  updateFromInputs();
  fitCameraToCurrentCover();
}

function copyConfigurationSummary() {
  const payload = buildConfiguredCoverPayload();
  const lines = [
    "Express 3D Customs chime cover design",
    "Dimensions: " + payload.heightIn + " H x " + payload.widthIn + " W x " + payload.depthIn + " D in",
    "Metric: " + payload.heightMm + " H x " + payload.widthMm + " W x " + payload.depthMm + " D mm",
    "Front pattern: " + payload.frontPattern,
    "Side pattern: " + payload.sidePattern + (payload.sidePattern === "Blank" ? "" : " (" + payload.sideShapeCount + " cutouts, " + payload.sideShapeSizeMm + " mm, " + payload.sideShapeSpacingMm + " mm spacing)"),
    "Face color: " + payload.faceColor,
    "Wall color: " + payload.wallColor,
    "Bell cutout: " + payload.bellCutout,
    "Estimated price: " + payload.estimatedPriceFormatted,
    "Notes: " + (payload.notes || "None")
  ];
  const text = lines.join("\n");
  const done = function() {
    if (!els.copyConfig) return;
    const original = els.copyConfig.textContent;
    els.copyConfig.textContent = "Copied";
    window.setTimeout(function() { els.copyConfig.textContent = original; }, 1400);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(function() { window.prompt("Copy this design summary:", text); });
  } else {
    window.prompt("Copy this design summary:", text);
  }
}

function snapToViewPreset(view) {
  if (view === "front") return snapCameraToFrontView();
  if (view === "side") return snapCameraToLeftSideView();
  if (view === "bottom") return snapCameraToBottomView();
  if (view === "inside") return snapCameraToInsideView();
  fitCameraToCurrentCover();
}

function updatePreviewBadges() {
  els.frontLabel.innerHTML = buildPreviewBadgeHtml("Front", state.frontPattern, "Face color", state.faceColorLabel);
  els.sideLabel.innerHTML = buildPreviewBadgeHtml("Sides", state.sidePattern, "Wall color", state.wallColorLabel);
}

function updateFitCheck() {
  if (!els.fitCheckCard) return;
  const issues = collectFitIssues();
  const blocking = issues.filter(function(issue) { return issue.type === "error"; });
  const warnings = issues.filter(function(issue) { return issue.type !== "error"; });
  els.fitCheckCard.classList.toggle("is-ready", !issues.length);
  els.fitCheckCard.classList.toggle("is-warning", !blocking.length && warnings.length > 0);
  els.fitCheckCard.classList.toggle("is-error", blocking.length > 0);
  els.fitCheckStatus.textContent = blocking.length ? "Needs attention" : warnings.length ? "Review before ordering" : "Ready to print";
  els.fitCheckTitle.textContent = blocking.length ? "Fix these items" : warnings.length ? "A few notes apply" : "Fit check passed";
  els.fitCheckList.innerHTML = issues.length ? issues.map(function(issue) { return "<li>" + escapeHtml(issue.text) + "</li>"; }).join("") : "<li>No fit issues detected.</li>";
}

function collectFitIssues() {
  const issues = [];
  if (els.dimensionError && els.dimensionError.textContent.trim()) issues.push({ type: "error", text: els.dimensionError.textContent.trim() });
  if (els.sidePatternError && els.sidePatternError.textContent.trim()) issues.push({ type: "error", text: els.sidePatternError.textContent.trim() });
  if (els.bellError && els.bellError.textContent.trim()) issues.push({ type: "error", text: els.bellError.textContent.trim() });
  if (els.oversizeWarning && !els.oversizeWarning.hidden && els.oversizeWarning.textContent.trim()) issues.push({ type: "warning", text: els.oversizeWarning.textContent.trim() });
  if (els.bellMergeNotice && !els.bellMergeNotice.hidden && els.bellMergeNotice.textContent.trim()) issues.push({ type: "warning", text: els.bellMergeNotice.textContent.trim() });
  if (hasDistinctDualColors()) issues.push({ type: "info", text: "Two-tone color fee is included." });
  return issues;
}

function buildPreviewBadgeHtml(patternLabel, patternValue, colorLabel, colorValue) {
  const premium = isPremiumColorLabel(colorValue);
  return '<span class="preview-badge-title">' + escapeHtml(patternLabel) + ': ' + escapeHtml(patternValue) + '</span>' +
    '<span class="preview-color-line">' + escapeHtml(colorLabel) + ': <strong>' + escapeHtml(colorValue) + '</strong>' +
    (premium ? ' <em class="premium-mini-badge">Premium</em>' : '') + '</span>';
}

function updateColorModeControls() {
  els.faceColorLabelText.textContent = "Face color";
  els.wallColorLabelText.textContent = "Wall color";
  const distinct = hasDistinctDualColors();
  els.colorModeNote.textContent = distinct ?
    "Face and wall colors are different, so the two-tone fee is included automatically." :
    "Choose matching colors for a single-color cover, or choose different face and wall colors for a two-tone cover.";
  els.colorModeNote.classList.toggle("is-active", distinct);
}



function readSidePatternControls() {
  const selectedCount = Array.from(els.sideShapeCount || []).find(function(input) { return input.checked; });
  state.sideShapeCount = clamp(Math.round(Number(selectedCount ? selectedCount.value : 5)), 1, 5);
  if (![1, 3, 5].includes(state.sideShapeCount)) state.sideShapeCount = 5;

  // Do not clamp/write back while the user is actively typing. This prevents
  // entering values like 11 from immediately snapping to 10 after the first "1".
  const sizeInputFocused = els.sideShapeSize && document.activeElement === els.sideShapeSize;
  const rawSize = els.sideShapeSize ? String(els.sideShapeSize.value || "").trim() : "30";
  const parsedSize = Number(rawSize);
  if (Number.isFinite(parsedSize) && parsedSize >= 10 && parsedSize <= 40) {
    state.sideShapeSizeMm = parsedSize;
  } else if (!sizeInputFocused) {
    state.sideShapeSizeMm = clamp(Number.isFinite(parsedSize) ? parsedSize : 30, 10, 40);
    if (els.sideShapeSize) els.sideShapeSize.value = toFixedSmart(state.sideShapeSizeMm, 2);
  }

  const gapInputFocused = els.sideShapeSpacing && document.activeElement === els.sideShapeSpacing;
  const rawGap = els.sideShapeSpacing ? String(els.sideShapeSpacing.value || "").trim() : "10";
  const parsedGap = Number(rawGap);
  if (Number.isFinite(parsedGap) && parsedGap >= 0 && parsedGap <= 160) {
    state.sideShapeSpacingMm = parsedGap;
  } else if (!gapInputFocused) {
    state.sideShapeSpacingMm = clamp(Number.isFinite(parsedGap) ? parsedGap : 10, 0, 160);
    if (els.sideShapeSpacing) els.sideShapeSpacing.value = toFixedSmart(state.sideShapeSpacingMm, 2);
  }

  const metrics = getSidePatternShapeMetrics();
  state.sideShapeHeightMm = metrics ? metrics.heightMm : state.sideShapeSizeMm;
  autoFitSideShapeCount();
  const active = state.sidePattern !== "Blank";
  if (els.sidePatternControls) els.sidePatternControls.classList.toggle("is-disabled", !active);
  [els.sideShapeSize, els.sideShapeSpacing].concat(Array.from(els.sideShapeCount || [])).forEach(function(input) {
    if (input) input.disabled = !active;
  });
}

function getSideLayoutIssue(countOverride) {
  if (!state.sidePattern || state.sidePattern === "Blank") return "";
  const marginMm = 5;
  const metrics = getSidePatternShapeMetrics();
  const shapeWidth = metrics ? metrics.widthMm : state.sideShapeSizeMm;
  const shapeHeight = metrics ? metrics.heightMm : state.sideShapeHeightMm;
  const count = countOverride || state.sideShapeCount || 1;
  const gapMm = Math.max(0, Number(state.sideShapeSpacingMm) || 0);
  const totalHeight = (shapeHeight * count) + Math.max(0, count - 1) * gapMm;
  if (shapeWidth > Math.max(0, state.depthMm - marginMm * 2)) {
    return "Side cutout must stay at least 5 mm from the front/back edge. Reduce shape size or increase cover depth.";
  }
  if (count > 1 && gapMm < 10) {
    return "Side cutouts need at least 10 mm of open space between each pattern. Increase the spacing between cutouts.";
  }
  if (totalHeight > Math.max(0, state.heightMm - marginMm * 2)) {
    return "Side cutouts must stay at least 5 mm from the top/bottom edge. Reduce size, spacing, or number of cutouts.";
  }
  return "";
}

function setSideShapeCount(count) {
  state.sideShapeCount = count;
  Array.from(els.sideShapeCount || []).forEach(function(input) {
    input.checked = Number(input.value) === count;
  });
}

function autoFitSideShapeCount() {
  if (!state.sidePattern || state.sidePattern === "Blank") return;
  const preferred = state.sideShapeCount || 5;
  const options = [5, 3, 1].filter(function(count) { return count <= preferred; });
  for (const count of options) {
    if (!getSideLayoutIssue(count)) {
      if (count !== state.sideShapeCount) setSideShapeCount(count);
      return;
    }
  }
}

function validateSidePatternLayout(showAlert) {
  const message = getSideLayoutIssue();
  if (els.sidePatternError) els.sidePatternError.textContent = message;
  if (message && showAlert) alert(message);
  return !message;
}

function applyColorSelection(target, select, customRow, customInput) {
  if (!select) return;
  let selected = COLOR_OPTIONS.find(function(color) { return color && color.value === select.value; });
  if (!selected) {
    selected = COLOR_OPTIONS.find(function(color) { return color && color.value !== "custom"; }) || DEFAULT_COLOR;
    if (selected && selected.value !== undefined) select.value = selected.value;
  }
  const isCustom = selected && selected.value === "custom";
  if (customRow) customRow.hidden = !isCustom;
  const customValue = customInput && customInput.value ? customInput.value : "#e9e7df";
  const colorValue = isCustom ? customValue : (selected.value || "#e0deda");
  const renderValue = isCustom ? customValue : (selected.renderValue || selected.value || "#e0deda");
  const colorLabel = isCustom ? "Custom (" + colorValue.toUpperCase() + ")" : (selected.label || "Color");
  if (target === "face") {
    state.faceColor = renderValue;
    state.faceColorLabel = colorLabel;
    state.faceRoughness = selected && selected.roughness !== undefined ? selected.roughness : 0.56;
    state.faceMetalness = selected && selected.metalness !== undefined ? selected.metalness : 0;
  } else {
    state.wallColor = renderValue;
    state.wallColorLabel = colorLabel;
    state.wallRoughness = selected && selected.roughness !== undefined ? selected.roughness : 0.56;
    state.wallMetalness = selected && selected.metalness !== undefined ? selected.metalness : 0;
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function calculateSizePrice(volume) {
  return PRICE_BASE + PRICE_MULTIPLIER * Math.pow(volume, PRICE_EXPONENT);
}

function calculateDualColorAddon(volume) {
  const normalizedVolume = clamp((volume - DUAL_COLOR_MIN_VOLUME) / (DUAL_COLOR_MAX_VOLUME - DUAL_COLOR_MIN_VOLUME), 0, 1);
  return DUAL_COLOR_MIN_ADDON + (DUAL_COLOR_MAX_ADDON - DUAL_COLOR_MIN_ADDON) * Math.pow(normalizedVolume, PRICE_EXPONENT);
}

function calculateChimeCoverPrice(options) {
  const volume = options.width * options.height * options.depth;
  const sizePrice = calculateSizePrice(volume);
  const dualColorAddon = options.isDualColor ? calculateDualColorAddon(volume) : 0;
  const oversizeAddon = options.isOversized ? OVERSIZE_FEE_ADDON : 0;
  const oversizedShippingAddon = options.isOversized ? OVERSIZE_SHIPPING_ADDON : 0;
  const totalPrice = sizePrice + dualColorAddon + options.premiumColorAddon + oversizeAddon + oversizedShippingAddon;
  return { volume, sizePrice, dualColorAddon, premiumColorAddon: options.premiumColorAddon, oversizeAddon, oversizedShippingAddon, totalPrice };
}

function updatePricing() {
  const width = state.widthMm / IN_TO_MM;
  const height = state.heightMm / IN_TO_MM;
  const depth = state.depthMm / IN_TO_MM;
  if (![width, height, depth].every(function(number) { return Number.isFinite(number) && number > 0; })) {
    state.priceBreakdown = null;
    els.priceTotal.textContent = "--";
    els.priceMessage.textContent = "Enter valid dimensions to calculate price.";
    els.priceBreakdown.innerHTML = "";
    return;
  }
  const breakdown = calculateChimeCoverPrice({
    width: width,
    height: height,
    depth: depth,
    isDualColor: hasDistinctDualColors(),
    premiumColorAddon: getPremiumColorAddon(),
    isOversized: isOversizedDimensions(width, height, depth)
  });
  state.priceBreakdown = breakdown;
  els.priceTotal.textContent = formatMoney(breakdown.totalPrice);
  els.priceMessage.textContent = PRICE_CARD_MESSAGE;
  const rows = [
    [PRICE_LABELS.volume, toFixedSmart(breakdown.volume, 2) + " cu in"],
    [PRICE_LABELS.size, formatMoney(breakdown.sizePrice)]
  ];
  if (breakdown.dualColorAddon > 0) rows.push([PRICE_LABELS.dualColor, formatMoney(breakdown.dualColorAddon)]);
  if (breakdown.premiumColorAddon > 0) rows.push([PRICE_LABELS.premiumColor, formatMoney(breakdown.premiumColorAddon)]);
  if (breakdown.oversizeAddon > 0) rows.push([PRICE_LABELS.oversize, formatMoney(breakdown.oversizeAddon)]);
  if (breakdown.oversizedShippingAddon > 0) rows.push(["Shipping add-on", formatMoney(breakdown.oversizedShippingAddon)]);
  els.priceBreakdown.innerHTML = rows.map(function(row) { return "<div><span>" + row[0] + "</span><strong>" + row[1] + "</strong></div>"; }).join("");
}

function isOversizedDimensions(width, height, depth) {
  return [width, height, depth].some(function(value) { return value >= OVERSIZE_THRESHOLD_IN; });
}

function getPremiumColorAddon() {
  const facePremium = isPremiumColorLabel(state.faceColorLabel);
  const wallPremium = isPremiumColorLabel(state.wallColorLabel);
  if (!hasDistinctDualColors()) return facePremium ? PREMIUM_COLOR_ADDON : 0;
  return Math.min(PREMIUM_COLOR_ADDON, (facePremium ? PREMIUM_COLOR_ADDON / 2 : 0) + (wallPremium ? PREMIUM_COLOR_ADDON / 2 : 0));
}

function hasDistinctDualColors() {
  return state.faceColorLabel !== state.wallColorLabel;
}

function isPremiumColorLabel(label) {
  return PREMIUM_COLOR_LABELS.includes(label);
}

function formatMoney(value) {
  return "$" + value.toFixed(2);
}

function readDimensions() {
  const values = [Number(els.widthMm.value), Number(els.heightMm.value), Number(els.depthMm.value)];
  updateDimensionThresholdIndicators();
  const positiveValid = values.every(function(number) { return Number.isFinite(number) && number > 0; });
  if (positiveValid) updateOversizeWarning(values);
  else updateOversizeWarning([]);
  const overLimit = values.some(function(number) { return Number.isFinite(number) && number / IN_TO_MM > MAX_DIMENSION_IN; });
  const valid = positiveValid && !overLimit;
  els.dimensionError.textContent = positiveValid ? (overLimit ? "Maximum allowable dimension is 16 in / 406.4 mm. Please reduce the highlighted dimension." : "") : "Please enter positive numbers for width, height, and depth.";
  if (!valid) {
    state.priceBreakdown = null;
    if (els.priceTotal) els.priceTotal.textContent = "--";
    if (els.priceMessage) els.priceMessage.textContent = overLimit ? "Reduce dimensions to 16 in or less to calculate price." : "Enter positive width, height, and depth to calculate price.";
    if (els.priceBreakdown) els.priceBreakdown.innerHTML = "";
    updateFitCheck();
  }
  if (!valid) return false;
  state.widthMm = values[0]; state.heightMm = values[1]; state.depthMm = values[2]; updateOversizeWarning(); return true;
}

function updateDimensionThresholdIndicators() {
  [
    { input: els.heightIn, inches: Number(els.heightMm.value) / IN_TO_MM },
    { input: els.widthIn, inches: Number(els.widthMm.value) / IN_TO_MM },
    { input: els.depthIn, inches: Number(els.depthMm.value) / IN_TO_MM }
  ].forEach(function(item) {
    const label = item.input.closest("label");
    const overLimit = Number.isFinite(item.inches) && item.inches > MAX_DIMENSION_IN;
    const oversized = Number.isFinite(item.inches) && item.inches >= OVERSIZE_THRESHOLD_IN;
    label.classList.toggle("is-oversize", oversized);
    label.classList.toggle("is-over-limit", overLimit);
    item.input.setAttribute("aria-invalid", overLimit ? "true" : "false");
  });
}

function formatTemplate(template, values) {
  return String(template || "").replace(/\{(threshold|fee|shipping|max)\}/g, function(match, key) { return values[key] !== undefined ? values[key] : match; });
}

function updateOversizeWarning(values) {
  const source = values || [state.widthMm, state.heightMm, state.depthMm];
  const dims = [
    ["height", source[1] / IN_TO_MM],
    ["width", source[0] / IN_TO_MM],
    ["depth", source[2] / IN_TO_MM]
  ];
  const oversized = dims.filter(function(item) { return item[1] >= OVERSIZE_THRESHOLD_IN; });
  if (!oversized.length) {
    els.oversizeWarning.hidden = true;
    els.oversizeWarning.textContent = "";
    return;
  }
  const overLimit = oversized.some(function(item) { return item[1] > MAX_DIMENSION_IN; });
  els.oversizeWarning.hidden = false;
  els.oversizeWarning.textContent = "Oversized cover notice: " + oversized.map(function(item) { return item[0] + " is " + toFixedSmart(item[1], 2) + " in"; }).join(", ") + ". " + (overLimit ? "Dimensions over " + MAX_DIMENSION_IN + " in are above the maximum for this designer." : formatTemplate(OVERSIZE_WARNING_TEMPLATE, { threshold: OVERSIZE_THRESHOLD_IN, fee: OVERSIZE_FEE_ADDON, shipping: OVERSIZE_SHIPPING_ADDON, max: MAX_DIMENSION_IN }));
}

function readBellDimensions() {
  const enabled = !!(els.bellCutoutEnabled && els.bellCutoutEnabled.checked);
  const count = getSelectedBellCount();
  const spacing = count === 1 ? 0 : Number(els.bellSpacingMm.value || 0);
  const diameterRaw = String(els.bellDepthMm.value || "").trim();
  const projectionRaw = String(els.bellProjectionMm.value || "").trim();
  const diameter = Number(diameterRaw || 0);
  const projection = Number(projectionRaw || 0);
  const clearance = BELL_CLEARANCE_MM;
  const hasDiameter = diameterRaw !== "" && Number.isFinite(diameter) && diameter > 0;
  const hasProjection = projectionRaw !== "" && Number.isFinite(projection) && projection > 0;
  state.bellCutoutEnabled = enabled;
  state.bellCount = count;
  state.bellSpacingMm = Number.isFinite(spacing) && spacing > 0 ? spacing : 0;
  state.bellDepthMm = hasDiameter ? diameter : 0;
  state.bellProjectionMm = hasProjection ? projection : 0;
  state.bellCutoutWidthMm = 0;
  state.bellCutoutDepthMm = 0;
  state.bellCutoutsMm = [];
  els.bellError.textContent = "";
  els.bellMergeNotice.hidden = true;
  els.bellMergeNotice.textContent = "";

  if (!enabled) {
    els.bellCutoutReadout.textContent = "No bell cutout";
    return true;
  }
  if (!hasDiameter) {
    els.bellError.textContent = BELL_VALIDATION_TEXT;
    els.bellCutoutReadout.textContent = "Incomplete bell measurements";
    return false;
  }
  if (!hasProjection) {
    els.bellError.textContent = BELL_VALIDATION_TEXT;
    els.bellCutoutReadout.textContent = "Incomplete bell measurements";
    return false;
  }
  if (state.bellProjectionMm < state.bellDepthMm) {
    const unit = els.bellUnit.value === "mm" ? "mm" : "in";
    const minValue = unit === "mm" ? state.bellDepthMm : state.bellDepthMm / IN_TO_MM;
    els.bellError.textContent = BELL_VALIDATION_TEXT + " Minimum: " + toFixedSmart(minValue, unit === "mm" ? 1 : 3) + " " + unit + ".";
    els.bellCutoutReadout.textContent = "Bell face measurement too small";
    return false;
  }
  const singleCutoutWidth = state.bellDepthMm + clearance * 2;
  const requiredCutoutWidth = singleCutoutWidth + (state.bellCount - 1) * (state.bellDepthMm + state.bellSpacingMm);
  // Bell diameter controls cutout width. Bell face from wall controls how far the
  // bottom cutout must extend into the cover. Add a 4 mm front buffer because the
  // wall side is open against the customer's wall.
  const requiredCutoutDepth = state.bellProjectionMm + clearance;
  const requiredCoverWidth = requiredCutoutWidth + WALL_MM * 4;
  if (state.widthMm < requiredCoverWidth) {
    const minWidthIn = toFixedSmart(requiredCoverWidth / IN_TO_MM, 3);
    els.bellError.textContent = "Overall cover width must be at least " + minWidthIn + " in / " + toFixedSmart(requiredCoverWidth, 1) + " mm to fit " + state.bellCount + " bell cutout" + (state.bellCount === 1 ? "" : "s") + " with 4 mm clearance.";
    els.bellCutoutReadout.textContent = "Width clearance needed";
    return false;
  }
  if (state.depthMm < requiredCutoutDepth) {
    const minDepthIn = toFixedSmart(requiredCutoutDepth / IN_TO_MM, 3);
    els.bellError.textContent = "Overall cover depth must be at least " + minDepthIn + " in / " + toFixedSmart(requiredCutoutDepth, 1) + " mm so the bell face from wall has a 4 mm front buffer.";
    els.bellCutoutReadout.textContent = "Depth clearance needed";
    return false;
  }
  state.bellCutoutWidthMm = requiredCutoutWidth;
  state.bellCutoutDepthMm = requiredCutoutDepth;
  state.bellCutoutsMm = buildBellCutouts(state.bellCount, state.bellDepthMm, state.bellSpacingMm, singleCutoutWidth);
  const merged = state.bellCount > 1 && state.bellCutoutsMm.length === 1;
  if (merged) {
    const wallBetween = Math.max(0, state.bellSpacingMm - clearance * 2);
    els.bellMergeNotice.hidden = false;
    els.bellMergeNotice.textContent = "Spacing leaves only " + toFixedSmart(wallBetween, 1) + " mm of wall between cutouts. Because the minimum is 14 mm, the preview combines them into one wider cutout.";
  }
  els.bellCutoutReadout.textContent = merged ?
    "Combined cutout: " + toFixedSmart(state.bellCutoutWidthMm / IN_TO_MM, 3) + " in W x " + toFixedSmart(state.bellCutoutDepthMm / IN_TO_MM, 3) + " in D; wall between bells would be under 14 mm." :
    state.bellCount + " cutout" + (state.bellCount === 1 ? "" : "s") + ": " + toFixedSmart(singleCutoutWidth / IN_TO_MM, 3) + " in W each x " + toFixedSmart(state.bellCutoutDepthMm / IN_TO_MM, 3) + " in D";
  return true;
}

function buildBellCutouts(count, diameter, spacing, cutoutWidth) {
  const webBetweenCutouts = spacing - BELL_CLEARANCE_MM * 2;
  if (count > 1 && webBetweenCutouts < MIN_BELL_WEB_MM) {
    return [{ centerMm: 0, widthMm: cutoutWidth + (count - 1) * (diameter + spacing), merged: true }];
  }
  const centerSpacing = diameter + spacing;
  const centerOffset = (count - 1) / 2;
  const cutouts = [];
  for (let i = 0; i < count; i++) {
    cutouts.push({ centerMm: (i - centerOffset) * centerSpacing, widthMm: cutoutWidth });
  }
  return cutouts;
}

function buildCover() {
  clearGroup(coverGroup); clearGroup(labelGroup);
  const w = state.widthMm * MODEL_SCALE, h = state.heightMm * MODEL_SCALE, d = state.depthMm * MODEL_SCALE;
  const wall = WALL_MM * MODEL_SCALE;
  const radius = CORNER_FILLET_MM * MODEL_SCALE;
  const faceInset = FACE_INSET_MM * MODEL_SCALE;
  const chamferDepth = CHAMFER_DEPTH_MM * MODEL_SCALE;
  const faceW = Math.max(w - faceInset * 2, wall * 5);
  const faceH = Math.max(h - faceInset * 2, wall * 5);
  const faceRadius = Math.max(radius - faceInset, wall * 0.4);
  const frontZ = d / 2;
  const chamferBackZ = frontZ - chamferDepth;
  const backZ = -d / 2;
  const wallDepth = Math.max(chamferBackZ - backZ, wall);

  const wallMaterial = createPreviewMaterial(state.wallColor, state.wallMetalness ?? 0, state.wallRoughness ?? 0.56);
  const faceMaterial = shouldShareFaceWallMaterial() ? wallMaterial : createPreviewMaterial(state.faceColor, state.faceMetalness ?? 0, state.faceRoughness ?? 0.56);
  const edgeMaterial = null;

  if (hasBellCutout()) {
    const cutouts = state.bellCutoutsMm.map(function(cutout) {
      return { center: cutout.centerMm * MODEL_SCALE, width: Math.min(cutout.widthMm * MODEL_SCALE, w - wall * 4) };
    });
    if (hasPatternedSides()) {
      createDiamondSideShellGeometries(w, h, wall, wallDepth, backZ, false).forEach(function(geometry) {
        addMeshWithEdges(geometry, wallMaterial, edgeMaterial);
      });
    } else {
      const shellShape = bottomGapShellShape(w, h, radius, wall, Math.max(w - wall * 4, wall));
      const shellGeometry = new THREE.ExtrudeGeometry(shellShape, { depth: wallDepth, bevelEnabled: false, curveSegments: 28 });
      shellGeometry.translate(0, 0, backZ);
      addMeshWithEdges(shellGeometry, wallMaterial, edgeMaterial);
    }
    createBottomWallSegmentGeometries(w, h, wall, wallDepth, backZ, cutouts).forEach(function(geometry) {
      addMeshWithEdges(geometry, wallMaterial, edgeMaterial);
    });
    cutouts.forEach(function(cutout) {
      addMeshWithEdges(createBellCutoutFrontBridgeGeometry(w, h, wall, wallDepth, backZ, cutout.width, cutout.center), wallMaterial, edgeMaterial);
    });
  } else if (hasPatternedSides()) {
    createDiamondSideShellGeometries(w, h, wall, wallDepth, backZ, true).forEach(function(geometry) {
      addMeshWithEdges(geometry, wallMaterial, edgeMaterial);
    });
  } else {
    // One continuous rounded hollow shell gives every vertical wall corner the same 3 mm fillet,
    // regardless of whether side diamonds are selected.
    const shellShape = roundedRectShape(w, h, radius);
    shellShape.holes.push(roundedRectShape(Math.max(w - wall * 2, wall), Math.max(h - wall * 2, wall), Math.max(radius - wall, wall * 0.35)));
    const shellGeometry = new THREE.ExtrudeGeometry(shellShape, { depth: wallDepth, bevelEnabled: false, curveSegments: 28 });
    shellGeometry.translate(0, 0, backZ);
    addMeshWithEdges(shellGeometry, wallMaterial, edgeMaterial);
  }

  const chamferGeometry = createPerimeterChamferGeometry(w, h, radius, faceW, faceH, faceRadius, chamferBackZ, frontZ);
  addMeshWithEdges(chamferGeometry, faceMaterial, edgeMaterial);

  const faceShape = roundedRectShape(faceW, faceH, faceRadius);
  addPatternHoles(faceShape, state.frontPattern, faceW, faceH);
  const faceGeometry = new THREE.ExtrudeGeometry(faceShape, { depth: wall, bevelEnabled: false, curveSegments: 18 });
  faceGeometry.translate(0, 0, frontZ - wall);
  addMeshWithEdges(faceGeometry, faceMaterial, edgeMaterial);
  if (state.showDimensions) drawDimensionGuides(w, h, d);
  frameCamera(w, h, d);
}

function hasBellCutout() {
  return state.bellCutoutWidthMm > 0 && state.bellCutoutDepthMm > 0 && state.bellCutoutsMm.length > 0;
}

function hasPatternedSides() {
  return getSidePatternSvgData() !== null;
}

function createBottomWallSegmentGeometries(width, height, wall, wallDepth, backZ, cutouts) {
  // When the bell cutout is enabled, the remaining bottom-wall pieces are
  // rectangular boxes. If they run all the way to the 2 mm wall offset, they
  // can poke past the 3 mm rounded outside corner and show as a tiny square lip.
  // Start/end them at the corner fillet tangent instead, so they meet the
  // rounded corner cleanly without protruding.
  const cornerPullback = Math.max(wall, CORNER_FILLET_MM * MODEL_SCALE);
  const start = -width / 2 + cornerPullback;
  const end = width / 2 - cornerPullback;
  const gaps = cutouts.map(function(cutout) {
    return { left: cutout.center - cutout.width / 2, right: cutout.center + cutout.width / 2 };
  }).sort(function(a, b) { return a.left - b.left; });
  const segments = [];
  let cursor = start;
  gaps.forEach(function(gap) {
    const left = clamp(gap.left, start, end);
    if (left - cursor > wall * 0.5) segments.push(createBottomWallSegmentGeometry(cursor, left, height, wall, wallDepth, backZ));
    cursor = Math.max(cursor, clamp(gap.right, start, end));
  });
  if (end - cursor > wall * 0.5) segments.push(createBottomWallSegmentGeometry(cursor, end, height, wall, wallDepth, backZ));
  return segments;
}

function createBottomWallSegmentGeometry(x1, x2, height, wall, wallDepth, backZ) {
  const geometry = new THREE.BoxGeometry(Math.max(x2 - x1, wall), wall, wallDepth);
  geometry.translate((x1 + x2) / 2, -height / 2 + wall / 2, backZ + wallDepth / 2);
  return geometry;
}

function bottomGapShellShape(width, height, radius, wall, cutoutWidth) {
  const r = Math.min(radius, width / 2, height / 2);
  const innerR = Math.max(r - wall, wall * 0.35);
  const hw = width / 2;
  const hh = height / 2;
  const ix = Math.max(hw - wall, wall);
  const iy = Math.max(hh - wall, wall);
  const gap = Math.min(cutoutWidth / 2, ix - wall * 0.5);
  const shape = new THREE.Shape();
  shape.moveTo(-hw + r, -hh);
  shape.lineTo(-gap, -hh);
  shape.lineTo(-gap, -iy);
  shape.lineTo(-ix, -iy);
  shape.lineTo(-ix, iy - innerR);
  shape.quadraticCurveTo(-ix, iy, -ix + innerR, iy);
  shape.lineTo(ix - innerR, iy);
  shape.quadraticCurveTo(ix, iy, ix, iy - innerR);
  shape.lineTo(ix, -iy);
  shape.lineTo(gap, -iy);
  shape.lineTo(gap, -hh);
  shape.lineTo(hw - r, -hh);
  shape.quadraticCurveTo(hw, -hh, hw, -hh + r);
  shape.lineTo(hw, hh - r);
  shape.quadraticCurveTo(hw, hh, hw - r, hh);
  shape.lineTo(-hw + r, hh);
  shape.quadraticCurveTo(-hw, hh, -hw, hh - r);
  shape.lineTo(-hw, hh - r);
  shape.lineTo(-hw, -hh + r);
  shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
  return shape;
}

function createBellCutoutFrontBridgeGeometry(width, height, wall, wallDepth, backZ, cutW, centerX) {
  const cutD = Math.min(state.bellCutoutDepthMm * MODEL_SCALE, wallDepth - wall * 0.5);
  const bellRadius = Math.max((state.bellDepthMm * MODEL_SCALE) / 2, wall * 1.5);
  const clearanceRadius = BELL_CLEARANCE_MM * MODEL_SCALE;
  const radius = Math.min(cutW / 2 - wall * 0.3, cutD, bellRadius + clearanceRadius);
  const shape = bellCutoutBridgeShape(cutW, wallDepth, cutD, radius);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: wall, bevelEnabled: false, curveSegments: 24 });
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const zOffset = positions.getY(i);
    const yOffset = positions.getZ(i);
    positions.setXYZ(i, x + centerX, -height / 2 + yOffset, backZ + zOffset);
  }
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function bellCutoutBridgeShape(cutW, depth, cutD, radius) {
  const cx = cutW / 2;
  const r = Math.min(radius, cx, cutD);
  const shape = new THREE.Shape();
  shape.moveTo(-cx, cutD - r);
  shape.quadraticCurveTo(-cx, cutD, -cx + r, cutD);
  shape.lineTo(cx - r, cutD);
  shape.quadraticCurveTo(cx, cutD, cx, cutD - r);
  shape.lineTo(cx, depth);
  shape.lineTo(-cx, depth);
  shape.lineTo(-cx, cutD - r);
  return shape;
}

function createDiamondSideShellGeometries(width, height, wall, wallDepth, backZ, includeBottom) {
  const geometries = [];
  const centerZ = backZ + wallDepth / 2;
  const radius = CORNER_FILLET_MM * MODEL_SCALE;
  const flatWidth = Math.max(width - radius * 2, wall);
  const flatHeight = Math.max(height - radius * 2, wall);

  const top = new THREE.BoxGeometry(flatWidth, wall, wallDepth);
  top.translate(0, height / 2 - wall / 2, centerZ);
  geometries.push(top);

  if (includeBottom !== false) {
    const bottom = new THREE.BoxGeometry(flatWidth, wall, wallDepth);
    bottom.translate(0, -height / 2 + wall / 2, centerZ);
    geometries.push(bottom);
  }

  geometries.push(createDiamondSideWallGeometry(width, flatHeight, wall, wallDepth, backZ, -1));
  geometries.push(createDiamondSideWallGeometry(width, flatHeight, wall, wallDepth, backZ, 1));
  geometries.push(createCornerFilletColumnGeometry(width, height, radius, wall, wallDepth, backZ, -1, -1));
  geometries.push(createCornerFilletColumnGeometry(width, height, radius, wall, wallDepth, backZ, -1, 1));
  geometries.push(createCornerFilletColumnGeometry(width, height, radius, wall, wallDepth, backZ, 1, -1));
  geometries.push(createCornerFilletColumnGeometry(width, height, radius, wall, wallDepth, backZ, 1, 1));
  return geometries;
}

function createCornerFilletColumnGeometry(width, height, radius, wall, wallDepth, backZ, sideX, sideY) {
  const outerR = Math.min(radius, width / 2, height / 2);
  const innerR = Math.max(outerR - wall, wall * 0.35);
  const cx = sideX * (width / 2 - outerR);
  const cy = sideY * (height / 2 - outerR);
  const start = sideX > 0 && sideY > 0 ? 0 :
    sideX < 0 && sideY > 0 ? Math.PI / 2 :
    sideX < 0 && sideY < 0 ? Math.PI :
    Math.PI * 1.5;
  const end = start + Math.PI / 2;
  const shape = new THREE.Shape();
  for (let i = 0; i <= 12; i++) {
    const a = start + (end - start) * (i / 12);
    const x = cx + Math.cos(a) * outerR;
    const y = cy + Math.sin(a) * outerR;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  for (let i = 12; i >= 0; i--) {
    const a = start + (end - start) * (i / 12);
    shape.lineTo(cx + Math.cos(a) * innerR, cy + Math.sin(a) * innerR);
  }
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: wallDepth, bevelEnabled: false, curveSegments: 12 });
  geometry.translate(0, 0, backZ);
  return geometry;
}

function createDiamondSideWallGeometry(width, height, wall, wallDepth, backZ, sideSign) {
  const shape = sideWallPatternShape(wallDepth, height, backZ);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: wall, bevelEnabled: false, curveSegments: 12 });
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const zCoord = positions.getX(i);
    const yCoord = positions.getY(i);
    const wallOffset = positions.getZ(i);
    const xCoord = sideSign < 0 ? -width / 2 + wallOffset : width / 2 - wallOffset;
    positions.setXYZ(i, xCoord, yCoord, zCoord);
  }
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function sideWallPatternShape(wallDepth, sideH, backZ) {
  const shape = new THREE.Shape();
  shape.moveTo(backZ, -sideH / 2);
  shape.lineTo(backZ + wallDepth, -sideH / 2);
  shape.lineTo(backZ + wallDepth, sideH / 2);
  shape.lineTo(backZ, sideH / 2);
  shape.lineTo(backZ, -sideH / 2);
  addSidePatternHolesToShape(shape, wallDepth, sideH, backZ);
  return shape;
}

function getSidePatternSvgData() {
  if (state.sidePattern === "Diamonds") return window.SIDE_DIAMONDS_SVG || null;
  if (state.sidePattern === "Squiggles") return window.SIDE_SQUIGGLES_SVG || null;
  if (state.sidePattern === "Footballs") return window.SIDE_FOOTBALLS_SVG || null;
  if (state.sidePattern === "Hex Gems") return window.SIDE_HEX_GEMS_SVG || null;
  const customPattern = CUSTOM_SIDE_PATTERN_DATA.find(function(pattern) { return pattern.name === state.sidePattern; });
  return customPattern || null;
}


function addSidePatternHolesToShape(shape, wallDepth, sideH, backZ) {
  if (getSideLayoutIssue()) return false;
  const data = getSidePatternSvgData();
  if (!data || !Array.isArray(data.paths) || !Array.isArray(data.viewBox)) return false;
  const count = state.sideShapeCount || 5;
  const size = (state.sideShapeSizeMm || 30) * MODEL_SCALE;
  const gap = (state.sideShapeSpacingMm || 10) * MODEL_SCALE;
  const centerZ = backZ + wallDepth * 0.5;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.position = "absolute";
  svg.style.left = "-9999px";
  svg.style.top = "-9999px";
  document.body.appendChild(svg);

  try {
    const pathData = chooseSidePatternSinglePath(data, svg);
    if (!pathData) return false;
    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute("d", pathData);
    svg.appendChild(pathElement);
    const total = pathElement.getTotalLength();
    const box = getSvgPathBox(pathElement, data.viewBox[0], data.viewBox[1], data.viewBox[2], data.viewBox[3]);
    if (!Number.isFinite(total) || total <= 0 || !box) return false;
    const shapeW = Math.max(box.width, 1);
    const shapeH = Math.max(box.height, 1);
    const requestedScale = size / shapeW;
    const maxZHalf = wallDepth * 0.39;
    const finalScale = Math.min(requestedScale, (maxZHalf * 2) / shapeW);
    const centerSpacing = (shapeH * finalScale) + gap;
    const steps = Math.max(18, Math.min(96, Math.ceil(total / 1.8)));
    sideShapeCenters(count, centerSpacing).forEach(function(centerY) {
      const hole = new THREE.Path();
      for (let i = 0; i <= steps; i++) {
        const point = pathElement.getPointAtLength(total * (i / steps));
        const z = centerZ + (point.x - box.centerX) * finalScale;
        const y = centerY + (box.centerY - point.y) * finalScale;
        if (i === 0) hole.moveTo(z, y);
        else hole.lineTo(z, y);
      }
      hole.closePath();
      shape.holes.push(hole);
    });
  } finally {
    svg.remove();
  }
  return true;
}

function chooseSidePatternSinglePath(data, svg) {
  if (!data.paths.length) return null;
  const viewCenterY = data.viewBox[1] + data.viewBox[3] / 2;
  let best = data.paths[0];
  let bestDistance = Infinity;
  data.paths.forEach(function(pathData) {
    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute("d", pathData);
    svg.appendChild(pathElement);
    const box = getSvgPathBox(pathElement, data.viewBox[0], data.viewBox[1], data.viewBox[2], data.viewBox[3]);
    pathElement.remove();
    if (!box) return;
    const distance = Math.abs(box.centerY - viewCenterY);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = pathData;
    }
  });
  return best;
}

function getSvgPathBox(pathElement, fallbackX, fallbackY, fallbackW, fallbackH) {
  try {
    const box = pathElement.getBBox();
    if (box && Number.isFinite(box.width) && Number.isFinite(box.height) && box.width > 0 && box.height > 0) {
      return { x: box.x, y: box.y, width: box.width, height: box.height, centerX: box.x + box.width / 2, centerY: box.y + box.height / 2 };
    }
  } catch (error) {}
  return { x: fallbackX, y: fallbackY, width: fallbackW, height: fallbackH, centerX: fallbackX + fallbackW / 2, centerY: fallbackY + fallbackH / 2 };
}

function getSidePatternShapeMetrics() {
  const data = getSidePatternSvgData();
  if (!data || !Array.isArray(data.paths) || !Array.isArray(data.viewBox)) return null;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.position = "absolute";
  svg.style.left = "-9999px";
  svg.style.top = "-9999px";
  document.body.appendChild(svg);
  try {
    const pathData = chooseSidePatternSinglePath(data, svg);
    if (!pathData) return null;
    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute("d", pathData);
    svg.appendChild(pathElement);
    const box = getSvgPathBox(pathElement, data.viewBox[0], data.viewBox[1], data.viewBox[2], data.viewBox[3]);
    if (!box) return null;
    const widthMm = state.sideShapeSizeMm || 30;
    return { widthMm: widthMm, heightMm: widthMm * (box.height / Math.max(box.width, 1)) };
  } finally {
    svg.remove();
  }
}

function sideShapeCenters(count, spacing) {
  if (count <= 1) return [0];
  const offset = (count - 1) / 2;
  const centers = [];
  for (let i = 0; i < count; i++) centers.push((i - offset) * spacing);
  return centers;
}

function drawDiamondSideCutouts(w, h, d, wallDepth, backZ, wallMaterial) {
  const darkMaterial = new THREE.MeshBasicMaterial({ color: 0x202929, transparent: true, opacity: 1, side: THREE.DoubleSide });
  const sides = [
    { x: -w / 2 - 0.018 },
    { x: w / 2 + 0.018 }
  ];
  sides.forEach(function(side) {
    const group = new THREE.Group();
    group.position.x = side.x;
    if (!addSideDiamondSvgCutouts(group, wallDepth, h, backZ, wallMaterial, darkMaterial)) {
      for (let i = 0; i < 5; i++) {
        const y = -h * 0.3 + i * (h * 0.15);
        const z = backZ + wallDepth * 0.52;
        addSideDiamondVisual(group, z, y, d * 0.11, h * 0.12, darkMaterial);
      }
    }
    coverGroup.add(group);
  });
}

function addSideDiamondSvgCutouts(group, wallDepth, sideH, backZ, wallMaterial, darkMaterial) {
  const data = window.SIDE_DIAMONDS_SVG;
  if (!data || !Array.isArray(data.paths) || !Array.isArray(data.viewBox)) return false;
  const viewX = data.viewBox[0], viewY = data.viewBox[1], viewW = data.viewBox[2], viewH = data.viewBox[3];
  const scale = getPatternScale("side", "Diamonds");
  const usableZ = wallDepth * 0.594 * scale.x;
  const usableY = sideH * 0.616 * scale.y;
  const centerZ = backZ + wallDepth * 0.5;
  const panelShape = new THREE.Shape();
  panelShape.moveTo(backZ, -sideH / 2);
  panelShape.lineTo(backZ + wallDepth, -sideH / 2);
  panelShape.lineTo(backZ + wallDepth, sideH / 2);
  panelShape.lineTo(backZ, sideH / 2);
  panelShape.lineTo(backZ, -sideH / 2);
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.position = "absolute";
  svg.style.left = "-9999px";
  svg.style.top = "-9999px";
  document.body.appendChild(svg);

  try {
    const holeShapes = [];
    data.paths.forEach(function(pathData) {
      const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathElement.setAttribute("d", pathData);
      svg.appendChild(pathElement);
      const total = pathElement.getTotalLength();
      if (!Number.isFinite(total) || total <= 0) return;
      const steps = Math.max(12, Math.min(80, Math.ceil(total / 2.5)));
      const shape = new THREE.Shape();
      for (let i = 0; i <= steps; i++) {
        const point = pathElement.getPointAtLength(total * (i / steps));
        const z = centerZ + ((point.x - viewX) / viewW - 0.5) * usableZ;
        const y = (0.5 - (point.y - viewY) / viewH) * usableY;
        if (i === 0) shape.moveTo(z, y);
        else shape.lineTo(z, y);
      }
      shape.closePath();
      panelShape.holes.push(shape);
      holeShapes.push(shape);
    });

    const panel = new THREE.Mesh(new THREE.ShapeGeometry(panelShape), wallMaterial);
    panel.rotation.y = Math.PI / 2;
    panel.position.z = 0.014;
    group.add(panel);

    holeShapes.forEach(function(shape) {
      const cut = new THREE.Mesh(new THREE.ShapeGeometry(shape), darkMaterial);
      cut.rotation.y = Math.PI / 2;
      cut.position.z = 0.02;
      group.add(cut);
    });
  } finally {
    svg.remove();
  }
  return true;
}

function addSideDiamondVisual(group, x, y, width, height, darkMaterial) {
  const cut = new THREE.Mesh(new THREE.ShapeGeometry(diamondShape(width, height)), darkMaterial);
  cut.position.set(x, y, 0.012);
  group.add(cut);
}


function roundedRectShape(width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2), x = -width / 2, y = -height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + r, y); shape.lineTo(x + width - r, y); shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r); shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height); shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r); shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}


function roundedRectPoints(width, height, radius, segments) {
  const r = Math.min(radius, width / 2, height / 2);
  const hw = width / 2, hh = height / 2;
  const centers = [[hw - r, hh - r], [-hw + r, hh - r], [-hw + r, -hh + r], [hw - r, -hh + r]];
  const ranges = [[0, Math.PI / 2], [Math.PI / 2, Math.PI], [Math.PI, Math.PI * 1.5], [Math.PI * 1.5, Math.PI * 2]];
  const points = [];
  for (let c = 0; c < centers.length; c++) {
    for (let i = 0; i <= segments; i++) {
      if (c > 0 && i === 0) continue;
      const t = ranges[c][0] + (ranges[c][1] - ranges[c][0]) * (i / segments);
      points.push(new THREE.Vector2(centers[c][0] + Math.cos(t) * r, centers[c][1] + Math.sin(t) * r));
    }
  }
  return points;
}

function createPerimeterChamferGeometry(outerW, outerH, outerR, innerW, innerH, innerR, backZ, frontZ) {
  const outer = roundedRectPoints(outerW, outerH, outerR, 8);
  const inner = roundedRectPoints(innerW, innerH, innerR, 8);
  const vertices = [];
  const indices = [];
  for (let i = 0; i < outer.length; i++) vertices.push(outer[i].x, outer[i].y, backZ);
  for (let i = 0; i < inner.length; i++) vertices.push(inner[i].x, inner[i].y, frontZ);
  const n = Math.min(outer.length, inner.length);
  for (let i = 0; i < n; i++) {
    const next = (i + 1) % n;
    indices.push(i, next, n + next, i, n + next, n + i);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}


function createStraightThroughPerforatedFaceGeometry(frontShape, backShape, frontZ, backZ) {
  // Builds a flat perforated plate with straight-through pattern holes.
  // The front/top face uses the full outer contour. The back/inside face can use
  // a slightly inset contour, which leaves room for a separate internal chamfer
  // around the underside face/wall transition without chamfering the pattern holes.
  const frontData = frontShape.extractPoints(18);
  const backData = backShape.extractPoints(18);
  const frontContour = dedupeClosedVector2Loop(frontData.shape);
  const backContour = dedupeClosedVector2Loop(backData.shape);
  const frontHoles = (frontData.holes || []).map(dedupeClosedVector2Loop).filter(function(loop) { return loop.length >= 3; });
  const backHoles = (backData.holes || []).map(dedupeClosedVector2Loop).filter(function(loop) { return loop.length >= 3; });
  const frontAll2 = frontContour.concat.apply(frontContour.slice(), frontHoles);
  const backAll2 = backContour.concat.apply(backContour.slice(), backHoles);
  const frontTri2 = THREE.ShapeUtils.triangulateShape(frontContour, frontHoles);
  const backTri2 = THREE.ShapeUtils.triangulateShape(backContour, backHoles);
  const vertices = [];
  const indices = [];

  function addVertex(p, z) {
    const idx = vertices.length / 3;
    vertices.push(p.x, p.y, z);
    return idx;
  }

  const frontOffset = 0;
  frontAll2.forEach(function(p) { addVertex(p, frontZ); });
  const backOffset = vertices.length / 3;
  backAll2.forEach(function(p) { addVertex(p, backZ); });

  // Front visible face with pattern holes.
  frontTri2.forEach(function(t) {
    indices.push(frontOffset + t[0], frontOffset + t[1], frontOffset + t[2]);
  });
  // Back/inside face, reversed so normals point into the hollow interior.
  backTri2.forEach(function(t) {
    indices.push(backOffset + t[2], backOffset + t[1], backOffset + t[0]);
  });

  // Vertical straight-through walls for every pattern hole. The hole loops should
  // match because both shapes receive the same pattern data. If a later pattern
  // creates mismatched loops, use the common count rather than crashing export.
  let frontCursor = frontContour.length;
  let backCursor = backContour.length;
  const holeCount = Math.min(frontHoles.length, backHoles.length);
  for (let h = 0; h < holeCount; h++) {
    const frontLoop = frontHoles[h];
    const backLoop = backHoles[h];
    const count = Math.min(frontLoop.length, backLoop.length);
    addLoopSideWallsVariable(indices, frontOffset + frontCursor, backOffset + backCursor, count, true);
    frontCursor += frontLoop.length;
    backCursor += backLoop.length;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createInternalFaceWallChamferGeometry(outerW, outerH, outerR, innerW, innerH, innerR, wallZ, faceBackZ) {
  // Creates the 1 mm inside chamfer at the internal face/wall corner.
  // lower outer loop: inside wall top edge, 1 mm below underside face
  // upper inner loop: underside face edge, inset 1 mm toward the center
  const outer = roundedRectPoints(outerW, outerH, outerR, 8);
  const inner = roundedRectPoints(innerW, innerH, innerR, 8);
  const vertices = [];
  const indices = [];
  for (let i = 0; i < outer.length; i++) vertices.push(outer[i].x, outer[i].y, wallZ);
  for (let i = 0; i < inner.length; i++) vertices.push(inner[i].x, inner[i].y, faceBackZ);
  const n = Math.min(outer.length, inner.length);
  for (let i = 0; i < n; i++) {
    const next = (i + 1) % n;
    // Reverse winding from the outside chamfer so normals face into the open cavity.
    indices.push(i, n + next, next, i, n + i, n + next);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function dedupeClosedVector2Loop(points) {
  const out = [];
  (points || []).forEach(function(p) {
    if (!p) return;
    const last = out[out.length - 1];
    if (!last || Math.abs(last.x - p.x) > 1e-6 || Math.abs(last.y - p.y) > 1e-6) {
      out.push(new THREE.Vector2(p.x, p.y));
    }
  });
  if (out.length > 1) {
    const first = out[0], last = out[out.length - 1];
    if (Math.abs(first.x - last.x) < 1e-6 && Math.abs(first.y - last.y) < 1e-6) out.pop();
  }
  return out;
}

function addLoopSideWalls(indices, frontStart, backStart, count, reverse) {
  for (let i = 0; i < count; i++) {
    const next = (i + 1) % count;
    const a = frontStart + i;
    const b = frontStart + next;
    const c = backStart + next;
    const d = backStart + i;
    if (reverse) indices.push(a, c, b, a, d, c);
    else indices.push(a, b, c, a, c, d);
  }
}

function addLoopSideWallsVariable(indices, frontStart, backStart, count, reverse) {
  for (let i = 0; i < count; i++) {
    const next = (i + 1) % count;
    const a = frontStart + i;
    const b = frontStart + next;
    const c = backStart + next;
    const d = backStart + i;
    if (reverse) indices.push(a, c, b, a, d, c);
    else indices.push(a, b, c, a, c, d);
  }
}

function addMeshWithEdges(geometry, material, edgeMaterial) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  mesh.userData.exportable = true;
  coverGroup.add(mesh);
  if (edgeMaterial) coverGroup.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 20), edgeMaterial));
}

function shouldShareFaceWallMaterial() {
  return state.faceColor === state.wallColor &&
    state.faceMetalness === state.wallMetalness &&
    state.faceRoughness === state.wallRoughness;
}

function createPreviewMaterial(hex, metalness, roughness) {
  const color = new THREE.Color(hex);
  if (color.convertSRGBToLinear) color.convertSRGBToLinear();
  const isMetal = metalness > 0.2;
  if (isMetal) {
    const material = new THREE.MeshPhongMaterial({
      color: color,
      specular: new THREE.Color(0xffffff),
      shininess: Math.round(230 - Math.min(roughness, 0.8) * 95),
      reflectivity: 1,
      side: THREE.DoubleSide
    });
    material.userData.exportColor = hex;
    return material;
  }
  const material = new THREE.MeshPhongMaterial({
    color: color,
    specular: new THREE.Color(0x737373),
    shininess: Math.round(38 - Math.min(roughness, 0.9) * 18),
    reflectivity: 0.32,
    side: THREE.DoubleSide
  });
  material.userData.exportColor = hex;
  return material;
}


function ensureClockwiseHolePath(path) {
  // Slicers are much less likely to repair/fill perforations when every hole path
  // has a consistent winding direction. Three.js can render mixed winding paths,
  // but slicers may treat those holes as bad/non-manifold after STL/3MF export.
  const points = path.getPoints ? path.getPoints(80) : [];
  if (!points || points.length < 3) return path;
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    area += a.x * b.y - b.x * a.y;
  }
  // In this model the outer face contour is counter-clockwise, so holes should be clockwise.
  // Positive signed area is counter-clockwise, so reverse it.
  const ordered = area > 0 ? points.slice().reverse() : points.slice();
  const fixed = new THREE.Path();
  fixed.moveTo(ordered[0].x, ordered[0].y);
  for (let i = 1; i < ordered.length; i++) fixed.lineTo(ordered[i].x, ordered[i].y);
  fixed.closePath();
  return fixed;
}

function addPatternHoles(faceShape, pattern, w, h) {
  if (pattern === "Blank") return;
  const baseRatio = 6.75 / 4.75;
  const currentRatio = w / h;
  const marginW = 5 * MODEL_SCALE;
  const marginH = 5 * MODEL_SCALE;
  const usableW = Math.max(w - marginW * 2, w * 0.6);
  const usableH = Math.max(h - marginH * 2, h * 0.6);
  const patternScale = getPatternScale("front", pattern);
  const ratioScaleX = Math.max(0.78, Math.min(1.25, currentRatio / baseRatio));
  const ratioScaleY = Math.max(0.82, Math.min(1.18, 1 / Math.sqrt(ratioScaleX)));
  const sx = ratioScaleX * patternScale.x;
  const sy = ratioScaleY * patternScale.y;
  function push(path) { faceShape.holes.push(ensureClockwiseHolePath(path)); }
  function grid(cols, rows, fn) {
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = -usableW / 2 + (c + 0.5 + (r % 2) * 0.2) * usableW / cols;
      const y = -usableH / 2 + (r + 0.5) * usableH / rows;
      fn(x, y, usableW / cols, usableH / rows, r, c);
    }
  }
  if (pattern === "Diamonds") {
    if (!addDiamondsSvgPatternHoles(faceShape, w, h)) grid(7, 5, (x, y, cw, ch) => push(diamondPath(cw * 0.18 * sx, ch * 0.44 * sy, x, y)));
  }
  else if (pattern === "Squares") {
    if (!addSquaresSvgPatternHoles(faceShape, w, h)) grid(6, 4, (x, y, cw) => push(rectPath(cw * 0.16 * sx, cw * 0.16 * sx, x, y)));
  }
  else if (pattern === "Triangles") {
    if (!addTrianglesSvgPatternHoles(faceShape, w, h)) grid(7, 5, (x, y, cw, ch, r, c) => push(trianglePath(cw * 0.25 * sx, ch * 0.3 * sy, x, y, (r + c) % 2 ? Math.PI : 0)));
  }
  else if (pattern === "Stars") {
    if (!addStarsSvgPatternHoles(faceShape, w, h)) grid(7, 4, (x, y, cw, ch) => push(starPath(Math.min(cw, ch) * 0.28, 8, x, y)));
  }
  else if (pattern === "Flowers") {
    if (!addFlowersSvgPatternHoles(faceShape, w, h)) grid(6, 5, (x, y, cw, ch) => {
      const size = Math.min(cw, ch) * 0.22;
      for (let i = 0; i < 4; i++) push(ellipsePath(size * 0.38, size, x, y, i * Math.PI / 2 + Math.PI / 4));
    });
  }
  else if (pattern === "Lines") {
    if (!addLinesSvgPatternHoles(faceShape, w, h)) grid(8, 1, (x, y, cw, ch) => push(rectPath(cw * 0.28, ch * 0.92, x, y)));
  }
  else if (pattern === "Petals") {
    if (!addPetalsSvgPatternHoles(faceShape, w, h)) grid(5, 4, (x, y, cw, ch) => {
      const size = Math.min(cw, ch) * 0.34;
      for (let i = 0; i < 4; i++) push(ellipsePath(size * 0.38, size, x, y, i * Math.PI / 2 + Math.PI / 4));
    });
  }
  else if (pattern === "Arches") {
    if (!addArchesSvgPatternHoles(faceShape, w, h)) grid(7, 5, (x, y, cw, ch) => push(arcPath(cw * 0.32 * sx, ch * 0.28 * sy, x, y)));
  }
  else if (pattern === "Wedge Bloom") {
    if (!addWedgeBloomSvgPatternHoles(faceShape, w, h)) grid(6, 4, (x, y, cw, ch) => { for (let i = 0; i < 6; i++) push(trianglePath(cw * 0.16 * sx, ch * 0.28 * sy, x, y, i * Math.PI / 3)); });
  }
  else if (pattern === "Angles") {
    if (!addAnglesSvgPatternHoles(faceShape, w, h)) grid(4, 4, (x, y, cw, ch) => {
      push(stripPath(cw * 0.72, Math.min(cw, ch) * 0.06, x - cw * 0.16, y, Math.PI / 4));
      push(stripPath(cw * 0.72, Math.min(cw, ch) * 0.06, x + cw * 0.16, y, -Math.PI / 4));
    });
  }
  else {
    addNamedSvgFacePatternHoles(faceShape, pattern, w, h);
  }
}

function addAnglesSvgPatternHoles(faceShape, faceW, faceH) {
  return addNamedSvgFacePatternHoles(faceShape, "Angles", faceW, faceH);
}

function addDiamondsSvgPatternHoles(faceShape, faceW, faceH) {
  return addNamedSvgFacePatternHoles(faceShape, "Diamonds", faceW, faceH);
}

function addFlowersSvgPatternHoles(faceShape, faceW, faceH) {
  return addNamedSvgFacePatternHoles(faceShape, "Flowers", faceW, faceH);
}

function addLinesSvgPatternHoles(faceShape, faceW, faceH) {
  return addNamedSvgFacePatternHoles(faceShape, "Lines", faceW, faceH);
}

function addPetalsSvgPatternHoles(faceShape, faceW, faceH) {
  return addNamedSvgFacePatternHoles(faceShape, "Petals", faceW, faceH);
}

function addSquaresSvgPatternHoles(faceShape, faceW, faceH) {
  return addNamedSvgFacePatternHoles(faceShape, "Squares", faceW, faceH);
}

function addStarsSvgPatternHoles(faceShape, faceW, faceH) {
  return addNamedSvgFacePatternHoles(faceShape, "Stars", faceW, faceH);
}

function addTrianglesSvgPatternHoles(faceShape, faceW, faceH) {
  return addNamedSvgFacePatternHoles(faceShape, "Triangles", faceW, faceH);
}

function addWedgeBloomSvgPatternHoles(faceShape, faceW, faceH) {
  return addNamedSvgFacePatternHoles(faceShape, "Wedge Bloom", faceW, faceH);
}

function addArchesSvgPatternHoles(faceShape, faceW, faceH) {
  return addNamedSvgFacePatternHoles(faceShape, "Arches", faceW, faceH);
}

function addNamedSvgFacePatternHoles(faceShape, patternName, faceW, faceH) {
  const data = getFacePatternSvgData(patternName);
  if (!data || !Array.isArray(data.paths) || !Array.isArray(data.viewBox)) return false;
  return addSvgFacePatternHoles(faceShape, data, faceW, faceH, patternName);
}

function addSvgFacePatternHoles(faceShape, data, faceW, faceH, patternName) {
  const fallbackViewBox = data.viewBox;
  const scale = getPatternScale("front", patternName || state.frontPattern);
  const margin = Math.max(0, Number(PATTERN_SAFE_MARGINS.front) || 0) * MODEL_SCALE;
  const usableW = Math.max(faceW - margin * 2, faceW * 0.75) * scale.x;
  const usableH = Math.max(faceH - margin * 2, faceH * 0.75) * scale.y;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.position = "absolute";
  svg.style.left = "-9999px";
  svg.style.top = "-9999px";
  document.body.appendChild(svg);

  try {
    const pathElements = [];
    data.paths.forEach(function(pathData) {
      const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathElement.setAttribute("d", pathData);
      svg.appendChild(pathElement);
      pathElements.push(pathElement);
    });
    const bounds = shouldTrimSvgPatternToArtwork(data) ? getSvgArtworkBounds(pathElements, fallbackViewBox) : { x: fallbackViewBox[0], y: fallbackViewBox[1], w: fallbackViewBox[2], h: fallbackViewBox[3] };
    pathElements.forEach(function(pathElement) {
      const total = pathElement.getTotalLength();
      if (!Number.isFinite(total) || total <= 0) return;
      const steps = Math.max(18, Math.min(240, Math.ceil(total / 3)));
      const path = new THREE.Path();
      for (let i = 0; i <= steps; i++) {
        const point = pathElement.getPointAtLength(total * (i / steps));
        const localX = ((point.x - bounds.x) / bounds.w - 0.5) * usableW;
        const localY = (0.5 - (point.y - bounds.y) / bounds.h) * usableH;
        const cr = Math.cos(scale.rotation || 0), sr = Math.sin(scale.rotation || 0);
        const baseW = Math.max(faceW - margin * 2, faceW * 0.75);
        const baseH = Math.max(faceH - margin * 2, faceH * 0.75);
        const x = localX * cr - localY * sr + scale.offsetX * baseW;
        const y = localX * sr + localY * cr + scale.offsetY * baseH;
        if (i === 0) path.moveTo(x, y);
        else path.lineTo(x, y);
      }
      path.closePath();
      faceShape.holes.push(ensureClockwiseHolePath(path));
    });
  } finally {
    svg.remove();
  }
  return true;
}

function diamondPath(width, height, x, y) {
  const p = new THREE.Path();
  p.moveTo(x, y + height / 2); p.lineTo(x + width / 2, y); p.lineTo(x, y - height / 2); p.lineTo(x - width / 2, y); p.lineTo(x, y + height / 2);
  return p;
}
function rectPath(width, height, x, y) {
  const p = new THREE.Path();
  p.moveTo(x - width / 2, y - height / 2); p.lineTo(x + width / 2, y - height / 2); p.lineTo(x + width / 2, y + height / 2); p.lineTo(x - width / 2, y + height / 2); p.lineTo(x - width / 2, y - height / 2); return p;
}
function trianglePath(width, height, x, y, rot) {
  const pts = [[0, height / 2], [width / 2, -height / 2], [-width / 2, -height / 2]];
  return polyPath(pts, x, y, rot || 0);
}
function starPath(radius, points, x, y) {
  const pts = [];
  for (let i = 0; i < points * 2; i++) { const r = i % 2 === 0 ? radius : radius * 0.32, a = -Math.PI / 2 + i * Math.PI / points; pts.push([Math.cos(a) * r, Math.sin(a) * r]); }
  return polyPath(pts, x, y, 0);
}
function ellipsePath(rx, ry, x, y, rot) {
  const pts = [];
  for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2; pts.push([Math.cos(a) * rx, Math.sin(a) * ry]); }
  return polyPath(pts, x, y, rot || 0);
}
function arcPath(rx, ry, x, y) {
  const pts = [];
  for (let i = 0; i <= 18; i++) { const a = Math.PI * (i / 18); pts.push([Math.cos(a) * rx, Math.sin(a) * ry]); }
  for (let i = 18; i >= 0; i--) { const a = Math.PI * (i / 18); pts.push([Math.cos(a) * rx * 0.62, Math.sin(a) * ry * 0.62]); }
  return polyPath(pts, x, y, 0);
}
function stripPath(length, width, x, y, rot) { return polyPath([[-length / 2, -width / 2], [length / 2, -width / 2], [length / 2, width / 2], [-length / 2, width / 2]], x, y, rot); }
function polyPath(points, x, y, rot) {
  const p = new THREE.Path();
  const c = Math.cos(rot), s = Math.sin(rot);
  points.forEach(function(pt, i) { const px = x + pt[0] * c - pt[1] * s, py = y + pt[0] * s + pt[1] * c; if (i === 0) p.moveTo(px, py); else p.lineTo(px, py); });
  p.closePath(); return p;
}

function drawFrontPattern(pattern, w, h, z) {
  if (pattern === "Blank") return;
  const group = new THREE.Group();
  const cutMaterial = new THREE.MeshBasicMaterial({ color: patternInk(), transparent: true, opacity: 0.97, side: THREE.DoubleSide });
  const bevelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25, side: THREE.DoubleSide });
  const baseRatio = 6.75 / 4.75;
  const currentRatio = w / h;
  const usableW = w * 0.86;
  const usableH = h * 0.8;
  const stretchX = currentRatio / baseRatio;
  const sx = Math.max(0.78, Math.min(1.25, stretchX));
  const sy = Math.max(0.82, Math.min(1.18, 1 / Math.sqrt(sx)));

  function addShape(shape, x, y, scaleX, scaleY, rotation) {
    const bevel = new THREE.Mesh(new THREE.ShapeGeometry(shape), bevelMaterial);
    bevel.position.set(x, y, z + 0.006);
    bevel.scale.set(scaleX * 1.12, scaleY * 1.12, 1);
    bevel.rotation.z = rotation || 0;
    group.add(bevel);
    const cut = new THREE.Mesh(new THREE.ShapeGeometry(shape), cutMaterial);
    cut.position.set(x, y, z + 0.012);
    cut.scale.set(scaleX, scaleY, 1);
    cut.rotation.z = rotation || 0;
    group.add(cut);
  }

  if (pattern === "Arches") {
    const cols = 7, rows = 5;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = -usableW / 2 + (c + 0.5) * usableW / cols;
      const y = -usableH / 2 + (r + 0.5) * usableH / rows;
      addArcCut(group, x, y, usableW / cols * 0.32 * sx, usableH / rows * 0.32 * sy, z, cutMaterial, bevelMaterial);
    }
  } else if (pattern === "Flowers") {
    const cols = 6, rows = 5;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = -usableW / 2 + (c + 0.5 + (r % 2) * 0.5) * usableW / cols;
      const y = -usableH / 2 + (r + 0.5) * usableH / rows;
      addFourPetalCut(group, x, y, Math.min(usableW / cols, usableH / rows) * 0.2, z, cutMaterial, bevelMaterial);
    }
  } else if (pattern === "Stars") {
    const cols = 7, rows = 4;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = -usableW / 2 + (c + 0.5) * usableW / cols;
      const y = -usableH / 2 + (r + 0.5) * usableH / rows;
      addShape(starShape(Math.min(usableW / cols, usableH / rows) * 0.28, 8), x, y, sx, sy, 0);
    }
  } else if (pattern === "Diamonds") {
    const cols = 7, rows = 5;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = -usableW / 2 + (c + 0.5 + (r % 2) * 0.35) * usableW / cols;
      const y = -usableH / 2 + (r + 0.5) * usableH / rows;
      addShape(diamondShape(usableW / cols * 0.16, usableH / rows * 0.42), x, y, sx, sy, 0);
    }
  } else if (pattern === "Petals") {
    const cols = 5, rows = 4;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = -usableW / 2 + (c + 0.5) * usableW / cols;
      const y = -usableH / 2 + (r + 0.5) * usableH / rows;
      addFourPetalCut(group, x, y, Math.min(usableW / cols, usableH / rows) * 0.32, z, cutMaterial, bevelMaterial);
    }
  } else if (pattern === "Squares") {
    const cols = 6, rows = 4;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = -usableW / 2 + (c + 0.5) * usableW / cols;
      const y = -usableH / 2 + (r + 0.5) * usableH / rows;
      addShape(rectShape(usableW / cols * 0.16, usableW / cols * 0.16), x, y, sx, sy, 0);
      addShape(diamondShape(usableW / cols * 0.38, usableH / rows * 0.38), x, y, sx, sy, 0);
    }
  } else if (pattern === "Angles") {
    drawAnglesPattern(w, h, z);
    return;
  } else if (pattern === "Triangles") {
    const cols = 7, rows = 5;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = -usableW / 2 + (c + 0.5) * usableW / cols;
      const y = -usableH / 2 + (r + 0.5) * usableH / rows;
      addShape(triangleShape(usableW / cols * 0.22, usableH / rows * 0.25), x, y, sx, sy, (r + c) % 2 ? Math.PI : 0);
    }
  } else if (pattern === "Wedge Bloom") {
    const cols = 6, rows = 4;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = -usableW / 2 + (c + 0.5) * usableW / cols;
      const y = -usableH / 2 + (r + 0.5) * usableH / rows;
      for (let i = 0; i < 6; i++) addShape(triangleShape(usableW / cols * 0.16, usableH / rows * 0.28), x, y, sx, sy, i * Math.PI / 3);
    }
  }
  coverGroup.add(group);
}

function drawSidePattern() { return; }

function addDiamondVent(group, x, y, width, height, bevelMaterial, darkMaterial) {
  const outer = diamondShape(width * 1.18, height * 1.18);
  const inner = diamondShape(width, height);
  const bevelMesh = new THREE.Mesh(new THREE.ShapeGeometry(outer), bevelMaterial);
  bevelMesh.position.set(x, y, 0.014);
  group.add(bevelMesh);
  const darkMesh = new THREE.Mesh(new THREE.ShapeGeometry(inner), darkMaterial);
  darkMesh.position.set(x, y, 0.02);
  group.add(darkMesh);
}

function diamondShape(width, height) {
  const shape = new THREE.Shape();
  shape.moveTo(0, height / 2);
  shape.lineTo(width / 2, 0);
  shape.lineTo(0, -height / 2);
  shape.lineTo(-width / 2, 0);
  shape.lineTo(0, height / 2);
  return shape;
}

function drawDimensionGuides(w, h, d) {
  const widthY = h / 2 + 0.34;
  // Keep the height label on the right side so it does not cover side-pattern previews.
  const heightX = w / 2 + 0.42;
  const depthX = w / 2 - 0.12;
  const depthY = h / 2 + 0.32;
  labelGroup.add(makeLabel("W " + toFixedSmart(state.widthMm / IN_TO_MM, 2) + " in", toFixedSmart(state.widthMm, 1) + " mm", 0, widthY, d / 2));
  labelGroup.add(makeLabel("H " + toFixedSmart(state.heightMm / IN_TO_MM, 2) + " in", toFixedSmart(state.heightMm, 1) + " mm", heightX, 0, d / 2));
  labelGroup.add(makeLabel("D " + toFixedSmart(state.depthMm / IN_TO_MM, 2) + " in", toFixedSmart(state.depthMm, 1) + " mm", depthX, depthY, 0));
}


function rectShape(width, height) {
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, -height / 2);
  shape.lineTo(width / 2, -height / 2);
  shape.lineTo(width / 2, height / 2);
  shape.lineTo(-width / 2, height / 2);
  shape.lineTo(-width / 2, -height / 2);
  return shape;
}

function triangleShape(width, height) {
  const shape = new THREE.Shape();
  shape.moveTo(0, height / 2);
  shape.lineTo(width / 2, -height / 2);
  shape.lineTo(-width / 2, -height / 2);
  shape.lineTo(0, height / 2);
  return shape;
}

function starShape(radius, points) {
  const shape = new THREE.Shape();
  for (let i = 0; i <= points * 2; i++) {
    const r = i % 2 === 0 ? radius : radius * 0.32;
    const a = -Math.PI / 2 + i * Math.PI / points;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  return shape;
}

function addFourPetalCut(group, x, y, size, z, cutMaterial, bevelMaterial) {
  for (let i = 0; i < 4; i++) {
    const petalShape = ellipseShape(size * 0.38, size);
    const bevel = new THREE.Mesh(new THREE.ShapeGeometry(petalShape), bevelMaterial);
    bevel.position.set(x, y, z + 0.006);
    bevel.scale.set(1.12, 1.12, 1);
    bevel.rotation.z = i * Math.PI / 2 + Math.PI / 4;
    group.add(bevel);
    const cut = new THREE.Mesh(new THREE.ShapeGeometry(petalShape), cutMaterial);
    cut.position.set(x, y, z + 0.012);
    cut.rotation.z = i * Math.PI / 2 + Math.PI / 4;
    group.add(cut);
  }
}

function ellipseShape(rx, ry) {
  const shape = new THREE.Shape();
  for (let i = 0; i <= 28; i++) {
    const a = i / 28 * Math.PI * 2;
    const x = Math.cos(a) * rx;
    const y = Math.sin(a) * ry;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  return shape;
}

function addArcCut(group, x, y, rx, ry, z, cutMaterial, bevelMaterial) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, rx, 0, Math.PI, false);
  shape.absarc(0, 0, rx * 0.62, Math.PI, 0, true);
  const bevel = new THREE.Mesh(new THREE.ShapeGeometry(shape), bevelMaterial);
  bevel.position.set(x, y, z + 0.006);
  bevel.scale.y = ry / rx * 1.12;
  bevel.scale.x = 1.12;
  group.add(bevel);
  const cut = new THREE.Mesh(new THREE.ShapeGeometry(shape), cutMaterial);
  cut.position.set(x, y, z + 0.012);
  cut.scale.y = ry / rx;
  group.add(cut);
}

function addGuideLine(points, material) { addPolyline3D(points, material, labelGroup); }
function addPolyline3D(points, material, group) { const geometry = new THREE.BufferGeometry().setFromPoints(points.map(function(point) { return new THREE.Vector3(...point); })); group.add(new THREE.Line(geometry, material)); }
function addPolyline(group, points, z, material) { const geometry = new THREE.BufferGeometry().setFromPoints(points.map(function(point) { return new THREE.Vector3(point[0], point[1], z); })); group.add(new THREE.Line(geometry, material)); }
function addRect(group, x, y, width, height, z, material) { addPolyline(group, [[x - width / 2, y - height / 2], [x + width / 2, y - height / 2], [x + width / 2, y + height / 2], [x - width / 2, y + height / 2], [x - width / 2, y - height / 2]], z, material); }
function addArc(group, x, y, radius, z, material) { const points = []; for (let i = 0; i <= 24; i++) { const angle = Math.PI * (i / 24); points.push([x + Math.cos(angle) * radius, y + Math.sin(angle) * radius]); } points.push([x - radius, y - radius * 0.8], [x + radius, y - radius * 0.8]); addPolyline(group, points, z, material); }
function addFlower(group, x, y, size, z, material) { for (let i = 0; i < 6; i++) { const petal = new THREE.Mesh(new THREE.CircleGeometry(size * 0.28, 24), material), angle = Math.PI * 2 * i / 6; petal.scale.set(1, 1.8, 1); petal.position.set(x + Math.cos(angle) * size * 0.38, y + Math.sin(angle) * size * 0.38, z); petal.rotation.z = angle; group.add(petal); } }
function addPetals(group, x, y, size, z, material) { for (let i = 0; i < 4; i++) { const petal = new THREE.Mesh(new THREE.CircleGeometry(size * 0.36, 24), material); petal.scale.set(0.7, 1.75, 1); petal.position.set(x, y, z); petal.rotation.z = Math.PI / 4 + i * Math.PI / 2; group.add(petal); } }
function addStar(group, x, y, size, z, material) { const points = []; for (let i = 0; i <= 10; i++) { const radius = i % 2 === 0 ? size : size * 0.42, angle = -Math.PI / 2 + i * Math.PI / 5; points.push([x + Math.cos(angle) * radius, y + Math.sin(angle) * radius]); } addPolyline(group, points, z, material); }
function addWedgeBloom(group, x, y, size, z, material) { for (let i = 0; i < 8; i++) { const shape = new THREE.Shape(); shape.moveTo(0, 0); shape.lineTo(size * 0.24, size * 0.95); shape.lineTo(-size * 0.24, size * 0.95); shape.lineTo(0, 0); const wedge = new THREE.Mesh(new THREE.ShapeGeometry(shape), material); wedge.position.set(x, y, z); wedge.rotation.z = i * Math.PI / 4; group.add(wedge); } }
function addRoundedSlot(group, x, y, width, height, z, material) { const halfW = width / 2, radius = height / 2, points = []; for (let i = 0; i <= 12; i++) { const a = -Math.PI / 2 + Math.PI * i / 12; points.push([x + halfW - radius + Math.cos(a) * radius, y + Math.sin(a) * radius]); } for (let i = 0; i <= 12; i++) { const a = Math.PI / 2 + Math.PI * i / 12; points.push([x - halfW + radius + Math.cos(a) * radius, y + Math.sin(a) * radius]); } points.push(points[0]); addPolyline(group, points, z, material); }
function makeLabel(lineOne, lineTwo, x, y, z) { const canvas = document.createElement("canvas"), context = canvas.getContext("2d"); canvas.width = 210; canvas.height = 104; context.fillStyle = "rgba(17, 24, 24, 0.9)"; context.strokeStyle = "rgba(242, 215, 173, 0.82)"; context.lineWidth = 3; context.beginPath(); context.roundRect(8, 8, 194, 88, 12); context.fill(); context.stroke(); context.fillStyle = "#f5e6c8"; context.font = "800 24px Inter, Arial, sans-serif"; context.textAlign = "center"; context.textBaseline = "middle"; context.fillText(lineOne, 105, 39); context.fillStyle = "#d8c9ad"; context.font = "700 21px Inter, Arial, sans-serif"; context.fillText(lineTwo, 105, 68); const texture = new THREE.CanvasTexture(canvas), sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true })); sprite.position.set(x, y, z); sprite.scale.set(1.36, 0.68, 1); return sprite; }
function patternInk() { const color = new THREE.Color(state.wallColor), brightness = color.r * 0.299 + color.g * 0.587 + color.b * 0.114; return brightness > 0.55 ? 0x26313d : 0xf8fafc; }

function buildConfiguredCoverPayload() {
  const colorMode = hasDistinctDualColors() ? "Two-tone" : "Single color";
  updatePricing();
  return {
    widthIn: toFixedSmart(state.widthMm / IN_TO_MM, 3),
    heightIn: toFixedSmart(state.heightMm / IN_TO_MM, 3),
    depthIn: toFixedSmart(state.depthMm / IN_TO_MM, 3),
    widthMm: toFixedSmart(state.widthMm, 1),
    heightMm: toFixedSmart(state.heightMm, 1),
    depthMm: toFixedSmart(state.depthMm, 1),
    frontPattern: state.frontPattern,
    sidePattern: state.sidePattern,
    sideShapeCount: state.sideShapeCount,
    sideShapeSizeMm: toFixedSmart(state.sideShapeSizeMm, 1),
    sideShapeSpacingMm: toFixedSmart(state.sideShapeSpacingMm, 1),
    sideShapeHeightMm: toFixedSmart(state.sideShapeHeightMm, 1),
    colorMode: colorMode,
    faceColor: state.faceColorLabel,
    wallColor: state.wallColorLabel,
    faceColorHex: state.faceColor,
    wallColorHex: state.wallColor,
    bellCutoutEnabled: !!state.bellCutoutEnabled,
    bellCount: state.bellCount,
    bellDiameterIn: state.bellCutoutEnabled ? toFixedSmart(state.bellDepthMm / IN_TO_MM, 3) : "",
    bellFaceFromWallIn: state.bellCutoutEnabled ? toFixedSmart(state.bellProjectionMm / IN_TO_MM, 3) : "",
    bellSpacingIn: state.bellCutoutEnabled ? toFixedSmart(state.bellSpacingMm / IN_TO_MM, 3) : "",
    bellCutout: state.bellCutoutWidthMm > 0 ? toFixedSmart(state.bellCutoutWidthMm / IN_TO_MM, 3) + " in W x " + toFixedSmart(state.bellCutoutDepthMm / IN_TO_MM, 3) + " in D; includes 4 mm buffer" : "No bell cutout",
    notes: els.notes.value.trim(),
    estimatedPrice: state.priceBreakdown ? state.priceBreakdown.totalPrice : null,
    estimatedPriceFormatted: state.priceBreakdown ? formatMoney(state.priceBreakdown.totalPrice) : "Not calculated",
    volumeCuIn: state.priceBreakdown ? state.priceBreakdown.volume : null,
    priceBreakdown: state.priceBreakdown || null
  };
}

function submitConfiguredCoverToCart() {
  if (!window.E3D_CHIME_CONFIG || !window.E3D_CHIME_CONFIG.ajaxUrl) {
    showSummary();
    return;
  }
  if (!validateSidePatternLayout(true)) return;
  const payload = buildConfiguredCoverPayload();
  const submitButton = els.form.querySelector('[type="submit"]');
  const originalText = submitButton ? submitButton.textContent : "";
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Adding to cart...";
  }
  let order3mfBlob = null;
  let order3mfFilename = exportFilename("3mf");
  try {
    order3mfBlob = generateCurrentCover3mfBlob();
  } catch (error) {
    console.error("Could not generate order 3MF:", error);
    alert("Could not generate the production 3MF for this cover. Please try again before adding to cart.");
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalText || "Add to Cart";
    }
    return;
  }

  const formData = new FormData();
  formData.append("action", "e3d_chime_add_to_cart");
  formData.append("nonce", window.E3D_CHIME_CONFIG.nonce || "");
  formData.append("product_id", window.E3D_CHIME_CONFIG.productId || "");
  formData.append("config", JSON.stringify(payload));
  formData.append("e3d_3mf_file", order3mfBlob, order3mfFilename);

  fetch(window.E3D_CHIME_CONFIG.ajaxUrl, {
    method: "POST",
    credentials: "same-origin",
    body: formData
  })
    .then(function(response) { return response.json(); })
    .then(function(result) {
      if (!result || !result.success) {
        const message = result && result.data && result.data.message ? result.data.message : "Unable to add this configured cover to the cart.";
        throw new Error(message);
      }
      window.location.href = result.data.cart_url || window.E3D_CHIME_CONFIG.cartUrl || "/cart/";
    })
    .catch(function(error) {
      alert(error.message || "Unable to add this configured cover to the cart.");
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText || "Add to Cart";
      }
    });
}

function showSummary() { // Future submission behavior can be added here: send this payload to email, WooCommerce, Shopify, a serverless function, or a custom backend endpoint.
  const colorMode = hasDistinctDualColors() ? "Two-tone" : "Single color";
  updatePricing();
  const payload = { width: toFixedSmart(state.widthMm / IN_TO_MM, 3) + " inches / " + toFixedSmart(state.widthMm, 1) + " mm", height: toFixedSmart(state.heightMm / IN_TO_MM, 3) + " inches / " + toFixedSmart(state.heightMm, 1) + " mm", depth: toFixedSmart(state.depthMm / IN_TO_MM, 3) + " inches / " + toFixedSmart(state.depthMm, 1) + " mm", wall: WALL_MM + " mm", faceInset: FACE_INSET_MM + " mm",
    chamferDepth: CHAMFER_DEPTH_MM + " mm", cornerFillet: CORNER_FILLET_MM + " mm", frontPattern: state.frontPattern, sidePattern: state.sidePattern, colorMode: colorMode, faceColor: state.faceColorLabel,
    wallColor: state.wallColorLabel, estimatedPrice: state.priceBreakdown ? formatMoney(state.priceBreakdown.totalPrice) : "Not calculated", bellCutout: state.bellCutoutWidthMm > 0 ? toFixedSmart(state.bellCutoutWidthMm / IN_TO_MM, 3) + " in W x " + toFixedSmart(state.bellCutoutDepthMm / IN_TO_MM, 3) + " in D; includes 4 mm buffer" : "No bell cutout",
    notes: els.notes.value.trim() || "No notes provided" };
  els.summaryContent.innerHTML = '<div class="summary-grid"><div><strong>Width</strong>' + payload.width + '</div><div><strong>Height</strong>' + payload.height + '</div><div><strong>Depth</strong>' + payload.depth + '</div><div><strong>Estimated price</strong>' + payload.estimatedPrice + '</div><div><strong>Wall</strong>' + payload.wall + '</div><div><strong>Face inset</strong>' + payload.faceInset + '</div><div><strong>Chamfer depth</strong>' + payload.chamferDepth + '</div><div><strong>Corner fillet</strong>' + payload.cornerFillet + '</div><div><strong>Front pattern</strong>' + payload.frontPattern + '</div><div><strong>Side pattern</strong>' + payload.sidePattern + '</div><div><strong>Color mode</strong>' + payload.colorMode + '</div><div><strong>Face / cover color</strong>' + payload.faceColor + '</div><div><strong>Wall color</strong>' + payload.wallColor + '</div><div><strong>Bell cutout</strong>' + payload.bellCutout + '</div><div><strong>Notes</strong>' + escapeHtml(payload.notes) + '</div></div>';
  els.summaryCard.hidden = false; els.summaryCard.scrollIntoView({ behavior: "smooth", block: "nearest" }); console.info("Prepared quote request payload:", payload);
}
function cancelCameraTransition() {
  if (cameraTransitionFrame) {
    window.cancelAnimationFrame(cameraTransitionFrame);
    cameraTransitionFrame = null;
  }
}
function cancelDimensionAutoFit() {
  if (dimensionFitTimer) {
    window.clearTimeout(dimensionFitTimer);
    dimensionFitTimer = null;
  }
}
function getDimensionFitSignature() {
  if (!Number.isFinite(state.widthMm) || !Number.isFinite(state.heightMm) || !Number.isFinite(state.depthMm)) return "";
  return [
    Math.round(state.widthMm * 10) / 10,
    Math.round(state.heightMm * 10) / 10,
    Math.round(state.depthMm * 10) / 10
  ].join("x");
}
function requestDimensionAutoFit() {
  if (!isAutoViewEnabled()) return;
  const signature = getDimensionFitSignature();
  if (!signature || signature === lastDimensionFitSignature) return;
  lastDimensionFitSignature = signature;
  cancelDimensionAutoFit();
  dimensionFitTimer = window.setTimeout(function() {
    dimensionFitTimer = null;
    fitCameraToCurrentCover();
  }, DIMENSION_AUTO_FIT_DELAY_MS);
}
function fitCameraToCurrentCover() {
  if (!camera || !controls || !els.canvas) return;
  const w = state.widthMm * MODEL_SCALE;
  const h = state.heightMm * MODEL_SCALE;
  const d = state.depthMm * MODEL_SCALE;
  if (!Number.isFinite(w) || !Number.isFinite(h) || !Number.isFinite(d) || w <= 0 || h <= 0 || d <= 0) return;

  const target = new THREE.Vector3(0, 0, d * 0.12);
  const direction = camera.position.clone().sub(controls.target);
  if (direction.lengthSq() < 0.001) direction.set(DEFAULT_CAMERA_POSITION.x, DEFAULT_CAMERA_POSITION.y, DEFAULT_CAMERA_POSITION.z);
  direction.normalize();

  const aspect = Math.max(0.2, (els.canvas.clientWidth || 1) / (els.canvas.clientHeight || 1));
  const verticalFov = THREE.MathUtils.degToRad(camera.fov);
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect);
  const radius = Math.sqrt(w * w + h * h + d * d) * 0.5;
  const fitVertical = radius / Math.sin(verticalFov / 2);
  const fitHorizontal = radius / Math.sin(horizontalFov / 2);
  const distance = Math.max(5.8, Math.max(fitVertical, fitHorizontal) * 0.98);
  const position = target.clone().add(direction.multiplyScalar(distance));

  animateCameraTo(position, target, new THREE.Vector3(0, 1, 0), AUTO_VIEW_DURATION_MS);
}
function resetCameraPosition() {
  cancelCameraTransition();
  camera.up.set(0, 1, 0);
  camera.position.set(DEFAULT_CAMERA_POSITION.x, DEFAULT_CAMERA_POSITION.y, DEFAULT_CAMERA_POSITION.z);
}
function animateCameraTo(position, target, up, durationMs) {
  if (!camera || !controls) return;
  cancelCameraTransition();
  const startPosition = camera.position.clone();
  const startTarget = controls.target.clone();
  const startUp = camera.up.clone();
  const endPosition = position.clone();
  const endTarget = target.clone();
  const endUp = up.clone().normalize();
  const duration = durationMs || 700;
  const startTime = performance.now();
  function easeInOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function step(now) {
    const t = Math.min(1, (now - startTime) / duration);
    const eased = easeInOut(t);
    camera.position.lerpVectors(startPosition, endPosition, eased);
    controls.target.lerpVectors(startTarget, endTarget, eased);
    camera.up.lerpVectors(startUp, endUp, eased).normalize();
    controls.update();
    if (t < 1) cameraTransitionFrame = window.requestAnimationFrame(step);
    else cameraTransitionFrame = null;
  }
  cameraTransitionFrame = window.requestAnimationFrame(step);
}
function isAutoViewEnabled() {
  return !(els.autoViewToggle && !els.autoViewToggle.checked);
}
function attachSelectViewSnap(select, snapFn) {
  if (!select || typeof snapFn !== "function") return;
  let lastSnapAt = 0;
  function snapOnce() {
    if (!isAutoViewEnabled()) return;
    const now = Date.now();
    if (now - lastSnapAt < 180) return;
    lastSnapAt = now;
    snapFn();
  }
  select.addEventListener("pointerdown", snapOnce);
  select.addEventListener("focus", snapOnce);
}
function snapCameraToFrontView() {
  const w = state.widthMm * MODEL_SCALE, h = state.heightMm * MODEL_SCALE, d = state.depthMm * MODEL_SCALE;
  const largest = Math.max(w, h, d);
  const distance = Math.max(7, largest * 2.15);
  const faceAngle = THREE.MathUtils.degToRad(settingNumberFromObject(CAMERA_ANGLES, 'face', 0));
  const position = new THREE.Vector3(Math.sin(faceAngle) * distance, 0, d / 2 + Math.cos(faceAngle) * distance);
  const target = new THREE.Vector3(0, 0, d / 2 - Math.min(d * 0.28, largest * 0.15));
  animateCameraTo(position, target, new THREE.Vector3(0, 1, 0), AUTO_VIEW_DURATION_MS);
}
function snapCameraToLeftSideView() {
  const w = state.widthMm * MODEL_SCALE, h = state.heightMm * MODEL_SCALE, d = state.depthMm * MODEL_SCALE;
  const largest = Math.max(w, h, d);
  const distance = Math.max(7, largest * 2.15);
  const angle = THREE.MathUtils.degToRad(settingNumberFromObject(CAMERA_ANGLES, 'side', 70));
  const targetX = -w * 0.16;
  const targetZ = d * 0.08;
  const position = new THREE.Vector3(targetX - Math.sin(angle) * distance, 0, targetZ + Math.cos(angle) * distance);
  const target = new THREE.Vector3(targetX, 0, targetZ);
  animateCameraTo(position, target, new THREE.Vector3(0, 1, 0), AUTO_VIEW_DURATION_MS);
}
function snapCameraToColorView() {
  animateCameraTo(
    cameraPositionFromAngle(settingNumberFromObject(CAMERA_ANGLES, 'color', -38)),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 1, 0),
    AUTO_VIEW_DURATION_MS
  );
}
function cameraPositionFromAngle(angleDeg) {
  const w = state.widthMm * MODEL_SCALE, h = state.heightMm * MODEL_SCALE, d = state.depthMm * MODEL_SCALE;
  const largest = Math.max(w, h, d);
  const distance = Math.max(7, largest * 2.15);
  const angle = THREE.MathUtils.degToRad(angleDeg);
  return new THREE.Vector3(Math.sin(angle) * distance, Math.max(2.5, largest * 0.72), Math.cos(angle) * distance + d * 0.1);
}
function snapCameraToBottomView() {
  const w = state.widthMm * MODEL_SCALE, h = state.heightMm * MODEL_SCALE, d = state.depthMm * MODEL_SCALE;
  const largest = Math.max(w, h, d);
  const distance = Math.max(6, largest * 1.55);
  const position = new THREE.Vector3(0, -distance * 0.58, d / 2 + distance * 0.82);
  const target = new THREE.Vector3(0, -h * 0.34, 0);
  animateCameraTo(position, target, new THREE.Vector3(0, 1, 0), AUTO_VIEW_DURATION_MS);
}
function snapCameraToInsideView() {
  const w = state.widthMm * MODEL_SCALE, h = state.heightMm * MODEL_SCALE, d = state.depthMm * MODEL_SCALE;
  const largest = Math.max(w, h, d);
  const distance = Math.max(6, largest * 1.65);
  const position = new THREE.Vector3(-w * 0.42, h * 0.18, -distance);
  const target = new THREE.Vector3(0, 0, d * 0.15);
  animateCameraTo(position, target, new THREE.Vector3(0, 1, 0), AUTO_VIEW_DURATION_MS);
}
function frameCamera(w, h, d) {
  const largest = Math.max(w, h, d);
  controls.minDistance = Math.max(2.8, largest * 0.62);
  controls.maxDistance = Math.max(20, largest * 3.4);
}
function clearGroup(group) { while (group.children.length) { const child = group.children.pop(); if (child.geometry) child.geometry.dispose(); if (child.material) { if (Array.isArray(child.material)) child.material.forEach(function(material) { material.dispose(); }); else child.material.dispose(); } } }
function resizeRenderer() { const wrap = els.canvas.parentElement, width = wrap.clientWidth, height = wrap.clientHeight; renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); }
function animate() { requestAnimationFrame(animate); controls.update(); labelGroup.children.forEach(function(label) { label.quaternion.copy(camera.quaternion); }); renderer.render(scene, camera); }
function toFixedSmart(number, digits) { if (!Number.isFinite(number)) return ""; return Number(number.toFixed(digits)).toString(); }
function escapeHtml(value) { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }


function setupExportButtons() {
  const stlButton = document.querySelector("#exportStlButton");
  const mfButton = document.querySelector("#export3mfButton");
  if (stlButton) stlButton.addEventListener("click", exportCurrentCoverAsStl);
  if (mfButton) mfButton.addEventListener("click", exportCurrentCoverAs3mf);
}

function getExportMeshes() {
  const meshes = [];
  coverGroup.updateMatrixWorld(true);
  coverGroup.traverse(function(child) {
    if (child && child.isMesh && child.userData && child.userData.exportable && child.geometry && child.geometry.attributes && child.geometry.attributes.position) {
      meshes.push(child);
    }
  });
  return meshes;
}

function exportFilename(extension) {
  // File name uses the CUSTOMER INPUT dimensions, not the manufacturing outside dimensions.
  // The exported geometry still adds the 1 mm clearance and 2 mm walls internally.
  // Example: F-Arches S-Blank 6.75x4.75x2.3mf
  const frontPattern = displayFilenamePart(state.frontPattern || "Blank");
  const sidePattern = displayFilenamePart(state.sidePattern || "Blank");
  const width = dimensionFilenamePart(state.widthMm / IN_TO_MM);
  const height = dimensionFilenamePart(state.heightMm / IN_TO_MM);
  const depth = dimensionFilenamePart(state.depthMm / IN_TO_MM);
  return "F-" + frontPattern + " S-" + sidePattern + " " + width + "x" + height + "x" + depth + "." + extension;
}

function displayFilenamePart(value) {
  const cleaned = String(value || "")
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim();
  if (!cleaned) return "Blank";
  return cleaned.split(/\s+/).map(function(part) {
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  }).join("-");
}

function dimensionFilenamePart(value) {
  // Customer input fields can round-trip through mm values, which can produce values
  // like 6.748. For filenames, use the customer-friendly dimension rounded to 2 decimals.
  return toFixedSmart(value, 2).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

function exportCurrentCoverAsStl() {
  buildCover();
  const meshes = buildManufacturingExportMeshes();
  if (!meshes.length) return alert("No printable meshes were found to export.");
  const stl = buildAsciiStl(meshes, "custom_chime_cover");
  downloadBlob(exportFilename("stl"), "model/stl", stl);
}

function makeExportMesh(geometry, material, name) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name || "chime_cover_part";
  mesh.userData.exportable = true;
  mesh.updateMatrixWorld(true);
  return mesh;
}

function buildManufacturingExportMeshes() {
  // v11 export strategy:
  // - Keep the Bambu-friendly color-writing method from v6.
  // - Go back to the v5 slicer-safe cap approach that preserved perforation holes.
  // - Restore the exact Fusion-style outside face chamfer without beveling the pattern holes.
  //
  // The important difference from v6 is that the chamfer is NOT a separate surface/ring
  // touching the perforated face. A separate chamfer surface created a non-manifold seam
  // that Bambu repaired by filling the face holes. Here the perforated face and outer
  // chamfer and face use welded/coincident boundaries, but the holes remain straight-through.
  // Export dimensions are based on the customer's entered INTERNAL dimensions.
  // Width/height entered by the customer are inside-wall-to-inside-wall, so the
  // manufactured outside size needs: internal dimension + 1 mm clearance +
  // 2 mm wall on the left + 2 mm wall on the right = internal + 5 mm total.
  // Depth entered by the customer is internal cavity depth, so the manufactured
  // outside depth needs: internal depth + 1 mm clearance + 2 mm face thickness.
  const exportInternalW = state.widthMm + EXPORT_INTERIOR_CLEARANCE_MM;
  const exportInternalH = state.heightMm + EXPORT_INTERIOR_CLEARANCE_MM;
  const exportInternalD = state.depthMm + EXPORT_INTERIOR_CLEARANCE_MM;
  const w = (exportInternalW + WALL_MM * 2) * MODEL_SCALE;
  const h = (exportInternalH + WALL_MM * 2) * MODEL_SCALE;
  const d = (exportInternalD + WALL_MM) * MODEL_SCALE;
  const wall = WALL_MM * MODEL_SCALE;
  const radius = CORNER_FILLET_MM * MODEL_SCALE;
  const faceInset = FACE_INSET_MM * MODEL_SCALE;
  const chamferDepth = CHAMFER_DEPTH_MM * MODEL_SCALE;
  const backZ = -d / 2;
  const frontZ = d / 2;
  // v9: stop the wall shell exactly at the lower chamfer edge.
  // Earlier export versions let the wall continue to frontZ - wall (2 mm below the face),
  // while the outside chamfer starts at frontZ - CHAMFER_DEPTH_MM (3 mm below the face).
  // That 1 mm overlap created the visible lip/ledge Bambu showed on the chamfer side.
  const shellDepth = Math.max(d - chamferDepth, wall);

  const wallMaterial = createPreviewMaterial(state.wallColor, state.wallMetalness ?? 0, state.wallRoughness ?? 0.56);
  const faceMaterial = shouldShareFaceWallMaterial() ? wallMaterial : createPreviewMaterial(state.faceColor, state.faceMetalness ?? 0, state.faceRoughness ?? 0.56);
  const meshes = [];

  if (hasBellCutout()) {
    const cutouts = state.bellCutoutsMm.map(function(cutout) {
      return { center: cutout.centerMm * MODEL_SCALE, width: Math.min(cutout.widthMm * MODEL_SCALE, w - wall * 4) };
    });
    if (hasPatternedSides()) {
      createDiamondSideShellGeometries(w, h, wall, shellDepth, backZ, false).forEach(function(geometry, i) {
        meshes.push(makeExportMesh(geometry, wallMaterial, "wall_shell_" + (i + 1)));
      });
    } else {
      const shellShape = bottomGapShellShape(w, h, radius, wall, Math.max(w - wall * 4, wall));
      const shellGeometry = new THREE.ExtrudeGeometry(shellShape, { depth: shellDepth, bevelEnabled: false, curveSegments: 28 });
      shellGeometry.translate(0, 0, backZ);
      meshes.push(makeExportMesh(shellGeometry, wallMaterial, "wall_shell"));
    }
    createBottomWallSegmentGeometries(w, h, wall, shellDepth, backZ, cutouts).forEach(function(geometry, i) {
      meshes.push(makeExportMesh(geometry, wallMaterial, "bottom_wall_segment_" + (i + 1)));
    });
    cutouts.forEach(function(cutout, i) {
      meshes.push(makeExportMesh(createBellCutoutFrontBridgeGeometry(w, h, wall, shellDepth, backZ, cutout.width, cutout.center), wallMaterial, "bell_cutout_bridge_" + (i + 1)));
    });
  } else if (hasPatternedSides()) {
    createDiamondSideShellGeometries(w, h, wall, shellDepth, backZ, true).forEach(function(geometry, i) {
      meshes.push(makeExportMesh(geometry, wallMaterial, "wall_shell_" + (i + 1)));
    });
  } else {
    const shellShape = roundedRectShape(w, h, radius);
    shellShape.holes.push(roundedRectShape(Math.max(w - wall * 2, wall), Math.max(h - wall * 2, wall), Math.max(radius - wall, wall * 0.35)));
    const shellGeometry = new THREE.ExtrudeGeometry(shellShape, { depth: shellDepth, bevelEnabled: false, curveSegments: 28 });
    shellGeometry.translate(0, 0, backZ);
    meshes.push(makeExportMesh(shellGeometry, wallMaterial, "wall_shell"));
  }

  // v11 manufacturing face:
  // Model the front edge the same way as the Fusion workflow:
  // - The outside front edge chamfers 3 mm down the wall and 2 mm into the face.
  // - The patterned face itself is a flat, straight-through perforated plate.
  // - The hole walls are vertical; the chamfer is only on the outside perimeter.
  //
  // Important: we do NOT use ExtrudeGeometry beveling here, because that also
  // bevels every pattern hole. We build the perimeter chamfer as its own outer
  // surface, and build the perforated face plate without the top outer sidewall
  // that previously created a non-manifold edge Bambu repaired incorrectly.
  const faceW = Math.max(w - faceInset * 2, wall * 5);
  const faceH = Math.max(h - faceInset * 2, wall * 5);
  const faceRadius = Math.max(radius - faceInset, wall * 0.4);
  const chamferBackZ = frontZ - chamferDepth;
  const faceBackZ = frontZ - wall;

  const chamferGeometry = createPerimeterChamferGeometry(w, h, radius, faceW, faceH, faceRadius, chamferBackZ, frontZ);
  meshes.push(makeExportMesh(chamferGeometry, faceMaterial, "outer_fusion_style_chamfer_3mm_by_2mm"));

  const internalChamfer = INTERNAL_FACE_WALL_CHAMFER_MM * MODEL_SCALE;
  const faceShape = roundedRectShape(faceW, faceH, faceRadius);
  addPatternHoles(faceShape, state.frontPattern, faceW, faceH);

  // v11: add a 1 mm internal chamfer where the underside of the face meets the inside wall.
  // This mirrors a Fusion 360 symmetric chamfer on the inside face/wall edge:
  // 1 mm down the internal wall and 1 mm inward across the underside of the face.
  // Pattern holes stay straight-through; only the outside perimeter of the underside is chamfered.
  const backFaceW = Math.max(faceW - internalChamfer * 2, wall * 3);
  const backFaceH = Math.max(faceH - internalChamfer * 2, wall * 3);
  const backFaceRadius = Math.max(faceRadius - internalChamfer, wall * 0.25);
  const backFaceShape = roundedRectShape(backFaceW, backFaceH, backFaceRadius);
  // Use identical pattern-hole paths on the underside so every facial cutout remains
  // straight through. Only the outside underside boundary is inset for the 1 mm
  // internal perimeter chamfer.
  faceShape.holes.forEach(function(hole) {
    backFaceShape.holes.push(hole.clone ? hole.clone() : hole);
  });

  const faceGeometry = createStraightThroughPerforatedFaceGeometry(faceShape, backFaceShape, frontZ, faceBackZ);
  meshes.push(makeExportMesh(faceGeometry, faceMaterial, "straight_through_perforated_face_with_1mm_internal_chamfer_clearance"));

  const internalChamferGeometry = createInternalFaceWallChamferGeometry(faceW, faceH, faceRadius, backFaceW, backFaceH, backFaceRadius, chamferBackZ, faceBackZ);
  meshes.push(makeExportMesh(internalChamferGeometry, faceMaterial, "inside_face_wall_chamfer_1mm"));

  meshes.forEach(function(mesh) {
    if (mesh.geometry) {
      mesh.geometry.computeVertexNormals();
      mesh.updateMatrixWorld(true);
    }
  });
  return meshes;
}

function buildAsciiStl(meshes, name) {
  const lines = ["solid " + sanitizeName(name)];
  const triangle = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
  const normal = new THREE.Vector3();
  meshes.forEach(function(mesh) {
    const data = getMeshTrianglesInMillimeters(mesh);
    data.triangles.forEach(function(face) {
      triangle[0].copy(data.vertices[face[0]]); triangle[1].copy(data.vertices[face[1]]); triangle[2].copy(data.vertices[face[2]]);
      normal.subVectors(triangle[1], triangle[0]).cross(new THREE.Vector3().subVectors(triangle[2], triangle[0])).normalize();
      lines.push("  facet normal " + formatFloat(normal.x) + " " + formatFloat(normal.y) + " " + formatFloat(normal.z));
      lines.push("    outer loop");
      triangle.forEach(function(v) { lines.push("      vertex " + formatFloat(v.x) + " " + formatFloat(v.y) + " " + formatFloat(v.z)); });
      lines.push("    endloop");
      lines.push("  endfacet");
    });
  });
  lines.push("endsolid " + sanitizeName(name));
  return lines.join("\n");
}

function generateCurrentCover3mfBlob() {
  buildCover();
  const meshes = buildManufacturingExportMeshes();
  if (!meshes.length) throw new Error("No printable meshes were found to export.");
  const files = build3mfFiles(meshes);
  const zipBytes = createZipFile(files);
  return new Blob([zipBytes], { type: "model/3mf" });
}

function exportCurrentCoverAs3mf() {
  try {
    const blob = generateCurrentCover3mfBlob();
    downloadBlob(exportFilename("3mf"), "model/3mf", blob);
  } catch (error) {
    console.error("3MF export failed:", error);
    alert("3MF export failed. Open the browser console for details. Error: " + (error && error.message ? error.message : error));
  }
}

function build3mfFiles(meshes) {
  const modelXml = build3mfModelXml(meshes);
  return {
    "[Content_Types].xml": '<?xml version="1.0" encoding="UTF-8"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/></Types>',
    "_rels/.rels": '<?xml version="1.0" encoding="UTF-8"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Target="/3D/3dmodel.model" Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/></Relationships>',
    "3D/3dmodel.model": modelXml
  };
}

function build3mfModelXml(meshes) {
  // Bambu's handling of generic 3MF materials is inconsistent across versions.
  // This writes one welded 3MF object with per-triangle colors using BOTH:
  // 1) the standard Microsoft 3MF material color extension <m:colorgroup>, and
  // 2) BaseMaterials as a fallback for slicers that prefer base material colors.
  // The geometry is combined into a single object so same-color shells share vertices
  // instead of importing as a pile of separate repair-prone bodies.
  const COLOR_GROUP_ID = 1000;
  const BASE_MATERIAL_ID = 1001;
  const colorMap = new Map();
  const vertices = [];
  const triangles = [];
  const vertexMap = new Map();

  function colorIndexFor(color) {
    color = normalizeHexColor(color);
    if (!colorMap.has(color)) colorMap.set(color, colorMap.size);
    return colorMap.get(color);
  }
  function addVertex(v) {
    // Round to 0.001 mm so touching shell/chamfer/face boundaries weld into one mesh.
    const key = v.x.toFixed(3) + ',' + v.y.toFixed(3) + ',' + v.z.toFixed(3);
    if (vertexMap.has(key)) return vertexMap.get(key);
    const index = vertices.length;
    vertices.push({ x: Number(v.x.toFixed(6)), y: Number(v.y.toFixed(6)), z: Number(v.z.toFixed(6)) });
    vertexMap.set(key, index);
    return index;
  }

  meshes.forEach(function(mesh) {
    const materialIndex = colorIndexFor(getMeshExportColor(mesh));
    const data = getMeshTrianglesInMillimeters(mesh);
    data.triangles.forEach(function(t) {
      const a = data.vertices[t[0]], b = data.vertices[t[1]], c = data.vertices[t[2]];
      const ia = addVertex(a), ib = addVertex(b), ic = addVertex(c);
      if (ia !== ib && ib !== ic && ic !== ia) triangles.push([ia, ib, ic, materialIndex]);
    });
  });

  const colors = Array.from(colorMap.keys());
  const colorResources = colors.map(function(color) {
    return '<m:color color="' + color + 'FF"/>';
  }).join('');
  const baseMaterials = colors.map(function(color, index) {
    return '<base name="Color ' + (index + 1) + '" displaycolor="' + color + 'FF"/>';
  }).join('');

  const verticesXml = vertices.map(function(v) {
    return '<vertex x="' + formatFloat(v.x) + '" y="' + formatFloat(v.y) + '" z="' + formatFloat(v.z) + '"/>';
  }).join('');
  const trianglesXml = triangles.map(function(t) {
    // Standard color extension: pid/p1/p2/p3 point to COLOR_GROUP_ID.
    // Base material fallback: pindex on the object points to the first material, but
    // Bambu should prefer the per-triangle color group when its color parser is active.
    return '<triangle v1="' + t[0] + '" v2="' + t[1] + '" v3="' + t[2] + '" pid="' + COLOR_GROUP_ID + '" p1="' + t[3] + '" p2="' + t[3] + '" p3="' + t[3] + '" paint_color="' + (t[3] + 1) + '"/>';
  }).join('');

  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<model unit="millimeter" xml:lang="en-US" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02" xmlns:m="http://schemas.microsoft.com/3dmanufacturing/material/2015/02">' +
    '<metadata name="Application">Express 3D Customs Chime Cover Designer</metadata>' +
    '<metadata name="Title">Custom Door Chime Cover</metadata>' +
    '<resources>' +
    '<m:colorgroup id="' + COLOR_GROUP_ID + '">' + colorResources + '</m:colorgroup>' +
    '<basematerials id="' + BASE_MATERIAL_ID + '">' + baseMaterials + '</basematerials>' +
    '<object id="1" type="model" name="custom_chime_cover" pid="' + BASE_MATERIAL_ID + '" pindex="0"><mesh><vertices>' + verticesXml + '</vertices><triangles>' + trianglesXml + '</triangles></mesh></object>' +
    '</resources><build><item objectid="1"/></build></model>';
}

function getMeshTrianglesInMillimeters(mesh) {
  const geometry = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone();
  const pos = geometry.attributes.position;
  const matrix = mesh.matrixWorld.clone();
  const vertices = [];
  const triangles = [];
  const vertexMap = new Map();
  function addVertex(v) {
    const key = formatFloat(v.x) + ',' + formatFloat(v.y) + ',' + formatFloat(v.z);
    if (vertexMap.has(key)) return vertexMap.get(key);
    const index = vertices.length;
    vertices.push(v.clone());
    vertexMap.set(key, index);
    return index;
  }
  for (let i = 0; i < pos.count; i += 3) {
    const ids = [];
    for (let j = 0; j < 3; j++) {
      const v = new THREE.Vector3(pos.getX(i + j), pos.getY(i + j), pos.getZ(i + j));
      v.applyMatrix4(matrix);
      v.multiplyScalar(1 / MODEL_SCALE);
      // Export orientation: Bambu was importing the face upward. Flip the model 180°
      // around the X axis so the finished front face lands against the build plate.
      // Slicers will drop the new lowest Z surface to the plate on import/slice.
      v.z = -v.z;
      ids.push(addVertex(v));
    }
    if (ids[0] !== ids[1] && ids[1] !== ids[2] && ids[2] !== ids[0]) triangles.push(ids);
  }
  geometry.dispose();
  return { vertices: vertices, triangles: triangles };
}

function getMeshExportColor(mesh) {
  const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  if (material && material.userData && material.userData.exportColor) return normalizeHexColor(material.userData.exportColor);
  if (material && material.color) return '#' + material.color.getHexString().toUpperCase();
  return '#CCCCCC';
}

function normalizeHexColor(value) {
  let hex = String(value || '').trim();
  if (!hex.startsWith('#')) hex = '#' + hex;
  if (/^#[0-9a-f]{3}$/i.test(hex)) hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  return /^#[0-9a-f]{6}$/i.test(hex) ? hex.toUpperCase() : '#CCCCCC';
}

function downloadBlob(filename, mimeType, content) {
  const blob = content instanceof Uint8Array ? new Blob([content], { type: mimeType }) : new Blob([content], { type: mimeType + ';charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(function() { URL.revokeObjectURL(url); }, 800);
}

function createZipFile(files) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  Object.keys(files).forEach(function(name) {
    const nameBytes = encoder.encode(name);
    const dataBytes = encoder.encode(files[name]);
    const crc = crc32(dataBytes);
    const localHeader = concatBytes(
      u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(dataBytes.length), u32(dataBytes.length), u16(nameBytes.length), u16(0), nameBytes
    );
    localParts.push(localHeader, dataBytes);
    const centralHeader = concatBytes(
      u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(dataBytes.length), u32(dataBytes.length), u16(nameBytes.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), nameBytes
    );
    centralParts.push(centralHeader);
    offset += localHeader.length + dataBytes.length;
  });
  const centralOffset = offset;
  const central = concatBytes.apply(null, centralParts);
  const local = concatBytes.apply(null, localParts);
  const end = concatBytes(u32(0x06054b50), u16(0), u16(0), u16(centralParts.length), u16(centralParts.length), u32(central.length), u32(centralOffset), u16(0));
  return concatBytes(local, central, end);
}

function u16(value) {
  const bytes = new Uint8Array(2);
  bytes[0] = value & 255;
  bytes[1] = (value >>> 8) & 255;
  return bytes;
}

function u32(value) {
  const bytes = new Uint8Array(4);
  bytes[0] = value & 255;
  bytes[1] = (value >>> 8) & 255;
  bytes[2] = (value >>> 16) & 255;
  bytes[3] = (value >>> 24) & 255;
  return bytes;
}

function concatBytes() {
  let length = 0;
  for (let i = 0; i < arguments.length; i++) length += arguments[i].length;
  const out = new Uint8Array(length);
  let offset = 0;
  for (let i = 0; i < arguments.length; i++) {
    out.set(arguments[i], offset);
    offset += arguments[i].length;
  }
  return out;
}

const CRC_TABLE = (function() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) crc = CRC_TABLE[(crc ^ bytes[i]) & 255] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function formatFloat(number) {
  return Number(number.toFixed(5)).toString();
}

function sanitizeName(name) {
  return String(name || 'model').replace(/[^a-z0-9_-]+/gi, '_');
}

function escapeXml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}
