import React, { useEffect, useRef, useState } from 'react';
import howData from '../../data/how.json';
import { SectionLabel } from '../ui/Pill';
import { Chip } from '../ui/Chip';
import { useReducedMotion } from '../../lib/reducedMotion';
import { soundFX } from '../../lib/soundEffects';

interface SceneBeat {
  id: number;
  start: number;
  end: number;
  caption: string;
  sound?: 'scan' | 'cartAdd' | 'waiterCall' | 'ticketSent' | 'kitchenReady' | 'served';
}

const LEVEL_BEATS: Record<1 | 2 | 3, SceneBeat[]> = {
  1: [
    { id: 1, start: 0.0, end: 1.5, caption: 'A code on every table' },
    { id: 2, start: 1.5, end: 3.5, caption: 'Scan. No app. No account.', sound: 'scan' },
    { id: 3, start: 3.5, end: 8.0, caption: 'Photos, prices, categories', sound: 'cartAdd' },
    { id: 4, start: 8.0, end: 10.5, caption: 'Change a price once' },
    { id: 5, start: 10.5, end: 12.0, caption: 'Level 1, Digital menu' },
  ],
  2: [
    { id: 1, start: 0.0, end: 2.0, caption: 'Pick dishes into the cart', sound: 'cartAdd' },
    { id: 2, start: 2.0, end: 6.5, caption: 'One button under the cart', sound: 'waiterCall' },
    { id: 3, start: 6.5, end: 11.0, caption: 'The waiter gets the table number' },
    { id: 4, start: 11.0, end: 14.0, caption: 'The waiter takes the order', sound: 'served' },
    { id: 5, start: 14.0, end: 16.0, caption: 'Level 2, Menu and waiter call' },
  ],
  3: [
    { id: 1, start: 0.0, end: 2.5, caption: 'Order from the phone' },
    { id: 2, start: 2.5, end: 5.0, caption: 'Sent', sound: 'ticketSent' },
    { id: 3, start: 5.0, end: 10.0, caption: 'Reception first, or straight to the kitchen' },
    { id: 4, start: 10.0, end: 14.0, caption: 'The kitchen cooks it', sound: 'kitchenReady' },
    { id: 5, start: 14.0, end: 17.0, caption: 'Served', sound: 'served' },
    { id: 6, start: 17.0, end: 18.0, caption: 'Level 3, Full ordering' },
  ],
};

interface LevelMotionGraphicProps {
  level: 1 | 2 | 3;
  videoSrc: string;
  posterSrc: string;
  reducedMotion: boolean;
}

const LevelMotionGraphic: React.FC<LevelMotionGraphicProps> = ({
  level,
  videoSrc,
  posterSrc,
  reducedMotion,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const durationSec = level === 1 ? 12 : level === 2 ? 16 : 18;
  const beats = LEVEL_BEATS[level];

  const [inView, setInView] = useState(false);
  const [pausedByUser, setPausedByUser] = useState(false);
  const [phase, setPhase] = useState(0);
  const lastBeatIdRef = useRef<number>(1);

  useEffect(() => {
    if (!containerRef.current || !('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setInView(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (inView && !reducedMotion && !pausedByUser) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [inView, reducedMotion, pausedByUser]);

  useEffect(() => {
    if (!inView || reducedMotion || pausedByUser) return;
    let raf = 0;
    let lastNow = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - lastNow) / 1000);
      lastNow = now;
      setPhase((prev) => (prev + dt) % durationSec);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reducedMotion, pausedByUser, durationSec]);

  const currentBeat =
    beats.find((b) => phase >= b.start && phase < b.end) || beats[beats.length - 1];

  const beatProgress = Math.max(
    0,
    Math.min(1, (phase - currentBeat.start) / Math.max(0.1, currentBeat.end - currentBeat.start))
  );

  // Trigger subtle sound effect when user manually steps beats
  const handleSelectBeat = (beat: SceneBeat) => {
    setPausedByUser(true);
    setPhase(beat.start + 0.25);
    lastBeatIdRef.current = beat.id;
    soundFX.play(beat.sound || 'tap');
  };

  const isDarkCard = level === 3;

  return (
    <div
      ref={containerRef}
      className={`relative aspect-[4/3] w-full overflow-hidden p-4 sm:p-5 flex flex-col justify-between select-none ${
        isDarkCard ? 'bg-[#140905] text-[#FBEFE6]' : 'text-[#1A0C06]'
      }`}
      style={
        isDarkCard
          ? {
              background:
                'linear-gradient(180deg, #140905 0%, #241007 68%, #5C1C07 100%)',
            }
          : {
              background:
                'linear-gradient(180deg, #FFEEE3 0%, #FCD7BE 62%, #FBA877 100%)',
            }
      }
      data-testid={`how-motion-card-${level}`}
    >
      {/* Underlying deterministic MP4 video element per motion-graphics.md */}
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="sr-only"
      />

      {/* Fine corner crosshair marks on Level 3 per design.md section 5 */}
      {isDarkCard && (
        <>
          <span aria-hidden="true" className="absolute top-2.5 left-3 text-[#F7F2ED]/30 font-mono-code text-[11px]">+</span>
          <span aria-hidden="true" className="absolute top-2.5 right-3 text-[#F7F2ED]/30 font-mono-code text-[11px]">+</span>
          <span aria-hidden="true" className="absolute bottom-2.5 left-3 text-[#F7F2ED]/30 font-mono-code text-[11px]">+</span>
          <span aria-hidden="true" className="absolute bottom-2.5 right-3 text-[#F7F2ED]/30 font-mono-code text-[11px]">+</span>
        </>
      )}

      {/* Top row: Demo tag + Scene beat pills + Play/Pause toggle */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 rounded-[6px] font-mono-code text-[11px] font-semibold uppercase ${
              isDarkCard
                ? 'bg-[#2A180D] text-[#FF8741]'
                : 'bg-[#FFFFFF]/90 text-[#C03E0A]'
            }`}
          >
            Demo
          </span>
          <span
            className={`font-mono-code text-[11px] tabular-nums ${
              isDarkCard ? 'text-[#FBEFE6]/70' : 'text-[#1A0C06]/70'
            }`}
          >
            {phase.toFixed(1)}s / {durationSec}s
          </span>
        </div>

        {/* Interactive scene stepper buttons */}
        <div className="flex items-center gap-1">
          {beats.map((b) => {
            const active = b.id === currentBeat.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => handleSelectBeat(b)}
                aria-label={`Level ${level} Scene ${b.id}: ${b.caption}`}
                className={`w-5 h-5 rounded-[5px] font-mono-code text-[10px] font-bold flex items-center justify-center transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#E8500C] text-[#FBEFE6]'
                    : isDarkCard
                    ? 'bg-[#2A180D] text-[#FBEFE6]/65 hover:text-[#FFFFFF]'
                    : 'bg-[#FFFFFF]/75 text-[#1A0C06]/65 hover:bg-[#FFFFFF]'
                }`}
              >
                {b.id}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              soundFX.play('tap');
              setPausedByUser((p) => !p);
            }}
            aria-label={pausedByUser ? `Play Level ${level} loop` : `Pause Level ${level} loop`}
            className={`ml-1 px-2 h-5 rounded-[5px] font-mono-code text-[10px] font-semibold transition-colors cursor-pointer ${
              isDarkCard
                ? 'bg-[#2A180D] text-[#FBEFE6] hover:bg-[#3D2314]'
                : 'bg-[#FFFFFF]/85 text-[#1A0C06] hover:bg-[#FFFFFF]'
            }`}
          >
            {pausedByUser ? 'Play' : 'Pause'}
          </button>
        </div>
      </div>

      {/* Center Detailed Motion Storyboard */}
      <div className="relative z-10 my-auto py-1 flex items-center justify-center w-full">
        {/* ================= LEVEL 1 STORYBOARD (12s) ================= */}
        {level === 1 && (
          <div className="w-full max-w-[390px] mx-auto">
            {/* Beat 1 (0.0 - 1.5s) & Beat 2 (1.5 - 3.5s): Table top + QR code + Scan line */}
            {currentBeat.id <= 2 && (
              <div className="grid grid-cols-12 gap-2.5 items-center">
                {/* Left: Top-down Table 5 with QR code */}
                <div className="col-span-5 bg-[#140905] rounded-[16px] p-3 text-[#FBEFE6] flex flex-col items-center justify-center relative overflow-hidden">
                  <span className="font-mono-code text-[10px] text-[#FF8741] mb-1">
                    Table 5
                  </span>
                  <svg width="78" height="78" viewBox="0 0 78 78" fill="none" aria-hidden="true">
                    <circle cx="39" cy="39" r="34" fill="#2A180D" stroke="#E8500C" strokeWidth="2" />
                    {/* QR Code square on table */}
                    <rect x="25" y="25" width="28" height="28" rx="4" fill="#F7F2ED" />
                    <rect x="29" y="29" width="7" height="7" fill="#140905" />
                    <rect x="42" y="29" width="7" height="7" fill="#140905" />
                    <rect x="29" y="42" width="7" height="7" fill="#140905" />
                    <rect x="38" y="38" width="6" height="6" fill="#E8500C" />
                    {/* Animated scan beam in Beat 2 */}
                    {currentBeat.id === 2 && (
                      <line
                        x1="18"
                        y1={22 + beatProgress * 34}
                        x2="60"
                        y2={22 + beatProgress * 34}
                        stroke="#E8500C"
                        strokeWidth="3"
                      />
                    )}
                  </svg>
                </div>

                {/* Right: Phone sliding in & opening browser menu */}
                <div
                  className="col-span-7 bg-[#FFFFFF] rounded-[16px] border border-[#E3D9D3] p-3 text-[#1A0C06] transition-all duration-300"
                  style={{
                    opacity: currentBeat.id === 1 ? 0.55 : 1,
                    transform:
                      currentBeat.id === 1
                        ? 'translateY(8px)'
                        : 'translateY(0px)',
                  }}
                >
                  <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#E3D9D3] text-[11px]">
                    <span className="font-semibold">Browser · Table 5</span>
                    <span className="font-mono-code text-[10px] text-[#C03E0A]">
                      No app
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 text-[11px]">
                    <div className="flex items-center justify-between p-1.5 rounded-[8px] bg-[#F7F2ED]">
                      <span className="font-medium">Flat white</span>
                      <span className="font-mono-code font-bold">3.50</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded-[8px] bg-[#F7F2ED]">
                      <span className="font-medium">Smash burger</span>
                      <span className="font-mono-code font-bold">9.50</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Beat 3 (3.5 - 8.0s): Category chips, drawn plates, prices, finger tap */}
            {currentBeat.id === 3 && (
              <div className="bg-[#FFFFFF] rounded-[18px] border border-[#E3D9D3] p-3.5 text-[#1A0C06]">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E3D9D3]">
                  <div className="flex items-center gap-1">
                    {['Coffee', 'Food', 'Dessert'].map((cat, idx) => {
                      const selected =
                        (beatProgress < 0.45 && idx === 0) ||
                        (beatProgress >= 0.45 && idx === 1);
                      return (
                        <span
                          key={cat}
                          className={`px-2 py-0.5 rounded-[6px] text-[10px] font-semibold transition-colors ${
                            selected
                              ? 'bg-[#1A0C06] text-[#FBEFE6]'
                              : 'bg-[#F3ECE5] text-[#6C625C]'
                          }`}
                        >
                          {cat}
                        </span>
                      );
                    })}
                  </div>
                  <span className="font-mono-code text-[10px] text-[#C03E0A] font-semibold">
                    Tap category
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 text-[11px]">
                  {(beatProgress < 0.45
                    ? [
                        { name: 'Flat white', price: '3.50', color: '#C88A5A' },
                        { name: 'Iced latte', price: '3.80', color: '#D97B38' },
                      ]
                    : [
                        { name: 'Smash burger', price: '9.50', color: '#8C3F19' },
                        { name: 'Garlic bread', price: '4.50', color: '#E2B46D' },
                      ]
                  ).map((d) => (
                    <div
                      key={d.name}
                      className="flex items-center justify-between p-1.5 px-2.5 rounded-[8px] bg-[#F7F2ED]"
                    >
                      <div className="flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                          <circle cx="10" cy="10" r="9" fill="#F3ECE5" stroke="#E3D9D3" />
                          <circle cx="10" cy="10" r="5.5" fill={d.color} />
                        </svg>
                        <span className="font-semibold">{d.name}</span>
                      </div>
                      <span className="font-mono-code font-bold tabular-nums">{d.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Beat 4 (8.0 - 10.5s) & Beat 5 (10.5 - 12.0s): Owner updates price once -> guest menu syncs */}
            {currentBeat.id >= 4 && (
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-[#140905] text-[#FBEFE6] rounded-[16px] p-3 text-[11px] flex flex-col justify-between">
                  <div className="text-[10px] font-mono-code text-[#FF8741]">
                    Owner phone
                  </div>
                  <div className="my-1.5 font-semibold">Flat white price</div>
                  <div className="flex items-center justify-between px-2 py-1 rounded-[6px] bg-[#2A180D] font-mono-code">
                    <span className="line-through text-[#FBEFE6]/50">3.50</span>
                    <span className="text-[#E8500C] font-bold">→ 3.80</span>
                  </div>
                </div>
                <div className="bg-[#FFFFFF] text-[#1A0C06] rounded-[16px] border border-[#E3D9D3] p-3 text-[11px] flex flex-col justify-between">
                  <div className="text-[10px] font-mono-code text-[#C03E0A]">
                    Guest table 5
                  </div>
                  <div className="my-1.5 font-semibold">Updated live</div>
                  <div className="flex items-center justify-between px-2 py-1 rounded-[6px] bg-[#FFEEE3] font-mono-code font-bold text-[#1A0C06]">
                    <span>Flat white</span>
                    <span className="text-[#C03E0A]">3.80</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= LEVEL 2 STORYBOARD (16s) ================= */}
        {level === 2 && (
          <div className="w-full max-w-[390px] mx-auto">
            {/* Beat 1 (0.0 - 2.0s): Pick dishes into cart */}
            {currentBeat.id === 1 && (
              <div className="bg-[#FFFFFF] rounded-[18px] border border-[#E3D9D3] p-3.5 text-[#1A0C06] max-w-[330px] mx-auto">
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#E3D9D3] text-[11px]">
                  <span className="font-semibold">Table 5 · Your cart</span>
                  <span className="font-mono-code font-bold text-[#C03E0A] tabular-nums">
                    Total {beatProgress < 0.5 ? '7.00' : '16.50'}
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-[11px] mb-2.5">
                  <div className="flex justify-between px-2 py-1 rounded-[6px] bg-[#F7F2ED]">
                    <span>2x Flat white</span>
                    <span className="font-mono-code tabular-nums">7.00</span>
                  </div>
                  {beatProgress >= 0.5 && (
                    <div className="flex justify-between px-2 py-1 rounded-[6px] bg-[#F7F2ED]">
                      <span>1x Smash burger</span>
                      <span className="font-mono-code tabular-nums">9.50</span>
                    </div>
                  )}
                </div>
                <div className="py-1.5 px-3 rounded-[8px] text-center text-[12px] font-semibold bg-[#1A0C06] text-[#FBEFE6]">
                  Call waiter
                </div>
              </div>
            )}

            {/* Beat 2, 3, 4, 5 (2.0 - 16.0s): Split view Cart/Waiter Phone + Mini Floor Plan with Waiter walking to Table 5 */}
            {currentBeat.id >= 2 && (
              <div className="grid grid-cols-12 gap-2.5 items-stretch">
                {/* Left: Guest Cart (Beat 2) or Waiter Phone (Beat 3-5) */}
                <div className="col-span-6 bg-[#FFFFFF] rounded-[16px] border border-[#E3D9D3] p-3 text-[#1A0C06] text-[11px] flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-[#E3D9D3] pb-1">
                    <span className="font-semibold">
                      {currentBeat.id === 2 ? 'Guest phone' : 'Waiter phone'}
                    </span>
                    <span className="font-mono-code text-[10px] text-[#C03E0A]">Live</span>
                  </div>
                  <div
                    className={`my-1.5 p-2 rounded-[8px] font-semibold ${
                      currentBeat.id >= 4
                        ? 'bg-[#F3ECE5] text-[#1A0C06]'
                        : 'bg-[#E8500C] text-[#FBEFE6]'
                    }`}
                  >
                    <div>
                      {currentBeat.id === 2
                        ? 'Waiter called · Table 5'
                        : currentBeat.id === 3
                        ? 'Needs you · Table 5'
                        : 'Order taken · Table 5'}
                    </div>
                    <div
                      className={`text-[10px] font-normal mt-0.5 ${
                        currentBeat.id >= 4 ? 'text-[#6C625C]' : 'text-[#FBEFE6]/90'
                      }`}
                    >
                      2x Flat white, 1x Burger
                    </div>
                  </div>
                </div>

                {/* Right: Mini Top-Down Floor Plan with Staff capsule walking from Counter to Table 5 */}
                <div className="col-span-6 bg-[#140905] rounded-[16px] p-2.5 text-[#FBEFE6] flex items-center justify-center">
                  <svg width="150" height="105" viewBox="0 0 150 105" fill="none" aria-hidden="true">
                    <rect x="4" y="4" width="142" height="97" rx="8" stroke="#F7F2ED" strokeOpacity="0.22" />
                    {/* Counter */}
                    <rect x="20" y="10" width="75" height="14" rx="3" fill="#2A180D" stroke="#F7F2ED" strokeOpacity="0.4" />
                    <text x="57" y="20" fill="#FBEFE6" fontSize="8" textAnchor="middle">Counter</text>
                    {/* Dashed route line from Counter to Table 5 */}
                    <line x1="57" y1="26" x2="75" y2="54" stroke="#FF8741" strokeWidth="1.5" strokeDasharray="3 2" />
                    {/* Table 5 */}
                    <circle
                      cx="75"
                      cy="68"
                      r={currentBeat.id <= 3 ? 19 : 16}
                      fill="none"
                      stroke="#E8500C"
                      strokeOpacity={currentBeat.id <= 3 ? '0.85' : '0.3'}
                      strokeWidth="1.5"
                    />
                    <circle cx="75" cy="68" r="13" fill="#E8500C" />
                    <text x="75" y="71" fill="#FBEFE6" fontSize="8" fontWeight="700" textAnchor="middle">T5</text>
                    {/* Waiter walking from Counter (57,28) to Table 5 (75,52) */}
                    {(() => {
                      const walkT =
                        currentBeat.id === 2
                          ? beatProgress * 0.55
                          : currentBeat.id === 3
                          ? 0.55 + beatProgress * 0.45
                          : 1;
                      const sx = 57 + (75 - 57) * walkT;
                      const sy = 28 + (52 - 28) * walkT;
                      return (
                        <g transform={`translate(${sx}, ${sy})`}>
                          <circle r="6.5" fill="#F7F2ED" stroke="#E8500C" strokeWidth="2" />
                          <text y="-9" fill="#FF8741" fontSize="7.5" fontWeight="700" textAnchor="middle">
                            Waiter
                          </text>
                        </g>
                      );
                    })()}
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= LEVEL 3 STORYBOARD (18s) ================= */}
        {level === 3 && (
          <div className="w-full max-w-[390px] mx-auto">
            {/* Beat 1 & 2 (0.0 - 5.0s): Place order on phone -> Sent Ticket #0412 lifts off */}
            {currentBeat.id <= 2 && (
              <div className="bg-[#FFFFFF] rounded-[18px] p-3.5 text-[#1A0C06] max-w-[320px] mx-auto">
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#E3D9D3] text-[11px]">
                  <span className="font-semibold">Guest phone · Table 5</span>
                  <span className="font-mono-code font-bold text-[#C03E0A]">16.50</span>
                </div>
                {currentBeat.id === 1 ? (
                  <div className="py-2 px-3 rounded-[8px] bg-[#E8500C] text-[#FBEFE6] text-center text-[12px] font-semibold">
                    Place order · 16.50
                  </div>
                ) : (
                  <div
                    className="p-2.5 rounded-[10px] bg-[#FFEEE3] border border-[#E8500C] flex items-center justify-between text-[12px] font-semibold"
                    style={{
                      transform: 'translateY(-3px)',
                    }}
                  >
                    <span className="font-mono-code font-bold text-[#1A0C06]">
                      Ticket #0412
                    </span>
                    <span className="text-[#C03E0A]">Sent →</span>
                  </div>
                )}
              </div>
            )}

            {/* Beat 3 (5.0 - 10.0s): Branching diagram (Ticket #0412 -> Reception OR Kitchen) */}
            {currentBeat.id === 3 && (
              <div className="bg-[#1C0D07] rounded-[16px] border border-[#F7F2ED]/15 p-3 text-[#FBEFE6]">
                <svg width="100%" height="96" viewBox="0 0 340 96" fill="none" aria-hidden="true">
                  {/* Left: Ticket #0412 node */}
                  <rect x="8" y="30" width="84" height="36" rx="8" fill="#E8500C" />
                  <text x="50" y="46" fill="#FBEFE6" fontSize="10" fontWeight="700" textAnchor="middle">#0412</text>
                  <text x="50" y="58" fill="#FBEFE6" fontSize="9" textAnchor="middle">Table 5</text>

                  {/* Branching hairlines */}
                  <path d="M92 48 C135 48, 145 22, 188 22" stroke="#F7F2ED" strokeWidth="1.75" strokeDasharray="4 3" />
                  <path d="M92 48 C135 48, 145 74, 188 74" stroke="#E8500C" strokeWidth="2" />

                  {/* Travelling signal dots */}
                  <circle cx={92 + beatProgress * 96} cy={48 - beatProgress * 26} r="4" fill="#F7F2ED" />
                  <circle cx={92 + beatProgress * 96} cy={48 + beatProgress * 26} r="4.5" fill="#E8500C" />

                  {/* Top right: Reception window */}
                  <rect x="188" y="6" width="144" height="34" rx="8" fill="#FFFFFF" />
                  <text x="200" y="21" fill="#1A0C06" fontSize="10" fontWeight="700">Reception</text>
                  <text x="200" y="33" fill="#C03E0A" fontSize="9" fontWeight="600">Incoming · Confirm</text>

                  {/* Bottom right: Kitchen window */}
                  <rect x="188" y="56" width="144" height="34" rx="8" fill="#FFFFFF" />
                  <text x="200" y="71" fill="#1A0C06" fontSize="10" fontWeight="700">Kitchen pass</text>
                  <text x="200" y="83" fill="#E8500C" fontSize="9" fontWeight="600">New · Ticket #0412</text>
                </svg>
              </div>
            )}

            {/* Beat 4 (10.0 - 14.0s): Kitchen steps New -> Cooking -> Ready, guest phone mirrors */}
            {currentBeat.id === 4 && (
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-[#FFFFFF] rounded-[14px] p-3 text-[#1A0C06] text-[11px]">
                  <div className="font-semibold mb-1.5">Kitchen #0412</div>
                  <div className="grid grid-cols-3 gap-1 text-[10px] font-semibold text-center">
                    {['New', 'Cooking', 'Ready'].map((st, idx) => {
                      const active =
                        (beatProgress < 0.33 && idx === 0) ||
                        (beatProgress >= 0.33 && beatProgress < 0.68 && idx === 1) ||
                        (beatProgress >= 0.68 && idx === 2);
                      return (
                        <span
                          key={st}
                          className={`py-1 rounded-[5px] ${
                            active
                              ? 'bg-[#E8500C] text-[#FBEFE6]'
                              : 'bg-[#F3ECE5] text-[#6C625C]'
                          }`}
                        >
                          {st}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="bg-[#FFFFFF] rounded-[14px] p-3 text-[#1A0C06] text-[11px] flex flex-col justify-between">
                  <div className="font-semibold">Guest phone</div>
                  <div className="p-1.5 rounded-[6px] bg-[#FFEEE3] text-[#C03E0A] font-mono-code font-bold text-center">
                    {beatProgress < 0.33
                      ? 'Status: Sent'
                      : beatProgress < 0.68
                      ? 'Status: Cooking'
                      : 'Status: Ready'}
                  </div>
                </div>
              </div>
            )}

            {/* Beat 5 & 6 (14.0 - 18.0s): Floor delivery from Kitchen pass to Table 5 -> Served */}
            {currentBeat.id >= 5 && (
              <div className="bg-[#1C0D07] rounded-[16px] border border-[#F7F2ED]/15 p-3 flex items-center justify-between gap-3">
                <div className="text-[11px]">
                  <div className="font-mono-code text-[#FF8741] text-[10px]">
                    Ticket #0412
                  </div>
                  <div className="font-bold text-[14px] text-[#FBEFE6] mt-0.5">
                    Table 5 · Served
                  </div>
                  <div className="text-[#FBEFE6]/70 text-[11px] mt-0.5">
                    Table marker returns to [F]
                  </div>
                </div>
                <svg width="140" height="76" viewBox="0 0 140 76" fill="none" aria-hidden="true">
                  <rect x="4" y="4" width="132" height="68" rx="8" stroke="#F7F2ED" strokeOpacity="0.2" />
                  {/* Kitchen pass on right */}
                  <rect x="104" y="12" width="24" height="52" rx="4" fill="#5C1C07" stroke="#E8500C" />
                  {/* Table 5 on left */}
                  <circle cx="38" cy="38" r="14" fill="#2A180D" stroke="#F7F2ED" strokeOpacity="0.6" />
                  <text x="38" y="41" fill="#FBEFE6" fontSize="9" fontWeight="700" textAnchor="middle">T5</text>
                  {/* Staff capsule carrying order from Kitchen (100,38) to Table 5 (56,38) */}
                  {(() => {
                    const carryT = currentBeat.id === 5 ? beatProgress : 1;
                    const sx = 98 - carryT * 40;
                    return (
                      <circle cx={sx} cy="38" r="6" fill="#FFEEE3" stroke="#E8500C" strokeWidth="2" />
                    );
                  })()}
                </svg>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom: On-video caption + thin progress scrubber */}
      <div className="relative z-10 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <div
            className={`inline-block px-3 py-1 rounded-[10px] text-[13px] sm:text-[14px] font-semibold tracking-[-0.01em] ${
              isDarkCard
                ? 'bg-[#140905]/90 text-[#FBEFE6] border border-[#F7F2ED]/15'
                : 'bg-[#FFFFFF]/95 text-[#1A0C06]'
            }`}
          >
            {reducedMotion ? `Level ${level}` : currentBeat.caption}
          </div>
          <span
            className={`font-mono-code text-[10px] ${
              isDarkCard ? 'text-[#FBEFE6]/60' : 'text-[#1A0C06]/60'
            }`}
          >
            Scene {currentBeat.id}/{beats.length}
          </span>
        </div>

        <div className="w-full h-1 rounded-full bg-[#1A0C06]/15 overflow-hidden">
          <div
            className="h-full bg-[#E8500C] transition-all duration-100"
            style={{ width: `${Math.min(100, (phase / durationSec) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export const How: React.FC = () => {
  const reducedMotion = useReducedMotion();

  return (
    <section id="how" className="py-16 md:py-24 px-[14px] md:px-6 bg-[#F7F2ED]">
      <div className="max-w-[1200px] mx-auto">
        <div className="max-w-[680px] mb-10">
          <SectionLabel text="How it works" />
          <h2
            className="text-[30px] md:text-[48px] font-semibold text-[#1A0C06] leading-[1.06] tracking-[-0.035em] m-0"
            style={{ textWrap: 'balance' }}
          >
            Three levels, shown in motion.
          </h2>
        </div>

        {/* Asymmetric 12-column grid on desktop (avoiding 3 identical columns per Gate #6) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {howData.map((card, idx) => {
            const colSpan =
              idx === 0
                ? 'lg:col-span-5'
                : idx === 1
                ? 'lg:col-span-7'
                : 'lg:col-span-12 lg:max-w-[780px] lg:mx-auto w-full';

            return (
              <article
                key={card.level}
                className={`${colSpan} bg-[#FFFFFF] rounded-[24px] border border-[#E3D9D3] overflow-hidden flex flex-col`}
              >
                <LevelMotionGraphic
                  level={card.level as 1 | 2 | 3}
                  videoSrc={card.video}
                  posterSrc={card.poster}
                  reducedMotion={reducedMotion}
                />

                <div className="p-6 md:p-8 flex flex-col gap-3">
                  <span className="text-[14px] font-semibold text-[#C03E0A]">
                    {card.label}
                  </span>
                  <h3 className="text-[22px] md:text-[32px] font-semibold text-[#1A0C06] leading-[1.14] tracking-[-0.03em] m-0">
                    {card.title}
                  </h3>
                  <p className="text-[15px] md:text-[16px] leading-[1.5] text-[#6C625C] m-0">
                    {card.body}
                  </p>
                  <div className="pt-2">
                    <Chip text={card.chip} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
