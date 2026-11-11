import React, { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { useReducedMotion } from '../../lib/reducedMotion';

export const FlipSection: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  // Track full viewport height in pixels, ignoring resize events while a form field is focused (mobile keyboard)
  const [stageHeightPx, setStageHeightPx] = useState(() =>
    typeof window !== 'undefined' ? Math.max(560, window.innerHeight) : 844
  );

  useEffect(() => {
    const handleResize = () => {
      const activeTag = document.activeElement?.tagName;
      if (
        activeTag === 'INPUT' ||
        activeTag === 'TEXTAREA' ||
        activeTag === 'SELECT'
      ) {
        return;
      }
      setStageHeightPx(Math.max(560, window.innerHeight));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (reducedMotion || !trackRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: trackRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        onUpdate: (self) => {
          const activeTag = document.activeElement?.tagName;
          if (
            activeTag === 'INPUT' ||
            activeTag === 'TEXTAREA' ||
            activeTag === 'SELECT'
          ) {
            return;
          }
          setProgress(self.progress);
        },
      });
    }, trackRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section
        id="flip"
        className="py-28 px-6 bg-[#140905] text-[#FBEFE6]"
        data-testid="closing-flip-track"
      >
        <div className="max-w-[980px] mx-auto text-center">
          <p className="text-[36px] md:text-[68px] font-semibold leading-[1.04] tracking-[-0.04em] m-0">
            <span className="text-[#FBEFE6]/45">Stop running orders, </span>
            <span className="text-[#FBEFE6]">start running your restaurant.</span>
          </p>
        </div>
      </section>
    );
  }

  // Layer 2 (Orange #E8500C) hard-edge wipe from 8% to 52%
  const orangeTopPct = Math.max(
    0,
    Math.min(100, (1 - (progress - 0.08) / 0.44) * 100)
  );
  // Layer 3 (Dark #140905) hard-edge wipe from 52% to 90%
  const darkTopPct = Math.max(
    0,
    Math.min(100, (1 - (progress - 0.52) / 0.38) * 100)
  );

  // Line 1 ("Stop running orders,") starts sharp in ink, then blurs (0 -> 8px) and fades out
  const line1Blur = Math.min(8, Math.max(0, ((progress - 0.2) / 0.55) * 8));
  const line1OpacityOnCream = Math.max(0.15, 1 - Math.max(0, progress - 0.15) * 1.4);
  const line1OpacityOnOrange = Math.max(0.12, 0.75 - Math.max(0, progress - 0.25) * 1.1);
  const line1OpacityOnDark = Math.max(0, 0.45 - Math.max(0, progress - 0.55) * 1.3);

  // Line 2 ("start running your restaurant.") arrives as the orange wipe comes up and stays sharp
  const line2Opacity = Math.min(1, Math.max(0, (progress - 0.12) / 0.22));
  const line2Blur = Math.max(0, (1 - Math.min(1, (progress - 0.1) / 0.25)) * 4);

  const renderCopy = (
    firstColor: string,
    firstOpacity: number,
    secondColor: string,
    secondOpacity: number
  ) => (
    <div className="max-w-[980px] mx-auto px-6 text-center">
      <p className="text-[36px] sm:text-[52px] md:text-[72px] font-semibold leading-[1.04] tracking-[-0.04em] m-0 flex flex-col gap-2">
        <span
          style={{
            color: firstColor,
            filter: `blur(${line1Blur.toFixed(1)}px)`,
            opacity: firstOpacity,
          }}
        >
          Stop running orders,
        </span>
        <span
          style={{
            color: secondColor,
            filter: `blur(${line2Blur.toFixed(1)}px)`,
            opacity: secondOpacity,
          }}
        >
          start running your restaurant.
        </span>
      </p>
    </div>
  );

  return (
    <section
      id="flip"
      ref={trackRef}
      style={{ height: `${Math.round(stageHeightPx * 2.5)}px` }}
      className="relative w-full bg-[#F7F2ED]"
      data-testid="closing-flip-track"
    >
      <div
        style={{ height: `${stageHeightPx}px` }}
        className="sticky top-0 w-full overflow-hidden"
      >
        {/* Layer 1: Full-bleed Cream */}
        <div className="absolute inset-0 bg-[#F7F2ED] flex items-center justify-center">
          {renderCopy('#1A0C06', line1OpacityOnCream, '#1A0C06', line2Opacity * 0.25)}
        </div>

        {/* Layer 2: Full-bleed Orange hard-edged wipe */}
        <div
          className="absolute inset-0 bg-[#E8500C] flex items-center justify-center"
          style={{ clipPath: `inset(${orangeTopPct.toFixed(2)}% 0% 0% 0%)` }}
          aria-hidden="true"
        >
          {renderCopy('#FBEFE6', line1OpacityOnOrange, '#FBEFE6', line2Opacity)}
        </div>

        {/* Layer 3: Full-bleed Dark Espresso hard-edged wipe */}
        <div
          className="absolute inset-0 bg-[#140905] flex items-center justify-center"
          style={{ clipPath: `inset(${darkTopPct.toFixed(2)}% 0% 0% 0%)` }}
          aria-hidden="true"
        >
          {renderCopy('#FBEFE6', line1OpacityOnDark, '#FBEFE6', 1)}
        </div>
      </div>
    </section>
  );
};


