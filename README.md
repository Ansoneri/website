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
| `pakalpojumi.html` | Pakalpojumi - after the 2 Oct 2026 mockup: three areas, three steps, three offers with price, checkable facts |
| `par-mani.html` | Par mani - the four beats and the facts list |
| `rezultati.html` | Rezultāti - IRONMAN finish, facts, client stories (with consent only) |
| `kontakti.html` | Kontakti - booking, e-mail, Instagram, WhatsApp |
| `privatuma-politika.html` | Privātuma politika |
| `404.html` | Not found |

Site-only additions live in their own files: `css/site.css` (page shell, subpage layouts, phone menu panel, home motion) and `js/site.js` (phone menu, home motion). The home motion is driven by `data-parallax` / `data-slide` attributes in `index.html`; it switches on only when the head script adds `.js-motion`, which it skips with reduced motion. The nav and footer are repeated in every page - change them in all of them.

## Copy

All page copy follows the Ansoneri Website Copy & Style Guide (voice, field order for offers, no negation-led Latvian lines, gender-neutral reader lines, first-person meta descriptions). Where the guide and the design system disagree, the design system's later decisions stand: Latvian first, "Sākt sadarbību" as the primary button, Home = hero, services, footer.

## Still to fill in

- **WhatsApp number** - every WhatsApp link is `https://wa.me/37100000000`; replace the number in all pages.
- **Offers and prices** on Pakalpojumi follow the Pakalpojumi mockup (2 Oct 2026): Mentor programma 299 € mēnesī, Treniņu programma 99 € mēnesī, Konsultācija 50 € stundā (60 minutes); brand work is booked as consultations. Prices are written the Latvian way, "299 €"; the mockup wrote "€299".
- **Places per month** for the Mentor programma - the mockup has "Vietas mēnesī: [SKAITS]"; left out until there is a number.
- **2 × MSc** on Pakalpojumi reads "sporta zinātnē" only; add the qualification exactly as on the diplomas.
- **MSc line** on Par mani - write the degree exactly as on the diploma (and add the second master's degree if there is one).
- **Par mani** text is about 275 words (Latvian); the copy guide asks for 400-700 - add your own story details, not invented ones.
- **Client stories** on Rezultāti - add only with the person's written consent.
- **Privātuma politika** - check the storage and retention lines against how client data is actually kept.
- "Sākt sadarbību" and every booking button open the Tally form "Pirms pirmās sarunas" (https://tally.so/r/Gx2zdQ, about ten minutes). Its thank-you page links to Calendly, where the time for the first conversation is picked; the notes under the buttons, Kontakti and the privacy policy describe that order.
