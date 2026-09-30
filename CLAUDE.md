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

## To do next
1. Replace `https://tally.so/r/INTAKE` in `index.html` with the real Tally intake-form link (used by every "Sākt sadarbību").
2. Mobile menu panel for `.ka-nav__menu` (links + halo CTA), and real hrefs for the nav.
3. Subpages in the same shell: Pakalpojumi, Par mani, Rezultāti, Kontakti (see the design system's Website guideline for the brainstorm).
4. Optional: move to Astro (one layout + components, LV/EN routes), then deploy (Vercel / Netlify / Cloudflare Pages) and point ansoneri.com at it.
5. Privacy policy page (footer link).
