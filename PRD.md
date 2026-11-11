# Product Requirements Document (`PRD.md`) — Build Bros Theme Catalogue & Ordering OS

## 1. What & Why
Build Bros sells a digital table-ordering system to local cafes, bistros, street-food joints, and pizzerias. While the introduction site explains *why* a restaurant needs Build Bros, this standalone **Product Theme Catalogue & Live Ordering OS** is the actual product showcase: a curated collection of **4 distinct restaurant themes** that an owner or client can browse and **initialize live in one click** without clutter.

## 2. Core Design Philosophy (Why Clutter Is Banned)
A restaurant guest sitting at a table wants to pick food in 15 seconds, not read a SaaS dashboard. Every template must feel **spacious, calm, and effortless to navigate**:
- **One view at a time**: Never cram the Guest Menu, Kitchen Pass, Reception Desk, and 12-Table Floor Map onto the same screen simultaneously.
- **Guest Menu first**: Initializing a theme boots directly into the clean **Guest Table Experience** with generous whitespace, clear category tabs, scannable dish rows, and a single sticky cart bar.
- **Clean Mode Switcher**: A minimal floating pill dock lets the viewer switch cleanly between **1. Guest Menu**, **2. 3D Table Floor**, and **3. Kitchen Pass** one screen at a time.

## 3. The 4 Curated Product Themes
1. **`01. Classy Elegant` (*L'Atelier Doré*)** — Candlelit fine-dining & wine bistro. Deep obsidian walnut canvas (`#0E0B09`), brushed antique gold spark (`#C89D54`), high-contrast `Cormorant Garamond` serif display titles.
2. **`02. Minimalist` (*Kōbō Nordic*)** — Scandinavian specialty coffee & sourdough bakery. Warm alabaster paper (`#FAF9F5`), deep pine ink (`#1E3F2B`), architectural `Plus Jakarta Sans` geometry, hairlines, and daylight clarity.
3. **`03. Street Style` (*Block 84 Smash*)** — Urban late-night smash burgers & fry joint. Asphalt dark (`#111111`) with raw concrete cards, high-voltage flame orange (`#FF4D00`), bold condensed `Big Shoulders Display` poster type.
4. **`04. Artisanal Terracotta` (*Forno Terra*)** — Wood-fired Neapolitan pizzeria & sunlit courtyard. Warm kiln clay (`#F7F1E7`), roasted terracotta spark (`#C84B24`), expressive `Fraunces` editorial serif.

## 4. Reference Sources & Inspiration Sites
1. **`https://www.tasteskill.dev/`** & **`https://github.com/Leonxlnx/taste-skill`** — Floating translucent pill navigation, warm cream (`#F7F2ED`) to deep espresso (`#140905`) contrast, generous card padding, variable-axis typography, and zero AI-slop card clutter.
2. **`https://github.com/Jakeschincariol/replica-skill`** — Measured token discipline (`tokens.css`), exact typographic scale, and side-by-side headless browser verification.
3. **`https://threeui.com/`** — Clean spatial 3D/2D interactive floor stage (`Floor3D` / `Floor2D`) with clear camera framing and single-table callouts.
4. **`https://gsap.com/`** — Smooth `gsap` + `ScrollTrigger` transitions, clip-path wipes, and controlled scroll hysteresis.
5. **`https://github.com/heygen-com/hyperframes`** & **`https://github.com/latent-spaces/brag`** — Deterministic HTML/GSAP motion-graphics loops (`level-1..3.mp4`) and vertical 9:16 `/brag` launch reel (`brag-output/brag.mp4`).

## 5. Non-Negotiable Hard Rules
1. **Truth**: Never invent client names, reviews, star ratings, or fake testimonials. Keep unconfirmed data files empty (`[]`).
2. **Demo Tag**: Sample venues, menus, and ticket numbers carry a visible `DEMO` indicator.
3. **Zero Clutter**: Maximum 3 data points per dish row (Title + 1-line description, Price, Add button). No multi-panel developer dashboards crammed next to the guest phone.
4. **No AI-Design Tells**: No purple/neon glows, no glassmorphism spam, no icon libraries (`lucide-react`), no emojis, no 3-equal-card SaaS rows, no hover-lift scale gimmicks.
