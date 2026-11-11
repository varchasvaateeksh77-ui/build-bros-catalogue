# Brag Plan: Build Bros (`brag-plan.md`)

## 1. Inspection & 9-Question Rubric

1. **What is it (one sentence)?**
   Build Bros is a browser-based digital ordering system for local cafes and restaurants that connects table QR codes directly to guest phones, waiter call alerts, reception screens, and kitchen ticket boards.
2. **Who is it for, and what does it do for them?**
   Built for independent cafe and restaurant owners whose floor staff spend peak Saturday shifts running paper menus and handwritten tickets back and forth.
3. **What sets it apart?**
   Three modular levels (Level 1 Digital Menu, Level 2 Waiter Call, Level 3 Full Ordering) where each level includes the one before it—zero app downloads, zero guest accounts, and zero custom hardware lock-in.
4. **What's the most impressive or sharpest claim?**
   "8:40 pm. Saturday. Twelve tables, two staff." — One scan on Table 5 opens the menu, calls the waiter with the table number, or sends Ticket `#0412` straight to the kitchen pass.
5. **What's the visual hook?**
   The architectural 3D floor plan of a 12-table cafe where Table 5 lights up in burnt orange (`#E8500C`) as the guest phone, reception screen, and kitchen pass synchronize in real time.
6. **What real UI or flow should be shown?**
   - Scene 1 (Hook): `"8:40 pm. Saturday. Twelve tables, two staff."` over the 12-table architectural floor with Table 5 illuminated in `#E8500C`.
   - Scene 2 (Level 1 Reveal): Zoomed Table 5 QR scan opening the real `Menu · Table 5` browser card (`Flat white 3.50`, `Smash burger 9.50`, `No app · No account`).
   - Scene 3 (Level 2 Highlight): Guest cart (`2x Flat white`, `1x Smash burger`, `16.50`) tapping `Call waiter` → Waiter alert `Table 5 needs you` as staff capsule S1 walks to Table 5.
   - Scene 4 (Level 3 Live Sync): `Ticket #0412 · Table 5` firing simultaneously into the Reception (`Incoming`) and Kitchen (`New → Cooking → Ready → Served`) windows.
   - Scene 5 (Closing Flip & Outro): Full-bleed hard-edged colour wipe (`#F7F2ED` Cream → `#E8500C` Burnt Orange → `#140905` Deep Espresso): `"Stop running orders, start running your restaurant."` — `Build Bros`.
7. **What tone fits?**
   `polished` + tactile editorial punch (inspired by `tasteskill.dev`: warm cream `#F7F2ED`, deep espresso `#140905`, burnt orange `#E8500C`, `Google Sans Flex` + `Google Sans Code`).
8. **What's the one-line share caption?**
   `8:40 pm. Saturday. Twelve tables, two staff. We built Build Bros so cafes and restaurants can stop running orders and start running their floor—from a simple table menu to waiter calls and live kitchen tickets, with zero app downloads.`
9. **Privacy & Safety Check:**
   Uses only fictional demo dishes (`Flat white 3.50`, `Smash burger 9.50`, `Ticket #0412`, `Table 5`) with visible `DEMO` badges. No personal data or secrets included.

---

## 2. Music Cue Guidance

- **Track**: `happy-beats-business-moves-vol-10-by-ende-dot-app.mp3` (109.96 BPM,Sascha Ende, CC BY 4.0)
- **Target Duration**: `20.20s` (606 frames at 30fps, landing cleanly on the `20.19s` strong beat cue)
- **Beat Grid Landmarks Used**:
  - `0.00s` / `0.27s`: Scene 1 Hook kick-in (`impactSoft_medium_001.ogg`)
  - `3.55s`: Cut to Scene 2 — Level 1 Table 5 QR Scan & Menu (`card-slide-1.ogg`, `click_003.ogg` at `4.64s`)
  - `7.79s`: Cut to Scene 3 — Level 2 One-Tap Waiter Call (`click_002.ogg` at `8.73s`, `bong_001.ogg` at `9.29s`)
  - `12.02s`: Cut to Scene 4 — Level 3 Full Ordering & Kitchen Sync (`click_005.ogg` at `12.56s`, `impactBell_heavy_000.ogg` at `14.20s`)
  - `16.38s`: Cut to Scene 5 — Full-bleed Colour Flip (`#F7F2ED` → `#E8500C` at `17.47s` → `#140905` at `18.55s`, `impactSoft_medium_004.ogg`)
  - `20.19s`: Strong beat resolve & fade out.

---

## 3. Scene-by-Scene Storyboard (20.20s total @ 30fps)

| Scene | Time (s) | Frames | Visual & Real UI Shown | On-Screen Text | Audio / SFX Cues |
|---|---|---|---|---|---|
| **1. The Hook** | `0.00 – 3.55s` | `0 – 106` | Dark espresso `#140905` architectural 12-table floor plan; Table 5 pulses in burnt orange `#E8500C` while two staff markers patrol. | `8:40 pm. Saturday.`<br>`Twelve tables, two staff.` | `0.27s`: `impactSoft_medium_001.ogg` |
| **2. Level 1: Menu on Every Table** | `3.55 – 7.79s` | `107 – 233` | Camera zooms to Table 5 QR plaque; real `Menu · Table 5` window opens showing `Flat white 3.50`, `Iced tea 3.00`, `Smash burger 9.50` with `DEMO` and `No app needed` tags. | `Level 1 · Digital menu`<br>`Scan the table. Open in browser. Zero apps.` | `3.55s`: `card-slide-1.ogg`<br>`4.64s`: `click_003.ogg` |
| **3. Level 2: Menu + Waiter Call** | `7.79 – 12.02s` | `234 – 360` | Guest cart rolls up to `16.50`; simulated cursor taps `Call waiter` button under the cart; Waiter alert card slides in (`Table 5 · Needs you`) and staff marker S1 walks to Table 5. | `Level 2 · Waiter call`<br>`One button under the cart calls the waiter.` | `7.79s`: `card-slide-1.ogg`<br>`8.73s`: `click_002.ogg`<br>`9.29s`: `bong_001.ogg` |
| **4. Level 3: Straight to Kitchen** | `12.02 – 16.38s` | `361 – 491` | Guest taps `Place order · 16.50`. Live 3-window split: Guest Phone (`Ticket #0412`), Reception (`Incoming → Confirmed`), and Kitchen Pass (`New → Cooking → Ready`). | `Level 3 · Full ordering`<br>`Table to reception and kitchen in one tap.` | `12.02s`: `impactSoft_medium_002.ogg`<br>`12.56s`: `click_005.ogg`<br>`14.20s`: `impactBell_heavy_000.ogg` |
| **5. The Closing Flip & Payoff** | `16.38 – 20.20s` | `492 – 606` | Hard-edged full-screen wipe from `#F7F2ED` Cream to `#E8500C` Burnt Orange (`17.47s`) to `#140905` Deep Espresso (`18.55s`). Line 1 blurs out (`0 → 8px`) as Line 2 locks in sharp white above the `BB · Build Bros` badge. | `Stop running orders,`<br>`start running your restaurant.`<br>`Build Bros · Three levels for your floor` | `16.38s`: `impactSoft_medium_004.ogg`<br>`18.55s`: `impactSoft_medium_001.ogg` |
