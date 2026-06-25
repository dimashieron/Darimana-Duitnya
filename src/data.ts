/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppState } from './types';

export const INITIAL_STATE: AppState = {
  userName: 'Pengguna Baru',
  theme: 'light',
  wallets: [
    { id: 'cash', name: 'Cash', balance: 0, icon: 'Wallet', color: 'emerald' },
    { id: 'rekening', name: 'Rekening', balance: 0, icon: 'CreditCard', color: 'blue' },
  ],
  investments: [
    { id: 'emas', name: 'Emas', qty: 'Miliki', value: 0, percentChange: 0 },
    { id: 'saham', name: 'Saham', qty: 'Miliki', value: 0, percentChange: 0 },
    { id: 'crypto', name: 'Kripto', qty: 'Miliki', value: 0, percentChange: 0 },
  ],
  emergencyFund: {
    monthlyExpense: 0,
    monthTarget: 6,
    balance: 0,
  },
  savingGoals: [],
  budgets: [],
  transactions: [],
  categories: [
    { name: 'Makanan', icon: 'Utensils', color: 'bg-red-100 text-red-600 dark:bg-red-955 dark:text-red-400', isDefault: true },
    { name: 'Transportasi', icon: 'Car', color: 'bg-blue-100 text-blue-600 dark:bg-blue-955 dark:text-blue-400', isDefault: true },
    { name: 'Tagihan', icon: 'Receipt', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-955 dark:text-indigo-400', isDefault: true },
    { name: 'Belanja', icon: 'ShoppingBag', color: 'bg-pink-100 text-pink-600 dark:bg-pink-955 dark:text-pink-400', isDefault: true },
    { name: 'Kesehatan', icon: 'HeartPulse', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-955 dark:text-emerald-400', isDefault: true },
    { name: 'Gaji', icon: 'Briefcase', color: 'bg-green-100 text-green-600 dark:bg-green-955 dark:text-green-400', isDefault: true },
    { name: 'Bonus', icon: 'Gift', color: 'bg-amber-100 text-amber-600 dark:bg-amber-955 dark:text-amber-400', isDefault: true },
    { name: 'Freelance', icon: 'Laptop', color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-955 dark:text-cyan-405', isDefault: true },
    { name: 'Side Hustle', icon: 'Sparkles', color: 'bg-purple-100 text-purple-600 dark:bg-purple-955 dark:text-purple-400', isDefault: true },
    { name: 'Dagang', icon: 'Store', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-955 dark:text-emerald-400', isDefault: true },
    { name: 'Hibah / Hadiah', icon: 'Award', color: 'bg-rose-100 text-rose-600 dark:bg-rose-955 dark:text-rose-400', isDefault: true },
    { name: 'Investasi', icon: 'TrendingUp', color: 'bg-teal-100 text-teal-600 dark:bg-teal-955 dark:text-teal-400', isDefault: true },
    { name: 'Hiburan', icon: 'Gamepad2', color: 'bg-purple-100 text-purple-600 dark:bg-purple-955 dark:text-purple-400', isDefault: true },
    { name: 'Sedekah', icon: 'Heart', color: 'bg-rose-100 text-rose-600 dark:bg-rose-955 dark:text-rose-400', isDefault: true },
    { name: 'Pendidikan', icon: 'GraduationCap', color: 'bg-sky-100 text-sky-600 dark:bg-sky-955 dark:text-sky-400', isDefault: true },
    { name: 'Cicilan', icon: 'CreditCard', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-955 dark:text-indigo-400', isDefault: true },
    { name: 'Hutang', icon: 'Coins', color: 'bg-amber-100 text-amber-600 dark:bg-amber-955 dark:text-amber-400', isDefault: true },
    { name: 'Lainnya', icon: 'HelpCircle', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', isDefault: true },
  ],
};

export const CATEGORIES = [
  { name: 'Makanan', icon: 'Utensils', color: 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400' },
  { name: 'Transportasi', icon: 'Car', color: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400' },
  { name: 'Tagihan', icon: 'Receipt', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' },
  { name: 'Belanja', icon: 'ShoppingBag', color: 'bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400' },
  { name: 'Kesehatan', icon: 'HeartPulse', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' },
  { name: 'Gaji', icon: 'Briefcase', color: 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400' },
  { name: 'Bonus', icon: 'Gift', color: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400' },
  { name: 'Freelance', icon: 'Laptop', color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400' },
  { name: 'Side Hustle', icon: 'Sparkles', color: 'bg-purple-100 text-purple-600 dark:bg-purple-955 dark:text-purple-400' },
  { name: 'Dagang', icon: 'Store', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' },
  { name: 'Hibah / Hadiah', icon: 'Award', color: 'bg-rose-100 text-rose-600 dark:bg-rose-955 dark:text-rose-400' },
  { name: 'Investasi', icon: 'TrendingUp', color: 'bg-teal-100 text-teal-600 dark:bg-teal-950 dark:text-teal-400' },
  { name: 'Hiburan', icon: 'Gamepad2', color: 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400' },
  { name: 'Sedekah', icon: 'Heart', color: 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400' },
  { name: 'Pendidikan', icon: 'GraduationCap', color: 'bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400' },
  { name: 'Cicilan', icon: 'CreditCard', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' },
  { name: 'Hutang', icon: 'Coins', color: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400' },
  { name: 'Lainnya', icon: 'HelpCircle', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
];
