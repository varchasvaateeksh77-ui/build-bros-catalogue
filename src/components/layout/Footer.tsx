import React from 'react';
import clientsData from '../../data/clients.json';
import contactData from '../../data/contact.json';

interface FooterProps {
  onNavigatePage: (page: 'home' | 'terms' | 'privacy') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigatePage }) => {
  const hasClients = Array.isArray(clientsData) && clientsData.length > 0;

  return (
    <footer className="bg-[#140905] text-[#FBEFE6] border-t border-[#F7F2ED]/12 pt-12 pb-12 px-[14px] md:px-6">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="inline-flex items-center gap-2.5 text-[18px] font-semibold">
              <span
                aria-hidden="true"
                className="w-6 h-6 rounded-[6px] bg-[#E8500C] flex items-center justify-center text-[#FBEFE6] font-mono-code text-[12px] font-bold"
              >
                BB
              </span>
              <span>Build Bros</span>
            </div>
            <p className="text-[15px] text-[#FBEFE6]/75 max-w-[360px] m-0 leading-[1.5]">
              Ordering systems for cafes and restaurants.
            </p>
          </div>

          {/* Product column */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[13px] font-semibold text-[#FF8741] uppercase tracking-wider m-0">
              Product
            </h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-2 text-[14px]">
              <li>
                <a
                  href="#draw"
                  onClick={() => onNavigatePage('home')}
                  className="text-[#FBEFE6]/80 hover:text-[#FFFFFF] no-underline"
                >
                  Levels
                </a>
              </li>
              <li>
                <a
                  href="#how"
                  onClick={() => onNavigatePage('home')}
                  className="text-[#FBEFE6]/80 hover:text-[#FFFFFF] no-underline"
                >
                  How it works
                </a>
              </li>
              <li>
                <a
                  href="#demo"
                  onClick={() => onNavigatePage('home')}
                  className="text-[#FBEFE6]/80 hover:text-[#FFFFFF] no-underline"
                >
                  Try it
                </a>
              </li>
              {hasClients && (
                <li>
                  <a
                    href="#work"
                    onClick={() => onNavigatePage('home')}
                    className="text-[#FBEFE6]/80 hover:text-[#FFFFFF] no-underline"
                  >
                    Work
                  </a>
                </li>
              )}
              <li>
                <a
                  href="#process"
                  onClick={() => onNavigatePage('home')}
                  className="text-[#FBEFE6]/80 hover:text-[#FFFFFF] no-underline"
                >
                  Process
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  onClick={() => onNavigatePage('home')}
                  className="text-[#FBEFE6]/80 hover:text-[#FFFFFF] no-underline"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Legal column */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-[13px] font-semibold text-[#FF8741] uppercase tracking-wider m-0">
                Contact
              </h3>
              {contactData.phones.map((p) => (
                <a
                  key={p.raw}
                  href={`tel:${p.raw}`}
                  className="text-[14px] font-mono-code text-[#FBEFE6]/85 hover:text-[#FFFFFF] no-underline"
                >
                  {p.display}
                </a>
              ))}
              <a
                href={`mailto:${contactData.email}`}
                className="text-[13px] font-mono-code text-[#FBEFE6]/85 hover:text-[#FFFFFF] break-all no-underline"
              >
                {contactData.email}
              </a>
              <a
                href="#start"
                onClick={() => onNavigatePage('home')}
                className="text-[14px] text-[#FBEFE6]/80 hover:text-[#FFFFFF] underline pt-1"
              >
                Send restaurant details
              </a>
            </div>

            <div className="flex flex-col gap-2.5">
              <h3 className="text-[13px] font-semibold text-[#FF8741] uppercase tracking-wider m-0">
                Legal
              </h3>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    onNavigatePage('terms');
                    window.scrollTo({ top: 0, behavior: 'auto' });
                  }}
                  className="text-[14px] text-[#FBEFE6]/80 hover:text-[#FFFFFF] bg-transparent border-0 p-0 cursor-pointer underline"
                >
                  Terms
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigatePage('privacy');
                    window.scrollTo({ top: 0, behavior: 'auto' });
                  }}
                  className="text-[14px] text-[#FBEFE6]/80 hover:text-[#FFFFFF] bg-transparent border-0 p-0 cursor-pointer underline"
                >
                  Privacy
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#F7F2ED]/12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[13px] text-[#FBEFE6]/60">
          <span>2026 Build Bros.</span>
          <span>Table ordering, reception and kitchen screens.</span>
        </div>
      </div>
    </footer>
  );
};
