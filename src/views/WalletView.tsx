import React from 'react';
import { Wallet as WalletIcon, Gift, Ticket, Trophy, ChevronRight } from 'lucide-react';
import { Transaction } from '../services/walletService';

interface WalletViewProps {
  balance: number;
  txs: Transaction[];
  totalEntries: number;
  totalWins: number;
  onAddFunds: () => void;
  onViewHistory: () => void;
}

function rowMeta(t: Transaction) {
  if (t.type === 'deposit') return { icon: WalletIcon, bg: 'bg-[#C8FF00]/15 text-[#C8FF00]', label: 'Add Funds' };
  if (t.type === 'win') return { icon: Trophy, bg: 'bg-[#19D37A]/15 text-[#19D37A]', label: 'Reward' };
  if (t.type === 'withdraw') return { icon: WalletIcon, bg: 'bg-white/[0.06] text-[#94A3B8]', label: 'Withdrawal' };
  return { icon: Ticket, bg: 'bg-[#C8FF00]/15 text-[#C8FF00]', label: 'Entry' };
}

export const WalletView: React.FC<WalletViewProps> = ({
  balance,
  txs,
  totalEntries,
  totalWins,
  onAddFunds,
  onViewHistory,
}) => {
  return (
    <div className="flex flex-col gap-4 px-4 md:px-0 pt-2 pb-28">
      <h1 className="text-[20px] font-extrabold text-white tracking-tight px-1">Wallet &amp; Rewards</h1>

      <div className="card p-5 animate-fade-up">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#C8FF00]/15 text-[#C8FF00] flex items-center justify-center shrink-0">
            <WalletIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[12px] text-[#94A3B8]">Your Balance</p>
            <p className="text-[26px] leading-none font-black text-white tabular-nums mt-0.5">
              ${balance.toFixed(2)}
            </p>
          </div>
        </div>
        <button
          onClick={onAddFunds}
          className="mt-4 w-full h-13 py-3 rounded-2xl cta-gradient text-black font-bold text-[14px] shadow-cta hover:brightness-110 active:scale-[0.99]"
        >
          Add Funds
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {[
          { icon: Gift, label: 'Referral bonus', val: '+5' },
          { icon: Ticket, label: 'Entries earned', val: `${totalEntries}` },
          { icon: Trophy, label: 'Rewards', val: `${totalWins}` },
        ].map((s) => (
          <div key={s.label} className="card p-3.5 flex flex-col gap-1.5">
            <s.icon className="w-5 h-5 text-[#C8FF00]" />
            <p className="text-[16px] font-black text-white tabular-nums">{s.val}</p>
            <p className="text-[10px] text-[#64748B] leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between px-1">
        <h2 className="text-[15px] font-extrabold text-white">Recent Activity</h2>
        <button onClick={onViewHistory} className="text-[13px] font-semibold text-[#C8FF00]">
          View All
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {txs.slice(0, 6).map((t) => {
          const m = rowMeta(t);
          return (
            <div key={t.id} className="card p-3.5 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${m.bg}`}>
                <m.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-white truncate">{t.label}</p>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  {new Date(t.date).toLocaleDateString()} • {m.label}
                </p>
              </div>
              <span className={`text-[13px] font-black tabular-nums ${t.amount >= 0 ? 'text-[#19D37A]' : 'text-white'}`}>
                {t.amount >= 0 ? '+' : ''}${Math.abs(t.amount).toFixed(2)}
              </span>
              <ChevronRight className="w-4 h-4 text-[#64748B] shrink-0" />
            </div>
          );
        })}
        {txs.length === 0 && (
          <div className="card p-6 text-center text-[13px] text-[#94A3B8]">
            No activity yet. Your deposits, entries and rewards will appear here.
          </div>
        )}
      </div>
    </div>
  );
};
