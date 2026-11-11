import React from 'react';
import faqData from '../../data/faq.json';
import { SectionLabel } from '../ui/Pill';
import { Accordion } from '../ui/Accordion';

export const Faq: React.FC = () => {
  return (
    <section id="faq" className="py-16 md:py-24 px-[14px] md:px-6 bg-[#F7F2ED]">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5">
          <SectionLabel text="Questions" />
          <h2
            className="text-[30px] md:text-[48px] font-semibold text-[#1A0C06] leading-[1.06] tracking-[-0.035em] m-0 mb-3"
            style={{ textWrap: 'balance' }}
          >
            Common questions.
          </h2>
          <p className="text-[16px] leading-[1.5] text-[#6C625C] m-0">
            Plain answers about how table ordering works on a real shift.
          </p>
        </div>

        <div className="lg:col-span-7">
          <Accordion items={faqData} />
        </div>
      </div>
    </section>
  );
};
