import React from 'react';
import { CheckoutKind } from '../../services/payments';

// Original payment-system brand marks (inline SVG, no external assets).
export type PayMethod =
  | 'visa' | 'mastercard' | 'amex'
  | 'paypal' | 'applepay' | 'gpay' | 'stripe'
  | 'upi' | 'gcash' | 'maya'
  | 'btc' | 'eth' | 'usdt'
  | 'bank';

export interface MethodMeta {
  id: PayMethod;
  label: string;
  kind: CheckoutKind;
  hint: string;
}

export const PAY_METHODS: MethodMeta[] = [
  { id: 'visa', label: 'Visa', kind: 'card', hint: 'Debit / credit • instant' },
  { id: 'mastercard', label: 'Mastercard', kind: 'card', hint: 'Debit / credit • instant' },
  { id: 'amex', label: 'Amex', kind: 'card', hint: 'American Express • instant' },
  { id: 'paypal', label: 'PayPal', kind: 'wallet', hint: 'PayPal balance • instant' },
  { id: 'applepay', label: 'Apple Pay', kind: 'wallet', hint: 'Touch ID • instant' },
  { id: 'gpay', label: 'Google Pay', kind: 'wallet', hint: 'One-tap • instant' },
  { id: 'stripe', label: 'Stripe', kind: 'wallet', hint: 'Secure card checkout' },
  { id: 'upi', label: 'UPI', kind: 'wallet', hint: 'India • instant' },
  { id: 'gcash', label: 'GCash', kind: 'wallet', hint: 'Philippines • instant' },
  { id: 'maya', label: 'Maya', kind: 'wallet', hint: 'Philippines • instant' },
  { id: 'btc', label: 'Bitcoin', kind: 'crypto', hint: '1 confirmation' },
  { id: 'eth', label: 'Ethereum', kind: 'crypto', hint: '12 confirmations' },
  { id: 'usdt', label: 'Tether', kind: 'crypto', hint: 'TRC-20 / ERC-20' },
  { id: 'bank', label: 'Bank', kind: 'bank', hint: '1–2 business days' },
];

export const Mark: React.FC<{ id: PayMethod; className?: string }> = ({ id, className = 'h-6 w-12' }) => {
  switch (id) {
    case 'visa':
      return (
        <svg viewBox="0 0 56 28" className={className} role="img" aria-label="Visa">
          <rect width="56" height="28" rx="6" fill="#fff" />
          <text x="28" y="19.5" textAnchor="middle" fontSize="13" fontWeight="900" fontStyle="italic" letterSpacing="0.5" fill="#1A1F71" fontFamily="Arial, sans-serif">VISA</text>
          <rect x="8" y="21" width="40" height="1.6" fill="#F9A51A" opacity="0.9" />
        </svg>
      );
    case 'mastercard':
      return (
        <svg viewBox="0 0 56 28" className={className} role="img" aria-label="Mastercard">
          <rect width="56" height="28" rx="6" fill="#1A1F71" />
          <circle cx="23" cy="14" r="8" fill="#EB001B" />
          <circle cx="33" cy="14" r="8" fill="#F79E1B" fillOpacity="0.9" />
          <path d="M28 8.2a8 8 0 0 1 0 11.6 8 8 0 0 1 0-11.6z" fill="#FF5F00" />
        </svg>
      );
    case 'amex':
      return (
        <svg viewBox="0 0 56 28" className={className} role="img" aria-label="American Express">
          <rect width="56" height="28" rx="6" fill="#2E77BC" />
          <text x="28" y="18.5" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#fff" fontFamily="Arial, sans-serif">AMEX</text>
        </svg>
      );
    case 'paypal':
      return (
        <svg viewBox="0 0 56 28" className={className} role="img" aria-label="PayPal">
          <rect width="56" height="28" rx="6" fill="#fff" />
          <text x="28" y="19" textAnchor="middle" fontSize="11" fontWeight="900" fontStyle="italic" fill="#003087" fontFamily="Arial, sans-serif">Pay<tspan fill="#009CDE">Pal</tspan></text>
        </svg>
      );
    case 'applepay':
      return (
        <svg viewBox="0 0 56 28" className={className} role="img" aria-label="Apple Pay">
          <rect width="56" height="28" rx="6" fill="#000" />
          <text x="21" y="19" textAnchor="middle" fontSize="13" fill="#fff" fontFamily="Arial, sans-serif"></text>
          <text x="35" y="18.5" textAnchor="middle" fontSize="10" fontWeight="600" fill="#fff" fontFamily="Arial, sans-serif">Pay</text>
        </svg>
      );
    case 'gpay':
      return (
        <svg viewBox="0 0 56 28" className={className} role="img" aria-label="Google Pay">
          <rect width="56" height="28" rx="6" fill="#fff" />
          <text x="20" y="19.5" textAnchor="middle" fontSize="14" fontWeight="900" fill="#4285F4" fontFamily="Arial, sans-serif">G</text>
          <text x="37" y="18.5" textAnchor="middle" fontSize="10" fontWeight="600" fill="#5F6368" fontFamily="Arial, sans-serif">Pay</text>
        </svg>
      );
    case 'stripe':
      return (
        <svg viewBox="0 0 56 28" className={className} role="img" aria-label="Stripe">
          <rect width="56" height="28" rx="6" fill="#635BFF" />
          <text x="28" y="18.5" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily="Arial, sans-serif">stripe</text>
        </svg>
      );
    case 'upi':
      return (
        <svg viewBox="0 0 56 28" className={className} role="img" aria-label="UPI">
          <rect width="56" height="28" rx="6" fill="#fff" />
          <text x="26" y="18.5" textAnchor="middle" fontSize="10.5" fontWeight="900" fontStyle="italic" fill="#097939" fontFamily="Arial, sans-serif">UPI</text>
          <rect x="12" y="20.5" width="32" height="2" rx="1" fill="#ED752E" />
        </svg>
      );
    case 'gcash':
      return (
        <svg viewBox="0 0 56 28" className={className} role="img" aria-label="GCash">
          <rect width="56" height="28" rx="6" fill="#007DFF" />
          <path d="M17 8.5a6 6 0 1 0 4.4 10.1V16h-3v-2.4h5.6v1.2A8.4 8.4 0 1 1 17 8.5z" fill="#fff" />
          <text x="36" y="18" fontSize="8.5" fontWeight="800" fill="#fff" fontFamily="Arial, sans-serif">GCash</text>
        </svg>
      );
    case 'maya':
      return (
        <svg viewBox="0 0 56 28" className={className} role="img" aria-label="Maya">
          <rect width="56" height="28" rx="6" fill="#00A651" />
          <text x="28" y="18.5" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff" fontFamily="Arial, sans-serif">maya</text>
        </svg>
      );
    case 'btc':
      return (
        <svg viewBox="0 0 56 28" className={className} role="img" aria-label="Bitcoin">
          <rect width="56" height="28" rx="6" fill="#F7931A" />
          <text x="28" y="20" textAnchor="middle" fontSize="15" fontWeight="900" fill="#fff" fontFamily="Arial, sans-serif">₿</text>
        </svg>
      );
    case 'eth':
      return (
        <svg viewBox="0 0 56 28" className={className} role="img" aria-label="Ethereum">
          <rect width="56" height="28" rx="6" fill="#ECF2FB" />
          <g transform="translate(28,14)">
            <polygon points="0,-8 5.5,-1.5 0,1.5 -5.5,-1.5" fill="#8A9BB5" />
            <polygon points="0,-8 5.5,-1.5 0,0.5 -5.5,-1.5" fill="#627EEA" />
            <polygon points="0,8 5.5,0 0,2.5 -5.5,0" fill="#627EEA" />
            <polygon points="0,8 5.5,0 0,1 0,2.5" fill="#8A9BB5" />
          </g>
        </svg>
      );
    case 'usdt':
      return (
        <svg viewBox="0 0 56 28" className={className} role="img" aria-label="Tether">
          <rect width="56" height="28" rx="6" fill="#26A17B" />
          <path d="M22 9h12v2.4h-4.6V19h-2.8v-7.6H22z" fill="#fff" />
          <rect x="25.4" y="17.4" width="5.2" height="1.6" fill="#fff" opacity="0.85" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 56 28" className={className} role="img" aria-label="Bank transfer">
          <rect width="56" height="28" rx="6" fill="#0B1220" stroke="rgba(255,255,255,0.25)" />
          <g fill="#C8FF00">
            <polygon points="28,7 38,13 18,13" />
            <rect x="20" y="14.5" width="2.6" height="6" />
            <rect x="24.4" y="14.5" width="2.6" height="6" />
            <rect x="28.8" y="14.5" width="2.6" height="6" />
            <rect x="33.2" y="14.5" width="2.6" height="6" />
            <rect x="18" y="21" width="20" height="1.8" />
          </g>
        </svg>
      );
  }
};

export const MethodRail: React.FC<{
  selected: PayMethod;
  onSelect: (m: PayMethod) => void;
  filter?: (m: (typeof PAY_METHODS)[number]) => boolean;
}> = ({ selected, onSelect, filter }) => {
  const items = filter ? PAY_METHODS.filter(filter) : PAY_METHODS;
  const active = PAY_METHODS.find((m) => m.id === selected);
  return (
    <div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1 snap-x">
        {items.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className={`snap-start shrink-0 w-[76px] rounded-2xl border flex flex-col items-center justify-center gap-1 py-2 transition-all active:scale-95 ${
              selected === m.id
                ? 'border-[#C8FF00] bg-[#C8FF00]/[0.07] ring-1 ring-[#C8FF00]/50'
                : 'border-white/[0.08] bg-white/[0.03]'
            }`}
          >
            <Mark id={m.id} className="h-6 w-12" />
            <span className="text-[9px] font-bold text-[#94A3B8] leading-none">{m.label}</span>
          </button>
        ))}
      </div>
      {active && (
        <div className="mt-2 flex items-center justify-between rounded-2xl bg-black/25 border border-white/[0.08] px-3.5 py-2.5">
          <span className="flex items-center gap-2.5 min-w-0">
            <Mark id={active.id} className="h-6 w-12 shrink-0" />
            <span className="text-[12px] font-bold text-white truncate">{active.label}</span>
          </span>
          <span className="text-[11px] text-[#64748B] shrink-0 ml-2">{active.hint}</span>
        </div>
      )}
    </div>
  );
};
