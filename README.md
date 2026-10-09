# ansoneri-site

Static starter for ansoneri.com, exported from the Kristers Ansons design system.

Open `index.html` through a local server (fonts need it):

    python3 -m http.server 8000     # then open http://localhost:8000

Working with Claude Code: open this folder in Claude Code (or push it to a GitHub repo first) - it reads `CLAUDE.md` automatically.

## Deploy

Every push to `main` deploys the site to GitHub Pages (`.github/workflows/pages.yml`).

On the way, the workflow adds `?v=<commit>` to every CSS, JS and image link in the HTML. GitHub Pages lets browsers keep those files for four hours, so without the stamp a returning visitor could get a new page with an old stylesheet. Leave the links in the source unstamped.

### ansoneri.com (domain at Cloudflare)

Connected 30 Sep 2026: https://ansoneri.com serves this site with HTTPS enforced; `www.ansoneri.com` and `ansoneri.github.io/website/` redirect to it. The setup, for reference:

1. Cloudflare → ansoneri.com → DNS → Records. Delete any old A, AAAA or CNAME records for `ansoneri.com` and `www`, then add these, each with Proxy status **DNS only** (grey cloud):

   | Type | Name | Content |
   | --- | --- | --- |
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | AAAA | `@` | `2606:50c0:8000::153` |
   | AAAA | `@` | `2606:50c0:8001::153` |
   | AAAA | `@` | `2606:50c0:8002::153` |
   | AAAA | `@` | `2606:50c0:8003::153` |
   | CNAME | `www` | `ansoneri.github.io` |

2. GitHub → this repo → Settings → Pages → Custom domain: `ansoneri.com` → Save. Wait for the DNS check to pass, then tick **Enforce HTTPS** (the certificate can take up to an hour).
3. Optional, against domain takeover: GitHub → your profile Settings → Pages → Add a domain → `ansoneri.com`, and add the TXT record it shows in Cloudflare.

The site then lives at the domain root (`https://ansoneri.com/`); all links are relative, so nothing in the pages changes. Leave the records on DNS only: Cloudflare's proxy in front of GitHub Pages blocks the certificate.

## What is in this repo

Everything from the design system, unchanged: `css/tokens.css`, `css/bundle.css`, `js/bundle.js`, `fonts/` and `assets/`. Edit those in the design system and re-export them - don't edit them here. `tools/ds_to_site.py` rebuilds `tokens.css` and `bundle.css` from the design system's `tokens.json`, `bundle.css` and `design-system.json` (last synced: the 2 Oct 2026 version).

Pages (plain HTML, Latvian, same shell on every page - nav, phone menu, footer):

| File | Page |
| --- | --- |
| `index.html` | Sākums - the approved landing page |
| `pakalpojumi.html` | Pakalpojumi - the Mentor programme page (9 Oct 2026 artifact "Mentor programma - Kristers Ansons"): hero, why Mentor, nine elements, Rasējums / Mentor / Konsultācija with the comparison table, five phases, who it fits, credentials, questions. Its own styles are in `css/pakalpojumi.css` |
| `par-mani.html` | Par mani - the four beats and the facts list |
| `rezultati.html` | Rezultāti - IRONMAN finish, facts, client stories (with consent only) |
| `kontakti.html` | Kontakti - booking, e-mail, Instagram, WhatsApp |
| `privatuma-politika.html` | Privātuma politika |
| `404.html` | Not found |

Site-only additions live in their own files: `css/site.css` (page shell, subpage layouts, phone menu panel, home motion) and `js/site.js` (phone menu, home motion). The home motion is driven by `data-parallax` / `data-slide` attributes in `index.html`; it switches on only when the head script adds `.js-motion`, which it skips with reduced motion. The nav and footer are repeated in every page - change them in all of them.

## Copy

All page copy follows the design system's **Website copy** section and its voice (reworked 9 Oct 2026): a coach first and an ambassador of the science, helping verbs in the first person (palīdzēšu, pielāgošu, parūpēšos), the psychology of trying named and looked after, stories that end in a lesson, one or two numbers per paragraph, architecture words only as an accent, no pillar labels (Ķermenis / Prāts / Zīmols). Fixed facts: sešas sezonas profesionālajā šosejas riteņbraukšanā (2018-2024) and 14 gadi mērķtiecīgā sportā - never twelve seasons. Every main page closes with the Ansoneri principle in Fraunces Light Italic (`.ka-principle`), the only italic on the site. Where the separate copy guide and the design system disagree, the design system stands.

## Still to fill in

- **WhatsApp number** - every WhatsApp link is `https://wa.me/37100000000`; replace the number in all pages.
- **Offers and prices** (design system, decided 9 Oct 2026): Rasējums 149 € vienreiz, Mentor 299 € mēnesī or 799 € par 3 mēnešiem, Konsultācija 50 € stundā; upgrade Rasējums → Mentor within 30 days credits the 149 €. Prices are written "149 €" (the Mentor artifact wrote "€149").
- **"3 vietas"** - the Mentor page says "3 vietas uz ziemas sezonu" in the hero and the close, and "Palikušas 3 vietas" on the Mentor card; change all three when the number changes.
- **Form length** - the Mentor artifact says the application takes 5 minutes; the live Tally form says about ten, so the site says "apmēram 10 minūtes". Change it if the form gets shorter.
- **Testimonial** - the Mentor artifact has a placeholder for a client quote under the credentials; left out until there is one with written consent.
- **New images not yet in the design system** - the nine-element icons (`assets/service-icons/icon-talk`, `-barbell`, `-nutrition`, `-week`, `-phone`, `-message`, `-mind`), `assets/photos/studio-portrait-warm.webp` and `assets/glows/g05-orb-wide.webp` came from the Mentor artifact; add them to the design system's asset groups.
- **MSc line** - the degrees are written as "sporta zinātnē un psiholoģiskajā koučingā"; write each exactly as on its diploma.
- **Par mani** text is about 275 words (Latvian); the copy guide asks for 400-700 - add your own story details, not invented ones.
- **Client stories** on Rezultāti - add only with the person's written consent.
- **Privātuma politika** - check the storage and retention lines against how client data is actually kept.
- "Sākt sadarbību" and every booking button open the Tally form "Pirms pirmās sarunas" (https://tally.so/r/Gx2zdQ, about ten minutes). Its thank-you page links to Calendly, where the time for the first conversation is picked; the notes under the buttons, Kontakti and the privacy policy describe that order.
