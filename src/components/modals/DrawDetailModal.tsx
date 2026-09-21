import React from 'react';
import { Giveaway } from '../../types';
import { BottomSheet } from '../ui/BottomSheet';
import { Countdown } from '../ui/Countdown';
import { ArrowLeft, Share2, Clock, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import { formatPlayers } from '../draw/DrawCard';

interface DrawDetailModalProps {
  giveaway: Giveaway | null;
  isOpen: boolean;
  onClose: () => void;
  onEnter: (giveaway: Giveaway) => void;
  hasEntered: boolean;
  onConnectTelegram?: () => void;
  isTelegramConnected?: boolean;
  onShare?: (giveaway: Giveaway) => void;
}

const STEPS = [
  { n: 1, title: 'Enter for free', sub: 'No purchase required' },
  { n: 2, title: 'Get your entry', sub: '1 entry per person' },
  { n: 3, title: 'Wait for the draw', sub: 'Live results & instant win' },
];

export const DrawDetailModal: React.FC<DrawDetailModalProps> = ({
  giveaway,
  isOpen,
  onClose,
  onEnter,
  hasEntered,
  onShare,
}) => {
  if (!giveaway) return null;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      maxHeight="max-h-[92dvh]"
      footer={
        <button
          onClick={() => onEnter(giveaway)}
          disabled={hasEntered}
          className="w-full h-14 rounded-2xl cta-gradient text-black font-bold text-[15px] shadow-cta hover:brightness-110 disabled:opacity-70 active:scale-[0.99] flex items-center justify-center gap-2"
        >
          {hasEntered ? 'Already Entered' : 'Enter Draw Free'}
          {!hasEntered && <ArrowRight className="w-4 h-4" />}
        </button>
      }
    >
      <div className="flex flex-col pb-2">
        <div className="flex items-center justify-between pb-2.5">
          <button
            onClick={onClose}
            aria-label="Back"
            className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white active:scale-95"
          >
            <ArrowLeft className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={() => onShare && onShare(giveaway)}
            aria-label="Share"
            className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#94A3B8] hover:text-white active:scale-95"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <div className="relative rounded-[20px] overflow-hidden bg-[#080D19] border border-white/[0.08]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-[#C8FF00]/20 blur-3xl pointer-events-none" />
          <img
            src={giveaway.image}
            alt={giveaway.title}
            className="relative w-full h-48 min-[380px]:h-56 object-contain p-3"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/80 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="pt-3.5">
          <span className="inline-flex max-w-full text-[11px] font-bold cta-gradient text-black px-3 py-1.5 rounded-full truncate">
            {giveaway.subtitle || `${giveaway.tier} Draw`}
          </span>
          <h2 className="mt-2 text-[26px] leading-[1.08] font-black text-white tracking-tight break-words">
            {giveaway.prizeAmount}
            <br />
            <span className="text-[19px] font-extrabold">{giveaway.title}</span>
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-[#94A3B8] break-words">{giveaway.description}</p>

          <div className="mt-3.5 grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl bg-black/25 border border-white/[0.08] p-3 flex items-center gap-2 min-w-0">
              <Clock className="w-5 h-5 text-[#64748B] shrink-0" />
              <span className="flex flex-col leading-tight min-w-0">
                <span className="text-[10px] text-[#64748B]">Ends in</span>
                <Countdown targetDate={giveaway.endsAt} variant="minimal" className="text-[12px] font-bold text-white tabular-nums truncate" />
              </span>
            </div>
            <div className="rounded-2xl bg-black/25 border border-white/[0.08] p-3 flex items-center gap-2 min-w-0">
              <Users className="w-5 h-5 text-[#64748B] shrink-0" />
              <span className="flex flex-col leading-tight min-w-0">
                <span className="text-[13px] font-bold text-white">{formatPlayers(giveaway.totalEntrants)}</span>
                <span className="text-[10px] text-[#64748B]">Players</span>
              </span>
            </div>
          </div>

          <div className="mt-3 rounded-[20px] bg-[#0B1220] border border-white/[0.08] p-3.5">
            <p className="text-[13px] font-bold text-white">How it works?</p>
            <div className="mt-2.5 flex flex-col gap-2.5">
              {STEPS.map((s) => (
                <div key={s.n} className="flex items-center gap-2.5 min-w-0">
                  <span className="w-8 h-8 rounded-full cta-gradient text-black text-[13px] font-black flex items-center justify-center shrink-0">
                    {s.n}
                  </span>
                  <span className="flex flex-col leading-tight min-w-0">
                    <span className="text-[13px] font-bold text-white truncate">{s.title}</span>
                    <span className="text-[11px] text-[#64748B] truncate">{s.sub}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-[#64748B]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#19D37A] shrink-0" />
            <span className="truncate">Provably fair · Seed {giveaway.seedHash.slice(0, 12)}...</span>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};
