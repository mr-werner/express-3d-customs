import React, { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Box, Check, ChevronDown, Layers, Menu, Palette, Ruler, ShoppingBag, Sparkles, Star, X } from "lucide-react";
import Designer, { applyToDesigner } from "./Designer.jsx";
import { CLIENT_PORTAL, ConceptWidget, StudioCredit } from "./concept.jsx";
import { EDIT_MODE, HOME_ID, T, ed, usePages, useSite } from "./editable.jsx";
import { Section } from "./sections.jsx";
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

// Menu links to the home page's designed sections: [label, anchor, section id]
const NAV = [
  ["Designer", "#designer", "designer"],
  ["Patterns", "#patterns", "patterns"],
  ["Measuring", "#measure", "measure"],
  ["Reviews", "#reviews", "reviews"],
  ["More builds", "#shop", "builds"],
  ["About", "#about", "about"],
  ["FAQ", "#faq", "faq"],
];

// How sections added in the editor borrow this site's look (see sections.jsx)
const SECTION_UI = {
  wrapClass: "wrap",
  Eyebrow: ({ onDark, edit, children }) => (
    <p className={`eyebrow${onDark ? "" : " dark"}`} {...edit}><span className="eyebrow-dot" /> {children}</p>
  ),
  buttonClass: (variant, onDark, bg) => {
    if (variant === "banner") return `btn btn-lg ${bg === "accent" ? "btn-dark" : "btn-red"}`;
    if (variant === "primary") return "btn btn-red";
    return onDark ? "btn btn-ghost" : "btn btn-dark";
  },
};

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

// A link to a home page anchor that also works from the other pages
function useHomeLink() {
  const { page, navigate } = usePages();
  return (hash) => ({
    href: page.id === HOME_ID ? hash : `/${hash}`,
    onClick: page.id === HOME_ID ? undefined : (event) => { event.preventDefault(); navigate("", hash); },
  });
}

function AnnouncementBar() {
  const c = useSite();
  return (
    <div className="announce">
      <div className="wrap announce-inner">
        <T k="announce.left"><Sparkles size={14} /> </T>
        {c("announce.right") && (
          <a href={c("link.reviews")} target="_blank" rel="noopener noreferrer" {...ed("announce.right")}><Rating size={12} /> {c("announce.right")}</a>
        )}
      </div>
    </div>
  );
}

function Header() {
  const c = useSite();
  const { pages, page, navigate } = usePages();
  const homeLink = useHomeLink();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const home = pages[0];
  const shown = new Set(home.sections.filter((s) => !s.hidden).map((s) => s.id));
  const goTo = (slug) => (event) => { event.preventDefault(); setOpen(false); navigate(slug); };
  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="wrap header-inner">
        <a className="brand" href="/" aria-label={`${c("company")} home`} onClick={goTo("")} data-bws-page="">
          <img src={c("img.logo")} alt={c("company")} width="800" height="372" {...ed("img.logo", "size.logo")} />
        </a>
        <nav className={`nav${open ? " is-open" : ""}`} aria-label="Main">
          {NAV.filter(([, , id]) => shown.has(id)).map(([label, hash]) => {
            const { href, onClick } = homeLink(hash);
            return <a key={hash} href={href} onClick={(e) => { setOpen(false); onClick?.(e); }}>{label}</a>;
          })}
          {pages.filter((p) => p.nav).map((p) => (
            <a key={p.id} href={`/${p.slug}`} onClick={goTo(p.slug)} aria-current={p.id === page.id ? "page" : undefined} data-bws-page={p.slug}>{p.title}</a>
          ))}
          {c("header.shop") && (
            <a className="nav-shop" href={c("link.etsy")} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} {...ed("header.shop")}><ShoppingBag size={16} /> {c("header.shop")}</a>
          )}
        </nav>
        {c("header.cta") && shown.has("designer") && (
          <a className="btn btn-red header-cta" {...homeLink("#designer")} {...ed("header.cta")}>{c("header.cta")}</a>
        )}
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
  const smallPhoto = c("img.heroSmall");
  return (
    <section className="hero" id="top" {...ed("section:hero")}>
      <div className="hero-grid-bg" aria-hidden="true" />
      <div className="wrap hero-inner">
        <div className="hero-copy">
          <T k="hero.eyebrow" as="p" className="eyebrow"><span className="eyebrow-dot" /> </T>
          <h1>
            <T k="hero.title" />{" "}
            <T k="hero.highlight" className="hl" />
          </h1>
          <T k="hero.lede" as="p" className="lede" />
          <div className="hero-ctas">
            {c("hero.cta") && <a className="btn btn-red btn-lg" href="#designer" {...ed("hero.cta")}>{c("hero.cta")} <ArrowRight size={18} /></a>}
            <T k="hero.cta2" as="a" className="btn btn-ghost btn-lg" href="#patterns" />
          </div>
          {c("hero.stats").length > 0 && (
            <dl className="hero-stats" style={{ "--stats": c("hero.stats").length }} {...ed("hero.stats")}>
              {c("hero.stats").map((stat, i) => (
                <div key={i}>
                  <dt>{stat.value}</dt>
                  <dd>{stat.label}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        <div className="hero-visual" {...ed("img.hero", "size.heroPhoto")}>
          <figure className="hero-photo">
            {c("img.hero") && <img src={c("img.hero")} alt="Three custom 3D printed door chime covers in black, beige and white on a wooden shelf" width="1080" height="810" />}
          </figure>
          {smallPhoto && (
            <figure className="hero-photo hero-photo-small" {...ed("img.heroSmall")}>
              <img src={smallPhoto} alt="Two-tone gold and black Arches chime cover" width="760" height="468" />
            </figure>
          )}
          {(c("hero.chipTitle") || c("hero.chipText")) && (
            <div className="hero-chip">
              <NozzlePath />
              <div>
                <T k="hero.chipTitle" as="strong" />
                <T k="hero.chipText" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function DesignerSection() {
  return (
    <section className="designer-section" id="designer" aria-labelledby="designer-title" {...ed("section:designer")}>
      <div className="wrap">
        <div className="designer-head">
          <div>
            <T k="designer.eyebrow" as="p" className="eyebrow"><span className="eyebrow-dot" /> </T>
            <T k="designer.title" as="h2" id="designer-title" />
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
    <section className="section patterns" id="patterns" aria-labelledby="patterns-title" {...ed("section:patterns")}>
      <div className="wrap">
        <div className="section-head">
          <T k="patterns.eyebrow" as="p" className="eyebrow dark"><span className="eyebrow-dot" /> </T>
          <T k="patterns.title" as="h2" id="patterns-title" />
          <T k="patterns.text" as="p" />
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
    <section className="section colors" aria-labelledby="colors-title" {...ed("section:colors")}>
      <div className={`wrap colors-grid${c("img.colors") ? "" : " no-photo"}`}>
        <div>
          <T k="colors.eyebrow" as="p" className="eyebrow dark"><span className="eyebrow-dot" /> </T>
          <T k="colors.title" as="h2" id="colors-title" />
          <T k="colors.text" as="p" />
          <T k="colors.note" as="p" className="muted-note"><span className="premium-dot">$</span> </T>
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
        {c("img.colors") && <figure className="colors-photo" {...ed("img.colors")}><img src={c("img.colors")} alt="A spread of custom chime covers in many patterns and colors" loading="lazy" width="794" height="794" /></figure>}
      </div>
    </section>
  );
}

function Measure() {
  const c = useSite();
  return (
    <section className="section measure" id="measure" aria-labelledby="measure-title" {...ed("section:measure")}>
      <div className="wrap measure-grid">
        <div className="measure-copy">
          <T k="measure.eyebrow" as="p" className="eyebrow dark"><span className="eyebrow-dot" /> </T>
          <T k="measure.title" as="h2" id="measure-title" />
          <ol className="measure-list">
            <li><span>W</span><div><strong>Width</strong> outside edge to outside edge of the chime's backplate.</div></li>
            <li><span>H</span><div><strong>Height</strong> top to bottom of the backplate.</div></li>
            <li><span>D</span><div><strong>Depth</strong> from the wall to the part that sticks out the furthest.</div></li>
          </ol>
          <T k="measure.text" as="p" />
          {c("measure.cta") && <a className="btn btn-dark" href="#designer" {...ed("measure.cta")}>{c("measure.cta")} <ArrowRight size={17} /></a>}
        </div>
        <div className="measure-table-wrap">
          <table className="measure-table">
            <caption>Typical chime sizes (H × W × D, inches)</caption>
            <thead><tr><th>Size</th><th>Example</th><th>Cubic in.</th></tr></thead>
            <tbody>
              {SIZE_EXAMPLES.map(([size, dims, vol]) => <tr key={size}><td>{size}</td><td>{dims}</td><td>{vol}</td></tr>)}
            </tbody>
          </table>
          {c("img.measure") && (
            <figure className="measure-photo">
              <img src={c("img.measure")} alt="Exposed tube and bell chimes that Express 3D Customs has covered" loading="lazy" width="730" height="349" {...ed("img.measure")} />
              <T k="measure.caption" as="figcaption" />
            </figure>
          )}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const c = useSite();
  return (
    <section className="section how" aria-labelledby="how-title" {...ed("section:how")}>
      <div className="wrap">
        <div className="section-head on-dark">
          <T k="how.eyebrow" as="p" className="eyebrow"><span className="eyebrow-dot" /> </T>
          <T k="how.title" as="h2" id="how-title" />
        </div>
        <ol className="layers" {...ed("how.steps")}>
          {c("how.steps").map((step, i) => (
            <li key={i} style={{ "--i": i }}>
              <span className="layer-no">L{String(i + 1).padStart(2, "0")}</span>
              {step.title && <h3>{step.title}</h3>}
              {step.text && <p>{step.text}</p>}
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
    <section className="section reviews" id="reviews" aria-labelledby="reviews-title" {...ed("section:reviews")}>
      <div className="wrap">
        <div className="reviews-head">
          <div>
            <T k="reviews.eyebrow" as="p" className="eyebrow dark"><span className="eyebrow-dot" /> </T>
            <T k="reviews.title" as="h2" id="reviews-title" />
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
    <section className="section builds" id="shop" aria-labelledby="builds-title" {...ed("section:builds")}>
      <div className="wrap">
        <div className="section-head on-dark split">
          <div>
            <T k="builds.eyebrow" as="p" className="eyebrow"><span className="eyebrow-dot" /> </T>
            <T k="builds.title" as="h2" id="builds-title" />
          </div>
          {c("builds.cta") && <a className="btn btn-cream" href={c("link.etsy")} target="_blank" rel="noopener noreferrer" {...ed("builds.cta")}>{c("builds.cta")} <ArrowUpRight size={17} /></a>}
        </div>
        <div className="build-grid" {...ed("builds.cards")}>
          {c("builds.cards").map((card, i) => (
            <article key={i} className="build">
              {card.img && <img src={card.img} alt="" loading="lazy" width="760" height="468" />}
              <div>{card.title && <h3>{card.title}</h3>}{card.text && <p>{card.text}</p>}</div>
            </article>
          ))}
        </div>
        {(c("builds.customTitle") || c("builds.customText") || c("builds.customCta")) && (
          <div className="custom-band">
            <div>
              <T k="builds.customTitle" as="h3" />
              <T k="builds.customText" as="p" />
            </div>
            {c("builds.customCta") && <a className="btn btn-red" href={c("link.etsy")} target="_blank" rel="noopener noreferrer" {...ed("builds.customCta")}>{c("builds.customCta")} <ArrowUpRight size={17} /></a>}
          </div>
        )}
      </div>
    </section>
  );
}

function About() {
  const c = useSite();
  const photo = c("img.about");
  return (
    <section className="section about" id="about" aria-labelledby="about-title" {...ed("section:about")}>
      <div className={`wrap about-grid${photo ? "" : " no-photo"}`}>
        {photo && (
          <figure className="about-photo">
            <img src={photo} alt="White Arches door chime cover" loading="lazy" width="794" height="794" {...ed("img.about")} />
            {c("img.crest") && <img className="about-crest" src={c("img.crest")} alt={`${c("company")} logo`} loading="lazy" width="500" height="210" {...ed("img.crest")} />}
          </figure>
        )}
        <div>
          <T k="about.eyebrow" as="p" className="eyebrow dark"><span className="eyebrow-dot" /> </T>
          <T k="about.title" as="h2" id="about-title" />
          <T k="about.p1" as="p" />
          <T k="about.p2" as="p" />
          {c("about.points").length > 0 && (
            <ul className="about-points" {...ed("about.points")}>
              {c("about.points").map((point, i) => point.text && <li key={i}><Check size={18} /> {point.text}</li>)}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const c = useSite();
  return (
    <section className="section faq" id="faq" aria-labelledby="faq-title" {...ed("section:faq")}>
      <div className="wrap faq-grid">
        <div>
          <T k="faq.eyebrow" as="p" className="eyebrow dark"><span className="eyebrow-dot" /> </T>
          <T k="faq.title" as="h2" id="faq-title" />
          <T k="faq.text" as="p" />
        </div>
        <div className="faq-list-site" {...ed("faq.items")}>
          {c("faq.items").map((item, i) => item.q && (
            <details key={i} open={i === 0}>
              <summary>{item.q}<ChevronDown size={18} /></summary>
              {item.a && <p>{item.a}</p>}
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
    <section className="final-cta" {...ed("section:final")}>
      <div className="wrap final-inner">
        <NozzlePath className="final-nozzle" />
        <T k="final.title" as="h2" />
        {c("final.cta") && <a className="btn btn-red btn-lg" href="#designer" {...ed("final.cta")}>{c("final.cta")} <ArrowRight size={18} /></a>}
      </div>
    </section>
  );
}

function Footer() {
  const c = useSite();
  const { pages, navigate } = usePages();
  const homeLink = useHomeLink();
  const email = c("contact.email");
  const phone = c("contact.phone");
  const socials = [["Instagram", c("link.instagram")], ["Facebook", c("link.facebook")]].filter(([, href]) => href);
  const extraPages = pages.filter((p) => p.id !== HOME_ID);
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <img className="footer-logo" src={c("img.logo")} alt={c("company")} width="800" height="372" loading="lazy" {...ed("img.logo", "size.footerLogo")} />
          <T k="footer.blurb" as="p" />
          {(email || phone) && (
            <p className="footer-contact">
              {phone && <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} {...ed("contact.phone")}>{phone}</a>}
              {email && <a href={`mailto:${email}`} {...ed("contact.email")}>{email}</a>}
            </p>
          )}
        </div>
        <div>
          <h3>Design</h3>
          <a {...homeLink("#designer")}>Cover designer</a>
          <a {...homeLink("#patterns")}>Patterns</a>
          <a {...homeLink("#measure")}>Measuring guide</a>
          <a {...homeLink("#faq")}>FAQ</a>
          {extraPages.map((p) => (
            <a key={p.id} href={`/${p.slug}`} onClick={(e) => { e.preventDefault(); navigate(p.slug); }} data-bws-page={p.slug}>{p.title}</a>
          ))}
        </div>
        <div>
          <h3>Shop</h3>
          <a href={c("link.etsy")} target="_blank" rel="noopener noreferrer" {...ed("link.etsy")}>Etsy shop</a>
          <a href={c("link.custom")} target="_blank" rel="noopener noreferrer" {...ed("link.custom")}>Custom chime covers on Etsy</a>
          <a href={c("link.reviews")} target="_blank" rel="noopener noreferrer" {...ed("link.reviews")}>Reviews</a>
          {socials.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" {...ed(`link.${label.toLowerCase()}`)}>{label}</a>)}
        </div>
        {c("footer.pay") && (
          <div>
            <h3>Pay with</h3>
            <p className="small" {...ed("footer.pay")}>{c("footer.pay")}</p>
          </div>
        )}
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} {c("company")}. Preview build for client review.</span>
        <a className="footer-portal" href={CLIENT_PORTAL} target="_blank" rel="noopener noreferrer">Client sign in</a>
        <StudioCredit />
      </div>
    </footer>
  );
}

const BUILTIN_COMPONENTS = {
  hero: Hero,
  designer: DesignerSection,
  patterns: Patterns,
  colors: Colors,
  measure: Measure,
  how: HowItWorks,
  reviews: Reviews,
  builds: MoreBuilds,
  about: About,
  faq: Faq,
  final: FinalCta,
};

export default function App() {
  const c = useSite();
  const { page } = usePages();
  const contact = { email: c("contact.email"), phone: c("contact.phone") };

  useEffect(() => {
    document.title = page.id === HOME_ID ? "Express 3D Customs | Custom Door Chime Cover Designer" : `${page.title} | ${c("company")}`;
  }, [page, c]);

  return (
    <>
      {page.id === HOME_ID && <a className="skip" href="#designer">Skip to the designer</a>}
      <AnnouncementBar />
      <Header />
      <main className={page.id === HOME_ID ? "" : "subpage"}>
        {page.sections.map((section) => {
          if (section.hidden) return null;
          if (section.type === "builtin") {
            const Builtin = BUILTIN_COMPONENTS[section.id];
            return Builtin ? <Builtin key={section.id} /> : null;
          }
          return <Section key={section.id} section={section} ui={SECTION_UI} contact={contact} />;
        })}
        {page.sections.every((s) => s.hidden) && EDIT_MODE && (
          <section className="section empty-page"><div className="wrap"><p>This page has no sections yet. Add one from the Sections tab in the editor.</p></div></section>
        )}
      </main>
      <Footer />
      {/* The preview card would cover the page inside the portal editor */}
      {!EDIT_MODE && <ConceptWidget company={c("company")} abbr={ABBR} />}
    </>
  );
}
