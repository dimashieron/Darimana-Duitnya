/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransactionType = 'pengeluaran' | 'pendapatan' | 'transfer' | 'tabungan' | 'dana_darurat' | 'investasi' | 'jual_aset';

export interface Transaction {
  id: string;
  type: TransactionType;
  nominal: number;
  category: string;
  date: string; // YYYY-MM-DD
  source: string; // e.g., 'cash', 'rekening', 'dana', 'gopay', 'ovo', 'shopeepay'
  destination?: string; // used for transfer (e.g., another wallet), tabungan (id of saving goal), or 'dana_darurat'
  notes: string;
  attachment?: string | null; // Base64 encoding of image/PDF
  timestamp: number;
}

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  icon: string;
  color: string;
}

export interface SavingGoal {
  id: string;
  name: string;
  target: number;
  balance: number;
}

export interface EmergencyFund {
  monthlyExpense: number;
  monthTarget: number; // e.g., 6 months
  balance: number;
}

export interface InvestmentAsset {
  id: string; // 'emas' | 'crypto' | 'saham'
  name: string;
  qty: string;
  value: number;
  percentChange: number;
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
}

export interface AppCategory {
  name: string;
  icon: string;
  color: string;
  isDefault?: boolean;
  txType?: 'pengeluaran' | 'pendapatan';
}

export interface AppState {
  userName: string;
  transactions: Transaction[];
  wallets: Wallet[];
  savingGoals: SavingGoal[];
  emergencyFund: EmergencyFund;
  investments: InvestmentAsset[];
  budgets: Budget[];
  categories?: AppCategory[];
  theme: 'light' | 'dark' | 'system';
  isActivated?: boolean;
  activationCode?: string;
}
