// ============================================================================
// payments.ts – checkout provider configuration.
// DEMO MODE by default: deposits credit the wallet instantly so the full UX
// can be tested end-to-end with zero keys.
//
// TO GO LIVE (real money):
//  1. Cards/wallets  -> set stripe.paymentLink to a Stripe Payment Link
//     (Dashboard > Payments > Payment Links, one link per amount is NOT
//     needed – create a single flexible-amount link). Checkout will open it
//     in a new tab; Stripe webhooks confirm payment on your server.
//  2. Crypto         -> set crypto.provider to 'coinbase' or 'nowpayments'
//     and paste the hosted checkout base URL + your wallet addresses below.
//  3. Bank transfer  -> set bank.iban / bank.accountName; the app shows
//     deposit instructions + reference code instead of instant credit.
// Until then, isLive() returns false and the UI shows a "Test mode" badge.
// ============================================================================

export type CheckoutKind = 'card' | 'wallet' | 'crypto' | 'bank';

export interface PaymentConfig {
  stripe: {
    paymentLink: string; // e.g. https://buy.stripe.com/xxxxx
    publishableKey: string; // pk_live_... (for future embedded Elements)
  };
  crypto: {
    provider: '' | 'coinbase' | 'nowpayments';
    hostedBaseUrl: string;
    addresses: { BTC: string; ETH: string; USDT: string };
  };
  bank: {
    accountName: string;
    iban: string;
    referencePrefix: string;
  };
  limits: { minDeposit: number; maxDeposit: number; minWithdraw: number; withdrawFee: number };
}

export const PAYMENT_CONFIG: PaymentConfig = {
  stripe: { paymentLink: '', publishableKey: '' },
  crypto: { provider: '', hostedBaseUrl: '', addresses: { BTC: '', ETH: '', USDT: '' } },
  bank: { accountName: '', iban: '', referencePrefix: 'LD' },
  limits: { minDeposit: 5, maxDeposit: 2000, minWithdraw: 10, withdrawFee: 0 },
};

export function isLiveCheckout(kind: CheckoutKind, methodId: string): string | null {
  if (kind === 'card' || kind === 'wallet') {
    return PAYMENT_CONFIG.stripe.paymentLink || null;
  }
  if (kind === 'crypto') {
    if (!PAYMENT_CONFIG.crypto.provider || !PAYMENT_CONFIG.crypto.hostedBaseUrl) return null;
    return PAYMENT_CONFIG.crypto.hostedBaseUrl;
  }
  return null; // bank: instructions flow, handled in-app
}

export function isTestMode(): boolean {
  return !PAYMENT_CONFIG.stripe.paymentLink && !PAYMENT_CONFIG.crypto.provider;
}
