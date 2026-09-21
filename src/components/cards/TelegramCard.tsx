import React from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TelegramCardProps {
  isConnected: boolean;
  username?: string;
  onConnect: () => void;
  onManage?: () => void;
}

export const TelegramCard: React.FC<TelegramCardProps> = ({
  isConnected,
  username = '@alex92',
  onConnect,
  onManage,
}) => {
  return (
    <motion.div
      whileTap={{ scale: 0.985 }}
      onClick={() => {
        if (isConnected && onManage) onManage();
        else if (!isConnected) onConnect();
      }}
      className="bg-[#0B1220] rounded-3xl p-4 border border-white/[0.07] flex items-center justify-between gap-3 cursor-pointer select-none relative overflow-hidden"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-2xl bg-[#0088CC]/15 text-sky-300 flex items-center justify-center shrink-0">
          <Send className="w-5 h-5 -translate-x-0.5 translate-y-0.5" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[14px] font-bold text-white tracking-tight truncate">
            {isConnected ? 'Telegram Connected' : 'Stay connected'}
          </span>
          <span className="text-[12px] text-zinc-400 truncate mt-0.5">
            {isConnected ? `${username} • Notifications on` : 'Instant draw results on Telegram'}
          </span>
        </div>
      </div>
      <div className="shrink-0">
        {isConnected ? (
          <div className="flex items-center gap-1 bg-[#C8FF00]/15 text-white px-2.5 py-1 rounded-full text-[11px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Connected</span>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConnect();
            }}
            className="px-3.5 py-1.5 bg-[#C8FF00] text-black text-[12px] font-black rounded-full transition-all active:scale-95"
          >
            Connect
          </button>
        )}
      </div>
    </motion.div>
  );
};
