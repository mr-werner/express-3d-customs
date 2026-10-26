import React, { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Box, Check, ChevronDown, Layers, Menu, Palette, Ruler, ShoppingBag, Sparkles, Star, X } from "lucide-react";
import Designer, { applyToDesigner } from "./Designer.jsx";
import { CLIENT_PORTAL, ConceptWidget, StudioCredit } from "./concept.jsx";
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
import reviewSarah from "./assets/shop/review-sarah.jpg";
import archesSvg from "./assets/patterns/arches.svg";
import anglesSvg from "./assets/patterns/angles.svg";
import diamondsSvg from "./assets/patterns/diamonds.svg";
import flowersSvg from "./assets/patterns/flowers.svg";
import linesSvg from "./assets/patterns/lines.svg";
import petalsSvg from "./assets/patterns/petals.svg";
import squaresSvg from "./assets/patterns/squares.svg";
import starsSvg from "./assets/patterns/stars.svg";
import trianglesSvg from "./assets/patterns/triangles.svg";
import wedgeSvg from "./assets/patterns/wedge-bloom.svg";

const COMPANY = "Express 3D Customs";
const ABBR = "e3d";
const OWNERS = "Mike & Bekah";
const LOCATION = "Windsor, Colorado";
const ETSY_SHOP = "https://www.etsy.com/shop/Express3DCustoms";
const ETSY_REVIEWS = "https://www.etsy.com/shop/Express3DCustoms#reviews";
const ETSY_CUSTOM_LISTING = "https://www.etsy.com/listing/1697672354/custom-doorbell-chime-covers-choose-size";

const NAV = [
  ["Designer", "#designer"],
  ["Patterns", "#patterns"],
  ["Measuring", "#measure"],
  ["Reviews", "#reviews"],
  ["More builds", "#shop"],
  ["About", "#about"],
  ["FAQ", "#faq"],
];

const PATTERNS = [
  { name: "Arches", img: archesSvg },
  { name: "Angles", img: anglesSvg },
  { name: "Diamonds", img: diamondsSvg },
  { name: "Flowers", img: flowersSvg },
  { name: "Lines", img: linesSvg },
  { name: "Petals", img: petalsSvg },
  { name: "Squares", img: squaresSvg },
  { name: "Stars", img: starsSvg },
  { name: "Triangles", img: trianglesSvg },
  { name: "Wedge Bloom", img: wedgeSvg },
];

const SIDE_PATTERNS = ["Blank", "Diamonds", "Squiggles", "Footballs", "Hex Gems"];

// Filament colors and swatch hex values from the live designer's settings.
const COLORS = [
  ["Black", "#050505"], ["White", "#e0deda"], ["Gold", "#e1c156", true], ["Silver", "#7d7d7d", true], ["Copper", "#b85a3e", true],
  ["Beige", "#eae9d4"], ["Gray", "#8c8d90"], ["Yellow", "#e4c207"], ["Orange", "#e55d06"], ["Red", "#931721"],
  ["Light Blue", "#2799f1"], ["Blue", "#0141ab"], ["Navy Blue", "#18215a"], ["Teal", "#018794"], ["Emerald Green", "#01342c"],
];

const STEPS = [
  ["Measure your chime", "Outside width, height and depth of the chime's backplate (wall to the furthest part), not the old cover. Round up to the nearest 1/16\"."],
  ["Design it", "Pick a front pattern, a side style and one or two colors. Add notes about anything unusual."],
  ["Preview in 3D", "Spin the cover, check the proportions and see the live price before you order."],
  ["Add to cart", "Your dimensions, patterns, colors and bell clearance are saved with the order."],
  ["We review and print", "Mike and Bekah check the fit details, confirm the design and print it in Windsor, Colorado."],
];

const SIZE_EXAMPLES = [
  ["X-Small", "3 × 6 × 1.5", "27"],
  ["Small", "5 × 4 × 1.875", "37.5"],
  ["Medium", "5 × 7 × 2", "70"],
  ["Large", "9 × 6 × 2.25", "122"],
  ["X-Large", "8 × 7.5 × 3", "180"],
  ["2X-Large", "8 × 6 × 5", "240"],
  ["3X-Large", "9 × 9 × 4", "324"],
  ["4X-Large", "10 × 10 × 4", "400"],
];

// Verbatim from the Express3DCustoms Etsy shop reviews (5 stars each), September 2026.
const REVIEWS = [
  { name: "Kristi", date: "Sep 23, 2026", text: "Exactly what I needed to cover an ancient doorbell in my new old apartment." },
  { name: "Sarah", date: "Sep 23, 2026", text: "I was going to buy a new doorbell chime because the one I had was so ugly.", photo: reviewSarah },
  { name: "Juan", date: "Sep 21, 2026", text: "Great item, a little pricey but they make them to order and custom sizes." },
  { name: "Valerie", date: "Sep 22, 2026", text: "Looks great in my living room - adds just the right touch to the house." },
  { name: "Etsy buyer", date: "Sep 1, 2026", text: "The quality was really good and holds on good" },
  { name: "Gloria", date: "Sep 6, 2026", text: "Easy to put on. I highly recommend." },
];

const BUILDS = [
  { img: jango, title: "LEGO & display mounts", text: "Wall and table mounts for UCS Venator, Star Destroyer, Death Star, Firespray, N-1 Starfighter, Enterprise-D and more." },
  { img: ornithopter, title: "Display stands", text: "Made-to-fit stands like the Dune Ornithopter (10327) and the Firespray (75409)." },
  { img: kef, title: "Replacement parts", text: "KEF Q Series speaker grilles, Wyze vacuum canisters, eBike throttles and handles." },
  { img: cubby, title: "Car & home fixes", text: "Honda Odyssey console cubbies, hitch covers, light switch covers and Pit Boss adapters." },
];

const FAQ = [
  ["How should I measure my door chime?", "Measure the chime's backplate and components, not the old cover: the widest outside width, the tallest outside height, and the depth from the wall to the furthest part. Round up to the nearest 1/16\". The designer's measurement help shows examples."],
  ["How does the cover stay on?", "With accurate dimensions the cover slides over the backplate and stays put with friction and gravity, so no hardware is needed. If you'd rather oversize it, hang it from a pair of finishing nails for a clean, easily removable finish."],
  ["What if my bells hang below the backplate?", "Turn on the bell clearance cutout in step 4 of the designer. Enter the number of bells, their diameter and how far they sit from the wall, and the cover gets a matching cutout. Most exposed-chime setups can be accommodated at no extra cost."],
  ["How big can a cover be?", "Up to 16 inches in any direction. Any dimension of 10 inches or more adds a $10 oversize fee and $5 extra shipping, which the designer includes in the estimate."],
  ["Are the preview colors exact?", "Screen colors are approximate. Printed color can vary by filament brand, lighting and surface texture. Gold, Silver and Copper are premium silk filaments (+$2)."],
  ["Can I return a cover?", "Covers are made to your measurements, so covers made from incorrect dimensions can't be returned. Please double-check before ordering, or send a message if you're unsure."],
  ["How long does it take?", "Turnaround depends on size, materials and order volume. Express 3D Customs confirms timing after reviewing your design. Orders ship from Windsor, Colorado."],
  ["Can you make something that isn't a chime cover?", "Yes. Custom projects are how the shop started. Send a message with what you need, photos and rough measurements."],
];

function Rating({ size = 15 }) {
  return (
    <span className="stars" aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={size} fill="currentColor" strokeWidth={0} />)}
    </span>
  );
}

function AnnouncementBar() {
  return (
    <div className="announce">
      <div className="wrap announce-inner">
        <span><Sparkles size={14} /> Made to order in {LOCATION}</span>
        <a href={ETSY_REVIEWS} target="_blank" rel="noopener noreferrer"><Rating size={12} /> 4.9 from 1,100+ Etsy reviews · Etsy Star Seller</a>
      </div>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="wrap header-inner">
        <a className="brand" href="#top" aria-label={`${COMPANY} home`}>
          <img src={wordmark} alt={`${COMPANY}: Purpose in every layer`} width="800" height="372" />
        </a>
        <nav className={`nav${open ? " is-open" : ""}`} aria-label="Main">
          {NAV.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
          <a className="nav-shop" href={ETSY_SHOP} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}><ShoppingBag size={16} /> Etsy shop</a>
        </nav>
        <a className="btn btn-red header-cta" href="#designer">Design your cover</a>
        <button className="menu-btn" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}

// The logo's extruder nozzle laying down zig-zag layers: the site's motif.
function NozzlePath({ className = "" }) {
  return (
    <svg className={`nozzle-path ${className}`} viewBox="0 0 220 140" aria-hidden="true">
      <g className="nozzle">
        <rect x="92" y="2" width="36" height="16" rx="2" />
        <path d="M96 22h28l-8 14h-12z" />
        <path d="M100 6h20M100 10h20M100 14h20" className="nozzle-fins" />
      </g>
      <path className="layer-line" d="M20 58h180v12H20v12h180v12H20v12h180v12H20" pathLength="1" />
    </svg>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-grid-bg" aria-hidden="true" />
      <div className="wrap hero-inner">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> Custom door chime covers</p>
          <h1>That ugly doorbell chime? <span className="hl">Make it the nicest thing on the wall.</span></h1>
          <p className="lede">
            Enter your chime's measurements, pick a pattern and color, and spin your cover in 3D with a live price before it's printed for you, layer by layer, in {LOCATION}.
          </p>
          <div className="hero-ctas">
            <a className="btn btn-red btn-lg" href="#designer">Start designing <ArrowRight size={18} /></a>
            <a className="btn btn-ghost btn-lg" href="#patterns">Browse patterns</a>
          </div>
          <dl className="hero-stats">
            <div><dt>7,500+</dt><dd>Etsy sales</dd></div>
            <div><dt>4.9 <Star size={16} fill="currentColor" strokeWidth={0} /></dt><dd>1,100+ reviews</dd></div>
            <div><dt>10 × 15</dt><dd>patterns × colors</dd></div>
            <div><dt>16"</dt><dd>max size, any shape</dd></div>
          </dl>
        </div>
        <div className="hero-visual">
          <figure className="hero-photo">
            <img src={lifestyle} alt="Three custom 3D printed door chime covers in black, beige and white on a wooden shelf" width="1080" height="810" />
          </figure>
          <figure className="hero-photo hero-photo-small">
            <img src={dualTone} alt="Two-tone gold and black Arches chime cover" width="760" height="468" />
          </figure>
          <div className="hero-chip">
            <NozzlePath />
            <div>
              <strong>Fits NuTone, Broan-NuTone & Newhouse</strong>
              <span>and almost any chime you can measure</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DesignerSection() {
  return (
    <section className="designer-section" id="designer" aria-labelledby="designer-title">
      <div className="wrap">
        <div className="designer-head">
          <div>
            <p className="eyebrow"><span className="eyebrow-dot" /> Live 3D cover designer</p>
            <h2 id="designer-title">Build your cover. See it before we print it.</h2>
          </div>
          <ol className="designer-steps">
            <li><Ruler size={18} /><span>Dimensions</span></li>
            <li><Layers size={18} /><span>Pattern</span></li>
            <li><Palette size={18} /><span>Color</span></li>
            <li><Box size={18} /><span>Fit details</span></li>
          </ol>
        </div>
      </div>
      <div className="designer-frame">
        <Designer />
      </div>
    </section>
  );
}

function Patterns() {
  return (
    <section className="section patterns" id="patterns" aria-labelledby="patterns-title">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow dark"><span className="eyebrow-dot" /> Front patterns</p>
          <h2 id="patterns-title">Ten front patterns. Tap one to try it.</h2>
          <p>These are the exact cutout files the printer uses. Pick one and it loads straight into the designer, or keep the front blank for a clean, solid cover.</p>
        </div>
        <div className="pattern-grid-cards">
          {PATTERNS.map((p) => (
            <button type="button" key={p.name} className="pattern-card" onClick={() => applyToDesigner({ pattern: p.name })}>
              <span className="pattern-plate"><img src={p.img} alt="" loading="lazy" width="486" height="342" /></span>
              <span className="pattern-name">{p.name}<ArrowUpRight size={16} /></span>
            </button>
          ))}
        </div>
        <div className="side-row">
          <span className="side-label">Side walls</span>
          {SIDE_PATTERNS.map((s) => <span key={s} className="side-pill">{s}</span>)}
          <span className="side-note">Set how many side cutouts, their size and spacing in the designer.</span>
        </div>
      </div>
    </section>
  );
}

function Colors() {
  return (
    <section className="section colors" aria-labelledby="colors-title">
      <div className="wrap colors-grid">
        <div>
          <p className="eyebrow dark"><span className="eyebrow-dot" /> 15 filament colors</p>
          <h2 id="colors-title">One color, or two.</h2>
          <p>Match your trim, your hardware or your wall. Pick a different wall color from the face color for a two-tone cover; the small two-tone fee is added automatically.</p>
          <p className="muted-note"><span className="premium-dot">$</span> Gold, Silver and Copper are premium silk filaments, +$2.</p>
        </div>
        <ul className="color-chips">
          {COLORS.map(([label, hex, premium]) => (
            <li key={label}>
              <button type="button" onClick={() => applyToDesigner({ color: label })} aria-label={`Try ${label} in the designer`}>
                <span className={`chip${premium ? " is-premium" : ""}`} style={{ "--chip": hex }} />
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
        <figure className="colors-photo"><img src={combos} alt="A spread of custom chime covers in many patterns and colors" loading="lazy" width="794" height="794" /></figure>
      </div>
    </section>
  );
}

function Measure() {
  return (
    <section className="section measure" id="measure" aria-labelledby="measure-title">
      <div className="wrap measure-grid">
        <div className="measure-copy">
          <p className="eyebrow dark"><span className="eyebrow-dot" /> Accurate measurements = perfect fit</p>
          <h2 id="measure-title">Measure the backplate, not the old cover.</h2>
          <ol className="measure-list">
            <li><span>W</span><div><strong>Width</strong> outside edge to outside edge of the chime's backplate.</div></li>
            <li><span>H</span><div><strong>Height</strong> top to bottom of the backplate.</div></li>
            <li><span>D</span><div><strong>Depth</strong> from the wall to the part that sticks out the furthest.</div></li>
          </ol>
          <p>Round up to the nearest 1/16". The cover slides over the backplate and stays put with friction and gravity. No hardware needed. Want a looser fit? Oversize it and hang it from two finishing nails.</p>
          <a className="btn btn-dark" href="#designer">Enter my measurements <ArrowRight size={17} /></a>
        </div>
        <div className="measure-table-wrap">
          <table className="measure-table">
            <caption>Typical chime sizes (H × W × D, inches)</caption>
            <thead><tr><th>Size</th><th>Example</th><th>Cubic in.</th></tr></thead>
            <tbody>
              {SIZE_EXAMPLES.map(([size, dims, vol]) => <tr key={size}><td>{size}</td><td>{dims}</td><td>{vol}</td></tr>)}
            </tbody>
          </table>
          <figure className="measure-photo">
            <img src={exposedChimes} alt="Exposed tube and bell chimes that Express 3D Customs has covered" loading="lazy" width="730" height="349" />
            <figcaption>Exposed tubes or bells? Most setups can be covered at no extra cost.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="section how" aria-labelledby="how-title">
      <div className="wrap">
        <div className="section-head on-dark">
          <p className="eyebrow"><span className="eyebrow-dot" /> How it works</p>
          <h2 id="how-title">From five minutes with a tape measure to a printed cover.</h2>
        </div>
        <ol className="layers">
          {STEPS.map(([title, text], i) => (
            <li key={title} style={{ "--i": i }}>
              <span className="layer-no">L{String(i + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section className="section reviews" id="reviews" aria-labelledby="reviews-title">
      <div className="wrap">
        <div className="reviews-head">
          <div>
            <p className="eyebrow dark"><span className="eyebrow-dot" /> Etsy reviews</p>
            <h2 id="reviews-title">4.9 stars from 1,100+ reviews.</h2>
          </div>
          <a className="review-badge" href={ETSY_REVIEWS} target="_blank" rel="noopener noreferrer">
            <strong>4.9</strong><Rating /><span>Etsy Star Seller · 7,500+ sales</span><ArrowUpRight size={16} />
          </a>
        </div>
        <div className="review-grid">
          {REVIEWS.map((r) => (
            <figure key={r.name + r.date} className={`review${r.photo ? " has-photo" : ""}`}>
              {r.photo && <img src={r.photo} alt={`Photo from ${r.name}'s review`} loading="lazy" width="300" height="300" />}
              <Rating size={14} />
              <blockquote>"{r.text}"</blockquote>
              <figcaption><strong>{r.name}</strong> · {r.date} · on Etsy</figcaption>
            </figure>
          ))}
        </div>
        <p className="reviews-source">Quoted word for word from the Express3DCustoms shop reviews on Etsy.</p>
      </div>
    </section>
  );
}

function MoreBuilds() {
  return (
    <section className="section builds" id="shop" aria-labelledby="builds-title">
      <div className="wrap">
        <div className="section-head on-dark split">
          <div>
            <p className="eyebrow"><span className="eyebrow-dot" /> Beyond chime covers</p>
            <h2 id="builds-title">If it needs a part, a mount or a fix, we'll print it.</h2>
          </div>
          <a className="btn btn-cream" href={ETSY_SHOP} target="_blank" rel="noopener noreferrer">See all 60+ items on Etsy <ArrowUpRight size={17} /></a>
        </div>
        <div className="build-grid">
          {BUILDS.map((b) => (
            <article key={b.title} className="build">
              <img src={b.img} alt="" loading="lazy" width="760" height="468" />
              <div><h3>{b.title}</h3><p>{b.text}</p></div>
            </article>
          ))}
        </div>
        <div className="custom-band">
          <div>
            <h3>Have a custom project?</h3>
            <p>Something broke and there's no replacement? Need a mount that doesn't exist yet? Send a message with photos and rough measurements.</p>
          </div>
          <a className="btn btn-red" href={ETSY_SHOP} target="_blank" rel="noopener noreferrer">Message us on Etsy <ArrowUpRight size={17} /></a>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="wrap about-grid">
        <figure className="about-photo">
          <img src={archesWhite} alt="White Arches door chime cover" loading="lazy" width="794" height="794" />
          <img className="about-crest" src={crest} alt="Express 3D Customs E3C logo" loading="lazy" width="500" height="210" />
        </figure>
        <div>
          <p className="eyebrow dark"><span className="eyebrow-dot" /> Purpose in every layer</p>
          <h2 id="about-title">It started with one printer and one ugly chime.</h2>
          <p>
            {OWNERS} started Express 3D Customs in {LOCATION} with a single 3D printer. When they went looking for a nicer cover for their own doorbell chime, there wasn't one on the market, so they designed one.
          </p>
          <p>
            Thousands of orders later, every cover is still made to order to the customer's own measurements, along with display mounts, replacement parts and custom solutions for things nobody else makes. Practical design, made to fit, with less waste.
          </p>
          <ul className="about-points">
            <li><Check size={18} /> Made to your exact measurements</li>
            <li><Check size={18} /> Every design reviewed before it prints</li>
            <li><Check size={18} /> Small family business, Etsy Star Seller</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="section faq" id="faq" aria-labelledby="faq-title">
      <div className="wrap faq-grid">
        <div>
          <p className="eyebrow dark"><span className="eyebrow-dot" /> FAQ</p>
          <h2 id="faq-title">Fit and finish questions.</h2>
          <p>Still unsure? Send a photo of your chime with the backplate measured, and we'll tell you what fits.</p>
        </div>
        <div className="faq-list-site">
          {FAQ.map(([q, a], i) => (
            <details key={q} open={i === 0}>
              <summary>{q}<ChevronDown size={18} /></summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="final-cta">
      <div className="wrap final-inner">
        <NozzlePath className="final-nozzle" />
        <h2>Got a tape measure? You're five minutes from a better-looking hallway.</h2>
        <a className="btn btn-red btn-lg" href="#designer">Open the designer <ArrowRight size={18} /></a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <img className="footer-logo" src={wordmark} alt={COMPANY} width="800" height="372" loading="lazy" />
          <p>Custom 3D printed door chime covers, display mounts and replacement parts. Made to order in {LOCATION} by {OWNERS}.</p>
        </div>
        <div>
          <h3>Design</h3>
          <a href="#designer">Cover designer</a>
          <a href="#patterns">Patterns</a>
          <a href="#measure">Measuring guide</a>
          <a href="#faq">FAQ</a>
        </div>
        <div>
          <h3>Shop</h3>
          <a href={ETSY_SHOP} target="_blank" rel="noopener noreferrer">Etsy shop</a>
          <a href={ETSY_CUSTOM_LISTING} target="_blank" rel="noopener noreferrer">Custom chime covers on Etsy</a>
          <a href={ETSY_REVIEWS} target="_blank" rel="noopener noreferrer">Reviews</a>
        </div>
        <div>
          <h3>Pay with</h3>
          <p className="small">Visa, Mastercard, Discover, PayPal, Apple Pay and Klarna on Etsy.</p>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} {COMPANY}. Preview build for client review.</span>
        <a className="footer-portal" href={CLIENT_PORTAL} target="_blank" rel="noopener noreferrer">Client sign in</a>
        <StudioCredit />
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <a className="skip" href="#designer">Skip to the designer</a>
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <DesignerSection />
        <Patterns />
        <Colors />
        <Measure />
        <HowItWorks />
        <Reviews />
        <MoreBuilds />
        <About />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <ConceptWidget company={COMPANY} abbr={ABBR} />
    </>
  );
}
