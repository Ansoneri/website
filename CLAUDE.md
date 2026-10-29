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

## Status (29 Oct 2026) - Laboratorija C redesign is live
`index.html` and `profils.html` are now the "Ansoneri Laboratorija C" one-page design (built in a Claude artifact with Kristers, Oct 2026), not the design-system export. They are self-contained: their CSS and JS are inline, Anton and Fraunces italic come from `assets/fonts/` (the Google builds misplace Latvian macrons), the rest from Google Fonts. Their images and the hero reel live in `assets/` (`assets/gen/`, `assets/v6/`, `assets/hero.mp4`, `assets/hero-poster.jpg`). Light (bone) sections are part of this design, so the "always dark" rule below applies to the older pages only.
- Sections: hero reel with the three questions (A text version: one size, Anton caps), the "Labākā forma" map, quick profile, "Kā tapusi mana metode", "Kā mēs strādājam" (timeline in frames), results, offer (Elite Coaching Mentorship 299 € with the "Ātrākais progress" badge, Patstāvīgais plāns 149 €, Konsultācija 50 €), the closing CTA and footer.
- "Sākt sadarbību" buttons still open the Tally form https://tally.so/r/Gx2zdQ.
- `profils.html` (the full profile) sends the report through FormSubmit (`https://formsubmit.co/ajax/kristersansons14@gmail.com`). FormSubmit needs a one-time activation from that inbox after the first submission.
- `pakalpojumi.html`, `par-mani.html`, `rezultati.html`, `kontakti.html` are now redirects to `index.html#mentor`, `#pieredze`, `#rezultati`, `#kontakti`. `privatuma-politika.html` and `404.html` keep the old design; the privacy policy covers the profile and FormSubmit.
- The hero reel source and render scripts are on Kristers's Mac in `~/Documents/Claude - priviate/HYROX/_build/hero/` (`shots_v10.json`, `render_reel.py`, `assemble_parts.py`); the site file is the 576x1024 two-pass encode.
- Kristers confirmed on 29 Oct 2026 that he has permission for the client photos, the Coffee Society client clip in the reel and the race photographer's cycling photo.

## Earlier status (30 Sep 2026)
Done: mobile menu panel and real nav hrefs; subpages Pakalpojumi, Par mani, Rezultāti, Kontakti; privacy policy; 404. "Sākt sadarbību" and every booking button open the Tally form "Pirms pirmās sarunas" (https://tally.so/r/Gx2zdQ, decided 7 Oct 2026); the first conversation comes after it, booked through the Calendly link on the form's thank-you page. `graduation.webp` (with the university official) is not used; `graduation-rsu.webp` (Kristers alone, RSU) sits framed beside the facts on Par mani, approved by Kristers 30 Sep 2026. Footer icons: Instagram and WhatsApp. Synced with the design system of 2 Oct 2026 (bone #f5f3ee, Fraunces retired - closing lines are Oswald Light, 8px buttons and 14px cards, glass service cards, hero proof row with one button and a "Par mani" link). Synced with the design system of 9 Oct 2026: the voice is reworked (coach first, ambassador of the science, helping verbs, psychology of trying, stories with a lesson, fewer numbers, architecture only as an accent, no Ķermenis / Prāts / Zīmols labels), eyebrows are Manrope Bold caps, and every main page closes with the Ansoneri principle in Fraunces Light Italic. Facts: six professional seasons (2018-2024) and 14 years of dedicated sport - never twelve seasons. Pakalpojumi is the Mentor programme page (artifact "Mentor programma - Kristers Ansons", 9 Oct 2026; `css/pakalpojumi.css`): Rasējums 149 € vienreiz, Mentor 299 € mēnesī or 799 € par 3 mēnešiem, Konsultācija 50 € stundā. Home motion (7 Oct 2026, site-only in `js/site.js` + `css/site.css` until approved for the design system): the hero photo lags the scroll (0.3) and grows slightly, the hero text moves ahead (-0.12) and fades, the statement lags (0.18); the three service cards slide in from left / below / right at one linear speed (alternating sides on phones); all off with reduced motion. The middle service card uses `card-bg-diagonal` - the horizon background did not fill the card on wide screens. `css/site.css` gives two-line display headings line-height 1.28 so Latvian cedillas (Ķ Ņ) do not touch the macrons below - worth moving into the design system. Pushes to `main` deploy to GitHub Pages, live at https://ansoneri.com (domain at Cloudflare, DNS only records pointing at GitHub Pages; HTTPS enforced). Open items are listed in `README.md`.

## To do next
1. Fill in the placeholders listed in `README.md` (WhatsApp number, prices, diploma wording, client stories).
2. Optional: move to Astro (one layout + components, LV/EN routes); keep ansoneri.com pointing at wherever it is hosted.
