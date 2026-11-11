# Architecture & File Structure (`structure.md`)

## 1. High-Level Route & View Map
The application is organized around two uncluttered, single-purpose experiences (plus quick links to the `/brag` Reel Studio and the Introduction Site):

1. **Catalogue Showcase (`ThemeCataloguePage.tsx`)**
   - **Floating Pill Nav (`tasteskill.dev` style)**: Brand mark left, 4 theme jump links center, `/brag Reel` & `Intro Site` links right.
   - **Editorial Hero**: Warm Cream (`#F7F2ED`) canvas with a clear headline, 3-level default selector (`Level 1 Menu` · `Level 2 Waiter Call` · `Level 3 Full Ordering`), and scroll-down rhythm.
   - **4 Spacious Theme Showcases**: Large, breathable horizontal showcase cards (one per theme) with studio photography, signature typography, 4 quiet palette dots, 3 signature dishes, and a single **`Launch Theme →`** CTA.

2. **Initialized Live Theme (`LiveThemeInstance.tsx`)**
   - **Top Floating Control Pill**:
     - Left: `← Catalogue` button + active theme switcher (`01 Elegant` · `02 Minimalist` · `03 Street` · `04 Terracotta`).
     - Center: **Single-Focus View Switcher** (`Guest Menu` · `3D Floor Stage` · `Kitchen Pass`) so only ONE clean screen is rendered at a time.
     - Right: Service Level pill (`L1` · `L2` · `L3`) + `DEMO · Table 5` indicator.
   - **View A — `Guest Menu & Cart` (Default)**:
     - **Step 1 (`Browse Menu`)**: Centered, spacious restaurant menu styled 100% in the active theme's tokens and layout personality (*01. Classy Elegant* centered tasting menu, *02. Minimalist* 2-column architectural hairline grid, *03. Street Style* bold numbered poster cards, *04. Artisanal Terracotta* warm courtyard cards). Guests tap `+ Add to Cart` to build their selection, and a floating bottom pill (`Added to Cart · N dishes · $XX.XX — View Cart →`) plus header `Cart (N)` button let them open their cart when ready.
     - **Step 2 (`Your Table Cart`)**: Dedicated cart review screen where the customer can adjust quantities (`−`/`+`), add an optional kitchen note, review the total for Table 5, and tap **`Place Order for Table 5 →`** (Level 3) or **`Call Waiter to Confirm Order →`** (Level 2).
   - **View B — `3D Floor Stage` (`threeui.com` style)**:
     - Full-width interactive 12-table floor stage showing Table 5 zoomed or full-room view, live waiter walking animation when called, and active table status.
   - **View C — `Kitchen Pass`**:
     - Clean, spacious Kitchen Display System (KDS) & Owner Menu availability toggle where advancing a ticket (`NEW → COOKING → READY → SERVED`) updates the Guest Menu banner immediately.

## 2. Repository File Tree
```text
/
├── PRD.md                     # Product requirements, anti-clutter rules, reference sources
├── structure.md               # Architecture, view hierarchy, file tree, data shapes
├── design.md                  # Global tokens, typography, spacing, 30-item release gate
├── theme.md                   # Detailed specification for the 4 initializable themes
├── animation.md               # GSAP, ScrollTrigger, and 3D/2D floor motion laws
├── content.md                 # Approved copy, menus, and [FILL] / [CONFIRM] rules
├── phases.md                  # Build phases and verification gates
├── SKILL.md                   # Owner engineering profile & reference library
├── src/
│   ├── App.tsx                # Top-level view router (Catalogue <-> Live Theme <-> Brag <-> Intro)
│   ├── catalogue/
│   │   ├── themeCatalogData.ts       # 4 Theme configs, menus, and pure cart/ticket logic
│   │   ├── themeCatalogData.test.ts  # Node unit tests for themes, filtering, and cart math
│   │   ├── ThemeCataloguePage.tsx    # Spacious tasteskill.dev-inspired 4-theme showcase
│   │   └── LiveThemeInstance.tsx     # Uncluttered single-focus live ordering experience
│   ├── three/                 # Three.js procedural 12-table floor & camera states
│   ├── svg/                   # Deterministic 2D SVG floor fallback
│   └── styles/
│       ├── tokens.css         # Core CSS custom properties
│       └── global.css         # Typography and layout utilities
```
