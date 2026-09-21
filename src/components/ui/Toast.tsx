import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, Send } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error' | 'telegram';
  title: string;
  description?: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="pointer-events-auto bg-[#0B1220]/95 backdrop-blur-2xl px-4 py-3 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.5)] border border-white/[0.08] flex items-center gap-3 max-w-sm cursor-pointer active:scale-95"
            onClick={onDismiss}
          >
            <div className="shrink-0">
              {toast.type === 'success' && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              )}
              {toast.type === 'telegram' && (
                <div className="w-5 h-5 rounded-full bg-[#0088CC] text-white flex items-center justify-center">
                  <Send className="w-3 h-3 -translate-x-0.5 translate-y-0.5" />
                </div>
              )}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500" />}
            </div>

            <div className="flex flex-col text-left min-w-0 pr-2">
              <span className="text-[13px] font-bold text-white tracking-tight truncate">
                {toast.title}
              </span>
              {toast.description && (
                <span className="text-[12px] text-zinc-400 truncate leading-tight">
                  {toast.description}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
