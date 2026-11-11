# Design System & 30-Item Release Gate (`design.md`)

## 1. Benchmark Aesthetic (`tasteskill.dev` + `threeui.com` + `gsap.com`)
- **Catalogue Canvas**: Warm Cream (`#F7F2ED`) primary canvas, Crisp Card White (`#FFFFFF`) / Soft Sand (`#EFE6DC`) containers, Deep Espresso (`#140905`) dark stage, and Burnt Orange (`#E8500C`) action spark.
- **Generous Whitespace**: At least 30% of every viewport must remain open canvas background. Cards use `24px`–`40px` internal padding (`p-6` to `p-10`) and `24px`–`32px` gaps.
- **Card Content Cap**: Never stack more than 3 distinct data groups inside a single card.

## 2. Core CSS Tokens (`src/styles/tokens.css`)
- `--page: #F7F2ED` (Warm Cream canvas)
- `--ink: #1A0C06` (Primary Espresso text)
- `--muted: #6E5A4F` (Secondary warm brown text)
- `--orange: #E8500C` (Primary brand spark)
- `--stage: #140905` (Deep Espresso dark surface)
- `--line: rgba(26, 12, 6, 0.10)` (Hairline divider)
- `--lime: #9BE564` (Live status dot only)

## 3. Typography
- **Catalogue Display**: `Google Sans Flex` / `Big Shoulders Display` — tight tracking (`-0.03em` to `0.01em`), bold geometric presence.
- **Editorial Body**: `Newsreader` / `Plus Jakarta Sans` — comfortable `16px`–`19px` reading measure (`55ch`–`65ch` max).
- **Code / Tabular**: `Google Sans Code` with `font-variant-numeric: tabular-nums` on every price, counter, table number, and ticket ID.

## 4. The 30-Item Release Gate
1. Only approved tokens used across the catalogue and themes.
2. Maximum 3 core hues visible per screen.
3. No pure `#000000` text on pure `#FFFFFF` backgrounds.
4. No purple, violet, indigo, or neon cyberpunk accents.
5. No decorative background gradients or glowing orbs.
6. No heavy drop shadows on cards (`1px solid` borders only).
7. No glassmorphism except the floating top navigation pill (`backdrop-filter: blur(12px)`).
8. No icon libraries (`lucide-react`, FontAwesome, Heroicons).
9. No emojis anywhere in UI or dish descriptions.
10. No 3-equal-card SaaS rows or bento grids.
11. No hover-lift (`translateY`) or hover-scale on cards.
12. No bouncing scroll arrows or pulsing rings.
13. No generic fade-up animation on every section.
14. No em-dashes in UI copy.
15. No `"It's not X, it's Y"` marketing copy.
16. No check-mark feature lists.
17. `tabular-nums` applied to all prices, quantities, and ticket numbers.
18. Visible keyboard `:focus-visible` ring on all interactive controls.
19. Skip-to-content link present in DOM.
20. `prefers-reduced-motion` respected across GSAP and 3D floor scenes.
21. Every demo screen displays a clear `DEMO` indicator.
22. Unconfirmed data files (`clients.json`) remain empty (`[]`) with zero fabricated claims.
23. Single-focus view inside initialized themes (Guest Menu, 3D Floor, and Kitchen Pass are switched cleanly, never crammed side-by-side).
24. Maximum 3 data points per menu dish item (Title + 1-line description, Price, Add button).
25. Mobile viewport (`390x844`) has zero horizontal overflow and no cramped multi-column splits.
26. Mobile form inputs never trigger `ScrollTrigger` layout jumps.
27. Three.js 3D floor pulls camera back cleanly or zooms into Table 5 without clipping UI.
28. Waiter call visibly animates waiter walking from counter to Table 5.
29. Sound effects use procedural Web Audio API with a mute toggle.
30. All unit tests (`node:test`), TypeScript lint, and production build pass with 0 errors.
