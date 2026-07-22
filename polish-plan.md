# Polish Plan

## Overview

Three focused visual polish tasks across the portfolio:
1. Add inline SVG icons to the contact links (email, LinkedIn) in `information.html`
2. Add a language-switch animation — a panel that sweeps right-to-left across the screen, then disappears
3. Rework the index door-click sequence: remove the camera zoom, instead fade the hero title out upward, play the door open animation, then flash → navigate

---

## Sub-Task 1 — SVG Icons on Contact Links

**Intent:** Make the email and LinkedIn links in the contact section more visually appealing by prepending small inline SVG icons beside each link text.

**Expected Outcomes:**
- Email link shows a mail envelope SVG icon to its left
- LinkedIn link shows the LinkedIn logo SVG icon to its left
- Icons inherit the existing link colour and hover behaviour
- No layout shift; links remain on separate lines as they are now

**Todo List:**
1. In `pages/information.html`, convert the two `.contact__email` anchors into flex containers with `align-items: center` and a small `gap`
2. Prepend an inline SVG envelope icon inside the email `<a>`
3. Prepend an inline SVG LinkedIn icon inside the LinkedIn `<a>`
4. In `styles/index.css`, add a small rule so `.contact__email svg` inherits stroke colour and scales correctly

**Relevant Context:**
- `pages/information.html` lines 128–129 — the two contact anchors
- `styles/index.css` lines 241–255 — `.contact__email` styles (currently `display: inline-block`)
- Existing SVG style in the project uses `stroke="currentColor"`, `fill="none"`, `width`/`height` attributes — follow the same pattern

**Status:** [ ] pending

---

## Sub-Task 2 — Language Switch Animation

**Intent:** When the user toggles the language, a thin full-width panel sweeps from right to left across the screen, disappears, then the new language text is already in place. This masks the text swap with a slick transition.

**Expected Outcomes:**
- Clicking the language button triggers a `div.lang-wipe` overlay that slides in from the right edge, crosses the full viewport, and slides out to the left — all in ~350ms
- Text content is swapped at the midpoint (when the panel fully covers the screen)
- Works on both `index.html` (via `js/main.js`) and `information.html` (via `js/index.js`)
- The panel colour matches the site background (`--color-bg`) so it reads as a clean wipe

**Todo List:**
1. Add a `<div class="lang-wipe" id="lang-wipe"></div>` to both `index.html` and `pages/information.html`
2. In `styles/global.css`, define `.lang-wipe` — fixed, full-viewport, `background: var(--color-bg)`, `transform: translateX(100%)`, with a CSS transition; add `.lang-wipe.enter` and `.lang-wipe.exit` states
3. In `js/i18n.js`, replace `applyLang` direct call inside `toggleLang` with a new exported `toggleLangAnimated(wipeEl)` function that: adds `.enter`, waits ~175ms, calls `applyLang`, removes `.enter` and adds `.exit`, then cleans up
4. In `js/index.js` and `js/main.js`, replace the `toggleLang` click handler with `toggleLangAnimated`

**Relevant Context:**
- `js/i18n.js` lines 109–113 — `toggleLang` function to extend
- `js/index.js` line 5 — click handler wiring
- `js/main.js` line 7 — click handler wiring
- `styles/global.css` — global shared styles, correct place for the wipe overlay

**Status:** [ ] pending

---

## Sub-Task 3 — Door Click: Remove Zoom, Add Title Fade-Out

**Intent:** Remove the camera zoom-through animation entirely. Instead, when the door is clicked: (1) the hero title and tagline fade out by sliding upward, (2) the door opens, (3) the flash overlay appears and navigates to `information.html`. This keeps the scene grounded while still feeling cinematic.

**Expected Outcomes:**
- Clicking the door no longer moves the camera at all
- `.hero-name` and `.hero-tagline` fade out upward (reverse of their entrance animation) when the door is clicked
- Door open animation plays as before
- Once the door is fully open, flash overlay fades in → navigates to `pages/information.html`
- Camera stays static at `CAM_START` throughout

**Todo List:**
1. In `styles/main.css`, add a `.hero-bg.fade-out` class that reverses the entrance — `opacity: 0`, `transform: translateY(-20px)`, with a short transition (`0.5s ease`)
2. In `js/main.js`, remove the `zoomAnimating` / `zoomProgress` / `CAM_END` / zoom tween block entirely from the render loop
3. In the click handler, after setting `triggered = true`, immediately add `.fade-out` to `.hero-bg`
4. In the door animation completion block (where `doorAnimating` becomes false), trigger the flash and navigate — no zoom step in between

**Relevant Context:**
- `js/main.js` lines 64–68 — zoom state variables to remove
- `js/main.js` lines 167–182 — zoom tween block in render loop to remove
- `js/main.js` lines 128–137 — click handler
- `js/main.js` lines 155–165 — door animation tween
- `styles/main.css` lines 9–44 — `.hero-bg`, `.hero-name`, `.hero-tagline` with existing `fadeUp` animation
- `.hero-bg` is the parent element; adding `.fade-out` to it lets a single CSS rule hide both children together

**Status:** [ ] pending
