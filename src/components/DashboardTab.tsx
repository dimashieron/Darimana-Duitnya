/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Eye, EyeOff, Bell, Settings, ArrowRight, Wallet, 
  CreditCard, Smartphone, ShieldCheck, TrendingUp, PiggyBank,
  Utensils, Car, Receipt, ShoppingBag, HeartPulse, Briefcase, 
  Gift, Gamepad2, HelpCircle, Coins, Heart,
  Laptop, Sparkles, Store, Award, GraduationCap
} from 'lucide-react';
import { AppState, Transaction, Wallet as WalletType } from '../types';
import { formatRupiah, formatReadableDate } from '../utils';

interface DashboardTabProps {
  state: AppState;
  setActiveTab: (tab: 'home' | 'assets' | 'report' | 'history') => void;
  onOpenSettings: () => void;
  setAssetsSubTab?: (subTab: 'wallets' | 'portfolio' | 'savings' | 'emergency' | 'budget') => void;
}

export default function DashboardTab({ 
  state, setActiveTab, onOpenSettings, setAssetsSubTab 
}: DashboardTabProps) {
  const [hideBalances, setHideBalances] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Calculate stats dynamically
  const totalDompet = state.wallets.reduce((acc, w) => acc + w.balance, 0);
  const totalInvestasi = state.investments.reduce((acc, inv) => acc + inv.value, 0);
  const totalDanaDarurat = state.emergencyFund.balance;
  const totalTabungan = state.savingGoals.reduce((acc, g) => acc + g.balance, 0);

  // Net worth on Hero Card as seen in mockup
  const netWorth = totalDompet + totalInvestasi + totalDanaDarurat;

  // Dana Darurat Calculations
  const dfTarget = state.emergencyFund.monthlyExpense * state.emergencyFund.monthTarget;
  const dfPercent = dfTarget > 0 ? Math.round((totalDanaDarurat / dfTarget) * 100) : 0;

  // Helper for translating wallet visual backgrounds based on state color configurations
  const getWalletBgColorClass = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'sky': return 'bg-sky-500';
      case 'orange': return 'bg-orange-500';
      case 'purple': return 'bg-purple-500';
      case 'green': return 'bg-green-500';
      case 'emerald': return 'bg-emerald-500';
      case 'rose': return 'bg-rose-500';
      case 'indigo': return 'bg-indigo-500';
      default: return 'bg-slate-500';
    }
  };

  // Helper for rendering wallet icons
  const getWalletIcon = (iconName: string) => {
    switch (iconName) {
      case 'CreditCard': return <CreditCard className="w-5 h-5" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5" />;
      case 'Coins': return <Coins className="w-5 h-5" />;
      default: return <Wallet className="w-5 h-5" />;
    }
  };

  // Helper for transaction icons
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Makanan': return <Utensils className="w-4 h-4 text-red-500" />;
      case 'Transportasi': return <Car className="w-4 h-4 text-blue-500" />;
      case 'Tagihan': return <Receipt className="w-4 h-4 text-indigo-500" />;
      case 'Belanja': return <ShoppingBag className="w-4 h-4 text-pink-500" />;
      case 'Kesehatan': return <HeartPulse className="w-4 h-4 text-emerald-500" />;
      case 'Gaji': return <Briefcase className="w-4 h-4 text-green-500" />;
      case 'Bonus': return <Gift className="w-4 h-4 text-amber-500" />;
      case 'Freelance': return <Laptop className="w-4 h-4 text-cyan-500" />;
      case 'Side Hustle': return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'Dagang': return <Store className="w-4 h-4 text-emerald-500" />;
      case 'Hibah / Hadiah': return <Award className="w-4 h-4 text-rose-500" />;
      case 'Investasi': return <TrendingUp className="w-4 h-4 text-teal-500" />;
      case 'Hiburan': return <Gamepad2 className="w-4 h-4 text-purple-500" />;
      case 'Sedekah': return <Heart className="w-4 h-4 text-rose-500" />;
      case 'Pendidikan': return <GraduationCap className="w-4 h-4 text-sky-500" />;
      case 'Cicilan': return <CreditCard className="w-4 h-4 text-indigo-500" />;
      case 'Hutang': return <Coins className="w-4 h-4 text-amber-500" />;
      default: return <HelpCircle className="w-4 h-4 text-slate-500" />;
    }
  };

  const getCategoryColorClass = (category: string) => {
    switch (category) {
      case 'Makanan': return 'bg-red-50 dark:bg-red-950/40 text-red-500';
      case 'Transportasi': return 'bg-blue-50 dark:bg-blue-950/40 text-blue-500';
      case 'Tagihan': return 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500';
      case 'Belanja': return 'bg-pink-50 dark:bg-pink-950/40 text-pink-500';
      case 'Kesehatan': return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500';
      case 'Gaji': return 'bg-green-50 dark:bg-green-950/40 text-green-500';
      case 'Bonus': return 'bg-amber-50 dark:bg-amber-950/40 text-amber-500';
      case 'Freelance': return 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-500';
      case 'Side Hustle': return 'bg-purple-50 dark:bg-purple-950/40 text-purple-500';
      case 'Dagang': return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500';
      case 'Hibah / Hadiah': return 'bg-rose-50 dark:bg-rose-950/40 text-rose-500';
      case 'Investasi': return 'bg-teal-50 dark:bg-teal-950/40 text-teal-500';
      case 'Hiburan': return 'bg-purple-50 dark:bg-purple-950/40 text-purple-500';
      case 'Sedekah': return 'bg-rose-50 dark:bg-rose-950/40 text-rose-500';
      case 'Pendidikan': return 'bg-sky-50 dark:bg-sky-950/40 text-sky-500';
      case 'Cicilan': return 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500';
      case 'Hutang': return 'bg-amber-50 dark:bg-amber-950/40 text-amber-500';
      default: return 'bg-slate-50 dark:bg-slate-800 text-slate-500';
    }
  };

  const formatBalance = (amount: number) => {
    if (hideBalances) return '•••••••';
    return formatRupiah(amount);
  };

  // Pre-load top 3 recent transactions
  const topTransactions = state.transactions
    .slice()
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 3);

  return (
    <div className="w-full pb-24 animate-fade-in">
      {/* Header welcome user */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight">Beranda</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Halo, {state.userName || 'User'}!</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              id="btn-bell-notification"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-full text-slate-600 dark:text-slate-300 relative cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-72 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl shadow-xl p-4 z-40 animate-fade-in font-sans">
                <div className="flex justify-between items-center mb-2.5 border-b border-slate-50 dark:border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Notifikasi</span>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-[10px] text-emerald-500 hover:text-emerald-650 font-bold"
                  >
                    Tutup
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="p-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900 rounded-xl">
                    <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400">Peringatan Anggaran!</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-350 mt-0.5">Anggaran Transportasi Anda hampir habis (92% terpakai).</p>
                  </div>
                  
                  <div className="p-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-xl">
                    <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400">Peringatan Anggaran!</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-350 mt-0.5">Anggaran Makanan mendekati batas limit bulanan (83% terpakai).</p>
                  </div>

                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100/60 dark:border-emerald-950/50 rounded-xl">
                    <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Tabungan Aman</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-350 mt-0.5">1 dari target tabungan Anda berhasil disetor bulan ini.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button 
            id="btn-quick-settings"
            onClick={onOpenSettings}
            className="p-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-full text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hero Card: Total Wealth */}
      <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 dark:from-emerald-700 dark:to-teal-600 text-white rounded-3xl p-6 shadow-xl mb-6 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute right-12 -bottom-12 w-24 h-24 bg-white/10 rounded-full blur-lg" />
        
        <div className="flex items-center justify-between mb-3 relative z-10">
          <span className="text-[13px] font-medium opacity-90 tracking-wide uppercase font-sans">Total Kekayaan Bersih</span>
          <button 
            id="btn-toggle-balance"
            onClick={() => setHideBalances(!hideBalances)} 
            className="text-white/80 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
          >
            {hideBalances ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>

        <h1 className="text-3xl font-bold font-sans tracking-tight mb-6 relative z-10">
          {formatBalance(netWorth)}
        </h1>

        <div className="border-t border-white/20 pt-4 grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10 font-sans">
          <div>
            <span className="text-[10px] opacity-75 block">Dompet</span>
            <span className="text-xs font-semibold block mt-0.5 truncate">{formatBalance(totalDompet)}</span>
          </div>
          <div>
            <span className="text-[10px] opacity-75 block">Investasi</span>
            <span className="text-xs font-semibold block mt-0.5 truncate">{formatBalance(totalInvestasi)}</span>
          </div>
          <div>
            <span className="text-[10px] opacity-75 block">Tabungan</span>
            <span className="text-xs font-semibold block mt-0.5 truncate">{formatBalance(totalTabungan)}</span>
          </div>
          <div>
            <span className="text-[10px] opacity-75 block">Dana Darurat</span>
            <span className="text-xs font-semibold block mt-0.5 truncate">{formatBalance(totalDanaDarurat)}</span>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Dompet Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Dompet Saya</h3>
          <button 
            id="btn-view-all-wallets"
            onClick={() => {
              if (setAssetsSubTab) setAssetsSubTab('wallets');
              setActiveTab('assets');
            }}
            className="text-emerald-500 dark:text-emerald-400 text-xs font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        
        {/* Horizontal Scroll Containers */}
        <div className="overflow-x-auto flex gap-3 pb-3 snap-x scrollbar-none no-scrollbar">
          {state.wallets.map((wallet) => (
            <div 
              key={wallet.id}
              className="flex-shrink-0 w-36 bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 snap-center hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-3">
                <div className={`p-2 rounded-xl text-white ${getWalletBgColorClass(wallet.color)}`}>
                  {getWalletIcon(wallet.icon)}
                </div>
              </div>
              <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate mb-1">{wallet.name}</h4>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{formatBalance(wallet.balance)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dana Darurat Card - Section Terpisah */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-500 dark:text-emerald-400">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Dana Darurat</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-sans mt-0.5">Target {state.emergencyFund.monthTarget} bulan pengeluaran</p>
            </div>
          </div>
          <button 
            id="btn-manage-emergency-fund"
            onClick={() => {
              if (setAssetsSubTab) setAssetsSubTab('emergency');
              setActiveTab('assets');
            }}
            className="text-emerald-500 dark:text-emerald-400 text-xs font-semibold hover:underline cursor-pointer"
          >
            Kelola
          </button>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {formatBalance(totalDanaDarurat)} <span className="text-slate-400 font-normal">/ {formatRupiah(dfTarget)}</span>
            </span>
            <span className="text-xs font-bold text-emerald-500 dark:text-emerald-400">{dfPercent}%</span>
          </div>
          {/* Progress bar container */}
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700/60 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(dfPercent, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/65 rounded-xl p-3 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
          <span>Target Bulanan: {formatRupiah(state.emergencyFund.monthlyExpense)} / bln</span>
          <span className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />
          <span>Multiplier: x{state.emergencyFund.monthTarget} Bulan</span>
        </div>
      </div>

      {/* Investasi Grid Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Investasi</h3>
          <button 
            id="btn-view-investments"
            onClick={() => {
              if (setAssetsSubTab) setAssetsSubTab('portfolio');
              setActiveTab('assets');
            }}
            className="text-emerald-500 dark:text-emerald-400 text-xs font-semibold hover:underline cursor-pointer"
          >
            Lihat Detail
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {state.investments.map((inv) => (
            <div 
              key={inv.id} 
              className="bg-white dark:bg-slate-800/95 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-3.5 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">{inv.name}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block mt-0.5">{inv.qty}</span>
              </div>
              <div className="mt-4">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block truncate">{formatBalance(inv.value)}</span>
                <span className={`text-[10px] font-bold block mt-0.5 ${inv.percentChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {inv.percentChange >= 0 ? '+' : ''}{inv.percentChange}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabungan Section - Jar representation */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 rounded-xl text-amber-500">
            <Coins className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Tabungan Impian</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Total Simpanan</p>
            <p className="text-base font-extrabold text-slate-800 dark:text-slate-100 mt-1">{formatBalance(totalTabungan)}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="relative w-12 h-14 bg-slate-100 dark:bg-slate-750 border-2 border-slate-200 dark:border-slate-700 rounded-b-xl rounded-t-sm overflow-hidden flex flex-col justify-end">
            {/* savings visualizer */}
            <div 
              className="bg-amber-500 w-full h-2/3 rounded-b-lg animate-pulse"
              style={{ height: `${Math.min(90, (totalTabungan > 0 ? (totalTabungan / 20000000) * 100 : 10))}%` }}
            />
            {/* coin stacks inside jar */}
            <div className="absolute inset-0 flex flex-wrap content-end justify-center gap-0.5 p-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-600 shadow-sm" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-300 border border-amber-500 shadow-sm" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-600 shadow-sm" />
            </div>
          </div>
          <button 
            id="btn-view-savings"
            onClick={() => {
              if (setAssetsSubTab) setAssetsSubTab('savings');
              setActiveTab('assets');
            }}
            className="text-emerald-500 dark:text-emerald-400 text-[11px] font-bold mt-1 hover:underline cursor-pointer"
          >
            Lihat Tabungan
          </button>
        </div>
      </div>

      {/* Aktivitas Terakhir Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Aktivitas Terakhir</h3>
          <button 
            id="btn-view-all-history"
            onClick={() => setActiveTab('history')}
            className="text-emerald-500 dark:text-emerald-400 text-xs font-semibold hover:underline cursor-pointer"
          >
            Lihat Semua
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {topTransactions.map((tx) => (
            <div 
              key={tx.id}
              className="bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 flex items-center justify-between hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${getCategoryColorClass(tx.category)}`}>
                  {getCategoryIcon(tx.category)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{tx.notes || tx.category}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-sans">
                    {tx.type === 'transfer' ? `Transfer ke ${state.wallets.find(w => w.id === tx.destination)?.name || tx.destination}` : state.wallets.find(w => w.id === tx.source)?.name || tx.source}
                    {' • '}
                    {formatReadableDate(tx.date)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs font-extrabold font-sans leading-none ${
                  tx.type === 'pendapatan' ? 'text-emerald-500 dark:text-emerald-400' :
                  tx.type === 'pengeluaran' ? 'text-slate-700 dark:text-slate-200' : 'text-amber-500'
                }`}>
                  {tx.type === 'pendapatan' ? '+' : '-'} {formatRupiah(tx.nominal)}
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5 font-sans font-medium uppercase tracking-wider">{tx.type}</span>
              </div>
            </div>
          ))}

          {topTransactions.length === 0 && (
            <div className="bg-white dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-750 rounded-2xl py-8 text-center text-slate-400 text-xs">
              Belum ada transaksi terdaftar. Ketuk '+' untuk menambahkan!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
