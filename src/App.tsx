import React, { useState } from 'react';
import { Nav } from './components/layout/Nav';
import { ActionBar } from './components/layout/ActionBar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/story/Hero';
import { About } from './components/sections/About';
import { Draw } from './components/sections/Draw';
import { How } from './components/sections/How';
import { Change } from './components/sections/Change';
import { Demo } from './components/sections/Demo';
import { Work } from './components/sections/Work';
import { Process } from './components/sections/Process';
import { Owner } from './components/sections/Owner';
import { Faq } from './components/sections/Faq';
import { FlipSection } from './components/sections/Flip';
import { Start } from './components/sections/Start';
import { BragStudio } from './components/sections/BragStudio';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { ThemeCataloguePage } from './catalogue/ThemeCataloguePage';
import { LiveThemeInstance } from './catalogue/LiveThemeInstance';
import { ServiceLevel, ThemeId } from './catalogue/themeCatalogData';

export default function App() {
  const [page, setPage] = useState<'catalogue' | 'live-theme' | 'brag' | 'home' | 'terms' | 'privacy'>('catalogue');
  const [activeThemeConfig, setActiveThemeConfig] = useState<{
    themeId: ThemeId;
    customBrandName: string;
    serviceLevel: ServiceLevel;
    initialTable: number;
  }>({
    themeId: 'classy-elegant',
    customBrandName: '',
    serviceLevel: 3,
    initialTable: 5,
  });

  if (page === 'catalogue') {
    return (
      <ThemeCataloguePage
        onInitializeTheme={(config) => {
          setActiveThemeConfig(config);
          setPage('live-theme');
          window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        }}
        onOpenBragStudio={() => setPage('brag')}
        onOpenIntroSite={() => setPage('home')}
      />
    );
  }

  if (page === 'live-theme') {
    return (
      <LiveThemeInstance
        initialThemeId={activeThemeConfig.themeId}
        initialLevel={activeThemeConfig.serviceLevel}
        initialVenueName={activeThemeConfig.customBrandName || undefined}
        initialTable={activeThemeConfig.initialTable}
        onBackToCatalogue={() => setPage('catalogue')}
      />
    );
  }

  if (page === 'brag') {
    return (
      <div>
        <div className="bg-[#140905] text-[#FBEFE6] px-4 py-2 text-center text-[13px] flex items-center justify-center gap-3 border-b border-[#FBEFE6]/12">
          <span>Viewing /brag Reel Studio</span>
          <button
            type="button"
            onClick={() => setPage('catalogue')}
            className="px-3 py-1 rounded-[8px] bg-[#E8500C] text-[#FBEFE6] font-mono-code text-[12px] font-semibold cursor-pointer"
          >
            ← Back to 4-Theme Product Catalogue
          </button>
        </div>
        <BragStudio onOpenSite={() => setPage('home')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F2ED] text-[#1A0C06]">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="bg-[#140905] text-[#FBEFE6] px-4 py-2 text-center text-[13px] flex flex-wrap items-center justify-center gap-3">
        <span>Viewing Build Bros Introduction Site</span>
        <button
          type="button"
          onClick={() => setPage('catalogue')}
          className="px-3 py-1 rounded-[8px] bg-[#E8500C] text-[#FBEFE6] font-mono-code text-[12px] font-semibold cursor-pointer"
        >
          ← Open 4-Theme Product Catalogue
        </button>
        <button
          type="button"
          onClick={() => setPage('brag')}
          className="px-3 py-1 rounded-[8px] border border-[#FBEFE6]/25 text-[#FBEFE6] font-mono-code text-[12px] cursor-pointer"
        >
          /brag Reel Studio
        </button>
      </div>

      <Nav onNavigatePage={(target) => setPage(target)} />

      <main id="main-content">
        {page === 'terms' && <Terms onBack={() => setPage('home')} />}
        {page === 'privacy' && <Privacy onBack={() => setPage('home')} />}
        {page === 'home' && (
          <>
            <Hero />
            <About />
            <Draw />
            <How />
            <Change />
            <Demo />
            <Work />
            <Process />
            <Owner enabled={false} />
            <Faq />
            <FlipSection />
            <Start />
          </>
        )}
      </main>

      <Footer onNavigatePage={(target) => setPage(target)} />
      {page === 'home' && <ActionBar />}
    </div>
  );
}
