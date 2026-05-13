# LETREZDRAW - CLASSIFIED ART PORTFOLIO

> **"INITIALIZE ARCHIVE SYSTEM... CLEARANCE LEVEL: UNRESTRICTED... ACCESSING DECLASSIFIED ILLUSTRATIONS..."**

A high-fidelity, AAA-quality digital art portfolio website for **LETREZDRAW**, a digital illustrator specializing in character design, concept art, and environment illustration. Themed as a classified government archive with interactive declassification mechanics.

## 🎨 Theme & Aesthetic

- **Classified Archive Theme**: Browse art files like classified government documents
- **Dark Cinematic UI**: Deep blacks with strategic red accents, scan lines, and CRT effects
- **Interactive Declassification**: Full-screen lightbox dossiers with detailed metadata
- **Red String Effect**: Canvas-based string lines connecting cursor to page anchor points (like a detective's evidence board)
- **Custom Cursor**: Hollow box indicator that expands on interactive elements with context-aware labels
- **Spotlight Effect**: Hero section features a circular spotlight following the cursor
- **Typewriter Boot Sequence**: Terminal-style boot animation on page load

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The site will be available at `http://localhost:5173/`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx          # Left fixed sidebar with classified indicator
│   ├── Navbar.jsx           # Top navigation with archive ID and live time
│   ├── Hero.jsx             # Boot sequence + spotlight effect
│   ├── Gallery.jsx          # Slider/list view gallery with arrow nav
│   ├── GalleryCard.jsx      # Individual card component
│   ├── Lightbox.jsx         # Full-screen dossier modal
│   ├── About.jsx            # Subject profile section
│   ├── Commissions.jsx      # Service tiers section
│   ├── Contact.jsx          # Contact form section
│   ├── Marquee.jsx          # Scrolling banner dividers
│   ├── RedString.jsx        # Canvas red string effect
│   └── CustomCursor.jsx     # Custom cursor + coordinates display
├── hooks/
│   ├── useMousePosition.js  # Track cursor position
│   ├── useTypewriter.js     # Typewriter text effect
│   └── useTextScramble.js   # Text scramble animation
├── data/
│   └── artworks.js          # Art data array
├── App.jsx                  # Main app component
├── index.css                # Global styles + CSS variables
└── main.jsx                 # React entry point
```

## ✨ Key Features Implemented

### 1. **Boot Sequence** (Hero Section)
- Typewriter effect terminal animation on page load
- Press any key to skip and proceed to main site
- Classically themed system boot messages
- ~4 second sequence with staggered text appearance

### 2. **Gallery System**
- **Slider View** (default): Horizontal scrolling with left/right arrow navigation
- **List View** (toggle): Vertical list with thumbnails
- Smooth card transitions and hover effects
- Desaturate-to-color reveal on hover
- Scan line animation across cards on hover

### 3. **Lightbox/Dossier**
- Full-screen modal with dossier-style layout
- Main artwork image + secondary detail image
- Comprehensive metadata: year, medium, category, tags, tools
- File navigation (prev/next) with keyboard support (arrow keys, ESC)
- Custom section headers with red accents
- Typewriter text reveal on open

### 4. **Custom Cursor System**
- Small red square (8×8px) follows cursor
- Expands to hollow box (32×32px) on interactive elements
- Smooth lerp interpolation for fluid movement
- Real-time coordinate display (X:### Y:###)
- Context-aware labels (OPEN_FILE, LINK_OPEN, TXT_INPUT, INTERACT)

### 5. **Red String Effect**
- Canvas-based connection lines from 6 anchor points to cursor
- Anchor points drift on sine wave animation
- 1px red lines with 0.35 opacity for subtle effect
- Mobile: 2 anchor points only

### 6. **Hero Spotlight**
- Circular spotlight (300×300px) follows cursor smoothly
- Dark overlay (90% opacity) outside spotlight
- Blur effect (30px) for smooth falloff
- Content inside is fully visible, outside is dimmed

### 7. **Global Effects**
- **Scan Line Overlay**: CSS repeating gradient
- **Noise Texture**: SVG turbulence filter
- **Ambient Flicker**: Random screen flicker

## 🛠️ Customization

### Change Colors
Edit CSS variables in `src/index.css`:
```css
:root {
  --bg-primary: #050505;        /* Main background */
  --accent-red: #d40000;        /* Primary accent */
  --text-primary: #e8e8e8;      /* Main text */
}
```

### Update Artwork Data
Edit `src/data/artworks.js` with your artwork information.

### Modify Animations
- Hero boot sequence: `src/components/Hero.jsx`
- Cursor lerp speed: `CustomCursor.jsx` (change `0.18` multiplier)
- Spotlight lerp: `Hero.jsx` (change `0.1` multiplier)

## 📱 Responsive Design

- **Desktop**: Full sidebar, 6 anchor points for red string, optimal layout
- **Mobile**: Hidden sidebar, 2 anchor points, touch-optimized

## 🎬 Animation Details

### TypeWriter Effect
- Character-by-character reveal with 20ms per character
- Used in boot sequence and text reveals

### Custom Cursor
- Smooth lerp interpolation (0.18 factor)
- Hollow box border when expanded
- Context-aware coordinate display

### Spotlight Effect
- Smooth follow with 0.1 lerp factor
- 300×300px circular area
- 30px blur for soft edges
- Radial gradient for natural falloff

## 🚀 Technologies Used

- **React 18**: Component-based UI
- **Vite**: Lightning-fast build tool
- **GSAP**: Advanced animations and scroll triggers
- **Canvas API**: Red string effect rendering
- **CSS 3**: Grid, flexbox, variables, animations
- **Google Fonts**: Cinzel, Share Tech Mono, Bebas Neue

## 📄 License

Custom portfolio website. Modify for personal use.

---

**"DECLASSIFICATION COMPLETE. WELCOME TO THE ARCHIVE."**
