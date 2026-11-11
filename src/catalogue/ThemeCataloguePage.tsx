import React, { useState } from 'react';
import {
  PRODUCT_THEMES,
  ProductThemeConfig,
  ServiceLevel,
  ThemeId,
} from './themeCatalogData';

interface ThemeCataloguePageProps {
  onInitializeTheme: (config: {
    themeId: ThemeId;
    customBrandName: string;
    serviceLevel: ServiceLevel;
    initialTable: number;
  }) => void;
  onOpenBragStudio: () => void;
  onOpenIntroSite: () => void;
}

export const ThemeCataloguePage: React.FC<ThemeCataloguePageProps> = ({
  onInitializeTheme,
  onOpenBragStudio,
  onOpenIntroSite,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | ThemeId>('all');
  const [customBrandName, setCustomBrandName] = useState<string>('');
  const [serviceLevel, setServiceLevel] = useState<ServiceLevel>(3);
  const [initialTable, setInitialTable] = useState<number>(5);
  const [inspectedThemeId, setInspectedThemeId] = useState<ThemeId | null>(null);
  const [copiedThemeId, setCopiedThemeId] = useState<ThemeId | null>(null);

  const visibleThemes =
    selectedFilter === 'all'
      ? PRODUCT_THEMES
      : PRODUCT_THEMES.filter((t) => t.id === selectedFilter);

  const handleCopyTokens = (theme: ProductThemeConfig) => {
    const cssVars = `:root[data-theme="${theme.id}"] {\n  --bg-canvas: ${theme.palette.canvas};\n  --bg-surface: ${theme.palette.surface};\n  --bg-elevated: ${theme.palette.elevated};\n  --text-primary: ${theme.palette.text};\n  --text-muted: ${theme.palette.muted};\n  --accent-primary: ${theme.palette.accent};\n  --border-subtle: ${theme.palette.border};\n  --radius-card: ${theme.cardRadius};\n  --radius-button: ${theme.buttonRadius};\n}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cssVars).catch(() => {});
    }
    setCopiedThemeId(theme.id);
    setTimeout(() => {
      setCopiedThemeId((prev) => (prev === theme.id ? null : prev));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#140905] text-[#FBEFE6] selection:bg-[#E8500C] selection:text-[#FBEFE6]">
      {/* 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 h-16 px-4 md:px-8 border-b border-[#FBEFE6]/12 bg-[#140905]/95 backdrop-blur-md flex items-center justify-between gap-4">
        {/* Zone 1: Brand Identity */}
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-[6px] bg-[#E8500C] text-[#FBEFE6] font-display font-bold text-[16px] flex items-center justify-center tracking-wider">
            BB
          </span>
          <div>
            <span className="font-mono-code text-[12px] uppercase tracking-[0.14em] text-[#FBEFE6] block leading-none">
              Build Bros · Product OS
            </span>
            <span className="font-mono-code text-[11px] text-[#B89F8D] block mt-0.5">
              4 Live Ordering Themes · Direct Initialization
            </span>
          </div>
        </div>

        {/* Zone 2: Theme Filter Navigation */}
        <nav
          aria-label="Theme filter navigation"
          className="hidden lg:flex items-center gap-1 p-1 rounded-[8px] border border-[#FBEFE6]/12 bg-[#1F0F09]"
        >
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-[6px] font-mono-code text-[11px] uppercase tracking-[0.1em] cursor-pointer transition-colors ${
              selectedFilter === 'all'
                ? 'bg-[#E8500C] text-[#FBEFE6] font-semibold'
                : 'text-[#B89F8D] hover:text-[#FBEFE6]'
            }`}
          >
            All 4 Themes
          </button>
          {PRODUCT_THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => setSelectedFilter(theme.id)}
              className={`px-3 py-1.5 rounded-[6px] font-mono-code text-[11px] uppercase tracking-[0.1em] cursor-pointer transition-colors ${
                selectedFilter === theme.id
                  ? 'bg-[#E8500C] text-[#FBEFE6] font-semibold'
                  : 'text-[#B89F8D] hover:text-[#FBEFE6]'
              }`}
            >
              {theme.indexNumber}. {theme.styleName}
            </button>
          ))}
        </nav>

        {/* Zone 3: Workspace Switcher */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenBragStudio}
            className="px-3 py-1.5 rounded-[6px] border border-[#FBEFE6]/18 text-[#FBEFE6] hover:border-[#FBEFE6]/40 font-mono-code text-[11px] uppercase tracking-[0.08em] cursor-pointer"
          >
            /brag Reel
          </button>
          <button
            type="button"
            onClick={onOpenIntroSite}
            className="px-3 py-1.5 rounded-[6px] border border-[#FBEFE6]/18 text-[#B89F8D] hover:text-[#FBEFE6] font-mono-code text-[11px] uppercase tracking-[0.08em] cursor-pointer"
          >
            Intro Site
          </button>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 md:py-14">
        {/* Hero Header + Live Initialization Configurator */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-[#FBEFE6]/12 items-end">
          <div className="lg:col-span-7">
            <p className="font-mono-code text-[11px] uppercase tracking-[0.16em] text-[#E8500C] mb-3">
              STANDALONE PRODUCT SUITE · DIRECT INITIALIZATION CATALOGUE
            </p>
            <h1 className="font-display text-[clamp(2.5rem,5.5vw,5rem)] uppercase leading-[0.94] tracking-[0.01em] text-[#FBEFE6]">
              Four Distinct Themes. One Live Ordering Engine.
            </h1>
            <p className="font-serif-editorial text-[18px] md:text-[20px] text-[#C6B6AB] mt-4 max-w-[62ch] leading-[1.55]">
              Every cafe, bistro, burger joint, and wood-fired kitchen has its own atmosphere. Pick any of the four production themes below, set your venue parameters, and initialize the complete Guest Table Phone and Kitchen Pass live in your browser.
            </p>
          </div>

          {/* Live Initialization Parameters Box */}
          <div className="lg:col-span-5 p-5 md:p-6 rounded-[12px] bg-[#1F0F09] border border-[#FBEFE6]/15">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#FBEFE6]/10">
              <span className="font-mono-code text-[11px] uppercase tracking-[0.14em] text-[#FBEFE6]">
                Initialization Parameters
              </span>
              <span className="font-mono-code text-[11px] text-[#9BE564]">
                ● Ready to boot
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="catalogue-venue-name"
                  className="block font-mono-code text-[11px] uppercase tracking-[0.1em] text-[#B89F8D] mb-1.5"
                >
                  Custom Venue Name (Optional)
                </label>
                <input
                  id="catalogue-venue-name"
                  type="text"
                  value={customBrandName}
                  onChange={(e) => setCustomBrandName(e.target.value)}
                  placeholder="Leave blank to use theme signature venue..."
                  className="w-full px-3.5 py-2.5 rounded-[8px] bg-[#140905] border border-[#FBEFE6]/18 text-[#FBEFE6] placeholder:text-[#8E7968] text-[14px] focus:outline-none focus:border-[#E8500C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="block font-mono-code text-[11px] uppercase tracking-[0.1em] text-[#B89F8D] mb-1.5">
                    Service Level
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {([1, 2, 3] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setServiceLevel(lvl)}
                        className={`py-2 rounded-[6px] font-mono-code text-[12px] font-semibold cursor-pointer border transition-colors ${
                          serviceLevel === lvl
                            ? 'bg-[#E8500C] text-[#FBEFE6] border-[#E8500C]'
                            : 'bg-[#140905] text-[#B89F8D] border-[#FBEFE6]/15 hover:text-[#FBEFE6]'
                        }`}
                      >
                        Lvl {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="catalogue-table-select"
                    className="block font-mono-code text-[11px] uppercase tracking-[0.1em] text-[#B89F8D] mb-1.5"
                  >
                    Active Table (1–12)
                  </label>
                  <select
                    id="catalogue-table-select"
                    value={initialTable}
                    onChange={(e) => setInitialTable(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-[6px] bg-[#140905] border border-[#FBEFE6]/18 text-[#FBEFE6] font-mono-code text-[13px] focus:outline-none focus:border-[#E8500C]"
                  >
                    {Array.from({ length: 12 }, (_, idx) => idx + 1).map((num) => (
                      <option key={num} value={num}>
                        Table {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Filter Bar */}
        <div className="flex lg:hidden items-center gap-2 overflow-x-auto py-4 border-b border-[#FBEFE6]/10">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-[6px] font-mono-code text-[11px] uppercase tracking-[0.1em] whitespace-nowrap cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-[#E8500C] text-[#FBEFE6]'
                : 'bg-[#1F0F09] text-[#B89F8D]'
            }`}
          >
            All 4 Themes
          </button>
          {PRODUCT_THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => setSelectedFilter(theme.id)}
              className={`px-3 py-1.5 rounded-[6px] font-mono-code text-[11px] uppercase tracking-[0.1em] whitespace-nowrap cursor-pointer ${
                selectedFilter === theme.id
                  ? 'bg-[#E8500C] text-[#FBEFE6]'
                  : 'bg-[#1F0F09] text-[#B89F8D]'
              }`}
            >
              {theme.indexNumber}. {theme.styleName}
            </button>
          ))}
        </div>

        {/* 4-Theme Showcase Grid */}
        <section
          aria-label="Product Themes Catalogue"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10"
        >
          {visibleThemes.map((theme) => {
            const isInspected = inspectedThemeId === theme.id;
            const effectiveVenueName = customBrandName.trim() || theme.defaultVenueName;

            return (
              <article
                key={theme.id}
                data-testid={`theme-card-${theme.id}`}
                style={{
                  backgroundColor: theme.palette.canvas,
                  color: theme.palette.text,
                  borderColor: theme.palette.border,
                  borderRadius: theme.cardRadius,
                  fontFamily: theme.bodyFont,
                }}
                className="border overflow-hidden flex flex-col justify-between transition-colors"
              >
                {/* Top Editorial Visual Header */}
                <div>
                  <div
                    className="relative h-64 md:h-72 overflow-hidden border-b"
                    style={{ borderColor: theme.palette.border }}
                  >
                    <img
                      src={theme.heroImage}
                      alt={`${theme.styleName} — ${theme.defaultVenueName}`}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          theme.palette.mode === 'dark'
                            ? 'linear-gradient(to top, rgba(10,10,12,0.92) 8%, rgba(10,10,12,0.25) 60%, rgba(10,10,12,0.4) 100%)'
                            : 'linear-gradient(to top, rgba(20,14,10,0.82) 8%, rgba(20,14,10,0.18) 60%, rgba(20,14,10,0.3) 100%)',
                      }}
                    />

                    {/* Top Metadata Line (Unboxed typographic row) */}
                    <div className="absolute top-4 left-5 right-5 flex items-center justify-between text-[#FBEFE6]">
                      <span className="font-mono-code text-[11px] uppercase tracking-[0.16em]">
                        {theme.indexNumber} · {theme.styleName}
                      </span>
                      <span className="font-mono-code text-[11px] uppercase tracking-[0.12em] text-[#E6DDD6]">
                        {theme.venueSubtitle}
                      </span>
                    </div>

                    {/* Bottom Venue Title inside Hero */}
                    <div className="absolute bottom-4 left-5 right-5 text-[#FBEFE6]">
                      <p className="font-mono-code text-[11px] uppercase tracking-[0.14em] text-[#E8D5B5] mb-1">
                        {theme.tagline} · Table {initialTable} · Level {serviceLevel}
                      </p>
                      <h2
                        style={{ fontFamily: theme.displayFont }}
                        className="text-[30px] md:text-[36px] leading-[1.02] font-bold"
                      >
                        {effectiveVenueName}
                      </h2>
                    </div>
                  </div>

                  {/* Theme Body Copy & Design System Spec */}
                  <div className="p-6 md:p-7 space-y-6">
                    <div>
                      <p
                        className="text-[15px] md:text-[16px] leading-[1.55]"
                        style={{ color: theme.palette.muted }}
                      >
                        {theme.description}
                      </p>
                    </div>

                    {/* Palette & Typography Spec Strip */}
                    <div
                      className="p-4 border grid grid-cols-1 sm:grid-cols-2 gap-4"
                      style={{
                        backgroundColor: theme.palette.surface,
                        borderColor: theme.palette.border,
                        borderRadius: theme.buttonRadius,
                      }}
                    >
                      <div>
                        <span
                          className="block font-mono-code text-[10px] uppercase tracking-[0.14em] mb-2"
                          style={{ color: theme.palette.muted }}
                        >
                          60-30-10 Token Swatches
                        </span>
                        <div className="flex items-center gap-2">
                          {[
                            { label: 'Canvas', hex: theme.palette.canvas },
                            { label: 'Surface', hex: theme.palette.surface },
                            { label: 'Elevated', hex: theme.palette.elevated },
                            { label: 'Text', hex: theme.palette.text },
                            { label: 'Accent', hex: theme.palette.accent },
                          ].map((swatch) => (
                            <div
                              key={swatch.label}
                              className="flex items-center gap-1.5"
                              title={`${swatch.label}: ${swatch.hex}`}
                            >
                              <span
                                className="w-6 h-6 border block"
                                style={{
                                  backgroundColor: swatch.hex,
                                  borderColor: theme.palette.border,
                                  borderRadius: '4px',
                                }}
                              />
                            </div>
                          ))}
                          <span
                            className="font-mono-code text-[11px] ml-1 tabular-nums"
                            style={{ color: theme.palette.muted }}
                          >
                            {theme.palette.accent}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span
                          className="block font-mono-code text-[10px] uppercase tracking-[0.14em] mb-1.5"
                          style={{ color: theme.palette.muted }}
                        >
                          Typographic Voice &amp; Radius
                        </span>
                        <p
                          className="font-mono-code text-[11px] leading-[1.45] truncate"
                          style={{ color: theme.palette.text }}
                        >
                          {theme.displayFont.split(',')[0].replace(/"/g, '')} +{' '}
                          {theme.bodyFont.split(',')[0].replace(/"/g, '')}
                        </p>
                        <p
                          className="font-mono-code text-[11px] mt-0.5"
                          style={{ color: theme.palette.muted }}
                        >
                          Card Radius: {theme.cardRadius} · Mode: {theme.palette.mode.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    {/* Sample Menu Preview (3 Signature Dishes) */}
                    <div>
                      <div className="flex items-center justify-between mb-2.5 gap-2">
                        <span
                          className="font-mono-code text-[10px] uppercase tracking-[0.14em]"
                          style={{ color: theme.palette.muted }}
                        >
                          Sample Menu ({theme.menu.length} Dishes Preloaded)
                        </span>
                        <span
                          className="font-mono-code text-[11px] truncate"
                          style={{ color: theme.palette.accent }}
                        >
                          {theme.categories.filter((c) => c !== 'All').join(' · ')}
                        </span>
                      </div>

                      <div
                        className="divide-y border"
                        style={{
                          backgroundColor: theme.palette.surface,
                          borderColor: theme.palette.border,
                          borderRadius: theme.buttonRadius,
                        }}
                      >
                        {theme.menu.slice(0, isInspected ? theme.menu.length : 3).map((dish) => (
                          <div
                            key={dish.id}
                            className="px-4 py-3 flex items-baseline justify-between gap-4"
                            style={{ borderColor: theme.palette.border }}
                          >
                            <div>
                              <span
                                className="font-medium text-[14px]"
                                style={{ color: theme.palette.text }}
                              >
                                {dish.name}
                              </span>
                              <span
                                className="font-mono-code text-[11px] ml-2"
                                style={{ color: theme.palette.muted }}
                              >
                                {dish.category} · {dish.prepMinutes}m
                              </span>
                              {isInspected && (
                                <p
                                  className="text-[13px] mt-0.5"
                                  style={{ color: theme.palette.muted }}
                                >
                                  {dish.description}
                                </p>
                              )}
                            </div>
                            <span
                              className="font-mono-code text-[14px] font-semibold tabular-nums shrink-0"
                              style={{ color: theme.palette.accent }}
                            >
                              {theme.currencySymbol}
                              {dish.price.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Footer: Direct Theme Initialization */}
                <div
                  className="px-6 py-4 border-t flex flex-wrap items-center justify-between gap-3"
                  style={{
                    backgroundColor: theme.palette.surface,
                    borderColor: theme.palette.border,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setInspectedThemeId((prev) => (prev === theme.id ? null : theme.id))
                      }
                      style={{
                        borderColor: theme.palette.border,
                        color: theme.palette.text,
                        borderRadius: theme.buttonRadius,
                      }}
                      className="px-3.5 py-2 border font-mono-code text-[11px] uppercase tracking-[0.08em] cursor-pointer"
                    >
                      {isInspected ? 'Hide Full Menu' : `Inspect All ${theme.menu.length} Dishes`}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyTokens(theme)}
                      style={{
                        borderColor: theme.palette.border,
                        color: theme.palette.muted,
                        borderRadius: theme.buttonRadius,
                      }}
                      className="px-3 py-2 border font-mono-code text-[11px] uppercase tracking-[0.08em] cursor-pointer"
                    >
                      {copiedThemeId === theme.id ? 'Tokens Copied ✓' : 'Copy CSS Tokens'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onInitializeTheme({
                        themeId: theme.id,
                        customBrandName: customBrandName.trim(),
                        serviceLevel,
                        initialTable,
                      })
                    }
                    style={{
                      backgroundColor: theme.palette.accent,
                      color: theme.palette.accentText,
                      borderRadius: theme.buttonRadius,
                    }}
                    className="px-5 py-2.5 font-mono-code text-[12px] font-semibold uppercase tracking-[0.1em] cursor-pointer transition-opacity hover:opacity-90"
                  >
                    Initialize {theme.styleName} Live →
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
};
