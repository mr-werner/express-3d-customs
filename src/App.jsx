import React, { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Box, Check, ChevronDown, Layers, Menu, Palette, Ruler, ShoppingBag, Sparkles, Star, X } from "lucide-react";
import Designer, { applyToDesigner } from "./Designer.jsx";
import { CLIENT_PORTAL, ConceptWidget, StudioCredit } from "./concept.jsx";
import { EDIT_MODE, ed, useSite } from "./editable.jsx";
import { BUILD_COUNT, FAQ_COUNT, STEP_COUNT } from "./site-fields.js";
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

// Text, links, photos, colors and sizes the client can edit live in site-fields.js
const ABBR = "e3d";

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

function Rating({ size = 15 }) {
  return (
    <span className="stars" aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={size} fill="currentColor" strokeWidth={0} />)}
    </span>
  );
}

function AnnouncementBar() {
  const c = useSite();
  return (
    <div className="announce">
      <div className="wrap announce-inner">
        <span {...ed("announce.left")}><Sparkles size={14} /> {c("announce.left")}</span>
        <a href={c("link.reviews")} target="_blank" rel="noopener noreferrer" {...ed("announce.right")}><Rating size={12} /> {c("announce.right")}</a>
      </div>
    </div>
  );
}

function Header() {
  const c = useSite();
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
        <a className="brand" href="#top" aria-label={`${c("company")} home`}>
          <img src={c("img.logo")} alt={`${c("company")}: Purpose in every layer`} width="800" height="372" {...ed("img.logo", "size.logo")} />
        </a>
        <nav className={`nav${open ? " is-open" : ""}`} aria-label="Main">
          {NAV.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
          <a className="nav-shop" href={c("link.etsy")} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} {...ed("header.shop")}><ShoppingBag size={16} /> {c("header.shop")}</a>
        </nav>
        <a className="btn btn-red header-cta" href="#designer" {...ed("header.cta")}>{c("header.cta")}</a>
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
  const c = useSite();
  return (
    <section className="hero" id="top">
      <div className="hero-grid-bg" aria-hidden="true" />
      <div className="wrap hero-inner">
        <div className="hero-copy">
          <p className="eyebrow" {...ed("hero.eyebrow")}><span className="eyebrow-dot" /> {c("hero.eyebrow")}</p>
          <h1 {...ed("hero.title")}>{c("hero.title")} <span className="hl" {...ed("hero.highlight")}>{c("hero.highlight")}</span></h1>
          <p className="lede" {...ed("hero.lede")}>{c("hero.lede")}</p>
          <div className="hero-ctas">
            <a className="btn btn-red btn-lg" href="#designer" {...ed("hero.cta")}>{c("hero.cta")} <ArrowRight size={18} /></a>
            <a className="btn btn-ghost btn-lg" href="#patterns" {...ed("hero.cta2")}>{c("hero.cta2")}</a>
          </div>
          <dl className="hero-stats">
            {[0, 1, 2, 3].map((i) => (
              <div key={i}>
                <dt {...ed(`hero.stat${i}.value`)}>{c(`hero.stat${i}.value`)}{i === 1 && <Star size={16} fill="currentColor" strokeWidth={0} />}</dt>
                <dd {...ed(`hero.stat${i}.label`)}>{c(`hero.stat${i}.label`)}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="hero-visual" {...ed("img.hero", "size.heroPhoto")}>
          <figure className="hero-photo">
            <img src={c("img.hero")} alt="Three custom 3D printed door chime covers in black, beige and white on a wooden shelf" width="1080" height="810" />
          </figure>
          <figure className="hero-photo hero-photo-small" {...ed("img.heroSmall")}>
            <img src={c("img.heroSmall")} alt="Two-tone gold and black Arches chime cover" width="760" height="468" />
          </figure>
          <div className="hero-chip">
            <NozzlePath />
            <div>
              <strong {...ed("hero.chipTitle")}>{c("hero.chipTitle")}</strong>
              <span {...ed("hero.chipText")}>{c("hero.chipText")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DesignerSection() {
  const c = useSite();
  return (
    <section className="designer-section" id="designer" aria-labelledby="designer-title">
      <div className="wrap">
        <div className="designer-head">
          <div>
            <p className="eyebrow" {...ed("designer.eyebrow")}><span className="eyebrow-dot" /> {c("designer.eyebrow")}</p>
            <h2 id="designer-title" {...ed("designer.title")}>{c("designer.title")}</h2>
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
  const c = useSite();
  return (
    <section className="section patterns" id="patterns" aria-labelledby="patterns-title">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow dark" {...ed("patterns.eyebrow")}><span className="eyebrow-dot" /> {c("patterns.eyebrow")}</p>
          <h2 id="patterns-title" {...ed("patterns.title")}>{c("patterns.title")}</h2>
          <p {...ed("patterns.text")}>{c("patterns.text")}</p>
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
  const c = useSite();
  return (
    <section className="section colors" aria-labelledby="colors-title">
      <div className="wrap colors-grid">
        <div>
          <p className="eyebrow dark" {...ed("colors.eyebrow")}><span className="eyebrow-dot" /> {c("colors.eyebrow")}</p>
          <h2 id="colors-title" {...ed("colors.title")}>{c("colors.title")}</h2>
          <p {...ed("colors.text")}>{c("colors.text")}</p>
          <p className="muted-note" {...ed("colors.note")}><span className="premium-dot">$</span> {c("colors.note")}</p>
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
        <figure className="colors-photo" {...ed("img.colors")}><img src={c("img.colors")} alt="A spread of custom chime covers in many patterns and colors" loading="lazy" width="794" height="794" /></figure>
      </div>
    </section>
  );
}

function Measure() {
  const c = useSite();
  return (
    <section className="section measure" id="measure" aria-labelledby="measure-title">
      <div className="wrap measure-grid">
        <div className="measure-copy">
          <p className="eyebrow dark" {...ed("measure.eyebrow")}><span className="eyebrow-dot" /> {c("measure.eyebrow")}</p>
          <h2 id="measure-title" {...ed("measure.title")}>{c("measure.title")}</h2>
          <ol className="measure-list">
            <li><span>W</span><div><strong>Width</strong> outside edge to outside edge of the chime's backplate.</div></li>
            <li><span>H</span><div><strong>Height</strong> top to bottom of the backplate.</div></li>
            <li><span>D</span><div><strong>Depth</strong> from the wall to the part that sticks out the furthest.</div></li>
          </ol>
          <p {...ed("measure.text")}>{c("measure.text")}</p>
          <a className="btn btn-dark" href="#designer" {...ed("measure.cta")}>{c("measure.cta")} <ArrowRight size={17} /></a>
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
            <img src={c("img.measure")} alt="Exposed tube and bell chimes that Express 3D Customs has covered" loading="lazy" width="730" height="349" {...ed("img.measure")} />
            <figcaption {...ed("measure.caption")}>{c("measure.caption")}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const c = useSite();
  return (
    <section className="section how" aria-labelledby="how-title">
      <div className="wrap">
        <div className="section-head on-dark">
          <p className="eyebrow" {...ed("how.eyebrow")}><span className="eyebrow-dot" /> {c("how.eyebrow")}</p>
          <h2 id="how-title" {...ed("how.title")}>{c("how.title")}</h2>
        </div>
        <ol className="layers">
          {Array.from({ length: STEP_COUNT }, (_, i) => (
            <li key={i} style={{ "--i": i }}>
              <span className="layer-no">L{String(i + 1).padStart(2, "0")}</span>
              <h3 {...ed(`how.${i}.title`)}>{c(`how.${i}.title`)}</h3>
              <p {...ed(`how.${i}.text`)}>{c(`how.${i}.text`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Reviews() {
  const c = useSite();
  return (
    <section className="section reviews" id="reviews" aria-labelledby="reviews-title">
      <div className="wrap">
        <div className="reviews-head">
          <div>
            <p className="eyebrow dark" {...ed("reviews.eyebrow")}><span className="eyebrow-dot" /> {c("reviews.eyebrow")}</p>
            <h2 id="reviews-title" {...ed("reviews.title")}>{c("reviews.title")}</h2>
          </div>
          <a className="review-badge" href={c("link.reviews")} target="_blank" rel="noopener noreferrer" {...ed("reviews.badge")}>
            <strong>4.9</strong><Rating /><span>{c("reviews.badge")}</span><ArrowUpRight size={16} />
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
        <p className="reviews-source">Quoted word for word from the {c("company")} shop reviews on Etsy.</p>
      </div>
    </section>
  );
}

function MoreBuilds() {
  const c = useSite();
  return (
    <section className="section builds" id="shop" aria-labelledby="builds-title">
      <div className="wrap">
        <div className="section-head on-dark split">
          <div>
            <p className="eyebrow" {...ed("builds.eyebrow")}><span className="eyebrow-dot" /> {c("builds.eyebrow")}</p>
            <h2 id="builds-title" {...ed("builds.title")}>{c("builds.title")}</h2>
          </div>
          <a className="btn btn-cream" href={c("link.etsy")} target="_blank" rel="noopener noreferrer" {...ed("builds.cta")}>{c("builds.cta")} <ArrowUpRight size={17} /></a>
        </div>
        <div className="build-grid">
          {Array.from({ length: BUILD_COUNT }, (_, i) => (
            <article key={i} className="build">
              <img src={c(`builds.${i}.img`)} alt="" loading="lazy" width="760" height="468" {...ed(`builds.${i}.img`)} />
              <div><h3 {...ed(`builds.${i}.title`)}>{c(`builds.${i}.title`)}</h3><p {...ed(`builds.${i}.text`)}>{c(`builds.${i}.text`)}</p></div>
            </article>
          ))}
        </div>
        <div className="custom-band">
          <div>
            <h3 {...ed("builds.customTitle")}>{c("builds.customTitle")}</h3>
            <p {...ed("builds.customText")}>{c("builds.customText")}</p>
          </div>
          <a className="btn btn-red" href={c("link.etsy")} target="_blank" rel="noopener noreferrer" {...ed("builds.customCta")}>{c("builds.customCta")} <ArrowUpRight size={17} /></a>
        </div>
      </div>
    </section>
  );
}

function About() {
  const c = useSite();
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="wrap about-grid">
        <figure className="about-photo">
          <img src={c("img.about")} alt="White Arches door chime cover" loading="lazy" width="794" height="794" {...ed("img.about")} />
          <img className="about-crest" src={c("img.crest")} alt={`${c("company")} logo`} loading="lazy" width="500" height="210" {...ed("img.crest")} />
        </figure>
        <div>
          <p className="eyebrow dark" {...ed("about.eyebrow")}><span className="eyebrow-dot" /> {c("about.eyebrow")}</p>
          <h2 id="about-title" {...ed("about.title")}>{c("about.title")}</h2>
          <p {...ed("about.p1")}>{c("about.p1")}</p>
          <p {...ed("about.p2")}>{c("about.p2")}</p>
          <ul className="about-points">
            {[0, 1, 2].map((i) => c(`about.point${i}`) && <li key={i} {...ed(`about.point${i}`)}><Check size={18} /> {c(`about.point${i}`)}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const c = useSite();
  return (
    <section className="section faq" id="faq" aria-labelledby="faq-title">
      <div className="wrap faq-grid">
        <div>
          <p className="eyebrow dark" {...ed("faq.eyebrow")}><span className="eyebrow-dot" /> {c("faq.eyebrow")}</p>
          <h2 id="faq-title" {...ed("faq.title")}>{c("faq.title")}</h2>
          <p {...ed("faq.text")}>{c("faq.text")}</p>
        </div>
        <div className="faq-list-site">
          {Array.from({ length: FAQ_COUNT }, (_, i) => c(`faq.${i}.q`) && (
            <details key={i} open={i === 0}>
              <summary {...ed(`faq.${i}.q`)}>{c(`faq.${i}.q`)}<ChevronDown size={18} /></summary>
              <p {...ed(`faq.${i}.a`)}>{c(`faq.${i}.a`)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  const c = useSite();
  return (
    <section className="final-cta">
      <div className="wrap final-inner">
        <NozzlePath className="final-nozzle" />
        <h2 {...ed("final.title")}>{c("final.title")}</h2>
        <a className="btn btn-red btn-lg" href="#designer" {...ed("final.cta")}>{c("final.cta")} <ArrowRight size={18} /></a>
      </div>
    </section>
  );
}

function Footer() {
  const c = useSite();
  const email = c("contact.email");
  const phone = c("contact.phone");
  const socials = [["Instagram", c("link.instagram")], ["Facebook", c("link.facebook")]].filter(([, href]) => href);
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <img className="footer-logo" src={c("img.logo")} alt={c("company")} width="800" height="372" loading="lazy" {...ed("img.logo", "size.footerLogo")} />
          <p {...ed("footer.blurb")}>{c("footer.blurb")}</p>
          {(email || phone) && (
            <p className="footer-contact">
              {phone && <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} {...ed("contact.phone")}>{phone}</a>}
              {email && <a href={`mailto:${email}`} {...ed("contact.email")}>{email}</a>}
            </p>
          )}
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
          <a href={c("link.etsy")} target="_blank" rel="noopener noreferrer" {...ed("link.etsy")}>Etsy shop</a>
          <a href={c("link.custom")} target="_blank" rel="noopener noreferrer" {...ed("link.custom")}>Custom chime covers on Etsy</a>
          <a href={c("link.reviews")} target="_blank" rel="noopener noreferrer" {...ed("link.reviews")}>Reviews</a>
          {socials.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" {...ed(`link.${label.toLowerCase()}`)}>{label}</a>)}
        </div>
        <div>
          <h3>Pay with</h3>
          <p className="small" {...ed("footer.pay")}>{c("footer.pay")}</p>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} {c("company")}. Preview build for client review.</span>
        <a className="footer-portal" href={CLIENT_PORTAL} target="_blank" rel="noopener noreferrer">Client sign in</a>
        <StudioCredit />
      </div>
    </footer>
  );
}

export default function App() {
  const c = useSite();
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
      {/* The preview card would cover the page inside the portal editor */}
      {!EDIT_MODE && <ConceptWidget company={c("company")} abbr={ABBR} />}
    </>
  );
}
