# Measured Motion Log (1440x900 Desktop & 360x800 Mobile)

| Trigger | Element | Property | From | To | Duration | Easing | Loops |
|---|---|---|---|---|---|---|---|
| Page load | Hero text & controls | opacity | 1 | 1 | 0ms | none | No |
| Page load | Hero Floor frame | opacity, pointLight | 0 | 1 | 600ms | power3.out | No |
| Story playback | Floor 3D / 2D + Windows | camera, transform, opacity | Scene 1 | Scene 11 | 34000ms | power2.inOut | Controlled |
| Story t=32.5s | In-frame CTA pop | opacity, scale | 0, 0.96 | 1, 1.0 | 320ms | power3.out | No |
| Scroll scrub | Draw wheel (`#draw`) | scale, opacity, color, font-variation-settings | d=-5..5 | d=0 center | scrub 0.4 | none | No |
| In-view | How it works cards (`#how`) | video / canvas playhead | 0s | 12s / 16s / 18s | 12-18s | linear | Yes (while >=50% in view) |
| Scroll scrub | Before & after (`#change`) | floor state, pill, caption | Step 1 | Step 4 | 600ms / 250ms | power2.inOut | No |
| Tap | Demo Venue chips | Flip layout, opacity | old menu | new menu | 300ms | power3.out | No |
| Tap | Demo Order / Call Waiter | row slide, status swap, total ticker | idle | active | 240ms / 700ms | power3.out | No |
| Tap | Setup Tabs & FAQ Accordion | indicator x, panel height/opacity | closed | open | 240ms | power3.out | No |
| Scroll scrub | Closing flip (`#flip`) | clip-path inset, filter blur, opacity | cream | orange -> dark | scrub 0.4 | none | No |
