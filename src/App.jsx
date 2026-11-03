import React, { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Box, Check, ChevronDown, Layers, Menu, Palette, Ruler, ShoppingBag, Sparkles, Star, X } from "lucide-react";
import Designer, { applyToDesigner } from "./Designer.jsx";
import { CLIENT_PORTAL, ConceptWidget, StudioCredit } from "./concept.jsx";
import { EDIT_MODE, HOME_ID, T, ed, usePages, useSite } from "./editable.jsx";
import { Section } from "./sections.jsx";
import reviewSarah from "./assets/shop/review-sarah.jpg";

// Text, links, photos, colors and sizes the client can edit live in site-fields.js
const ABBR = "e3d";

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

// Filament colors and swatch hex values from the live designer's settings.
const COLORS = [
  ["Black", "#050505"], ["White", "#e0deda"], ["Gold", "#e1c156", true], ["Silver", "#7d7d7d", true], ["Copper", "#b85a3e", true],
  ["Beige", "#eae9d4"], ["Gray", "#8c8d90"], ["Yellow", "#e4c207"], ["Orange", "#e55d06"], ["Red", "#931721"],
  ["Light Blue", "#2799f1"], ["Blue", "#0141ab"], ["Navy Blue", "#18215a"], ["Teal", "#018794"], ["Emerald Green", "#01342c"],
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

// Newer reviews load from Etsy through /api/reviews (cached about a month); the list above is the fallback.
let reviewsRequest = null;
function useEtsyReviews() {
  const [reviews, setReviews] = useState(REVIEWS);
  useEffect(() => {
    let live = true;
    if (!reviewsRequest) {
      reviewsRequest = fetch("/api/reviews")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => (Array.isArray(data?.reviews) && data.reviews.length ? data.reviews : null))
        .catch(() => null);
    }
    reviewsRequest.then((list) => { if (live && list) setReviews(list); });
    return () => { live = false; };
  }, []);
  return reviews;
}

function Rating({ size = 15, value = 5 }) {
  return (
    <span className="stars" aria-label={`${value} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={size} fill={i < value ? "currentColor" : "none"} strokeWidth={i < value ? 0 : 1.5} />)}
    </span>
  );
}

function ReviewCard({ r }) {
  return (
    <figure className={`review${r.photo ? " has-photo" : ""}`}>
      {r.photo && <img src={r.photo} alt={`Photo from ${r.name}'s review`} loading="lazy" width="300" height="300" />}
      <Rating size={14} value={r.rating || 5} />
      <blockquote>"{r.text}"</blockquote>
      <figcaption><strong>{r.name || "Etsy buyer"}</strong> · {r.date} · on Etsy</figcaption>
    </figure>
  );
}

// A link to a built-in section wherever the client has placed it: on another page it opens
// that page at the top (so the designer page starts with the measuring steps), on this page it scrolls.
function useSectionLink() {
  const { pages, page, navigate } = usePages();
  return (sectionId) => {
    const target = pages.find((p) => p.sections.some((s) => s.id === sectionId && !s.hidden)) || pages[0];
    if (target.id === page.id) return { href: `#${sectionId}` };
    return { href: `/${target.slug}`, onClick: (event) => { event.preventDefault(); navigate(target.slug); }, "data-bws-page": target.slug };
  };
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
  const link = useSectionLink();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const hasDesigner = pages.some((p) => p.sections.some((s) => s.id === "designer" && !s.hidden));
  const goTo = (slug) => (event) => { event.preventDefault(); setOpen(false); navigate(slug); };
  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="wrap header-inner">
        <a className="brand" href="/" aria-label={`${c("company")} home`} onClick={goTo("")} data-bws-page="">
          <img src={c("img.logo")} alt={c("company")} width="800" height="372" {...ed("img.logo", "size.logo")} />
        </a>
        <nav className={`nav${open ? " is-open" : ""}`} aria-label="Main">
          {pages.filter((p) => p.nav).map((p) => (
            <a key={p.id} href={`/${p.slug}`} onClick={goTo(p.slug)} aria-current={p.id === page.id ? "page" : undefined} data-bws-page={p.slug}>{p.title}</a>
          ))}
          {c("header.shop") && (
            <a className="nav-shop" href={c("link.etsy")} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} {...ed("header.shop")}><ShoppingBag size={16} /> {c("header.shop")}</a>
          )}
        </nav>
        {c("header.cta") && hasDesigner && (
          <a className="btn btn-red header-cta" {...link("designer")} {...ed("header.cta")}>{c("header.cta")}</a>
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
  const link = useSectionLink();
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
            {c("hero.cta") && <a className="btn btn-red btn-lg" {...link("designer")} {...ed("hero.cta")}>{c("hero.cta")} <ArrowRight size={18} /></a>}
            {c("hero.cta2") && <a className="btn btn-ghost btn-lg" {...link("how")} {...ed("hero.cta2")}>{c("hero.cta2")}</a>}
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
  return (
    <section className="section measure" id="measure" aria-labelledby="measure-title" {...ed("section:measure")}>
      <div className="wrap measure-grid">
        <div className="measure-copy">
          <T k="measure.eyebrow" as="p" className="eyebrow dark"><span className="eyebrow-dot" /> </T>
          <T k="measure.title" as="h1" id="measure-title" />
          <T k="measure.text" as="p" />
        </div>
        <ol className="measure-list">
          <li><span>W</span><div><strong>Width</strong> outside edge to outside edge of the chime's backplate.</div></li>
          <li><span>H</span><div><strong>Height</strong> top to bottom of the backplate.</div></li>
          <li><span>D</span><div><strong>Depth</strong> from the wall to the part that sticks out the furthest.</div></li>
        </ol>
      </div>
    </section>
  );
}

function HowItWorks() {
  const c = useSite();
  return (
    <section className="section how" id="how" aria-labelledby="how-title" {...ed("section:how")}>
      <div className="wrap">
        <div className="section-head">
          <T k="how.eyebrow" as="p" className="eyebrow dark"><span className="eyebrow-dot" /> </T>
          <T k="how.title" as="h2" id="how-title" />
        </div>
        <ol className="layers" {...ed("how.steps")}>
          {c("how.steps").map((step, i) => (
            <li key={i} style={{ "--i": i }}>
              <span className="layer-no">{String(i + 1).padStart(2, "0")}</span>
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
  const link = useSectionLink();
  const reviews = useEtsyReviews().slice(0, 3);
  const { pages } = usePages();
  const hasAll = pages.some((p) => p.sections.some((s) => s.id === "reviewsAll" && !s.hidden));
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
          {reviews.map((r, i) => <ReviewCard key={i} r={r} />)}
        </div>
        {hasAll && c("reviews.more") && (
          <p className="reviews-more"><a className="btn btn-dark" {...link("reviewsAll")} {...ed("reviews.more")}>{c("reviews.more")} <ArrowRight size={17} /></a></p>
        )}
      </div>
    </section>
  );
}

function ReviewsAll() {
  const c = useSite();
  const reviews = useEtsyReviews();
  return (
    <section className="section reviews reviews-all" id="reviewsAll" aria-labelledby="reviews-all-title" {...ed("section:reviewsAll")}>
      <div className="wrap">
        <div className="reviews-head">
          <div>
            <T k="reviews.eyebrow" as="p" className="eyebrow dark"><span className="eyebrow-dot" /> </T>
            <T k="reviewsAll.title" as="h1" id="reviews-all-title" />
            <T k="reviewsAll.text" as="p" className="reviews-intro" />
          </div>
          <a className="review-badge" href={c("link.reviews")} target="_blank" rel="noopener noreferrer" {...ed("reviews.badge")}>
            <strong>4.9</strong><Rating /><span>{c("reviews.badge")}</span><ArrowUpRight size={16} />
          </a>
        </div>
        <div className="review-grid review-grid-all">
          {reviews.map((r, i) => <ReviewCard key={i} r={r} />)}
        </div>
        <p className="reviews-source">
          Quoted word for word from the {c("company")} shop reviews on Etsy.{" "}
          <a href={c("link.reviews")} target="_blank" rel="noopener noreferrer">See all reviews on Etsy <ArrowUpRight size={14} /></a>
        </p>
      </div>
    </section>
  );
}

function MoreBuilds() {
  const c = useSite();
  return (
    <section className="section builds" id="shop" aria-labelledby="builds-title" {...ed("section:builds")}>
      <div className="wrap">
        <div className="section-head split">
          <div>
            <T k="builds.eyebrow" as="p" className="eyebrow dark"><span className="eyebrow-dot" /> </T>
            <T k="builds.title" as="h1" id="builds-title" />
          </div>
          {c("builds.cta") && <a className="btn btn-dark" href={c("link.etsy")} target="_blank" rel="noopener noreferrer" {...ed("builds.cta")}>{c("builds.cta")} <ArrowUpRight size={17} /></a>}
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
            <img src={photo} alt="Mike and Bekah of Express 3D Customs" loading="lazy" width="794" height="794" {...ed("img.about")} />
            {c("img.crest") && <img className="about-crest" src={c("img.crest")} alt={`${c("company")} logo`} loading="lazy" width="500" height="210" {...ed("img.crest")} />}
          </figure>
        )}
        <div>
          <T k="about.eyebrow" as="p" className="eyebrow dark"><span className="eyebrow-dot" /> </T>
          <T k="about.title" as="h1" id="about-title" />
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
          <T k="faq.title" as="h1" id="faq-title" />
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
  const link = useSectionLink();
  return (
    <section className="final-cta" {...ed("section:final")}>
      <div className="wrap final-inner">
        <NozzlePath className="final-nozzle" />
        <T k="final.title" as="h2" />
        {c("final.cta") && <a className="btn btn-red btn-lg" {...link("designer")} {...ed("final.cta")}>{c("final.cta")} <ArrowRight size={18} /></a>}
      </div>
    </section>
  );
}

function Footer() {
  const c = useSite();
  const { pages, navigate } = usePages();
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
          <h3>Explore</h3>
          <a href="/" onClick={(e) => { e.preventDefault(); navigate(""); }} data-bws-page="">Home</a>
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
  colors: Colors,
  measure: Measure,
  how: HowItWorks,
  reviews: Reviews,
  reviewsAll: ReviewsAll,
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
      <a className="skip" href="#main">Skip to content</a>
      <AnnouncementBar />
      <Header />
      <main id="main" className={page.id === HOME_ID ? "" : "subpage"}>
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
