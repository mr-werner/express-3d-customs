import React from "react";
import { EDIT_MODE, ed } from "./editable.jsx";
import "./sections.css";

// Blueprint WebStudio section library: the sections a client can add from the portal editor.
// Same file in every editable client site. Each site passes a `ui` object (eyebrow, button and
// wrapper classes) so new sections pick up that site's own type, buttons and colors, and maps
// its colors to the --bws-* variables used in sections.css.

const sel = (key, label, options, value) => ({ key, label, type: "select", options, default: value });
const txt = (key, label, value = "", extra = {}) => ({ key, label, type: "text", default: value, ...extra });
const para = (key, label, value = "", extra = {}) => ({ key, label, type: "textarea", default: value, rows: 5, ...extra });
const img = (key, label, value = "") => ({ key, label, type: "image", default: value, optional: true });
const link = (key, label, value = "") => ({ key, label, type: "link", default: value });
const list = (key, label, itemLabel, itemFields, value, max = 24) => ({ key, label, type: "list", itemLabel, itemFields, default: value, max });

// Style settings every added section has
export const STYLE_FIELDS = [
  sel("bg", "Background", [["page", "Page color"], ["light", "Light panel"], ["dark", "Dark"], ["accent", "Accent color"], ["custom", "Custom color"], ["image", "Photo"]], "page"),
  { key: "bgColor", label: "Custom background color", type: "color", default: "#ffffff", showIf: ["bg", "custom"] },
  { ...img("bgImage", "Background photo"), showIf: ["bg", "image"] },
  sel("align", "Text alignment", [["left", "Left"], ["center", "Centered"]], "left"),
  { key: "space", label: "Space above and below", type: "size", default: 100, min: 32, max: 180, step: 4, unit: "px" },
];

const BUTTON = [txt("label", "Button text", "Learn more"), link("href", "Button link", "#")];
const PLACEHOLDER_TITLE = "Add your heading";
const PLACEHOLDER_BODY = "Write a sentence or two here. Leave a blank line between paragraphs.";

export const SECTION_TYPES = [
  {
    type: "text",
    label: "Text",
    description: "A heading with paragraphs and buttons.",
    fields: [txt("eyebrow", "Small label"), txt("title", "Heading", PLACEHOLDER_TITLE), para("body", "Text", PLACEHOLDER_BODY), list("buttons", "Buttons", "Button", BUTTON, [], 3)],
  },
  {
    type: "textImage",
    label: "Text and photo",
    description: "Text beside a photo, on either side.",
    fields: [
      txt("eyebrow", "Small label"),
      txt("title", "Heading", PLACEHOLDER_TITLE),
      para("body", "Text", PLACEHOLDER_BODY),
      img("image", "Photo"),
      sel("imageSide", "Photo side", [["right", "Right"], ["left", "Left"]], "right"),
      list("buttons", "Buttons", "Button", BUTTON, [], 3),
    ],
  },
  {
    type: "gallery",
    label: "Photo gallery",
    description: "A grid of photos with optional captions.",
    fields: [
      txt("eyebrow", "Small label"),
      txt("title", "Heading", "Gallery"),
      sel("columns", "Photos per row", [["2", "2"], ["3", "3"], ["4", "4"]], "3"),
      list("items", "Photos", "Photo", [img("image", "Photo"), txt("caption", "Caption")], [{ image: "", caption: "" }, { image: "", caption: "" }, { image: "", caption: "" }], 40),
    ],
  },
  {
    type: "cards",
    label: "Cards",
    description: "Services, products or features as cards.",
    fields: [
      txt("eyebrow", "Small label"),
      txt("title", "Heading", PLACEHOLDER_TITLE),
      para("intro", "Intro text", "", { rows: 3 }),
      list(
        "items",
        "Cards",
        "Card",
        [img("image", "Photo"), txt("title", "Title", "Card title"), para("text", "Text", "A short description.", { rows: 3 }), link("href", "Link (optional)")],
        [{ title: "First card", text: "A short description." }, { title: "Second card", text: "A short description." }, { title: "Third card", text: "A short description." }]
      ),
    ],
  },
  {
    type: "banner",
    label: "Banner",
    description: "A bold strip with a heading and a button.",
    defaults: { bg: "accent", align: "center", space: 72 },
    fields: [txt("title", "Heading", "Ready to get started?"), para("body", "Text", "", { rows: 2 }), txt("buttonLabel", "Button text", "Get in touch"), link("buttonHref", "Button link", "#")],
  },
  {
    type: "faq",
    label: "Questions",
    description: "Questions and answers that open on tap.",
    fields: [
      txt("eyebrow", "Small label", "FAQ"),
      txt("title", "Heading", "Questions"),
      list("items", "Questions", "Question", [txt("q", "Question", "A question customers ask?"), para("a", "Answer", "The answer.", { rows: 3 })], [{ q: "A question customers ask?", a: "The answer." }], 40),
    ],
  },
  {
    type: "contact",
    label: "Contact",
    description: "How to reach you: email, phone, address and a button.",
    defaults: { bg: "light" },
    fields: [
      txt("eyebrow", "Small label", "Contact"),
      txt("title", "Heading", "Get in touch"),
      para("body", "Text", "", { rows: 3 }),
      { key: "email", label: "Email", type: "email", default: "", help: "Blank uses the email from Contact & links." },
      { key: "phone", label: "Phone", type: "phone", default: "", help: "Blank uses the phone from Contact & links." },
      para("address", "Address", "", { rows: 2 }),
      txt("buttonLabel", "Button text"),
      link("buttonHref", "Button link"),
    ],
  },
];

export const SECTION_TYPE_MAP = Object.fromEntries(SECTION_TYPES.map((t) => [t.type, t]));

// A new section of a type, filled with its starting content
export function newSection(type, id) {
  const def = SECTION_TYPE_MAP[type];
  const section = { id, type };
  for (const field of [...STYLE_FIELDS, ...def.fields]) section[field.key] = field.default;
  return { ...section, ...(def.defaults || {}) };
}

function Paragraphs({ text, className, k }) {
  if (!text) return null;
  return (
    <div className={className} {...ed(k)}>
      {text.split(/\n\s*\n/).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

function Buttons({ buttons, ui, onDark, k }) {
  const shown = (buttons || []).filter((b) => b.label);
  if (shown.length === 0) return null;
  return (
    <div className="bws-buttons" {...ed(k)}>
      {shown.map((b, i) => (
        <a key={i} className={ui.buttonClass(i === 0 ? "primary" : "secondary", onDark)} href={b.href || "#"} {...linkProps(b.href)}>
          {b.label}
        </a>
      ))}
    </div>
  );
}

function linkProps(href) {
  return /^https?:\/\//i.test(href || "") ? { target: "_blank", rel: "noopener noreferrer" } : {};
}

function Head({ s, ui, onDark, k }) {
  if (!s.eyebrow && !s.title) return null;
  return (
    <>
      {s.eyebrow && <ui.Eyebrow onDark={onDark} edit={ed(`${k}.eyebrow`)}>{s.eyebrow}</ui.Eyebrow>}
      {s.title && <h2 {...ed(`${k}.title`)}>{s.title}</h2>}
    </>
  );
}

export function Section({ section: s, ui, contact = {} }) {
  const k = `section:${s.id}`;
  const onDark = s.bg === "dark" || s.bg === "accent" || s.bg === "image";
  const style = { "--bws-space": `${s.space}px` };
  if (s.bg === "custom") style.background = s.bgColor;
  if (s.bg === "image" && s.bgImage) style.backgroundImage = `linear-gradient(rgba(0,0,0,.52), rgba(0,0,0,.52)), url("${s.bgImage.replace(/["\\]/g, "")}")`;
  const className = `bws-section bws-${s.type} bws-bg-${s.bg} bws-align-${s.align}${onDark ? " bws-on-dark" : ""}`;

  let body;
  if (s.type === "text") {
    body = (
      <div className="bws-narrow">
        <Head s={s} ui={ui} onDark={onDark} k={k} />
        <Paragraphs text={s.body} className="bws-body" k={`${k}.body`} />
        <Buttons buttons={s.buttons} ui={ui} onDark={onDark} k={`${k}.buttons`} />
      </div>
    );
  } else if (s.type === "textImage") {
    const photo = s.image || EDIT_MODE;
    body = (
      <div className={`bws-split${s.imageSide === "left" ? " is-flipped" : ""}${photo ? "" : " no-photo"}`}>
        <div>
          <Head s={s} ui={ui} onDark={onDark} k={k} />
          <Paragraphs text={s.body} className="bws-body" k={`${k}.body`} />
          <Buttons buttons={s.buttons} ui={ui} onDark={onDark} k={`${k}.buttons`} />
        </div>
        {photo && (
          <figure className="bws-photo" {...ed(`${k}.image`)}>
            {s.image ? <img src={s.image} alt="" loading="lazy" /> : <span className="bws-photo-empty">Add a photo</span>}
          </figure>
        )}
      </div>
    );
  } else if (s.type === "gallery") {
    body = (
      <>
        <Head s={s} ui={ui} onDark={onDark} k={k} />
        <div className="bws-gallery" style={{ "--bws-cols": s.columns }} {...ed(`${k}.items`)}>
          {s.items.filter((item) => item.image || EDIT_MODE).map((item, i) => (
            <figure key={i}>
              {item.image ? <img src={item.image} alt={item.caption || ""} loading="lazy" /> : <span className="bws-photo-empty">Add a photo</span>}
              {item.caption && <figcaption>{item.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </>
    );
  } else if (s.type === "cards") {
    body = (
      <>
        <Head s={s} ui={ui} onDark={onDark} k={k} />
        <Paragraphs text={s.intro} className="bws-body bws-intro" k={`${k}.intro`} />
        <div className="bws-cards" {...ed(`${k}.items`)}>
          {s.items.map((item, i) => {
            const inner = (
              <>
                {item.image && <img src={item.image} alt="" loading="lazy" />}
                <div>
                  {item.title && <h3>{item.title}</h3>}
                  {item.text && <p>{item.text}</p>}
                </div>
              </>
            );
            return item.href ? (
              <a key={i} className="bws-card" href={item.href} {...linkProps(item.href)}>
                {inner}
              </a>
            ) : (
              <article key={i} className="bws-card">
                {inner}
              </article>
            );
          })}
        </div>
      </>
    );
  } else if (s.type === "banner") {
    body = (
      <div className="bws-banner-inner">
        <div>
          {s.title && <h2 {...ed(`${k}.title`)}>{s.title}</h2>}
          <Paragraphs text={s.body} className="bws-body" k={`${k}.body`} />
        </div>
        {s.buttonLabel && (
          <a className={ui.buttonClass("banner", onDark, s.bg)} href={s.buttonHref || "#"} {...linkProps(s.buttonHref)} {...ed(`${k}.buttonLabel`)}>
            {s.buttonLabel}
          </a>
        )}
      </div>
    );
  } else if (s.type === "faq") {
    body = (
      <div className="bws-faq-grid">
        <div>
          <Head s={s} ui={ui} onDark={onDark} k={k} />
        </div>
        <div className="bws-faq" {...ed(`${k}.items`)}>
          {s.items.filter((item) => item.image || EDIT_MODE).map((item, i) => (
            <details key={i} open={i === 0}>
              <summary>{item.q}</summary>
              {item.a && <p>{item.a}</p>}
            </details>
          ))}
        </div>
      </div>
    );
  } else if (s.type === "contact") {
    const email = s.email || contact.email;
    const phone = s.phone || contact.phone;
    body = (
      <div className="bws-narrow">
        <Head s={s} ui={ui} onDark={onDark} k={k} />
        <Paragraphs text={s.body} className="bws-body" k={`${k}.body`} />
        <dl className="bws-contact">
          {email && (
            <div {...ed(`${k}.email`)}>
              <dt>Email</dt>
              <dd><a href={`mailto:${email}`}>{email}</a></dd>
            </div>
          )}
          {phone && (
            <div {...ed(`${k}.phone`)}>
              <dt>Phone</dt>
              <dd><a href={`tel:${phone.replace(/[^0-9+]/g, "")}`}>{phone}</a></dd>
            </div>
          )}
          {s.address && (
            <div {...ed(`${k}.address`)}>
              <dt>Address</dt>
              <dd>{s.address}</dd>
            </div>
          )}
        </dl>
        {s.buttonLabel && (
          <div className="bws-buttons">
            <a className={ui.buttonClass("primary", onDark)} href={s.buttonHref || "#"} {...linkProps(s.buttonHref)} {...ed(`${k}.buttonLabel`)}>
              {s.buttonLabel}
            </a>
          </div>
        )}
      </div>
    );
  } else {
    return null;
  }

  return (
    <section className={className} style={style} {...ed(k)}>
      <div className={ui.wrapClass}>{body}</div>
    </section>
  );
}
