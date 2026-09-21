import React from 'react';
import { Entry } from '../../types';
import { Calendar, Ticket, Send, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface EntryCardProps {
  entry: Entry;
  onViewDetails?: (entry: Entry) => void;
}

export const EntryCard: React.FC<EntryCardProps> = ({ entry, onViewDetails }) => {
  return (
    <motion.div
      whileTap={{ scale: 0.985 }}
      onClick={() => onViewDetails && onViewDetails(entry)}
      className="relative bg-[#0B1220] border border-white/[0.07] rounded-3xl overflow-hidden cursor-pointer select-none"
    >
      <div className="p-4 bg-[#0B1220]">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Ticket className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              VERIFIED TICKET PASS
            </span>
          </div>
          <span
            className={`text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
              entry.status === 'active'
                ? 'bg-[#C8FF00]/15 text-white border-[#C8FF00]/30'
                : entry.status === 'won'
                ? 'bg-purple-500/15 text-purple-300 border-purple-400/30'
                : 'bg-white/[0.06] text-zinc-400 border-white/[0.08]'
            }`}
          >
            {entry.status}
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-[11px] text-zinc-500 font-bold uppercase">Ticket ID</span>
            <p className="font-mono text-[19px] font-black text-white tracking-tight">{entry.ticketId}</p>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-zinc-500 font-bold uppercase">Prize Pool</span>
            <p className="text-[17px] font-black tracking-tight cta-gradient-text">{entry.prizeAmount}</p>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-white/[0.07] flex items-center justify-between text-[12px]">
          <span className="font-semibold text-white line-clamp-1 max-w-[200px]">{entry.giveawayTitle}</span>
          <div className="flex items-center gap-1 shrink-0 text-zinc-400">
            <Calendar className="w-3 h-3" />
            <span>{entry.drawDateFormatted.split('•')[0]}</span>
          </div>
        </div>
      </div>

      <div className="relative w-full h-4 bg-white/[0.03] flex items-center justify-center">
        <div className="absolute -left-2.5 w-5 h-5 rounded-full bg-[#0B0E13] border-r border-white/[0.07]" />
        <div className="w-full border-t border-dashed border-white/[0.12] mx-4" />
        <div className="absolute -right-2.5 w-5 h-5 rounded-full bg-[#0B0E13] border-l border-white/[0.07]" />
      </div>

      <div className="px-4 py-2.5 bg-white/[0.03] flex items-center justify-between text-[12px]">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <div className="w-4 h-4 rounded-full bg-[#0088CC]/15 text-sky-300 flex items-center justify-center">
            <Send className="w-2.5 h-2.5" />
          </div>
          {entry.telegramSynced ? (
            <span className="text-[11px]">
              Synced to <span className="font-bold text-white">{entry.telegramUsername || '@alex92'}</span>
            </span>
          ) : (
            <span className="text-[11px]">Telegram not connected</span>
          )}
        </div>
        <div className="flex items-center gap-1 text-white font-bold text-[11px]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Confirmed</span>
        </div>
      </div>
    </motion.div>
  );
};
