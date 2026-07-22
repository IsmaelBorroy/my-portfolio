# Portfolio Plan

## Overview

Build a two-page personal portfolio for Ismael Borroy.

- **`pages/main.html`** — Entrance screen. Shows the `Door.glb` model centred on screen with "Ismael Borroy" text visible behind it. Clicking the door opens it and triggers a camera-forward zoom animation, then a white flash, then navigates to `index.html`.
- **`pages/index.html`** — Main portfolio page. Sections: About, Skills, Experience, Projects, Contact. Placeholder content throughout, ready to be filled in.

**Visual style:** Organic modern. Primary color `#1e3a2f` (deep forest green). Dark background, natural/earthy tones, clean typography.

**Asset constraints:** Only `assets/models/Door.glb` is available. No external images. All JS goes in `js/`. All CSS goes in `styles/`. Pages live in `pages/`.

**i18n:** Both pages have an EN/ES language toggle button with an inline SVG translate icon. No external library — translations are stored as a plain JS object in `js/i18n.js` and applied by swapping `data-i18n` keyed elements on click. The active language is persisted in `localStorage` so it survives the page transition.

---

## Sub-Tasks

---

### Sub-Task 1 — Global Styles

**Intent:** Establish the design system (colors, typography, resets) that both pages share.

**Expected Outcomes:**
- `styles/global.css` exists with CSS variables, resets, and base typography.
- Both pages can link to it and get a consistent look.

**Todo List:**
1. Create `styles/global.css`
2. Define CSS custom properties: `--color-bg`, `--color-primary` (`#1e3a2f`), `--color-accent` (warm off-white `#e8dcc8`), `--color-text`, `--color-muted`
3. Add a full reset (`*, box-sizing`, margin/padding zeroed)
4. Set base font — use Google Fonts `Cormorant Garamond` (elegant serif, fits organic modern) loaded via `@import`
5. Add base `body` styles: dark background, accent text color, font
6. Add utility classes: `.visually-hidden`, `.container` (max-width centered)
7. Create `js/i18n.js`: export a `translations` object with `en` and `es` keys covering all text strings for both pages. Export an `applyLang(lang)` function that reads `data-i18n` attributes in the DOM and swaps text. Persist chosen language to `localStorage` under key `'lang'`.

**Relevant Context:**
- `styles/` is currently empty
- Both `pages/main.html` and `pages/index.html` will link `../styles/global.css`

**Status:** [x] done

---

### Sub-Task 2 — main.html (Entrance Screen)

**Intent:** Build the entrance page with the 3D door, the name behind it, and the transition sequence.

**Expected Outcomes:**
- `pages/main.html` renders the door centred on a full-viewport dark canvas
- "Ismael Borroy" is visible as large text layered behind the 3D canvas (CSS z-index trick: canvas background is transparent, name sits on the page body behind it)
- Clicking the door: plays the `-90°` open tween, then animates the camera zooming forward through the opening (z position moves toward and past the door), then triggers a white flash overlay that fades in fully, then `window.location` navigates to `index.html`
- Camera is static (no OrbitControls)

**Todo List:**
1. Create `pages/main.html` with semantic HTML: `<div id="name">Ismael Borroy</div>`, `<div id="canvas-container">`, link `../styles/global.css` and `../styles/main.css`
2. Add a translate toggle button in the top-right corner: `<button id="lang-toggle">` containing the inline SVG translate icon + a `<span data-i18n="lang_label">` showing the target language name
3. Add `<script type="importmap">` for Three.js CDN (same version as Test/)
4. Add `<script type="module" src="../js/main.js">`
5. Create `styles/main.css`: full-viewport layout, name centered behind canvas using absolute positioning + `z-index`, large serif font, subtle fade-in on load, lang button positioned fixed top-right
6. Create `js/main.js`:
   - Import and apply `applyLang` from `../js/i18n.js` on load (reads `localStorage`)
   - Wire the `#lang-toggle` button to switch language and re-apply
   - Scene setup (transparent renderer background so the CSS name shows through)
   - Load `../assets/models/Door.glb`, auto-center/scale
   - Find `Door` node by name for rotation tween
   - On click: raycast → open door tween (`-90°`, 0.6s ease-in-out) → then camera zoom-forward tween (move camera z from start toward `0`, duration ~1s) → then trigger white flash overlay fade-in (CSS class toggle) → then after flash completes `window.location.href = 'index.html'`
   - Animate loop with `clock.getDelta()`

**Relevant Context:**
- Working reference in `Test/main.js` — reuse the door open tween, raycaster, and easeInOut logic
- Door node name is `'Door'`, Frame node is `'Frame'`
- Open angle is `-Math.PI / 2`, camera currently at `(0, 1.2, 3)` looking at origin
- Renderer background must be set to `null` / `alphaTest` so the CSS layer behind shows through

**Status:** [x] done

---

### Sub-Task 3 — index.html (Portfolio Page)

**Intent:** Build the main portfolio page with all sections, smooth scroll navigation, and a fade-in entrance (receives the white-flash transition from main.html).

**Expected Outcomes:**
- `pages/index.html` has a fixed top nav with anchor links: About, Skills, Experience, Projects, Contact
- Each section is full-width with placeholder content
- Page fades in from white on load (reversing the flash from main.html)
- Fully responsive layout

**Todo List:**
1. Create `pages/index.html` with sections: `#about`, `#skills`, `#experience`, `#projects`, `#contact`
2. Add the same translate toggle button in the nav: `<button id="lang-toggle">` with inline SVG translate icon + `<span data-i18n="lang_label">`
3. Mark every text node with `data-i18n="<key>"` attributes so `applyLang` can swap them
4. Link `../styles/global.css` and `../styles/index.css`
5. Add `<script type="module" src="../js/index.js">`
6. Create `styles/index.css`: fixed nav, section layouts, cards for projects/experience, skill tags, contact form or links, fade-in-from-white animation on page load
7. Create `js/index.js`: import and apply `applyLang` from `../js/i18n.js` on load, wire `#lang-toggle`, fade-in on load, smooth scroll behavior, scroll-triggered reveal animations (Intersection Observer) for sections

**Relevant Context:**
- Placeholder content for all sections — real content will be filled in by user later
- `js/index.js` is currently empty
- `styles/` is currently empty

**Status:** [x] done

---

## File Map

```
assets/
  models/Door.glb         ← only 3D asset
js/
  main.js                 ← Three.js entrance scene + transition logic
  index.js                ← portfolio page interactivity
  i18n.js                 ← translation strings + applyLang helper (shared)
pages/
  main.html               ← entrance page
  index.html              ← portfolio page
styles/
  global.css              ← shared design tokens + reset
  main.css                ← entrance page layout
  index.css               ← portfolio page layout
```
