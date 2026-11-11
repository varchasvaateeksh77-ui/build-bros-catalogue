import React, { useEffect, useRef, useState } from 'react';
import changeData from '../../data/change.json';
import { SectionLabel } from '../ui/Pill';
import { Floor3DController } from '../../three/Floor3D';
import { ChangeStageMode, getChangeStageFloorState } from '../../three/floorStates';
import { Floor2D } from '../../svg/Floor2D';
import { hasWebGLSupport, isLowPowerDevice } from '../../lib/lowPower';
import { useReducedMotion } from '../../lib/reducedMotion';
import { ScrollTrigger } from '../../lib/gsap';
import { soundFX } from '../../lib/soundEffects';

const STAGE_BADGE_MAP: Record<ChangeStageMode, string> = {
  paper: 'Full floor · Paper menus',
  menu: 'Zoomed in · Table 5 QR & Digital menu',
  waiter: 'Waiter called · Walking to Table 5',
  order: 'Direct order · Table 5 → Kitchen pass',
};

function computeStepWithHysteresis(
  progress: number,
  currentStep: number,
  totalSteps: number
): number {
  const scaled = progress * totalSteps;
  const rawStep = Math.min(totalSteps - 1, Math.max(0, Math.floor(scaled)));
  if (rawStep === currentStep) return currentStep;
  // Require crossing the boundary by at least 0.08 of a step (deadzone) to prevent tap/scroll jitter
  const boundary = rawStep > currentStep ? currentStep + 1 : currentStep;
  const distFromBoundary = Math.abs(scaled - boundary);
  if (distFromBoundary < 0.08) {
    return currentStep;
  }
  return rawStep;
}

export const Change: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);
  const [stepProgress, setStepProgress] = useState(0.5);
  const [overallProgress, setOverallProgress] = useState(0);
  const [nearViewport, setNearViewport] = useState(false);
  const [use2D, setUse2D] = useState<boolean>(() => !hasWebGLSupport() || isLowPowerDevice());

  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<Floor3DController | null>(null);
  const stepIndexRef = useRef(0);
  const programmaticScrollUntilRef = useRef(0);

  const currentStep = changeData[stepIndex] || changeData[0];
  const currentMode = currentStep.floorState as ChangeStageMode;
  const floorState = getChangeStageFloorState(currentMode, stepProgress);

  // Lazy-create the second WebGL context only when near viewport (budget: max 2 contexts alive)
  useEffect(() => {
    if (!stageRef.current || !('IntersectionObserver' in window)) {
      setNearViewport(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setNearViewport(entry.isIntersecting);
      },
      { rootMargin: '350px 0px' }
    );
    obs.observe(stageRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || use2D || !nearViewport || !canvasMountRef.current) {
      controllerRef.current?.dispose();
      controllerRef.current = null;
      return;
    }
    const ctrl = new Floor3DController(canvasMountRef.current);
    controllerRef.current = ctrl;
    ctrl.applyState(floorState);

    const onResize = () => ctrl.resize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      ctrl.dispose();
      controllerRef.current = null;
    };
  }, [nearViewport, reducedMotion, use2D]);

  useEffect(() => {
    controllerRef.current?.applyState(floorState);
  }, [stepIndex, stepProgress]);

  // Controlled, 1:1 scroll animation with hysteresis deadzone and fixed-pixel track
  useEffect(() => {
    if (reducedMotion || !trackRef.current) return;
    const total = changeData.length;

    const trigger = ScrollTrigger.create({
      trigger: trackRef.current,
      start: 'top top+=76',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        // Never react if user is typing in a form input or during programmatic tab scroll
        const activeTag = document.activeElement?.tagName;
        if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') {
          return;
        }
        const p = Math.max(0, Math.min(1, self.progress));
        setOverallProgress(p);

        if (performance.now() < programmaticScrollUntilRef.current) {
          return;
        }

        const nextIdx = computeStepWithHysteresis(p, stepIndexRef.current, total);
        const localProg = Math.max(0, Math.min(1, p * total - nextIdx));
        setStepProgress(localProg);

        if (nextIdx !== stepIndexRef.current) {
          stepIndexRef.current = nextIdx;
          setStepIndex(nextIdx);
        }
      },
    });
    return () => trigger.kill();
  }, [reducedMotion]);

  const handleSelectStep = (idx: number, scrollTrack = true) => {
    const clamped = Math.max(0, Math.min(changeData.length - 1, idx));
    soundFX.play('tap');
    stepIndexRef.current = clamped;
    setStepIndex(clamped);
    setStepProgress(0.5);
    setOverallProgress((clamped + 0.45) / changeData.length);

    if (scrollTrack && trackRef.current && typeof window !== 'undefined') {
      const rect = trackRef.current.getBoundingClientRect();
      const trackTopDoc = window.scrollY + rect.top - 76;
      const scrollableDistance = Math.max(100, trackRef.current.offsetHeight - window.innerHeight);
      const targetProgress = (clamped + 0.35) / changeData.length;
      const targetY = trackTopDoc + targetProgress * scrollableDistance;
      // Only scroll if track is currently in view so we keep the sticky card pinned cleanly
      if (rect.top <= 160 && rect.bottom >= 260) {
        programmaticScrollUntilRef.current = performance.now() + 600;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleSelectStep(stepIndex + 1, false);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleSelectStep(stepIndex - 1, false);
    }
  };

  return (
    <section id="change" className="py-16 md:py-24 px-[14px] md:px-6 bg-[#F7F2ED]">
      <div className="max-w-[1200px] mx-auto">
        <div className="max-w-[680px] mb-10">
          <SectionLabel text="Before and after" />
          <h2
            className="text-[30px] md:text-[48px] font-semibold text-[#1A0C06] leading-[1.06] tracking-[-0.035em] m-0"
            style={{ textWrap: 'balance' }}
          >
            From paper menus to a connected floor.
          </h2>
        </div>

        {reducedMotion ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {changeData.map((st) => {
              const stFloor = getChangeStageFloorState(st.floorState as ChangeStageMode);
              return (
                <div
                  key={st.n}
                  className="bg-[#FFFFFF] rounded-[24px] border border-[#E3D9D3] p-5 flex flex-col gap-4"
                >
                  <div className="h-[240px] rounded-[16px] overflow-hidden">
                    <Floor2D state={stFloor} />
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-[#1A0C06] text-[#FBEFE6] text-[12px] font-semibold mb-2">
                      {st.pill}
                    </span>
                    <h3 className="text-[20px] font-semibold text-[#1A0C06] m-0 mb-1">
                      {st.title}
                    </h3>
                    <p className="text-[15px] text-[#6C625C] m-0">{st.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            ref={trackRef}
            className="relative h-[2050px] md:h-[2200px]"
            data-testid="change-stage-track"
          >
            <div
              ref={stageRef}
              onKeyDown={handleKeyDown}
              className="sticky top-16 md:top-20 bg-[#FFFFFF] rounded-[24px] border border-[#E3D9D3] p-4 sm:p-5 md:p-8 flex flex-col gap-4"
            >
              {/* Top row: Step selector buttons + Stage status badge + 2D/3D toggle */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div
                  role="tablist"
                  aria-label="Before and after floor stages"
                  className="flex flex-wrap items-center gap-1.5 sm:gap-2"
                >
                  {changeData.map((st, idx) => {
                    const active = idx === stepIndex;
                    return (
                      <button
                        key={st.n}
                        role="tab"
                        type="button"
                        aria-selected={active}
                        onClick={() => handleSelectStep(idx)}
                        className={`px-3 sm:px-3.5 py-1.5 rounded-full text-[12px] sm:text-[13px] font-semibold transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#1A0C06] text-[#FBEFE6]'
                            : 'bg-[#F3ECE5] text-[#6C625C] hover:text-[#1A0C06]'
                        }`}
                      >
                        {st.pill}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-[8px] bg-[#FFEEE3] text-[#C03E0A] font-mono-code text-[11px] font-semibold">
                    {STAGE_BADGE_MAP[currentMode]}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.play('tap');
                      setUse2D((v) => !v);
                    }}
                    className="px-2.5 py-1 rounded-[8px] bg-[#F3ECE5] hover:bg-[#E3D9D3] text-[#1A0C06] font-mono-code text-[11px] font-semibold cursor-pointer transition-colors"
                  >
                    {use2D ? '3D view' : '2D plan'}
                  </button>
                </div>
              </div>

              {/* 4-segment visual scroll progress bar so scroll feel is tactile and predictable */}
              <div
                className="grid grid-cols-4 gap-1.5 w-full"
                aria-hidden="true"
              >
                {changeData.map((st, idx) => {
                  const total = changeData.length;
                  const segFill = Math.max(
                    0,
                    Math.min(100, (overallProgress * total - idx) * 100)
                  );
                  return (
                    <div
                      key={st.n}
                      className="h-1.5 rounded-full bg-[#F3ECE5] overflow-hidden"
                    >
                      <div
                        className="h-full bg-[#E8500C] transition-all duration-75"
                        style={{ width: `${idx === stepIndex ? Math.max(20, segFill) : idx < stepIndex ? 100 : 0}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Floor frame */}
              <div className="relative w-full h-[320px] sm:h-[360px] md:h-[430px] rounded-[20px] bg-[#140905] overflow-hidden">
                {use2D || !nearViewport ? (
                  <Floor2D state={floorState} />
                ) : (
                  <div ref={canvasMountRef} className="w-full h-full" />
                )}
              </div>

              {/* Active step title, caption, and explicit Prev / Next buttons */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pt-1">
                <div>
                  <span
                    className="inline-block px-3 py-1 rounded-full bg-[#FFEEE3] text-[#C03E0A] text-[12px] font-semibold mb-1.5"
                    data-testid="change-active-pill"
                  >
                    {currentStep.pill}
                  </span>
                  <h3
                    className="text-[21px] md:text-[28px] font-semibold text-[#1A0C06] leading-[1.12] tracking-[-0.02em] m-0 mb-1"
                    data-testid="change-active-title"
                  >
                    {currentStep.title}
                  </h3>
                  <p className="text-[14px] md:text-[16px] text-[#6C625C] m-0 max-w-[60ch]">
                    {currentStep.body}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={stepIndex === 0}
                    onClick={() => handleSelectStep(stepIndex - 1)}
                    className={`h-9 px-3.5 rounded-[10px] text-[13px] font-semibold transition-colors ${
                      stepIndex === 0
                        ? 'bg-[#F3ECE5] text-[#6C625C]/45 cursor-not-allowed'
                        : 'bg-[#F3ECE5] text-[#1A0C06] hover:bg-[#E3D9D3] cursor-pointer'
                    }`}
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    disabled={stepIndex === changeData.length - 1}
                    onClick={() => handleSelectStep(stepIndex + 1)}
                    className={`h-9 px-3.5 rounded-[10px] text-[13px] font-semibold transition-colors ${
                      stepIndex === changeData.length - 1
                        ? 'bg-[#F3ECE5] text-[#6C625C]/45 cursor-not-allowed'
                        : 'bg-[#E8500C] text-[#FBEFE6] hover:bg-[#C03E0A] cursor-pointer'
                    }`}
                  >
                    Next step →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
