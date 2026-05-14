# Website Visual + Coding Analysis (LETZREZDRAW Portfolio)

This document is a combined “visual design review” and “implementation review” of the current React/Vite site in this repository. It focuses on what the user sees/feels and how that is achieved in code (architecture, rendering strategy, animations, performance patterns, and data/asset flow).

---

## 1) High-level UI/visual identity

### 1.1 Theme/branding system (CRT / classified archive aesthetic)
**What you see**
- A dark “archive terminal” look: scanlines + subtle noise overlay.
- Red accent typography, corner brackets, and “classified” UI language (FILE_ID, TOP SECRET, CLEARANCE, NETWORK RELAY).
- Multiple render styles (color palettes) switch the entire site.
- A custom cursor that replaces the system cursor for desktop, with context labels like OPEN_FILE / LINK_OPEN.

**How it’s implemented**
- `src/index.css`
  - Defines global CSS variables (`--bg-primary`, `--accent-red`, `--scan-line`, etc.).
  - Implements the scanline overlay via `body::before`.
  - Implements a noise texture overlay via `body::after` (inline SVG filter).
  - Adds CRT-like “layered” visuals using gradients, shadows, and masking.
- `src/context/RenderThemeContext.jsx`
  - Maintains `themeIndex` (0..4), persisted in `localStorage`.
  - Updates `document.documentElement.dataset.renderStyle = themeIndex + 1`.
- `src/index.css` also contains theme overrides:
  - `[data-render-style='2']`, `[data-render-style='3']`, `[data-render-style='4']`, `[data-render-style='5']`
  - These remap the CSS variables to different palettes and also change overlay opacity and some component styles.

**Practical observation**
- The entire “look” is variable-driven; the components largely rely on CSS variables + a small set of shared classes.

---

## 2) Page structure + routing model (single-page scroll sections)

### 2.1 Application layout
**What you see**
- Desktop:
  - Fixed left sidebar.
  - Fixed top navbar.
  - Main content in stacked sections: Hero → Marquee → Gallery → About → Clearance → Network.
- Mobile:
  - NavbarMobile + HeroMobile + GalleryMobile + AboutMobile + ClearanceHubMobile + FooterMobile.

**How it’s implemented**
- `src/App.jsx`
  - Detects mobile via `useIsMobile()`.
  - Conditionally renders desktop vs mobile component trees.
  - Desktop uses:
    - `<CustomCursor />`, `<RedString />`, `<Sidebar />`, `<Navbar />`
    - `<main className="app-main">` with section components.
- `src/components/Navbar.jsx`
  - Uses `scrollToSection()` to jump between section IDs:
    - FILES → `gallery`
    - PROFILE → `about`
    - CLEARANCE → `clearance`
    - NETWORK → `network`

### 2.2 Scroll behavior
**What you see**
- Smooth scrolling, but boot sequences disable scrolling temporarily.

**How it’s implemented**
- `src/index.css`: `html { scroll-behavior: smooth; scroll-padding-top: 52px; }`
- `Hero.jsx` and `HeroMobile.jsx`:
  - During boot: `document.body.style.overflow = 'hidden'`
  - After boot completion: restore overflow.

---

## 3) Hero / boot sequence visuals

### 3.1 Desktop Hero (`Hero.jsx`)
**What you see**
- A boot terminal sequence with “typing” lines.
- Optional WebGL “PixelBlast” background (only on non-mobile and when WebGL2 is supported).
- A mouse-following spotlight effect that masks the hero area (dark overlay with a radial “hole” around the mouse).
- Glitch effect on the main title occasionally.

**How it’s implemented**
- `Hero.jsx`
  - Boot sequence:
    - Uses `gsap.timeline()`
    - Each line types character-by-character using `setInterval` inside `onStart`.
    - Allows skip: keydown or click → `timeline.progress(1)`.
  - Spotlight:
    - Runs a requestAnimationFrame loop after boot.
    - Reads shared mouse coords from `pointerStore`.
    - Writes CSS variables `--spotlight-x` / `--spotlight-y` onto the `spotlightRef` element.
    - Uses CSS `mask` / `WebkitMask` with a radial-gradient centered on these CSS vars.
  - Glitch title:
    - Interval toggles `showGlitch` state.
    - Title applies `rgb-split` animation and shadow shifts.

**Implementation detail that matters visually**
- The hero spotlight overlay uses high `z-index` and masking:
  - A radial-gradient “hole” around the mouse.
- Masking changes dramatically between light and dark themes:
  - `isLightTheme` flips background colors and mask gradient color stops.

### 3.2 Mobile Hero (`HeroMobile.jsx`)
**What you see**
- Shorter boot text.
- Simplified hero copy and one main CTA button.
- No spotlight/mouse readout.

**How it’s implemented**
- `HeroMobile.jsx` uses the same pattern:
  - Boot sequence via GSAP timeline + typing intervals.
  - Skip via keydown/click/touchstart.

---

## 4) Navigation chrome: Sidebar + Navbar

### 4.1 Sidebar (`Sidebar.jsx`)
**What you see**
- Fixed vertical left strip with vertical text:
  - “LETREZDRAW”
  - “CLASSIFIED” with blinking red dot.

**How it’s implemented**
- Inline styling + `desktop-only` class (CSS controls visibility).
- Blinking dot uses `setInterval` toggling `blinkState`.

### 4.2 Navbar (`Navbar.jsx`)
**What you see**
- Fixed translucent bar:
  - Left archive ID label.
  - Center nav links that act like terminal buttons.
  - Theme cycle button: “RENDER STYLE X”.
  - Right “SIGNAL_STRONG” (blinking green dot) + a live time clock.

**How it’s implemented**
- Uses `useRenderTheme().cycleTheme`.
- Two intervals:
  - time updates every 1s
  - blink toggles every 600ms
- Nav buttons call `scrollToSection()` (no routing library involved).

---

## 5) Custom cursor + pointer pipeline (performance-first UX)

### 5.1 Shared pointer store (`pointerStore.js`)
**What you see**
- Cursor-following effects (spotlight, cursor, galaxy hover scaling).

**How it’s implemented**
- `initPointerStore()` attaches a single passive `mousemove` listener.
- Updates a global mutable object `pointer = { x, y }`.
- This avoids React re-render on each mouse move.

### 5.2 Custom cursor (`CustomCursor.jsx`)
**What you see**
- A two-layer cursor:
  - outer ring that enlarges over interactive elements
  - inner dot changes style
  - coordinate readout text (X:#### Y:####) and context label.

**How it’s implemented**
- Uses requestAnimationFrame loop to lerp cursor positions:
  - innerPos moves fast (0.42)
  - outerPos moves slow (0.14)
  - coords readout moves moderate (0.22)
- Determines “context” by checking event target:
  - BUTTON/open_file
  - A/link_open
  - inputs/select/textarea/txt_input
  - `.interactive` elements → INTERACT
- Respects reduced motion:
  - If `(prefers-reduced-motion: reduce)`, cursor becomes hidden by adding `use-system-cursor` and returning `null`.

---

## 6) Gallery system (core visual experience)

The Gallery has **two distinct presentation modes** on desktop:
1. **Slider view** (3D cards in a horizontal scroll container)
2. **Web view** (constellation “galaxy” interactive nodes)

Switch controlled by component state:
- `viewMode` in `src/components/Gallery.jsx` with buttons `[SLIDER]` and `[WEB]`.

---

### 6.1 Gallery container (`Gallery.jsx`)
**What you see**
- Section stamp “FILES FOUND {count}”.
- Mode switch buttons.
- Slider view:
  - left/right nav buttons
  - horizontally scrollable row of 3D cards
- Web view:
  - constellation view and nodes
- Clicking a card/node opens a lightbox file viewer.

**How it’s implemented**
- Data loading:
  - Fetches `artwork-manifest.json` from `public/` with a cache-busting query.
  - Hydrates entries via `hydrateArtwork()` from `src/utils/artworkUrls.js`.
  - On errors: falls back to `fallbackArtworks` from `src/data/artworks`.
- GSAP reveal:
  - Uses `gsap.context()` over the section to animate:
    - `.section-stamp`
    - `.gallery-card-item` and `.gallery-web-node-hook` elements
  - Animations are configured `once: true`.

**Notable performance approach**
- Uses `useDeferredValue(pieces)` to reduce layout pressure when pieces change.
- `ScrollTrigger.refresh()` is called after async data loads to prevent broken start positions.

---

### 6.2 Slider cards (`GalleryCard.jsx`)
**What you see**
- 3D tilt card on hover:
  - image scale + grayscale reduction on hover
  - shine streak appears
  - bottom gradient meta overlay with:
    - ID
    - category tag
    - title
    - “[ OPEN FILE ]” hint
- Corner brackets on all four corners.

**How it’s implemented**
- Hover state:
  - `hoverRef` avoids stale closures.
- Tilt effect:
  - `onMouseMove` throttled via `requestAnimationFrame`.
  - Calculates normalized pointer position in card bounds.
  - Applies `face.style.transform` with `rotateX/rotateY` and `translateZ`.
- Image behavior:
  - Uses `loading="lazy"` and `decoding="async"`.
  - Uses `srcSet` to provide 400w thumb / 1280w web (based on artwork fields).

**Visual sensitivity**
- The depth and tilt feel is primarily CSS-driven:
  - `.gallery-card-3d-wrap { perspective }`
  - `.gallery-card-3d__img` hover filter/scale
  - `.gallery-card-3d__shine` opacity/translate transitions.

---

### 6.3 Web/constellation view (`GalleryWeb.jsx`)
**What you see**
- “Galaxy” panel:
  - Slow drift of a handful of nodes (“stars”)
  - SVG lines connect nodes to nearest neighbors (k-nearest-ish)
  - Drag a node to reposition it
  - Click a node to open its file
- Small hover scaling around a star (based on cursor distance).

**How it’s implemented**
- Node subset selection:
  - Only 5 visible nodes (`DISPLAY_COUNT = 5`).
  - If there are more artworks, it deterministically picks a subset and then rotates subset every 5 seconds.
- Node layout:
  - Each node has stable motion seeds:
    - `nx`, `ny` (base normalized position)
    - `phx`, `phy` (phase angles)
  - Drift tick:
    - sin/cos updates applied every frame
    - positions are clamped via `clamp01()`.
- Edges:
  - `computeEdges(nodesRef.current, w, h)` selects neighbor connections limited by max distance and `K_NEIGHBORS`.
  - Edge recompute is rate-limited using `edgeCounterRef` / `edgeVersion` to avoid heavy work every frame.
- Pointer interaction:
  - Uses pointer events:
    - `onPointerDown` sets dragRef (captures pointer)
    - `onPointerMove` updates node normalized coordinates
    - `onPointerUp` detects click vs drag using max px and dt thresholds.
  - Uses shared global `pointer` store for hover scaling computation (distance from mx/my).

**User-perceived behavior vs code**
- Drift is constant; edges reconnect periodically (not every frame) which can make the galaxy feel organic without heavy recomputation.

---

## 7) Lightbox / file viewer (`Lightbox.jsx`)

**What you see**
- Full-screen dark overlay with blur.
- Panel slides in from bottom (y animation).
- Top row controls:
  - FULLSCREEN (opens hd image in a new tab)
  - CLOSE FILE ESC
- Main layout:
  - left: main image
  - right: metadata + description + tools + commission status
- Extras:
  - optional grid of related reference images with “[OPEN]” buttons on hover.
- Navigation:
  - [← PREV FILE], “File X of Y”, [NEXT FILE →]
  - Disabled while loading or at ends.

**How it’s implemented**
- GSAP transitions:
  - overlay fade in
  - panel y/opacity slide in
- Keyboard handling:
  - Escape triggers close
  - ArrowRight/ArrowLeft triggers next/prev
- Navigation fade:
  - Temporarily lowers opacity to imply loading
  - Uses setTimeout + GSAP for quick UI “swap” effect.

---

## 8) About section (`About.jsx`)
**What you see**
- Profile card:
  - portrait image with grayscale + scan effect and “REC” indicator
- Stats list: codename, class, clearance, location, status, remote.
- Skill chips.
- Timeline of years + specialization meters with filled tracks.

**How it’s implemented**
- Uses GSAP ScrollTrigger to reveal `.about-reveal` elements with `once: true`.
- The “REC” dot blinks via `setInterval`.

---

## 9) Clearance + commissions (`ClearanceHub.jsx`)
**What you see**
- “Transmission” themed section:
  - two-column banner: desk + transmission line
  - tier cards with prices/features
  - secure uplink panel with step-by-step process and a form.

**How it’s implemented**
- GSAP ScrollTrigger reveals:
  - `.hub-reveal` elements animate opacity and y.
- Tiers are data-driven via local `tiers` array.
- Form:
  - stub uses `alert()` and resets state.
  - note: “Connect to Formspree / backend when ready” is implied.

---

## 10) Network / social links (`Network.jsx`)
**What you see**
- Grid of “public channels”.
- Each card opens a new tab to a social URL.

**How it’s implemented**
- Uses `socialLinks` from `src/data/socialLinks.js`.
- GSAP reveals elements with ScrollTrigger.

---

## 11) Responsive design model

**What you see**
- Mobile has distinct sections and components (separate files).
- Desktop hides mobile-only parts via `.desktop-only` / `.mobile-only` classes.

**How it’s implemented**
- `src/App.jsx` uses `useIsMobile()` to choose entirely separate layouts rather than purely CSS responsive reflow.
- `src/index.css` includes:
  - `@media (max-width: 768px)`:
    - body font-size decreases
    - `.desktop-only { display: none; }`
  - `@media (min-width: 769px)`:
    - `.mobile-only { display: none; }`

---

## 12) Performance and “jank” control (coding-wise)

### 12.1 Mousemove strategy
- `pointerStore.js` + custom cursor + galaxy hover avoid React re-render on pointer move.
- GalaxyWeb additionally throttles expensive operations:
  - edges computed with rate limiting
  - nodes update in requestAnimationFrame loop.

### 12.2 Reduced motion / accessibility
- `CustomCursor` disables itself under `prefers-reduced-motion`.
- Hero boot uses animated fade but also can be effectively skipped quickly.
- GalleryWeb and CSS have reduced motion guards:
  - index.css disables gallery line animation under reduced motion.

### 12.3 Async data and layout correctness
- `Gallery.jsx`:
  - after fetching manifest and hydrating, calls `ScrollTrigger.refresh()` within `requestAnimationFrame`.
  - ensures ScrollTrigger start positions align after DOM updates.

---

## 13) Codebase organization notes (what’s “good” and what stands out)

### What’s good
- Clear separation between:
  - section components (Hero, Gallery, About, ClearanceHub, Network)
  - shared styling primitives (CSS variables + corner brackets + typography)
  - interaction-focused components (CustomCursor, GalleryWeb, Lightbox)
- Performance-aware patterns:
  - pointer store + RAF loops
  - deferred rendering in Gallery
  - rate-limited edge recomputation
  - lazy images and decoding async

### Stands out / potential improvement areas (based on current code)
- Theme system is strong (CSS vars), but some inline styles are heavy:
  - Many components use inline `style={...}` for typography and layout; extracting some into classes could improve maintainability.
- Device capability hook (`useDeviceCapability`) detects WebGL2 and reduced motion, but not every heavy effect checks it consistently (example: GalleryWeb always runs if in web mode; Hero checks device).
- `useDeviceCapability` is currently not integrated into `Hero` beyond PixelBlast rendering check; if intended, other heavy effects could be gated similarly.
- In Lightbox, extras open in a new tab by `window.open` and hover state is controlled by local state; this is visually good, but consider focus/keyboard handling for accessibility.

(These are not required changes—just analysis based on current implementation.)

---

## 14) “Visual spec” summary (quick reference)

- **Fonts:** Cinzel (headings), Share Tech Mono (body), Bebas Neue (caps labels).
- **Overlays:** scanlines (body::before), noise (body::after), spotlight mask (Hero).
- **Accents:** `--accent-red` and theme overrides.
- **Gallery:** 3D tilt cards + constellation interactive galaxy + bottom-sheet lightbox.
- **Motion:** GSAP for reveals + panel transitions; RAF loops for cursor/spotlight/galaxy drift.
- **Cursor:** two-layer custom cursor; expands on interactive elements; label indicates interaction context.

---

## Appendix: Key files referenced

- `src/index.css` — CRT overlays, theme variables, gallery styling
- `src/App.jsx` — desktop/mobile composition
- `src/components/Hero.jsx`, `src/components/HeroMobile.jsx` — boot + spotlight + glitch
- `src/components/Navbar.jsx`, `src/components/Sidebar.jsx` — fixed chrome
- `src/components/Gallery.jsx` — manifest fetch + view mode + GSAP reveals
- `src/components/GalleryCard.jsx` — 3D tilt + meta overlay
- `src/components/GalleryWeb.jsx` — constellation nodes + drag/click + edge lines
- `src/components/Lightbox.jsx` — modal viewer + keyboard nav
- `src/components/About.jsx` — profile reveal + timeline + meters
- `src/components/ClearanceHub.jsx` — tiers + secure uplink form stub
- `src/components/Network.jsx` — social links grid
- `src/pointerStore.js` — global mouse coords
- `src/components/CustomCursor.jsx` — cursor visuals + context labels
- `src/context/RenderThemeContext.jsx` — theme cycling with localStorage
