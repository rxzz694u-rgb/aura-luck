import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxHeight?: string;
  showCloseButton?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxHeight = 'max-h-[92dvh]',
  showCloseButton = true,
}) => {
  // Lock body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:items-center sm:justify-center sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-0"
          />

          {/* Drawer / Card */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className={`relative z-10 w-full max-w-[440px] bg-[#0B1220] border border-white/[0.08] rounded-t-[24px] sm:rounded-[24px] shadow-[0_-12px_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden min-h-0 ${maxHeight}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* iOS Drag Handle */}
            <div className="w-full flex justify-center pt-3 pb-1 shrink-0 cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1.5 bg-white/[0.12] rounded-full" />
            </div>

            {/* Optional Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-5 pb-2 shrink-0">
                <div className="flex flex-col min-w-0">
                  {title && (
                    <h2 className="text-[17px] font-bold text-white tracking-tight truncate">
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className="text-[12px] text-[#94A3B8] leading-tight truncate">
                      {subtitle}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="w-8 h-8 shrink-0 rounded-full bg-white/[0.06] flex items-center justify-center text-[#94A3B8] hover:text-white active:scale-95 transition-transform"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 px-5 py-2 no-scrollbar">
              {children}
            </div>

            {/* Fixed footer – never overlaps content */}
            {footer && (
              <div className="shrink-0 px-5 pt-3 pb-safe border-t border-white/[0.08] bg-[#0B1220]">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
