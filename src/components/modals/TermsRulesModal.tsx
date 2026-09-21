import React from 'react';
import { BottomSheet } from '../ui/BottomSheet';
import { Shield, Lock, FileText, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface TermsRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsRulesModal: React.FC<TermsRulesModalProps> = ({ isOpen, onClose }) => {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Official Rules & Terms"
      subtitle="Free promotional giveaway terms"
    >
      <div className="space-y-4 py-2 pb-6 text-left">
        <div className="bg-purple-50/70 border border-purple-200/60 rounded-2xl p-3.5 flex items-start gap-3">
          <Shield className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
          <div className="text-[12px] leading-relaxed text-purple-950">
            <span className="font-bold block text-[13px] text-purple-900">
              No Purchase Necessary
            </span>
            A purchase, payment, or donation of any kind will not increase your chances of winning. All giveaways hosted on Aura are 100% free to enter.
          </div>
        </div>

        <div className="space-y-3 text-[13px] text-zinc-400 leading-relaxed">
          <div className="bg-[#151923] border border-white/[0.07] p-3.5 rounded-2xl">
            <h4 className="font-bold text-white text-[14px] flex items-center gap-1.5 mb-1">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              1. Eligibility
            </h4>
            <p>
              Open to legal residents of eligible jurisdictions worldwide where promotional sweepstakes are permitted by law. Void where prohibited. Entrants must be at least 18 years of age.
            </p>
          </div>

          <div className="bg-[#151923] border border-white/[0.07] p-3.5 rounded-2xl">
            <h4 className="font-bold text-white text-[14px] flex items-center gap-1.5 mb-1">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              2. Entry Limits
            </h4>
            <p>
              Each user may claim one (1) primary verified entry per drawing pool. Bonus chances may be granted strictly via social sharing or channel joining, without monetary compensation.
            </p>
          </div>

          <div className="bg-[#151923] border border-white/[0.07] p-3.5 rounded-2xl">
            <h4 className="font-bold text-white text-[14px] flex items-center gap-1.5 mb-1">
              <Lock className="w-4 h-4 text-electric-blue" />
              3. Provably Fair Verification
            </h4>
            <p>
              Winners are selected via automated cryptographic pseudorandom algorithms using a published block hash seed. The browser never calculates winners; all draws are immutable and publicly audited.
            </p>
          </div>

          <div className="bg-[#151923] border border-white/[0.07] p-3.5 rounded-2xl">
            <h4 className="font-bold text-white text-[14px] flex items-center gap-1.5 mb-1">
              <FileText className="w-4 h-4 text-purple-600" />
              4. Prize Distribution
            </h4>
            <p>
              Cash prizes are transferred electronically within 24 hours of winner confirmation. Physical prizes (like iPhones) are shipped with registered courier tracking.
            </p>
          </div>
        </div>

        <Button fullWidth size="lg" variant="dark" onClick={onClose}>
          I Understand
        </Button>
      </div>
    </BottomSheet>
  );
};
