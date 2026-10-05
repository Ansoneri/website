# ansoneri.com - project brief for Claude Code

The website of Kristers Ansons (Ansoneri): fitnesa un mentālās veiktspējas arhitekts. Latvian first; English later under /en/.

## Source of truth
The design lives in the **Kristers Ansons design system** (a Claude artifact - Kristers has the link). This folder is an export of it:
- `css/tokens.css` - every colour, spacing and font token, generated from the design system. Do not hand-edit; change the design system and re-export, or add overrides in a separate file.
- `css/bundle.css` + `js/bundle.js` - the components (prefix `ka-`, JS namespace `window.Ansons`).
- `index.html` - the approved landing page (desktop + phone), built only from those classes.
When something visual changes, change it in the design system first, then copy it here, so the two never drift.

## Brand rules that code must keep
- Always the dark theme on the web: black grain background (`.ka-grain` on the page wrapper), white (bone) text. Light "paper" theme is for PDFs only.
- Name: ANSONS in Anton stretched 17% (`.ka-lockup__last`), KRISTERS in IBM Plex Mono Light. Header shows only ANSONS., and only after the hero name has scrolled away (`.ka-nav--reveal` + `Ansons.initNav()` + `[data-hero-name]`). The header CTA appears with it.
- Buttons: black core, white text, gradient line around. Primary "Sākt sadarbību" = `.ka-cta--halo`; secondary = `.ka-cta--ghost`. Never orange-filled buttons. Motion is linear (one steady speed).
- No rules/borders between sections - they fade to black. Photos fade at their edges; glows never sit over faces or text.
- Copy: Latvian, tu-form, short hyphens (never em dashes), no exclamation marks, no emoji. Frame: physical and mental architecture, designing systems; proof with numbers (20+ clients, RSU junior researcher and PhD candidate, IRONMAN, HYROX). Never "PhD" as a finished title; never psychologist/therapy words.
- `assets/photos/graduation.webp` may be published only with the other person's written consent.

## Status (30 Sep 2026)
Done: mobile menu panel and real nav hrefs; subpages Pakalpojumi, Par mani, Rezultāti, Kontakti; privacy policy; 404. "Sākt sadarbību" opens the Calendly 30-minute call (decided; replaces the Tally intake form). `graduation.webp` (with the university official) is not used; `graduation-rsu.webp` (Kristers alone, RSU) sits framed beside the facts on Par mani, approved by Kristers 30 Sep 2026. Footer icons: Instagram and WhatsApp. Synced with the design system of 2 Oct 2026 (bone #f5f3ee, Fraunces retired - closing lines are Oswald Light, 8px buttons and 14px cards, glass service cards, hero proof row with one button and a "Par mani" link). Pakalpojumi follows the "Ansoneri - Pakalpojumi mockup" (2 Oct 2026): Mentor programma 299 €/mēnesī, Treniņu programma 99 €/mēnesī, Konsultācija 50 €/stundā; plans in TrainingPeaks. `css/site.css` gives two-line display headings line-height 1.28 so Latvian cedillas (Ķ Ņ) do not touch the macrons below - worth moving into the design system. Pushes to `main` deploy to GitHub Pages, live at https://ansoneri.com (domain at Cloudflare, DNS only records pointing at GitHub Pages; HTTPS enforced). Open items are listed in `README.md`.

## To do next
1. Fill in the placeholders listed in `README.md` (WhatsApp number, prices, diploma wording, client stories).
2. Optional: move to Astro (one layout + components, LV/EN routes); keep ansoneri.com pointing at wherever it is hosted.
