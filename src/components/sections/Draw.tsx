import React, { useEffect, useRef, useState } from 'react';
import drawData from '../../data/draw.json';
import { SectionLabel } from '../ui/Pill';
import { Button } from '../ui/Button';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { useReducedMotion } from '../../lib/reducedMotion';

const SCALE_BY_DISTANCE = [1, 0.92, 0.85, 0.78, 0.68, 0.55];
const OPACITY_BY_DISTANCE = [1, 0.65, 0.5, 0.38, 0.26, 0.15];

const LEVEL_SUMMARIES = [
  {
    level: 1,
    name: 'Level 1, Digital menu',
    guest: 'Scan, browse, decide. No app, no account.',
    staff:
      'Your team still takes orders the way it does today, without carrying or explaining menus. You change a price or hide a sold-out dish online and nothing gets reprinted.',
    cta: 'Ask about Level 1',
  },
  {
    level: 2,
    name: 'Level 2, Menu and waiter call',
    guest: 'Pick at their own pace into a cart, then call a waiter with one tap.',
    staff:
      'The waiter is notified with the table number, knows exactly which table needs them, comes over and takes the order.',
    cta: 'Ask about Level 2',
  },
  {
    level: 3,
    name: 'Level 3, Full ordering',
    guest: 'Order from the phone when ready and see when it is coming.',
    staff:
      'No trips to take orders. Reception or the kitchen gets each order with its table number, prepares it, and it is served.',
    cta: 'Ask about Level 3',
  },
];

/**
 * Hysteresis helper for the 12-item wheel so tiny scroll fluctuations near item
 * boundaries never flip-flop between rows.
 */
function computeWheelIndexWithHysteresis(
  progress: number,
  currentIndex: number,
  total: number
): number {
  const clamped = Math.max(0, Math.min(0.9999, progress));
  const scaled = clamped * total;
  const candidate = Math.min(total - 1, Math.floor(scaled));
  if (candidate === currentIndex) return currentIndex;

  const deadzone = 0.12;
  if (candidate > currentIndex) {
    const threshold = currentIndex + 1 + deadzone;
    if (scaled < threshold && candidate === currentIndex + 1) {
      return currentIndex;
    }
  } else if (candidate < currentIndex) {
    const threshold = currentIndex - deadzone;
    if (scaled > threshold && candidate === currentIndex - 1) {
      return currentIndex;
    }
  }
  return candidate;
}

export const Draw: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [wheelProgress, setWheelProgress] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const isProgrammaticScrollRef = useRef(false);
  const programmaticTimerRef = useRef<number | null>(null);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (reducedMotion || !trackRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: trackRef.current,
        start: 'top top+=84',
        end: 'bottom bottom-=84',
        scrub: true,
        onUpdate: (self) => {
          const activeTag = document.activeElement?.tagName;
          if (
            activeTag === 'INPUT' ||
            activeTag === 'TEXTAREA' ||
            activeTag === 'SELECT'
          ) {
            return;
          }
          setWheelProgress(self.progress);
          if (isProgrammaticScrollRef.current) return;

          const nextIdx = computeWheelIndexWithHysteresis(
            self.progress,
            activeIndexRef.current,
            drawData.length
          );
          if (nextIdx !== activeIndexRef.current) {
            activeIndexRef.current = nextIdx;
            setActiveIndex(nextIdx);
          }
        },
      });
    }, trackRef);

    return () => {
      if (programmaticTimerRef.current !== null) {
        window.clearTimeout(programmaticTimerRef.current);
      }
      ctx.revert();
    };
  }, [reducedMotion]);

  const selectWheelIndex = (idx: number) => {
    const bounded = Math.max(0, Math.min(drawData.length - 1, idx));
    activeIndexRef.current = bounded;
    setActiveIndex(bounded);
    const targetProgress = (bounded + 0.5) / drawData.length;
    setWheelProgress(targetProgress);

    if (reducedMotion || !trackRef.current) return;

    const track = trackRef.current;
    const rect = track.getBoundingClientRect();
    const trackTop = window.scrollY + rect.top - 84;
    const scrollableDistance = Math.max(
      1,
      track.offsetHeight - window.innerHeight + 168
    );

    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const targetScrollY = trackTop + targetProgress * scrollableDistance;
      isProgrammaticScrollRef.current = true;
      if (programmaticTimerRef.current !== null) {
        window.clearTimeout(programmaticTimerRef.current);
      }
      window.scrollTo({
        top: Math.max(0, targetScrollY),
        behavior: 'smooth',
      });
      programmaticTimerRef.current = window.setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 550);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      selectWheelIndex(activeIndex + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      selectWheelIndex(activeIndex - 1);
    }
  };

  const activeItem = drawData[activeIndex] || drawData[0];

  return (
    <section id="draw" className="bg-[#F7F2ED] px-[14px] md:px-6 py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto">
        <div className="max-w-[680px] mb-10">
          <SectionLabel text="What you get" />
          <h2
            className="text-[30px] md:text-[48px] font-semibold text-[#1A0C06] leading-[1.06] tracking-[-0.035em] m-0 mb-4"
            style={{ textWrap: 'balance' }}
          >
            Twelve things your floor gets. Three levels.
          </h2>
          <p className="text-[16px] md:text-[18px] leading-[1.5] text-[#6C625C] m-0">
            Each level includes the one before it. Scroll through the wheel or tap
            any line to inspect each capability.
          </p>
        </div>

        {/* Scroll-driven Capability Wheel (fixed pixel track so mobile keyboard resize never shifts scroll) */}
        {reducedMotion ? (
          <div className="bg-[#FFFFFF] rounded-[24px] border border-[#E3D9D3] p-6 mb-14">
            <ol className="list-none p-0 m-0 divide-y divide-[#E3D9D3]">
              {drawData.map((row) => (
                <li
                  key={row.n}
                  className="py-3.5 flex items-center justify-between gap-4"
                >
                  <span className="text-[18px] font-semibold text-[#1A0C06]">
                    {row.text}
                  </span>
                  <span className="text-[13px] font-mono-code font-semibold text-[#C03E0A] shrink-0">
                    Level {row.level}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <div
            ref={trackRef}
            className="relative h-[1950px] md:h-[2100px] mb-16"
            data-testid="draw-wheel-track"
          >
            <div
              tabIndex={0}
              role="region"
              aria-label="Twelve floor capabilities wheel. Scroll or use Up and Down arrow keys to step."
              onKeyDown={handleKeyDown}
              className="sticky top-16 md:top-20 bg-[#FFFFFF] rounded-[24px] border border-[#E3D9D3] p-5 md:p-10 min-h-[540px] flex flex-col justify-between overflow-hidden focus:outline-2 focus:outline-[#E8500C]"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-[#6C625C] pb-3">
                  <span>Scroll or tap to step through all 12 capabilities</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={activeIndex === 0}
                      onClick={() => selectWheelIndex(activeIndex - 1)}
                      className={`px-3 py-1 rounded-[8px] font-mono-code text-[12px] font-semibold ${
                        activeIndex === 0
                          ? 'bg-[#F3ECE5] text-[#6C625C]/45 cursor-not-allowed'
                          : 'bg-[#F3ECE5] text-[#1A0C06] hover:bg-[#E3D9D3] cursor-pointer'
                      }`}
                    >
                      ← Prev
                    </button>
                    <button
                      type="button"
                      disabled={activeIndex === drawData.length - 1}
                      onClick={() => selectWheelIndex(activeIndex + 1)}
                      className={`px-3 py-1 rounded-[8px] font-mono-code text-[12px] font-semibold ${
                        activeIndex === drawData.length - 1
                          ? 'bg-[#F3ECE5] text-[#6C625C]/45 cursor-not-allowed'
                          : 'bg-[#E8500C] text-[#FBEFE6] hover:bg-[#C03E0A] cursor-pointer'
                      }`}
                    >
                      Next →
                    </button>
                  </div>
                </div>
                {/* Continuous scroll progress bar */}
                <div
                  className="h-1.5 w-full rounded-full bg-[#F3ECE5] overflow-hidden"
                  aria-hidden="true"
                >
                  <div
                    className="h-full bg-[#E8500C] transition-[width] duration-75"
                    style={{
                      width: `${Math.min(100, Math.max(4, wheelProgress * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Wheel list with centre orange highlight band */}
              <div className="relative my-3 py-2 flex flex-col items-center justify-center">
                <ul className="list-none p-0 m-0 w-full flex flex-col items-center gap-1.5">
                  {drawData.map((row, idx) => {
                    const dist = Math.min(5, Math.abs(idx - activeIndex));
                    const isCenter = idx === activeIndex;
                    const scale = SCALE_BY_DISTANCE[dist] ?? 0.55;
                    const opacity = OPACITY_BY_DISTANCE[dist] ?? 0.15;

                    return (
                      <li
                        key={row.n}
                        aria-current={isCenter ? 'true' : undefined}
                        className={`w-full text-center transition-all duration-150 ${
                          isCenter
                            ? 'py-2.5 my-1 bg-[#FFEEE3]/75 border-y border-[#E3D9D3]'
                            : 'py-0.5'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => selectWheelIndex(idx)}
                          style={{
                            transform: `scale(${scale})`,
                            opacity,
                            fontVariationSettings: `'wdth' ${row.axes.wdth}, 'slnt' ${row.axes.slnt}, 'wght' ${row.axes.wght}`,
                          }}
                          className={`bg-transparent border-0 p-0 cursor-pointer transition-colors duration-150 ${
                            isCenter
                              ? 'text-[22px] sm:text-[28px] md:text-[36px] text-[#E8500C] font-bold'
                              : 'text-[16px] sm:text-[20px] md:text-[24px] text-[#6C625C] hover:text-[#1A0C06]'
                          }`}
                        >
                          {row.text}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Bottom counter left + level caption right */}
              <div className="flex items-center justify-between pt-4 border-t border-[#E3D9D3]">
                <div
                  className="font-mono-code text-[15px] md:text-[17px] font-semibold tabular-nums"
                  data-testid="draw-wheel-counter"
                >
                  <span className="text-[#E8500C]">{activeItem.n}</span>{' '}
                  <span className="text-[#6C625C]">of {drawData.length}</span>
                </div>
                <div
                  className="text-[15px] md:text-[17px] font-semibold text-[#1A0C06]"
                  data-testid="draw-wheel-caption"
                >
                  Level {activeItem.level}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Three levels summary block underneath the wheel */}
        <div className="bg-[#FFFFFF] rounded-[24px] border border-[#E3D9D3] p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E3D9D3]">
            <div>
              <h3 className="text-[22px] md:text-[32px] font-semibold text-[#1A0C06] leading-[1.12] tracking-[-0.025em] m-0 mb-2">
                Your restaurant picks the level that fits.
              </h3>
              <p className="text-[15px] md:text-[16px] text-[#6C625C] m-0">
                Start where it fits. Each level includes the one before it. We send
                a clear quote.
              </p>
            </div>
            <Button variant="dark" href="#start">
              Ask which level fits
            </Button>
          </div>

          <div className="divide-y divide-[#E3D9D3]">
            {LEVEL_SUMMARIES.map((item) => (
              <div
                key={item.level}
                className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start"
              >
                <div className="lg:col-span-4">
                  <span className="text-[13px] font-semibold text-[#C03E0A] block mb-1">
                    Level {item.level}
                  </span>
                  <h4 className="text-[20px] font-semibold text-[#1A0C06] m-0">
                    {item.name}
                  </h4>
                </div>
                <div className="lg:col-span-6 flex flex-col gap-2 text-[15px] leading-[1.5] text-[#6C625C]">
                  <div>
                    <strong className="text-[#1A0C06]">For guests:</strong>{' '}
                    {item.guest}
                  </div>
                  <div>
                    <strong className="text-[#1A0C06]">For staff:</strong>{' '}
                    {item.staff}
                  </div>
                </div>
                <div className="lg:col-span-2 lg:text-right">
                  <a
                    href="#start"
                    className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#C03E0A] hover:text-[#1A0C06] no-underline"
                  >
                    <span>{item.cta}</span>
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E3D9D3] text-[14px] text-[#6C625C]">
            Not sure which level fits? Tell us how many tables you have and how
            many people work a busy shift. We will suggest one.
          </div>
        </div>
      </div>
    </section>
  );
};
