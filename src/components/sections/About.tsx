import React from 'react';
import { SectionLabel } from '../ui/Pill';

export const About: React.FC = () => {
  const facts = [
    'More than 2.5 years in tech and web development.',
    'Menus, table ordering, reception screens and kitchen screens.',
    'Fewer steps from table to kitchen, and no menu reprints because you change a price in a minute.',
  ];

  return (
    <section id="about" className="py-16 md:py-24 px-[14px] md:px-6 bg-[#F7F2ED]">
      <div className="max-w-[1200px] mx-auto">
        <div className="max-w-[720px]">
          <SectionLabel text="About" />
          <h2
            className="text-[30px] md:text-[48px] font-semibold text-[#1A0C06] leading-[1.06] tracking-[-0.035em] m-0 mb-5"
            style={{ textWrap: 'balance' }}
          >
            We build the ordering system that runs your floor.
          </h2>
          <p className="text-[16px] md:text-[18px] leading-[1.55] text-[#6C625C] m-0 mb-8">
            Build Bros is a small team that builds digital ordering for local cafes
            and restaurants. We have worked in tech and web development for more
            than two and a half years. Now we bring that to the place where it
            saves the most time: your tables, your counter and your kitchen.
          </p>

          {/* Quiet plain lines, not cards and no tick marks */}
          <div className="border-t border-[#E3D9D3] divide-y divide-[#E3D9D3]">
            {facts.map((fact, idx) => (
              <div
                key={idx}
                className="py-4 flex items-baseline gap-4 text-[15px] md:text-[17px] text-[#1A0C06] font-medium"
              >
                <span className="font-mono-code text-[12px] text-[#C03E0A] font-semibold tabular-nums shrink-0">
                  0{idx + 1}
                </span>
                <span>{fact}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
