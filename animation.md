# Motion & Spatial Architecture (`animation.md`)

## 1. Motion Principles (`gsap.com` + `threeui.com` + `tasteskill.dev`)
- **Transform & Opacity Only**: All UI transitions animate `transform` and `opacity` (or `clip-path` for hard-edge wipes). Never animate layout properties (`width`, `height`, `top`, `left`, `margin`).
- **Calm, Intentional Transitions**:
  - Switching between the 4 Themes in the Catalogue or inside `LiveThemeInstance` uses a crisp cross-fade without layout jump.
  - Switching between the 3 Single-Focus Views (`Guest Menu`, `3D Floor Stage`, `Kitchen Pass`) inside an initialized theme keeps the top floating pill steady and transitions the stage cleanly.

## 2. Interactive 3D / 2D Table Floor (`FloorFrame` / `Floor3D` / `Floor2D`)
Inside the initialized theme's **`3D Floor Stage`** view (as well as the Intro Site's hero and level stages):
1. **Level 1 (`Menu on every table`)**:
   - Camera zooms smoothly to **Table 5** (`cameraZoom: 'table5'`) so the physical QR stand, warm scan cone, and table surface are clearly legible.
2. **Level 2 (`Call a waiter`)**:
   - Tapping `Call Waiter` in the Guest Menu triggers an amber call ring on the active table and animates the **Waiter figure** walking along the floor path from the counter to the table.
3. **Level 3 (`Order from the table`)**:
   - Placing an order in the Guest Menu routes a live ticket pulse from the active table to the Reception and Kitchen pass stations on the floor plan.

## 3. Reduced Motion & Mobile Rules
- When `prefers-reduced-motion: reduce` is enabled, the 2D SVG architectural floor (`Floor2D.tsx`) renders static deterministic states immediately without continuous loops.
- Mobile viewports lock scroll-pinned tracks in pixels (`px`) and ignore keyboard resize events (`ignoreMobileResize: true`) so typing in any input never jumps the scroll position.
