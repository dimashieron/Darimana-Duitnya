/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppState, Transaction, Wallet, SavingGoal, EmergencyFund, InvestmentAsset, Budget, AppCategory } from './types';

/**
 * Formats a number to Indonesian Rupiah (IDR) currency format.
 */
export function formatRupiah(value: number): string {
  if (isNaN(value)) value = 0;
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absValue);
  
  return `${isNegative ? '-' : ''}Rp ${formatted}`;
}

/**
 * Sanitizes and cleans AppState to prevent NaN, undefined properties, and database inconsistencies.
 */
export function sanitizeAppState(rawState: any, fallbackState: AppState): AppState {
  if (!rawState) return fallbackState;

  // 1. Sanitize simple fields
  const userName = typeof rawState.userName === 'string' && rawState.userName ? rawState.userName : (fallbackState.userName || 'User');
  const gasUrl = typeof rawState.gasUrl === 'string' ? rawState.gasUrl : fallbackState.gasUrl;
  const autoSync = typeof rawState.autoSync === 'boolean' ? rawState.autoSync : fallbackState.autoSync;
  const theme = (rawState.theme === 'light' || rawState.theme === 'dark' || rawState.theme === 'system') ? rawState.theme : fallbackState.theme;

  // 2. Sanitize transactions list
  const rawTx = Array.isArray(rawState.transactions) ? rawState.transactions : [];
  const transactions: Transaction[] = rawTx.map((tx: any) => {
    return {
      id: String(tx.id || Math.random().toString(36).substring(2, 9)),
      type: String(tx.type || 'pengeluaran') as any,
      nominal: Number(tx.nominal) && !isNaN(Number(tx.nominal)) ? Number(tx.nominal) : 0,
      category: String(tx.category || 'Lainnya'),
      date: String(tx.date || new Date().toISOString().split('T')[0]),
      source: String(tx.source || 'cash'),
      destination: tx.destination ? String(tx.destination) : undefined,
      notes: String(tx.notes || ''),
      attachment: tx.attachment ? String(tx.attachment) : null,
      timestamp: Number(tx.timestamp) && !isNaN(Number(tx.timestamp)) ? Number(tx.timestamp) : Date.now()
    };
  });

  // 3. Sanitize wallets
  const rawWallets = Array.isArray(rawState.wallets) ? rawState.wallets : [];
  let wallets: Wallet[] = rawWallets.map((w: any) => {
    return {
      id: String(w.id || 'cash'),
      name: String(w.name || 'Cash'),
      balance: Number(w.balance) && !isNaN(Number(w.balance)) ? Number(w.balance) : 0,
      icon: String(w.icon || 'Wallet'),
      color: String(w.color || 'emerald')
    };
  });
  if (wallets.length === 0) {
    wallets = fallbackState.wallets;
  }

  // 4. Sanitize saving goals
  const rawSavings = Array.isArray(rawState.savingGoals) ? rawState.savingGoals : [];
  const savingGoals: SavingGoal[] = rawSavings.map((g: any) => {
    return {
      id: String(g.id || Math.random().toString(36).substring(2, 9)),
      name: String(g.name || 'Tabungan'),
      target: Number(g.target) && !isNaN(Number(g.target)) ? Number(g.target) : 0,
      balance: Number(g.balance) && !isNaN(Number(g.balance)) ? Number(g.balance) : 0
    };
  });

  // 5. Sanitize emergency fund
  const rawEF = rawState.emergencyFund || {};
  const emergencyFund: EmergencyFund = {
    monthlyExpense: typeof rawEF.monthlyExpense !== 'undefined' && !isNaN(Number(rawEF.monthlyExpense)) ? Number(rawEF.monthlyExpense) : fallbackState.emergencyFund.monthlyExpense,
    monthTarget: typeof rawEF.monthTarget !== 'undefined' && !isNaN(Number(rawEF.monthTarget)) ? Number(rawEF.monthTarget) : fallbackState.emergencyFund.monthTarget,
    balance: typeof rawEF.balance !== 'undefined' && !isNaN(Number(rawEF.balance)) ? Number(rawEF.balance) : fallbackState.emergencyFund.balance,
  };

  // 6. Sanitize investments
  const rawInvest = Array.isArray(rawState.investments) ? rawState.investments : [];
  const investments: InvestmentAsset[] = rawInvest.map((inv: any) => {
    return {
      id: String(inv.id || 'emas'),
      name: String(inv.name || 'Emas'),
      qty: String(inv.qty || 'Miliki'),
      value: Number(inv.value) && !isNaN(Number(inv.value)) ? Number(inv.value) : 0,
      percentChange: Number(inv.percentChange) && !isNaN(Number(inv.percentChange)) ? Number(inv.percentChange) : 0
    };
  });
  if (investments.length === 0) {
    investments.push(
      { id: 'emas', name: 'Emas', qty: 'Miliki', value: 0, percentChange: 0 },
      { id: 'saham', name: 'Saham', qty: 'Miliki', value: 0, percentChange: 0 },
      { id: 'crypto', name: 'Kripto', qty: 'Miliki', value: 0, percentChange: 0 }
    );
  }

  // 7. Sanitize budgets
  const rawBudgets = Array.isArray(rawState.budgets) ? rawState.budgets : [];
  const budgets: Budget[] = rawBudgets.map((b: any) => {
    return {
      category: String(b.category || 'Makanan'),
      limit: Number(b.limit) && !isNaN(Number(b.limit)) ? Number(b.limit) : 0,
      spent: Number(b.spent) && !isNaN(Number(b.spent)) ? Number(b.spent) : 0
    };
  });

  return {
    userName,
    transactions,
    wallets,
    savingGoals,
    emergencyFund,
    investments,
    budgets,
    categories: rawState.categories || fallbackState.categories,
    gasUrl,
    autoSync,
    theme
  };
}

/**
 * Parses "dd/mm/yy" into a "YYYY-MM-DD" string for inputs, or vice-versa.
 */
export function parseDDMMYYToYYYYMMDD(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('/');
  if (parts.length !== 3) return dateStr;
  const day = parts[0].padStart(2, '0');
  const month = parts[1].padStart(2, '0');
  // Handle 2-digit years, assuming 2000s
  const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
  return `${year}-${month}-${day}`;
}

/**
 * Formats "YYYY-MM-DD" into a "dd/mm/yy" string.
 */
export function formatYYYYMMDDToDDMMYY(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parts[0].substring(2); // 2-digit year
  const month = parts[1];
  const day = parts[2];
  return `${day}/${month}/${year}`;
}

/**
 * Formats "YYYY-MM-DD" into Indonesian readable date (e.g., "7 Mei 2026").
 */
export function formatReadableDate(dateStr: string): string {
  if (!dateStr) return '';
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 
    'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return `${day} ${months[monthIndex] || ''} ${year}`;
}

/**
 * Generates a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Returns current local date in YYYY-MM-DD format
 */
export function getLocalYYYYMMDD(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns local YYYY-MM-DD date representation N days ago
 */
export function getLocalNDaysAgoYYYYMMDD(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
