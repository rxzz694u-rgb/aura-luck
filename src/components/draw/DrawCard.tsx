import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Clock, Users } from 'lucide-react';
import { Giveaway } from '../../types';
import { Countdown } from '../ui/Countdown';

interface DrawCardProps {
  giveaway: Giveaway;
  onSelect: (giveaway: Giveaway) => void;
  featured?: boolean;
}

export function formatPlayers(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return `${n}`;
}

export const DrawCard: React.FC<DrawCardProps> = ({ giveaway, onSelect, featured }) => {
  return (
    <motion.article
      whileTap={{ scale: 0.985 }}
      onClick={() => onSelect(giveaway)}
      className="card overflow-hidden cursor-pointer select-none animate-fade-up"
    >
      <div className="relative h-44 bg-[#080D19]">
        <img
          src={giveaway.image}
          alt={giveaway.title}
          className="w-full h-full object-cover"
          loading="lazy"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent" />
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
              featured || giveaway.isFeatured
                ? 'cta-gradient text-black'
                : giveaway.isLive
                ? 'bg-[#19D37A]/20 text-[#19D37A] border border-[#19D37A]/40'
                : 'bg-black/50 text-white border border-white/15 backdrop-blur'
            }`}
          >
            {featured || giveaway.isFeatured ? 'Featured' : giveaway.isLive ? 'Live' : 'New'}
          </span>
        </div>
        <span className="absolute top-2.5 right-2.5 text-[10px] font-black uppercase tracking-wide bg-black/55 backdrop-blur text-[#19D37A] border border-[#19D37A]/40 px-2.5 py-1 rounded-full">
          Free
        </span>
      </div>

      <div className="p-4">
        <p className="text-[11px] font-semibold text-[#64748B]">
          {giveaway.subtitle || `${giveaway.tier} Draw`}
        </p>
        <h3 className="text-[17px] font-extrabold text-white tracking-tight mt-0.5 leading-tight">
          {giveaway.prizeAmount}
        </h3>
        <p className="text-[12px] text-[#94A3B8] truncate mt-0.5">{giveaway.title}</p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.08]">
          <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#94A3B8]">
            <Clock className="w-3.5 h-3.5 text-[#64748B]" />
            <Countdown targetDate={giveaway.endsAt} variant="minimal" className="text-[12px] font-bold text-white" />
          </span>
          <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#94A3B8]">
            <Users className="w-3.5 h-3.5 text-[#64748B]" />
            {formatPlayers(giveaway.totalEntrants)}
            <ChevronRight className="w-4 h-4 text-[#64748B]" />
          </span>
        </div>
      </div>
    </motion.article>
  );
};
