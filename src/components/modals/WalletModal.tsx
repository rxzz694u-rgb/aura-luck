import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowDownToLine, ArrowUpFromLine, History, Wallet, ShieldCheck } from 'lucide-react';
import { Transaction } from '../../services/walletService';
import { PaymentLogos, PayMethod } from '../ui/PaymentLogos';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  txs: Transaction[];
  onDeposit: (amount: number) => string | null;
  onWithdraw: (amount: number) => string | null;
}

const QUICK = [5, 10, 25, 50, 100];

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, balance, txs, onDeposit, onWithdraw }) => {
  const [tab, setTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');
  const [amount, setAmount] = useState('10');
  const [method, setMethod] = useState<PayMethod>('visa');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const v = parseFloat(amount);
    if (!v || v <= 0) {
      setError('Enter a valid amount');
      return;
    }
    if (tab === 'withdraw' && v < 5) {
      setError('Minimum withdrawal is $5');
      return;
    }
    const label = tab === 'deposit' ? undefined : undefined;
    void label;
    const err = tab === 'deposit' ? onDeposit(v) : onWithdraw(v);
    if (err) setError(err);
    else {
      setError(null);
      setAmount('10');
      setTab('history');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            className="relative w-full max-w-[440px] bg-[#151923] border border-white/[0.08] rounded-t-[24px] sm:rounded-[24px] p-5 max-h-[88vh] overflow-y-auto no-scrollbar"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src="/assets/logo.svg" alt="PackDraw" className="w-10 h-10 rounded-2xl" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">Wallet balance</p>
                  <p className="text-[22px] font-black text-white leading-none">${balance.toFixed(2)}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center text-zinc-300 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* tabs */}
            <div className="mt-4 grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
              {(
                [
                  { id: 'deposit', label: 'Deposit', icon: ArrowDownToLine },
                  { id: 'withdraw', label: 'Withdraw', icon: ArrowUpFromLine },
                  { id: 'history', label: 'History', icon: History },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTab(t.id); setError(null); }}
                  className={`h-10 rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                    tab === t.id ? 'bg-[#C8FF00] text-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <t.icon className="w-4 h-4" /> {t.label}
                </button>
              ))}
            </div>

            {tab !== 'history' ? (
              <div className="mt-4">
                <label className="text-[12px] font-bold text-zinc-400 uppercase tracking-wide">Amount (USD)</label>
                <div className="mt-1.5 flex items-center rounded-2xl bg-white/[0.04] border border-white/[0.08] px-4 h-14 focus-within:border-[#C8FF00]/50">
                  <span className="text-zinc-500 font-black text-lg">$</span>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                    inputMode="decimal"
                    className="flex-1 bg-transparent outline-none px-2 text-[20px] font-black text-white"
                    placeholder="10.00"
                  />
                </div>
                <div className="mt-2.5 flex gap-2 flex-wrap">
                  {QUICK.map((q) => (
                    <button
                      key={q}
                      onClick={() => setAmount(String(q))}
                      className={`px-3.5 h-9 rounded-full text-[13px] font-bold border transition-all ${
                        amount === String(q) ? 'bg-[#C8FF00] text-black border-transparent' : 'bg-white/[0.04] text-zinc-300 border-white/[0.08]'
                      }`}
                    >
                      ${q}
                    </button>
                  ))}
                </div>
                {error && <p className="mt-2 text-[13px] font-semibold text-rose-400">{error}</p>}
                <div className="mt-3">
                  <PaymentLogos selected={method} onSelect={setMethod} />
                </div>
                <button
                  onClick={submit}
                  className="mt-4 w-full h-13 py-3.5 rounded-2xl bg-[#C8FF00] text-black font-black text-[15px] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Wallet className="w-4 h-4" strokeWidth={2.5} />
                  {tab === 'deposit' ? 'Checkout • Deposit now' : 'Withdraw now'}
                </button>
                <p className="mt-2.5 text-center text-[12px] text-zinc-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C8FF00]" />
                  {tab === 'deposit' ? 'Instant credit • No fees • 256-bit SSL secured' : 'Processed to your wallet • Min $5'}
                </p>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-2">
                {txs.length === 0 && <p className="text-center text-[13px] text-zinc-500 py-6">No transactions yet</p>}
                {txs.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      t.type === 'deposit' || t.type === 'win' ? 'bg-[#C8FF00]/15 text-[#C8FF00]' : 'bg-white/[0.06] text-zinc-300'
                    }`}>
                      {t.type === 'deposit' ? <ArrowDownToLine className="w-4 h-4" /> : t.type === 'withdraw' ? <ArrowUpFromLine className="w-4 h-4" /> : <History className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-white truncate">{t.label}</p>
                      <p className="text-[11px] text-zinc-500">{new Date(t.date).toLocaleString()} • {t.type}</p>
                    </div>
                    <span className={`text-[14px] font-black ${t.amount >= 0 ? 'text-[#C8FF00]' : 'text-zinc-200'}`}>
                      {t.amount >= 0 ? '+' : ''}${t.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
