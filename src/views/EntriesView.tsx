import React from 'react';
import { Entry } from '../types';
import { TrendingUp } from 'lucide-react';

interface EntriesViewProps {
  entries: Entry[];
  onViewTicket: (entry: Entry) => void;
  onExploreDraws: () => void;
}

export const EntriesView: React.FC<EntriesViewProps> = ({ entries, onViewTicket, onExploreDraws }) => {
  const groups = new Map<string, { title: string; prize: string; draw: string; count: number; sample: Entry }>();
  for (const e of entries) {
    const g = groups.get(e.giveawayId);
    if (g) g.count += 1;
    else groups.set(e.giveawayId, { title: e.giveawayTitle, prize: e.prizeAmount, draw: e.drawDateFormatted, count: 1, sample: e });
  }
  const rows = [...groups.values()];
  const today = entries.filter((e) => e.enteredAt === 'Today').length;

  return (
    <div className="flex flex-col gap-4 px-4 md:px-0 pt-2 pb-28">
      <div className="flex items-center justify-between px-1">
        <h1 className="text-[20px] font-extrabold text-white tracking-tight">Your Entries</h1>
        <button onClick={onExploreDraws} className="text-[13px] font-semibold text-[#C8FF00]">
          View All
        </button>
      </div>

      <div className="card p-5 flex items-center justify-between animate-fade-up">
        <div>
          <p className="text-[12px] text-[#94A3B8]">Total Entries</p>
          <p className="text-[34px] leading-none font-black text-white tabular-nums mt-1">{entries.length}</p>
          {today > 0 && (
            <p className="mt-1.5 flex items-center gap-1 text-[12px] font-bold text-[#19D37A]">
              <TrendingUp className="w-3.5 h-3.5" /> +{today} today
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-2xl cta-gradient flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-black" />
        </div>
      </div>

      {rows.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {rows.map((r) => (
            <button
              key={r.sample.giveawayId}
              onClick={() => onViewTicket(r.sample)}
              className="card p-3.5 flex items-center gap-3 text-left active:scale-[0.99]"
            >
              <span className="text-[15px] font-black text-white">{r.count}×</span>
              <span className="flex-1 min-w-0">
                <span className="block text-[13px] font-bold text-white truncate">
                  {r.prize} {r.title}
                </span>
                <span className="block text-[11px] text-[#64748B] mt-0.5 truncate">{r.draw}</span>
              </span>
              <span className="text-[12px] font-semibold text-[#94A3B8] shrink-0">
                {r.count} {r.count === 1 ? 'entry' : 'entries'} ›
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <p className="text-[15px] font-bold text-white">No entries yet</p>
          <p className="text-[13px] text-[#94A3B8] mt-1">Enter a free draw to start collecting entries.</p>
          <button
            onClick={onExploreDraws}
            className="mt-4 h-12 px-6 rounded-2xl cta-gradient text-black text-[14px] font-bold shadow-cta"
          >
            Explore Draws →
          </button>
        </div>
      )}
    </div>
  );
};
