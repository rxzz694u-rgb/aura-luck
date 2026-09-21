import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Entry } from '../../types';
import { triggerRestrainedConfetti } from '../ui/Confetti';
import { Check, ArrowRight } from 'lucide-react';

interface EntrySuccessModalProps {
  entry: Entry | null;
  isOpen: boolean;
  onClose: () => void;
  onViewEntries: () => void;
  onShare: (entry: Entry) => void;
}

export const EntrySuccessModal: React.FC<EntrySuccessModalProps> = ({
  entry,
  isOpen,
  onClose,
  onViewEntries,
}) => {
  useEffect(() => {
    if (isOpen) triggerRestrainedConfetti();
  }, [isOpen]);

  if (!isOpen || !entry) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-[400px] bg-[#0B1220] border border-white/[0.08] rounded-[24px] p-6 shadow-card flex flex-col items-center text-center"
        >
          <motion.div
            initial={{ scale: 0.4 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 16, delay: 0.05 }}
            className="w-20 h-20 rounded-full bg-[#19D37A] flex items-center justify-center shadow-[0_0_40px_rgba(25,211,122,0.45)]"
          >
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </motion.div>

          <h2 className="mt-4 text-[26px] font-black tracking-tight text-white">You&apos;re in!</h2>
          <p className="text-[13px] text-[#94A3B8] mt-1.5 leading-relaxed max-w-[280px]">
            Your entry for {entry.giveawayTitle} has been confirmed.
          </p>

          <div className="w-full mt-5 rounded-[20px] bg-black/25 border border-white/[0.08] p-4 flex items-center gap-3 text-left">
            <span className="font-mono text-[15px] font-bold text-white bg-white/[0.06] border border-white/[0.08] rounded-xl px-3 py-2">
              {entry.ticketId}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[13px] font-bold text-white truncate">{entry.prizeAmount}</span>
              <span className="block text-[11px] text-[#64748B] mt-0.5">{entry.drawDateFormatted}</span>
            </span>
          </div>

          <button
            onClick={() => {
              onClose();
              onViewEntries();
            }}
            className="mt-5 w-full h-14 rounded-2xl cta-gradient text-black font-bold text-[15px] shadow-cta hover:brightness-110 active:scale-[0.99] flex items-center justify-center gap-2"
          >
            View My Entries <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="mt-2.5 text-[13px] font-semibold text-[#64748B] hover:text-white">
            Back to Home
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
