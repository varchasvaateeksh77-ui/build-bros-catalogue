---
name: build-bros-owner-profile
description: Personal engineering constitution, preferred stack, reference repositories, motion laws, and likes/dislikes for Varchasva Ateeksh (Build Bros). Load this skill at the start of any web app, motion-graphics, or site replication project to skip repetitive explanations.
---

# Owner Engineering & Design Skill (`SKILL.md`)

Use this skill as the default source of truth for **Varchasva Ateeksh (`varchasvaateeksh77-ui` / Build Bros)** across web applications, interactive 3D/2D product demos, site replications, and launch videos.

---

## 1. Owner & Contact Defaults

- **Team / Brand**: Build Bros (`2.5+ years in tech and web dev`)
- **Phone / WhatsApp**: `+91 92035 66401` and `9425411807`
- **Email**: `varchasvaateeksh77@gmail.com`
- **GitHub**: `https://github.com/varchasvaateeksh77-ui`
- **Demo Policy**: Real-life demos are provided in person; in-page interactive demos must use sample venue data clearly tagged with a `DEMO` pill.

---

## 2. Core Build Stack & Reference Repositories

### Core Runtime Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS reading semantic CSS custom properties from `src/styles/tokens.css`
- **Animation & Scroll**: GSAP 3 (`gsap`, `ScrollTrigger`, `Flip`) — pinned scroll stages, scrubbed timelines, and hard-edge `clip-path` wipes
- **3D & Spatial UI**: Three.js (`three`) procedural architectural geometry with matte materials, paired with a deterministic 2D SVG fallback (`Floor2D`) for low-power devices and `prefers-reduced-motion`
- **Audio**: Web Audio API procedural sound effects (no external audio asset bloat for UI interactions) + Kenney SFX / Sascha Ende tracks for rendered launch videos

### Essential Reference Repositories & Skills
1. **Taste Skill** — [`https://github.com/Leonxlnx/taste-skill`](https://github.com/Leonxlnx/taste-skill)
   - Enforces senior frontend engineering judgment, typographic hierarchy, real interactive product windows over static marketing cards, and zero AI-slop defaults.
2. **Replica Skill** — [`https://github.com/Jakeschincariol/replica-skill`](https://github.com/Jakeschincariol/replica-skill)
   - Two-pass replication workflow:
     - **Pass 1 (Recon)**: Measure exact hex tokens, typography scales, variable font axes (`wdth`, `slnt`, `wght`), and frame-by-frame motion timings (`replica/recon.md`, `replica/motion-log.md`, `replica/design/tokens.json`).
     - **Pass 2 (Build & Verify)**: Build from measured tokens and verify side-by-side in a real headless browser across desktop and mobile viewports.
3. **HyperFrames** — [`https://github.com/heygen-com/hyperframes`](https://github.com/heygen-com/hyperframes)
   - Deterministic HTML + GSAP motion-graphics compositions rendered to 30fps MP4 loops (`public/media/level-*.mp4`) with settled poster frames (`level-*.jpg`).
4. **Brag (`/brag`)** — [`https://github.com/latent-spaces/brag`](https://github.com/latent-spaces/brag)
   - Turns shipped projects into beat-synced 18–22s 1080p launch videos (`brag-output/brag.mp4`, `brag.jpg` baked into frame 0, `brag-plan.md`, `share-copy.txt`).
5. **Motion & 3D References**:
   - **GSAP**: [`https://gsap.com/`](https://gsap.com/)
   - **ThreeUI**: [`https://threeui.com/`](https://threeui.com/)
   - **Benchmark Design Reference**: [`https://www.tasteskill.dev/`](https://www.tasteskill.dev/) (Warm Cream `#F7F2ED` canvas, Deep Espresso `#140905` stage, Burnt Orange `#E8500C` spark, variable-axis scroll wheel, and full-bleed 3-layer closing colour flip).

---

## 3. What I Like (Always Do)

1. **Controlled, Deliberate Scroll Animations**:
   - Keep scroll-driven sections (`ScrollTrigger`) smooth and predictable.
   - Add hysteresis deadzones (`0.08`–`0.12` step buffer) so tiny touch scrolls never jitter between states.
   - Include a subtle progress bar and synchronize click-to-scroll so tapping any tab, step button, or wheel row smoothly scrolls the track to match `ScrollTrigger`.
2. **Full-Bleed Closing Colour Flip**:
   - Replicate the `tasteskill.dev` full-screen (`sticky top-0 w-full`) 3-layer hard-edged `clip-path` wipe (`#F7F2ED` Cream → `#E8500C` Burnt Orange → `#140905` Deep Espresso) where Line 1 starts sharp in ink on Cream, then blurs (`0 → 8px`) and fades as Line 2 wipes in crisp white.
3. **Clear 3D Camera Framing & Zoomed Feature Callouts**:
   - Never shrink floating UI windows until text is unreadable. Instead, pull back the 3D camera so the floor plan and floating UI cards fit comfortably without overlapping captions or bottom action bars.
   - When showing a table-specific feature (e.g., Level 1 digital menu on a table), zoom the camera directly into that table (e.g., Table 5) and render the physical QR plaque, scan cone, and floating menu card clearly.
   - When a waiter is called (Level 2), animate the waiter capsule visibly walking from the counter to the table.
4. **Mobile Keyboard & Viewport Stability**:
   - Never use raw `vh` heights (`h-[200vh]`, `h-screen`) on scroll-pinned tracks above forms; lock track heights in pixels (`px`), configure `ScrollTrigger.config({ ignoreMobileResize: true })`, and skip `ScrollTrigger` updates whenever an `INPUT`, `TEXTAREA`, or `SELECT` is focused so typing on a phone never jumps the page back to an earlier section.
5. **Tactile Sound Effects**:
   - Include subtle, pleasant Web Audio sound effects synchronized to story beats and interactive demo actions, paired with an accessible `Sound: On/Off` toggle.
6. **Strict Truth Policy**:
   - Never fabricate reviews, star ratings, client names, partner logos, team bios, or statistics.
   - Keep unconfirmed data files (`clients.json`, `partners.json`, `stats.json`) empty (`[]`) and make components hide themselves cleanly when their data array is empty.

---

## 4. What I Dislike (Hard Bans & Release Gate)

- **No Uncontrolled Scroll Jumps**: Never let a 1px touch scroll violently snap layouts or fight button taps.
- **No Cramped Overlays**: Never let a floating phone/menu card cover the entire 3D stage or collide with the bottom sticky bar.
- **No Boxed Closing Flip**: Keep the closing colour wipe full-bleed edge-to-edge, not trapped inside a bordered card.
- **No AI-Slop Visual Tells**:
  - Zero purple/indigo/violet hues or neon cyberpunk glows.
  - Zero glassmorphism (`backdrop-filter` only on the sticky top nav pill and story control pills).
  - Zero icon libraries (`lucide-react`, FontAwesome, Heroicons, Material Icons) inside product UI.
  - Zero emojis, sparkles, or decorative dot grids.
  - Zero 3-equal-card SaaS rows or bento grids.
  - Zero hover-lift (`translateY`) or hover-scale on cards.
  - Zero em-dashes (`—`) in copy and zero `"It's not X, it's Y"` phrasing.

---

## 5. Communication & Workflow Preferences

- **Do Not Ask Unnecessary Questions**: Make sensible engineering decisions, build the real working implementation, and list any assumptions at the end.
- **Concise Status Replies (Max 12 Lines)**:
  - What you built.
  - Assumptions you made.
  - What needs a real fact (`[FILL]` items still empty).
  - Anything you could not do and why.
