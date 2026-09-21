import React from 'react';
import { BottomSheet } from '../ui/BottomSheet';
import { ShieldCheck, CheckCircle2, Lock, Gift, Bell } from 'lucide-react';
import { Button } from '../ui/Button';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  const steps = [
    {
      num: '01',
      title: 'Choose a giveaway',
      desc: 'Browse active cash, tech, and gift card pools. Draws update weekly and daily.',
      icon: Gift,
    },
    {
      num: '02',
      title: 'Enter for free',
      desc: 'No deposit, payment, or credit card required. Tap once to claim your entry.',
      icon: CheckCircle2,
    },
    {
      num: '03',
      title: 'Receive confirmation',
      desc: 'Get a unique cryptographic Ticket ID (e.g. #A82K91) synced to your profile.',
      icon: Lock,
    },
    {
      num: '04',
      title: 'Wait for the draw',
      desc: 'Entries lock at the countdown expiration. A provably fair random seed determines the winner.',
      icon: ShieldCheck,
    },
    {
      num: '05',
      title: 'Winner is announced',
      desc: 'Results post publicly. If connected, instant notifications are pushed via Telegram.',
      icon: Bell,
    },
  ];

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="How Aura Works"
      subtitle="100% Free to enter · Provably Fair"
    >
      <div className="space-y-4 py-2 pb-6">
        {/* Transparency Banner */}
        <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-2xl p-3.5 flex items-start gap-3 text-emerald-900">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-[12px] leading-relaxed">
            <span className="font-bold block text-[13px] text-emerald-800">
              Zero-Cost Guarantee
            </span>
            Aura is strictly a free promotional giveaway platform. There are no fees, bets, wagers, or hidden charges at any stage.
          </div>
        </div>

        {/* 5 Steps */}
        <div className="space-y-3">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="bg-[#151923] border border-white/[0.07] rounded-2xl p-3.5 flex items-start gap-3 shadow-sm"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-zinc-500">
                      STEP {s.num}
                    </span>
                    <h4 className="text-[14px] font-bold text-white">
                      {s.title}
                    </h4>
                  </div>
                  <p className="text-[12px] text-zinc-400 mt-0.5 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Provably Fair Cryptographic Details */}
        <div className="bg-[#FAFAFA] border border-white/[0.07] rounded-2xl p-3.5 text-left text-[12px] space-y-1.5">
          <span className="font-bold text-white flex items-center gap-1.5 text-[13px]">
            <Lock className="w-3.5 h-3.5 text-electric-blue" />
            Provably Fair Architecture
          </span>
          <p className="text-zinc-400 leading-relaxed">
            Winners are determined using pre-committed cryptographic hashes (SHA-256). All drawing seeds are published publicly so any entrant can verify the integrity of every draw independently.
          </p>
        </div>

        <Button fullWidth size="lg" variant="dark" onClick={onClose}>
          Got it
        </Button>
      </div>
    </BottomSheet>
  );
};
