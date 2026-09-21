import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Minus, Plus, Volume2, VolumeX, Zap, X } from 'lucide-react';
import { Giveaway } from '../../types';
import { buildPackStrip, getPossibleDrops } from '../../services/packService';
import { SoundService } from '../../services/soundService';
import { PackSpinner } from '../packs/PackSpinner';
import { triggerPackWinConfetti } from '../ui/Confetti';

interface PackOpenModalProps {
  giveaway: Giveaway | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenPack: (giveaway: Giveaway) => void;
  hasEntered: boolean;
}

export const PackOpenModal: React.FC<PackOpenModalProps> = ({ giveaway, isOpen, onClose, onOpenPack }) => {
  const [qty, setQty] = useState(1);
  const [fast, setFast] = useState(false);
  const [muted, setMuted] = useState(SoundService.isMuted());
  const [spinning, setSpinning] = useState(false);
  const [round, setRound] = useState(0);
  const [won, setWon] = useState(false);

  const strip = useMemo(() => {
    if (!giveaway) return null;
    return buildPackStrip(giveaway);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [giveaway?.id, round]);

  const lineup = useMemo(() => {
    if (!giveaway) return [];
    return getPossibleDrops(giveaway, 16);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [giveaway?.id]);

  if (!giveaway || !strip) return null;

  const startOpen = (demo: boolean) => {
    SoundService.unlock();
    setWon(false);
    setSpinning(false);
    requestAnimationFrame(() => {
      setRound((r) => r + 1);
      setSpinning(true);
      SoundService.open();
    });
    if (demo) return;
  };

  const handleDone = (winItem: { rarity: 'common' | 'rare' | 'epic' | 'legendary'; name: string; value: string }) => {
    setSpinning(false);
    const isBig = winItem.rarity === 'legendary' || winItem.rarity === 'epic';
    if (isBig) {
      SoundService.win(winItem.rarity);
      triggerPackWinConfetti();
    } else if (winItem.rarity === 'rare') {
      SoundService.win('rare');
    } else {
      SoundService.lose();
    }
    setWon(true);
    onOpenPack(giveaway);
  };

  const winItem = strip.items[strip.winIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#050812] flex flex-col overflow-y-auto no-scrollbar"
        >
          <div className="w-full max-w-[920px] mx-auto px-4 pt-4 flex items-center justify-between">
            <button onClick={onClose} className="flex items-center gap-1.5 text-[13px] font-bold text-zinc-400 hover:text-white h-10 px-2">
              <ArrowLeft className="w-4 h-4" /> Back to Packs
            </button>
            <button onClick={onClose} aria-label="Close" className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-zinc-200 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="w-full max-w-[920px] mx-auto px-2 mt-1">
            <PackSpinner key={round} items={strip.items} winIndex={strip.winIndex} spinning={spinning} fast={fast} onDone={handleDone} />
          </div>

          {/* Clean friendly controls */}
          <div className="w-full max-w-[560px] mx-auto px-4">
            <div className="rounded-3xl bg-[#0B1220] border border-white/[0.08] p-3.5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={spinning}
                    aria-label="Decrease quantity"
                    className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white flex items-center justify-center hover:bg-white/[0.09] disabled:opacity-40 active:scale-95"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-[14px] font-black text-white min-w-[32px] text-center tabular-nums">x{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(5, q + 1))}
                    disabled={spinning}
                    aria-label="Increase quantity"
                    className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white flex items-center justify-center hover:bg-white/[0.09] disabled:opacity-40 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setMuted(SoundService.toggleMuted())}
                    title={muted ? 'Unmute' : 'Mute'}
                    aria-label="Toggle sound"
                    className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] text-zinc-300 hover:text-white flex items-center justify-center active:scale-95"
                  >
                    {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setFast((f) => !f)}
                    title="Fast open"
                    className={`h-10 px-3.5 rounded-xl text-[11px] font-black uppercase tracking-wide border transition-all active:scale-95 ${
                      fast ? 'bg-[#C8FF00] text-black border-transparent' : 'bg-white/[0.05] text-zinc-300 border-white/[0.08]'
                    }`}
                  >
                    Fast
                  </button>
                </div>
              </div>

              <button
                disabled={spinning}
                onClick={() => startOpen(false)}
                className="w-full h-14 rounded-2xl bg-[#C8FF00] text-black font-black text-[16px] flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-60 active:scale-[0.99] transition-all"
              >
                <Zap className="w-5 h-5" strokeWidth={3} />
                {spinning ? 'Opening…' : 'Open Free'}
              </button>
              <button
                disabled={spinning}
                onClick={() => startOpen(true)}
                className="w-full h-12 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-zinc-200 font-bold text-[14px] hover:bg-white/[0.09] disabled:opacity-40"
              >
                Try Demo
              </button>
            </div>

            {/* result card */}
            <div className="mt-3 rounded-3xl bg-[#0B1220] border border-white/[0.08] p-4 flex items-center gap-3">
              <img src={(won ? winItem.image : giveaway.image)} alt={giveaway.title} className="w-14 h-14 rounded-2xl object-contain bg-white/[0.05] p-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-black text-white truncate">{giveaway.title}</p>
                <p className="text-[13px] font-black text-[#C8FF00]">{giveaway.prizeAmount}</p>
                <p className="text-[12px] text-zinc-500 truncate">
                  {spinning ? 'Spinning… listen for ticks' : won ? `Won: ${winItem.name} • ${winItem.value}` : 'Free to open • Provably fair'}
                </p>
              </div>
            </div>

            <p className="mt-4 mb-1 text-[11px] font-black uppercase tracking-widest text-zinc-500">
              Possible drops • {lineup.length} products
            </p>
            <div className="grid grid-cols-4 gap-2 pb-20">
              {lineup.map((it) => (
                <div
                  key={it.id}
                  className={`rounded-2xl bg-[#0B1220] border p-2 flex flex-col items-center ${
                    it.rarity === 'legendary'
                      ? 'border-[#C8FF00]/60'
                      : it.rarity === 'epic'
                      ? 'border-purple-400/40'
                      : it.rarity === 'rare'
                      ? 'border-sky-400/30'
                      : 'border-white/[0.08]'
                  }`}
                >
                  <img src={it.image} alt={it.name} className="w-11 h-11 object-contain" loading="lazy" />
                  <span className="mt-1 text-[9px] font-bold text-zinc-400 truncate w-full text-center">{it.name}</span>
                  <span className={`text-[11px] font-black truncate w-full text-center ${it.rarity === 'common' ? 'text-zinc-500' : 'text-[#C8FF00]'}`}>
                    {it.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
