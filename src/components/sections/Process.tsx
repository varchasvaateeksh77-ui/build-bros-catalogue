import React, { useState } from 'react';
import processData from '../../data/process.json';
import { SectionLabel } from '../ui/Pill';
import { Tabs, TabOption } from '../ui/Tabs';

const SETUP_TABS: TabOption<number>[] = processData.map((step) => ({
  id: step.n,
  label: `${step.n}. ${step.tab}`,
}));

const DEVICE_CELLS = [
  {
    name: 'Guest phone',
    detail: 'Any phone browser. Guests scan the table code and the menu opens with no app download.',
    tag: 'All levels',
  },
  {
    name: 'Waiter phone or tablet',
    detail: 'Receives table call alerts with the table number when a guest taps the button under the cart.',
    tag: 'Level 2 and up',
  },
  {
    name: 'Reception or kitchen screen',
    detail: 'A tablet or computer at the counter or kitchen pass showing incoming tickets and cooking status.',
    tag: 'Level 3',
  },
  {
    name: 'Menu editor',
    detail: 'Your phone or laptop for updating dish prices, categories and availability.',
    tag: 'Owner tool',
  },
];

export const Process: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const current = processData.find((p) => p.n === activeStep) || processData[0];

  return (
    <section id="process" className="py-16 md:py-24 px-[14px] md:px-6 bg-[#F7F2ED]">
      <div className="max-w-[1200px] mx-auto">
        <div className="max-w-[680px] mb-10">
          <SectionLabel text="Setup" />
          <h2
            className="text-[30px] md:text-[48px] font-semibold text-[#1A0C06] leading-[1.06] tracking-[-0.035em] m-0"
            style={{ textWrap: 'balance' }}
          >
            How we set you up.
          </h2>
        </div>

        {/* White card with 5 interactive step tabs */}
        <div className="bg-[#FFFFFF] rounded-[24px] border border-[#E3D9D3] p-6 md:p-10 mb-8">
          <Tabs
            options={SETUP_TABS}
            activeId={activeStep}
            onChange={setActiveStep}
            ariaLabel="Five setup steps"
            variant="underline"
          />

          <div className="pt-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 flex flex-col gap-3">
              <span
                className="font-mono-code text-[13px] font-semibold text-[#C03E0A] tabular-nums"
                data-testid="process-step-indicator"
              >
                Step {current.n} of {processData.length}
              </span>
              <h3 className="text-[24px] md:text-[32px] font-semibold text-[#1A0C06] leading-[1.12] tracking-[-0.025em] m-0">
                {current.title}
              </h3>
              <p className="text-[16px] md:text-[18px] leading-[1.5] text-[#6C625C] m-0">
                {current.body}
              </p>
            </div>

            <div className="md:col-span-5 bg-[#F7F2ED] rounded-[18px] border border-[#E3D9D3] p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between text-[13px] font-mono-code text-[#6C625C]">
                <span>Build Bros rollout</span>
                <span className="text-[#1A0C06] font-semibold">{current.tab}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {processData.map((step) => (
                  <div
                    key={step.n}
                    className={`h-2 flex-1 rounded-full transition-colors ${
                      step.n <= current.n ? 'bg-[#E8500C]' : 'bg-[#E3D9D3]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bordered 2x2 device grid (no brand logos per structure.md section 2) */}
        <div className="bg-[#FFFFFF] rounded-[24px] border border-[#E3D9D3] overflow-hidden">
          <div className="px-6 md:px-8 py-5 border-b border-[#E3D9D3] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-[18px] md:text-[22px] font-semibold text-[#1A0C06] m-0">
              Works on the devices you already own.
            </h3>
            <span className="text-[13px] font-mono-code text-[#6C625C]">
              Browser-based · No custom hardware lock-in
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E3D9D3]">
            <div className="divide-y divide-[#E3D9D3]">
              {DEVICE_CELLS.slice(0, 2).map((cell) => (
                <div key={cell.name} className="p-6 md:p-8 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-[18px] font-semibold text-[#1A0C06] m-0">
                      {cell.name}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-[8px] bg-[#F3ECE5] text-[#6C625C] font-mono-code text-[12px]">
                      {cell.tag}
                    </span>
                  </div>
                  <p className="text-[15px] leading-[1.5] text-[#6C625C] m-0">
                    {cell.detail}
                  </p>
                </div>
              ))}
            </div>
            <div className="divide-y divide-[#E3D9D3] border-t md:border-t-0 border-[#E3D9D3]">
              {DEVICE_CELLS.slice(2, 4).map((cell) => (
                <div key={cell.name} className="p-6 md:p-8 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-[18px] font-semibold text-[#1A0C06] m-0">
                      {cell.name}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-[8px] bg-[#F3ECE5] text-[#6C625C] font-mono-code text-[12px]">
                      {cell.tag}
                    </span>
                  </div>
                  <p className="text-[15px] leading-[1.5] text-[#6C625C] m-0">
                    {cell.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
