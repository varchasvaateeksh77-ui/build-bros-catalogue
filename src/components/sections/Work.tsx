import React from 'react';
import clientsData from '../../data/clients.json';
import { SectionLabel } from '../ui/Pill';

export interface ClientCase {
  slug: string;
  name: string;
  type: 'cafe' | 'restaurant';
  city: string;
  level: 1 | 2 | 3;
  permission: boolean;
  summary?: string;
  built?: string[];
  results?: Array<{
    label: string;
    value: string;
    measuredBy: string;
    period: string;
  }>;
  media?: Array<{
    type: 'image' | 'video';
    src: string;
    alt: string;
  }>;
  liveUrl?: string;
}

export const Work: React.FC = () => {
  const approvedClients = (clientsData as ClientCase[]).filter(
    (c) => c && c.permission && c.name
  );

  // Per Hard Rule 1 & content.md section 7: hide section when empty
  if (approvedClients.length === 0) {
    return null;
  }

  return (
    <section id="work" className="py-16 md:py-24 px-[14px] md:px-6 bg-[#F7F2ED]">
      <div className="max-w-[1200px] mx-auto">
        <div className="max-w-[680px] mb-10">
          <SectionLabel text="Work" />
          <h2
            className="text-[30px] md:text-[48px] font-semibold text-[#1A0C06] leading-[1.06] tracking-[-0.035em] m-0 mb-3"
            style={{ textWrap: 'balance' }}
          >
            Places running on Build Bros.
          </h2>
          <p className="text-[16px] md:text-[18px] leading-[1.5] text-[#6C625C] m-0">
            Real cafes and restaurants using our systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {approvedClients.map((client) => (
            <article
              key={client.slug || client.name}
              className="bg-[#FFFFFF] rounded-[24px] border border-[#E3D9D3] p-6 md:p-8 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-semibold text-[#C03E0A]">
                  Level {client.level} · {client.type} · {client.city}
                </span>
                {client.liveUrl && (
                  <a
                    href={client.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] font-mono-code text-[#1A0C06] underline"
                  >
                    Live menu
                  </a>
                )}
              </div>
              <h3 className="text-[24px] md:text-[30px] font-semibold text-[#1A0C06] m-0">
                {client.name}
              </h3>
              {client.summary && (
                <p className="text-[15px] text-[#6C625C] leading-[1.5] m-0">
                  {client.summary}
                </p>
              )}
              {client.built && client.built.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {client.built.map((b) => (
                    <span
                      key={b}
                      className="px-3 py-1 rounded-[10px] bg-[#F3ECE5] text-[#6C625C] text-[13px] font-mono-code"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
