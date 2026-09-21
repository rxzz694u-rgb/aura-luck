import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Clock, Users, ShieldCheck, Check } from 'lucide-react';
import { Pack, PackEntry, PackResult } from '../../types/packs';
import {
  packEntries, myEntry, getResult, freeSlots, joinPack, runDraw, getRegion,
  CURRENT_USER_ID, CURRENT_USERNAME,
} from '../../services/packBackend';
import { Countdown } from '../ui/Countdown';
import { triggerPackWinConfetti } from '../ui/Confetti';

interface PackDetailModalProps {
  pack: Pack | null;
  isOpen: boolean;
  refreshKey: number;
  onClose: () => void;
  onChanged: () => void;
  charge: (amount: number, label: string) => { ok: boolean; error?: string };
  onNeedFunds: () => void;
}

// --- draw show: fast shuffle → slow down → winner --------------------------------
const DrawShow: React.FC<{ total: number; winner: number; onLanded: () => void }> = ({ total, winner, onLanded }) => {
  const [num, setNum] = useState(1);
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    let step = 0;
    const STEPS = 34;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      step += 1;
      if (step >= STEPS) {
        setNum(winner);
        setLanded(true);
        onLanded();
        return;
      }
      // ease: interval grows quadratically (fast → slow)
      const p = step / STEPS;
      setNum(1 + Math.floor(Math.random() * total));
      timer = setTimeout(tick, 70 + p * p * 620);
    };
    timer = setTimeout(tick, 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, winner]);

  return (
    <div className="rounded-[20px] bg-black/30 border border-white/[0.08] p-6 flex flex-col items-center">
      <p className="text-[11px] font-black uppercase tracking-widest text-[#94A3B8]">
        {landed ? 'Winner' : 'Drawing…'}
      </p>
      <motion.p
        key={num + String(landed)}
        initial={{ scale: 0.8, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`mt-1 text-[64px] leading-none font-black tabular-nums ${landed ? 'text-[#C8FF00]' : 'text-white'}`}
      >
        {String(num).padStart(2, '0')}
      </motion.p>
      {landed && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-center">
          <p className="text-[15px] font-black text-white">SPOT #{String(winner).padStart(2, '0')} WINS</p>
        </motion.div>
      )}
    </div>
  );
};

export const PackDetailModal: React.FC<PackDetailModalProps> = ({
  pack, isOpen, refreshKey, onClose, onChanged, charge, onNeedFunds,
}) => {
  const [tick, setTick] = useState(0);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirm18, setConfirm18] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [drawnWinner, setDrawnWinner] = useState<number | null>(null);
  void tick;

  const pid = pack?.id;
  const entries = useMemo(() => (pid ? packEntries(pid) : []), [pid, refreshKey, tick]);
  const mine = useMemo(() => (pid ? myEntry(pid) : undefined), [pid, refreshKey, tick]);
  const result = useMemo(() => (pid ? getResult(pid) : undefined), [pid, refreshKey, tick, drawnWinner]);
  const free = useMemo(() => (pid ? freeSlots(pid) : []), [pid, refreshKey, tick]);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setDrawing(false);
      setDrawnWinner(null);
      setConfirm18(false);
      setTick((t) => t + 1);
    }
  }, [isOpen, pid, refreshKey]);

  // Auto-run the draw when a full pack is opened with no result yet
  useEffect(() => {
    if (isOpen && pack && (pack.status === 'full' || pack.status === 'locked') && !getResult(pack.id)) {
      const t = setTimeout(() => startDraw(), 1200);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, pid]);

  if (!pack) return null;
  const filled = entries.length;
  const remaining = pack.totalSpots - filled;
  const pct = Math.round((filled / pack.totalSpots) * 100);
  const isFull = pack.status === 'full' || pack.status === 'locked';
  const isDone = pack.status === 'completed';
  const regionBlocked = pack.blockedRegions.includes(getRegion());
  const expired = new Date(pack.endAt).getTime() < Date.now();
  const bySlot = new Map(entries.map((e) => [e.slotNumber, e]));

  const doJoin = () => {
    setError(null);
    setJoining(true);
    try {
      const res = joinPack(pack.id, { id: CURRENT_USER_ID, username: CURRENT_USERNAME }, (amt, label) => {
        const c = charge(amt, label);
        if (!c.ok && c.error === 'Insufficient balance') onNeedFunds();
        return c;
      });
      if (!res.ok) {
        setError(res.error || 'Could not join');
      } else {
        onChanged();
        setTick((t) => t + 1);
        if (res.packFilled) startDraw();
      }
    } finally {
      setJoining(false);
    }
  };

  const startDraw = async () => {
    if (drawing) return;
    setDrawing(true);
    setError(null);
    try {
      const res: PackResult = await runDraw(pack.id);
      setDrawnWinner(res.winningSlot);
      onChanged();
      setTick((t) => t + 1);
    } catch (e: any) {
      setError(e.message || 'Draw failed');
      setDrawing(false);
    }
  };

  const handleLanded = () => {
    triggerPackWinConfetti();
  };

  const cta = (() => {
    if (isDone) return null;
    if (mine)
      return (
        <div className="w-full rounded-2xl bg-[#C8FF00]/10 border border-[#C8FF00]/30 p-3.5 text-center">
          <p className="text-[13px] font-black text-[#C8FF00]">You are Spot #{String(mine.slotNumber).padStart(2, '0')} in this pack</p>
        </div>
      );
    if (regionBlocked) return <Notice text="Not available in your region" />;
    if (expired) return <Notice text="This pack has expired" />;
    if (isFull)
      return (
        <button onClick={startDraw} disabled={drawing} className="w-full h-14 rounded-2xl bg-[#C8FF00] text-black font-black text-[15px] disabled:opacity-60 active:scale-[0.99]">
          {drawing ? 'Drawing…' : 'PACK FULL — Run Draw'}
        </button>
      );
    if (pack.status !== 'published') return <Notice text="This pack is not open right now" />;
    return (
      <div className="flex flex-col gap-2">
        <label className="flex items-start gap-2 text-[11px] text-[#94A3B8] leading-snug cursor-pointer">
          <input type="checkbox" checked={confirm18} onChange={(e) => setConfirm18(e.target.checked)} className="mt-0.5 accent-[#C8FF00]" />
          I confirm I&apos;m 18+, in an eligible region, and accept the pack terms.
        </label>
        <button
          onClick={doJoin}
          disabled={joining || !confirm18}
          className="w-full h-14 rounded-2xl bg-[#C8FF00] text-black font-black text-[15px] disabled:opacity-40 active:scale-[0.99]"
        >
          {joining ? 'Joining…' : `Join Pack • ${pack.currency} ${pack.entryPrice}`}
        </button>
      </div>
    );
  })();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#050812] flex flex-col overflow-y-auto no-scrollbar">
          <div className="w-full max-w-[560px] mx-auto px-4 pt-4 flex items-center justify-between shrink-0">
            <button onClick={onClose} className="flex items-center gap-1.5 text-[13px] font-bold text-[#94A3B8] hover:text-white h-10 px-2">
              <ArrowLeft className="w-4 h-4" /> Back to Packs
            </button>
            <button onClick={onClose} aria-label="Close" className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-zinc-200 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="w-full max-w-[560px] mx-auto px-4 pb-40">
            <div className={`relative mt-2 rounded-[20px] overflow-hidden bg-gradient-to-br ${pack.accent}`}>
              <div className="absolute inset-0 bg-black/30" />
              <img src={pack.productImage} alt={pack.productName} className="relative w-full h-56 object-contain p-4 drop-shadow-[0_20px_36px_rgba(0,0,0,0.55)]" draggable={false} />
            </div>

            <h2 className="mt-3 text-[22px] font-black text-white tracking-tight">{pack.name}</h2>
            <p className="text-[13px] text-[#94A3B8] mt-0.5">{pack.productName} • {pack.prizeValue}</p>
            <p className="text-[12px] text-[#64748B] mt-1 leading-relaxed">{pack.description}</p>

            <div className="mt-3 rounded-[20px] bg-[#0B1220] border border-white/[0.08] p-4">
              <div className="flex items-center justify-between text-[13px] font-black">
                <span className="text-white tabular-nums">{filled} / {pack.totalSpots} Spots Filled</span>
                <span className="text-[#C8FF00]">{remaining} spots left</span>
              </div>
              <div className="mt-2 h-2.5 rounded-full bg-white/[0.07] overflow-hidden">
                <div className="h-full rounded-full bg-[#C8FF00] transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-3 flex items-center gap-4 text-[12px] text-[#94A3B8]">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#64748B]" /><Countdown targetDate={pack.endAt} variant="minimal" className="font-bold text-white" /></span>
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-[#64748B]" />{pack.currency} {pack.entryPrice} / spot</span>
              </div>
            </div>

            {(drawnWinner || result) ? (
              <div className="mt-3">
                <DrawShow total={pack.totalSpots} winner={(result?.winningSlot ?? drawnWinner) || 0} onLanded={handleLanded} />
                {result && (
                  <div className="mt-2 rounded-[20px] bg-[#0B1220] border border-[#C8FF00]/25 p-4">
                    <p className="text-[13px] font-black text-[#C8FF00] flex items-center gap-1.5"><Check className="w-4 h-4" /> Winner: {result.winnerUsername} — Spot #{String(result.winningSlot).padStart(2, '0')}</p>
                    <p className="mt-1.5 text-[10px] font-mono text-[#64748B] break-all">audit {result.auditHash}</p>
                    <p className="mt-0.5 text-[10px] text-[#64748B]">{result.drawMethod}</p>
                  </div>
                )}
              </div>
            ) : drawing ? (
              <div className="mt-3 rounded-[20px] bg-black/30 border border-white/[0.08] p-6 text-center">
                <p className="text-[13px] font-bold text-white">PACK FULL — locking spots…</p>
                <p className="text-[12px] text-[#94A3B8] mt-1">Secure draw starting</p>
              </div>
            ) : null}

            <p className="mt-4 mb-2 text-[11px] font-black uppercase tracking-widest text-[#64748B]">Spots</p>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: pack.totalSpots }, (_, i) => i + 1).map((s) => {
                const e: PackEntry | undefined = bySlot.get(s);
                const isMine = e && e.userId === CURRENT_USER_ID;
                return (
                  <div
                    key={s}
                    title={e ? e.username : `Spot ${s} open`}
                    className={`h-12 rounded-xl flex items-center justify-center text-[13px] font-black tabular-nums border transition-all ${
                      isMine
                        ? 'bg-[#C8FF00] text-black border-transparent'
                        : e
                        ? 'bg-white/[0.05] text-[#94A3B8] border-white/[0.08]'
                        : 'bg-transparent text-[#64748B] border-dashed border-white/[0.12]'
                    }`}
                  >
                    {String(s).padStart(2, '0')}
                  </div>
                );
              })}
            </div>

            {error && <p className="mt-3 text-[13px] font-semibold text-rose-400">{error}</p>}

            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#64748B]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#19D37A] shrink-0" />
              <span>Secure draw • One spot per user • Locked when full • 18+ only</span>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 z-10 bg-[#050812]/90 backdrop-blur-xl border-t border-white/[0.08] px-4 pt-3 pb-safe">
            <div className="max-w-[560px] mx-auto">{cta}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Notice: React.FC<{ text: string }> = ({ text }) => (
  <div className="w-full rounded-2xl bg-white/[0.04] border border-white/[0.08] p-3.5 text-center text-[13px] font-bold text-[#94A3B8]">
    {text}
  </div>
);
