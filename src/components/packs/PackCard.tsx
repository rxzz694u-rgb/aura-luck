import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { Pack } from '../../types/packs';
import { filledCount } from '../../services/packBackend';
import { Countdown } from '../ui/Countdown';

interface PackCardProps {
  pack: Pack;
  onOpen: (pack: Pack) => void;
}

export const PackCard: React.FC<PackCardProps> = ({ pack, onOpen }) => {
  const filled = filledCount(pack.id);
  const pct = Math.round((filled / pack.totalSpots) * 100);
  const remaining = pack.totalSpots - filled;
  const done = pack.status === 'completed';
  const locked = pack.status === 'full' || pack.status === 'locked';

  return (
    <motion.article
      whileTap={{ scale: 0.985 }}
      onClick={() => onOpen(pack)}
      className="overflow-hidden rounded-[20px] bg-[#0B1220] border border-white/[0.08] cursor-pointer select-none animate-fade-up"
    >
      <div className={`relative h-48 bg-gradient-to-br ${pack.accent}`}>
        <div className="absolute inset-0 bg-black/25" />
        <img
          src={pack.productImage}
          alt={pack.productName}
          className="absolute inset-0 w-full h-full object-contain p-5 drop-shadow-[0_16px_28px_rgba(0,0,0,0.5)]"
          loading="lazy"
          draggable={false}
        />
        <span className="absolute top-2.5 left-2.5 text-[10px] font-black uppercase tracking-wide bg-black/55 backdrop-blur text-white border border-white/20 px-2.5 py-1 rounded-full">
          {pack.totalSpots} Spots
        </span>
        {done ? (
          <span className="absolute top-2.5 right-2.5 text-[10px] font-black uppercase bg-black/55 backdrop-blur text-[#19D37A] border border-[#19D37A]/40 px-2.5 py-1 rounded-full">
            Done
          </span>
        ) : locked ? (
          <span className="absolute top-2.5 right-2.5 text-[10px] font-black uppercase bg-black/55 backdrop-blur text-[#C8FF00] border border-[#C8FF00]/40 px-2.5 py-1 rounded-full">
            Full
          </span>
        ) : (
          <span className="absolute top-2.5 right-2.5 text-[10px] font-black uppercase bg-black/55 backdrop-blur text-white border border-white/20 px-2.5 py-1 rounded-full">
            {remaining} left
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-[16px] font-extrabold text-white tracking-tight truncate">{pack.name}</h3>
        <p className="text-[12px] text-[#94A3B8] truncate mt-0.5">{pack.productName} • {pack.prizeValue}</p>

        <div className="mt-2.5 flex items-center justify-between text-[12px] font-bold">
          <span className="text-white tabular-nums">{filled} / {pack.totalSpots} Filled</span>
          <span className="text-[#C8FF00]">{pack.currency} {pack.entryPrice}</span>
        </div>
        <div className="mt-1.5 h-2 rounded-full bg-white/[0.07] overflow-hidden">
          <div className="h-full rounded-full bg-[#C8FF00] transition-all" style={{ width: `${pct}%` }} />
        </div>

        <div className="mt-3 pt-3 border-t border-white/[0.08] flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
            <Clock className="w-3.5 h-3.5" />
            <Countdown targetDate={pack.endAt} variant="minimal" className="text-[11px] font-bold text-[#94A3B8]" />
          </span>
          <span className="flex items-center gap-1 text-[13px] font-black text-black bg-[#C8FF00] px-4 h-9 rounded-xl">
            {done ? 'Result' : locked ? 'View' : 'Join Pack'} <ArrowRight className="w-3.5 h-3.5" strokeWidth={3} />
          </span>
        </div>
      </div>
    </motion.article>
  );
};
