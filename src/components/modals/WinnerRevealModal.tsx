import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { triggerWinnerRevealConfetti } from '../ui/Confetti';
import { Send, CheckCircle2, ShieldCheck, ArrowRight, X, Sparkles } from 'lucide-react';

interface WinnerRevealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewWinners: () => void;
  onJoinNextDraw: () => void;
}

export const WinnerRevealModal: React.FC<WinnerRevealModalProps> = ({
  isOpen,
  onClose,
  onViewWinners,
  onJoinNextDraw,
}) => {
  const [phase, setPhase] = useState<'anticipation' | 'revealed'>('anticipation');

  useEffect(() => {
    if (isOpen) {
      setPhase('anticipation');
      const timer = setTimeout(() => {
        setPhase('revealed');
        triggerWinnerRevealConfetti();
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-[400px] bg-[#f6f8fc] rounded-[36px] p-6 shadow-2xl flex flex-col items-center text-center overflow-hidden border border-white/60"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-zinc-500 hover:text-white z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Ambient Glows */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-tr from-purple-300/40 via-sky-300/30 to-pink-300/30 rounded-full blur-3xl pointer-events-none" />

          {/* Anticipation Phase */}
          {phase === 'anticipation' ? (
            <motion.div
              key="anticipation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 flex flex-col items-center"
            >
              <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.25, 1], rotate: [0, 180, 360] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-electric-purple"
                />
                <Sparkles className="w-10 h-10 text-electric-purple animate-pulse" />
              </div>

              <p className="text-[11px] font-bold text-electric-blue uppercase tracking-widest mb-1">
                Official Result
              </p>
              <h2 className="text-[26px] font-black text-white tracking-tight">
                And the winner is...
              </h2>
              <p className="text-[13px] text-zinc-400 mt-1">
                Verifying cryptographic draw seed
              </p>
            </motion.div>
          ) : (
            /* Revealed Phase */
            <motion.div
              key="revealed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="w-full flex flex-col items-center"
            >
              {/* Header */}
              <div className="text-center pt-1 pb-1">
                <p className="text-[11px] font-bold text-electric-blue uppercase tracking-widest mb-0.5">
                  Official Result
                </p>
                <h1 className="text-[26px] font-black tracking-tight text-white">
                  And the winner is...
                </h1>
              </div>

              {/* Glass Winner Showcase Card */}
              <section className="w-full bg-white/90 backdrop-blur-2xl rounded-[28px] p-5 shadow-ios-card border border-white/80 ring-1 ring-black/[0.04] relative overflow-hidden my-3">
                <div className="flex flex-col items-center text-center relative z-10">
                  {/* Avatar Spotlight Cluster */}
                  <div className="relative mb-3 mt-1">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#8455ef] via-[#007bb9] to-[#d23284] blur-lg opacity-50 scale-125" />
                    <div className="relative w-20 h-20 rounded-full p-1 bg-[#151923] shadow-md ring-1 ring-black/5">
                      <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                        alt="Portrait of Alex"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    {/* Telegram Badge */}
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0088CC] text-white flex items-center justify-center shadow-md ring-2 ring-white">
                      <Send className="w-3.5 h-3.5 -translate-x-0.5 translate-y-0.5" />
                    </div>
                  </div>

                  {/* Handle */}
                  <div className="inline-flex items-center gap-1.5 mb-1">
                    <span className="text-[20px] font-extrabold tracking-tight text-white">
                      @alex92
                    </span>
                    <CheckCircle2 className="w-5 h-5 text-[#0071E3]" />
                  </div>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-zinc-400 text-[11px] font-medium tracking-tight mb-3">
                    Telegram ID: 894***102
                  </div>

                  {/* Prize Callout */}
                  <div className="w-full py-3.5 px-3 bg-gradient-to-b from-white to-[#f3f6fc] rounded-2xl mb-3 border border-white/[0.07] shadow-sm flex flex-col items-center">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">
                      Grand Prize Winner
                    </span>
                    <span className="cash-gradient-text text-[32px] leading-none font-black tracking-tight my-1">
                      $500 CASH
                    </span>
                  </div>

                  {/* Ticket specs */}
                  <div className="w-full grid grid-cols-2 gap-2 pt-2 border-t border-dashed border-black/[0.08]">
                    <div className="p-2 bg-white/[0.04] rounded-xl text-left">
                      <p className="text-[10px] font-medium text-zinc-500">Winning Ticket</p>
                      <p className="text-[15px] text-electric-blue font-bold tracking-tight">#A82K91</p>
                    </div>
                    <div className="p-2 bg-white/[0.04] rounded-xl text-left">
                      <p className="text-[10px] font-medium text-zinc-500">Drawn On</p>
                      <p className="text-[12px] text-white font-semibold leading-snug">Sep 25, 2026</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Telegram Proof Verification Badge */}
              <section className="w-full bg-white/90 backdrop-blur-md rounded-2xl px-3.5 py-2.5 border border-white/[0.07] shadow-sm flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5 min-w-0 text-left">
                  <div className="w-8 h-8 rounded-full bg-[#0088CC]/10 text-[#0088CC] flex items-center justify-center shrink-0">
                    <Send className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-white leading-tight">
                      Winner notified via Telegram ✓
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono truncate mt-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
                      Seed: 0x7c94b2...82fa · Provably Fair
                    </p>
                  </div>
                </div>
              </section>

              {/* Actions */}
              <div className="flex flex-col gap-2 w-full">
                <Button
                  fullWidth
                  size="hero"
                  variant="primary"
                  onClick={() => {
                    onClose();
                    onJoinNextDraw();
                  }}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Join Next Free Draw ($1,000)
                </Button>

                <button
                  onClick={() => {
                    onClose();
                    onViewWinners();
                  }}
                  className="py-2 text-[13px] font-semibold text-zinc-400 hover:text-white transition-colors"
                >
                  View Previous Winners →
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
