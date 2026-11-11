import React from 'react';
import { Button } from '../ui/Button';

interface OwnerProps {
  /** Hidden by default until the owner confirms a menu editor exists per structure.md section 1 & 2 */
  enabled?: boolean;
}

export const Owner: React.FC<OwnerProps> = ({ enabled = false }) => {
  if (!enabled) return null;

  return (
    <section id="owner" className="py-12 md:py-16 px-[14px] md:px-6 bg-[#F7F2ED]">
      <div className="max-w-[1200px] mx-auto">
        <div
          className="rounded-[24px] p-8 md:p-12 text-[#FBEFE6] border border-[#F7F2ED]/15 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          style={{
            background: 'linear-gradient(135deg, #140905 60%, #5C1C07 100%)',
          }}
        >
          <div className="lg:col-span-7 flex flex-col gap-4 items-start">
            <span className="text-[13px] font-semibold text-[#FF8741]">
              Owner view
            </span>
            <h2 className="text-[28px] md:text-[40px] font-semibold leading-[1.08] tracking-[-0.03em] m-0">
              Your menu, in your hands.
            </h2>
            <p className="text-[16px] md:text-[18px] text-[#FBEFE6]/80 leading-[1.5] m-0 max-w-[520px]">
              Change a price, hide a sold-out dish or add a photo, and every table
              updates within a minute.
            </p>
            <Button variant="accent" href="#demo">
              See it in the demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
