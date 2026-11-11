import React, { useState } from 'react';
import skillRaw from '../../../SKILL.md?raw';
import shareCopyRaw from '../../../brag-output/share-copy.txt?raw';

interface BragStudioProps {
  onOpenSite: () => void;
}

export const BragStudio: React.FC<BragStudioProps> = ({ onOpenSite }) => {
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedSkill, setCopiedSkill] = useState(false);

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareCopyRaw.trim());
      setCopiedShare(true);
      window.setTimeout(() => setCopiedShare(false), 2000);
    } catch {
      // Fallback ignored
    }
  };

  const handleCopySkill = async () => {
    try {
      await navigator.clipboard.writeText(skillRaw);
      setCopiedSkill(true);
      window.setTimeout(() => setCopiedSkill(false), 2000);
    } catch {
      // Fallback ignored
    }
  };

  return (
    <div className="min-h-screen bg-[#140905] text-[#FBEFE6] px-[14px] md:px-8 py-8 md:py-12">
      <div className="max-w-[1160px] mx-auto">
        {/* Header Bar */}
        <header className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#F7F2ED]/15">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-[10px] bg-[#E8500C] text-[#FBEFE6] font-bold text-[15px] inline-flex items-center justify-center">
              BB
            </span>
            <div>
              <div className="text-[18px] font-semibold text-[#FBEFE6] leading-tight">
                Build Bros · /brag Launch Video &amp; Owner SKILL.md
              </div>
              <div className="text-[12px] font-mono-code text-[#FBEFE6]/65">
                Instagram Reels 9:16 (1080×1920) · 30fps · 20.2s · 3D Floor + Kinetic UI + Music &amp; SFX
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="/media/brag.mp4"
              download="build-bros-instagram-reel-brag.mp4"
              className="px-4 py-2.5 rounded-[12px] bg-[#E8500C] text-[#FBEFE6] font-semibold text-[14px] no-underline hover:bg-[#C03E0A]"
            >
              Download Instagram Reel (brag.mp4)
            </a>
            <button
              type="button"
              onClick={onOpenSite}
              className="px-4 py-2.5 rounded-[12px] bg-[#2A180D] border border-[#F7F2ED]/20 text-[#FBEFE6] font-semibold text-[14px] cursor-pointer hover:border-[#E8500C]"
            >
              Open Build Bros Site
            </button>
          </div>
        </header>

        {/* Main Video Player Card (9:16 Instagram Reels Layout) */}
        <section className="bg-[#1A0C06] rounded-[24px] border border-[#F7F2ED]/15 p-4 md:p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-[8px] bg-[#E8500C] text-[#FBEFE6] font-mono-code text-[12px] font-semibold">
                9:16 REEL
              </span>
              <span className="text-[15px] font-semibold text-[#FBEFE6]">
                brag-output/brag.mp4 · 1080×1920 Vertical (Unmute player for music &amp; SFX)
              </span>
            </div>
            <a
              href="https://github.com/varchasvaateeksh77-ui/build-bros/tree/main/brag-output"
              target="_blank"
              rel="noreferrer"
              className="text-[13px] font-mono-code text-[#FBA877] underline"
            >
              github.com/varchasvaateeksh77-ui/build-bros/brag-output →
            </a>
          </div>

          <div className="max-w-[400px] mx-auto rounded-[24px] overflow-hidden border-2 border-[#E8500C]/60 bg-[#140905]">
            <video
              src="/media/brag.mp4?v=reel916"
              poster="/media/brag.jpg?v=reel916"
              controls
              playsInline
              preload="metadata"
              className="w-full aspect-[9/16] block bg-[#140905]"
            />
          </div>
        </section>

        {/* Share Copy + Storyboard Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <section className="lg:col-span-5 bg-[#1A0C06] rounded-[24px] border border-[#F7F2ED]/15 p-6 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <h2 className="text-[18px] font-semibold text-[#FBEFE6] m-0">
                  Share Caption (share-copy.txt)
                </h2>
                <button
                  type="button"
                  onClick={handleCopyShare}
                  className="px-3 py-1.5 rounded-[8px] bg-[#E8500C] text-[#FBEFE6] font-mono-code text-[12px] font-semibold cursor-pointer"
                >
                  {copiedShare ? 'Copied' : 'Copy caption'}
                </button>
              </div>
              <p className="text-[15px] leading-[1.55] text-[#FBEFE6]/90 bg-[#140905] p-4 rounded-[14px] border border-[#F7F2ED]/10 m-0 whitespace-pre-wrap">
                {shareCopyRaw.trim()}
              </p>
            </div>

            <div className="text-[13px] text-[#FBEFE6]/65 font-mono-code">
              Music: Sascha Ende — Happy Beats / Business Moves Vol. 10 (109.96 BPM, CC BY 4.0) + Kenney SFX
            </div>
          </section>

          <section className="lg:col-span-7 bg-[#1A0C06] rounded-[24px] border border-[#F7F2ED]/15 p-6">
            <h2 className="text-[18px] font-semibold text-[#FBEFE6] m-0 mb-3">
              5-Scene Beat-Synced Storyboard (20.20s @ 30fps)
            </h2>
            <ol className="list-none p-0 m-0 divide-y divide-[#F7F2ED]/10 text-[14px]">
              <li className="py-2.5 flex justify-between gap-4">
                <span>
                  <strong className="text-[#FBA877]">0.00–3.55s · Hook:</strong> 8:40 pm. Saturday. Twelve tables, two staff (12-table floor + Table 5 pulse)
                </span>
                <span className="font-mono-code text-[#FBEFE6]/60 shrink-0">Scene 1</span>
              </li>
              <li className="py-2.5 flex justify-between gap-4">
                <span>
                  <strong className="text-[#FBA877]">3.55–7.79s · Level 1:</strong> Zoomed Table 5 QR scan + Menu · Table 5 browser card
                </span>
                <span className="font-mono-code text-[#FBEFE6]/60 shrink-0">Scene 2</span>
              </li>
              <li className="py-2.5 flex justify-between gap-4">
                <span>
                  <strong className="text-[#FBA877]">7.79–12.02s · Level 2:</strong> One button under the cart calls the waiter + staff walk path
                </span>
                <span className="font-mono-code text-[#FBEFE6]/60 shrink-0">Scene 3</span>
              </li>
              <li className="py-2.5 flex justify-between gap-4">
                <span>
                  <strong className="text-[#FBA877]">12.02–16.38s · Level 3:</strong> Live 3-window sync (Guest Phone, Reception, Kitchen #0412)
                </span>
                <span className="font-mono-code text-[#FBEFE6]/60 shrink-0">Scene 4</span>
              </li>
              <li className="py-2.5 flex justify-between gap-4">
                <span>
                  <strong className="text-[#FBA877]">16.38–20.20s · Closing Flip:</strong> Full-bleed Cream → Orange → Espresso wipe + Build Bros payoff
                </span>
                <span className="font-mono-code text-[#FBEFE6]/60 shrink-0">Scene 5</span>
              </li>
            </ol>
          </section>
        </div>

        {/* Reusable Owner SKILL.md Section */}
        <section className="bg-[#1A0C06] rounded-[24px] border border-[#F7F2ED]/15 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-[20px] font-semibold text-[#FBEFE6] m-0">
                Your Saved Owner Profile (`SKILL.md`)
              </h2>
              <p className="text-[14px] text-[#FBEFE6]/70 m-0 mt-1">
                Pushed to the root of your GitHub repo (`varchasvaateeksh77-ui/build-bros/blob/main/SKILL.md`). Copy it below for future projects.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <a
                href="https://github.com/varchasvaateeksh77-ui/build-bros/blob/main/SKILL.md"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-[10px] bg-[#2A180D] text-[#FBA877] font-mono-code text-[12px] font-semibold no-underline border border-[#F7F2ED]/15"
              >
                View on GitHub ↗
              </a>
              <button
                type="button"
                onClick={handleCopySkill}
                className="px-4 py-2 rounded-[10px] bg-[#E8500C] text-[#FBEFE6] font-mono-code text-[12px] font-semibold cursor-pointer"
              >
                {copiedSkill ? 'Copied SKILL.md!' : 'Copy full SKILL.md'}
              </button>
            </div>
          </div>

          <pre className="bg-[#140905] text-[#FBEFE6]/90 p-5 rounded-[16px] border border-[#F7F2ED]/10 font-mono-code text-[12px] leading-[1.55] overflow-x-auto max-h-[460px] m-0 whitespace-pre-wrap">
            {skillRaw}
          </pre>
        </section>
      </div>
    </div>
  );
};
