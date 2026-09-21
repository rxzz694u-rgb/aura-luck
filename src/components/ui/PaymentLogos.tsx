import React from 'react';

// Original brand marks for checkout / deposit – lightweight inline SVGs on white pills
export type PayMethod = 'visa' | 'mastercard' | 'paypal' | 'applepay' | 'gpay' | 'btc' | 'usdt';

export const PAY_METHODS: { id: PayMethod; label: string }[] = [
  { id: 'visa', label: 'Visa' },
  { id: 'mastercard', label: 'Mastercard' },
  { id: 'paypal', label: 'PayPal' },
  { id: 'applepay', label: 'Apple Pay' },
  { id: 'gpay', label: 'G Pay' },
  { id: 'btc', label: 'Bitcoin' },
  { id: 'usdt', label: 'USDT' },
];

const Mark: React.FC<{ id: PayMethod }> = ({ id }) => {
  if (id === 'visa')
    return (
      <svg viewBox="0 0 48 20" className="h-5 w-10">
        <rect width="48" height="20" rx="4" fill="#fff" />
        <text x="24" y="14.5" textAnchor="middle" fontSize="11" fontWeight="900" fontStyle="italic" fill="#1A1F71">VISA</text>
      </svg>
    );
  if (id === 'mastercard')
    return (
      <svg viewBox="0 0 48 20" className="h-5 w-10">
        <rect width="48" height="20" rx="4" fill="#fff" />
        <circle cx="20" cy="10" r="6" fill="#EB001B" />
        <circle cx="28" cy="10" r="6" fill="#F79E1B" fillOpacity="0.85" />
      </svg>
    );
  if (id === 'paypal')
    return (
      <svg viewBox="0 0 48 20" className="h-5 w-10">
        <rect width="48" height="20" rx="4" fill="#fff" />
        <text x="24" y="14" textAnchor="middle" fontSize="9" fontWeight="900" fontStyle="italic" fill="#003087">Pay<tspan fill="#0079C1">Pal</tspan></text>
      </svg>
    );
  if (id === 'applepay')
    return (
      <svg viewBox="0 0 48 20" className="h-5 w-10">
        <rect width="48" height="20" rx="4" fill="#000" />
        <text x="24" y="14" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff"> Pay</text>
      </svg>
    );
  if (id === 'gpay')
    return (
      <svg viewBox="0 0 48 20" className="h-5 w-10">
        <rect width="48" height="20" rx="4" fill="#fff" />
        <text x="24" y="14" textAnchor="middle" fontSize="9" fontWeight="900"><tspan fill="#4285F4">G</tspan><tspan fill="#34A853"> Pay</tspan></text>
      </svg>
    );
  if (id === 'btc')
    return (
      <svg viewBox="0 0 48 20" className="h-5 w-10">
        <rect width="48" height="20" rx="4" fill="#F7931A" />
        <text x="24" y="14.5" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff">₿</text>
      </svg>
    );
  return (
    <svg viewBox="0 0 48 20" className="h-5 w-10">
      <rect width="48" height="20" rx="4" fill="#26A17B" />
      <text x="24" y="14" textAnchor="middle" fontSize="9" fontWeight="900" fill="#fff">USDT</text>
    </svg>
  );
};

export const PaymentLogos: React.FC<{
  selected: PayMethod;
  onSelect: (m: PayMethod) => void;
}> = ({ selected, onSelect }) => (
  <div>
    <p className="text-[12px] font-bold text-zinc-400 uppercase tracking-wide">Payment method</p>
    <div className="mt-2 grid grid-cols-4 gap-2">
      {PAY_METHODS.map((m) => (
        <button
          key={m.id}
          onClick={() => onSelect(m.id)}
          title={m.label}
          className={`h-11 rounded-xl border flex items-center justify-center transition-all active:scale-95 ${
            selected === m.id ? 'border-[#C8FF00] bg-[#C8FF00]/10 ring-1 ring-[#C8FF00]/50' : 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]'
          }`}
        >
          <Mark id={m.id} />
        </button>
      ))}
    </div>
    <div className="mt-2 flex items-center justify-between text-[12px]">
      <span className="text-zinc-500 font-semibold">{PAY_METHODS.find((p) => p.id === selected)?.label} checkout</span>
      <span className="text-zinc-500">256-bit SSL • Instant</span>
    </div>
  </div>
);
