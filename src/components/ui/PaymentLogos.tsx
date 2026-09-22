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
          <path d="M20 7h6.5c2.4 0 4 1.3 4 3.4 0 2.5-2 4-4.8 4h-2.3l-.8 5H19z" fill="#003087" />
          <path d="M24.5 7H31c2.4 0 4 1.3 4 3.4 0 2.5-2 4-4.8 4h-2.3l-.8 5h-3.6z" fill="#009CDE" opacity="0.85" />
          <text x="28" y="25" textAnchor="middle" fontSize="6.5" fontWeight="800" fontStyle="italic" fill="#003087" fontFamily="Arial, sans-serif">PayPal</text>
        </svg>
      );
    case 'applepay':
      return (
        <svg viewBox="0 0 56 28" className={className} role="img" aria-label="Apple Pay">
          <rect width="56" height="28" rx="6" fill="#000" />
          <path d="M20.6 9.2c-.5-.6-1.3-1-2-1-.1 1-.4 2 .1 2.9.5.7 1.4 1.1 2.1 1-.1-1 .3-2.1-.2-2.9zm-1 3.2c-1 0-1.9.6-2.4.6-.5 0-1.3-.6-2.1-.6-1.7 0-3.1 1.4-3.1 3.9 0 2.9 1.9 5.7 3.4 5.7.7 0 1.2-.5 2.2-.5 1 0 1.3.5 2.2.5 1.5 0 3.2-2.9 3.3-3-.1 0-2.1-.8-2.1-2.8 0-1.4 1.1-2.3 1.2-2.4-.6-1-1.6-1.4-2.6-1.4z" fill="#fff" transform="translate(0,-1) scale(0.92)" />
          <text x="34" y="18.5" fontSize="10" fontWeight="600" fill="#fff" fontFamily="Arial, sans-serif">Pay</text>
        </svg>
      );
    case 'gpay':
      return (
        <svg viewBox="0 0 56 28" className={className} role="img" aria-label="Google Pay">
          <rect width="56" height="28" rx="6" fill="#fff" />
          <g transform="translate(13,14)">
            <path d="M-4.5-6.5A7.5 7.5 0 0 1 3-6l-2 2.4a4.5 4.5 0 0 0-5.5-.4z" fill="#EA4335" />
            <path d="M-6.6-.6A7.6 7.6 0 0 1-4.5-6.5l2.4 1.8a4.6 4.6 0 0 0-1.2 4.1z" fill="#FBBC05" />
            <path d="M-4.5 6.5A7.5 7.5 0 0 1-6.6-.6l2.4-1.8a4.6 4.6 0 0 0 5 3.3z" fill="#34A853" />
            <path d="M3 6A7.5 7.5 0 0 1-4.5 6.5l.7-2.9A4.5 4.5 0 0 0 3 3.4z" fill="#4285F4" />
            <rect x="3" y="-1.4" width="4.6" height="2.8" fill="#4285F4" />
          </g>
          <text x="36" y="18" fontSize="9.5" fontWeight="600" fill="#5F6368" fontFamily="Arial, sans-serif">Pay</text>
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
          <path d="M12 8l5 6 5-6h3.4L19.5 15l5.9 7H22l-5-6-5 6h-3.4l5.9-7L8.6 8z" fill="#097939" transform="translate(4,1) scale(0.85)" />
          <text x="36" y="18.5" fontSize="10.5" fontWeight="900" fontStyle="italic" fill="#097939" fontFamily="Arial, sans-serif">UPI</text>
          <path d="M33 8.5l4 2.6-4 2.6z" fill="#ED752E" />
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

export const MethodGrid: React.FC<{
  selected: PayMethod;
  onSelect: (m: PayMethod) => void;
  filter?: (m: (typeof PAY_METHODS)[number]) => boolean;
}> = ({ selected, onSelect, filter }) => {
  const groups: { title: string; items: typeof PAY_METHODS }[] = [
    { title: 'Cards', items: PAY_METHODS.filter((m) => m.kind === 'card') },
    { title: 'Digital wallets', items: PAY_METHODS.filter((m) => m.kind === 'wallet') },
    { title: 'Crypto', items: PAY_METHODS.filter((m) => m.kind === 'crypto') },
    { title: 'Bank', items: PAY_METHODS.filter((m) => m.kind === 'bank') },
  ];
  return (
    <div className="flex flex-col gap-3">
      {groups.map((g) => {
        const items = filter ? g.items.filter(filter) : g.items;
        if (items.length === 0) return null;
        return (
          <div key={g.title}>
            <p className="text-[11px] font-black uppercase tracking-widest text-[#64748B]">{g.title}</p>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {items.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onSelect(m.id)}
                  className={`h-[52px] rounded-2xl border flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${
                    selected === m.id
                      ? 'border-[#C8FF00] bg-[#C8FF00]/[0.07] ring-1 ring-[#C8FF00]/50'
                      : 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]'
                  }`}
                >
                  <Mark id={m.id} />
                  <span className="text-[9px] font-bold text-[#94A3B8]">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
