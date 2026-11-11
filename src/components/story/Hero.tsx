import React, { useState } from 'react';
import { AnnouncementPill } from '../ui/Pill';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { Tabs, TabOption } from '../ui/Tabs';
import { FloorFrame } from './FloorFrame';
import { soundFX } from '../../lib/soundEffects';
import contactData from '../../data/contact.json';

const HERO_LEVEL_TABS: TabOption<1 | 2 | 3>[] = [
  { id: 1, label: 'Digital menu' },
  { id: 2, label: 'Waiter call' },
  { id: 3, label: 'Full ordering' },
];

export const Hero: React.FC = () => {
  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(1);
  const [userClickTick, setUserClickTick] = useState(0);

  const handleUserTabChange = (lvl: 1 | 2 | 3) => {
    soundFX.play('tap');
    setActiveTab(lvl);
    setUserClickTick((t) => t + 1);
  };

  return (
    <section
      id="story"
      className="hero-surface pt-24 md:pt-28 pb-12 md:pb-20 px-[14px] md:px-6"
    >
      <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center">
        {/* 1. Announcement pill */}
        <div className="mb-5">
          <AnnouncementPill text="See table five order live" href="#demo" />
        </div>

        {/* 2. H1 (stays on the dark upper portion of the hero gradient per design.md) */}
        <h1
          className="text-[#FBEFE6] font-semibold text-[38px] sm:text-[56px] lg:text-[84px] leading-[0.95] lg:leading-[1.02] tracking-[-0.04em] max-w-[920px] m-0 mb-5"
          style={{ textWrap: 'balance' }}
        >
          Digital ordering for cafes and restaurants.
        </h1>

        {/* 3. Lead */}
        <p className="text-[#FBEFE6]/92 text-[16px] md:text-[19px] leading-[1.45] md:leading-[1.55] tracking-[-0.01em] max-w-[576px] m-0 mb-7">
          Guests scan a code, order and call staff from the table. Your reception
          and kitchen see it the moment it happens.
        </p>

        {/* 4. Direct phone/WhatsApp chip + 5. White CTA button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-[660px] mb-9">
          <Chip
            variant="hero-dark"
            tag="Call / WhatsApp"
            text={contactData.phones[0].display}
            copyValue={contactData.phones[0].display}
            className="w-full sm:w-auto"
          />
          <Button variant="white" href="#start" className="w-full sm:w-auto">
            Get my restaurant set up
          </Button>
        </div>

        {/* 6. Three level tabs */}
        <div className="mb-5">
          <Tabs
            options={HERO_LEVEL_TABS}
            activeId={activeTab}
            onChange={handleUserTabChange}
            ariaLabel="Story service levels"
          />
        </div>

        {/* 7. Framed 3D / 2D Floor Story */}
        <div className="w-full">
          <FloorFrame
            selectedTabLevel={activeTab}
            onTabFollowStory={(lvl) => setActiveTab(lvl)}
            userSelectedTabTick={userClickTick}
          />
        </div>
      </div>
    </section>
  );
};
