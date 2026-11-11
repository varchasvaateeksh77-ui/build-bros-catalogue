# Architecture & File Structure (`structure.md`)

## 1. High-Level Route & View Map
The application is organized around the **4-Theme Product Catalogue** and the **Initialized Live Restaurant OS**:

1. **Catalogue Showcase (`ThemeCataloguePage.tsx`)**
   - **Floating Pill Nav (`tasteskill.dev` style)**: Brand mark left, 4 theme jump links center, `/brag Reel` & `Intro Site` links right.
   - **Editorial Hero**: Warm Cream (`#F7F2ED`) canvas with a clear headline, 3-level default selector (`Level 1 · Digital Menu`, `Level 2 · Waiter Call`, `Level 3 · Full Ordering`), and scroll-down rhythm.
   - **4 Spacious Theme Showcases**: Large, breathable horizontal showcase cards (one per theme) with studio photography, signature typography, 4 quiet palette dots, 3 signature dishes, and a single **`Launch Theme →`** CTA.

2. **Initialized Live Theme (`LiveThemeInstance.tsx` + `server.ts`)**
   - **Top Floating Operational Switcher**:
     - Left: `← Catalogue` button + active theme switcher (`01. Elegant` · `02. Minimalist` · `03. Street` · `04. Terracotta`).
     - Center: **Real Operational Screens** (`Guest Phone` · `Waiter Screen (N)` · `Kitchen Screen (N)` · `Backend & Sync`).
     - Right: Service Level pill (`L1` · `L2` · `L3`) + `Owner PIN` hidden admin trigger (also accessible via triple-tapping the Table badge or `Shift + A`).
   - **View 1 — `Guest Phone` (`DishSwipeDeck.tsx` + Table Cart)**:
     - **Swipe Deck (Default)**: Interactive card deck with dish photo placeholders/uploads where swiping right (`Swipe Right · + Cart →`) adds the dish to the cart and swiping left (`← Swipe Left · Skip`) skips to the next dish. Includes a toggle to switch to `Menu List` view anytime.
     - **Your Table Cart & Level 2 Standby**: Dedicated cart review screen. In **Level 2**, tapping **`Call Waiter to Confirm Order →`** keeps the customer inside the Cart on a live **Waiter Called · Please Standby** screen (`Calling` → `Waiter Walking to Table 5` → `Confirmed by Waiter`). In **Level 3**, tapping **`Place Order →`** dispatches the ticket directly to the Kitchen Screen.
   - **View 2 — `Waiter Screen` (Waiter Handheld App)**:
     - Receives real-time Server-Sent Events (`/api/events`) whenever a table calls a waiter or when the kitchen marks an order `READY` on the pass.
     - Displays the guest's pre-selected cart items and provides 1-tap waiter actions: **`1. Acknowledge · Walking to Table 5`** and **`2. Confirm Cart at Table & Send to Kitchen`**.
   - **View 3 — `Kitchen Screen` (Kitchen Display System)**:
     - Live ticket queue showing incoming orders (both direct Level 3 orders and waiter-confirmed Level 2 carts) with dish quantities, kitchen notes, and status progression (`INCOMING → CONFIRMED → COOKING → READY → SERVED`).
   - **View 4 — `Backend & Sync`**:
     - Architectural breakdown of the Express + SSE (`server.ts`) real-time notification pipeline.
   - **View 5 — `Hidden Owner Admin Panel` (`OwnerAdminPanel.tsx`)**:
     - PIN-protected (`1234`) studio where the restaurant owner can edit dish prices live, upload new dish photos (`FileReader` or URL), toggle Sold Out, or add new dishes directly to the Swipe Deck.

## 2. Repository File Tree
```text
/
├── PRD.md                     # Product requirements, anti-clutter rules, reference sources
├── structure.md               # Architecture, view hierarchy, file tree, data shapes
├── design.md                  # Global tokens, typography, spacing, 30-item release gate
├── theme.md                   # Detailed specification for the 4 initializable themes
├── animation.md               # GSAP, ScrollTrigger, and Swipe Deck motion laws
├── content.md                 # Approved copy, menus, and [FILL] / [CONFIRM] rules
├── phases.md                  # Build phases and verification gates
├── SKILL.md                   # Owner engineering profile & reference library
├── server.ts                  # Full-stack Express + SSE (/api/events) real-time backend
├── src/
│   ├── App.tsx                # Top-level view router (Catalogue <-> Live Theme <-> Brag <-> Intro)
│   ├── catalogue/
│   │   ├── themeCatalogData.ts       # 4 Theme configs, dish photo placeholders, cart & admin helpers
│   │   ├── themeCatalogData.test.ts  # Node unit tests for themes, cart math, and admin updates
│   │   ├── ThemeCataloguePage.tsx    # Spacious tasteskill.dev-inspired 4-theme showcase
│   │   ├── DishSwipeDeck.tsx         # Tactile right-to-cart / left-to-skip dish swipe deck
│   │   ├── OwnerAdminPanel.tsx       # Hidden PIN-protected owner menu, price & photo manager
│   │   └── LiveThemeInstance.tsx     # Guest Phone, Waiter Screen, Kitchen KDS & Backend views
│   ├── three/                 # Three.js procedural 12-table floor & camera states
│   ├── svg/                   # Deterministic 2D SVG floor fallback
│   └── styles/
│       ├── tokens.css         # Core CSS custom properties
│       └── global.css         # Typography and layout utilities
```
