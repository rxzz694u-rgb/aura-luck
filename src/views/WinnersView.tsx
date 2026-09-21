import React from 'react';
import { Winner } from '../types';
import { WinnerCard } from '../components/cards/WinnerCard';
import { Trophy, Play, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface WinnersViewProps {
  winners: Winner[];
  onSelectWinner: (winner: Winner) => void;
  onWatchReveal: () => void;
  onOpenHowItWorks: () => void;
}

export const WinnersView: React.FC<WinnersViewProps> = ({
  winners,
  onSelectWinner,
  onWatchReveal,
  onOpenHowItWorks,
}) => {
  return (
    <div className="flex flex-col gap-4 px-4 md:px-0 pt-2 pb-24">
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col">
          <span className="text-[11px] font-black text-[#C8FF00] uppercase tracking-widest">Verified Results</span>
          <h1 className="text-[26px] font-black text-white tracking-tight mt-0.5">Recent Winners</h1>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C8FF00]/15 text-[#C8FF00] text-[11px] font-black border border-[#C8FF00]/40">
          <Trophy className="w-3.5 h-3.5" />
          <span>Provably Fair</span>
        </div>
      </div>

      <motion.div
        whileTap={{ scale: 0.985 }}
        onClick={onWatchReveal}
        className="relative bg-[#0B1220] border border-[#C8FF00]/30 rounded-[24px] p-5 text-white cursor-pointer select-none overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#C8FF00]/15 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex flex-col max-w-[240px]">
            <span className="text-[10px] font-black uppercase tracking-widest text-black bg-[#C8FF00] px-2.5 py-0.5 rounded-full self-start mb-2">
              Latest draw replay
            </span>
            <h3 className="text-[20px] font-black tracking-tight leading-tight text-white">Watch $500 Reveal</h3>
            <p className="text-[12px] text-zinc-400 mt-1 leading-snug">Winner announcement with synced sound</p>
          </div>
          <div className="w-12 h-12 rounded-full cta-gradient text-black flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col gap-2.5 mt-1">
        {winners.map((winner) => (
          <WinnerCard key={winner.id} winner={winner} onSelect={onSelectWinner} />
        ))}
      </div>

      <div className="bg-[#0B1220] rounded-2xl p-4 border border-white/[0.07] flex flex-col gap-2 mt-2 text-left">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#C8FF00]" />
          <h4 className="text-[13px] font-bold text-white">How Are Winners Selected?</h4>
        </div>
        <p className="text-[12px] text-zinc-400 leading-relaxed">
          Every draw uses a published SHA-256 seed. The browser never decides the winner; draws close strictly on the server and are verifiable by all participants.
        </p>
        <button onClick={onOpenHowItWorks} className="text-[12px] font-bold text-[#C8FF00] hover:brightness-110 text-left self-start mt-0.5">
          Learn more about Provably Fair draws →
        </button>
      </div>
    </div>
  );
};
