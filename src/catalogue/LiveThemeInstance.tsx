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
import { soundEffects } from '../lib/soundEffects';

interface LiveThemeInstanceProps {
  initialThemeId: ThemeId;
  initialLevel: ServiceLevel;
  initialVenueName?: string;
  initialTable?: number;
  onBackToCatalogue: () => void;
}

type StaffTab = 'floor' | 'waiter' | 'reception' | 'kitchen' | 'editor';

export const LiveThemeInstance: React.FC<LiveThemeInstanceProps> = ({
  initialThemeId,
  initialLevel,
  initialVenueName,
  initialTable = 5,
  onBackToCatalogue,
}) => {
  const [activeThemeId, setActiveThemeId] = useState<ThemeId>(initialThemeId);
  const baseTheme: ProductThemeConfig =
    PRODUCT_THEMES.find((t) => t.id === activeThemeId) || PRODUCT_THEMES[0];

  // Keep per-theme editable menus so Owner Menu Editor changes persist while testing
  const [menusByTheme, setMenusByTheme] = useState<Record<ThemeId, ThemeMenuItem[]>>(() => ({
    'classy-elegant': PRODUCT_THEMES[0].menu,
    minimalist: PRODUCT_THEMES[1].menu,
    'street-style': PRODUCT_THEMES[2].menu,
    'artisanal-terracotta': PRODUCT_THEMES[3].menu,
  }));

  const [venueNamesByTheme, setVenueNamesByTheme] = useState<Record<ThemeId, string>>(() => ({
    'classy-elegant':
      initialThemeId === 'classy-elegant' && initialVenueName
        ? initialVenueName
        : PRODUCT_THEMES[0].defaultVenueName,
    minimalist:
      initialThemeId === 'minimalist' && initialVenueName
        ? initialVenueName
        : PRODUCT_THEMES[1].defaultVenueName,
    'street-style':
      initialThemeId === 'street-style' && initialVenueName
        ? initialVenueName
        : PRODUCT_THEMES[2].defaultVenueName,
    'artisanal-terracotta':
      initialThemeId === 'artisanal-terracotta' && initialVenueName
        ? initialVenueName
        : PRODUCT_THEMES[3].defaultVenueName,
  }));

  const [serviceLevel, setServiceLevel] = useState<ServiceLevel>(initialLevel);
  const [tableNumber, setTableNumber] = useState<number>(initialTable);
  const [viewLayout, setViewLayout] = useState<'split' | 'guest-only'>('split');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [orderNote, setOrderNote] = useState<string>('');
  const [cartsByTheme, setCartsByTheme] = useState<
    Record<ThemeId, Record<string, number>>
  >({
    'classy-elegant': { 'ce-1': 1, 'ce-3': 1 },
    minimalist: { 'mn-1': 1, 'mn-3': 2 },
    'street-style': { 'st-1': 2, 'st-4': 1 },
    'artisanal-terracotta': { 'at-1': 1, 'at-6': 2 },
  });

  const [staffTab, setStaffTab] = useState<StaffTab>('kitchen');
  const [ticketSeq, setTicketSeq] = useState<number>(415);
  const [tickets, setTickets] = useState<LiveOrderTicket[]>([
    {
      ticketNumber: '#0414',
      tableNumber: 5,
      items: [
        {
          id: baseTheme.menu[0].id,
          name: baseTheme.menu[0].name,
          qty: 2,
          price: baseTheme.menu[0].price,
        },
        {
          id: baseTheme.menu[2].id,
          name: baseTheme.menu[2].name,
          qty: 1,
          price: baseTheme.menu[2].price,
        },
      ],
      total: Number((baseTheme.menu[0].price * 2 + baseTheme.menu[2].price).toFixed(2)),
      status: 'cooking',
      createdAt: 'Just now',
    },
  ]);

  const [waiterCalls, setWaiterCalls] = useState<LiveWaiterCall[]>([
    {
      id: 'wc-1',
      tableNumber: 3,
      cartCount: 2,
      cartTotal: 29.5,
      reason: 'Order ready in cart',
      status: 'calling',
      createdAt: '1m ago',
    },
  ]);
  const [waiterTargetTable, setWaiterTargetTable] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => soundEffects.isEnabled());

  // New dish form inside Owner Menu Editor
  const [newDishName, setNewDishName] = useState('');
  const [newDishPrice, setNewDishPrice] = useState('12.00');
  const [newDishCategory, setNewDishCategory] = useState('');

  const currentMenu = menusByTheme[activeThemeId];
  const currentVenueName = venueNamesByTheme[activeThemeId];
  const currentCart = cartsByTheme[activeThemeId] || {};
  const filteredMenu = filterThemeMenu(currentMenu, activeCategory, searchQuery);
  const cartSummary = computeThemeCartSummary(currentMenu, currentCart);
  const p = baseTheme.palette;

  const handleSwitchTheme = (nextId: ThemeId) => {
    setActiveThemeId(nextId);
    setActiveCategory('All');
    setSearchQuery('');
    soundEffects.playClick();
  };

  const updateCartQty = (itemId: string, delta: number) => {
    soundEffects.playPop();
    setCartsByTheme((prev) => {
      const themeCart = { ...(prev[activeThemeId] || {}) };
      const nextQty = Math.max(0, (themeCart[itemId] || 0) + delta);
      if (nextQty === 0) {
        delete themeCart[itemId];
      } else {
        themeCart[itemId] = nextQty;
      }
      return { ...prev, [activeThemeId]: themeCart };
    });
  };

  const handleCallWaiter = (
    reason: LiveWaiterCall['reason'] = 'Order ready in cart'
  ) => {
    soundEffects.playWaiterCall();
    const newCall: LiveWaiterCall = {
      id: `wc-${Date.now()}`,
      tableNumber,
      cartCount: cartSummary.totalCount,
      cartTotal: cartSummary.subtotal,
      reason,
      status: 'calling',
      createdAt: 'Just now',
    };
    setWaiterCalls((prev) => [newCall, ...prev]);
    setWaiterTargetTable(tableNumber);
    setStaffTab('waiter');
  };

  const handleAcknowledgeWaiterCall = (callId: string, targetTable: number) => {
    soundEffects.playClick();
    setWaiterTargetTable(targetTable);
    setWaiterCalls((prev) =>
      prev.map((c) => {
        if (c.id !== callId) return c;
        const nextStatus = c.status === 'calling' ? 'walking' : 'assisted';
        return { ...c, status: nextStatus };
      })
    );
  };

  const handlePlaceOrder = () => {
    if (cartSummary.items.length === 0) return;
    soundEffects.playOrderSent();
    const numStr = `#0${ticketSeq}`;
    setTicketSeq((n) => n + 1);
    const newTicket: LiveOrderTicket = {
      ticketNumber: numStr,
      tableNumber,
      items: cartSummary.items.map(({ item, qty }) => ({
        id: item.id,
        name: item.name,
        qty,
        price: item.price,
        note: orderNote.trim() || undefined,
      })),
      total: cartSummary.subtotal,
      status: 'incoming',
      createdAt: 'Just now',
    };
    setTickets((prev) => [newTicket, ...prev]);
    setCartsByTheme((prev) => ({ ...prev, [activeThemeId]: {} }));
    setOrderNote('');
    setStaffTab('reception');
  };

  const handleAdvanceTicket = (ticketNumber: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.ticketNumber !== ticketNumber) return t;
        const next = nextTicketStatus(t.status);
        if (next === 'ready') {
          soundEffects.playKitchenReady();
        } else {
          soundEffects.playClick();
        }
        return { ...t, status: next };
      })
    );
  };

  const handleUpdateDishPrice = (itemId: string, newPrice: number) => {
    if (Number.isNaN(newPrice) || newPrice < 0) return;
    setMenusByTheme((prev) => ({
      ...prev,
      [activeThemeId]: prev[activeThemeId].map((m) =>
        m.id === itemId ? { ...m, price: Number(newPrice.toFixed(2)) } : m
      ),
    }));
  };

  const handleToggleSoldOut = (itemId: string) => {
    soundEffects.playClick();
    setMenusByTheme((prev) => ({
      ...prev,
      [activeThemeId]: prev[activeThemeId].map((m) =>
        m.id === itemId ? { ...m, soldOut: !m.soldOut } : m
      ),
    }));
  };

  const handleAddCustomDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;
    const parsedPrice = parseFloat(newDishPrice);
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) return;
    const category =
      newDishCategory.trim() ||
      baseTheme.categories.find((c) => c !== 'All') ||
      'Mains';

    const created: ThemeMenuItem = {
      id: `custom-${Date.now()}`,
      name: newDishName.trim(),
      category,
      price: Number(parsedPrice.toFixed(2)),
      description: 'Added live from the Build Bros Owner Menu Editor.',
      tag: 'New Addition',
      prepMinutes: 8,
    };

    setMenusByTheme((prev) => ({
      ...prev,
      [activeThemeId]: [created, ...prev[activeThemeId]],
    }));
    setNewDishName('');
    soundEffects.playPop();
  };

  const latestTableTicket = tickets.find((t) => t.tableNumber === tableNumber);
  const latestTableCall = waiterCalls.find(
    (c) => c.tableNumber === tableNumber && c.status !== 'assisted'
  );

  // Table coordinates for the interactive 12-table floor map
  const FLOOR_TABLES = [
    { id: 1, x: 115, y: 155, round: true },
    { id: 2, x: 245, y: 155, round: false },
    { id: 3, x: 375, y: 155, round: true },
    { id: 4, x: 505, y: 155, round: false },
    { id: 5, x: 245, y: 270, round: true },
    { id: 6, x: 115, y: 270, round: true },
    { id: 7, x: 375, y: 270, round: false },
    { id: 8, x: 505, y: 270, round: true },
    { id: 9, x: 115, y: 385, round: false },
    { id: 10, x: 245, y: 385, round: true },
    { id: 11, x: 375, y: 385, round: true },
    { id: 12, x: 505, y: 385, round: false },
  ];

  const targetTableCoord = FLOOR_TABLES.find(
    (t) => t.id === (waiterTargetTable || tableNumber)
  );

  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{
        backgroundColor: p.canvas,
        color: p.text,
        fontFamily: baseTheme.bodyFont,
      }}
    >
      {/* Top Studio & Instance Bar */}
      <header className="sticky top-0 z-40 bg-[#140905] text-[#FBEFE6] border-b border-[#F7F2ED]/15 px-4 md:px-6 py-3">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToCatalogue}
              className="px-3.5 py-2 rounded-[10px] bg-[#2A180D] text-[#FBEFE6] hover:bg-[#E8500C] font-semibold text-[13px] cursor-pointer transition-colors whitespace-nowrap shrink-0"
            >
              ← Theme Catalogue
            </button>
            <div className="hidden sm:flex items-center gap-2 text-[13px] text-[#FBEFE6]/70">
              <span>Active Theme:</span>
              <strong className="text-[#FBEFE6]">
                {baseTheme.indexNumber}. {baseTheme.styleName}
              </strong>
            </div>
          </div>

          {/* Instant Theme Switcher */}
          <div
            className="flex items-center gap-1.5 bg-[#22150E] p-1 rounded-[12px] overflow-x-auto"
            role="tablist"
            aria-label="Switch live ordering theme"
          >
            {PRODUCT_THEMES.map((t) => {
              const active = t.id === activeThemeId;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleSwitchTheme(t.id)}
                  className={`px-3 py-1.5 rounded-[8px] text-[12px] font-semibold cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#E8500C] text-[#FBEFE6]'
                      : 'text-[#FBEFE6]/70 hover:text-[#FBEFE6]'
                  }`}
                >
                  {t.indexNumber}. {t.styleName}
                </button>
              );
            })}
          </div>

          {/* Service Level + View Layout + Sound */}
          <div className="flex flex-wrap items-center gap-2">
            <div
              className="flex items-center bg-[#22150E] p-1 rounded-[10px]"
              role="group"
              aria-label="Service level"
            >
              {([1, 2, 3] as ServiceLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setServiceLevel(lvl)}
                  className={`px-2.5 py-1 rounded-[7px] text-[12px] font-mono-code font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
                    serviceLevel === lvl
                      ? 'bg-[#FBEFE6] text-[#140905]'
                      : 'text-[#FBEFE6]/70 hover:text-[#FBEFE6]'
                  }`}
                >
                  L{lvl}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                setViewLayout((v) => (v === 'split' ? 'guest-only' : 'split'))
              }
              className="px-3 py-1.5 rounded-[10px] bg-[#2A180D] border border-[#F7F2ED]/15 text-[#FBEFE6] text-[12px] font-semibold cursor-pointer hover:border-[#E8500C] whitespace-nowrap shrink-0"
            >
              {viewLayout === 'split'
                ? 'Full Guest Phone View'
                : 'Show Staff & Floor Split'}
            </button>

            <button
              type="button"
              onClick={() => setSoundEnabled(soundEffects.toggle())}
              className="px-3 py-1.5 rounded-[10px] bg-[#22150E] text-[#FBEFE6]/80 text-[12px] font-mono-code cursor-pointer whitespace-nowrap shrink-0"
            >
              {soundEnabled ? 'SFX: On' : 'SFX: Off'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Container */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Live Instance Customization Strip */}
        <div
          className="mb-6 p-4 md:p-5 flex flex-wrap items-center justify-between gap-4"
          style={{
            backgroundColor: p.surface,
            border: `1px solid ${p.border}`,
            borderRadius: baseTheme.cardRadius,
          }}
        >
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label
                htmlFor="live-venue-name-input"
                className="block text-[11px] font-mono-code uppercase tracking-wider mb-1"
                style={{ color: p.muted }}
              >
                Live Restaurant Name (Editable)
              </label>
              <input
                id="live-venue-name-input"
                type="text"
                value={currentVenueName}
                onChange={(e) =>
                  setVenueNamesByTheme((prev) => ({
                    ...prev,
                    [activeThemeId]: e.target.value,
                  }))
                }
                className="px-3 py-1.5 text-[16px] font-semibold rounded-[8px] focus:outline-2"
                style={{
                  backgroundColor: p.elevated,
                  color: p.text,
                  border: `1px solid ${p.border}`,
                  fontFamily: baseTheme.displayFont,
                }}
              />
            </div>

            <div>
              <label
                htmlFor="live-table-select"
                className="block text-[11px] font-mono-code uppercase tracking-wider mb-1"
                style={{ color: p.muted }}
              >
                Active Guest Table QR
              </label>
              <select
                id="live-table-select"
                value={tableNumber}
                onChange={(e) => setTableNumber(Number(e.target.value))}
                className="px-3 py-1.5 text-[14px] font-mono-code font-semibold rounded-[8px] cursor-pointer"
                style={{
                  backgroundColor: p.elevated,
                  color: p.text,
                  border: `1px solid ${p.border}`,
                }}
              >
                {Array.from({ length: 12 }, (_, idx) => idx + 1).map((num) => (
                  <option key={num} value={num}>
                    Table {num} {num === 5 ? '(Featured)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[13px]" style={{ color: p.muted }}>
            <span>
              Mode:{' '}
              <strong style={{ color: p.text }}>
                {serviceLevel === 1
                  ? 'Level 1 · Digital Menu Only'
                  : serviceLevel === 2
                  ? 'Level 2 · Menu + One-Tap Waiter Call'
                  : 'Level 3 · Full Table Ordering + Kitchen Sync'}
              </strong>
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-code">DEMO INSTANCE</span>
          </div>
        </div>

        {/* Main Grid: Guest Phone + Connected Staff & Floor OS */}
        <div
          className={`grid grid-cols-1 ${
            viewLayout === 'split' ? ' lg:grid-cols-12' : 'max-w-[680px] mx-auto'
          } gap-6 items-start`}
        >
          {/* ============================================================== */}
          {/* LEFT COLUMN: GUEST TABLE ORDERING INTERFACE                    */}
          {/* ============================================================== */}
          <div className={viewLayout === 'split' ? 'lg:col-span-5' : 'w-full'}>
            <div
              className="overflow-hidden transition-all"
              style={{
                backgroundColor: p.surface,
                border: `1px solid ${p.border}`,
                borderRadius: baseTheme.cardRadius,
              }}
            >
              {/* Theme Hero Banner inside Guest Phone */}
              <div className="relative h-[210px] overflow-hidden bg-[#140905]">
                <img
                  src={baseTheme.heroImage}
                  alt={currentVenueName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15 p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-2 text-[12px] font-mono-code text-[#FBEFE6]/90">
                    <span>
                      TABLE {tableNumber} · LEVEL {serviceLevel}
                    </span>
                    <span>DEMO · NO APP NEEDED</span>
                  </div>

                  <div>
                    <div className="text-[12px] uppercase tracking-widest text-[#FBEFE6]/80 mb-1">
                      {baseTheme.venueSubtitle}
                    </div>
                    <h1
                      className="text-[32px] md:text-[36px] font-semibold text-white leading-[1.05] m-0"
                      style={{ fontFamily: baseTheme.displayFont }}
                    >
                      {currentVenueName}
                    </h1>
                  </div>
                </div>
              </div>

              {/* Guest Live Status Banner (when an order or waiter call is active for this table) */}
              {(latestTableTicket || latestTableCall) && (
                <div
                  className="px-5 py-3.5 border-b flex flex-wrap items-center justify-between gap-2"
                  style={{
                    backgroundColor: p.elevated,
                    borderColor: p.border,
                  }}
                >
                  {latestTableTicket ? (
                    <>
                      <div className="text-[13px]">
                        <span className="font-mono-code font-semibold">
                          Ticket {latestTableTicket.ticketNumber}
                        </span>
                        <span className="mx-1.5" aria-hidden="true">
                          ·
                        </span>
                        <span>
                          {latestTableTicket.status === 'incoming' &&
                            'Sent to reception'}
                          {latestTableTicket.status === 'confirmed' &&
                            'Confirmed by reception'}
                          {latestTableTicket.status === 'cooking' &&
                            'Kitchen is preparing your order'}
                          {latestTableTicket.status === 'ready' &&
                            'Ready at pass · Coming to your table'}
                          {latestTableTicket.status === 'served' &&
                            'Served at your table'}
                        </span>
                      </div>
                      <span
                        className="text-[12px] font-mono-code font-semibold px-2.5 py-1 rounded-[6px]"
                        style={{
                          backgroundColor: p.accent,
                          color: p.accentText,
                        }}
                      >
                        {latestTableTicket.status.toUpperCase()}
                      </span>
                    </>
                  ) : latestTableCall ? (
                    <>
                      <div className="text-[13px]">
                        <strong>Waiter notified</strong> · Table {tableNumber}
                      </div>
                      <span
                        className="text-[12px] font-mono-code font-semibold px-2.5 py-1 rounded-[6px]"
                        style={{
                          backgroundColor: p.accent,
                          color: p.accentText,
                        }}
                      >
                        {latestTableCall.status === 'walking'
                          ? 'WALKING OVER'
                          : 'NOTIFIED'}
                      </span>
                    </>
                  ) : null}
                </div>
              )}

              {/* Search & Category Bar */}
              <div className="p-5 border-b" style={{ borderColor: p.border }}>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${currentVenueName} menu...`}
                  aria-label="Search menu dishes"
                  className="w-full px-3.5 py-2.5 text-[14px] mb-3.5 focus:outline-2"
                  style={{
                    backgroundColor: p.elevated,
                    color: p.text,
                    border: `1px solid ${p.border}`,
                    borderRadius: baseTheme.buttonRadius,
                  }}
                />

                <div
                  className="flex items-center gap-1.5 overflow-x-auto pb-1"
                  role="tablist"
                  aria-label="Menu categories"
                >
                  {baseTheme.categories.map((cat) => {
                    const active = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setActiveCategory(cat)}
                        className="px-3.5 py-1.5 text-[13px] font-medium cursor-pointer transition-colors whitespace-nowrap shrink-0"
                        style={{
                          backgroundColor: active ? p.accent : p.elevated,
                          color: active ? p.accentText : p.text,
                          borderRadius: baseTheme.buttonRadius,
                        }}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dish List */}
              <div className="divide-y max-h-[520px] overflow-y-auto" style={{ borderColor: p.border }}>
                {filteredMenu.length === 0 ? (
                  <div className="p-8 text-center text-[14px]" style={{ color: p.muted }}>
                    No dishes match "{searchQuery}". Try another category.
                  </div>
                ) : (
                  filteredMenu.map((dish) => {
                    const qty = currentCart[dish.id] || 0;
                    return (
                      <div
                        key={dish.id}
                        className="p-5 flex items-start justify-between gap-4 transition-colors"
                        style={{
                          borderColor: p.border,
                          opacity: dish.soldOut ? 0.52 : 1,
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-[12px] mb-1" style={{ color: p.muted }}>
                            <span>{dish.category}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono-code tabular-nums">
                              {dish.prepMinutes} min
                            </span>
                            {dish.tag && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span style={{ color: p.accent, fontWeight: 600 }}>
                                  {dish.tag}
                                </span>
                              </>
                            )}
                            {dish.soldOut && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono-code font-semibold text-[#C03E0A]">
                                  SOLD OUT
                                </span>
                              </>
                            )}
                          </div>

                          <h3
                            className="text-[19px] font-semibold m-0 mb-1 leading-snug"
                            style={{
                              fontFamily: baseTheme.displayFont,
                              color: p.text,
                            }}
                          >
                            {dish.name}
                          </h3>

                          <p
                            className="text-[13px] leading-[1.45] m-0 mb-2"
                            style={{ color: p.muted }}
                          >
                            {dish.description}
                          </p>

                          <div
                            className="font-mono-code text-[15px] font-semibold tabular-nums"
                            style={{ color: p.text }}
                          >
                            {baseTheme.currencySymbol}
                            {dish.price.toFixed(2)}
                          </div>
                        </div>

                        {/* Level 1 shows browse-only price/availability; Level 2 & 3 show interactive cart steppers */}
                        {serviceLevel >= 2 && !dish.soldOut && (
                          <div className="flex items-center gap-1.5 shrink-0 pt-1">
                            {qty > 0 ? (
                              <>
                                <button
                                  type="button"
                                  aria-label={`Remove one ${dish.name}`}
                                  onClick={() => updateCartQty(dish.id, -1)}
                                  className="w-8 h-8 flex items-center justify-center font-mono-code font-bold text-[15px] cursor-pointer"
                                  style={{
                                    backgroundColor: p.elevated,
                                    color: p.text,
                                    border: `1px solid ${p.border}`,
                                    borderRadius: baseTheme.buttonRadius,
                                  }}
                                >
                                  -
                                </button>
                                <span className="w-6 text-center font-mono-code font-semibold text-[14px] tabular-nums">
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  aria-label={`Add one more ${dish.name}`}
                                  onClick={() => updateCartQty(dish.id, 1)}
                                  className="w-8 h-8 flex items-center justify-center font-mono-code font-bold text-[15px] cursor-pointer"
                                  style={{
                                    backgroundColor: p.accent,
                                    color: p.accentText,
                                    borderRadius: baseTheme.buttonRadius,
                                  }}
                                >
                                  +
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => updateCartQty(dish.id, 1)}
                                className="px-3.5 py-2 font-mono-code text-[13px] font-semibold cursor-pointer whitespace-nowrap"
                                style={{
                                  backgroundColor: p.elevated,
                                  color: p.text,
                                  border: `1px solid ${p.border}`,
                                  borderRadius: baseTheme.buttonRadius,
                                }}
                              >
                                + Add
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Guest Footer / Cart & Action Module */}
              <div
                className="p-5 border-t"
                style={{
                  backgroundColor: p.elevated,
                  borderColor: p.border,
                }}
              >
                {serviceLevel === 1 ? (
                  <div className="flex items-center justify-between gap-3 text-[13px]">
                    <span style={{ color: p.muted }}>
                      Level 1 Digital Menu · Staff takes your order at Table {tableNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => setServiceLevel(2)}
                      className="font-mono-code text-[12px] font-semibold underline cursor-pointer"
                      style={{ color: p.accent }}
                    >
                      Preview Level 2 Cart →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-semibold">
                        Table {tableNumber} Cart ({cartSummary.totalCount}{' '}
                        {cartSummary.totalCount === 1 ? 'item' : 'items'})
                      </span>
                      <span className="font-mono-code text-[18px] font-bold tabular-nums">
                        {baseTheme.currencySymbol}
                        {cartSummary.subtotal.toFixed(2)}
                      </span>
                    </div>

                    {cartSummary.items.length > 0 && (
                      <div className="text-[13px] space-y-1 pb-2 border-b" style={{ borderColor: p.border, color: p.muted }}>
                        {cartSummary.items.map(({ item, qty, lineTotal }) => (
                          <div key={item.id} className="flex justify-between">
                            <span>
                              {qty}× {item.name}
                            </span>
                            <span className="font-mono-code tabular-nums">
                              {baseTheme.currencySymbol}
                              {lineTotal.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {serviceLevel === 3 && cartSummary.items.length > 0 && (
                      <input
                        type="text"
                        value={orderNote}
                        onChange={(e) => setOrderNote(e.target.value)}
                        placeholder="Kitchen note (e.g. extra crispy, oat milk, no onions)..."
                        className="w-full px-3 py-2 text-[13px]"
                        style={{
                          backgroundColor: p.surface,
                          color: p.text,
                          border: `1px solid ${p.border}`,
                          borderRadius: baseTheme.buttonRadius,
                        }}
                      />
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleCallWaiter('Order ready in cart')}
                        className="w-full py-3 px-4 font-semibold text-[14px] cursor-pointer transition-opacity hover:opacity-90"
                        style={{
                          backgroundColor:
                            serviceLevel === 2 ? p.accent : p.surface,
                          color: serviceLevel === 2 ? p.accentText : p.text,
                          border: `1px solid ${
                            serviceLevel === 2 ? p.accent : p.border
                          }`,
                          borderRadius: baseTheme.buttonRadius,
                        }}
                      >
                        Call Waiter to Table {tableNumber}
                      </button>

                      {serviceLevel === 3 && (
                        <button
                          type="button"
                          disabled={cartSummary.items.length === 0}
                          onClick={handlePlaceOrder}
                          className="w-full py-3 px-4 font-semibold text-[14px] cursor-pointer transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{
                            backgroundColor: p.accent,
                            color: p.accentText,
                            borderRadius: baseTheme.buttonRadius,
                          }}
                        >
                          Place Order · {baseTheme.currencySymbol}
                          {cartSummary.subtotal.toFixed(2)}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* RIGHT COLUMN: CONNECTED STAFF, FLOOR & MENU EDITOR SUITE       */}
          {/* ============================================================== */}
          {viewLayout === 'split' && (
            <div className="lg:col-span-7 space-y-6">
              {/* Staff Console Navigation Bar */}
              <div
                className="p-4 md:p-5"
                style={{
                  backgroundColor: p.surface,
                  border: `1px solid ${p.border}`,
                  borderRadius: baseTheme.cardRadius,
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b" style={{ borderColor: p.border }}>
                  <div>
                    <div className="text-[12px] font-mono-code" style={{ color: p.muted }}>
                      CONNECTED FLOOR CONSOLE · {currentVenueName.toUpperCase()}
                    </div>
                    <h2
                      className="text-[24px] font-semibold m-0"
                      style={{ fontFamily: baseTheme.displayFont }}
                    >
                      Live Staff &amp; Owner Screens
                    </h2>
                  </div>

                  {/* Staff Screen Selector Tabs */}
                  <div
                    className="flex flex-wrap items-center gap-1.5 p-1 rounded-[10px]"
                    style={{ backgroundColor: p.elevated }}
                    role="tablist"
                    aria-label="Staff and owner screens"
                  >
                    {(
                      [
                        { id: 'kitchen', label: `Kitchen (${tickets.length})` },
                        { id: 'reception', label: 'Reception' },
                        {
                          id: 'waiter',
                          label: `Waiter Calls (${
                            waiterCalls.filter((c) => c.status !== 'assisted')
                              .length
                          })`,
                        },
                        { id: 'floor', label: '12-Table Floor' },
                        { id: 'editor', label: 'Menu Editor' },
                      ] as { id: StaffTab; label: string }[]
                    ).map((tab) => {
                      const active = staffTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          onClick={() => setStaffTab(tab.id)}
                          className="px-3 py-1.5 text-[13px] font-semibold cursor-pointer transition-colors whitespace-nowrap shrink-0"
                          style={{
                            backgroundColor: active ? p.accent : 'transparent',
                            color: active ? p.accentText : p.text,
                            borderRadius: baseTheme.buttonRadius,
                          }}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* TAB 1: KITCHEN PASS (KDS) SCREEN */}
                {staffTab === 'kitchen' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[13px]" style={{ color: p.muted }}>
                      <span>
                        Tap any ticket status button below to advance it and watch the Guest Phone update live.
                      </span>
                      <span className="font-mono-code">KDS PASS</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tickets.map((ticket) => (
                        <div
                          key={ticket.ticketNumber}
                          className="p-4 flex flex-col justify-between gap-4"
                          style={{
                            backgroundColor: p.elevated,
                            border: `1px solid ${
                              ticket.status === 'ready' ? p.accent : p.border
                            }`,
                            borderRadius: baseTheme.cardRadius,
                          }}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b" style={{ borderColor: p.border }}>
                              <div>
                                <span className="font-mono-code text-[18px] font-bold">
                                  {ticket.ticketNumber}
                                </span>
                                <span className="mx-1.5" aria-hidden="true">
                                  ·
                                </span>
                                <span className="text-[16px] font-semibold">
                                  Table {ticket.tableNumber}
                                </span>
                              </div>
                              <span
                                className="font-mono-code text-[12px] font-semibold px-2.5 py-1 rounded-[6px]"
                                style={{
                                  backgroundColor: p.accent,
                                  color: p.accentText,
                                }}
                              >
                                {ticket.status.toUpperCase()}
                              </span>
                            </div>

                            <ul className="list-none p-0 m-0 space-y-1.5 text-[14px] mb-3">
                              {ticket.items.map((line, i) => (
                                <li key={`${line.id}-${i}`}>
                                  <div className="flex justify-between font-medium">
                                    <span>
                                      <strong>{line.qty}×</strong> {line.name}
                                    </span>
                                    <span className="font-mono-code tabular-nums">
                                      {baseTheme.currencySymbol}
                                      {(line.qty * line.price).toFixed(2)}
                                    </span>
                                  </div>
                                  {line.note && (
                                    <div
                                      className="text-[12px] italic mt-0.5"
                                      style={{ color: p.accent }}
                                    >
                                      Note: {line.note}
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-2.5">
                            {/* 4-step kitchen bar */}
                            <div className="grid grid-cols-4 gap-1 text-center font-mono-code text-[11px]">
                              {(['incoming', 'cooking', 'ready', 'served'] as const).map(
                                (st) => {
                                  const isCurrent =
                                    ticket.status === st ||
                                    (st === 'incoming' &&
                                      ticket.status === 'confirmed');
                                  return (
                                    <div
                                      key={st}
                                      className="py-1 rounded-[5px] font-semibold uppercase"
                                      style={{
                                        backgroundColor: isCurrent
                                          ? p.accent
                                          : p.surface,
                                        color: isCurrent ? p.accentText : p.muted,
                                      }}
                                    >
                                      {st === 'incoming' ? 'New' : st}
                                    </div>
                                  );
                                }
                              )}
                            </div>

                            {ticket.status !== 'served' && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleAdvanceTicket(ticket.ticketNumber)
                                }
                                className="w-full py-2.5 px-4 font-semibold text-[13px] cursor-pointer"
                                style={{
                                  backgroundColor: p.accent,
                                  color: p.accentText,
                                  borderRadius: baseTheme.buttonRadius,
                                }}
                              >
                                {ticket.status === 'incoming' &&
                                  'Confirm & Start Cooking →'}
                                {ticket.status === 'confirmed' &&
                                  'Start Cooking →'}
                                {ticket.status === 'cooking' &&
                                  'Mark Order Ready ✓'}
                                {ticket.status === 'ready' &&
                                  'Mark Served at Table'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 2: RECEPTION SCREEN */}
                {staffTab === 'reception' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[13px]" style={{ color: p.muted }}>
                      <span>
                        Incoming table tickets land here with table number and itemized totals.
                      </span>
                      <span className="font-mono-code">RECEPTION DESK</span>
                    </div>

                    <div className="space-y-3">
                      {tickets.map((ticket) => (
                        <div
                          key={ticket.ticketNumber}
                          className="p-4 flex flex-wrap items-center justify-between gap-4"
                          style={{
                            backgroundColor: p.elevated,
                            border: `1px solid ${p.border}`,
                            borderRadius: baseTheme.cardRadius,
                          }}
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[18px] font-bold">
                                Table {ticket.tableNumber}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono-code text-[15px] font-semibold">
                                {ticket.ticketNumber}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="text-[13px]" style={{ color: p.muted }}>
                                {ticket.createdAt}
                              </span>
                            </div>
                            <div className="text-[13px]" style={{ color: p.muted }}>
                              {ticket.items
                                .map((i) => `${i.qty}× ${i.name}`)
                                .join(', ')}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-[11px] font-mono-code" style={{ color: p.muted }}>
                                TOTAL
                              </div>
                              <div className="font-mono-code text-[17px] font-bold tabular-nums">
                                {baseTheme.currencySymbol}
                                {ticket.total.toFixed(2)}
                              </div>
                            </div>

                            {ticket.status === 'incoming' ? (
                              <button
                                type="button"
                                onClick={() =>
                                  handleAdvanceTicket(ticket.ticketNumber)
                                }
                                className="px-4 py-2 font-semibold text-[13px] cursor-pointer"
                                style={{
                                  backgroundColor: p.accent,
                                  color: p.accentText,
                                  borderRadius: baseTheme.buttonRadius,
                                }}
                              >
                                Confirm &amp; Route to Kitchen
                              </button>
                            ) : (
                              <span
                                className="font-mono-code text-[12px] font-semibold px-3 py-1.5 rounded-[8px]"
                                style={{
                                  backgroundColor: p.surface,
                                  border: `1px solid ${p.border}`,
                                }}
                              >
                                {ticket.status.toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: WAITER CALL ALERTS */}
                {staffTab === 'waiter' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[13px]" style={{ color: p.muted }}>
                      <span>
                        When a guest taps "Call Waiter" under their cart, their table number rings here.
                      </span>
                      <span className="font-mono-code">WAITER HANDHELD</span>
                    </div>

                    <div className="space-y-3">
                      {waiterCalls.map((call) => (
                        <div
                          key={call.id}
                          className="p-4 flex flex-wrap items-center justify-between gap-4"
                          style={{
                            backgroundColor: p.elevated,
                            border: `1px solid ${
                              call.status === 'calling' ? p.accent : p.border
                            }`,
                            borderRadius: baseTheme.cardRadius,
                          }}
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[19px] font-bold">
                                Table {call.tableNumber}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="text-[14px] font-medium">
                                {call.reason}
                              </span>
                            </div>
                            <div className="text-[13px] font-mono-code" style={{ color: p.muted }}>
                              {call.cartCount} items in guest cart ({baseTheme.currencySymbol}
                              {call.cartTotal.toFixed(2)}) · {call.createdAt}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {call.status !== 'assisted' ? (
                              <button
                                type="button"
                                onClick={() =>
                                  handleAcknowledgeWaiterCall(
                                    call.id,
                                    call.tableNumber
                                  )
                                }
                                className="px-4 py-2 font-semibold text-[13px] cursor-pointer"
                                style={{
                                  backgroundColor: p.accent,
                                  color: p.accentText,
                                  borderRadius: baseTheme.buttonRadius,
                                }}
                              >
                                {call.status === 'calling'
                                  ? `Walk to Table ${call.tableNumber}`
                                  : 'Mark Table Assisted ✓'}
                              </button>
                            ) : (
                              <span className="font-mono-code text-[12px]" style={{ color: p.muted }}>
                                Assisted ✓
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: INTERACTIVE 12-TABLE FLOOR MAP */}
                {staffTab === 'floor' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[13px]" style={{ color: p.muted }}>
                      <span>
                        Click any table on the floor plan to switch the active Guest QR Phone to that table.
                      </span>
                      <span className="font-mono-code">12 TABLES · INTERACTIVE</span>
                    </div>

                    <div
                      className="rounded-[18px] overflow-hidden p-4"
                      style={{
                        backgroundColor: p.floorGround,
                        border: `1px solid ${p.border}`,
                      }}
                    >
                      <svg
                        viewBox="0 0 680 460"
                        className="w-full h-auto block"
                        role="img"
                        aria-label={`Interactive 12-table floor map for ${currentVenueName}`}
                      >
                        {/* Outer Floor Boundary */}
                        <rect
                          x="16"
                          y="16"
                          width="648"
                          height="428"
                          rx="16"
                          fill={p.floorGround}
                          stroke="#F7F2ED"
                          strokeOpacity="0.2"
                          strokeWidth="2"
                        />
                        {/* Counter */}
                        <rect
                          x="45"
                          y="34"
                          width="310"
                          height="50"
                          rx="8"
                          fill={p.floorTable}
                          stroke="#F7F2ED"
                          strokeOpacity="0.35"
                        />
                        <text
                          x="200"
                          y="64"
                          fill="#FBEFE6"
                          fontFamily="Google Sans Code"
                          fontSize="13"
                          fontWeight="700"
                          textAnchor="middle"
                        >
                          COUNTER
                        </text>
                        {/* Reception */}
                        <rect
                          x="380"
                          y="34"
                          width="140"
                          height="50"
                          rx="8"
                          fill={p.floorTable}
                          stroke="#F7F2ED"
                          strokeOpacity="0.35"
                        />
                        <text
                          x="450"
                          y="64"
                          fill="#FBEFE6"
                          fontFamily="Google Sans Code"
                          fontSize="13"
                          fontWeight="700"
                          textAnchor="middle"
                        >
                          RECEPTION
                        </text>
                        {/* Kitchen Pass */}
                        <rect
                          x="560"
                          y="40"
                          width="84"
                          height="380"
                          rx="10"
                          fill="#4A1D0D"
                          stroke={p.accent}
                          strokeWidth="2.5"
                        />
                        <text
                          x="602"
                          y="230"
                          fill="#FBEFE6"
                          fontFamily="Google Sans Code"
                          fontSize="14"
                          fontWeight="700"
                          textAnchor="middle"
                          transform="rotate(-90 602 230)"
                        >
                          KITCHEN PASS
                        </text>

                        {/* Active Waiter Path & Order Route Lines */}
                        {targetTableCoord && (
                          <line
                            x1="200"
                            y1="84"
                            x2={targetTableCoord.x}
                            y2={targetTableCoord.y}
                            stroke={p.accent}
                            strokeWidth="2.5"
                            strokeDasharray="6 5"
                          />
                        )}

                        {/* 12 Interactive Tables */}
                        {FLOOR_TABLES.map((tbl) => {
                          const isSelected = tbl.id === tableNumber;
                          const hasTicket = tickets.some(
                            (tk) =>
                              tk.tableNumber === tbl.id &&
                              tk.status !== 'served'
                          );
                          const hasCall = waiterCalls.some(
                            (wc) =>
                              wc.tableNumber === tbl.id &&
                              wc.status !== 'assisted'
                          );

                          return (
                            <g
                              key={tbl.id}
                              transform={`translate(${tbl.x}, ${tbl.y})`}
                              onClick={() => setTableNumber(tbl.id)}
                              className="cursor-pointer"
                            >
                              {isSelected && (
                                <circle
                                  r="44"
                                  fill="none"
                                  stroke={p.accent}
                                  strokeWidth="2.5"
                                  strokeOpacity="0.85"
                                />
                              )}
                              {tbl.round ? (
                                <circle
                                  r="34"
                                  fill={
                                    isSelected || hasTicket || hasCall
                                      ? p.accent
                                      : p.floorTable
                                  }
                                  stroke="#FBEFE6"
                                  strokeOpacity={isSelected ? '0.95' : '0.28'}
                                  strokeWidth="2"
                                />
                              ) : (
                                <rect
                                  x="-32"
                                  y="-32"
                                  width="64"
                                  height="64"
                                  rx="10"
                                  fill={
                                    isSelected || hasTicket || hasCall
                                      ? p.accent
                                      : p.floorTable
                                  }
                                  stroke="#FBEFE6"
                                  strokeOpacity={isSelected ? '0.95' : '0.28'}
                                  strokeWidth="2"
                                />
                              )}
                              {/* QR Plaque */}
                              <rect
                                x="8"
                                y="8"
                                width="11"
                                height="11"
                                rx="2"
                                fill="#F7F2ED"
                              />
                              <text
                                y="-2"
                                fill={
                                  isSelected || hasTicket || hasCall
                                    ? p.accentText
                                    : '#FBEFE6'
                                }
                                fontFamily="Google Sans Code"
                                fontSize="13"
                                fontWeight="700"
                                textAnchor="middle"
                              >
                                T{tbl.id}
                              </text>
                              <text
                                y="14"
                                fill={
                                  isSelected || hasTicket || hasCall
                                    ? p.accentText
                                    : '#FBEFE6'
                                }
                                fontFamily="Google Sans Code"
                                fontSize="9"
                                textAnchor="middle"
                              >
                                {hasCall
                                  ? 'CALL'
                                  : hasTicket
                                  ? 'ORDER'
                                  : 'FREE'}
                              </text>
                            </g>
                          );
                        })}

                        {/* Waiter Marker */}
                        {targetTableCoord && (
                          <g
                            transform={`translate(${
                              waiterTargetTable ? targetTableCoord.x - 28 : 200
                            }, ${
                              waiterTargetTable ? targetTableCoord.y - 28 : 96
                            })`}
                          >
                            <circle
                              r="13"
                              fill="#F7F2ED"
                              stroke={p.accent}
                              strokeWidth="3"
                            />
                            <text
                              y="4"
                              fill="#140905"
                              fontFamily="Google Sans Code"
                              fontSize="10"
                              fontWeight="700"
                              textAnchor="middle"
                            >
                              W1
                            </text>
                          </g>
                        )}
                      </svg>
                    </div>
                  </div>
                )}

                {/* TAB 5: LIVE OWNER MENU EDITOR ("CHANGE A PRICE IN A MINUTE") */}
                {staffTab === 'editor' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between text-[13px]" style={{ color: p.muted }}>
                      <span>
                        Update any price or hide a sold-out dish below. The Guest Phone on the left updates immediately with zero reprints.
                      </span>
                      <span className="font-mono-code">OWNER TOOL</span>
                    </div>

                    {/* Add New Dish Form */}
                    <form
                      onSubmit={handleAddCustomDish}
                      className="p-4 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end"
                      style={{
                        backgroundColor: p.elevated,
                        border: `1px solid ${p.border}`,
                        borderRadius: baseTheme.cardRadius,
                      }}
                    >
                      <div className="sm:col-span-5">
                        <label className="block text-[11px] font-mono-code mb-1" style={{ color: p.muted }}>
                          New Dish Name
                        </label>
                        <input
                          type="text"
                          value={newDishName}
                          onChange={(e) => setNewDishName(e.target.value)}
                          placeholder="e.g. Truffle Fries"
                          className="w-full px-3 py-2 text-[13px]"
                          style={{
                            backgroundColor: p.surface,
                            color: p.text,
                            border: `1px solid ${p.border}`,
                            borderRadius: baseTheme.buttonRadius,
                          }}
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-mono-code mb-1" style={{ color: p.muted }}>
                          Category
                        </label>
                        <select
                          value={newDishCategory}
                          onChange={(e) => setNewDishCategory(e.target.value)}
                          className="w-full px-3 py-2 text-[13px]"
                          style={{
                            backgroundColor: p.surface,
                            color: p.text,
                            border: `1px solid ${p.border}`,
                            borderRadius: baseTheme.buttonRadius,
                          }}
                        >
                          {baseTheme.categories
                            .filter((c) => c !== 'All')
                            .map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-mono-code mb-1" style={{ color: p.muted }}>
                          Price ({baseTheme.currencySymbol})
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={newDishPrice}
                          onChange={(e) => setNewDishPrice(e.target.value)}
                          className="w-full px-3 py-2 text-[13px] font-mono-code"
                          style={{
                            backgroundColor: p.surface,
                            color: p.text,
                            border: `1px solid ${p.border}`,
                            borderRadius: baseTheme.buttonRadius,
                          }}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <button
                          type="submit"
                          className="w-full py-2 px-3 font-semibold text-[13px] cursor-pointer"
                          style={{
                            backgroundColor: p.accent,
                            color: p.accentText,
                            borderRadius: baseTheme.buttonRadius,
                          }}
                        >
                          + Add Dish
                        </button>
                      </div>
                    </form>

                    {/* Editable Dish Rows */}
                    <div className="divide-y max-h-[380px] overflow-y-auto" style={{ borderColor: p.border }}>
                      {currentMenu.map((dish) => (
                        <div
                          key={dish.id}
                          className="py-3 flex flex-wrap items-center justify-between gap-3"
                          style={{ borderColor: p.border }}
                        >
                          <div>
                            <div className="font-semibold text-[15px]">
                              {dish.name}
                            </div>
                            <div className="text-[12px]" style={{ color: p.muted }}>
                              {dish.category}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateDishPrice(
                                  dish.id,
                                  Math.max(0.5, dish.price - 0.5)
                                )
                              }
                              className="px-2.5 py-1 font-mono-code text-[12px] font-bold cursor-pointer"
                              style={{
                                backgroundColor: p.elevated,
                                border: `1px solid ${p.border}`,
                                borderRadius: baseTheme.buttonRadius,
                              }}
                            >
                              -0.50
                            </button>
                            <span className="font-mono-code text-[14px] font-bold w-16 text-center tabular-nums">
                              {baseTheme.currencySymbol}
                              {dish.price.toFixed(2)}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateDishPrice(dish.id, dish.price + 0.5)
                              }
                              className="px-2.5 py-1 font-mono-code text-[12px] font-bold cursor-pointer"
                              style={{
                                backgroundColor: p.elevated,
                                border: `1px solid ${p.border}`,
                                borderRadius: baseTheme.buttonRadius,
                              }}
                            >
                              +0.50
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleSoldOut(dish.id)}
                              className="px-3 py-1 font-mono-code text-[12px] font-semibold cursor-pointer"
                              style={{
                                backgroundColor: dish.soldOut
                                  ? '#C03E0A'
                                  : p.elevated,
                                color: dish.soldOut ? '#FFFFFF' : p.text,
                                border: `1px solid ${p.border}`,
                                borderRadius: baseTheme.buttonRadius,
                              }}
                            >
                              {dish.soldOut ? 'Sold Out' : 'Available'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
