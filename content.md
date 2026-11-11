# Copy & Content Specification (`content.md`)

## 1. Copywriting Rules
- Short, direct sentences. No hype words ("revolutionary", "next-gen", "seamless", "elevate").
- No em-dashes in UI copy; use periods, commas, or middle dots (`·`).
- No `"It's not X, it's Y"` phrasing.
- Every sample venue, dish, and ticket carries a clear `DEMO` label.

## 2. Catalogue Copy (`ThemeCataloguePage.tsx`)
- **Top Floating Pill**: `Build Bros` · `Catalogue` · `01 Elegant` · `02 Minimalist` · `03 Street` · `04 Terracotta` · `/brag Reel` · `Intro Site`
- **Hero Eyebrow**: `BUILD BROS · PRODUCT OS CATALOGUE`
- **Hero Headline**: `Pick a theme. Run the restaurant live.`
- **Hero Subcopy**: `Four distinct ordering templates built for local cafes, bistros, burger joints, and pizzerias. Choose a style below to open the clean guest menu, interactive 3D floor, and kitchen pass.`
- **Closing Flip (`tasteskill.dev` signature)**:
  - Line 1: `Four distinct atmospheres,`
  - Line 2: `one calm ordering engine.`

## 3. Theme Menus (`themeCatalogData.ts`)
Each theme ships with 6 curated sample dishes across 4 clear categories:
1. **`01. Classy Elegant` (*L'Atelier Doré*)**: Truffle & Heirloom Burrata ($18), Hand-Cut Wagyu Tartare ($24), 36-Hour Crispy Duck Confit ($34), Pan-Seared Hokkaido Scallops ($32), Smoked Rosemary Negroni ($16), Dark Valrhona Soufflé ($15).
2. **`02. Minimalist` (*Kōbō Nordic*)**: Panama Geisha V60 Pour Over ($6.50), Oat Milk Flat White ($4.50), Brown Butter Cardamom Knot ($5.20), Whipped Ricotta & Fig Sourdough ($11.00), Smørrebrød Avocado & Dill ($12.50), Ceremonial Matcha Tonic ($6.00).
3. **`03. Street Style` (*Block 84 Smash*)**: Double Oklahoma Onion Smash ($11.50), Triple Jalapeño Smoke Stack ($14.00), Nashville Hot Chicken Tenders ($10.50), Tallow Animal-Style Fries ($7.50), Charred Corn Elote Cup ($6.00), Burnt Vanilla Malt Shake ($7.00).
4. **`04. Artisanal Terracotta` (*Forno Terra*)**: Margherita D.O.P. 48h Sourdough ($16.00), Diavola & Calabrian Hot Honey ($19.50), Stracciatella, Fig & Prosciutto ($21.00), Wood-Roasted Olives & Focaccia ($9.50), Pistachio Tiramisu ($11.00), Blood Orange Spritz ($13.00).

## 4. `[FILL]` & `[CONFIRM]` Slots
- `src/data/clients.json`: `[]` (`[FILL]` — real client names and photos only; section hides when empty).
- `src/data/contact.json`: Owner verified contact (`+91 92035 66401`, `9425411807`, `varchasvaateeksh77@gmail.com`).
