# HyperFrames Composition Brief (`composition-brief.md`)

- **Project**: Build Bros — Digital ordering for cafes and restaurants
- **Format**: Landscape `1920x1080`, `30fps`, `20.20s` (`606` frames)
- **Look & Palette**:
  - Ground Cream: `#F7F2ED`
  - Elevated Card: `#FFFFFF` with `1px solid #E3D9D3` hairline
  - Stage Dark Espresso: `#140905`
  - Table Surface Brown: `#2A180D`
  - Primary Accent Spark: `#E8500C` (Burnt Orange)
  - Primary Ink: `#1A0C06` on light, `#FBEFE6` on dark
  - Muted Copy: `#6C625C`
- **Typography**:
  - Display & UI: `Google Sans Flex` (`wght` 500–800, `wdth` 85–125)
  - Monospace Counters, Tickets & Prices: `Google Sans Code` (`tabular-nums`)
- **Deterministic Frame Contract**:
  - Expose `window.renderAtTime(tSeconds)` so every frame `n` (`t = n / 30`) is a pure, deterministic function of time with zero async jitter.
- **Poster Frame**:
  - Extract settled frame at `t = 13.80s` (Scene 4 Level 3 live 3-window sync + architectural floor) or `t = 19.20s` (Scene 5 payoff) to `brag-output/brag.jpg` and bake into frame `0` of `brag-output/brag.mp4`.
