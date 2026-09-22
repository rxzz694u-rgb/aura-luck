import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ArrowDownToLine, ArrowUpFromLine, History, Check, Loader2,
  ShieldCheck, Lock,
} from 'lucide-react';
import { Transaction } from '../../services/walletService';
import { PAYMENT_CONFIG, isLiveCheckout, isTestMode } from '../../services/payments';
import { Mark, MethodRail, PAY_METHODS, PayMethod } from '../ui/PaymentLogos';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  txs: Transaction[];
  onDeposit: (amount: number, methodLabel: string, methodId: PayMethod) => string | null;
  onWithdraw: (amount: number, methodLabel: string, methodId: PayMethod) => string | null;
}

type Tab = 'deposit' | 'withdraw' | 'history';
type Phase = 'form' | 'processing' | 'success';

const QUICK = [5, 10, 25, 50, 100, 250];

function luhnOk(num: string): boolean {
  const d = num.replace(/\D/g, '');
  if (d.length < 15 || d.length > 19) return false;
  let sum = 0;
  let dbl = false;
  for (let i = d.length - 1; i >= 0; i--) {
    let n = parseInt(d[i], 10);
    if (dbl) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}

function destinationError(method: PayMethod, value: string): string | null {
  const v = value.trim();
  if (method === 'bank') {
    if (v.replace(/\s/g, '').length < 8) return 'Enter a valid IBAN or account number';
    return null;
  }
  if (method === 'visa' || method === 'mastercard' || method === 'amex') {
    if (!luhnOk(v)) return 'Enter a valid card number';
    return null;
  }
  if (method === 'upi') {
    if (!/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(v)) return 'Enter a valid UPI ID (name@bank)';
    return null;
  }
  if (method === 'gcash' || method === 'maya') {
    if (!/^(\+63|0)9\d{9}$/.test(v.replace(/[\s-]/g, ''))) return 'Enter a valid 11-digit mobile number';
    return null;
  }
  if (v.length < 25) return 'Enter a valid wallet address';
  return null;
}

const destinationPlaceholder = (m: PayMethod) =>
  m === 'bank' ? 'IBAN or account number'
  : m === 'visa' || m === 'mastercard' || m === 'amex' ? 'Card number •••• •••• ••••'
  : m === 'upi' ? 'yourname@bank'
  : m === 'gcash' || m === 'maya' ? '09XX XXX XXXX'
  : 'Wallet address';

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, balance, txs, onDeposit, onWithdraw }) => {
  const [tab, setTab] = useState<Tab>('deposit');
  const [phase, setPhase] = useState<Phase>('form');
  const [depMethod, setDepMethod] = useState<PayMethod>('visa');
  const [wdMethod, setWdMethod] = useState<PayMethod>('bank');
  const [amount, setAmount] = useState('25');
  const [dest, setDest] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState('');

  const reset = (t: Tab) => {
    setTab(t);
    setPhase('form');
    setError(null);
  };

  const methodMeta = (id: PayMethod) => PAY_METHODS.find((m) => m.id === id)!;

  const submitDeposit = () => {
    const v = parseFloat(amount);
    const { minDeposit, maxDeposit } = PAYMENT_CONFIG.limits;
    if (!v || v <= 0) return setError('Enter a valid amount');
    if (v < minDeposit) return setError(`Minimum deposit is $${minDeposit}`);
    if (v > maxDeposit) return setError(`Maximum deposit is $${maxDeposit}`);
    setError(null);
    setPhase('processing');
    const meta = methodMeta(depMethod);
    const liveUrl = isLiveCheckout(meta.kind, depMethod);
    window.setTimeout(() => {
      if (liveUrl) {
        window.open(`${liveUrl}${liveUrl.includes('?') ? '&' : '?'}amount=${v}`, '_blank', 'noopener');
        setPhase('form');
        setError('Complete the payment in the provider tab — it will credit automatically.');
        return;
      }
      const err = onDeposit(v, `${meta.label} •• ${meta.kind === 'card' ? 'card' : meta.kind}`, depMethod);
      if (err) {
        setPhase('form');
        setError(err);
      } else {
        setReceipt(`LD-${Date.now().toString(36).toUpperCase()}`);
        setPhase('success');
      }
    }, 1500);
  };

  const submitWithdraw = () => {
    const v = parseFloat(amount);
    const { minWithdraw, withdrawFee } = PAYMENT_CONFIG.limits;
    if (!v || v <= 0) return setError('Enter a valid amount');
    if (v < minWithdraw) return setError(`Minimum withdrawal is $${minWithdraw}`);
    if (v > balance) return setError('Insufficient balance');
    const dErr = destinationError(wdMethod, dest);
    if (dErr) return setError(dErr);
    setError(null);
    setPhase('processing');
    const meta = methodMeta(wdMethod);
    const net = +(v - withdrawFee).toFixed(2);
    window.setTimeout(() => {
      const err = onWithdraw(v, `Withdraw to ${meta.label} • ${dest.trim().slice(0, 18)}${dest.trim().length > 18 ? '…' : ''} • net $${net.toFixed(2)}`, wdMethod);
      if (err) {
        setPhase('form');
        setError(err);
      } else {
        setReceipt(`WD-${Date.now().toString(36).toUpperCase()}`);
        setPhase('success');
      }
    }, 1300);
  };

  const amountNum = parseFloat(amount) || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="relative w-full max-w-[440px] bg-[#0B1220] border border-white/[0.08] rounded-t-[24px] sm:rounded-[24px] max-h-[92dvh] flex flex-col overflow-hidden"
          >
            {/* header */}
            <div className="flex items-center justify-between px-5 pt-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <img src="/assets/logo.svg" alt="LuckyDraw" className="w-10 h-10 rounded-2xl" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#64748B]">Wallet balance</p>
                  <p className="text-[22px] font-black text-white leading-none tabular-nums">${balance.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isTestMode() && (
                  <span className="text-[10px] font-black uppercase tracking-wide bg-[#FFC83D]/15 text-[#FFC83D] border border-[#FFC83D]/30 px-2.5 py-1 rounded-full">
                    Test mode
                  </span>
                )}
                <button onClick={onClose} aria-label="Close" className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center text-zinc-300 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* tabs */}
            <div className="px-5 pt-3 shrink-0">
              <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                {(
                  [
                    { id: 'deposit', label: 'Deposit', icon: ArrowDownToLine },
                    { id: 'withdraw', label: 'Withdraw', icon: ArrowUpFromLine },
                    { id: 'history', label: 'History', icon: History },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => reset(t.id)}
                    className={`h-10 rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                      tab === t.id ? 'bg-[#C8FF00] text-black' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <t.icon className="w-4 h-4" /> {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar min-h-0">
              {tab === 'history' ? (
                <div className="flex flex-col gap-2">
                  {txs.length === 0 && <p className="text-center text-[13px] text-zinc-500 py-6">No transactions yet</p>}
                  {txs.map((t) => (
                    <div key={t.id} className="flex items-center gap-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3">
                      <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0 overflow-hidden">
                        {t.method && (PAY_METHODS as { id: string }[]).some((m) => m.id === t.method) ? (
                          <Mark id={t.method as PayMethod} className="h-6 w-11" />
                        ) : (
                          <span className="text-[11px] font-black text-[#0B1220]">$</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-white truncate">{t.label}</p>
                        <p className="text-[11px] text-zinc-500 truncate">
                          {new Date(t.date).toLocaleDateString()} • {t.type}
                          {t.status === 'pending' && <span className="text-[#FFC83D] font-bold"> • pending</span>}
                        </p>
                      </div>
                      <span className={`text-[14px] font-black tabular-nums ${t.amount >= 0 ? 'text-[#C8FF00]' : 'text-zinc-200'}`}>
                        {t.amount >= 0 ? '+' : ''}${t.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : phase === 'processing' ? (
                <div className="py-10 flex flex-col items-center text-center">
                  <Loader2 className="w-10 h-10 text-[#C8FF00] animate-spin" />
                  <p className="mt-4 text-[15px] font-black text-white">
                    {tab === 'deposit' ? 'Contacting provider…' : 'Submitting withdrawal…'}
                  </p>
                  <p className="mt-1 text-[12px] text-zinc-500 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> 256-bit SSL encrypted
                  </p>
                </div>
              ) : phase === 'success' ? (
                <div className="py-6 flex flex-col items-center text-center animate-fade-up">
                  <motion.div
                    initial={{ scale: 0.4 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 16 }}
                    className={`w-20 h-20 rounded-full flex items-center justify-center ${tab === 'deposit' ? 'bg-[#19D37A] shadow-[0_0_40px_rgba(25,211,122,0.45)]' : 'bg-[#C8FF00] shadow-[0_0_40px_rgba(200,255,0,0.35)]'}`}
                  >
                    <Check className={`w-10 h-10 ${tab === 'deposit' ? 'text-white' : 'text-black'}`} strokeWidth={3} />
                  </motion.div>
                  <h3 className="mt-4 text-[20px] font-black text-white">
                    {tab === 'deposit' ? `$${amountNum.toFixed(2)} added` : 'Withdrawal requested'}
                  </h3>
                  <p className="mt-1 text-[12px] text-zinc-500">
                    {tab === 'deposit'
                      ? `Receipt ${receipt} • instant credit`
                      : `Receipt ${receipt} • under review, usually under 24h`}
                  </p>
                  <button
                    onClick={() => reset('history')}
                    className="mt-5 w-full h-13 py-3.5 rounded-2xl bg-[#C8FF00] text-black font-black text-[15px] active:scale-[0.99]"
                  >
                    View History
                  </button>
                  <button onClick={onClose} className="mt-2 text-[13px] font-semibold text-zinc-500 hover:text-white">
                    Done
                  </button>
                </div>
              ) : tab === 'deposit' ? (
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-[#64748B]">Pay with</p>
                    <div className="mt-2">
                      <MethodRail selected={depMethod} onSelect={(m) => { setDepMethod(m); setError(null); }} />
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-[#64748B]">Amount (USD)</p>
                    <div className="mt-1.5 flex items-center rounded-2xl bg-white/[0.04] border border-white/[0.08] px-4 h-14 focus-within:border-[#C8FF00]/60">
                      <span className="text-zinc-500 font-black text-lg">$</span>
                      <input
                        value={amount}
                        onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                        inputMode="decimal"
                        className="flex-1 min-w-0 bg-transparent outline-none px-2 text-[20px] font-black text-white tabular-nums"
                        placeholder="25.00"
                      />
                    </div>
                    <div className="mt-2 flex gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1 pb-0.5">
                      {QUICK.map((q) => (
                        <button
                          key={q}
                          onClick={() => setAmount(String(q))}
                          className={`shrink-0 px-4 h-9 rounded-full text-[12px] font-bold border transition-all active:scale-95 ${
                            amount === String(q) ? 'bg-[#C8FF00] text-black border-transparent' : 'bg-white/[0.04] text-zinc-300 border-white/[0.08]'
                          }`}
                        >
                          ${q}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-black/25 border border-white/[0.08] p-3.5 text-[13px]">
                    <div className="flex justify-between text-zinc-400"><span>Deposit</span><span className="tabular-nums">${amountNum.toFixed(2)}</span></div>
                    <div className="flex justify-between text-zinc-400 mt-1"><span>Fee</span><span className="text-[#19D37A] font-bold">$0.00</span></div>
                    <div className="flex justify-between text-white font-black mt-1.5 pt-1.5 border-t border-white/[0.08]">
                      <span>Total</span><span className="tabular-nums">${amountNum.toFixed(2)}</span>
                    </div>
                  </div>
                  {error && <p className="text-[13px] font-semibold text-rose-400">{error}</p>}
                  <div>
                    <button
                      onClick={submitDeposit}
                      className="w-full h-14 rounded-2xl bg-[#C8FF00] text-black font-black text-[15px] hover:brightness-110 active:scale-[0.99] flex items-center justify-center gap-2"
                    >
                      <Mark id={depMethod} className="h-6 w-12" />
                      Pay ${amountNum.toFixed(2)}
                    </button>
                    <p className="mt-2.5 text-center text-[12px] text-zinc-500 flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C8FF00]" />
                      Instant credit • No fees • 256-bit SSL
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-[#64748B]">Withdraw to</p>
                    <div className="mt-2">
                      <MethodRail
                        selected={wdMethod}
                        onSelect={(m) => { setWdMethod(m); setError(null); }}
                        filter={(m) => m.kind === 'bank' || m.kind === 'crypto' || m.id === 'visa' || m.id === 'mastercard' || m.id === 'upi' || m.id === 'gcash' || m.id === 'maya'}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-[#64748B]">
                      {wdMethod === 'bank' ? 'Destination IBAN / account' : wdMethod === 'visa' || wdMethod === 'mastercard' || wdMethod === 'amex' ? 'Destination card' : wdMethod === 'upi' ? 'Destination UPI ID' : wdMethod === 'gcash' || wdMethod === 'maya' ? 'Destination mobile number' : 'Destination address'}
                    </p>
                    <input
                      value={dest}
                      onChange={(e) => setDest(e.target.value)}
                      className="mt-1.5 w-full h-13 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] px-4 text-[14px] font-semibold text-white outline-none focus:border-[#C8FF00]/60 placeholder:text-[#64748B]"
                      placeholder={destinationPlaceholder(wdMethod)}
                      inputMode={wdMethod === 'bank' ? 'text' : 'text'}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <p className="text-[11px] font-black uppercase tracking-widest text-[#64748B]">Amount (USD)</p>
                      <button onClick={() => setAmount(String(Math.floor(balance)))} className="text-[11px] font-bold text-[#C8FF00]">
                        Max ${balance.toFixed(2)}
                      </button>
                    </div>
                    <div className="mt-1.5 flex items-center rounded-2xl bg-white/[0.04] border border-white/[0.08] px-4 h-14 focus-within:border-[#C8FF00]/60">
                      <span className="text-zinc-500 font-black text-lg">$</span>
                      <input
                        value={amount}
                        onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                        inputMode="decimal"
                        className="flex-1 min-w-0 bg-transparent outline-none px-2 text-[20px] font-black text-white tabular-nums"
                        placeholder="50.00"
                      />
                    </div>
                  </div>
                  <div className="rounded-2xl bg-black/25 border border-white/[0.08] p-3.5 text-[13px]">
                    <div className="flex justify-between text-zinc-400"><span>Withdraw</span><span className="tabular-nums">${amountNum.toFixed(2)}</span></div>
                    <div className="flex justify-between text-zinc-400 mt-1"><span>Fee</span><span className="text-[#19D37A] font-bold">$0.00</span></div>
                    <div className="flex justify-between text-white font-black mt-1.5 pt-1.5 border-t border-white/[0.08]">
                      <span>You receive</span><span className="tabular-nums">${amountNum.toFixed(2)}</span>
                    </div>
                  </div>
                  {error && <p className="text-[13px] font-semibold text-rose-400">{error}</p>}
                  <div>
                    <button
                      onClick={submitWithdraw}
                      className="w-full h-14 rounded-2xl bg-[#C8FF00] text-black font-black text-[15px] hover:brightness-110 active:scale-[0.99] flex items-center justify-center gap-2"
                    >
                      <Mark id={wdMethod} className="h-6 w-12" />
                      Confirm Withdrawal
                    </button>
                    <p className="mt-2.5 text-center text-[12px] text-zinc-500">
                      Min ${PAYMENT_CONFIG.limits.minWithdraw} • Manual review, usually under 24h
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
