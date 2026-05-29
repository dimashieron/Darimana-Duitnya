/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Moon, Sun, Laptop, Database, RefreshCw, 
  Trash2, HardDriveUpload, CheckCircle, AlertCircle, Check 
} from 'lucide-react';
import { AppState, Wallet } from '../types';

interface SettingsTabProps {
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
  onResetData: () => void;
  onSyncWithSpreadsheet: () => Promise<void>;
  syncLoading: boolean;
}

export default function SettingsTab({ 
  state, updateState, onResetData, onSyncWithSpreadsheet, syncLoading 
}: SettingsTabProps) {
  const [gasUrlInput, setGasUrlInput] = useState(state.gasUrl);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveGasUrl = () => {
    updateState({ gasUrl: gasUrlInput.trim() });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

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

  return (
    <div className="w-full pb-24 font-sans animate-fade-in text-slate-800 dark:text-slate-100">
      <h2 className="text-xl font-bold mb-4 tracking-tight">Pengaturan Aplikasi</h2>

      {/* Profile Name panel */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/85 rounded-2xl p-5 mb-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold">Profil Pengguna</h3>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Nama Panggilan</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            placeholder="Contoh: Adi, Adi Pro"
            value={state.userName || ''}
            onChange={(e) => updateState({ userName: e.target.value })}
          />
        </div>
      </div>

      {/* Theme Modes panel */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/85 rounded-2xl p-5 mb-5 shadow-sm">
        <h3 className="text-sm font-bold mb-3">Pilih Mode Tema</h3>
        
        <div className="grid grid-cols-3 gap-2.5 text-xs select-none">
          <button
            onClick={() => updateState({ theme: 'light' })}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all h-20 cursor-pointer ${
              state.theme === 'light'
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-500 font-extrabold shadow-sm'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            <Sun className="w-5 h-5 mb-1.5" />
            <span>Terang (Light)</span>
          </button>
          
          <button
            onClick={() => updateState({ theme: 'dark' })}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all h-20 cursor-pointer ${
              state.theme === 'dark'
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-400 font-extrabold shadow-sm'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            <Moon className="w-5 h-5 mb-1.5" />
            <span>Gelap (Dark)</span>
          </button>
          
          <button
            onClick={() => updateState({ theme: 'system' })}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all h-20 cursor-pointer ${
              state.theme === 'system'
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-500 font-extrabold shadow-sm'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            <Laptop className="w-5 h-5 mb-1.5" />
            <span>Sistem Mode</span>
          </button>
        </div>
      </div>

      {/* Google Sheets Apps Script API Sync settings */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/85 rounded-2xl p-5 mb-5 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-green-50 dark:bg-green-950/50 rounded-xl text-green-500">
            <Database className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Sinkronisasi Google Spreadsheet</h3>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">Simpan & kelola database keuangan di Google Sheet Anda</p>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Web App URL Google Apps Script</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={gasUrlInput}
              onChange={(e) => setGasUrlInput(e.target.value)}
            />
            <button
              onClick={handleSaveGasUrl}
              className="px-4 py-2 bg-slate-900 dark:bg-slate-200 hover:bg-slate-800 text-white dark:text-slate-900 font-bold rounded-xl text-xs flex items-center justify-center cursor-pointer"
            >
              {saveSuccess ? <Check className="w-4 h-4" /> : 'Simpan'}
            </button>
          </div>
        </div>

        {/* Sync Trigger Action if URL exists */}
        {state.gasUrl ? (
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/60 dark:border-emerald-900/40 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-450 font-bold">
              <CheckCircle className="w-4.5 h-4.5" />
              <span>Aplikasi terhubung ke Google Spreadsheet!</span>
            </div>
            <button
              id="btn-sync-now"
              onClick={onSyncWithSpreadsheet}
              disabled={syncLoading}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncLoading ? 'animate-spin' : ''}`} />
              <span>{syncLoading ? 'Sinkronisasi...' : 'Sync Sekarang'}</span>
            </button>
          </div>
        ) : (
          <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100/60 dark:border-amber-900/40 p-4 rounded-xl text-xs text-amber-800 dark:text-amber-450 flex items-start gap-2.5 leading-relaxed font-sans">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Petunjuk:</strong> Hubungkan database Google Sheets untuk menyimpan semua data transaksi, dompet, target tabungan, dan budget bulanan Anda secara persistent di awan (cloud)! Hubungi admin untuk file konfigurasi & spreadsheet link.
            </div>
          </div>
        )}
      </div>

      {/* Extra Data Control Actions */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/85 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Ekstra & Pemeliharaan</h3>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Backup json file */}
          <button
            onClick={handleBackupData}
            className="p-3 bg-slate-50 hover:bg-slate-10 border border-slate-150 dark:bg-slate-900 dark:hover:bg-slate-800/80 dark:border-slate-750 text-slate-700 dark:text-slate-200 p-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs shadow-sm cursor-pointer"
          >
            <HardDriveUpload className="w-4.5 h-4.5 text-indigo-505 text-emerald-500" />
            <span>Backup Data JSON</span>
          </button>

          {/* Reset all data to default mock state */}
          <button
            onClick={onResetData}
            className="p-3 bg-rose-50/60 dark:bg-rose-950/25 border border-rose-100/60 dark:border-rose-950/60 hover:bg-rose-100/50 text-rose-500 dark:text-rose-450 p-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs cursor-pointer"
          >
            <Trash2 className="w-4.5 h-4.5" />
            <span>Reset Data Default</span>
          </button>
        </div>
      </div>
    </div>
  );
}
