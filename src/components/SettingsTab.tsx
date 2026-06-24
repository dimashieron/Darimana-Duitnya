/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Moon, Sun, Laptop, Database, RefreshCw, 
  Trash2, CheckCircle, AlertCircle, Download, Upload
} from 'lucide-react';
import { AppState } from '../types';
import { recalculateBalances, sanitizeAppState } from '../utils';
import { INITIAL_STATE } from '../data';

interface SettingsTabProps {
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
  onResetData: () => void;
}

export default function SettingsTab({ 
  state, 
  updateState, 
  onResetData
}: SettingsTabProps) {
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [recalcSuccess, setRecalcSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Perform full visual local data backup exports
  const handleBackupData = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finance-tracker-pro-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== 'string') throw new Error('Format file tidak terbaca');
        
        const parsed = JSON.parse(text);
        const sanitized = sanitizeAppState(parsed, INITIAL_STATE);
        
        // Recalculate balances dynamically from transaction list to prevent inconsistent balances
        const { wallets, investments, savingGoals, emergencyFund } = recalculateBalances(
          sanitized.transactions,
          sanitized.wallets,
          sanitized.investments,
          sanitized.savingGoals,
          sanitized.emergencyFund
        );

        updateState({
          ...sanitized,
          wallets,
          investments,
          savingGoals,
          emergencyFund
        });

        setImportStatus({
          type: 'success',
          message: `Sukses memulihkan data! Berhasil mengimpor ${sanitized.transactions.length} transaksi.`
        });
        setTimeout(() => setImportStatus(null), 6000);
      } catch (err: any) {
        setImportStatus({
          type: 'error',
          message: 'Gagal mengimpor file. Pastikan file JSON cadangan Anda valid.'
        });
        setTimeout(() => setImportStatus(null), 5000);
      }
    };
    reader.readAsText(file);
    // clear the file input
    e.target.value = '';
  };

  // Recalculate transaction list sequential integrity balances
  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      const { wallets, investments, savingGoals, emergencyFund } = recalculateBalances(
        state.transactions,
        state.wallets,
        state.investments,
        state.savingGoals,
        state.emergencyFund
      );
      updateState({
        wallets,
        investments,
        savingGoals,
        emergencyFund
      });
      setIsRecalculating(false);
      setRecalcSuccess(true);
      setTimeout(() => setRecalcSuccess(false), 2500);
    }, 400);
  };

  return (
    <div className="w-full pb-24 font-sans animate-fade-in text-slate-800 dark:text-slate-100">
      <h2 className="text-xl font-bold mb-4 tracking-tight">Pengaturan Aplikasi</h2>

      {/* Profile & Theme Combined Card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/85 rounded-2xl p-5 mb-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold mb-2">Profil Pengguna</h3>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Nama Panggilan</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            placeholder="Contoh: Adi"
            value={state.userName || ''}
            onChange={(e) => updateState({ userName: e.target.value })}
          />
        </div>

        <div className="border-t border-slate-100 dark:border-slate-700/60 pt-4">
          <h3 className="text-sm font-bold mb-3">Pilih Mode Tema</h3>
          <div className="grid grid-cols-3 gap-2 text-xs select-none">
            <button
              onClick={() => updateState({ theme: 'light' })}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all h-18 cursor-pointer ${
                state.theme === 'light'
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-500 font-extrabold shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              <Sun className="w-4 h-4 mb-1" />
              <span className="text-[11px]">Terang</span>
            </button>
            
            <button
              onClick={() => updateState({ theme: 'dark' })}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all h-18 cursor-pointer ${
                state.theme === 'dark'
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-400 font-extrabold shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              <Moon className="w-4 h-4 mb-1" />
              <span className="text-[11px]">Gelap</span>
            </button>
            
            <button
              onClick={() => updateState({ theme: 'system' })}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all h-18 cursor-pointer ${
                state.theme === 'system'
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-500 font-extrabold shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              <Laptop className="w-4 h-4 mb-1" />
              <span className="text-[11px]">Sistem</span>
            </button>
          </div>
        </div>
      </div>

      {/* unified Kelola Data & Pemeliharaan (Data & Maintenance Actions Card) */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/85 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 rounded-xl">
            <Database className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              Kelola Data & Pemeliharaan
              <span className="inline-flex text-[9px] bg-emerald-500 font-extrabold text-white px-1.5 py-0.5 rounded-md">Lokal</span>
            </h3>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">Ekspor, impor, hitung ulang, atau setel ulang data lokal</p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl text-xs space-y-4 font-sans leading-relaxed">
          <p className="text-slate-500 dark:text-slate-300 text-[11px]">
            Data Anda sepenuhnya disimpan secara lokal di perangkat ini untuk menjaga privasi. Silakan ekspor data Anda secara berkala ke file JSON agar aman dari resiko kehilangan cache browser.
          </p>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Export data button */}
            <button
              onClick={handleBackupData}
              className="py-2.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor Data (JSON)</span>
            </button>

            {/* Import data button */}
            <div className="relative">
              <input
                type="file"
                accept=".json"
                id="import-json-file"
                className="hidden"
                onChange={handleImportJSON}
              />
              <label
                htmlFor="import-json-file"
                className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.98] text-center inline-flex items-center justify-center"
              >
                <Upload className="w-4 h-4" />
                <span>Impor Data (JSON)</span>
              </label>
            </div>

            {/* Recalculate balances */}
            <button
              onClick={handleRecalculate}
              disabled={isRecalculating}
              className={`py-2.5 px-3 border rounded-xl flex items-center justify-center gap-1.5 font-bold text-xs cursor-pointer transition-all duration-150 ${
                recalcSuccess
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-extrabold'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-200'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-500 ${isRecalculating ? 'animate-spin' : ''}`} />
              <span>{recalcSuccess ? 'Sukses Hitung Ulang!' : 'Hitung Ulang Saldo'}</span>
            </button>

            {/* Reset data */}
            <button
              onClick={onResetData}
              className="py-2.5 px-3 bg-rose-50 dark:bg-rose-955/25 border border-rose-100/60 dark:border-rose-955/60 hover:bg-rose-100/50 text-rose-500 dark:text-rose-450 rounded-xl flex items-center justify-center gap-1.5 font-bold text-xs cursor-pointer transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Data Default</span>
            </button>
          </div>

          {importStatus && (
            <div className={`p-3 rounded-lg border text-[11px] font-bold flex items-start gap-1.5 leading-relaxed ${
              importStatus.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-150 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-50 dark:bg-rose-955 border-rose-200 text-rose-800'
            }`}>
              {importStatus.type === 'success' ? (
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
