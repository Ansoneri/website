# ansoneri-site

Static starter for ansoneri.com, exported from the Kristers Ansons design system.

Open `index.html` through a local server (fonts need it):

    python3 -m http.server 8000     # then open http://localhost:8000

Working with Claude Code: open this folder in Claude Code (or push it to a GitHub repo first) - it reads `CLAUDE.md` automatically.

## Deploy

Every push to `main` deploys the site to GitHub Pages (`.github/workflows/pages.yml`).

## What is in this repo

Everything from the design system's `ansoneri-site` export, unchanged: `css/tokens.css`, `css/bundle.css`, `js/bundle.js`, `fonts/` and `assets/`. Edit those in the design system and re-export them - don't edit them here.

Pages (plain HTML, Latvian, same shell on every page - nav, phone menu, footer):

| File | Page |
| --- | --- |
| `index.html` | Sākums - the approved landing page |
| `pakalpojumi.html` | Pakalpojumi - three steps, three offers with price, who it is not for |
| `par-mani.html` | Par mani - the four beats and the facts list |
| `rezultati.html` | Rezultāti - IRONMAN finish, facts, client stories (with consent only) |
| `kontakti.html` | Kontakti - booking, e-mail, Instagram, WhatsApp |
| `privatuma-politika.html` | Privātuma politika |
| `404.html` | Not found |

Site-only additions live in their own files: `css/site.css` (page shell, subpage layouts, phone menu panel) and `js/site.js` (phone menu). The nav and footer are repeated in every page - change them in all of them.

## Still to fill in

- **WhatsApp number** - every WhatsApp link is `https://wa.me/37100000000`; replace the number in all pages.
- **Prices** on Pakalpojumi come from the client pitch and programme brief (100 € programme, 50 € check-in, 50 € per hour); brand work says "Pēc apjoma". Confirm or change them.
- **MSc line** on Par mani - write the degree exactly as on the diploma (and add the second master's degree if there is one).
- **Par mani** text is about 250 words; the copy guide asks for 400-700.
- **Client stories** on Rezultāti - add only with the person's written consent.
- **Privātuma politika** - check the storage and retention lines against how client data is actually kept.
- "Sākt sadarbību" and the booking buttons open the Calendly 30-minute call.
