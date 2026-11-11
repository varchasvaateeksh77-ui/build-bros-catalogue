import React from 'react';
import { Button } from '../components/ui/Button';

interface TermsProps {
  onBack: () => void;
}

export const Terms: React.FC<TermsProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#F7F2ED] text-[#1A0C06] pt-28 pb-20 px-[14px] md:px-6">
      <div className="max-w-[760px] mx-auto bg-[#FFFFFF] rounded-[24px] border border-[#E3D9D3] p-6 md:p-10">
        <div className="mb-6">
          <Button variant="dark" showArrow={false} onClick={onBack}>
            Back to Build Bros
          </Button>
        </div>
        <h1 className="text-[32px] md:text-[42px] font-semibold tracking-[-0.03em] m-0 mb-6">
          Terms of use
        </h1>
        <div className="flex flex-col gap-4 text-[16px] leading-[1.6] text-[#6C625C]">
          <p className="m-0">
            This site introduces Build Bros services. It is not a binding offer on
            its own. Project quotes and service agreements are given separately
            after we review your restaurant.
          </p>
          <p className="m-0">
            The interactive floor and menu demo on this page use sample data
            labelled Demo. Nothing entered inside the demo is a real restaurant
            order.
          </p>
          <p className="m-0">
            Industry figures, if shown, come from the sources named and are not
            guarantees of future revenue.
          </p>
          <p className="m-0">
            Client work appears on this site only with the client&apos;s
            permission.
          </p>
          <p className="m-0">
            <strong className="text-[#1A0C06]">Contact:</strong>{' '}
            varchasvaateeksh77@gmail.com · +91 92035 66401 · 9425411807
          </p>
        </div>
      </div>
    </div>
  );
};
