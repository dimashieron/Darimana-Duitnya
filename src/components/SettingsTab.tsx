/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Moon, Sun, Laptop, Database, RefreshCw, 
  Trash2, HardDriveUpload, CheckCircle, AlertCircle, Check,
  BookOpen, HelpCircle, ChevronDown, ChevronUp, Copy
} from 'lucide-react';
import { AppState, Wallet } from '../types';

interface SettingsTabProps {
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
  onResetData: () => void;
  onSyncWithSpreadsheet: () => Promise<void>;
  syncLoading: boolean;
  autoSyncing?: boolean;
}

export default function SettingsTab({ 
  state, updateState, onResetData, onSyncWithSpreadsheet, syncLoading, autoSyncing 
}: SettingsTabProps) {
  const [gasUrlInput, setGasUrlInput] = useState(state.gasUrl);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeGuide, setActiveGuide] = useState<'none' | 'mobile' | 'laptop'>('none');
  const [codeCopied, setCodeCopied] = useState(false);

  const scriptCode = `/**
 * Apps Script API Gateway untuk Finance Tracker Pro
 * Menghubungkan Webapp dengan Database Google Spreadsheet
 */

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var data = {};
  
  data.transactions = getSheetRows(ss, 'TRANSAKSI');
  data.wallets = getSheetRows(ss, 'DOMPET');
  data.savingGoals = getSheetRows(ss, 'TABUNGAN');
  data.emergencyFund = getSheetRows(ss, 'DANA_DARURAT')[0] || {};
  data.investments = getSheetRows(ss, 'INVESTASI');
  data.budgets = getSheetRows(ss, 'ANGGARAN');
  
  return ContentService.createTextOutput(JSON.stringify({ 
    status: 'success', 
    data: data 
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    var payload = JSON.parse(e.postData.contents);
    
    if (payload.action === 'sync_all') {
      updateSheet(ss, 'TRANSAKSI', payload.transactions);
      updateSheet(ss, 'DOMPET', payload.wallets);
      updateSheet(ss, 'TABUNGAN', payload.savingGoals);
      updateSheet(ss, 'DANA_DARURAT', [payload.emergencyFund]);
      updateSheet(ss, 'INVESTASI', payload.investments);
      updateSheet(ss, 'ANGGARAN', payload.budgets);
      
      return ContentService.createTextOutput(JSON.stringify({ 
        status: 'success', 
        message: 'Data berhasil disinkronkan ke Google Sheet!' 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'error', 
      message: 'Aksi tidak dikenal.' 
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'error', 
      message: err.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getSheetRows(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  
  var values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  
  var headers = values[0];
  var rows = [];
  
  for (var i = 1; i < values.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      var val = values[i][j];
      if (typeof val === 'string' && (val.indexOf('{') === 0 || val.indexOf('[') === 0)) {
        try {
          val = JSON.parse(val);
        } catch(e) {}
      }
      row[headers[j]] = val;
    }
    rows.push(row);
  }
  return rows;
}

function updateSheet(ss, sheetName, dataArray) {
  if (!dataArray) return;
  
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }
  
  if (dataArray.length === 0) {
    sheet.appendRow(['Status']);
    sheet.appendRow(['Kosong']);
    return;
  }
  
  var headers = Object.keys(dataArray[0]);
  sheet.appendRow(headers);
  
  for (var i = 0; i < dataArray.length; i++) {
    var rowData = dataArray[i];
    var rowValues = headers.map(function(h) {
      var val = rowData[h];
      if (val === null || val === undefined) return '';
      return (typeof val === 'object') ? JSON.stringify(val) : val;
    });
    sheet.appendRow(rowValues);
  }
}`;

  const handleCopyScriptCode = () => {
    navigator.clipboard.writeText(scriptCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

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
          <div className="space-y-3.5">
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

            {/* Auto Sync Toggle Feature */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-800/80 rounded-xl">
              <div className="pr-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-850 dark:text-slate-200 block">Autosync (Sync Otomatis)</span>
                  {autoSyncing && (
                    <span className="inline-flex items-center gap-1 text-[9px] text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-md animate-pulse">
                      <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                      <span>Sedang Sinkron...</span>
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">Otomatis kirim data ke Google Sheet setiap ada transaksi baru/perubahan</span>
              </div>
              <button
                id="toggle-autosync"
                type="button"
                onClick={() => updateState({ autoSync: !state.autoSync })}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${
                  state.autoSync !== false ? 'bg-emerald-500' : 'bg-slate-305 bg-slate-200 dark:bg-slate-705 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-250 ease-in-out ${
                    state.autoSync !== false ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100/60 dark:border-amber-900/40 p-4 rounded-xl text-xs text-amber-800 dark:text-amber-450 flex items-start gap-2.5 leading-relaxed font-sans">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Petunjuk:</strong> Hubungkan database Google Sheets untuk menyimpan semua data transaksi, dompet, target tabungan, dan budget bulanan Anda secara persistent di awan (cloud)! Saling hubungkan lewat petunjuk setup mandiri di bawah ini.
            </div>
          </div>
        )}

        {/* Help & Guide Section */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-500 animate-pulse" />
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">Panduan Setup Google Sheet Mandiri</h4>
          </div>

          <div className="flex gap-2 text-xs">
            <button
              onClick={() => setActiveGuide(activeGuide === 'mobile' ? 'none' : 'mobile')}
              className={`flex-1 py-1.5 px-2 bg-slate-50 dark:bg-slate-900 border rounded-lg flex items-center justify-between transition-all font-bold cursor-pointer ${
                activeGuide === 'mobile'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                  : 'border-slate-150 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <span className="flex items-center gap-1">📱 HP (Mobile)</span>
              <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${activeGuide === 'mobile' ? 'rotate-180' : ''}`} />
            </button>

            <button
              onClick={() => setActiveGuide(activeGuide === 'laptop' ? 'none' : 'laptop')}
              className={`flex-1 py-1.5 px-2 bg-slate-50 dark:bg-slate-900 border rounded-lg flex items-center justify-between transition-all font-bold cursor-pointer ${
                activeGuide === 'laptop'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                  : 'border-slate-150 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <span className="flex items-center gap-1">💻 Laptop / PC</span>
              <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${activeGuide === 'laptop' ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Code Copy Button */}
          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 block">Kode Google Apps Script</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Salin kode ini untuk ditempel di editor Apps Script Anda</span>
            </div>
            <button
              onClick={handleCopyScriptCode}
              className="py-1.5 px-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-all active:scale-[0.97]"
            >
              {codeCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500 animate-fade-in" />
                  <span className="text-emerald-500 font-bold">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Kode</span>
                </>
              )}
            </button>
          </div>

          {/* Active Guide Content */}
          {activeGuide === 'mobile' && (
            <div className="bg-emerald-500/[0.04] dark:bg-emerald-950/[0.15] border border-emerald-500/15 p-3.5 rounded-lg text-[11px] text-slate-700 dark:text-slate-300 space-y-2.5 leading-relaxed mt-2 font-sans">
              <h5 className="font-bold text-emerald-500 flex items-center gap-1">📱 Langkah Lengkap Setup Lewat HP (Tanpa Laptop!)</h5>
              
              <ol className="list-decimal pl-4.5 space-y-2">
                <li>Buka browser <strong className="text-slate-800 dark:text-slate-100">Google Chrome / Safari</strong> di HP Anda.</li>
                <li>Masuk ke <strong className="text-slate-800 dark:text-slate-100">sheets.google.com</strong>.</li>
                <li>
                  <strong className="text-rose-500">WAJIB AKTIFKAN SITUS DESKTOP!</strong>
                  <div className="text-[10px] text-slate-550 dark:text-slate-400 mt-0.5 bg-slate-100/50 dark:bg-slate-900/60 p-1.5 rounded-md">
                    • Chrome HP: Ketuk <strong className="text-slate-800 dark:text-slate-100">titik tiga</strong> kanan atas &gt; centang <strong className="text-slate-800 dark:text-slate-100">"Situs Desktop"</strong>.<br />
                    • Safari HP: Ketuk tombol <strong className="text-slate-800 dark:text-slate-100">"aA"</strong> kiri bawah &gt; pilih <strong className="text-slate-800 dark:text-slate-100">"Minta Situs Web Desktop"</strong>.
                  </div>
                </li>
                <li>Ketuk tombol <strong className="text-slate-850 dark:text-slate-100">+ (Kosong)</strong> untuk membuat spreadsheet baru. Beri nama di atas.</li>
                <li>Zoom-in ke bar menu atas, ketuk <strong className="text-slate-850 dark:text-slate-100">Ekstensi (Extensions)</strong> &gt; pilih <strong className="text-slate-850 dark:text-slate-100">Apps Script</strong>.</li>
                <li>Setelah tab Apps Script terbuka, hapus seluruh kode bawaan di dalam editor.</li>
                <li>Ketuk tombol <strong className="text-emerald-500">"Salin Kode" (di atas)</strong> lalu tempelkan (paste) di layar editor tersebut.</li>
                <li>Ketuk ikon <strong className="text-slate-850 dark:text-slate-100">Simpan (Disket)</strong> di bar atas.</li>
                <li>Ketuk <strong className="text-slate-850 dark:text-slate-100">Terapkan (Deploy)</strong> &gt; pilih <strong className="text-slate-850 dark:text-slate-100">Penerapan Baru</strong>.</li>
                <li>
                  Ketuk ikon <strong className="text-slate-850 dark:text-slate-100">Gerigi</strong> &gt; pilih <strong className="text-slate-850 dark:text-slate-100">Aplikasi Web (Web App)</strong>.
                  <div className="text-[10px] text-slate-550 dark:text-slate-400 mt-0.5 bg-slate-100/50 dark:bg-slate-900/60 p-1.5 rounded-md">
                    • Execute as: "Saya (email Anda)"<br />
                    • Who has access: "Siapa saja (Anyone)"
                  </div>
                </li>
                <li>Ketuk <strong className="text-slate-850 dark:text-slate-100">Deploy</strong> &gt; ketuk <strong className="text-slate-850 dark:text-slate-100">Authorize Access</strong> &gt; pilih akun Gmail Anda.</li>
                <li>Jika ada peringatan keamanan Google, ketuk opsi <strong className="text-slate-855 dark:text-slate-100">Advanced/Lanjutan</strong> di bawah &gt; pilih ketuk <strong className="text-slate-855 dark:text-slate-100">Go to Untitled Project (unsafe)</strong>. Ketuk <strong className="text-emerald-500">Allow</strong>.</li>
                <li>Salin <strong className="text-slate-800 dark:text-slate-100">URL Aplikasi Web</strong> yang ditampilkan (berakhiran <code className="bg-slate-150 dark:bg-slate-900 px-1 py-0.5 rounded text-[10px]">/exec</code>).</li>
                <li>Tempelkan (paste) URL tersebut ke kolom input di atas, ketuk <strong className="text-slate-850 dark:text-slate-100">Simpan</strong>, dan nikmati sinkronisasi awan instan Anda! 🚀</li>
              </ol>
            </div>
          )}

          {activeGuide === 'laptop' && (
            <div className="bg-emerald-500/[0.04] dark:bg-emerald-950/[0.15] border border-emerald-500/15 p-3.5 rounded-lg text-[11px] text-slate-700 dark:text-slate-300 space-y-2.5 leading-relaxed mt-2 font-sans">
              <h5 className="font-bold text-emerald-500 flex items-center gap-1">💻 Langkah Setup Google Sheets Lewat Laptop / PC</h5>
              
              <ol className="list-decimal pl-4.5 space-y-2">
                <li>Buka browser komputer, masuk ke <strong className="text-slate-800 dark:text-slate-100">sheets.google.com</strong>.</li>
                <li>Buat Spreadsheet baru, klik ikon <strong className="text-slate-850 dark:text-slate-101">+ (Kosong)</strong>.</li>
                <li>Klik menu <strong className="text-slate-850 dark:text-slate-101">Ekstensi (Extensions)</strong> di bar atas &gt; klik <strong className="text-slate-850 dark:text-slate-101">Apps Script</strong>.</li>
                <li>Hapus kode bawaan. Klik tombol <strong className="text-emerald-500">"Salin Kode" (di atas)</strong> lalu paste di editor.</li>
                <li>Klik ikon <strong className="text-slate-850 dark:text-slate-101">Simpan (Disket)</strong> di samping kiri atas editor.</li>
                <li>Klik tombol <strong className="text-slate-850 dark:text-slate-101">Deploy</strong> biru &gt; <strong className="text-slate-850 dark:text-slate-101">New Deployment</strong>.</li>
                <li>Klik ikon <strong className="text-slate-850 dark:text-slate-101">Gerigi</strong> kiri atas, pilih tipe <strong className="text-slate-850 dark:text-slate-101">Web App</strong>.</li>
                <li>
                  Isi konfigurasi berikut:
                  <div className="text-[10px] text-slate-550 dark:text-slate-400 mt-0.5 bg-slate-100/50 dark:bg-slate-900/60 p-1.5 rounded-md">
                    • Execute as: "Saya (email Anda)"<br />
                    • Who has access: "Siapa saja (Anyone)"
                  </div>
                </li>
                <li>Klik <strong className="text-slate-850 dark:text-slate-101">Deploy</strong>, lalu klik <strong className="text-slate-850 dark:text-slate-101">Authorize Access</strong> dan pilih email Google Anda.</li>
                <li>Klik <strong className="text-slate-455">Advanced</strong> &gt; <strong className="text-slate-850 dark:text-slate-101">Go to Untitled Project (unsafe)</strong> untuk memberikan izin. Klik <strong className="text-slate-850 dark:text-slate-101">Allow/Izinkan</strong>.</li>
                <li>Salin <strong className="text-slate-800 dark:text-slate-100">URL Aplikasi Web</strong> yang diberikan (berakhiran <code className="bg-slate-150 dark:bg-slate-900 px-1 py-0.5 rounded text-[10px]">/exec</code>).</li>
                <li>Kirim tautan tersebut ke HP Anda (lewat WA, email, Telegram, dsb.).</li>
                <li>Di HP Anda, buka aplikasi ini, paste di kolom atas, lalu pilih <strong className="text-slate-850 dark:text-slate-101">Simpan</strong> dan ketuk <strong className="text-emerald-500 font-bold">Sync Sekarang</strong>!</li>
              </ol>
            </div>
          )}
        </div>
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
