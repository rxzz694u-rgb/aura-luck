import React from 'react';
import { Winner } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Send, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface WinnerCardProps {
  winner: Winner;
  onSelect?: (winner: Winner) => void;
}

export const WinnerCard: React.FC<WinnerCardProps> = ({ winner, onSelect }) => {
  return (
    <motion.div
      whileTap={{ scale: 0.985 }}
      onClick={() => onSelect && onSelect(winner)}
      className="bg-[#0B1220] rounded-2xl p-3.5 border border-white/[0.07] flex items-center justify-between cursor-pointer select-none hover:border-[#C8FF00]/25 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <Avatar src={winner.avatarUrl} alt={winner.username} size="md" isVerified={winner.telegramVerified} />
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[14px] font-bold text-white tracking-tight truncate">{winner.username}</span>
            {winner.telegramVerified && (
              <span className="w-3.5 h-3.5 rounded-full bg-[#0088CC] text-white flex items-center justify-center" title="Telegram Verified">
                <Send className="w-2 h-2" />
              </span>
            )}
          </div>
          <span className="text-[12px] text-zinc-400 truncate mt-0.5">{winner.prizeTitle}</span>
          <div className="flex items-center gap-1 mt-0.5 text-[10px] text-zinc-500">
            <ShieldCheck className="w-2.5 h-2.5 text-white" />
            <span className="font-mono">{winner.seedHash}</span>
          </div>
        </div>
      </div>
      <div className="text-right shrink-0 pl-2">
        <span className="text-[15px] font-black tracking-tight cta-gradient-text">{winner.prizeAmount}</span>
        <p className="text-[11px] text-zinc-500 font-medium mt-0.5">{winner.drawDateFormatted}</p>
      </div>
    </motion.div>
  );
};
