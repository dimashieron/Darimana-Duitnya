/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, Calendar, MoreVertical, Pencil, Trash2, 
  X, Check, Utensils, Car, Receipt, ShoppingBag, HeartPulse, 
  Briefcase, Gift, Gamepad2, HelpCircle, TrendingUp, Info,
  Laptop, Sparkles, Store, Award
} from 'lucide-react';
import { AppState, Transaction, TransactionType } from '../types';
import { formatRupiah, formatReadableDate, getLocalYYYYMMDD, getLocalNDaysAgoYYYYMMDD } from '../utils';

interface HistoryTabProps {
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
  onEditTransaction: (tx: Transaction) => void;
  showToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export default function HistoryTab({ state, updateState, onEditTransaction, showToast }: HistoryTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'semua' | TransactionType>('semua');
  
  const getTodayISO = () => getLocalYYYYMMDD();
  const getNDaysAgoISO = (n: number) => getLocalNDaysAgoYYYYMMDD(n);

  const todayStr = getTodayISO();

  const [dateFilterType, setDateFilterType] = useState<'semua' | 'today' | '7days' | '30days' | 'custom'>('semua');
  const [customStartDate, setCustomStartDate] = useState(getNDaysAgoISO(30));
  const [customEndDate, setCustomEndDate] = useState(todayStr);
  const [showDateFilterPanel, setShowDateFilterPanel] = useState(false);

  // States for absolute menus
  const [menuTxId, setMenuTxId] = useState<string | null>(null);

  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Filter Categories Helper
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Makanan': return <Utensils className="w-5 h-5 text-red-500" />;
      case 'Transportasi': return <Car className="w-5 h-5 text-blue-500" />;
      case 'Tagihan': return <Receipt className="w-5 h-5 text-indigo-500" />;
      case 'Belanja': return <ShoppingBag className="w-5 h-5 text-pink-500" />;
      case 'Kesehatan': return <HeartPulse className="w-5 h-5 text-emerald-500" />;
      case 'Gaji': return <Briefcase className="w-5 h-5 text-green-500" />;
      case 'Bonus': return <Gift className="w-5 h-5 text-amber-500" />;
      case 'Freelance': return <Laptop className="w-5 h-5 text-cyan-500" />;
      case 'Side Hustle': return <Sparkles className="w-5 h-5 text-purple-500" />;
      case 'Dagang': return <Store className="w-5 h-5 text-emerald-500" />;
      case 'Hibah / Hadiah': return <Award className="w-5 h-5 text-rose-500" />;
      case 'Investasi': return <TrendingUp className="w-5 h-5 text-teal-500" />;
      case 'Hiburan': return <Gamepad2 className="w-5 h-5 text-purple-500" />;
      default: return <HelpCircle className="w-5 h-5 text-slate-500" />;
    }
  };

  const getCategoryColorClass = (category: string) => {
    switch (category) {
      case 'Makanan': return 'bg-red-50 dark:bg-red-950/40';
      case 'Transportasi': return 'bg-blue-50 dark:bg-blue-950/40';
      case 'Tagihan': return 'bg-indigo-50 dark:bg-indigo-950/40';
      case 'Belanja': return 'bg-pink-50 dark:bg-pink-950/40';
      case 'Kesehatan': return 'bg-emerald-50 dark:bg-emerald-950/40';
      case 'Gaji': return 'bg-green-50 dark:bg-green-950/40';
      case 'Bonus': return 'bg-amber-50 dark:bg-amber-950/40';
      case 'Freelance': return 'bg-cyan-50 dark:bg-cyan-950/40';
      case 'Side Hustle': return 'bg-purple-50 dark:bg-purple-950/40';
      case 'Dagang': return 'bg-emerald-50 dark:bg-emerald-950/40';
      case 'Hibah / Hadiah': return 'bg-rose-50 dark:bg-rose-950/40';
      case 'Investasi': return 'bg-teal-50 dark:bg-teal-950/40';
      case 'Hiburan': return 'bg-purple-50 dark:bg-purple-950/40';
      default: return 'bg-slate-50 dark:bg-slate-800';
    }
  };

  // Perform Delete transaction rollback balances
  const handleDeleteTransaction = (tx: Transaction) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Transaksi',
      message: 'Anda yakin menghapus transaksi ini?',
      onConfirm: () => {
        let updatedWallets = [...state.wallets];
        let updatedSavingGoals = [...state.savingGoals];
        let updatedEmergencyFund = { ...state.emergencyFund };
        let updatedBudgets = [...state.budgets];

        // Reverse ledger balances
        if (tx.type === 'pendapatan') {
          const srcWallet = updatedWallets.find(w => w.id === tx.source);
          if (srcWallet) srcWallet.balance -= tx.nominal;
        } else if (tx.type === 'pengeluaran') {
          const srcWallet = updatedWallets.find(w => w.id === tx.source);
          if (srcWallet) srcWallet.balance += tx.nominal;

          // Reverse Budget contribution
          const budget = updatedBudgets.find(b => b.category === tx.category);
          if (budget) {
            budget.spent = Math.max(0, budget.spent - tx.nominal);
          }
        } else if (tx.type === 'transfer') {
          const srcWallet = updatedWallets.find(w => w.id === tx.source);
          const destWallet = updatedWallets.find(w => w.id === tx.destination);
          if (srcWallet) srcWallet.balance += tx.nominal;
          if (destWallet) destWallet.balance -= tx.nominal;
        } else if (tx.type === 'tabungan') {
          const srcWallet = updatedWallets.find(w => w.id === tx.source);
          if (srcWallet) srcWallet.balance += tx.nominal;

          if (tx.destination === 'dana_darurat') {
            updatedEmergencyFund.balance = Math.max(0, updatedEmergencyFund.balance - tx.nominal);
          } else {
            const goal = updatedSavingGoals.find(g => g.id === tx.destination);
            if (goal) goal.balance = Math.max(0, goal.balance - tx.nominal);
          }
        } else if (tx.type === 'dana_darurat') {
          const srcWallet = updatedWallets.find(w => w.id === tx.source);
          if (srcWallet) srcWallet.balance += tx.nominal;
          updatedEmergencyFund.balance = Math.max(0, updatedEmergencyFund.balance - tx.nominal);
        } else if (tx.type === 'investasi') {
          const srcWallet = updatedWallets.find(w => w.id === tx.source);
          if (srcWallet) srcWallet.balance += tx.nominal;
          state.investments = state.investments.map(inv => {
            if (inv.id === tx.destination) {
              return { ...inv, value: Math.max(0, inv.value - tx.nominal) };
            }
            return inv;
          });
        } else if (tx.type === 'jual_aset') {
          const dstWallet = updatedWallets.find(w => w.id === tx.destination);
          if (dstWallet) dstWallet.balance -= tx.nominal;
          state.investments = state.investments.map(inv => {
            if (inv.id === tx.source) {
              return { ...inv, value: inv.value + tx.nominal };
            }
            return inv;
          });
        }

        const updatedTxList = state.transactions.filter(t => t.id !== tx.id);
        
        updateState({
          transactions: updatedTxList,
          wallets: updatedWallets,
          savingGoals: updatedSavingGoals,
          emergencyFund: updatedEmergencyFund,
          budgets: updatedBudgets,
        });

        setMenuTxId(null);
        if (showToast) {
          showToast('Transaksi terhapus!');
        }
      }
    });
  };

  // Perform queries filters with date range checking
  const filteredList = state.transactions
    .slice()
    .sort((a, b) => b.timestamp - a.timestamp)
    .filter(tx => {
      // 1. Search filter
      const matchesSearch = 
        (tx.notes || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        tx.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 2. Type filter
      const matchesFilter = activeFilter === 'semua' || tx.type === activeFilter;
      
      // 3. Date range filter
      let matchesDate = true;

      if (dateFilterType === 'today') {
        matchesDate = tx.date === todayStr;
      } else if (dateFilterType === '7days') {
        matchesDate = tx.date >= getNDaysAgoISO(7) && tx.date <= todayStr;
      } else if (dateFilterType === '30days') {
        matchesDate = tx.date >= getNDaysAgoISO(30) && tx.date <= todayStr;
      } else if (dateFilterType === 'custom') {
        if (customStartDate) {
          matchesDate = matchesDate && tx.date >= customStartDate;
        }
        if (customEndDate) {
          matchesDate = matchesDate && tx.date <= customEndDate;
        }
      }
      
      return matchesSearch && matchesFilter && matchesDate;
    });

  return (
    <div className="w-full pb-24 font-sans animate-fade-in relative">
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xs rounded-3xl p-6 shadow-2xl border border-slate-150 dark:border-slate-800 text-center">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mb-2">{confirmModal.title}</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{confirmModal.message}</p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-100 dark:border-slate-700 active:scale-95 transition-all text-center cursor-pointer"
              >
                No
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal(null);
                }}
                className={`flex-1 py-2.5 text-white text-xs font-bold rounded-xl shadow-md active:scale-95 transition-all text-center cursor-pointer ${
                  confirmModal.title.toLowerCase().includes('hapus') 
                    ? 'bg-rose-500 hover:bg-rose-600' 
                    : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">Riwayat Keuangan</h2>

      {/* Styled Search input with filter visual trigger */}
      <div className="flex gap-2.5 mb-4 relative">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-800 dark:text-slate-100"
            placeholder="Cari transaksi berdasarkan catatan atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button 
          id="btn-options-filters"
          onClick={() => setShowDateFilterPanel(!showDateFilterPanel)}
          className={`p-3 border rounded-2xl cursor-pointer transition-all ${
            showDateFilterPanel || dateFilterType !== 'semua'
              ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
              : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-emerald-500'
          }`}
          title="Filter Rentang Tanggal"
        >
          <Calendar className="w-5 h-5" />
        </button>
      </div>

      {/* Expandable Date Filters Panel */}
      {showDateFilterPanel && (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-150/85 dark:border-slate-800 rounded-3xl p-4 mb-4 space-y-3 animate-fade-in text-xs">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-800 dark:text-slate-200">Rentang Waktu</span>
            <button 
              onClick={() => {
                setDateFilterType('semua');
                setShowDateFilterPanel(false);
              }}
              className="text-[10px] text-slate-400 hover:text-slate-650 dark:hover:text-slate-300 font-bold"
            >
              Reset Filter
            </button>
          </div>

          {/* Quick options filter selection pills */}
          <div className="grid grid-cols-5 gap-1 select-none">
            {[
              { key: 'semua', label: 'Semua' },
              { key: 'today', label: 'Hari Ini' },
              { key: '7days', label: '7 Hari' },
              { key: '30days', label: '30 Hari' },
              { key: 'custom', label: 'Custom' },
            ].map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setDateFilterType(p.key as any)}
                className={`py-2 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer text-center ${
                  dateFilterType === p.key
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-100 dark:border-slate-700/80 text-slate-600 dark:text-slate-350'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Custom range date fields displaying native calendar picker */}
          {dateFilterType === 'custom' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 animate-fade-in">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Mulai Tanggal</label>
                <input
                  type="date"
                  onClick={(e) => {
                    try { e.currentTarget.showPicker(); } catch (err) {}
                  }}
                  onFocus={(e) => {
                    try { e.currentTarget.showPicker(); } catch (err) {}
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 rounded-xl font-bold text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Sampai Tanggal</label>
                <input
                  type="date"
                  onClick={(e) => {
                    try { e.currentTarget.showPicker(); } catch (err) {}
                  }}
                  onFocus={(e) => {
                    try { e.currentTarget.showPicker(); } catch (err) {}
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 rounded-xl font-bold text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Readable selected date output summary */}
          <div className="text-[10px] text-slate-400 dark:text-slate-500 italic font-medium px-0.5 leading-tight">
            {dateFilterType === 'semua' && 'Menampilkan seluruh riwayat transaksi Anda.'}
            {dateFilterType === 'today' && `Hari ini: ${formatReadableDate(todayStr)}`}
            {dateFilterType === '7days' && `Periode 7 hari ke belakang (${formatReadableDate(getNDaysAgoISO(7))} - ${formatReadableDate(todayStr)}).`}
            {dateFilterType === '30days' && `Periode 30 hari ke belakang (${formatReadableDate(getNDaysAgoISO(30))} - ${formatReadableDate(todayStr)}).`}
            {dateFilterType === 'custom' && `Periode custom: ${formatReadableDate(customStartDate)} s/d ${formatReadableDate(customEndDate)}.`}
          </div>
        </div>
      )}

      {/* Horizontal pill sliders for types toggle */}
      <div className="overflow-x-auto flex gap-2 pb-3 mb-4 scrollbar-none no-scrollbar select-none">
        {[
          { key: 'semua', label: 'Semua' },
          { key: 'pendapatan', label: 'Pemasukan' },
          { key: 'pengeluaran', label: 'Pengeluaran' },
          { key: 'tabungan', label: 'Tabungan' },
          { key: 'investasi', label: 'Investasi' },
          { key: 'jual_aset', label: 'Jual Aset' },
        ].map((pill) => (
          <button
            key={pill.key}
            onClick={() => setActiveFilter(pill.key as any)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer ${
              activeFilter === pill.key
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-450 border border-slate-100 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Transactions result list */}
      <div className="space-y-3">
        {filteredList.map((tx) => (
          <div 
            key={tx.id}
            className="bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 flex items-center justify-between hover:shadow-sm relative"
          >
            <div className="flex items-center gap-3.5">
              <div className={`p-3 rounded-2xl ${getCategoryColorClass(tx.category)}`}>
                {getCategoryIcon(tx.category)}
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                  {tx.notes || tx.category}
                </h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-505 mt-1">
                  {tx.type === 'transfer' ? (
                    <span>
                      Transfer dari {state.wallets.find(w => w.id === tx.source)?.name} ke {state.wallets.find(w => w.id === tx.destination)?.name}
                    </span>
                  ) : tx.type === 'tabungan' ? (
                    <span>
                      Tabungan dari {state.wallets.find(w => w.id === tx.source)?.name} ke {tx.destination === 'dana_darurat' ? 'Dana Darurat' : state.savingGoals.find(g => g.id === tx.destination)?.name || 'Kubah tabungan'}
                    </span>
                  ) : tx.type === 'investasi' ? (
                    <span>
                      Beli {state.investments.find(i => i.id === tx.destination)?.name || tx.destination} via {state.wallets.find(w => w.id === tx.source)?.name}
                    </span>
                  ) : tx.type === 'jual_aset' ? (
                    <span>
                      Jual {state.investments.find(i => i.id === tx.destination)?.name || tx.destination} ke {state.wallets.find(w => w.id === tx.source)?.name}
                    </span>
                  ) : (
                    <span>Sumber: {state.wallets.find(w => w.id === tx.source)?.name}</span>
                  )}
                  {' • '}
                  {formatReadableDate(tx.date)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className={`text-xs font-black font-sans ${
                  tx.type === 'pendapatan' || tx.type === 'jual_aset' ? 'text-emerald-500' :
                  tx.type === 'pengeluaran' ? 'text-slate-700 dark:text-slate-100' : 'text-amber-500'
                }`}>
                  {tx.type === 'pendapatan' || tx.type === 'jual_aset' ? '+' : '-'} {formatRupiah(tx.nominal)}
                </span>
                <span className="text-[9px] text-slate-400 block mt-1 uppercase font-bold tracking-wider">{tx.type === 'jual_aset' ? 'Jual Aset' : tx.type}</span>
              </div>

              {/* Triple Dot Menu */}
              <div className="relative">
                <button
                  id={`btn-menu-${tx.id}`}
                  onClick={() => setMenuTxId(menuTxId === tx.id ? null : tx.id)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                >
                  <MoreVertical className="w-4.5 h-4.5" />
                </button>

                {/* Absolutely positioned overlay actions */}
                {menuTxId === tx.id && (
                  <div className="absolute right-0 top-8 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl shadow-lg w-28 py-1.5 z-30 font-sans tracking-wide">
                    <button
                      onClick={() => {
                        onEditTransaction(tx);
                        setMenuTxId(null);
                      }}
                      className="w-full px-3 py-1.5 text-left text-[11px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 font-semibold cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5 text-blue-500" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTransaction(tx)}
                      className="w-full px-3 py-1.5 text-left text-[11px] text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-bold cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredList.length === 0 && (
          <div className="bg-white dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl py-12 text-center text-slate-400 text-xs">
            Tidak ada transaksi yang cocok dengan pencarian Anda.
          </div>
        )}
      </div>
    </div>
  );
}
