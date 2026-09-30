# ansoneri-site

Static starter for ansoneri.com, exported from the Kristers Ansons design system.

Open `index.html` through a local server (fonts need it):

    python3 -m http.server 8000     # then open http://localhost:8000

Working with Claude Code: open this folder in Claude Code (or push it to a GitHub repo first) - it reads `CLAUDE.md` automatically.

## What is in this repo

Everything from the design system's `ansoneri-site` export, unchanged: `css/tokens.css`, `css/bundle.css`, `js/bundle.js`, `fonts/` and `assets/`. Edit those in the design system and re-export them - don't edit them here.

Site-only additions live in their own files:

- `css/site.css` + `js/site.js` - the phone menu panel behind the header's menu button (below 960px), and the scroll offset for in-page anchors.
- `index.html` - the approved landing page, with working links: nav anchors to `#pakalpojumi` and `#kontakti`, Instagram and e-mail in the footer, favicon and share tags, and `data-reveal` on the services content.
- `favicon.svg`, `.nojekyll` (GitHub Pages serves the files as they are).

## Still to fill in

- **"Sākt sadarbību"** points to the Calendly 30-minute call (`https://calendly.com/kristersansons14/30min`) until the Tally intake form exists - swap the three `href`s in `index.html` (header, phone menu, hero).
- **Par mani**, **Rezultāti** and **Vairāk par mani** link to `#` until those subpages are built.
- **YouTube** icon and **Privātuma politika** link are `#` - add the channel URL and the privacy policy page.
- `assets/photos/graduation.webp` is left out on purpose: it may be published only with the other person's written consent.
