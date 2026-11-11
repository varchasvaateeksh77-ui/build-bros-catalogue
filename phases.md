# Build Phases & Verification Gates (`phases.md`)

## Phase 1 · Specification & Recon Gate
- Maintain `PRD.md`, `structure.md`, `design.md`, `theme.md`, `animation.md`, `content.md`, `phases.md`, and `SKILL.md` in the repository root.
- Verify reference alignment against `tasteskill.dev`, `threeui.com`, and `gsap.com`.

## Phase 2 · Spacious Catalogue Showcase (`ThemeCataloguePage.tsx`)
- Replace dark, dense dashboard boxes with the signature **Warm Cream (`#F7F2ED`) `tasteskill.dev` editorial canvas** and floating translucent pill nav.
- Give each of the 4 themes a breathable, uncluttered showcase card:
  - Left/Top: High-resolution studio photography with clean index badge (`01`–`04`).
  - Right/Bottom: Theme title, signature venue name, one clear sentence, 4 colour dots, 3 sample dishes with `tabular-nums` prices, and a single **`Launch Theme →`** button.
- Include the signature full-bleed 3-layer **Closing Colour Flip** (`#F7F2ED` Cream → `#E8500C` Burnt Orange → `#140905` Deep Espresso) at the bottom of the catalogue.

## Phase 3 · Uncluttered Single-Focus Live Theme (`LiveThemeInstance.tsx`)
- Eliminate the cramped side-by-side split screen.
- Render **one clean view at a time** controlled by a minimal top floating pill dock:
  1. **`Guest Menu` (Default)**: Spacious, authentic guest ordering template where each of the 4 themes uses its own distinct layout structure (Editorial Tasting List for *Classy Elegant*, 2-Column Nordic Grid for *Minimalist*, Bold Poster Grid for *Street Style*, Warm Courtyard Cards for *Artisanal Terracotta*).
  2. **`3D Table Floor` (`threeui.com` style)**: Interactive 3D/2D restaurant floor showing Table 5 zoomed or full-room view, live waiter walking animation, and table status.
  3. **`Kitchen Pass`**: Clean KDS & menu availability editor without crowding the guest menu.

## Phase 4 · Unit Tests, Browser Critique & GitHub Push
- Run `npx --yes tsx --test` across all unit test suites (`themeCatalogData.test.ts`, `floorStates.test.ts`, `demoStore.test.ts`).
- Run `compile_applet` and `lint_applet`.
- Open headless Chromium (`playwright-cli`) at desktop (`1440x900`) and mobile (`390x844`) to verify spacious layout, theme distinctiveness, and single-focus navigation.
- Push all spec files and code to `varchasvaateeksh77-ui/build-bros-catalogue` and `varchasvaateeksh77-ui/build-bros`.
