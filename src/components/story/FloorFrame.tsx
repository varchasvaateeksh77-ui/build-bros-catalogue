import React, { useEffect, useRef, useState } from 'react';
import { Floor3DController } from '../../three/Floor3D';
import { FloorSceneState, STORY_TOTAL_DURATION, getStoryStateAtTime } from '../../three/floorStates';
import { Floor2D } from '../../svg/Floor2D';
import { hasWebGLSupport, isLowPowerDevice } from '../../lib/lowPower';
import { useReducedMotion } from '../../lib/reducedMotion';
import { soundFX, useSoundEffects, SoundCue } from '../../lib/soundEffects';
import { StoryTimeline } from './StoryTimeline';
import { Captions } from './Captions';
import { PhoneWindow } from '../windows/PhoneWindow';
import { ReceptionWindow } from '../windows/ReceptionWindow';
import { KitchenWindow } from '../windows/KitchenWindow';
import { VENUE_MENUS } from '../windows/demoStore';
import { Button } from '../ui/Button';

interface FloorFrameProps {
  selectedTabLevel: 1 | 2 | 3;
  onTabFollowStory: (level: 1 | 2 | 3) => void;
  userSelectedTabTick: number;
}

const SCENE_SOUND_MAP: Partial<Record<number, SoundCue>> = {
  3: 'scan',
  4: 'tap',
  5: 'cartAdd',
  6: 'waiterCall',
  7: 'served',
  8: 'ticketSent',
  9: 'kitchenReady',
  10: 'served',
};

export const FloorFrame: React.FC<FloorFrameProps> = ({
  selectedTabLevel,
  onTabFollowStory,
  userSelectedTabTick,
}) => {
  const reducedMotion = useReducedMotion();
  const { soundEnabled, toggleSound } = useSoundEffects();
  const [use2D, setUse2D] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') return false;
    return !hasWebGLSupport() || isLowPowerDevice();
  });

  const [floorState, setFloorState] = useState<FloorSceneState>(() =>
    getStoryStateAtTime(reducedMotion ? STORY_TOTAL_DURATION : 0)
  );
  const [showSkip, setShowSkip] = useState(false);

  const frameWrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<Floor3DController | null>(null);
  const timelineRef = useRef<StoryTimeline | null>(null);
  const prevSceneRef = useRef<number>(1);
  const onTabFollowRef = useRef(onTabFollowStory);
  onTabFollowRef.current = onTabFollowStory;

  // Mount timeline
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const startAtEnd = reducedMotion || params.get('autostart') === '1';

    const tl = new StoryTimeline(
      {
        onUpdate: (st) => {
          setFloorState(st);
          controllerRef.current?.applyState(st);
          if (st.sceneIndex !== prevSceneRef.current) {
            prevSceneRef.current = st.sceneIndex;
            const cue = SCENE_SOUND_MAP[st.sceneIndex];
            if (cue) {
              soundFX.play(cue);
            }
          }
          if (st.activeLevel === 1 || st.activeLevel === 2 || st.activeLevel === 3) {
            onTabFollowRef.current(st.activeLevel);
          }
        },
      },
      startAtEnd
    );
    timelineRef.current = tl;

    if (!startAtEnd) {
      tl.start();
    }

    const skipTimer = window.setTimeout(() => setShowSkip(true), 1000);

    const onVisChange = () => {
      if (document.hidden) {
        tl.pause();
        controllerRef.current?.setPaused(true);
      } else if (!reducedMotion) {
        controllerRef.current?.setPaused(false);
        tl.start();
      }
    };
    document.addEventListener('visibilitychange', onVisChange);

    return () => {
      window.clearTimeout(skipTimer);
      document.removeEventListener('visibilitychange', onVisChange);
      tl.destroy();
    };
  }, [reducedMotion]);

  // Respond when user explicitly clicks a level tab in Hero
  useEffect(() => {
    if (userSelectedTabTick === 0) return;
    timelineRef.current?.jumpToLevel(selectedTabLevel);
  }, [userSelectedTabTick, selectedTabLevel]);

  // Mount Three.js scene in dedicated empty ref container (only 1 canvas in Hero)
  useEffect(() => {
    if (use2D || !canvasMountRef.current) {
      controllerRef.current?.dispose();
      controllerRef.current = null;
      return;
    }

    const ctrl = new Floor3DController(canvasMountRef.current);
    controllerRef.current = ctrl;
    ctrl.applyState(floorState);

    const handleResize = () => ctrl.resize();
    window.addEventListener('resize', handleResize);

    let resizeObs: ResizeObserver | null = null;
    if ('ResizeObserver' in window && canvasMountRef.current) {
      resizeObs = new ResizeObserver(() => {
        ctrl.resize();
      });
      resizeObs.observe(canvasMountRef.current);
    }

    // Pause WebGL when scrolled out of view per animation.md section 3
    let observer: IntersectionObserver | null = null;
    if (frameWrapperRef.current && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          if (!entry.isIntersecting) {
            ctrl.setPaused(true);
            timelineRef.current?.pause();
          } else {
            ctrl.setPaused(false);
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(frameWrapperRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObs?.disconnect();
      observer?.disconnect();
      ctrl.dispose();
      controllerRef.current = null;
    };
  }, [use2D]);

  const cafeDishes = VENUE_MENUS.Cafe;
  const scriptedCart = [
    { dish: cafeDishes[0], qty: 2 },
    { dish: cafeDishes[2], qty: 1 },
  ];
  const scriptedTicket = {
    ticketNumber: '#0412',
    table: 5,
    items: scriptedCart,
    total: 16.5,
    receptionConfirmed: floorState.sceneIndex >= 10,
    kitchenStatus: (floorState.sceneIndex >= 10 ? 'Ready' : 'Cooking') as
      | 'New'
      | 'Cooking'
      | 'Ready'
      | 'Served',
  };

  const progressPercent = Math.min(100, Math.round((floorState.t / STORY_TOTAL_DURATION) * 100));
  const hasActiveWindow = !floorState.ctaVisible && floorState.windowMode !== 'none';

  return (
    <div
      ref={frameWrapperRef}
      className="relative w-full rounded-[24px] p-1.5 md:p-2 bg-[#FFEEE3] border border-[#F7F2ED]/40"
      data-testid="hero-floor-frame"
    >
      <div className="relative w-full rounded-[20px] bg-[#140905] overflow-hidden flex flex-col">
        {/* 1. Top Control Bar: fits 320px-390px mobile cleanly without horizontal clipping */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-1.5 px-3 py-2.5 bg-[#140905] border-b border-[#F7F2ED]/12">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-[#2A180D] border border-[#F7F2ED]/15 text-[#FBEFE6] text-[11px] font-mono-code whitespace-nowrap">
            <span className="text-[#E8500C] font-bold">DEMO</span>
            <span>Table 5</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={soundEnabled}
              className="px-2.5 py-1 rounded-[8px] bg-[#2A180D] hover:bg-[#3A2214] border border-[#F7F2ED]/15 text-[#FBEFE6] text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              {soundEnabled ? 'Sound: On' : 'Sound: Off'}
            </button>

            <button
              type="button"
              onClick={() => {
                soundFX.play('tap');
                setUse2D((v) => !v);
              }}
              className="px-2.5 py-1 rounded-[8px] bg-[#2A180D] hover:bg-[#3A2214] border border-[#F7F2ED]/15 text-[#FBEFE6] text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              {use2D ? '3D view' : '2D plan'}
            </button>

            {showSkip && floorState.t < STORY_TOTAL_DURATION - 0.5 && (
              <button
                type="button"
                onClick={() => {
                  soundFX.play('tap');
                  timelineRef.current?.skipToEnd();
                }}
                className="px-2.5 py-1 rounded-[8px] bg-[#2A180D] hover:bg-[#3A2214] border border-[#F7F2ED]/15 text-[#FBEFE6] text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                Skip
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                soundFX.play('scan');
                timelineRef.current?.replayAll();
              }}
              className="px-2.5 py-1 rounded-[8px] bg-[#2A180D] hover:bg-[#3A2214] border border-[#F7F2ED]/15 text-[#FBEFE6] text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              Replay
            </button>
          </div>
        </div>

        {/* 2. Split Stage: Zoomed-out 3D/2D Floor + Full Readable Product Windows beside/below it */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch bg-[#140905]">
          {/* Left / Top: Zoomed-out 3D / 2D Floor Stage */}
          <div
            className={`relative w-full h-[300px] sm:h-[380px] lg:h-[500px] bg-[#140905] overflow-hidden ${
              hasActiveWindow ? 'lg:col-span-7' : 'lg:col-span-12'
            }`}
          >
            <div className="absolute inset-0">
              {use2D ? (
                <Floor2D state={floorState} />
              ) : (
                <div
                  ref={canvasMountRef}
                  className="w-full h-full"
                  style={{ opacity: floorState.floorDim, transition: 'opacity 300ms ease' }}
                  data-testid="floor-3d-canvas"
                />
              )}
            </div>

            {/* Scene 11 CTA Pop inside frame (t >= 32.3s) */}
            {floorState.ctaVisible && (
              <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                <div
                  className="pointer-events-auto mx-auto bg-[#140905]/95 border border-[#E8500C]/50 rounded-[24px] p-5 md:p-8 max-w-[460px] w-full text-center flex flex-col items-center gap-3.5"
                  data-testid="story-cta-pop"
                >
                  <span className="text-[12px] font-mono-code font-semibold uppercase tracking-wider text-[#FF8741]">
                    Story complete
                  </span>
                  <h2 className="text-[22px] md:text-[30px] font-semibold text-[#FBEFE6] leading-[1.08] tracking-[-0.03em] m-0">
                    Ready to make your restaurant smarter?
                  </h2>
                  <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
                    <Button variant="accent" href="#start">
                      Get my restaurant set up
                    </Button>
                    <a
                      href="#how"
                      className="text-[15px] font-semibold text-[#FBEFE6]/85 hover:text-[#FFFFFF] underline px-2 py-2"
                    >
                      See how it works
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right / Bottom: Full, understandable Product Windows (PhoneWindow, ReceptionWindow, KitchenWindow) */}
          {hasActiveWindow && (
            <div className="lg:col-span-5 p-3 sm:p-5 bg-[#1B0D08] border-t lg:border-t-0 lg:border-l border-[#F7F2ED]/12 flex flex-col items-center justify-center gap-3">
              {(floorState.windowMode === 'phone-open' ||
                floorState.windowMode === 'phone-menu') && (
                <PhoneWindow
                  level={1}
                  dishes={cafeDishes.slice(0, 3)}
                  cart={[]}
                  compact
                />
              )}

              {(floorState.windowMode === 'phone-cart' ||
                floorState.windowMode === 'phone-call-waiter') && (
                <PhoneWindow
                  level={2}
                  dishes={cafeDishes.slice(0, 3)}
                  cart={scriptedCart}
                  waiterCalled={floorState.windowMode === 'phone-call-waiter'}
                  compact
                />
              )}

              {floorState.windowMode === 'waiter-alert' && (
                <ReceptionWindow
                  mode="waiter"
                  waiterAlert={{
                    id: 'w1',
                    table: 5,
                    status: 'Needs you',
                    itemsSummary: '2x Flat white, 1x Smash burger',
                    total: 16.5,
                  }}
                  compact
                />
              )}

              {(floorState.windowMode === 'phone-order-sent' ||
                floorState.windowMode === 'phone-served') && (
                <PhoneWindow
                  level={3}
                  dishes={cafeDishes.slice(0, 3)}
                  cart={scriptedCart}
                  orderStatus={
                    floorState.windowMode === 'phone-served' ? 'Served' : 'Sent'
                  }
                  ticketNumber="#0412"
                  compact
                />
              )}

              {floorState.windowMode === 'reception-kitchen' && (
                <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-3 w-full">
                  <ReceptionWindow mode="reception" ticket={scriptedTicket} compact />
                  <KitchenWindow ticket={scriptedTicket} compact />
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. Bottom Caption + Progress Line */}
        <div className="relative z-10 p-3 md:p-4 bg-[#140905] border-t border-[#F7F2ED]/12 flex flex-col gap-2">
          <Captions
            currentCaption={floorState.caption}
            sceneNumber={floorState.sceneIndex}
            totalScenes={11}
          />

          <div
            className="w-full h-1 rounded-full bg-[#F7F2ED]/15 overflow-hidden"
            role="progressbar"
            aria-label="Story progress"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-[#E8500C] transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
