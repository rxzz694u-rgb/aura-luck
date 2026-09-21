import React, { useState } from 'react';
import { BottomSheet } from '../ui/BottomSheet';
import { Send, CheckCircle2, MessageSquare, Clock } from 'lucide-react';
import { Button } from '../ui/Button';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendFeedback: (text: string) => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  onSendFeedback,
}) => {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendFeedback(message);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMessage('');
      onClose();
    }, 1500);
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Aura Help & Support"
      subtitle="24/7 Concierge Support on Telegram"
    >
      <div className="space-y-4 py-2 pb-6 text-left">
        {/* Support Card Header */}
        <div className="bg-[#E3F3FC] border border-[#0088CC]/20 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0088CC] text-white flex items-center justify-center shrink-0">
            <Send className="w-5 h-5 -translate-x-0.5 translate-y-0.5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-[14px]">
              Direct Telegram Bot Support
            </h4>
            <p className="text-[12px] text-zinc-400 mt-0.5 leading-relaxed">
              Message our verified bot <span className="font-semibold text-[#0088CC]">@AuraGiveawaysBot</span> for real-time assistance with your tickets and prize delivery.
            </p>
          </div>
        </div>

        {/* Status badges */}
        <div className="grid grid-cols-2 gap-2 text-[12px]">
          <div className="bg-white/[0.04] border border-white/[0.07] p-3 rounded-xl flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-white">Response Time</p>
              <p className="text-[11px] text-zinc-400">&lt; 5 minutes</p>
            </div>
          </div>
          <div className="bg-white/[0.04] border border-white/[0.07] p-3 rounded-xl flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <p className="font-bold text-white">Availability</p>
              <p className="text-[11px] text-zinc-400">24/7 Every Day</p>
            </div>
          </div>
        </div>

        {/* Quick Message Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <label className="block text-[12px] font-bold text-zinc-500 uppercase tracking-wider">
            Quick In-App Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your question or issue..."
            rows={3}
            className="w-full p-3.5 bg-white/[0.04] border border-white/[0.08] rounded-2xl text-[13px] text-white focus:bg-[#151923] focus:outline-none focus:ring-2 focus:ring-[#0088CC] transition-all resize-none"
          />

          {submitted ? (
            <div className="w-full py-3 bg-emerald-50 text-emerald-700 text-center font-bold text-[13px] rounded-2xl flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Message Sent! Our bot will reply on Telegram</span>
            </div>
          ) : (
            <Button
              type="submit"
              fullWidth
              size="hero"
              variant="telegram"
              icon={<Send className="w-4 h-4" />}
            >
              Open Telegram Support
            </Button>
          )}
        </form>
      </div>
    </BottomSheet>
  );
};
