import wordmark from "./assets/e3c-wordmark.jpg";
import crest from "./assets/e3c-crest.jpg";
import lifestyle from "./assets/shop/chime-lifestyle.jpg";
import dualTone from "./assets/shop/dual-tone-arches.jpg";
import archesWhite from "./assets/shop/arches-white.jpg";
import combos from "./assets/shop/combos-dark.jpg";
import exposedChimes from "./assets/shop/exposed-chimes.jpg";
import kef from "./assets/shop/kef-grille.jpg";
import ornithopter from "./assets/shop/dune-ornithopter.jpg";
import jango from "./assets/shop/jango-starship.jpg";
import cubby from "./assets/shop/odyssey-cubby.jpg";

// Everything the client can change in the portal's site editor, with the built-in content as defaults.
// Keys are stored in the database, so rename one only with a migration of site_content.
// Clearing a text field hides it on the page.

const G = {
  style: "Colors & style",
  sizes: "Sizes",
  brand: "Logo",
  links: "Contact & links",
  top: "Top bar & header",
  hero: "Hero",
  designer: "Cover designer",
  patterns: "Patterns",
  colors: "Filament colors",
  measure: "Measuring",
  how: "How it works",
  reviews: "Reviews",
  builds: "More builds",
  about: "About",
  faq: "FAQ",
  final: "Closing banner",
  footer: "Footer",
};

// Site-wide groups first, then one group per designed section
export const GROUPS = Object.values(G);

// The home page's designed sections, in their original order. The editor can hide and
// reorder them; `group` is where their text lives in the editor.
export const BUILTINS = [
  { id: "hero", label: "Hero", group: G.hero },
  { id: "designer", label: "Cover designer", group: G.designer },
  { id: "patterns", label: "Patterns", group: G.patterns },
  { id: "colors", label: "Filament colors", group: G.colors },
  { id: "measure", label: "Measuring", group: G.measure },
  { id: "how", label: "How it works", group: G.how },
  { id: "reviews", label: "Reviews", group: G.reviews },
  { id: "builds", label: "More builds", group: G.builds },
  { id: "about", label: "About", group: G.about },
  { id: "faq", label: "FAQ", group: G.faq },
  { id: "final", label: "Closing banner", group: G.final },
];

const text = (key, group, label, value, extra = {}) => ({ key, group, label, type: "text", default: value, ...extra });
const para = (key, group, label, value, extra = {}) => ({ key, group, label, type: "textarea", default: value, rows: 4, ...extra });
const link = (key, group, label, value, extra = {}) => ({ key, group, label, type: "link", default: value, ...extra });
const image = (key, group, label, value, extra = {}) => ({ key, group, label, type: "image", default: value, ...extra });
const list = (key, group, label, itemLabel, itemFields, value, max = 24) => ({ key, group, label, type: "list", itemLabel, itemFields, default: value, max });
const color = (key, label, value, cssVar, help) => ({ key, group: G.style, label, type: "color", default: value, cssVar, help });
const size = (key, label, value, min, max, cssVar, extra = {}) => ({ key, group: G.sizes, label, type: "size", default: value, min, max, unit: "px", cssVar, ...extra });
const item = (key, label, type = "text", value = "", extra = {}) => ({ key, label, type, default: value, ...extra });

export const FIELDS = [
  color("color.accent", "Accent (buttons, highlights)", "#c34b3c", "--red"),
  color("color.dark", "Dark background", "#283033", "--char", "Header, hero, footer and dark sections."),
  color("color.light", "Light accent", "#f2ddb9", "--cream", "Headings and text on dark backgrounds."),
  color("color.page", "Page background", "#f6efe2", "--paper"),
  color("color.panel", "Light panels", "#faf3e6", "--cream-2", "FAQ background and light text in the hero."),
  color("color.text", "Body text", "#283033", "--text"),

  size("size.logo", "Logo height", 62, 36, 100, "--logo-h", { help: "You can also drag the handle on the logo." }),
  size("size.heroPhoto", "Hero photo height", 520, 380, 720, "--hero-visual-h", { help: "You can also drag the handle on the hero photos.", step: 10 }),
  size("size.text", "Body text size", 17, 15, 20, "--text-size"),
  size("size.headings", "Heading size", 100, 80, 125, "--heading-scale", { unit: "%", cssUnit: "", help: "Scales every section heading." }),
  size("size.spacing", "Space between sections", 110, 60, 160, "--section-pad", { step: 2 }),
  size("size.corners", "Corner roundness", 14, 0, 28, "--r"),
  size("size.footerLogo", "Footer logo width", 240, 140, 360, "--footer-logo-w", { axis: "x", help: "You can also drag the handle on the footer logo." }),

  image("img.logo", G.brand, "Logo (header and footer)", wordmark, { help: "A wide logo on a dark background works best." }),
  image("img.crest", G.brand, "Badge logo (About section)", crest, { optional: true }),

  text("company", G.links, "Business name", "Express 3D Customs"),
  { key: "contact.email", group: G.links, label: "Email (shown in the footer)", type: "email", default: "", placeholder: "you@example.com", help: "Leave blank to hide." },
  { key: "contact.phone", group: G.links, label: "Phone (shown in the footer)", type: "phone", default: "", placeholder: "(970) 555-0123", help: "Leave blank to hide." },
  link("link.etsy", G.links, "Etsy shop link", "https://www.etsy.com/shop/Express3DCustoms"),
  link("link.reviews", G.links, "Etsy reviews link", "https://www.etsy.com/shop/Express3DCustoms#reviews"),
  link("link.custom", G.links, "Custom chime cover listing link", "https://www.etsy.com/listing/1697672354/custom-doorbell-chime-covers-choose-size"),
  link("link.instagram", G.links, "Instagram link", "", { placeholder: "https://instagram.com/…", help: "Leave blank to hide." }),
  link("link.facebook", G.links, "Facebook link", "", { placeholder: "https://facebook.com/…", help: "Leave blank to hide." }),

  text("announce.left", G.top, "Top bar, left", "Made to order in Windsor, Colorado"),
  text("announce.right", G.top, "Top bar, right", "4.9 from 1,100+ Etsy reviews · Etsy Star Seller"),
  text("header.cta", G.top, "Header button", "Design your cover"),
  text("header.shop", G.top, "Shop link text", "Etsy shop"),

  text("hero.eyebrow", G.hero, "Small label", "Custom door chime covers"),
  text("hero.title", G.hero, "Headline", "That ugly doorbell chime?"),
  text("hero.highlight", G.hero, "Headline, highlighted line", "Make it the nicest thing on the wall."),
  para("hero.lede", G.hero, "Intro paragraph", "Enter your chime's measurements, pick a pattern and color, and spin your cover in 3D with a live price before it's printed for you, layer by layer, in Windsor, Colorado."),
  text("hero.cta", G.hero, "Main button", "Start designing"),
  text("hero.cta2", G.hero, "Second button", "Browse patterns"),
  list("hero.stats", G.hero, "Stats", "Stat", [item("value", "Number"), item("label", "Label")], [
    { value: "7,500+", label: "Etsy sales" },
    { value: "4.9 ★", label: "1,100+ reviews" },
    { value: "10 × 15", label: "patterns × colors" },
    { value: "16\"", label: "max size, any shape" },
  ], 4),
  image("img.hero", G.hero, "Main photo", lifestyle),
  image("img.heroSmall", G.hero, "Small photo", dualTone, { optional: true }),
  text("hero.chipTitle", G.hero, "Photo badge, bold line", "Fits NuTone, Broan-NuTone & Newhouse"),
  text("hero.chipText", G.hero, "Photo badge, small line", "and almost any chime you can measure"),

  text("designer.eyebrow", G.designer, "Small label", "Live 3D cover designer"),
  text("designer.title", G.designer, "Heading", "Build your cover. See it before we print it."),

  text("patterns.eyebrow", G.patterns, "Small label", "Front patterns"),
  text("patterns.title", G.patterns, "Heading", "Ten front patterns. Tap one to try it."),
  para("patterns.text", G.patterns, "Paragraph", "These are the exact cutout files the printer uses. Pick one and it loads straight into the designer, or keep the front blank for a clean, solid cover."),

  text("colors.eyebrow", G.colors, "Small label", "15 filament colors"),
  text("colors.title", G.colors, "Heading", "One color, or two."),
  para("colors.text", G.colors, "Paragraph", "Match your trim, your hardware or your wall. Pick a different wall color from the face color for a two-tone cover; the small two-tone fee is added automatically."),
  text("colors.note", G.colors, "Premium note", "Gold, Silver and Copper are premium silk filaments, +$2."),
  image("img.colors", G.colors, "Photo", combos, { optional: true }),

  text("measure.eyebrow", G.measure, "Small label", "Accurate measurements = perfect fit"),
  text("measure.title", G.measure, "Heading", "Measure the backplate, not the old cover."),
  para("measure.text", G.measure, "Paragraph", "Round up to the nearest 1/16\". The cover slides over the backplate and stays put with friction and gravity. No hardware needed. Want a looser fit? Oversize it and hang it from two finishing nails."),
  text("measure.cta", G.measure, "Button", "Enter my measurements"),
  image("img.measure", G.measure, "Photo", exposedChimes, { optional: true }),
  text("measure.caption", G.measure, "Photo caption", "Exposed tubes or bells? Most setups can be covered at no extra cost."),

  text("how.eyebrow", G.how, "Small label", "How it works"),
  text("how.title", G.how, "Heading", "From five minutes with a tape measure to a printed cover."),
  list("how.steps", G.how, "Steps", "Step", [item("title", "Title"), item("text", "Text", "textarea", "", { rows: 3 })], [
    { title: "Measure your chime", text: "Outside width, height and depth of the chime's backplate (wall to the furthest part), not the old cover. Round up to the nearest 1/16\"." },
    { title: "Design it", text: "Pick a front pattern, a side style and one or two colors. Add notes about anything unusual." },
    { title: "Preview in 3D", text: "Spin the cover, check the proportions and see the live price before you order." },
    { title: "Add to cart", text: "Your dimensions, patterns, colors and bell clearance are saved with the order." },
    { title: "We review and print", text: "Mike and Bekah check the fit details, confirm the design and print it in Windsor, Colorado." },
  ], 8),

  text("reviews.eyebrow", G.reviews, "Small label", "Etsy reviews"),
  text("reviews.title", G.reviews, "Heading", "4.9 stars from 1,100+ reviews."),
  text("reviews.badge", G.reviews, "Badge text", "Etsy Star Seller · 7,500+ sales"),

  text("builds.eyebrow", G.builds, "Small label", "Beyond chime covers"),
  text("builds.title", G.builds, "Heading", "If it needs a part, a mount or a fix, we'll print it."),
  text("builds.cta", G.builds, "Button", "See all 60+ items on Etsy"),
  list("builds.cards", G.builds, "Cards", "Card", [item("img", "Photo", "image", "", { optional: true }), item("title", "Title"), item("text", "Text", "textarea", "", { rows: 3 })], [
    { img: jango, title: "LEGO & display mounts", text: "Wall and table mounts for UCS Venator, Star Destroyer, Death Star, Firespray, N-1 Starfighter, Enterprise-D and more." },
    { img: ornithopter, title: "Display stands", text: "Made-to-fit stands like the Dune Ornithopter (10327) and the Firespray (75409)." },
    { img: kef, title: "Replacement parts", text: "KEF Q Series speaker grilles, Wyze vacuum canisters, eBike throttles and handles." },
    { img: cubby, title: "Car & home fixes", text: "Honda Odyssey console cubbies, hitch covers, light switch covers and Pit Boss adapters." },
  ], 12),
  text("builds.customTitle", G.builds, "Custom project heading", "Have a custom project?"),
  para("builds.customText", G.builds, "Custom project text", "Something broke and there's no replacement? Need a mount that doesn't exist yet? Send a message with photos and rough measurements."),
  text("builds.customCta", G.builds, "Custom project button", "Message us on Etsy"),

  text("about.eyebrow", G.about, "Small label", "Purpose in every layer"),
  text("about.title", G.about, "Heading", "It started with one printer and one ugly chime."),
  para("about.p1", G.about, "First paragraph", "Mike & Bekah started Express 3D Customs in Windsor, Colorado with a single 3D printer. When they went looking for a nicer cover for their own doorbell chime, there wasn't one on the market, so they designed one."),
  para("about.p2", G.about, "Second paragraph", "Thousands of orders later, every cover is still made to order to the customer's own measurements, along with display mounts, replacement parts and custom solutions for things nobody else makes. Practical design, made to fit, with less waste."),
  list("about.points", G.about, "Check points", "Point", [item("text", "Text")], [
    { text: "Made to your exact measurements" },
    { text: "Every design reviewed before it prints" },
    { text: "Small family business, Etsy Star Seller" },
  ], 8),
  image("img.about", G.about, "Photo", archesWhite, { optional: true }),

  text("faq.eyebrow", G.faq, "Small label", "FAQ"),
  text("faq.title", G.faq, "Heading", "Fit and finish questions."),
  para("faq.text", G.faq, "Paragraph", "Still unsure? Send a photo of your chime with the backplate measured, and we'll tell you what fits.", { rows: 3 }),
  list("faq.items", G.faq, "Questions", "Question", [item("q", "Question"), item("a", "Answer", "textarea", "", { rows: 4 })], [
    { q: "How should I measure my door chime?", a: "Measure the chime's backplate and components, not the old cover: the widest outside width, the tallest outside height, and the depth from the wall to the furthest part. Round up to the nearest 1/16\". The designer's measurement help shows examples." },
    { q: "How does the cover stay on?", a: "With accurate dimensions the cover slides over the backplate and stays put with friction and gravity, so no hardware is needed. If you'd rather oversize it, hang it from a pair of finishing nails for a clean, easily removable finish." },
    { q: "What if my bells hang below the backplate?", a: "Turn on the bell clearance cutout in step 4 of the designer. Enter the number of bells, their diameter and how far they sit from the wall, and the cover gets a matching cutout. Most exposed-chime setups can be accommodated at no extra cost." },
    { q: "How big can a cover be?", a: "Up to 16 inches in any direction. Any dimension of 10 inches or more adds a $10 oversize fee and $5 extra shipping, which the designer includes in the estimate." },
    { q: "Are the preview colors exact?", a: "Screen colors are approximate. Printed color can vary by filament brand, lighting and surface texture. Gold, Silver and Copper are premium silk filaments (+$2)." },
    { q: "Can I return a cover?", a: "Covers are made to your measurements, so covers made from incorrect dimensions can't be returned. Please double-check before ordering, or send a message if you're unsure." },
    { q: "How long does it take?", a: "Turnaround depends on size, materials and order volume. Express 3D Customs confirms timing after reviewing your design. Orders ship from Windsor, Colorado." },
    { q: "Can you make something that isn't a chime cover?", a: "Yes. Custom projects are how the shop started. Send a message with what you need, photos and rough measurements." },
  ], 30),

  text("final.title", G.final, "Heading", "Got a tape measure? You're five minutes from a better-looking hallway."),
  text("final.cta", G.final, "Button", "Open the designer"),

  para("footer.blurb", G.footer, "Description", "Custom 3D printed door chime covers, display mounts and replacement parts. Made to order in Windsor, Colorado by Mike & Bekah.", { rows: 3 }),
  para("footer.pay", G.footer, "Payment note", "Visa, Mastercard, Discover, PayPal, Apple Pay and Klarna on Etsy.", { rows: 2 }),
];
