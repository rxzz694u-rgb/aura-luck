import React from 'react';
import { Giveaway, UserProfile } from '../types';
import { DrawCard, formatPlayers } from '../components/draw/DrawCard';
import { Countdown } from '../components/ui/Countdown';
import { Clock, ArrowRight, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

interface HomeViewProps {
  giveaways: Giveaway[];
  user: UserProfile;
  onSelectGiveaway: (giveaway: Giveaway) => void;
  onEnterGiveaway: (giveaway: Giveaway) => void;
  hasEntered: (giveawayId: string) => boolean;
  onViewAllDraws: () => void;
  onOpenPackStudio?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  giveaways,
  onSelectGiveaway,
  hasEntered,
  onViewAllDraws,
  onOpenPackStudio,
}) => {
  const hero = giveaways.find((g) => g.id === 'draw-hero-5000') || giveaways[0];
  const popular = giveaways.slice(1, 5);

  return (
    <div className="flex flex-col gap-4 px-4 md:px-0 pt-2 pb-28">
      {/* HERO – Grand Draw */}
      <section className="relative card overflow-hidden p-5 pb-6 animate-fade-up">
        <div className="absolute -top-28 right-0 w-80 h-80 rounded-full bg-[#C8FF00]/[0.13] blur-3xl pointer-events-none animate-glow-drift" />
        <div className="absolute -bottom-28 -left-12 w-72 h-72 rounded-full bg-[#C8FF00]/[0.06] blur-3xl pointer-events-none" />
        <div className="absolute top-44 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full border border-white/[0.05] pointer-events-none" />
        <div className="absolute top-[212px] left-1/2 -translate-x-1/2 w-44 h-44 rounded-full border border-white/[0.06] pointer-events-none" />

        <span className="relative inline-flex items-center gap-1.5 text-[11px] font-black cta-gradient text-black px-3.5 py-1.5 rounded-full shadow-cta">
          <Gift className="w-3.5 h-3.5" strokeWidth={2.5} />
          {hero.subtitle || 'Grand Draw #130'}
        </span>

        <h1 className="relative mt-3 text-[38px] leading-[0.98] font-black tracking-tight text-white">
          Win
          <br />
          <span className="cta-gradient-text drop-shadow-[0_0_24px_rgba(200,255,0,0.25)]">{hero.prizeAmount}</span>
          <br />
          {hero.title}
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-[#94A3B8] max-w-[260px]">
          Big prizes. Real people. Simple to enter.
        </p>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative mx-auto w-60 h-60 cursor-pointer"
          onClick={() => onSelectGiveaway(hero)}
        >
          <div className="absolute inset-4 rounded-full bg-[#C8FF00]/25 blur-3xl" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-36 h-5 rounded-[50%] bg-black/60 blur-md" />
          <img
            src={hero.image}
            alt={hero.title}
            className="relative w-full h-full object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.6)]"
            draggable={false}
          />
        </motion.div>

        <div className="relative flex items-stretch rounded-2xl bg-black/30 border border-white/[0.08] px-4 py-3.5">
          <span className="flex-1 flex items-center gap-2.5 text-[12px] text-[#94A3B8]">
            <Clock className="w-[18px] h-[18px] text-[#C8FF00] shrink-0" />
            <span className="flex flex-col leading-tight">
              <span className="text-[10px] text-[#64748B]">Ends in</span>
              <Countdown targetDate={hero.endsAt} variant="minimal" className="text-[14px] font-black text-white tabular-nums" />
            </span>
          </span>
          <span className="w-px bg-white/[0.08] mx-1" />
          <span className="flex-1 flex items-center justify-end gap-2.5 text-[12px] text-[#94A3B8]">
            <span className="flex flex-col leading-tight text-right">
              <span className="text-[14px] font-black text-white tabular-nums">{formatPlayers(hero.totalEntrants)}</span>
              <span className="text-[10px] text-[#64748B]">Players</span>
            </span>
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8FF00] opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C8FF00]" />
            </span>
          </span>
        </div>

        <button
          onClick={() => onSelectGiveaway(hero)}
          className="relative mt-3.5 w-full h-14 rounded-2xl cta-gradient text-black font-black text-[15px] shadow-cta hover:brightness-110 active:scale-[0.99] flex items-center justify-center gap-2 overflow-hidden group"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          {hasEntered(hero.id) ? 'View Your Entry' : 'Enter Draw Free'}
          <ArrowRight className="w-4 h-4" strokeWidth={3} />
        </button>
        <p className="relative mt-2 text-center text-[11px] font-semibold text-[#64748B]">
          Free entry • 1 entry per person • Provably fair
        </p>
      </section>

      {/* IPHONE DUO — new banner with original product shots */}
      {(() => {
        const duo = giveaways.find((g) => g.id === 'draw-iphone-16') || popular[0];
        if (!duo) return null;
        return (
          <section
            onClick={() => onSelectGiveaway(duo)}
            className="relative card overflow-hidden p-5 cursor-pointer active:scale-[0.99] transition-transform"
          >
            <div className="absolute -top-20 -left-16 w-64 h-64 rounded-full bg-[#C8FF00]/[0.12] blur-3xl pointer-events-none" />
            <div className="relative flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-black bg-[#C8FF00] px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" /> New
                </span>
                <h3 className="mt-2 text-[22px] font-black text-white leading-tight tracking-tight">
                  iPhone Duo
                </h3>
                <p className="text-[12px] text-[#94A3B8] mt-1 leading-snug">
                  {duo.title} • {duo.prizeAmount}
                </p>
                <span className="mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-black text-[#C8FF00]">
                  View Draw <ArrowRight className="w-4 h-4" strokeWidth={3} />
                </span>
              </div>
              <div className="relative w-36 h-40 shrink-0">
                <div className="absolute inset-0 rounded-full bg-[#C8FF00]/20 blur-2xl" />
                <img
                  src="/assets/cutouts/iphone-16.png"
                  alt="iPhone 16 Pro front"
                  className="absolute left-0 top-2 w-[74px] h-[130px] object-contain -rotate-12 drop-shadow-[0_14px_20px_rgba(0,0,0,0.6)]"
                  loading="lazy"
                  draggable={false}
                />
                <img
                  src="/assets/cutouts/iphone-16.png"
                  alt="iPhone 16 Pro back"
                  className="absolute right-0 top-4 w-[74px] h-[130px] object-contain rotate-12 scale-x-[-1] drop-shadow-[0_14px_20px_rgba(0,0,0,0.6)]"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            </div>
          </section>
        );
      })()}

      {/* POPULAR DRAWS */}
      <div className="flex items-center justify-between px-1 pt-1">
        <h2 className="text-[17px] font-extrabold text-white tracking-tight">Popular Draws</h2>
        <button onClick={onViewAllDraws} className="text-[13px] font-semibold text-[#C8FF00]">
          View All
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {popular.map((g) => (
          <DrawCard key={g.id} giveaway={g} onSelect={onSelectGiveaway} />
        ))}
      </div>

      {/* PACK DRAW STUDIO PROMO */}
      <section className="relative card overflow-hidden p-5">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#C8FF00]/25 blur-3xl pointer-events-none" />
        <span className="text-[10px] font-black uppercase tracking-widest text-[#C8FF00]">
          Pack Draw Studio
        </span>
        <h3 className="mt-1 text-[19px] font-extrabold text-white leading-tight">
          Instant unboxing mystery packs
        </h3>
        <p className="text-[12px] text-[#94A3B8] mt-1">Tech, Cash &amp; Luxury rewards.</p>
        <button
          onClick={onOpenPackStudio ? onOpenPackStudio : onViewAllDraws}
          className="mt-3 h-12 px-6 rounded-2xl cta-gradient text-black font-bold text-[14px] shadow-cta hover:brightness-110 active:scale-[0.99] flex items-center gap-2"
        >
          Unbox Now <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* REFERRAL */}
      <section className="card p-4 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl cta-gradient flex items-center justify-center shrink-0">
          <Gift className="w-5 h-5 text-black" />
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-bold text-white">Invite Friends</p>
          <p className="text-[12px] text-[#94A3B8]">Get extra entries &amp; rewards</p>
        </div>
        <ArrowRight className="w-4 h-4 text-[#64748B]" />
      </section>
    </div>
  );
};
