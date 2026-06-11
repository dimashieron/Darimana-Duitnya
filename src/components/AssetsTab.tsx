/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  TrendingUp, Shield, HelpCircle, Coins, Plus, Minus, Check,
  AlertTriangle, DollarSign, Wallet, Percent, Settings, Pencil, Info,
  Trash2, CreditCard, Smartphone
} from 'lucide-react';
import { AppState, SavingGoal, Wallet as WalletType, InvestmentAsset, Budget, TransactionType } from '../types';
import { formatRupiah, generateId } from '../utils';

export type SubTabType = 'wallets' | 'portfolio' | 'savings' | 'emergency' | 'budget';

interface AssetsTabProps {
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
  openTransactionWithParams: (params: { type: TransactionType; source?: string; destination?: string }) => void;
  subTab: SubTabType;
  setSubTab: (subTab: SubTabType) => void;
}

export default function AssetsTab({ 
  state, updateState, openTransactionWithParams, subTab, setSubTab 
}: AssetsTabProps) {
  
  // States for adding savings goal
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalInitial, setGoalInitial] = useState('');
  const [editingGoal, setEditingGoal] = useState<SavingGoal | null>(null);

  // States for updating Emergency fund planner
  const [editingEmergency, setEditingEmergency] = useState(false);
  const [monthlyExpenseInput, setMonthlyExpenseInput] = useState(state.emergencyFund.monthlyExpense.toString());
  const [targetMonthsInput, setTargetMonthsInput] = useState(state.emergencyFund.monthTarget);

  // States for updating Budget Planner limit
  const [editingBudgetIndex, setEditingBudgetIndex] = useState<number | null>(null);
  const [editingBudgetLimit, setEditingBudgetLimit] = useState('');

  const [showAddBudget, setShowAddBudget] = useState(false);
  const [newBudgetCategory, setNewBudgetCategory] = useState('Makanan');
  const [newBudgetLimit, setNewBudgetLimit] = useState('');

  // States for managing wallets
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [editingWallet, setEditingWallet] = useState<WalletType | null>(null);
  const [walletName, setWalletName] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [walletIcon, setWalletIcon] = useState('Wallet');
  const [walletColor, setWalletColor] = useState('emerald');

  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Calculate totals
  const totalInvestasi = state.investments.reduce((acc, inv) => acc + inv.value, 0);
  const totalTabungan = state.savingGoals.reduce((acc, goal) => acc + goal.balance, 0);
  const totalDanaDarurat = state.emergencyFund.balance;

  // Investment Percentages
  const getInvestmentPercentages = () => {
    if (totalInvestasi === 0) {
      const defaultPercents: Record<string, number> = {};
      state.investments.forEach(i => {
        defaultPercents[i.id] = 0;
      });
      return defaultPercents;
    }
    const percents: Record<string, number> = {};
    let sum = 0;
    state.investments.forEach((inv, idx) => {
      if (idx === state.investments.length - 1) {
        percents[inv.id] = Math.max(0, 100 - sum);
      } else {
        const p = Math.round((inv.value / totalInvestasi) * 100);
        percents[inv.id] = p;
        sum += p;
      }
    });
    return percents;
  };

  const invPct = getInvestmentPercentages();

  // Create or Update Savings Goal handler
  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const name = goalName.trim();
    const target = parseFloat(goalTarget.replace(/[^0-9]/g, '')) || 0;

    if (!name || target <= 0) return;

    if (editingGoal) {
      setConfirmModal({
        isOpen: true,
        title: 'Ubah Target Tabungan',
        message: `Apakah Anda yakin ingin menyimpan perubahan pada target tabungan "${name}"?`,
        onConfirm: () => {
          const updatedGoals = state.savingGoals.map(g => 
            g.id === editingGoal.id ? { ...g, name, target } : g
          );
          updateState({
            savingGoals: updatedGoals
          });
          // Clear and close
          setGoalName('');
          setGoalTarget('');
          setGoalInitial('');
          setEditingGoal(null);
          setShowGoalModal(false);
        }
      });
    } else {
      const initial = parseFloat(goalInitial.replace(/[^0-9]/g, '')) || 0;
      const newGoal: SavingGoal = {
        id: `tab_${generateId()}`,
        name,
        target,
        balance: initial,
      };

      // If initial deposit is supplied, adjust wallets:
      // Subtract from the primary 'rekening' or the wallet with the highest funds to keep double-entry bookkeeping logical
      let updatedWallets = [...state.wallets];
      if (initial > 0) {
        const highestWallet = updatedWallets.find(w => w.id === 'rekening') || updatedWallets[0];
        if (highestWallet) {
          highestWallet.balance -= initial;
        }
      }

      const updatedGoals = [...state.savingGoals, newGoal];
      updateState({
        savingGoals: updatedGoals,
        wallets: updatedWallets,
      });

      // Clear and close
      setGoalName('');
      setGoalTarget('');
      setGoalInitial('');
      setEditingGoal(null);
      setShowGoalModal(false);
    }
  };

  const handleDeleteGoal = (goalId: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Target Tabungan',
      message: `Apakah Anda yakin ingin menghapus target tabungan "${name}"?`,
      onConfirm: () => {
        const updatedGoals = state.savingGoals.filter(g => g.id !== goalId);
        updateState({ savingGoals: updatedGoals });
      }
    });
  };

  // Handle Wallet Management (Create / Update)
  const handleCreateOrUpdateWallet = (e: React.FormEvent) => {
    e.preventDefault();
    const name = walletName.trim();
    // Balance is only set directly when editing, or defaults to 0 when creating
    const balance = editingWallet ? (parseFloat(walletBalance.replace(/[^0-9-]/g, '')) || 0) : 0;

    if (!name) return;

    if (editingWallet) {
      setConfirmModal({
        isOpen: true,
        title: 'Ubah Data Dompet',
        message: `Apakah Anda yakin ingin menyimpan perubahan pada dompet "${name}"?`,
        onConfirm: () => {
          const updatedWallets = state.wallets.map((w) =>
            w.id === editingWallet.id ? { ...w, name, balance, icon: walletIcon, color: walletColor } : w
          );
          updateState({ wallets: updatedWallets });

          // Reset and close
          setWalletName('');
          setWalletBalance('');
          setWalletIcon('Wallet');
          setWalletColor('emerald');
          setEditingWallet(null);
          setShowWalletModal(false);
        }
      });
    } else {
      const walletId = `wallet_${generateId()}`;
      const newWallet: WalletType = {
        id: walletId,
        name,
        balance: 0, // Starts at 0
        icon: walletIcon,
        color: walletColor,
      };

      const updateData: Partial<AppState> = {
        wallets: [...state.wallets, newWallet]
      };

      // No initial balance transaction added!

      updateState(updateData);

      // Reset and close
      setWalletName('');
      setWalletBalance('');
      setWalletIcon('Wallet');
      setWalletColor('emerald');
      setEditingWallet(null);
      setShowWalletModal(false);
    }
  };

  const handleDeleteWallet = (walletId: string, name: string) => {
    if (state.wallets.length <= 1) {
      setConfirmModal({
        isOpen: true,
        title: 'Pembatasan',
        message: 'Anda harus memiliki minimal satu dompet utama!',
        onConfirm: () => {}
      });
      return;
    }
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Dompet Saya',
      message: `Apakah Anda yakin ingin menghapus dompet "${name}"? Semua data transaksi terkait dompet ini akan tetap tersimpan.`,
      onConfirm: () => {
        const updatedWallets = state.wallets.filter((w) => w.id !== walletId);
        updateState({ wallets: updatedWallets });
      }
    });
  };

  // Adjust Emergency Fund Settings
  const handleSaveEmergencyFundSettings = () => {
    const expense = parseFloat(monthlyExpenseInput.replace(/[^0-9]/g, '')) || 0;
    setConfirmModal({
      isOpen: true,
      title: 'Ubah Pengaturan Dana Darurat',
      message: 'Apakah Anda yakin ingin menyimpan batas baru pengeluaran bulanan dana darurat?',
      onConfirm: () => {
        updateState({
          emergencyFund: {
            ...state.emergencyFund,
            monthlyExpense: expense,
            monthTarget: targetMonthsInput,
          }
        });
        setEditingEmergency(false);
      }
    });
  };

  // Manage Budget limits
  const handleSaveBudgetLimit = (index: number) => {
    const limit = parseFloat(editingBudgetLimit.replace(/[^0-9]/g, '')) || 0;
    if (limit <= 0) return;

    setConfirmModal({
      isOpen: true,
      title: 'Ubah Batas Anggaran',
      message: `Apakah Anda yakin ingin mengubah batas anggaran untuk kategori "${state.budgets[index].category}"?`,
      onConfirm: () => {
        const updatedBudgets = [...state.budgets];
        updatedBudgets[index].limit = limit;
        
        updateState({ budgets: updatedBudgets });
        setEditingBudgetIndex(null);
      }
    });
  };

  const handleDeleteBudget = (index: number, category: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Anggaran Kategori',
      message: `Apakah Anda yakin ingin menghapus anggaran untuk kategori "${category}"?`,
      onConfirm: () => {
        const updatedBudgets = state.budgets.filter((_, i) => i !== index);
        updateState({ budgets: updatedBudgets });
      }
    });
  };

  // Add category Budget Limit
  const handleAddBudgetLimit = (e: React.FormEvent) => {
    e.preventDefault();
    const limit = parseFloat(newBudgetLimit.replace(/[^0-9]/g, '')) || 0;
    if (limit <= 0) return;

    // Check if category already has a budget
    const existingIndex = state.budgets.findIndex(b => b.category === newBudgetCategory);
    let updatedBudgets = [...state.budgets];

    if (existingIndex > -1) {
      updatedBudgets[existingIndex].limit = limit;
    } else {
      updatedBudgets.push({
        category: newBudgetCategory,
        limit,
        spent: 0
      });
    }

    updateState({ budgets: updatedBudgets });
    setNewBudgetLimit('');
    setShowAddBudget(false);
  };

  return (
    <div className="w-full pb-24 font-sans animate-fade-in">
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

      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">Akun Aset</h2>

      {/* Modern Segmented Controller Sub-tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-900/60 p-1 rounded-2xl mb-6 relative z-10 select-none overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSubTab('wallets')}
          className={`flex-1 min-w-[70px] py-1.5 whitespace-nowrap text-center text-[10px] font-bold rounded-xl transition-all duration-150 cursor-pointer ${
            subTab === 'wallets'
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Dompet Saya
        </button>
        <button
          onClick={() => setSubTab('portfolio')}
          className={`flex-1 min-w-[65px] py-1.5 whitespace-nowrap text-center text-[10px] font-bold rounded-xl transition-all duration-150 cursor-pointer ${
            subTab === 'portfolio'
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Investasi
        </button>
        <button
          onClick={() => setSubTab('savings')}
          className={`flex-1 min-w-[65px] py-1.5 whitespace-nowrap text-center text-[10px] font-bold rounded-xl transition-all duration-150 cursor-pointer ${
            subTab === 'savings'
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Tabungan
        </button>
        <button
          onClick={() => setSubTab('emergency')}
          className={`flex-1 min-w-[65px] py-1.5 whitespace-nowrap text-center text-[10px] font-bold rounded-xl transition-all duration-150 cursor-pointer ${
            subTab === 'emergency'
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Darurat
        </button>
        <button
          onClick={() => setSubTab('budget')}
          className={`flex-1 min-w-[65px] py-1.5 whitespace-nowrap text-center text-[10px] font-bold rounded-xl transition-all duration-150 cursor-pointer ${
            subTab === 'budget'
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Budget
        </button>
      </div>

      {/* SUB TAB: WALLETS (DOMPET SAYA) */}
      {subTab === 'wallets' && (
        <div className="space-y-6">
          {/* Total Dompet Header Card */}
          <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-3xl p-5 shadow-lg flex items-center justify-between relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-15 translate-x-4 translate-y-4">
              <Wallet className="w-32 h-32 stroke-[1.5]" />
            </div>

            <div className="relative z-10">
              <span className="text-[11px] font-medium opacity-90 tracking-wide uppercase">Total Saldo Dompet</span>
              <h3 className="text-2xl font-black mt-1">
                {formatRupiah(state.wallets.reduce((acc, w) => acc + w.balance, 0))}
              </h3>
              <p className="text-[10px] text-emerald-100 mt-1">Uang fisik, rekening bank, & e-wallet</p>
            </div>

            <button
              id="btn-add-new-wallet"
              onClick={() => {
                setEditingWallet(null);
                setWalletName('');
                setWalletBalance('');
                setWalletIcon('Wallet');
                setWalletColor('emerald');
                setShowWalletModal(true);
              }}
              className="bg-white text-emerald-600 hover:bg-emerald-50 px-3.5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 font-bold text-xs shadow-sm transition-all relative z-10 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Tambah Dompet
            </button>
          </div>

          {/* List of Wallets/Accounts */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 px-1">Daftar Dompet & Akun</h4>

            {state.wallets.map((wallet) => {
              // Helper to map tailwind background colors based on state color string
              const getBgColorClass = (color: string) => {
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

              const getWalletIconElement = (iconName: string) => {
                switch (iconName) {
                  case 'CreditCard': return <CreditCard className="w-5 h-5" />;
                  case 'Smartphone': return <Smartphone className="w-5 h-5" />;
                  case 'Coins': return <Coins className="w-5 h-5" />;
                  default: return <Wallet className="w-5 h-5" />;
                }
              };

              return (
                <div 
                  key={wallet.id}
                  className="bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex items-center justify-between animate-fade-in"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-3 rounded-xl text-white ${getBgColorClass(wallet.color)}`}>
                      {getWalletIconElement(wallet.icon)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{wallet.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{formatRupiah(wallet.balance)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingWallet(wallet);
                          setWalletName(wallet.name);
                          setWalletBalance(wallet.balance.toString());
                          setWalletIcon(wallet.icon);
                          setWalletColor(wallet.color);
                          setShowWalletModal(true);
                        }}
                        className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-400 hover:text-emerald-550 dark:hover:text-slate-350 rounded-lg transition cursor-pointer"
                        title="Edit Dompet"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteWallet(wallet.id, wallet.name)}
                        className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-400 hover:text-rose-500 rounded-lg transition cursor-pointer"
                        title="Hapus Dompet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Wallet Modal backdrop */}
          {showWalletModal && (
            <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
              <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl p-5 border border-slate-150 dark:border-slate-800 shadow-xl">
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mb-4">
                  {editingWallet ? 'Edit Akun Dompet' : 'Tambah Akun Dompet Baru'}
                </h3>

                <form onSubmit={handleCreateOrUpdateWallet} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Nama Dompet / Akun</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                      placeholder="Contoh: Bank Jago, Gopay, Tunai Saku"
                      value={walletName}
                      onChange={(e) => setWalletName(e.target.value)}
                      required
                    />
                  </div>

                   {editingWallet ? (
                    <div>
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Saldo Saat Ini (Rp)</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 text-xs font-semibold focus:ring-1 focus:ring-emerald-500 outline-none"
                        placeholder="Contoh: 1.500.000"
                        value={walletBalance}
                        onChange={(e) => {
                          const numeric = e.target.value.replace(/[^0-9]/g, '');
                          setWalletBalance(numeric ? parseInt(numeric).toLocaleString('id-ID') : '');
                        }}
                        required
                      />
                    </div>
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 p-3 rounded-xl text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                      Tips: Dompet baru akan dibuat dengan saldo awal <span className="text-emerald-600 dark:text-emerald-400 font-bold">Rp 0</span>. Gunakan tombol <span className="text-emerald-600 dark:text-emerald-400 font-bold">"+"</span> di halaman utama untuk mencatat transaksi pendapatan atau transfer saldo ke dompet ini!
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">Pilih Icon</label>
                    <div className="grid grid-cols-4 gap-2.5">
                      {[
                        { name: 'Wallet', label: 'Tunai / Dompet' },
                        { name: 'CreditCard', label: 'Kartu ATM / Rekening' },
                        { name: 'Smartphone', label: 'E-Wallet / Fintech' },
                        { name: 'Coins', label: 'Investasi / Koin' }
                      ].map((item) => {
                        const isSelected = walletIcon === item.name;
                        return (
                          <button
                            key={item.name}
                            type="button"
                            title={item.label}
                            onClick={() => setWalletIcon(item.name)}
                            className={`p-3.5 rounded-xl border flex items-center justify-center transition cursor-pointer ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-50/20 text-emerald-500'
                                : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
                            }`}
                          >
                            {item.name === 'CreditCard' ? (
                              <CreditCard className="w-5 h-5" />
                            ) : item.name === 'Smartphone' ? (
                              <Smartphone className="w-5 h-5" />
                            ) : item.name === 'Coins' ? (
                              <Coins className="w-5 h-5" />
                            ) : (
                              <Wallet className="w-5 h-5" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Pilih Warna Representatif</label>
                    <div className="flex gap-2 font-sans">
                      {['emerald', 'blue', 'sky', 'orange', 'purple', 'green', 'rose', 'indigo'].map((colorName) => {
                        const colors: Record<string, string> = {
                          emerald: 'bg-emerald-500',
                          blue: 'bg-blue-500',
                          sky: 'bg-sky-500',
                          orange: 'bg-orange-500',
                          purple: 'bg-purple-500',
                          green: 'bg-green-500',
                          rose: 'bg-rose-500',
                          indigo: 'bg-indigo-500',
                        };
                        const isSelected = walletColor === colorName;
                        return (
                          <button
                            key={colorName}
                            type="button"
                            onClick={() => setWalletColor(colorName)}
                            className={`w-6 h-6 rounded-full ${colors[colorName]} transition-transform cursor-pointer ${
                              isSelected ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'opacity-85 hover:opacity-100'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2.5 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowWalletModal(false)}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs text-slate-705 dark:text-slate-100 rounded-xl font-bold cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 text-xs text-white rounded-xl font-bold cursor-pointer"
                    >
                      Simpan Dompet
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB TAB: PORTFOLIO */}
      {subTab === 'portfolio' && (
        <div className="space-y-6">
          {/* Nilai Investasi Hero */}
          <div className="bg-gradient-to-tr from-teal-600 to-cyan-500 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex items-center justify-between">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
            <div className="relative z-10">
              <span className="text-[11px] font-medium opacity-90 tracking-wide uppercase">Total Nilai Investasi</span>
              <h3 className="text-2xl font-black mt-1 select-none">
                {formatRupiah(totalInvestasi)}
              </h3>
              <p className="text-[11px] opacity-90 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +8,2% <span>dari bulan lalu</span>
              </p>
            </div>

            {/* Simulated Pie Chart */}
            <div className="relative w-20 h-20 z-10 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                
                {(() => {
                  let cumOffset = 100;
                  const strokes = ['#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#ec4899', '#8b5cf6', '#14b8a6', '#f43f5e'];
                  return state.investments.map((inv, idx) => {
                    const percentage = invPct[inv.id] || 0;
                    if (percentage === 0) return null;
                    const strokeColor = strokes[idx % strokes.length];
                    const dashArray = `${percentage} ${100 - percentage}`;
                    const dashOffset = cumOffset;
                    cumOffset -= percentage;
                    return (
                      <circle 
                        key={inv.id}
                        cx="18" 
                        cy="18" 
                        r="15.915" 
                        fill="none" 
                        stroke={strokeColor} 
                        strokeWidth="3.2" 
                        strokeDasharray={dashArray} 
                        strokeDashoffset={dashOffset} 
                      />
                    );
                  });
                })()}
              </svg>
            </div>
          </div>

          {/* Allocation Breakdown */}
          <div className="bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 px-1">Alokasi Investasi</h4>
            
            <div className="space-y-4">
              {state.investments.map((inv, idx) => {
                const strokeColors = ['bg-amber-500', 'bg-emerald-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-pink-500', 'bg-purple-500', 'bg-teal-500', 'bg-rose-500'];
                const badgeColor = strokeColors[idx % strokeColors.length];
                const percentage = invPct[inv.id] || 0;

                return (
                  <div key={inv.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${badgeColor}`} />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{inv.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono font-medium">({inv.qty})</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{percentage}% dari portfolio</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 block">{formatRupiah(inv.value)}</span>
                      <span className={`text-[10px] font-bold ${inv.percentChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {inv.percentChange >= 0 ? '+' : ''}{inv.percentChange}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core Interactive Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button
              id="btn-buy-asset"
              onClick={() => openTransactionWithParams({ type: 'investasi' })}
              className="py-3 px-4 bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-sm hover:shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer text-xs"
            >
              <Plus className="w-4 h-4" /> Beli Aset
            </button>
            <button
              id="btn-sell-asset"
              onClick={() => openTransactionWithParams({ type: 'jual_aset' })}
              className="py-3 px-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/85 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/90 font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer text-xs"
            >
              <Minus className="w-4 h-4" /> Jual Aset
            </button>
          </div>
        </div>
      )}

      {/* SUB TAB: SAVINGS (TABUNGAN) */}
      {subTab === 'savings' && (
        <div className="space-y-6">
          {/* Total Tabungan Header */}
          <div className="bg-gradient-to-tr from-amber-500 to-orange-400 text-white rounded-2xl p-5 shadow-sm flex items-center justify-between relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-15 translate-x-4 translate-y-4">
              <Coins className="w-32 h-32 stroke-[1.5]" />
            </div>
            
            <div className="relative z-10">
              <span className="text-[11px] font-medium opacity-90 tracking-wide uppercase">Total Saldo Tabungan</span>
              <h3 className="text-2xl font-black mt-1">{formatRupiah(totalTabungan)}</h3>
              <p className="text-[10px] text-amber-50 mt-1">Simpanan Impian masa depan Anda</p>
            </div>

            <button
              id="btn-dashboard-create-saving"
              onClick={() => setShowGoalModal(true)}
              className="bg-white text-orange-500 hover:bg-orange-50 px-3.5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 font-bold text-xs shadow-sm transition-all relative z-10 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Tambah Target Tabungan
            </button>
          </div>

          {/* List of Saving Goals */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 px-1">Daftar Tabungan</h4>
            
            {state.savingGoals.map((goal) => {
              const progressPct = goal.target > 0 ? Math.round((goal.balance / goal.target) * 100) : 0;
              return (
                <div 
                  key={goal.id} 
                  className="bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{goal.name}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Target: {formatRupiah(goal.target)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">{formatRupiah(goal.balance)}</span>
                      <span className="text-[10px] font-bold text-amber-500">{progressPct}%</span>
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700/60 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-400 h-full rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(progressPct, 100)}%` }}
                    />
                  </div>

                  {/* Quick Fund, Edit, & Delete Buttons */}
                  <div className="flex justify-between items-center mt-3.5 pt-3 border-t border-slate-50 dark:border-slate-700/50">
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingGoal(goal);
                          setGoalName(goal.name);
                          setGoalTarget(goal.target.toLocaleString('id-ID'));
                          setGoalInitial('0');
                          setShowGoalModal(true);
                        }}
                        className="text-[10px] font-bold text-slate-400 dark:text-slate-450 hover:text-orange-500 dark:hover:text-amber-400 flex items-center gap-1 transition cursor-pointer"
                        title="Edit Target Tabungan"
                      >
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id, goal.name)}
                        className="text-[10px] font-bold text-slate-400 dark:text-slate-450 hover:text-rose-500 flex items-center gap-1 transition cursor-pointer"
                        title="Hapus Target Tabungan"
                      >
                        <Trash2 className="w-3 h-3" /> Hapus
                      </button>
                    </div>

                    <button
                      onClick={() => openTransactionWithParams({ type: 'tabungan', destination: goal.id })}
                      className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Ambil dari Dompet
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Add Saving Goal Modal Backdrop */}
          {showGoalModal && (
            <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
              <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl p-5 shadow-xl border border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">
                  {editingGoal ? 'Edit Target Tabungan' : 'Buat Target Tabungan'}
                </h3>
                
                <form onSubmit={handleCreateGoal} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Nama Tabungan</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                      placeholder="Contoh: Tabungan Liburan, Beli Laptop"
                      value={goalName}
                      onChange={(e) => setGoalName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Target Nominal (Rupiah)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-xs font-semibold focus:ring-1 focus:ring-emerald-500 outline-none"
                      placeholder="Contoh: 10.000.000"
                      value={goalTarget}
                      onChange={(e) => {
                        const numeric = e.target.value.replace(/[^0-9]/g, '');
                        setGoalTarget(numeric ? parseInt(numeric).toLocaleString('id-ID') : '');
                      }}
                      required
                    />
                  </div>

                  {!editingGoal && (
                    <div>
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Setoran Awal (Pilihan, Rp)</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                        placeholder="Rp 0"
                        value={goalInitial}
                        onChange={(e) => {
                          const numeric = e.target.value.replace(/[^0-9]/g, '');
                          setGoalInitial(numeric ? parseInt(numeric).toLocaleString('id-ID') : '');
                        }}
                      />
                    </div>
                  )}

                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowGoalModal(false);
                        setEditingGoal(null);
                        setGoalName('');
                        setGoalTarget('');
                        setGoalInitial('');
                      }}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 text-xs font-bold text-slate-600 dark:text-slate-200 rounded-xl transition cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-xs font-bold text-white rounded-xl transition cursor-pointer"
                    >
                      Simpan Target
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB TAB: EMERGENCY FUND (DANA DARURAT) */}
      {subTab === 'emergency' && (
        <div className="space-y-5">
          {/* Progress Emergency Fund Status card */}
          <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-xl text-white">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Dana Darurat Saat Ini</h3>
                  <p className="text-[10px] text-white/80 font-sans mt-0.5">Berfungsi mengamankan kebutuhan finansial mendadak</p>
                </div>
              </div>
              <button
                _id="btn-edit-emergency"
                onClick={() => setEditingEmergency(!editingEmergency)}
                className="p-1 px-2.5 bg-white/15 hover:bg-white/25 rounded-lg text-xs font-semibold text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Pencil className="w-3 h-3" /> Edit target
              </button>
            </div>

            {/* Target values formulas */}
            {editingEmergency ? (
              <div className="bg-black/25 backdrop-blur-sm p-4 rounded-xl border border-white/10 mb-4 space-y-3.5 relative z-10">
                <div>
                  <label className="text-[10px] font-bold text-white/80 uppercase tracking-wider block mb-1">Pengeluaran Bulanan (Rp)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-white/10 border border-white/15 text-white rounded-lg text-xs focus:ring-1 focus:ring-white outline-none font-semibold placeholder-white/40"
                    value={monthlyExpenseInput}
                    onChange={(e) => {
                      const numeric = e.target.value.replace(/[^0-9]/g, '');
                      setMonthlyExpenseInput(numeric ? parseInt(numeric).toLocaleString('id-ID') : '');
                    }}
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-bold text-white/80 uppercase tracking-wider block">Target Multiplier (Bulan)</label>
                    <span className="text-xs font-extrabold text-white">{targetMonthsInput} Bulan</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="12"
                    className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                    value={targetMonthsInput}
                    onChange={(e) => setTargetMonthsInput(parseInt(e.target.value))}
                  />
                  <span className="text-[9px] text-white/60 block mt-1">Standar perencanaan: Lajang (3-6 bln), Berkeluarga (6-12 bln)</span>
                </div>
                <button
                  type="button"
                  onClick={handleSaveEmergencyFundSettings}
                  className="w-full py-2 bg-white text-emerald-600 font-bold rounded-lg text-xs shadow-md transition hover:bg-white/95"
                >
                  Simpan Perubahan
                </button>
              </div>
            ) : null}

            {/* Calculations progress */}
            {(() => {
              const expenseValue = state.emergencyFund.monthlyExpense;
              const targetMonths = state.emergencyFund.monthTarget;
              const calcTarget = expenseValue * targetMonths;
              const dfPercent = calcTarget > 0 ? Math.round((totalDanaDarurat / calcTarget) * 100) : 0;

              return (
                <div className="relative z-10">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs font-semibold text-white">
                      {formatRupiah(totalDanaDarurat)} <span className="opacity-75 font-normal">/ {formatRupiah(calcTarget)}</span>
                    </span>
                    <span className="text-xs font-extrabold text-white">{dfPercent}%</span>
                  </div>
                  {/* Progress Line */}
                  <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden mb-5">
                    <div 
                      className="bg-white h-full rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(dfPercent, 100)}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-1 divide-x divide-white/20 text-center text-xs text-white uppercase font-sans">
                    <div className="px-1">
                      <span className="text-[9px] opacity-75 block font-bold tracking-wide">Pengeluaran</span>
                      <span className="font-bold text-white mt-0.5 block truncate">{formatRupiah(expenseValue)}</span>
                    </div>
                    <div className="px-1">
                      <span className="text-[9px] opacity-75 block font-bold tracking-wide">Multiplier</span>
                      <span className="font-bold text-white mt-0.5 block">{targetMonths} Bulan</span>
                    </div>
                    <div className="px-1">
                      <span className="text-[9px] opacity-75 block font-bold tracking-wide">Target</span>
                      <span className="font-bold text-white mt-0.5 block truncate">{formatRupiah(calcTarget)}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Quick Fund Injection Action */}
          <button
            onClick={() => openTransactionWithParams({ type: 'tabungan', destination: 'dana_darurat' })}
            className="w-full py-3.5 bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Alokasikan ke Dana Darurat
          </button>

          {/* Tips Section */}
          <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-indigo-900/40 rounded-2xl p-4 flex items-start gap-3.5">
            <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-500 rounded-lg">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-indigo-800 dark:text-indigo-350">Tips Perencanaan Finansial</h4>
              <p className="text-[11px] text-indigo-650/80 dark:text-slate-400 font-sans mt-1 leading-relaxed">
                Dana darurat idealnya bernilai setara <strong>3 sampai 6 bulan pengeluaran rutin bulanan</strong>. Simpan dana darurat di rekening terpisah dengan likuiditas tinggi agar mudah dicairkan sewaktu-waktu.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB: BUDGET PLANNER */}
      {subTab === 'budget' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800/80 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">Total Anggaran Bulanan</span>
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mt-0.5">
                {formatRupiah(state.budgets.reduce((acc, b) => acc + b.limit, 0))}
              </h3>
            </div>
            <button
              onClick={() => setShowAddBudget(true)}
              className="p-2 bg-emerald-50 dark:bg-emerald-950 rounded-xl text-emerald-500 flex items-center gap-1 font-bold text-xs"
            >
              <Plus className="w-4 h-4" /> Buat Budget
            </button>
          </div>

          {/* Add Budget Inline Form drawer overlay */}
          {showAddBudget && (
            <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
              <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">Buat Anggaran Kategori</h3>
                <form onSubmit={handleAddBudgetLimit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Kategori Transaksi</label>
                    <select
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                      value={newBudgetCategory}
                      onChange={(e) => setNewBudgetCategory(e.target.value)}
                    >
                      <option value="Makanan">Makanan</option>
                      <option value="Transportasi">Transportasi</option>
                      <option value="Belanja">Belanja</option>
                      <option value="Tagihan">Tagihan</option>
                      <option value="Kesehatan">Kesehatan</option>
                      <option value="Hiburan">Hiburan</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Batas Maksimal Pengeluaran (Rp)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-800 dark:text-slate-100 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      placeholder="Contoh: 1.500.000"
                      value={newBudgetLimit}
                      onChange={(e) => {
                        const numeric = e.target.value.replace(/[^0-9]/g, '');
                        setNewBudgetLimit(numeric ? parseInt(numeric).toLocaleString('id-ID') : '');
                      }}
                      required
                    />
                  </div>

                  <div className="flex gap-2.5 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddBudget(false)}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 text-xs text-slate-700 dark:text-slate-100 rounded-lg font-bold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-650 text-xs text-white rounded-lg font-bold"
                    >
                      Simpan Budget
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Budget items list */}
          <div className="space-y-3">
            {state.budgets.map((bud, index) => {
              const isEditing = editingBudgetIndex === index;
              const percent = bud.limit > 0 ? Math.round((bud.spent / bud.limit) * 100) : 0;
              
              // Warning Threshold values logic requested:
              // 80% = Kuning (warning)
              // 90%+ = Merah (danger)
              let progressColorClass = 'bg-emerald-500';
              let textClass = 'text-emerald-500';
              if (percent >= 90) {
                progressColorClass = 'bg-rose-500 animate-pulse';
                textClass = 'text-rose-500 font-bold';
              } else if (percent >= 80) {
                progressColorClass = 'bg-amber-400';
                textClass = 'text-amber-500 font-bold';
              }

              return (
                <div 
                  key={bud.category}
                  className="bg-white dark:bg-slate-800/95 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{bud.category}</span>
                      {percent >= 90 && <AlertTriangle className="w-3.5 h-3.5 text-rose-500 ml-0.5" />}
                      {percent >= 80 && percent < 90 && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 ml-0.5" />}
                    </div>

                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editingBudgetLimit}
                            className="w-24 px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            onChange={(e) => {
                              const numeric = e.target.value.replace(/[^0-9]/g, '');
                              setEditingBudgetLimit(numeric ? parseInt(numeric).toLocaleString('id-ID') : '');
                            }}
                          />
                          <button
                            onClick={() => handleSaveBudgetLimit(index)}
                            className="p-1 px-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-900 rounded-lg text-[9px] text-emerald-600 font-bold"
                          >
                            Set
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => {
                              setEditingBudgetIndex(index);
                              setEditingBudgetLimit(bud.limit.toLocaleString('id-ID'));
                            }}
                            className="p-1 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg cursor-pointer"
                            title="Edit Anggaran"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteBudget(index, bud.category)}
                            className="p-1 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 hover:text-rose-500 rounded-lg cursor-pointer"
                            title="Hapus Anggaran"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      
                      <div className="text-right leading-none min-w-[70px]">
                        <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">{percent}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden mb-2">
                    <div 
                      className={`${progressColorClass} h-full rounded-full transition-all duration-300`} 
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>Terpakai: {formatRupiah(bud.spent)}</span>
                    <span className={textClass}>
                      {percent >= 90 ? 'Bahaya! Anggaran Hampir/Habis' : percent >= 80 ? 'Hati-hati! Batas 80%' : `Sisa ${formatRupiah(Math.max(0, bud.limit - bud.spent))}`}
                    </span>
                    <span>Batas: {formatRupiah(bud.limit)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
