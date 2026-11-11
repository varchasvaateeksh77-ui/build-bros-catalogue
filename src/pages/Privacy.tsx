import React from 'react';
import { Button } from '../components/ui/Button';

interface PrivacyProps {
  onBack: () => void;
}

export const Privacy: React.FC<PrivacyProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#F7F2ED] text-[#1A0C06] pt-28 pb-20 px-[14px] md:px-6">
      <div className="max-w-[760px] mx-auto bg-[#FFFFFF] rounded-[24px] border border-[#E3D9D3] p-6 md:p-10">
        <div className="mb-6">
          <Button variant="dark" showArrow={false} onClick={onBack}>
            Back to Build Bros
          </Button>
        </div>
        <h1 className="text-[32px] md:text-[42px] font-semibold tracking-[-0.03em] m-0 mb-6">
          Privacy notice
        </h1>
        <div className="flex flex-col gap-4 text-[16px] leading-[1.6] text-[#6C625C]">
          <p className="m-0">
            <strong className="text-[#1A0C06]">What we collect:</strong> the
            details you type in the contact form (your name, restaurant name,
            city, number of tables, chosen level, phone number and optional
            message).
          </p>
          <p className="m-0">
            <strong className="text-[#1A0C06]">Why we collect it:</strong> only
            to reply to your inquiry and suggest the service level that fits your
            restaurant. We do not sell or rent your details.
          </p>
          <p className="m-0">
            <strong className="text-[#1A0C06]">Analytics:</strong> no third-party
            advertising trackers or cross-site cookies run on this page.
          </p>
          <p className="m-0">
            <strong className="text-[#1A0C06]">Deleting your details:</strong>{' '}
            email us at{' '}
            <a
              href="mailto:varchasvaateeksh77@gmail.com"
              className="text-[#C03E0A] font-semibold underline"
            >
              varchasvaateeksh77@gmail.com
            </a>{' '}
            or call +91 92035 66401 / 9425411807 at any time to remove your
            contact record and we will delete it promptly.
          </p>
        </div>
      </div>
    </div>
  );
};
