export type TxType = 'deposit' | 'withdraw' | 'win' | 'open';

export interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  label: string;
  date: string;
  method?: string;
  status?: 'completed' | 'pending' | 'failed';
}

const BAL_KEY = 'packdraw_balance';
const TX_KEY = 'packdraw_txs';

function readBal(): number {
  try {
    const v = localStorage.getItem(BAL_KEY);
    if (v !== null) return parseFloat(v) || 0;
  } catch { /* ignore */ }
  return 25.0; // starter bonus
}

function readTx(): Transaction[] {
  try {
    const v = localStorage.getItem(TX_KEY);
    if (v) return JSON.parse(v);
  } catch { /* ignore */ }
  return [
    { id: 'tx-welcome', type: 'deposit', amount: 25, label: 'Welcome bonus', date: new Date().toISOString() },
  ];
}

function persist(bal: number, txs: Transaction[]) {
  try {
    localStorage.setItem(BAL_KEY, String(bal));
    localStorage.setItem(TX_KEY, JSON.stringify(txs.slice(0, 100)));
  } catch { /* ignore */ }
}

export const WalletService = {
  getBalance(): number {
    return readBal();
  },
  getTransactions(): Transaction[] {
    return readTx();
  },
  deposit(amount: number, label = 'Deposit', method = 'card'): { balance: number; txs: Transaction[] } {
    const bal = +(readBal() + amount).toFixed(2);
    const txs = [{ id: `tx-${Date.now()}`, type: 'deposit' as TxType, amount, label, date: new Date().toISOString(), method, status: 'completed' as const }, ...readTx()];
    persist(bal, txs);
    return { balance: bal, txs };
  },
  withdraw(amount: number, label = 'Withdraw', method = 'bank'): { balance: number; txs: Transaction[]; error?: string } {
    const bal = readBal();
    if (amount > bal) return { balance: bal, txs: readTx(), error: 'Insufficient balance' };
    const nb = +(bal - amount).toFixed(2);
    const txs = [{ id: `tx-${Date.now()}`, type: 'withdraw' as TxType, amount: -amount, label, date: new Date().toISOString(), method, status: 'pending' as const }, ...readTx()];
    persist(nb, txs);
    return { balance: nb, txs };
  },
  creditWin(amount: number, label: string): { balance: number; txs: Transaction[] } {
    const bal = readBal() + amount;
    const txs = [{ id: `tx-${Date.now()}`, type: 'win' as TxType, amount, label, date: new Date().toISOString() }, ...readTx()];
    persist(bal, txs);
    return { balance: bal, txs };
  },
  spend(amount: number, label: string): { balance: number; txs: Transaction[]; error?: string } {
    const bal = readBal();
    if (amount > bal) return { balance: bal, txs: readTx(), error: 'Insufficient balance' };
    const nb = +(bal - amount).toFixed(2);
    const txs = [{ id: `tx-${Date.now()}`, type: 'withdraw' as TxType, amount: -amount, label, date: new Date().toISOString() }, ...readTx()];
    persist(nb, txs);
    return { balance: nb, txs };
  },
};
