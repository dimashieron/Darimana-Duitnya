/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, Check, Wallet, Landmark, Smartphone, Coins, ArrowRight,
  TrendingUp, Calendar, FileText, Upload, ChevronDown, CheckCircle2,
  Utensils, Car, Receipt, ShoppingBag, HeartPulse, Briefcase, Gift, Gamepad2, HelpCircle,
  Laptop, Sparkles, Store, Award
} from 'lucide-react';
import { AppState, Transaction, TransactionType, Wallet as WalletType, SavingGoal, InvestmentAsset, AppCategory } from '../types';
import { formatRupiah, generateId, formatYYYYMMDDToDDMMYY, getLocalYYYYMMDD } from '../utils';
import { CATEGORIES } from '../data';

interface TransactionFormProps {
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
  onClose: () => void;
  editTransaction?: Transaction | null; // populate fields if editing
  prepopulatedParams?: { type: TransactionType; source?: string; destination?: string } | null;
  showToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export default function TransactionForm({ 
  state, updateState, onClose, editTransaction, prepopulatedParams, showToast 
}: TransactionFormProps) {
  // Core fields
  const [type, setType] = useState<TransactionType>('pengeluaran');
  const [nominal, setNominal] = useState('');
  const [source, setSource] = useState('rekening');
  const [destination, setDestination] = useState('');
  const [category, setCategory] = useState('Makanan');
  const [date, setDate] = useState(getLocalYYYYMMDD()); // YYYY-MM-DD standard picker
  const [notes, setNotes] = useState('');
  const [attachment, setAttachment] = useState<string | null>(null);

  // Custom Investment additions states
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [newAssetInput, setNewAssetInput] = useState('');

  // View States
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // States for dynamic custom categories creator inside the choosing category popup
  const [newCatName, setNewCatName] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-teal-100 text-teal-600 dark:bg-teal-955 dark:text-teal-400');

  // Handle Edit Population or pre-populated params
  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setNominal(editTransaction.nominal.toString());
      setSource(editTransaction.source);
      setDestination(editTransaction.destination || '');
      setCategory(editTransaction.category);
      setDate(editTransaction.date);
      setNotes(editTransaction.notes);
      setAttachment(editTransaction.attachment || null);
    } else if (prepopulatedParams) {
      setType(prepopulatedParams.type);
      if (prepopulatedParams.source) setSource(prepopulatedParams.source);
      if (prepopulatedParams.destination) setDestination(prepopulatedParams.destination);
      
      // Auto set suitable category/destination defaulted
      if (prepopulatedParams.type === 'investasi') {
        setCategory('Investasi');
        setDestination(state.investments[0]?.id || 'emas');
        setSource(prepopulatedParams.source || 'rekening');
      } else if (prepopulatedParams.type === 'jual_aset') {
        setCategory('Jual Aset');
        setSource(state.investments[0]?.id || 'emas');
        setDestination(prepopulatedParams.destination || 'rekening');
      } else if (prepopulatedParams.type === 'tabungan') {
        setCategory('Tabungan');
        if (!prepopulatedParams.destination) {
          setDestination(state.savingGoals[0]?.id || '');
        }
      } else if (prepopulatedParams.type === 'dana_darurat') {
        setCategory('Dana Darurat');
        setDestination('dana_darurat');
      }
    }
  }, [editTransaction, prepopulatedParams]);

  // Adjust source and destination dynamically depending on the selected type
  useEffect(() => {
    if (type === 'jual_aset') {
      const isSourceAsset = state.investments.some(inv => inv.id === source);
      if (!isSourceAsset) {
        setSource(state.investments[0]?.id || 'emas');
      }
      const isDstWallet = state.wallets.some(w => w.id === destination);
      if (!isDstWallet) {
        setDestination(state.wallets[0]?.id || 'rekening');
      }
    } else if (type === 'investasi') {
      const isSourceWallet = state.wallets.some(w => w.id === source);
      if (!isSourceWallet) {
        setSource(state.wallets[0]?.id || 'rekening');
      }
      const isDstAsset = state.investments.some(inv => inv.id === destination);
      if (!isDstAsset) {
        setDestination(state.investments[0]?.id || 'emas');
      }
    } else if (type === 'tabungan') {
      const isSourceWallet = state.wallets.some(w => w.id === source);
      if (!isSourceWallet) {
        setSource(state.wallets[0]?.id || 'rekening');
      }
      const isDstGoal = state.savingGoals.some(g => g.id === destination);
      if (!isDstGoal) {
        setDestination(state.savingGoals[0]?.id || '');
      }
    } else if (type === 'dana_darurat') {
      const isSourceWallet = state.wallets.some(w => w.id === source);
      if (!isSourceWallet) {
        setSource(state.wallets[0]?.id || 'rekening');
      }
      setDestination('dana_darurat');
    }
  }, [type, source, destination, state.wallets, state.investments, state.savingGoals]);

  // Handle dropdown destinations selection sets
  useEffect(() => {
    // If destination is not selected, default it based on the type
    if (!destination) {
      if (type === 'transfer') {
        const otherWallet = state.wallets.find(w => w.id !== source);
        if (otherWallet) setDestination(otherWallet.id);
      } else if (type === 'tabungan') {
        setDestination(state.savingGoals[0]?.id || '');
      } else if (type === 'dana_darurat') {
        setDestination('dana_darurat');
      } else if (type === 'investasi') {
        setDestination(state.investments[0]?.id || 'emas');
      } else if (type === 'jual_aset') {
        setDestination(state.wallets[0]?.id || 'rekening');
      }
    }
  }, [type, source, destination, state.savingGoals, state.investments]);

  // Auto switch default category on transaction type changes
  useEffect(() => {
    if (!editTransaction) {
      if (type === 'pengeluaran') {
        setCategory('Makanan');
      } else if (type === 'pendapatan') {
        setCategory('Gaji');
      }
    }
  }, [type, editTransaction]);

  // Handle simulated File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachment(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachment(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(nominal.replace(/[^0-9]/g, '')) || 0;
    if (amount <= 0) return;

    if (editTransaction) {
      setConfirmModal({
        isOpen: true,
        title: 'Ubah Transaksi',
        message: 'Apakah Anda yakin ingin menyimpan perubahan transaksi ini?',
        onConfirm: () => {
          executeSubmit(amount);
        }
      });
    } else {
      executeSubmit(amount);
    }
  };

  const executeSubmit = (amount: number) => {
    let updatedWallets = [...state.wallets];
    let updatedSavingGoals = [...state.savingGoals];
    let updatedEmergencyFund = { ...state.emergencyFund };
    let updatedBudgets = [...state.budgets];
    let finalInvestments = [...state.investments];

    // If EDITING - Revert mathematical logic of old old transactions first!
    if (editTransaction) {
      if (editTransaction.type === 'pendapatan') {
        const srcW = updatedWallets.find(w => w.id === editTransaction.source);
        if (srcW) srcW.balance -= editTransaction.nominal;
      } else if (editTransaction.type === 'pengeluaran') {
        const srcW = updatedWallets.find(w => w.id === editTransaction.source);
        if (srcW) srcW.balance += editTransaction.nominal;
        const b = updatedBudgets.find(bld => bld.category === editTransaction.category);
        if (b) b.spent = Math.max(0, b.spent - editTransaction.nominal);
      } else if (editTransaction.type === 'transfer') {
        const srcW = updatedWallets.find(w => w.id === editTransaction.source);
        const dstW = updatedWallets.find(w => w.id === editTransaction.destination);
        if (srcW) srcW.balance += editTransaction.nominal;
        if (dstW) dstW.balance -= editTransaction.nominal;
      } else if (editTransaction.type === 'tabungan') {
        const srcW = updatedWallets.find(w => w.id === editTransaction.source);
        if (srcW) srcW.balance += editTransaction.nominal;
        const g = updatedSavingGoals.find(g => g.id === editTransaction.destination);
        if (g) g.balance = Math.max(0, g.balance - editTransaction.nominal);
      } else if (editTransaction.type === 'dana_darurat') {
        const srcW = updatedWallets.find(w => w.id === editTransaction.source);
        if (srcW) srcW.balance += editTransaction.nominal;
        updatedEmergencyFund.balance = Math.max(0, updatedEmergencyFund.balance - editTransaction.nominal);
      } else if (editTransaction.type === 'investasi') {
        const srcW = updatedWallets.find(w => w.id === editTransaction.source);
        if (srcW) srcW.balance += editTransaction.nominal;
        finalInvestments = finalInvestments.map(inv => {
          if (inv.id === editTransaction.destination) {
            return { ...inv, value: Math.max(0, inv.value - editTransaction.nominal) };
          }
          return inv;
        });
      } else if (editTransaction.type === 'jual_aset') {
        const dstW = updatedWallets.find(w => w.id === editTransaction.destination);
        if (dstW) dstW.balance -= editTransaction.nominal;
        finalInvestments = finalInvestments.map(inv => {
          if (inv.id === editTransaction.source) {
            return { ...inv, value: inv.value + editTransaction.nominal };
          }
          return inv;
        });
      }
    }

    // Apply MATH LOGIC of standard transactions listed in prompt instructions:
    let finalDestination = destination;

    if (type === 'pendapatan') {
      const srcW = updatedWallets.find(w => w.id === source);
      if (srcW) srcW.balance += amount;
    } else if (type === 'pengeluaran') {
      const srcW = updatedWallets.find(w => w.id === source);
      if (srcW) srcW.balance -= amount;

      // Add to budget spent
      const budgetIdx = updatedBudgets.findIndex(b => b.category === category);
      if (budgetIdx > -1) {
        updatedBudgets[budgetIdx].spent += amount;
      } else {
        // Automatically spawn budget of limit 10.000.000 if not predefined
        updatedBudgets.push({ category, limit: 1000000, spent: amount });
      }
    } else if (type === 'transfer') {
      const srcW = updatedWallets.find(w => w.id === source);
      const dstW = updatedWallets.find(w => w.id === destination);
      if (srcW) srcW.balance -= amount;
      if (dstW) dstW.balance += amount;
    } else if (type === 'tabungan') {
      const srcW = updatedWallets.find(w => w.id === source);
      if (srcW) srcW.balance -= amount;

      const targetGoalId = destination || (state.savingGoals[0]?.id || '');
      const goal = updatedSavingGoals.find(g => g.id === targetGoalId);
      if (goal) goal.balance += amount;
      finalDestination = targetGoalId;
    } else if (type === 'dana_darurat') {
      const srcW = updatedWallets.find(w => w.id === source);
      if (srcW) srcW.balance -= amount;
      updatedEmergencyFund.balance += amount;
      finalDestination = 'dana_darurat';
    } else if (type === 'investasi') {
      const srcW = updatedWallets.find(w => w.id === source);
      if (srcW) srcW.balance -= amount;

      finalInvestments = finalInvestments.map(inv => {
        if (inv.id === destination) {
          return { ...inv, value: inv.value + amount };
        }
        return inv;
      });
    } else if (type === 'jual_aset') {
      const dstW = updatedWallets.find(w => w.id === destination);
      if (dstW) dstW.balance += amount;

      // Deduct from portfolio investment values, keep it non-negative
      finalInvestments = finalInvestments.map(inv => {
        if (inv.id === source) {
          return { ...inv, value: Math.max(0, inv.value - amount) };
        }
        return inv;
      });
    }

    // Save transaction object metadata
    const txObj: Transaction = {
      id: editTransaction ? editTransaction.id : `tx_${generateId()}`,
      type,
      nominal: amount,
      category: type === 'transfer' ? 'Transfer' : type === 'tabungan' ? 'Tabungan' : type === 'dana_darurat' ? 'Dana Darurat' : type === 'investasi' ? 'Investasi' : type === 'jual_aset' ? 'Jual Aset' : category,
      date,
      source,
      destination: (type === 'transfer' || type === 'tabungan' || type === 'dana_darurat' || type === 'investasi' || type === 'jual_aset') ? finalDestination : undefined,
      notes,
      attachment,
      timestamp: editTransaction ? editTransaction.timestamp : Date.now(),
    };

    let finalTxList = editTransaction
      ? state.transactions.map(t => t.id === editTransaction.id ? txObj : t)
      : [txObj, ...state.transactions];

    updateState({
      transactions: finalTxList,
      wallets: updatedWallets,
      savingGoals: updatedSavingGoals,
      emergencyFund: updatedEmergencyFund,
      budgets: updatedBudgets,
      investments: finalInvestments,
    });

    if (showToast) {
      if (editTransaction) {
        showToast('Transaksi berhasil diedit!');
      } else {
        showToast('Transaksi tercatat!');
      }
    }

    onClose();
  };

  // Icon mapping helper
  const getCategoryIconElement = (categoryName: string, colorClass?: string) => {
    let textColor = "text-slate-500";
    if (colorClass) {
      if (colorClass.includes("text-red-600") || colorClass.includes("text-red-400")) textColor = "text-red-500";
      else if (colorClass.includes("text-blue-600") || colorClass.includes("text-blue-400")) textColor = "text-blue-500";
      else if (colorClass.includes("text-indigo-600") || colorClass.includes("text-indigo-400")) textColor = "text-indigo-505";
      else if (colorClass.includes("text-pink-600") || colorClass.includes("text-pink-400")) textColor = "text-pink-500";
      else if (colorClass.includes("text-emerald-600") || colorClass.includes("text-emerald-400")) textColor = "text-emerald-500";
      else if (colorClass.includes("text-green-600") || colorClass.includes("text-green-400")) textColor = "text-green-500";
      else if (colorClass.includes("text-amber-600") || colorClass.includes("text-amber-400")) textColor = "text-amber-500";
      else if (colorClass.includes("text-teal-600") || colorClass.includes("text-teal-400")) textColor = "text-teal-500";
      else if (colorClass.includes("text-purple-600") || colorClass.includes("text-purple-400")) textColor = "text-purple-500";
      else if (colorClass.includes("text-rose-600") || colorClass.includes("text-rose-450")) textColor = "text-rose-500";
      else if (colorClass.includes("text-cyan-600") || colorClass.includes("text-cyan-405")) textColor = "text-cyan-500";
    }

    switch (categoryName) {
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
      default: return <HelpCircle className={`w-5 h-5 ${textColor}`} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 font-sans animate-fade-in">
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xs rounded-3xl p-6 shadow-2xl border border-slate-155 dark:border-slate-800 text-center">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mb-2">{confirmModal.title}</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{confirmModal.message}</p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-755 text-slate-600 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-100 dark:border-slate-700 active:scale-95 transition-all text-center cursor-pointer"
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

      {/* Scrollable form body panel */}
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-xl flex flex-col max-h-[92vh] sm:max-h-[85vh] border-t sm:border border-slate-150 dark:border-slate-800 overflow-hidden">
        
        {/* Custom Header */}
        <div className="px-5 py-4 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>{editTransaction ? 'Edit Transaksi' : 'Tambah Transaksi'}</span>
          </h3>
          <button 
            id="btn-close-form"
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 select-none rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form elements container scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 space-y-3.5 sm:space-y-4 no-scrollbar">
          
          {/* 1. JENIS TRANSAKSI Dropdown selection */}
          <div className="w-full">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 font-sans">Jenis Transaksi</label>
            <div className="relative">
              <select
                className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 text-xs font-bold rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700 dark:text-slate-200 select-none appearance-none cursor-pointer"
                value={type}
                onChange={(e) => {
                  const nt = e.target.value as TransactionType;
                  setType(nt);
                }}
              >
                <option value="pengeluaran" className="dark:bg-slate-900 dark:text-slate-200">Pengeluaran 📉</option>
                <option value="pendapatan" className="dark:bg-slate-900 dark:text-slate-200">Pendapatan 📈</option>
                <option value="transfer" className="dark:bg-slate-900 dark:text-slate-200">Transfer Saldo 🔄</option>
                <option value="tabungan" className="dark:bg-slate-900 dark:text-slate-200">Tabungan 💰</option>
                <option value="dana_darurat" className="dark:bg-slate-900 dark:text-slate-200">Dana Darurat 🚨</option>
                <option value="investasi" className="dark:bg-slate-900 dark:text-slate-200">Investasi 🚀</option>
                <option value="jual_aset" className="dark:bg-slate-900 dark:text-slate-200">Jual Aset 🤝</option>
              </select>
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* 2. ASAL DANA SOURCE ACCOUNT */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 font-sans">Asal Dana</label>
            {type === 'jual_aset' ? (
              <button
                type="button"
                onClick={() => setShowAssetPicker(true)}
                className="w-full flex items-center justify-between px-3.5 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-2xl cursor-pointer"
              >
                <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200">
                  <TrendingUp className="w-5 h-5 text-teal-500" />
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">
                    {state.investments.find(inv => inv.id === source)?.name || 'Pilih Aset'} 
                    {source && ` (${formatRupiah(state.investments.find(inv => inv.id === source)?.value || 0)})`}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            ) : (
              <div className="relative font-sans">
                <select
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 text-xs font-bold rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700 dark:text-slate-200 select-none appearance-none cursor-pointer text-ellipsis overflow-hidden"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                >
                  {state.wallets.map((w) => (
                    <option className="dark:bg-slate-900 dark:text-slate-200" key={w.id} value={w.id}>
                      {w.name} ({formatRupiah(w.balance)})
                    </option>
                  ))}
                </select>
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>

          {/* 3. TUJUAN DANA DESTINATION (Conditionally revealed for transfer, investasi, jual_aset) */}
          {(type === 'transfer' || type === 'investasi' || type === 'jual_aset') && (
            <div className="animate-fade-in space-y-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 font-sans">Tujuan Dana</label>
                {type === 'investasi' ? (
                  <button
                    type="button"
                    onClick={() => setShowAssetPicker(true)}
                    className="w-full flex items-center justify-between px-3.5 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-2xl cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200">
                      <TrendingUp className="w-5 h-5 text-teal-500" />
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">
                        {state.investments.find(inv => inv.id === destination)?.name || 'Pilih Aset'} 
                        {destination && ` (${formatRupiah(state.investments.find(inv => inv.id === destination)?.value || 0)})`}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                ) : (
                  <div className="relative font-sans">
                    <select
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 text-xs font-bold rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700 dark:text-slate-200 appearance-none cursor-pointer text-ellipsis overflow-hidden"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    >
                      {/* For normal peer-to-peer transfers */}
                      {type === 'transfer' && 
                        state.wallets
                          .filter(w => w.id !== source)
                          .map((w) => (
                            <option className="dark:bg-slate-900 dark:text-slate-200" key={w.id} value={w.id}>
                              {w.name}
                            </option>
                          ))
                      }

                      {/* For portfolio sales */}
                      {type === 'jual_aset' && 
                        state.wallets.map((w) => (
                          <option className="dark:bg-slate-900 dark:text-slate-200" key={w.id} value={w.id}>
                            {w.name} ({formatRupiah(w.balance)})
                          </option>
                        ))
                      }
                    </select>
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. NOMINAL AMOUNT */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Nominal Transaksi (Rupiah)</label>
            <div className="relative">
              <input
                type="text"
                pattern="[0-9]*"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-emerald-500/20 dark:border-slate-800 text-base font-black rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-850 dark:text-emerald-400"
                placeholder="Rp 0"
                value={nominal ? parseInt(nominal.replace(/[^0-9]/g, '')).toLocaleString('id-ID') : ''}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9]/g, '');
                  setNominal(cleaned);
                }}
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm pointer-events-none">
                Rp
              </div>
            </div>
          </div>

          {/* 5. KATEGORI PICKER BUTTON */}
          {type !== 'transfer' && type !== 'tabungan' && type !== 'dana_darurat' && type !== 'investasi' && type !== 'jual_aset' && (
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Kategori</label>
              <button
                id="btn-trigger-category-picker"
                type="button"
                onClick={() => setShowCategoryPicker(true)}
                className="w-full flex items-center justify-between px-3.5 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-2xl cursor-pointer"
              >
                <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200">
                  {getCategoryIconElement(category)}
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">{category}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          )}

          {/* 6. TANGGAL TRANSAKSI DATE */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Tanggal</label>
            <div className="relative">
              <input
                type="date"
                required
                onClick={(e) => {
                  try { e.currentTarget.showPicker(); } catch (err) {}
                }}
                onFocus={(e) => {
                  try { e.currentTarget.showPicker(); } catch (err) {}
                }}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 text-xs font-bold rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-750 dark:text-slate-200 cursor-pointer"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-450 pointer-events-none">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* 7. KETERANGAN NOTES */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Keterangan Catatan (Pilihan)</label>
            <div className="relative">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 text-xs rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                placeholder="Contoh: Beli makan siang, bayar kosan"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-450 pointer-events-none">
                <FileText className="w-5 h-5" />
              </div>
            </div>
          </div>

        </form>

        {/* Action Panel: Batal and Simpan buttons */}
        <div className="px-5 py-4 border-t border-slate-50 dark:border-slate-800 flex gap-3 bg-white dark:bg-slate-900 rounded-b-3xl">
          <button
            id="btn-cancel-form"
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-200 text-xs font-bold rounded-2xl border border-slate-100 dark:border-slate-700/80 active:scale-95 transition-all text-center cursor-pointer"
          >
            Batal
          </button>
          
          <button
            id="btn-save-form"
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold rounded-2xl shadow-md active:scale-95 transition-all text-center cursor-pointer"
          >
            Simpan
          </button>
        </div>

      </div>

      {/* 9. PORSI KATEGORI GRID OVERLAY MODAL (Screen 9 in mock) */}
      {showCategoryPicker && (
        <div className="fixed inset-0 z-55 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in select-none">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[24px] p-5 shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 font-sans tracking-tight">Pilih Kategori</h4>
              <button 
                type="button"
                onClick={() => setShowCategoryPicker(false)}
                className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Custom Category Creator */}
            <div className="mb-4 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-150 dark:border-slate-850">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5 font-sans">Tambah Kategori Baru</span>
              <div className="flex gap-2 mb-2.5">
                <input
                  type="text"
                  placeholder="Contoh: Zakat, Donasi, Kado"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 font-bold"
                />
                <button
                  type="button"
                  onClick={() => {
                    const trimmed = newCatName.trim();
                    if (!trimmed) return;
                    const list = (state.categories || CATEGORIES) as AppCategory[];
                    if (list.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
                      if (showToast) showToast('Kategori ini sudah ada!', 'error');
                      return;
                    }
                    const newCat: AppCategory = {
                      name: trimmed,
                      icon: 'HelpCircle',
                      color: selectedColor,
                      isDefault: false,
                      txType: (type === 'pendapatan' ? 'pendapatan' : 'pengeluaran') as 'pendapatan' | 'pengeluaran'
                    };
                    updateState({ categories: [...list, newCat] });
                    setCategory(trimmed);
                    setNewCatName('');
                    if (showToast) showToast(`Kategori "${trimmed}" berhasil dibuat!`);
                  }}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95 cursor-pointer font-sans"
                >
                  Tambah
                </button>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {[
                  { key: 'red', color: 'bg-red-100 text-red-655 dark:bg-red-955 dark:text-red-400' },
                  { key: 'blue', color: 'bg-blue-100 text-blue-600 dark:bg-blue-955 dark:text-blue-400' },
                  { key: 'indigo', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-955 dark:text-indigo-400' },
                  { key: 'pink', color: 'bg-pink-100 text-pink-600 dark:bg-pink-955 dark:text-pink-400' },
                  { key: 'emerald', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-955 dark:text-emerald-400' },
                  { key: 'purple', color: 'bg-purple-100 text-purple-600 dark:bg-purple-955 dark:text-purple-400' },
                  { key: 'amber', color: 'bg-amber-100 text-amber-600 dark:bg-amber-955 dark:text-amber-400' },
                  { key: 'cyan', color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-955 dark:text-cyan-405' },
                ].map((bubble) => {
                  const isActive = selectedColor === bubble.color;
                  return (
                    <button
                      key={bubble.key}
                      type="button"
                      onClick={() => setSelectedColor(bubble.color)}
                      className={`w-4.5 h-4.5 rounded-full flex-shrink-0 border transition-all cursor-pointer ${
                        bubble.color.split(' ')[0]
                      } ${isActive ? 'scale-115 ring-2 ring-emerald-500 border-transparent' : 'border-slate-200 dark:border-slate-800'}`}
                      title={bubble.key}
                    />
                  );
                })}
              </div>
            </div>
            {/* Grid structure mapping Categories with sweet icons and delete options */}
            <div className="grid grid-cols-2 gap-3 max-h-[35vh] overflow-y-auto pr-1 no-scrollbar font-sans">
              {((state.categories || CATEGORIES) as AppCategory[]).filter((cat) => {
                if (cat.txType) {
                  return cat.txType === type;
                }
                const isIncomeCategory = cat.name === 'Gaji' || cat.name === 'Bonus' || cat.name === 'Freelance' || cat.name === 'Side Hustle' || cat.name === 'Dagang' || cat.name === 'Hibah / Hadiah';
                if (type === 'pendapatan') {
                  return isIncomeCategory || cat.name === 'Lainnya';
                } else if (type === 'pengeluaran') {
                  return !isIncomeCategory && cat.name !== 'Investasi' && cat.name !== 'Tabungan';
                }
                return true;
              }).map((cat) => {
                const isSelected = category === cat.name;
                return (
                  <div key={cat.name} className="relative group">
                    <button
                      type="button"
                      onClick={() => {
                        setCategory(cat.name);
                        setShowCategoryPicker(false);
                      }}
                      className={`w-full flex flex-col items-center justify-center p-3 rounded-2xl border transition-all min-h-24 gap-1.5 cursor-pointer ${
                        isSelected 
                          ? 'border-emerald-500 bg-emerald-50/15 dark:bg-emerald-955/20 text-emerald-600 dark:text-emerald-400 font-extrabold shadow-sm'
                          : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${cat.color} ${isSelected ? 'scale-110' : ''}`}>
                        {getCategoryIconElement(cat.name, cat.color)}
                      </div>
                      <span className="text-[10px] truncate w-full text-center leading-none tracking-wide">{cat.name}</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmModal({
                          isOpen: true,
                          title: 'Hapus Kategori',
                          message: `Apakah Anda yakin ingin menghapus kategori "${cat.name}"?`,
                          onConfirm: () => {
                            const list = state.categories || CATEGORIES;
                            const updatedCats = list.filter(c => c.name !== cat.name);
                            updateState({ categories: updatedCats });
                            if (category === cat.name) {
                              setCategory('Lainnya');
                            }
                            if (showToast) showToast(`Kategori "${cat.name}" terhapus!`);
                          }
                        });
                      }}
                      className="absolute top-1 right-1 p-0.5 bg-white dark:bg-slate-850 hover:bg-rose-50 dark:hover:bg-rose-955 hover:text-rose-500 rounded-full text-slate-400 border border-slate-150 dark:border-slate-800 shadow-sm cursor-pointer opacity-80 hover:opacity-100 transition-all z-10"
                      title="Hapus Kategori"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Asset Picker Modal */}
      {showAssetPicker && (
        <div className="fixed inset-0 z-55 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in select-none">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[24px] p-5 shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 font-sans tracking-tight">Pilih Aset Investasi</h4>
              <button 
                type="button"
                onClick={() => setShowAssetPicker(false)}
                className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Custom Asset Creator */}
            <div className="mb-4 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-150 dark:border-slate-850">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5 font-sans">Tambah Aset Investasi Baru</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Contoh: Saham BBCA, Reksadana Sucor..."
                  value={newAssetInput}
                  onChange={(e) => setNewAssetInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 font-bold"
                />
                <button
                  type="button"
                  onClick={() => {
                    const trimmedName = newAssetInput.trim();
                    if (!trimmedName) return;
                    
                    const existing = state.investments.find(inv => inv.name.toLowerCase() === trimmedName.toLowerCase());
                    if (existing) {
                      if (showToast) showToast('Aset investasi ini sudah ada!', 'error');
                      // Auto select the existing one
                      if (type === 'investasi') {
                        setDestination(existing.id);
                      } else if (type === 'jual_aset') {
                        setSource(existing.id);
                      }
                      setShowAssetPicker(false);
                      return;
                    }

                    const newAssetId = `asset_${generateId()}`;
                    const newAsset: InvestmentAsset = {
                      id: newAssetId,
                      name: trimmedName,
                      qty: 'Miliki',
                      value: 0,
                      percentChange: 0,
                    };

                    updateState({
                      investments: [...state.investments, newAsset]
                    });

                    if (type === 'investasi') {
                      setDestination(newAssetId);
                    } else if (type === 'jual_aset') {
                      setSource(newAssetId);
                    }

                    setNewAssetInput('');
                    setShowAssetPicker(false);
                    if (showToast) showToast(`Aset "${trimmedName}" berhasil didaftarkan!`);
                  }}
                  className="flex-shrink-0 w-auto min-w-[70px] px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95 cursor-pointer font-sans"
                >
                  Tambah
                </button>
              </div>
            </div>

            {/* Grid structure mapping available investments */}
            <div className="grid grid-cols-2 gap-3 max-h-[35vh] overflow-y-auto pr-1 no-scrollbar">
              {state.investments.map((inv) => {
                const isSelected = type === 'investasi' ? destination === inv.id : source === inv.id;
                return (
                  <div key={inv.id} className="relative group">
                    <button
                      type="button"
                      onClick={() => {
                        if (type === 'investasi') {
                          setDestination(inv.id);
                        } else if (type === 'jual_aset') {
                          setSource(inv.id);
                        }
                        setShowAssetPicker(false);
                      }}
                      className={`w-full flex flex-col items-center justify-center p-3 rounded-2xl border transition-all min-h-24 gap-1.5 cursor-pointer ${
                        isSelected 
                          ? 'border-emerald-500 bg-emerald-50/15 dark:bg-emerald-955/20 text-emerald-600 dark:text-emerald-400 font-extrabold shadow-sm'
                          : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className={`p-2 rounded-full bg-teal-100 text-teal-600 dark:bg-teal-955 dark:text-teal-400 ${isSelected ? 'scale-110' : ''}`}>
                        <TrendingUp className="w-5 h-5 text-teal-500" />
                      </div>
                      <span className="text-[10px] truncate w-full text-center leading-none tracking-wide font-bold">{inv.name}</span>
                      <span className="text-[9px] font-mono opacity-80 leading-none">{formatRupiah(inv.value)}</span>
                    </button>

                    {/* Delete button option for custom added assets if there's no money held */}
                    {inv.value === 0 && !['emas', 'saham', 'crypto'].includes(inv.id) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmModal({
                            isOpen: true,
                            title: 'Hapus Aset',
                            message: `Apakah Anda yakin ingin menghapus aset investasi "${inv.name}"?`,
                            onConfirm: () => {
                              const updatedInvestments = state.investments.filter(i => i.id !== inv.id);
                              updateState({ investments: updatedInvestments });
                              
                              if (type === 'investasi' && destination === inv.id) {
                                setDestination(updatedInvestments[0]?.id || '');
                              } else if (type === 'jual_aset' && source === inv.id) {
                                setSource(updatedInvestments[0]?.id || '');
                              }
                              
                              if (showToast) showToast(`Aset "${inv.name}" berhasil dihapus!`);
                            }
                          });
                        }}
                        className="absolute top-1 right-1 p-0.5 bg-white dark:bg-slate-855 hover:bg-rose-50 dark:hover:bg-rose-955 hover:text-rose-500 rounded-full text-slate-400 border border-slate-155 dark:border-slate-800 shadow-sm cursor-pointer opacity-80 hover:opacity-100 transition-all z-10"
                        title="Hapus Aset"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
