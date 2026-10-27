# Express 3D Customs — website redesign (Blueprint WebStudio)

Client-requested redesign of https://express3dcustoms.com for Express 3D Customs (Mike & Bekah, Windsor, Colorado).
Preview: https://e3d.blueprintwebstudio.com (noindex; the access code lives in the Neon `demos` table).

The custom door chime cover designer is the centerpiece: it sits directly under the hero, and the pattern and color sections load a choice straight into it.

## The designer

The designer on the current site is **their own WordPress plugin, `e3d-chime-configurator` (v1.0.25)**, not a third-party plugin. It is built on:

- **Three.js** (bundled as `vendor/three.min.js`) and Three's **OrbitControls** for the live 3D preview. Both are open-source libraries.
- **WooCommerce** for the cart. "Add to Cart" posts the design JSON plus a generated **3MF print file** to `admin-ajax.php` (`action=e3d_chime_add_to_cart`), then sends the customer to the cart.

In this repo the plugin is carried over intact:

| File | What it is |
|---|---|
| `public/designer/script.js` | The plugin's script, unchanged (pricing, geometry, 3MF export, bell cutouts, side layout) |
| `public/designer/*-data.js` | The 10 front and 4 side pattern cutout files, unchanged |
| `public/designer/vendor/` | Three.js + OrbitControls from the plugin |
| `public/designer/assets/` | The bell measurement help photos |
| `public/designer/config.js` | The live site's settings (price formula, oversize fee, 15 colors, pattern order, camera), copied from the page |
| `src/designer-markup.html` | The plugin's form and preview markup |
| `src/designer-plugin.css` | The plugin's stylesheet, scoped to `.e3d-chime-configurator` so it can't clash with the page |
| `src/Designer.jsx` | Loads the scripts in order and exposes `applyToDesigner()` for the pattern and color pickers |

Because `config.js` has no `ajaxUrl`, "Add to Cart" falls back to the plugin's own **request summary** in this preview. Before launch, pick how orders are taken:

1. **Keep WordPress + WooCommerce for checkout** (smallest change): set `ajaxUrl`, `nonce`, `productId` and `cartUrl` in `config.js` to the store (the nonce must come from WordPress, so the page needs a small endpoint that returns it, plus CORS on `admin-ajax.php`), or
2. **Move checkout off WordPress** (Stripe Checkout or Shopify Buy Button through a Vercel function that accepts the same `config` JSON and 3MF file). This lets the WordPress site be retired.

## Local setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

Vercel project `express-3d-customs` (framework: Vite, team mrwerner-s-projects). Pushes to `main` deploy automatically.
Domain `e3d.blueprintwebstudio.com` is a CNAME at Porkbun pointing to the target Vercel shows for this project.
The "Send Feedback" card posts to `api/demo-interest.js`, which proxies to the main studio site so feedback lands in the Blueprint WebStudio inbox.

## Design

- **Logo:** their Etsy banner wordmark ("Express 3D Customs · Purpose in every layer") in the header and footer, and the E3C crest in the About section. Both are on their own charcoal, which is the site's base color.
- **Palette:** sampled from the logo: slate charcoal `#283033`, filament red `#c34b3c`, cream `#f2ddb9`, nozzle gray `#8f8a85`. The plugin was already themed in these colors, so the designer matches the page.
- **Fonts:** Chakra Petch (squared, technical headings, close to the logo lettering) and Figtree (body).
- **Motif:** the logo's extruder nozzle laying zig-zag layer lines (animated in the hero card and the closing band), a build-plate grid behind the hero, a dashed "filament" rule across the top of the designer, and the How it works steps drawn as print layers (L01–L05) that stack higher as they go.
- **Section order:** announcement bar (Etsy rating) → header → hero (headline, two CTAs, Etsy stats, product photos) → **designer** → front patterns (rendered from the real cutout files; clicking loads the pattern) → 15 colors (clicking loads the color) → measuring guide with typical sizes → how it works → Etsy reviews → other products (LEGO mounts, stands, parts) and custom projects → about Mike & Bekah → FAQ → closing CTA → footer.

## What changed from the current site

- The homepage is the default WordPress "Blog" page with "Sorry, but nothing was found" and the Twenty Twenty-Five footer links (Blog, About, Authors, Events, Patterns, Themes). It now explains the product and sends people straight to the designer.
- The designer had no surrounding story: no reviews, no photos, no pattern previews, no business info. All of that now comes from the Etsy shop.
- Patterns could only be seen by picking them one at a time in a dropdown; they now show as a gallery drawn from the real cutout files.
- Checked at 1440px and 390px with no sideways scrolling; the designer's 3D preview renders and prices update.

## Owner should confirm

- **Checkout:** which of the two options above to use. Until then, "Add to Cart" shows the summary only.
- **Felt insert:** Etsy listings offer an optional black felt insert; the designer doesn't. Add it as an option?
- **Contact details:** no email, phone or Facebook link appears on either site, so the page sends people to Etsy messages. Add a public email or phone if they want one.
- **Reviews:** the six quotes are copied from the Etsy shop's review page (September 2026). Confirm the full text of Sarah's review ("I was going to buy a new doorbell chime because the one I had was so ugly.") since Etsy may have shown it shortened.
- **Numbers:** 7,563 sales, 4.9 stars from 1,105 reviews and Star Seller status are from Etsy on 2026-10-24. "Fits NuTone, Broan-NuTone & Newhouse" is from the Etsy listing title.
- **About copy:** written from the Etsy "About" section (started with a single 3D printer, made a chime cover after finding none on the market). Confirm the wording.
- **Size table:** the example sizes are from the Etsy order-instructions image. The designer prices by volume with its own formula, so the table is a guide only.
- **Photos:** all product photos are from their Etsy listings and shop page; host copies are bundled in `src/assets/shop/`.

## WordPress theme (`wordpress/`)

`wordpress/express-3d-customs/` is the same site as a WordPress block theme, so the client can keep editing in WordPress. `wordpress/express-3d-customs.zip` is the installable file (Appearance > Themes > Add New Theme > Upload Theme). See `wordpress/express-3d-customs/readme.txt` for install and editing notes.

- Every home page section is an editable block pattern (`patterns/`); `templates/front-page.html` puts them in order.
- `[e3d_designer]` embeds the client's `e3d-chime-configurator` plugin: it tries the plugin's shortcode, then falls back to the content of the `/custom-door-chime-cover-designer/` page.
- The plugin's global CSS is swapped for `assets/css/designer-plugin-scoped.css` (same rules, scoped to `.e3d-chime-configurator`).
- Sends the Blueprint WebStudio portal visit beacon (off for logged-in users; `e3d_portal_tracking` filter).

Rebuild the zip after changes: `cd wordpress && rm -f express-3d-customs.zip && zip -qr -X express-3d-customs.zip express-3d-customs`.
