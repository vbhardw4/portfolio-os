# PortfolioOS

A recruiter-facing developer portfolio with two experiences from one
source of truth:

- **Desktop OS experience** (viewport >= 681px) — a fake desktop: draggable,
  focus-managed windows (Resume, Projects, About, Terminal, and a
  `do_not_click.exe` easter egg), a dock with persistent resume/contact
  CTAs, and a skippable boot sequence.
- **Plain mobile page** (viewport <= 680px, or via the "Plain text view" /
  skip-link escape hatch on desktop) — a fast, ordinary responsive page:
  hero, about, skills, project case-study cards, contact. No windows, no
  dragging, no game.

## Run it locally

No build step, no dependencies to install.

```bash
node server.js        # or: npm start
```

Then open `http://localhost:5173`.

(`npx serve .` works too if you'd rather use that.)

## Where to edit real content

Everything both experiences render comes from **`js/config.js`**
(`SITE_CONFIG`). That is the only file you need to touch to go live:

- `name`, `shortName`, `role`, `tagline`, `location`, `availability`
- `email`, `github`, `linkedin` — real URLs (currently `REPLACE_ME_*` placeholders)
- `resumeUrl` — path to a real PDF dropped into `assets/` (currently a placeholder path)
- `bio` — two real paragraphs about you
- `skills` — real skill labels + `level` (0–100) for the mobile skill bars
- `projects[]` — for each: `title`, `problem`, `role`, `approach`, `outcome`,
  `techStack[]`, `liveUrl`, `githubUrl`. Metrics you don't have yet are
  written as `"[X% faster — replace with your real metric]"` — replace
  with a real, verifiable number or drop the claim entirely. Don't ship a
  fabricated stat.

Any field that still looks like a placeholder (`REPLACE_ME_*` or wrapped
in `[brackets]`) is rendered by `js/render.js` as a visibly disabled
"todo" link rather than a dead `href="#"`, so nothing pretends to be real
until you've actually filled it in.

## File structure

```
index.html              entry point — both experiences live here, one <head>
css/
  variables.css          color tokens (dark + light), plus solid fallbacks
                          for color-mix() results (see the @supports notes)
  base.css                reset, shared components, a11y primitives,
                           the desktop/mobile experience switch
  desktop.css             the OS-themed experience only
  mobile.css              the plain responsive page only
js/
  config.js               SITE_CONFIG — the single source of truth
  render.js                renders SITE_CONFIG into both experiences
  theme.js                 shared light/dark toggle (persisted)
  desktop.js                window manager, boot sequence, terminal,
                             easter egg — only runs at >= 681px
  app.js                    entry point: renders content, decides which
                             experience to activate, wires the plain-view
                             escape hatch
server.js                zero-dependency static file server for local dev
package.json
```

## Design-review punch list — what changed and why

This project started from two throwaway proof-of-concept files that were
deleted once their ideas were folded in here. An earlier design review of
those POCs raised a punch list; here's the disposition of each item in
this build:

**Must-fix**
1. Mobile "back button" dead end — removed entirely. Below 681px the OS
   metaphor isn't shipped at all; `#mobile-experience` is a plain page.
2. Traffic-light dots were decorative — now all three (close/minimize/maximize)
   are real: close hides + returns focus, minimize sends the window to a
   dock tray chip that restores it, maximize toggles a real full-viewport
   layout. Each has an `aria-label`; maximize exposes `aria-pressed`.
3. Dead CTAs — `js/config.js` is the real, wired config object described
   above; `js/render.js` fills every resume/contact/project link from it
   and visibly flags anything still a placeholder.
4. Malformed CSS (`@media` illegally inside a selector list in the old
   `.dock-btn.secondary` rule) — not carried forward; the light/dark
   variants are defined cleanly via `:root[data-theme]` and a
   `prefers-color-scheme` block in `variables.css`.
5. Windows draggable off-screen — `desktop.js` clamps both drag and the
   initial open position to the viewport (minus dock height), and
   re-clamps on window resize.
6. Same as #1.

**Should-fix**
7. Accessibility: every window is `role="dialog"` + `aria-modal="true"` +
   `aria-labelledby`; opening moves focus into the dialog, closing returns
   it to the trigger element; Escape closes the active window; Tab is
   trapped inside the open dialog (`trapFocus` in `desktop.js`). Icon-only
   buttons (traffic-light dots, theme toggle) all have `aria-label`.
8. Projects are a real `problem` → `role` → `approach` → `outcome`
   `<dl>` case-study per project, with `.tech-chip` pills and live-demo +
   GitHub buttons (rendered as disabled "todo" chips until real URLs exist).
9. Semantic landmarks (`header`, `nav`, `main`, `footer`) plus a
   "Plain text view" dock link and a skip-link, both of which force the
   plain page even above the 681px breakpoint.
10. `color-mix()` usage is wrapped in `@supports (color: color-mix(in srgb, black, white))`
    blocks with solid precomputed fallback custom properties
    (`--violet-tint-22`, etc.) as the default in `variables.css`, so
    older browsers get a real (if slightly less blended) color, not a
    silently broken one.

**Nice-to-have**
11. Boot sequence is skippable — click, tap, or any keypress dismisses it
    immediately (see `initBoot` in `desktop.js`).
12. "Demo build" chrome copy was dropped from window titles; the loud,
    unmissable placeholders live only in `SITE_CONFIG` values, as intended.
13. `do_not_click.exe` kept as-is, unexpanded, opt-in, and off the primary
    CTA path.

## Deliberate deviations from the original punch list

- The original mobile POC was a scroll-driven "journey map" with a
  traveling emoji, confetti, and bottom sheets. Per the explicit decision
  in scope, that was **not** carried forward at all — mobile is the plain
  page described above. It was more fun, but the brief was explicit that
  mobile "doesn't need to be clever," and a scroll-hijacked trail is a
  worse experience for anyone using assistive tech, a slow connection, or
  simply wanting to scan project cards quickly.
- Window minimize/maximize wasn't in the original ask as "must implement,"
  only "either implement, or remove the dots." Implementing all three for
  real (rather than just removing two) was chosen because a portfolio
  demonstrating engineering craft is stronger showing working affordances
  than fewer buttons.

## What still needs your real information before this goes live

All of the following are placeholder values in `js/config.js` and will
render as visibly flagged "todo" states until replaced:

- `name`, `shortName`, `role`, `tagline`, `location`, `availability`
- `email`
- `resumeUrl` — needs a real PDF placed in `assets/`
- `github`, `linkedin` — real profile URLs
- `bio` — two real paragraphs
- `skills` — real labels + proficiency levels
- Each project's real `title`, `problem`, `role`, `approach`, `outcome`
  (with a real metric or no metric — no invented numbers), `techStack`,
  `liveUrl`, `githubUrl` — only `ReviewDrop` has real shape; two project
  slots are fully placeholder and a 4th+ project can simply be appended
  to the `projects` array.
