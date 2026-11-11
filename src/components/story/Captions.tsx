import React from 'react';
import storyData from '../../data/story.json';

interface CaptionsProps {
  currentCaption: string;
  sceneNumber: number;
  totalScenes: number;
}

export const Captions: React.FC<CaptionsProps> = ({
  currentCaption,
  sceneNumber,
  totalScenes,
}) => {
  return (
    <>
      <div
        aria-live="polite"
        aria-atomic="true"
        className="px-4 py-2.5 rounded-[14px] bg-[#140905]/90 border border-[#F7F2ED]/20 text-[#FBEFE6] flex items-center justify-between gap-3"
      >
        <p className="m-0 text-[14px] md:text-[16px] font-medium leading-[1.35] text-[#FBEFE6]">
          {currentCaption}
        </p>
        <span className="font-mono-code text-[12px] text-[#FBEFE6]/65 whitespace-nowrap shrink-0 tabular-nums">
          {sceneNumber}/{totalScenes}
        </span>
      </div>

      {/* Full accessible story transcript in DOM per Hard Rule 8 */}
      <div className="sr-only" aria-label="Full animated story transcript">
        <h3>Table five ordering story transcript</h3>
        <ol>
          {storyData.map((s) => (
            <li key={s.scene}>{s.caption}</li>
          ))}
        </ol>
      </div>
    </>
  );
};
