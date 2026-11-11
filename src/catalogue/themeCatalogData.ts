export type ThemeId =
  | 'classy-elegant'
  | 'minimalist'
  | 'street-style'
  | 'artisanal-terracotta';

export type ServiceLevel = 1 | 2 | 3;

export interface ThemeMenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  tag?: string;
  soldOut?: boolean;
  prepMinutes: number;
}

export interface ThemePalette {
  mode: 'dark' | 'light';
  canvas: string;
  surface: string;
  elevated: string;
  text: string;
  muted: string;
  accent: string;
  accentText: string;
  border: string;
  floorGround: string;
  floorTable: string;
}

export interface ProductThemeConfig {
  id: ThemeId;
  indexNumber: string;
  styleName: string;
  defaultVenueName: string;
  venueSubtitle: string;
  tagline: string;
  description: string;
  heroImage: string;
  displayFont: string;
  bodyFont: string;
  cardRadius: string;
  buttonRadius: string;
  currencySymbol: string;
  palette: ThemePalette;
  categories: string[];
  menu: ThemeMenuItem[];
}

export interface LiveOrderTicket {
  ticketNumber: string;
  tableNumber: number;
  items: { id: string; name: string; qty: number; price: number; note?: string }[];
  total: number;
  status: 'incoming' | 'confirmed' | 'cooking' | 'ready' | 'served';
  createdAt: string;
}

export interface LiveWaiterCall {
  id: string;
  tableNumber: number;
  cartCount: number;
  cartTotal: number;
  reason: 'Order ready in cart' | 'Question for waiter' | 'Bill requested';
  status: 'calling' | 'walking' | 'assisted';
  createdAt: string;
}

export const PRODUCT_THEMES: ProductThemeConfig[] = [
  {
    id: 'classy-elegant',
    indexNumber: '01',
    styleName: 'Classy Elegant',
    defaultVenueName: "L'Atelier Doré",
    venueSubtitle: 'Candlelit Bistro & Wine Bar',
    tagline: 'Chiaroscuro dining with antique brass details and sommelier pairings.',
    description:
      'Designed for fine-dining rooms, wine bars, and tasting-menu bistros. High-contrast Cormorant Garamond typography over deep obsidian walnut surfaces and brushed gold accents.',
    heroImage: '/src/assets/images/theme_classy_elegant_bistro_1794394475547.jpg',
    displayFont: '"Cormorant Garamond", Georgia, serif',
    bodyFont: '"Plus Jakarta Sans", sans-serif',
    cardRadius: '16px',
    buttonRadius: '10px',
    currencySymbol: '$',
    palette: {
      mode: 'dark',
      canvas: '#0E0B09',
      surface: '#17120F',
      elevated: '#211A15',
      text: '#F5EFE6',
      muted: '#A6998A',
      accent: '#C89D54',
      accentText: '#0E0B09',
      border: 'rgba(200, 157, 84, 0.24)',
      floorGround: '#0E0B09',
      floorTable: '#2B1F17',
    },
    categories: ['All', 'Small Plates', 'Mains', 'Cellar & Cocktails', 'Dessert'],
    menu: [
      {
        id: 'ce-1',
        name: 'Truffle & Heirloom Burrata',
        category: 'Small Plates',
        price: 18.0,
        description:
          'Pugliese creamy burrata, shaved black Périgord truffle, aged Modena balsamic, grilled sourdough.',
        tag: "Chef's Signature",
        prepMinutes: 8,
      },
      {
        id: 'ce-2',
        name: 'Hand-Cut Wagyu Tartare',
        category: 'Small Plates',
        price: 24.0,
        description:
          'A5 Miyazaki tenderloin, confit egg yolk, caperberry, shallot, toasted brioche soldiers.',
        prepMinutes: 10,
      },
      {
        id: 'ce-3',
        name: '36-Hour Crispy Duck Confit',
        category: 'Mains',
        price: 34.0,
        description:
          'Slow-rendered Gascony duck leg, velvety pomme purée, charred baby carrots, sour cherry jus.',
        tag: 'House Classic',
        prepMinutes: 16,
      },
      {
        id: 'ce-4',
        name: 'Saffron & Bone Marrow Risotto',
        category: 'Mains',
        price: 31.0,
        description:
          'Acquerello carnaroli rice, roasted veal marrow, 24-month Parmigiano Reggiano, gremolata.',
        prepMinutes: 18,
      },
      {
        id: 'ce-5',
        name: 'Barolo DOCG Nebbiolo (Glass)',
        category: 'Cellar & Cocktails',
        price: 19.0,
        description:
          'Piedmont 2019 vintage. Aromas of dried rose petal, wild cherry, and warm spice.',
        prepMinutes: 3,
      },
      {
        id: 'ce-6',
        name: 'Valrhona 70% Cacao & Hazelnut Tart',
        category: 'Dessert',
        price: 15.0,
        description:
          'Warm dark chocolate ganache, Piedmontese roasted hazelnut praline, flaky Maldon sea salt.',
        prepMinutes: 7,
      },
    ],
  },
  {
    id: 'minimalist',
    indexNumber: '02',
    styleName: 'Minimalist',
    defaultVenueName: 'Kōbō Nordic',
    venueSubtitle: 'Specialty Coffee & Sourdough Bakery',
    tagline: 'Daylight travertine stone, quiet architectural lines, and single-origin clarity.',
    description:
      'Built for specialty coffee roasteries, Scandinavian bakeries, and daylight brunch spaces. Ultra-clean Plus Jakarta Sans typography, warm alabaster paper surfaces, and pine accents.',
    heroImage: '/src/assets/images/theme_minimalist_nordic_cafe_1794394476496.jpg',
    displayFont: '"Plus Jakarta Sans", sans-serif',
    bodyFont: '"Plus Jakarta Sans", sans-serif',
    cardRadius: '14px',
    buttonRadius: '8px',
    currencySymbol: '$',
    palette: {
      mode: 'light',
      canvas: '#FAF9F5',
      surface: '#FFFFFF',
      elevated: '#F2EFE9',
      text: '#141413',
      muted: '#686662',
      accent: '#1E3F2B',
      accentText: '#FAF9F5',
      border: '#E2DDD5',
      floorGround: '#181816',
      floorTable: '#302E2A',
    },
    categories: ['All', 'Filter & Espresso', 'Bakery', 'Tartines', 'Botanical'],
    menu: [
      {
        id: 'mn-1',
        name: 'Panama Geisha V60 Pour Over',
        category: 'Filter & Espresso',
        price: 6.5,
        description:
          'Washed Boquete high-altitude lot. Delicate notes of jasmine blossom, bergamot, and white peach.',
        tag: 'Single Origin',
        prepMinutes: 5,
      },
      {
        id: 'mn-2',
        name: 'Oat Milk Flat White',
        category: 'Filter & Espresso',
        price: 4.5,
        description:
          'Double ristretto of our seasonal Nordic light-medium espresso with silky micro-foamed oat.',
        prepMinutes: 3,
      },
      {
        id: 'mn-3',
        name: 'Brown Butter Cardamom Knot',
        category: 'Bakery',
        price: 5.2,
        description:
          'Hand-braided laminated brioche, freshly mortared green cardamom pods, raw cane glaze.',
        tag: 'Warm from Oven',
        prepMinutes: 2,
      },
      {
        id: 'mn-4',
        name: 'Whipped Ricotta & Black Fig Tartine',
        category: 'Tartines',
        price: 11.5,
        description:
          '36-hour country levain sourdough, lemon-thyme whipped ricotta, mission figs, raw heather honey.',
        prepMinutes: 8,
      },
      {
        id: 'mn-5',
        name: 'Avocado & Soft Egg Smørrebrød',
        category: 'Tartines',
        price: 13.0,
        description:
          'Dense seeded Danish rye,6-minute pasture egg, pickled red shallot, cold-pressed dill oil.',
        prepMinutes: 9,
      },
      {
        id: 'mn-6',
        name: 'Ceremonial Uji Matcha Latte',
        category: 'Botanical',
        price: 5.8,
        description:
          'First-harvest stone-milled Kyoto matcha whisked with bamboo chasen at 78°C.',
        prepMinutes: 4,
      },
    ],
  },
  {
    id: 'street-style',
    indexNumber: '03',
    styleName: 'Street Style',
    defaultVenueName: 'Block 84 Smash',
    venueSubtitle: 'Late-Night Smash Burgers & Fry Joint',
    tagline: 'Condensed poster type, raw concrete contrast, and high-voltage flame orange.',
    description:
      'Engineered for high-volume smash burger joints, taco counters, food halls, and late-night street kitchens. Bold Big Shoulders Display headlines and fast one-tap combo ordering.',
    heroImage: '/src/assets/images/theme_street_style_smashburger_1794394478163.jpg',
    displayFont: '"Big Shoulders Display", sans-serif',
    bodyFont: '"Plus Jakarta Sans", sans-serif',
    cardRadius: '12px',
    buttonRadius: '8px',
    currencySymbol: '$',
    palette: {
      mode: 'dark',
      canvas: '#111111',
      surface: '#1B1B1B',
      elevated: '#252525',
      text: '#F4F2ED',
      muted: '#9E9B95',
      accent: '#FF4D00',
      accentText: '#FFFFFF',
      border: '#323232',
      floorGround: '#111111',
      floorTable: '#282828',
    },
    categories: ['All', 'Smash Burgers', 'Loaded Sides', 'Hot Chicken', 'Shakes & Cans'],
    menu: [
      {
        id: 'st-1',
        name: 'Double Oklahoma Onion Smash',
        category: 'Smash Burgers',
        price: 11.5,
        description:
          'Two lacy crispy-edged chuck patties smashed with paper-thin vidalia onions, double American cheese, house dill pickles, toasted potato bun.',
        tag: 'Top Seller',
        prepMinutes: 7,
      },
      {
        id: 'st-2',
        name: 'Triple Jalapeño Smoke Stack',
        category: 'Smash Burgers',
        price: 14.0,
        description:
          'Three seared smash patties, blistered pickled jalapeños, smoked cheddar, chipotle comeback sauce.',
        prepMinutes: 8,
      },
      {
        id: 'st-3',
        name: 'Nashville Hot Chicken Tenders (4 pc)',
        category: 'Hot Chicken',
        price: 10.5,
        description:
          'Buttermilk-brined tenders dipped in cayenne chili oil, served over white bread with crinkle pickles.',
        tag: 'Spicy',
        prepMinutes: 9,
      },
      {
        id: 'st-4',
        name: 'Animal Style Crinkle Fries',
        category: 'Loaded Sides',
        price: 6.5,
        description:
          'Double-fried crinkle fries drenched in melted cheddar, charred onions, and smoky Block 84 sauce.',
        prepMinutes: 5,
      },
      {
        id: 'st-5',
        name: 'Charred Elote Street Corn Ribs',
        category: 'Loaded Sides',
        price: 7.0,
        description:
          'Flash-fried sweet corn ribs tossed in tajín chili lime, cotija cheese, and cilantro crema.',
        prepMinutes: 6,
      },
      {
        id: 'st-6',
        name: 'Toasted Marshmallow Malt Shake',
        category: 'Shakes & Cans',
        price: 6.8,
        description:
          'Hand-spun vanilla custard, malted milk crumb, torched campfire marshmallow fluff.',
        prepMinutes: 4,
      },
    ],
  },
  {
    id: 'artisanal-terracotta',
    indexNumber: '04',
    styleName: 'Artisanal Terracotta',
    defaultVenueName: 'Forno Terra',
    venueSubtitle: 'Wood-Fired Neapolitan Pizzeria & Courtyard',
    tagline: 'Warm kiln clay, 48-hour sourdough crust, and sunlit olive-wood warmth.',
    description:
      'Our curated fourth signature style: crafted for wood-fired pizzerias, Mediterranean courtyards, and farm-to-table kitchens. Expressive Fraunces serif titles on warm kiln-clay surfaces.',
    heroImage: '/src/assets/images/theme_artisanal_terracotta_pizza_1794394478827.jpg',
    displayFont: '"Fraunces", Georgia, serif',
    bodyFont: '"Plus Jakarta Sans", sans-serif',
    cardRadius: '20px',
    buttonRadius: '999px',
    currencySymbol: '$',
    palette: {
      mode: 'light',
      canvas: '#F7F1E7',
      surface: '#FFFDF9',
      elevated: '#EFE5D6',
      text: '#231811',
      muted: '#6E5D51',
      accent: '#C84B24',
      accentText: '#FFFDF9',
      border: '#DFD2C0',
      floorGround: '#1F1610',
      floorTable: '#3B281D',
    },
    categories: ['All', 'Wood-Fired Pizza', 'Antipasti', 'Dolci', 'Aperitivi'],
    menu: [
      {
        id: 'at-1',
        name: 'Margherita D.O.P. (48h Sourdough)',
        category: 'Wood-Fired Pizza',
        price: 16.0,
        description:
          ' crushed San Marzano D.O.P. tomatoes, Campania fior di latte, fresh basil leaves, cold-pressed olive oil, blistered at 485°C.',
        tag: 'Vera Napoli',
        prepMinutes: 6,
      },
      {
        id: 'at-2',
        name: 'Diavola & Calabrian Hot Honey',
        category: 'Wood-Fired Pizza',
        price: 19.5,
        description:
          'Artisanal spicy soppressata, Calabrian chili oil, aged provolone, wildflower hot honey drizzle.',
        prepMinutes: 7,
      },
      {
        id: 'at-3',
        name: 'Stracciatella, Fig & Prosciutto',
        category: 'Wood-Fired Pizza',
        price: 21.0,
        description:
          '24-month Prosciutto di Parma, Pugliese stracciatella, black mission figs, wild rocket.',
        prepMinutes: 7,
      },
      {
        id: 'at-4',
        name: 'Wood-Roasted Rosemary Focaccia',
        category: 'Antipasti',
        price: 9.5,
        description:
          'Puffed sourdough focaccia brushed with garlic confit oil, sea salt, and whipped ricotta.',
        prepMinutes: 5,
      },
      {
        id: 'at-5',
        name: 'Pistachio di Bronte Tiramisu',
        category: 'Dolci',
        price: 11.0,
        description:
          'Espresso-soaked savoiardi layered with roasted Sicilian green pistachio mascarpone.',
        prepMinutes: 4,
      },
      {
        id: 'at-6',
        name: 'Sicilian Blood Orange Spritz',
        category: 'Aperitivi',
        price: 12.5,
        description:
          'Amaro blood orange aperitivo, Valdobbiadene Prosecco Superiore, charred rosemary sprig.',
        prepMinutes: 3,
      },
    ],
  },
];

export function getThemeById(themeId: ThemeId): ProductThemeConfig {
  return PRODUCT_THEMES.find((t) => t.id === themeId) || PRODUCT_THEMES[0];
}

export function filterThemeMenu(
  menu: ThemeMenuItem[],
  category: string,
  searchQuery: string
): ThemeMenuItem[] {
  const q = searchQuery.trim().toLowerCase();
  return menu.filter((item) => {
    const matchesCategory = category === 'All' || item.category === category;
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });
}

export function computeThemeCartSummary(
  menu: ThemeMenuItem[],
  cart: Record<string, number>
): {
  items: { item: ThemeMenuItem; qty: number; lineTotal: number }[];
  totalCount: number;
  subtotal: number;
} {
  const items: { item: ThemeMenuItem; qty: number; lineTotal: number }[] = [];
  let totalCount = 0;
  let subtotal = 0;

  for (const item of menu) {
    const qty = cart[item.id] || 0;
    if (qty > 0 && !item.soldOut) {
      const lineTotal = Number((item.price * qty).toFixed(2));
      items.push({ item, qty, lineTotal });
      totalCount += qty;
      subtotal = Number((subtotal + lineTotal).toFixed(2));
    }
  }
  return { items, totalCount, subtotal };
}

export function nextTicketStatus(
  current: LiveOrderTicket['status']
): LiveOrderTicket['status'] {
  switch (current) {
    case 'incoming':
      return 'confirmed';
    case 'confirmed':
      return 'cooking';
    case 'cooking':
      return 'ready';
    case 'ready':
      return 'served';
    case 'served':
      return 'served';
  }
}
