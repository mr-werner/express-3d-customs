/* Express 3D Customs theme: small front-end helpers. */
(function () {
  "use strict";

  // Header shadow once the page scrolls
  var header = document.querySelector(".e3d-site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 24); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function setSelect(select, match) {
    if (!select) return false;
    var wanted = String(match).trim().toLowerCase();
    var option = Array.prototype.find.call(select.options, function (o) {
      return o.value.toLowerCase() === wanted || o.text.trim().toLowerCase() === wanted;
    });
    if (!option) return false;
    select.value = option.value;
    select.dispatchEvent(new Event("input", { bubbles: true }));
    select.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  function goToDesigner() {
    var narrow = window.matchMedia("(max-width: 980px)").matches;
    var target = narrow ? document.querySelector("#coverPreview") : document.querySelector(".e3d-designer-section");
    if (target) target.scrollIntoView({ behavior: "smooth", block: narrow ? "center" : "start" });
  }

  var hasDesigner = function () { return !!document.querySelector("#frontPattern"); };
  var designerUrl = (window.E3D_THEME && window.E3D_THEME.designerUrl) || "/";

  // Pattern cards: the card's label is the pattern name ("Wedge Bloom")
  document.querySelectorAll(".e3d-pattern-card").forEach(function (card) {
    var label = card.querySelector("p");
    if (!label) return;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", "Try " + label.textContent.trim() + " in the designer");
    var go = function () {
      if (!hasDesigner()) { window.location.href = designerUrl; return; }
      setSelect(document.querySelector("#frontPattern"), label.textContent);
      goToDesigner();
    };
    card.addEventListener("click", go);
    card.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  });

  // Color list: each item's text is the color name ("Navy Blue")
  document.querySelectorAll(".e3d-color-list li").forEach(function (item) {
    var name = item.textContent.trim();
    item.setAttribute("role", "button");
    item.setAttribute("tabindex", "0");
    var go = function () {
      if (!hasDesigner()) { window.location.href = designerUrl; return; }
      setSelect(document.querySelector("#faceColorSelect"), name);
      setSelect(document.querySelector("#wallColorSelect"), name);
      goToDesigner();
    };
    item.addEventListener("click", go);
    item.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  });

  // If the designer markup is on the page but its 3D script never loaded, offer the designer page instead.
  window.addEventListener("load", function () {
    var embed = document.querySelector(".e3d-designer-embed");
    if (!embed || !embed.querySelector("#coverPreview")) return;
    setTimeout(function () {
      if (typeof window.THREE !== "undefined") return;
      var note = document.createElement("div");
      note.className = "e3d-designer-fallback";
      note.innerHTML = '<p>The 3D designer opens on its own page.</p><p><a class="wp-element-button" href="' + designerUrl + '">Open the designer</a></p>';
      embed.replaceChildren(note);
    }, 1500);
  });
})();
