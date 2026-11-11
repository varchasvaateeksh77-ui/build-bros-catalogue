import React, { useState } from 'react';
import {
  PRODUCT_THEMES,
  ProductThemeConfig,
  ServiceLevel,
  ThemeId,
  ThemeMenuItem,
  LiveOrderTicket,
  LiveWaiterCall,
  filterThemeMenu,
  computeThemeCartSummary,
  nextTicketStatus,
} from './themeCatalogData';
import { Floor2D } from '../svg/Floor2D';
import { getChangeStageFloorState } from '../three/floorStates';
import { soundEffects } from '../lib/soundEffects';

interface LiveThemeInstanceProps {
  initialThemeId: ThemeId;
  initialLevel: ServiceLevel;
  initialVenueName?: string;
  initialTable?: number;
  onBackToCatalogue: () => void;
}

type FocusView = 'guest' | 'floor' | 'kitchen';

const SHORT_THEME_LABELS: Record<ThemeId, string> = {
  'classy-elegant': '01. Elegant',
  minimalist: '02. Minimalist',
  'street-style': '03. Street',
  'artisanal-terracotta': '04. Terracotta',
};

export const LiveThemeInstance: React.FC<LiveThemeInstanceProps> = ({
  initialThemeId,
  initialLevel,
  initialVenueName,
  initialTable = 5,
  onBackToCatalogue,
}) => {
  const [activeThemeId, setActiveThemeId] = useState<ThemeId>(initialThemeId);
  const [focusView, setFocusView] = useState<FocusView>('guest');
  const [serviceLevel, setServiceLevel] = useState<ServiceLevel>(initialLevel);
  const [tableNumber] = useState<number>(initialTable);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [floorProgress, setFloorProgress] = useState<number>(0.65);

  const baseTheme: ProductThemeConfig =
    PRODUCT_THEMES.find((t) => t.id === activeThemeId) || PRODUCT_THEMES[0];

  const [menusByTheme, setMenusByTheme] = useState<Record<ThemeId, ThemeMenuItem[]>>(() => ({
    'classy-elegant': PRODUCT_THEMES[0].menu,
    minimalist: PRODUCT_THEMES[1].menu,
    'street-style': PRODUCT_THEMES[2].menu,
    'artisanal-terracotta': PRODUCT_THEMES[3].menu,
  }));

  const venueName =
    initialVenueName && activeThemeId === initialThemeId
      ? initialVenueName
      : baseTheme.defaultVenueName;

  const currentMenu = menusByTheme[activeThemeId];
  const filteredDishes = filterThemeMenu(currentMenu, activeCategory, '');

  const [cartsByTheme, setCartsByTheme] = useState<Record<ThemeId, Record<string, number>>>({
    'classy-elegant': {},
    minimalist: {},
    'street-style': {},
    'artisanal-terracotta': {},
  });

  const currentCart = cartsByTheme[activeThemeId] || {};
  const cartSummary = computeThemeCartSummary(currentMenu, currentCart);

  const [tickets, setTickets] = useState<LiveOrderTicket[]>([
    {
      ticketNumber: '#0414',
      tableNumber: 5,
      items: [
        { id: 'ce-1', name: 'Truffle & Heirloom Burrata', qty: 1, price: 18.0 },
        { id: 'ce-3', name: '36-Hour Crispy Duck Confit', qty: 1, price: 34.0 },
      ],
      total: 52.0,
      status: 'cooking',
      createdAt: 'Just now',
    },
  ]);

  const [waiterCalls, setWaiterCalls] = useState<LiveWaiterCall[]>([]);
  const [guestBanner, setGuestBanner] = useState<string | null>(null);

  const handleSelectTheme = (id: ThemeId) => {
    soundEffects.playClick();
    setActiveThemeId(id);
    setActiveCategory('All');
    setGuestBanner(null);
  };

  const handleUpdateQty = (dishId: string, delta: number) => {
    soundEffects.playPop();
    setCartsByTheme((prev) => {
      const themeCart = { ...(prev[activeThemeId] || {}) };
      const nextQty = Math.max(0, (themeCart[dishId] || 0) + delta);
      if (nextQty === 0) {
        delete themeCart[dishId];
      } else {
        themeCart[dishId] = nextQty;
      }
      return { ...prev, [activeThemeId]: themeCart };
    });
  };

  const handleCallWaiter = () => {
    soundEffects.playWaiterCall();
    const newCall: LiveWaiterCall = {
      id: `wc-${Date.now()}`,
      tableNumber,
      cartCount: cartSummary.totalCount,
      cartTotal: cartSummary.subtotal,
      reason: cartSummary.totalCount > 0 ? 'Order ready in cart' : 'Question for waiter',
      status: 'walking',
      createdAt: 'Just now',
    };
    setWaiterCalls((prev) => [newCall, ...prev]);
    setGuestBanner(
      `Waiter notified for Table ${tableNumber}. A waiter is walking over now.`
    );
  };

  const handlePlaceOrder = () => {
    if (cartSummary.items.length === 0) return;
    soundEffects.playOrderSent();
    const nextNum = `#0${415 + tickets.length}`;
    const newTicket: LiveOrderTicket = {
      ticketNumber: nextNum,
      tableNumber,
      items: cartSummary.items.map((entry) => ({
        id: entry.item.id,
        name: entry.item.name,
        qty: entry.qty,
        price: entry.item.price,
      })),
      total: cartSummary.subtotal,
      status: 'cooking',
      createdAt: 'Just now',
    };
    setTickets((prev) => [newTicket, ...prev]);
    setCartsByTheme((prev) => ({ ...prev, [activeThemeId]: {} }));
    setGuestBanner(
      `Order ${nextNum} sent to the kitchen for Table ${tableNumber}.`
    );
  };

  const handleAdvanceTicket = (ticketNumber: string) => {
    soundEffects.playKitchenReady();
    setTickets((prev) =>
      prev.map((t) => {
        if (t.ticketNumber !== ticketNumber) return t;
        const next = nextTicketStatus(t.status);
        setGuestBanner(
          `Ticket ${t.ticketNumber} (Table ${t.tableNumber}) is now ${next.toUpperCase()}.`
        );
        return { ...t, status: next };
      })
    );
  };

  const handleToggleSoldOut = (dishId: string) => {
    soundEffects.playClick();
    setMenusByTheme((prev) => ({
      ...prev,
      [activeThemeId]: prev[activeThemeId].map((item) =>
        item.id === dishId ? { ...item, soldOut: !item.soldOut } : item
      ),
    }));
  };

  const floorMode =
    serviceLevel === 1 ? 'menu' : serviceLevel === 2 ? 'waiter' : 'order';
  const currentFloorState = getChangeStageFloorState(floorMode, floorProgress);

  return (
    <div
      style={{
        backgroundColor: baseTheme.palette.canvas,
        color: baseTheme.palette.text,
        fontFamily: baseTheme.bodyFont,
      }}
      className="min-h-screen transition-colors duration-300 pb-32"
    >
      {/* Sleek Single-Row Floating Pill Top Bar (tasteskill.dev / threeui.com style) */}
      <div className="sticky top-4 z-50 px-4 md:px-8 pointer-events-none">
        <header
          style={{
            backgroundColor:
              baseTheme.palette.mode === 'dark'
                ? 'rgba(18, 14, 12, 0.88)'
                : 'rgba(26, 18, 12, 0.90)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
          className="pointer-events-auto max-w-[1160px] mx-auto h-14 px-4 rounded-[18px] text-[#FBEFE6] flex items-center justify-between gap-2 border border-white/12"
        >
          {/* Zone 1: Back to Catalogue + Compact Theme Switcher */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBackToCatalogue}
              className="px-3 py-1.5 rounded-[10px] bg-white/10 hover:bg-white/18 text-[12px] font-medium cursor-pointer transition-colors shrink-0"
            >
              ← Catalogue
            </button>

            <div className="hidden lg:flex items-center gap-1 pl-2 border-l border-white/15">
              {PRODUCT_THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectTheme(t.id)}
                  className={`px-2.5 py-1 rounded-[8px] text-[12px] cursor-pointer transition-colors whitespace-nowrap ${
                    t.id === activeThemeId
                      ? 'bg-[#E8500C] text-white font-semibold'
                      : 'text-[#D6C7B8] hover:text-white'
                  }`}
                >
                  {SHORT_THEME_LABELS[t.id]}
                </button>
              ))}
            </div>
          </div>

          {/* Zone 2: Single-Focus View Switcher (One Clean Screen at a Time) */}
          <nav
            aria-label="Live theme view mode"
            className="flex items-center gap-1 p-1 rounded-[12px] bg-black/35 border border-white/10"
          >
            <button
              type="button"
              onClick={() => setFocusView('guest')}
              className={`px-3 py-1 rounded-[8px] text-[12px] font-medium cursor-pointer transition-colors whitespace-nowrap ${
                focusView === 'guest'
                  ? 'bg-white text-[#140905] font-semibold'
                  : 'text-[#D6C7B8] hover:text-white'
              }`}
            >
              Guest Menu
            </button>
            <button
              type="button"
              onClick={() => setFocusView('floor')}
              className={`px-3 py-1 rounded-[8px] text-[12px] font-medium cursor-pointer transition-colors whitespace-nowrap ${
                focusView === 'floor'
                  ? 'bg-white text-[#140905] font-semibold'
                  : 'text-[#D6C7B8] hover:text-white'
              }`}
            >
              3D Floor Stage
            </button>
            <button
              type="button"
              onClick={() => setFocusView('kitchen')}
              className={`px-3 py-1 rounded-[8px] text-[12px] font-medium cursor-pointer transition-colors whitespace-nowrap ${
                focusView === 'kitchen'
                  ? 'bg-white text-[#140905] font-semibold'
                  : 'text-[#D6C7B8] hover:text-white'
              }`}
            >
              Kitchen Pass ({tickets.length})
            </button>
          </nav>

          {/* Zone 3: Service Level Pill */}
          <div className="flex items-center gap-1 bg-black/30 p-1 rounded-[10px] shrink-0">
            {([1, 2, 3] as ServiceLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setServiceLevel(lvl)}
                className={`px-2.5 py-1 rounded-[7px] font-mono-code text-[11px] cursor-pointer ${
                  serviceLevel === lvl
                    ? 'bg-[#E8500C] text-white font-semibold'
                    : 'text-[#D6C7B8] hover:text-white'
                }`}
              >
                L{lvl}
              </button>
            ))}
          </div>
        </header>
      </div>

      {/* =====================================================================
          VIEW 1: SPACIOUS GUEST TABLE MENU (Default, Uncluttered)
         ===================================================================== */}
      {focusView === 'guest' && (
        <main className="max-w-[960px] mx-auto px-4 md:px-8 pt-10 md:pt-14">
          {/* Spacious Venue Hero Header */}
          <section
            style={{
              borderColor: baseTheme.palette.border,
              borderRadius: baseTheme.cardRadius,
            }}
            className="relative h-64 md:h-80 overflow-hidden border mb-10"
          >
            <img
              src={baseTheme.heroImage}
              alt={venueName}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(10, 8, 6, 0.86) 0%, rgba(10, 8, 6, 0.22) 60%, rgba(10, 8, 6, 0.35) 100%)',
              }}
            />

            <div className="absolute top-5 left-6 right-6 flex items-center justify-between text-[#FBEFE6]">
              <span className="font-mono-code text-[11px] uppercase tracking-[0.16em] px-3 py-1 rounded-full bg-black/55 backdrop-blur-sm">
                TABLE {tableNumber} · LEVEL {serviceLevel} · DEMO
              </span>

              {serviceLevel >= 2 && (
                <button
                  type="button"
                  onClick={handleCallWaiter}
                  style={{
                    backgroundColor: baseTheme.palette.accent,
                    color: baseTheme.palette.accentText,
                    borderRadius: baseTheme.buttonRadius,
                  }}
                  className="px-4 py-1.5 font-mono-code text-[11px] font-semibold uppercase tracking-[0.1em] cursor-pointer"
                >
                  Call Waiter
                </button>
              )}
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-[#FBEFE6]">
              <p className="font-mono-code text-[11px] uppercase tracking-[0.16em] text-[#E6D5C3] mb-1">
                {baseTheme.venueSubtitle}
              </p>
              <h1
                style={{ fontFamily: baseTheme.displayFont }}
                className="text-[36px] md:text-[52px] font-bold leading-[1.02]"
              >
                {venueName}
              </h1>
            </div>
          </section>

          {/* Calm Live Order / Waiter Notification Strip */}
          {guestBanner && (
            <div
              role="status"
              aria-live="polite"
              style={{
                backgroundColor: baseTheme.palette.surface,
                borderColor: baseTheme.palette.accent,
                borderRadius: baseTheme.buttonRadius,
              }}
              className="mb-8 px-5 py-4 border flex items-center justify-between gap-4"
            >
              <span className="text-[14px] font-medium">{guestBanner}</span>
              <button
                type="button"
                onClick={() =>
                  setFocusView(serviceLevel === 2 ? 'floor' : 'kitchen')
                }
                style={{ color: baseTheme.palette.accent }}
                className="font-mono-code text-[12px] font-semibold uppercase tracking-[0.08em] cursor-pointer shrink-0"
              >
                {serviceLevel === 2 ? 'View Waiter on 3D Floor →' : 'View in Kitchen Pass →'}
              </button>
            </div>
          )}

          {/* Clean Horizontal Category Bar */}
          <nav
            aria-label="Menu categories"
            style={{ borderColor: baseTheme.palette.border }}
            className="flex items-center gap-2 overflow-x-auto pb-5 mb-10 border-b"
          >
            {baseTheme.categories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    backgroundColor: isSelected
                      ? baseTheme.palette.accent
                      : baseTheme.palette.surface,
                    color: isSelected
                      ? baseTheme.palette.accentText
                      : baseTheme.palette.text,
                    borderColor: baseTheme.palette.border,
                    borderRadius: baseTheme.buttonRadius,
                  }}
                  className="px-4 py-2 border text-[13px] font-medium whitespace-nowrap cursor-pointer transition-colors"
                >
                  {cat}
                </button>
              );
            })}
          </nav>

          {/* ===============================================================
              FOUR DISTINCT, SPACIOUS MENU LAYOUT PERSONALITIES
              (Max 3 data points per dish: Title+1-line desc, Price, +Add)
             =============================================================== */}

          {/* 01. CLASSY ELEGANT: Centered Single-Column Editorial Tasting Menu */}
          {activeThemeId === 'classy-elegant' && (
            <div
              className="max-w-[740px] mx-auto divide-y"
              style={{ borderColor: baseTheme.palette.border }}
            >
              {filteredDishes.map((dish) => {
                const qty = currentCart[dish.id] || 0;
                return (
                  <div
                    key={dish.id}
                    style={{ borderColor: baseTheme.palette.border }}
                    className="py-7 flex items-center justify-between gap-6"
                  >
                    <div className="space-y-1.5 max-w-[52ch]">
                      <h2
                        style={{ fontFamily: baseTheme.displayFont }}
                        className="text-[24px] md:text-[28px] font-semibold leading-snug"
                      >
                        {dish.name}
                      </h2>
                      <p
                        className="text-[14px] leading-relaxed"
                        style={{ color: baseTheme.palette.muted }}
                      >
                        {dish.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span
                        className="font-mono-code text-[16px] font-semibold tabular-nums"
                        style={{ color: baseTheme.palette.accent }}
                      >
                        {baseTheme.currencySymbol}
                        {dish.price.toFixed(2)}
                      </span>

                      {serviceLevel >= 2 &&
                        (qty > 0 ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label={`Remove one ${dish.name}`}
                              onClick={() => handleUpdateQty(dish.id, -1)}
                              style={{ borderColor: baseTheme.palette.border }}
                              className="w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer"
                            >
                              −
                            </button>
                            <span className="font-mono-code text-[14px] w-5 text-center tabular-nums">
                              {qty}
                            </span>
                            <button
                              type="button"
                              aria-label={`Add one more ${dish.name}`}
                              onClick={() => handleUpdateQty(dish.id, 1)}
                              style={{
                                backgroundColor: baseTheme.palette.accent,
                                color: baseTheme.palette.accentText,
                              }}
                              className="w-8 h-8 rounded-full flex items-center justify-center font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={dish.soldOut}
                            onClick={() => handleUpdateQty(dish.id, 1)}
                            style={{
                              borderColor: baseTheme.palette.accent,
                              color: baseTheme.palette.accent,
                              borderRadius: baseTheme.buttonRadius,
                            }}
                            className="px-4 py-2 border font-mono-code text-[12px] uppercase tracking-[0.08em] cursor-pointer disabled:opacity-40"
                          >
                            {dish.soldOut ? 'Sold Out' : '+ Add'}
                          </button>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 02. MINIMALIST: Open Nordic Architectural Hairline Grid (No Heavy Boxes) */}
          {activeThemeId === 'minimalist' && (
            <div
              className="grid grid-cols-1 md:grid-cols-2 border-t border-l"
              style={{ borderColor: baseTheme.palette.border }}
            >
              {filteredDishes.map((dish) => {
                const qty = currentCart[dish.id] || 0;
                return (
                  <div
                    key={dish.id}
                    style={{ borderColor: baseTheme.palette.border }}
                    className="p-8 border-r border-b flex flex-col justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between gap-4">
                        <h2 className="text-[19px] font-semibold tracking-[-0.01em]">
                          {dish.name}
                        </h2>
                        <span
                          className="font-mono-code text-[15px] font-medium tabular-nums shrink-0"
                          style={{ color: baseTheme.palette.accent }}
                        >
                          {baseTheme.currencySymbol}
                          {dish.price.toFixed(2)}
                        </span>
                      </div>
                      <p
                        className="text-[14px] leading-relaxed"
                        style={{ color: baseTheme.palette.muted }}
                      >
                        {dish.description}
                      </p>
                    </div>

                    {serviceLevel >= 2 && (
                      <div className="flex items-center justify-between pt-2">
                        <span
                          className="font-mono-code text-[11px] uppercase tracking-[0.12em]"
                          style={{ color: baseTheme.palette.muted }}
                        >
                          {dish.category}
                        </span>
                        {qty > 0 ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label={`Remove one ${dish.name}`}
                              onClick={() => handleUpdateQty(dish.id, -1)}
                              style={{ borderColor: baseTheme.palette.border }}
                              className="w-8 h-8 rounded-[6px] border flex items-center justify-center cursor-pointer"
                            >
                              −
                            </button>
                            <span className="font-mono-code text-[13px] w-5 text-center tabular-nums">
                              {qty}
                            </span>
                            <button
                              type="button"
                              aria-label={`Add one more ${dish.name}`}
                              onClick={() => handleUpdateQty(dish.id, 1)}
                              style={{
                                backgroundColor: baseTheme.palette.accent,
                                color: baseTheme.palette.accentText,
                              }}
                              className="w-8 h-8 rounded-[6px] flex items-center justify-center cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={dish.soldOut}
                            onClick={() => handleUpdateQty(dish.id, 1)}
                            style={{
                              borderColor: baseTheme.palette.accent,
                              color: baseTheme.palette.accent,
                            }}
                            className="px-3.5 py-1.5 rounded-[6px] border font-mono-code text-[11px] uppercase tracking-[0.1em] cursor-pointer disabled:opacity-40"
                          >
                            {dish.soldOut ? 'Sold Out' : '+ Add'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 03. STREET STYLE: Bold Condensed Poster Cards with Oversized Numbers */}
          {activeThemeId === 'street-style' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredDishes.map((dish, idx) => {
                const qty = currentCart[dish.id] || 0;
                return (
                  <div
                    key={dish.id}
                    style={{
                      backgroundColor: baseTheme.palette.surface,
                      borderColor: baseTheme.palette.border,
                      borderRadius: baseTheme.cardRadius,
                    }}
                    className="p-6 border-2 flex flex-col justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span
                            className="font-mono-code text-[11px] uppercase tracking-[0.14em] block mb-1"
                            style={{ color: baseTheme.palette.accent }}
                          >
                            NO. 0{idx + 1} · {dish.category.toUpperCase()}
                          </span>
                          <h2
                            style={{ fontFamily: baseTheme.displayFont }}
                            className="text-[28px] uppercase font-bold leading-[0.98] tracking-[0.01em]"
                          >
                            {dish.name}
                          </h2>
                        </div>
                        <span
                          style={{
                            backgroundColor: baseTheme.palette.accent,
                            color: baseTheme.palette.accentText,
                          }}
                          className="px-2.5 py-1 rounded-[6px] font-mono-code text-[15px] font-bold tabular-nums shrink-0"
                        >
                          {baseTheme.currencySymbol}
                          {dish.price.toFixed(2)}
                        </span>
                      </div>
                      <p
                        className="text-[14px] leading-relaxed pt-1"
                        style={{ color: baseTheme.palette.muted }}
                      >
                        {dish.description}
                      </p>
                    </div>

                    {serviceLevel >= 2 && (
                      <div className="flex items-center justify-end">
                        {qty > 0 ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label={`Remove one ${dish.name}`}
                              onClick={() => handleUpdateQty(dish.id, -1)}
                              style={{ borderColor: baseTheme.palette.border }}
                              className="w-9 h-9 rounded-[8px] border flex items-center justify-center font-bold cursor-pointer"
                            >
                              −
                            </button>
                            <span className="font-mono-code text-[15px] font-bold w-6 text-center tabular-nums">
                              {qty}
                            </span>
                            <button
                              type="button"
                              aria-label={`Add one more ${dish.name}`}
                              onClick={() => handleUpdateQty(dish.id, 1)}
                              style={{
                                backgroundColor: baseTheme.palette.accent,
                                color: baseTheme.palette.accentText,
                              }}
                              className="w-9 h-9 rounded-[8px] flex items-center justify-center font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={dish.soldOut}
                            onClick={() => handleUpdateQty(dish.id, 1)}
                            style={{
                              backgroundColor: baseTheme.palette.elevated,
                              color: baseTheme.palette.text,
                              borderColor: baseTheme.palette.border,
                            }}
                            className="w-full py-2.5 rounded-[8px] border font-mono-code text-[12px] font-bold uppercase tracking-[0.12em] cursor-pointer hover:border-[#FF4D00]"
                          >
                            {dish.soldOut ? 'SOLD OUT' : '+ ADD TO TRAY'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 04. ARTISANAL TERRACOTTA: Warm Sunlit Courtyard Cards */}
          {activeThemeId === 'artisanal-terracotta' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDishes.map((dish) => {
                const qty = currentCart[dish.id] || 0;
                return (
                  <div
                    key={dish.id}
                    style={{
                      backgroundColor: baseTheme.palette.surface,
                      borderColor: baseTheme.palette.border,
                      borderRadius: baseTheme.cardRadius,
                    }}
                    className="p-7 border flex flex-col justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between gap-4">
                        <h2
                          style={{ fontFamily: baseTheme.displayFont }}
                          className="text-[22px] md:text-[24px] font-bold leading-snug"
                        >
                          {dish.name}
                        </h2>
                        <span
                          className="font-mono-code text-[16px] font-semibold tabular-nums shrink-0"
                          style={{ color: baseTheme.palette.accent }}
                        >
                          {baseTheme.currencySymbol}
                          {dish.price.toFixed(2)}
                        </span>
                      </div>
                      <p
                        className="text-[14px] leading-relaxed"
                        style={{ color: baseTheme.palette.muted }}
                      >
                        {dish.description}
                      </p>
                    </div>

                    {serviceLevel >= 2 && (
                      <div className="flex items-center justify-between pt-2">
                        <span
                          className="font-mono-code text-[11px] uppercase tracking-[0.1em]"
                          style={{ color: baseTheme.palette.muted }}
                        >
                          Wood-Fired · {dish.prepMinutes}m
                        </span>
                        {qty > 0 ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label={`Remove one ${dish.name}`}
                              onClick={() => handleUpdateQty(dish.id, -1)}
                              style={{ borderColor: baseTheme.palette.border }}
                              className="w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer"
                            >
                              −
                            </button>
                            <span className="font-mono-code text-[14px] w-5 text-center tabular-nums">
                              {qty}
                            </span>
                            <button
                              type="button"
                              aria-label={`Add one more ${dish.name}`}
                              onClick={() => handleUpdateQty(dish.id, 1)}
                              style={{
                                backgroundColor: baseTheme.palette.accent,
                                color: baseTheme.palette.accentText,
                              }}
                              className="w-8 h-8 rounded-full flex items-center justify-center font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={dish.soldOut}
                            onClick={() => handleUpdateQty(dish.id, 1)}
                            style={{
                              backgroundColor: baseTheme.palette.accent,
                              color: baseTheme.palette.accentText,
                              borderRadius: baseTheme.buttonRadius,
                            }}
                            className="px-5 py-2 font-mono-code text-[12px] font-semibold uppercase tracking-[0.08em] cursor-pointer disabled:opacity-40"
                          >
                            {dish.soldOut ? 'Sold Out' : '+ Add'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Sleek Floating Bottom Order Pill (Appears only after guest adds an item) */}
          {serviceLevel >= 2 && cartSummary.totalCount > 0 && (
            <div className="fixed bottom-5 left-4 right-4 z-40 pointer-events-none">
              <div
                style={{
                  backgroundColor: baseTheme.palette.surface,
                  borderColor: baseTheme.palette.accent,
                  borderRadius: '999px',
                }}
                className="pointer-events-auto max-w-[560px] mx-auto px-6 py-3 border-2 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono-code text-[12px] uppercase tracking-[0.1em]" style={{ color: baseTheme.palette.muted }}>
                    Table {tableNumber}
                  </span>
                  <span className="font-mono-code text-[16px] font-bold tabular-nums">
                    {cartSummary.totalCount} {cartSummary.totalCount === 1 ? 'dish' : 'dishes'} · {baseTheme.currencySymbol}
                    {cartSummary.subtotal.toFixed(2)}
                  </span>
                </div>

                {serviceLevel === 2 ? (
                  <button
                    type="button"
                    onClick={handleCallWaiter}
                    style={{
                      backgroundColor: baseTheme.palette.accent,
                      color: baseTheme.palette.accentText,
                      borderRadius: '999px',
                    }}
                    className="px-5 py-2 font-mono-code text-[12px] font-semibold uppercase tracking-[0.08em] cursor-pointer"
                  >
                    Call Waiter →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    style={{
                      backgroundColor: baseTheme.palette.accent,
                      color: baseTheme.palette.accentText,
                      borderRadius: '999px',
                    }}
                    className="px-5 py-2 font-mono-code text-[12px] font-semibold uppercase tracking-[0.08em] cursor-pointer"
                  >
                    Send Order →
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      )}

      {/* =====================================================================
          VIEW 2: INTERACTIVE 3D / 2D TABLE FLOOR STAGE (threeui.com style)
         ===================================================================== */}
      {focusView === 'floor' && (
        <main className="max-w-[1040px] mx-auto px-4 md:px-8 pt-10 md:pt-14 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p
                className="font-mono-code text-[11px] uppercase tracking-[0.16em] mb-1"
                style={{ color: baseTheme.palette.accent }}
              >
                SPATIAL FLOOR VIEW · {venueName.toUpperCase()}
              </p>
              <h1
                style={{ fontFamily: baseTheme.displayFont }}
                className="text-[32px] md:text-[42px] font-bold leading-tight"
              >
                Live 12-Table Floor Stage
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {(
                [
                  { lvl: 1 as ServiceLevel, label: 'Level 1 · Table 5 QR Zoom' },
                  { lvl: 2 as ServiceLevel, label: 'Level 2 · Waiter Walking' },
                  { lvl: 3 as ServiceLevel, label: 'Level 3 · Kitchen Routing' },
                ] as const
              ).map((item) => (
                <button
                  key={item.lvl}
                  type="button"
                  onClick={() => {
                    setServiceLevel(item.lvl);
                    setFloorProgress(0.65);
                  }}
                  style={{
                    backgroundColor:
                      serviceLevel === item.lvl
                        ? baseTheme.palette.accent
                        : baseTheme.palette.surface,
                    color:
                      serviceLevel === item.lvl
                        ? baseTheme.palette.accentText
                        : baseTheme.palette.text,
                    borderColor: baseTheme.palette.border,
                    borderRadius: baseTheme.buttonRadius,
                  }}
                  className="px-4 py-2 border font-mono-code text-[11px] uppercase tracking-[0.08em] cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#140905',
              borderColor: baseTheme.palette.border,
              borderRadius: baseTheme.cardRadius,
            }}
            className="p-6 md:p-8 border space-y-6"
          >
            <div className="aspect-[16/10] w-full rounded-[16px] overflow-hidden bg-[#140905]">
              <Floor2D state={currentFloorState} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10 text-[#FBEFE6]">
              <p className="text-[15px] text-[#D8C7B8]">
                {currentFloorState.caption}
              </p>
              <div className="flex items-center gap-3">
                <label
                  htmlFor="floor-step-slider"
                  className="font-mono-code text-[11px] uppercase tracking-[0.1em] text-[#B89F8D]"
                >
                  Scrub Floor Timeline
                </label>
                <input
                  id="floor-step-slider"
                  type="range"
                  min={0.1}
                  max={0.95}
                  step={0.05}
                  value={floorProgress}
                  onChange={(e) => setFloorProgress(Number(e.target.value))}
                  className="w-36 accent-[#E8500C]"
                />
              </div>
            </div>
          </div>
        </main>
      )}

      {/* =====================================================================
          VIEW 3: CLEAN KITCHEN PASS & MENU AVAILABILITY
         ===================================================================== */}
      {focusView === 'kitchen' && (
        <main className="max-w-[960px] mx-auto px-4 md:px-8 pt-10 md:pt-14 space-y-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p
                className="font-mono-code text-[11px] uppercase tracking-[0.16em] mb-1"
                style={{ color: baseTheme.palette.accent }}
              >
                KITCHEN DISPLAY PASS · {venueName.toUpperCase()}
              </p>
              <h1
                style={{ fontFamily: baseTheme.displayFont }}
                className="text-[32px] md:text-[42px] font-bold leading-tight"
              >
                Live Tickets &amp; Dish Availability
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setFocusView('guest')}
              style={{
                borderColor: baseTheme.palette.border,
                color: baseTheme.palette.text,
                borderRadius: baseTheme.buttonRadius,
              }}
              className="px-4 py-2 border font-mono-code text-[12px] uppercase tracking-[0.08em] cursor-pointer"
            >
              ← Return to Guest Menu
            </button>
          </div>

          {/* Active Kitchen Tickets */}
          <section className="space-y-4">
            <h2 className="font-mono-code text-[12px] uppercase tracking-[0.14em]" style={{ color: baseTheme.palette.muted }}>
              Active Table Orders ({tickets.length}) · Waiter Calls ({waiterCalls.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tickets.map((ticket) => (
                <div
                  key={ticket.ticketNumber}
                  style={{
                    backgroundColor: baseTheme.palette.surface,
                    borderColor: baseTheme.palette.border,
                    borderRadius: baseTheme.cardRadius,
                  }}
                  className="p-6 border space-y-5"
                >
                  <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: baseTheme.palette.border }}>
                    <div>
                      <span className="font-mono-code text-[18px] font-bold tabular-nums">
                        {ticket.ticketNumber} · Table {ticket.tableNumber}
                      </span>
                      <span className="block font-mono-code text-[11px]" style={{ color: baseTheme.palette.muted }}>
                        {ticket.createdAt}
                      </span>
                    </div>
                    <span
                      style={{
                        backgroundColor: baseTheme.palette.accent,
                        color: baseTheme.palette.accentText,
                        borderRadius: baseTheme.buttonRadius,
                      }}
                      className="px-3 py-1 font-mono-code text-[11px] font-semibold uppercase tracking-[0.1em]"
                    >
                      {ticket.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {ticket.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-[15px]">
                        <span>
                          <strong className="font-mono-code tabular-nums">{item.qty}×</strong> {item.name}
                        </span>
                        <span className="font-mono-code tabular-nums" style={{ color: baseTheme.palette.muted }}>
                          {baseTheme.currencySymbol}
                          {(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAdvanceTicket(ticket.ticketNumber)}
                    style={{
                      backgroundColor: baseTheme.palette.accent,
                      color: baseTheme.palette.accentText,
                      borderRadius: baseTheme.buttonRadius,
                    }}
                    className="w-full py-2.5 font-mono-code text-[12px] font-semibold uppercase tracking-[0.1em] cursor-pointer"
                  >
                    {ticket.status === 'served'
                      ? 'Order Completed ✓'
                      : `Advance to ${nextTicketStatus(ticket.status).toUpperCase()} →`}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Simple One-Tap Dish Availability Toggle */}
          <section className="space-y-4">
            <h2 className="font-mono-code text-[12px] uppercase tracking-[0.14em]" style={{ color: baseTheme.palette.muted }}>
              Quick Dish Availability (Updates Guest Menu Live)
            </h2>

            <div
              style={{
                backgroundColor: baseTheme.palette.surface,
                borderColor: baseTheme.palette.border,
                borderRadius: baseTheme.cardRadius,
              }}
              className="divide-y border"
            >
              {currentMenu.map((dish) => (
                <div
                  key={dish.id}
                  style={{ borderColor: baseTheme.palette.border }}
                  className="px-5 py-3.5 flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="font-medium text-[15px]">{dish.name}</span>
                    <span className="font-mono-code text-[13px] ml-3 tabular-nums" style={{ color: baseTheme.palette.muted }}>
                      {baseTheme.currencySymbol}
                      {dish.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleSoldOut(dish.id)}
                    style={{
                      borderColor: baseTheme.palette.border,
                      color: dish.soldOut ? baseTheme.palette.muted : baseTheme.palette.accent,
                      borderRadius: baseTheme.buttonRadius,
                    }}
                    className="px-3.5 py-1.5 border font-mono-code text-[11px] uppercase tracking-[0.08em] cursor-pointer"
                  >
                    {dish.soldOut ? 'Sold Out (Tap to Restore)' : 'In Stock'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}
    </div>
  );
};
