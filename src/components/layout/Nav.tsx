import React, { useState } from 'react';
import clientsData from '../../data/clients.json';

interface NavProps {
  onNavigatePage?: (page: 'home' | 'terms' | 'privacy') => void;
}

export const Nav: React.FC<NavProps> = ({ onNavigatePage }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const hasClients = Array.isArray(clientsData) && clientsData.length > 0;

  const links = [
    { label: 'Levels', href: '#draw' },
    { label: 'How it works', href: '#how' },
    { label: 'Try it', href: '#demo' },
    ...(hasClients ? [{ label: 'Our work', href: '#work' }] : []),
    { label: 'Setup', href: '#process' },
    { label: 'Questions', href: '#faq' },
  ];

  const handleLinkClick = () => {
    if (onNavigatePage) onNavigatePage('home');
    setMenuOpen(false);
  };

  return (
    <header className="fixed top-3 left-0 right-0 z-50 px-[14px] md:px-6 pointer-events-none">
      <div className="max-w-[1240px] mx-auto pointer-events-auto">
        <nav
          aria-label="Primary navigation"
          className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-[20px] border border-[#F7F2ED]/15"
          style={{
            backgroundColor: 'rgba(30, 15, 8, 0.65)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          {/* Left: Brand mark + Build Bros */}
          <a
            href="#story"
            onClick={handleLinkClick}
            className="inline-flex items-center gap-2.5 text-[#FBEFE6] font-semibold text-[16px] tracking-[-0.02em] no-underline whitespace-nowrap shrink-0"
          >
            <span
              aria-hidden="true"
              className="w-6 h-6 rounded-[6px] bg-[#E8500C] flex items-center justify-center text-[#FBEFE6] font-mono-code text-[12px] font-bold"
            >
              BB
            </span>
            <span>Build Bros</span>
          </a>

          {/* Center: Desktop links */}
          <div className="hidden lg:flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="text-[14px] font-medium text-[#FBEFE6]/85 hover:text-[#FFFFFF] transition-colors no-underline whitespace-nowrap shrink-0"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right: White chip + CTA / Menu button */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 shrink">
            <span className="px-2.5 sm:px-3 py-1 rounded-[12px] bg-[#FFFFFF] text-[#1A0C06] text-[11px] sm:text-[13px] font-semibold tracking-[-0.01em] whitespace-nowrap truncate">
              2.5+ years in tech and web dev
            </span>

            <a
              href="#start"
              onClick={handleLinkClick}
              className="hidden sm:inline-flex items-center justify-center h-9 px-3.5 rounded-[10px] bg-[#E8500C] hover:bg-[#C03E0A] text-[#FBEFE6] text-[13px] font-semibold transition-colors no-underline whitespace-nowrap shrink-0"
            >
              Get set up
            </a>

            <button
              type="button"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden w-9 h-9 rounded-[10px] bg-[#140905] text-[#FBEFE6] border border-[#F7F2ED]/20 flex items-center justify-center hover:bg-[#2A180D] transition-colors cursor-pointer shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                {menuOpen ? (
                  <path
                    d="M4 4L12 12M12 4L4 12"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M2.5 5H13.5M2.5 8H13.5M2.5 11H13.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile / Drawer menu */}
        {menuOpen && (
          <div className="mt-2 p-4 rounded-[20px] bg-[#140905] border border-[#F7F2ED]/20 text-[#FBEFE6] flex flex-col gap-2.5">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="px-3 py-2 rounded-[10px] text-[15px] font-medium text-[#FBEFE6] hover:bg-[#2A180D] no-underline"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#start"
              onClick={handleLinkClick}
              className="mt-1 h-11 rounded-[10px] bg-[#E8500C] text-[#FBEFE6] font-semibold text-[15px] flex items-center justify-center no-underline"
            >
              Get my restaurant set up
            </a>
          </div>
        )}
      </div>
    </header>
  );
};
