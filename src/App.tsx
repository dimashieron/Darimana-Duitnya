/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Database, RefreshCw, AlertCircle, X, Check,
  Sliders, Smartphone, Settings, ArrowLeft
} from 'lucide-react';
import { AppState, Transaction, Wallet, SavingGoal, EmergencyFund, InvestmentAsset, TransactionType } from './types';
import { INITIAL_STATE } from './data';
import { sanitizeAppState, recalculateBalances } from './utils';
import BottomNav from './components/BottomNav';
import DashboardTab from './components/DashboardTab';
import AssetsTab from './components/AssetsTab';
import ReportTab from './components/ReportTab';
import HistoryTab from './components/HistoryTab';
import SettingsTab from './components/SettingsTab';
import TransactionForm from './components/TransactionForm';

export default function App() {
  // Core application state
  const [appState, setAppState] = useState<AppState>(() => {
    try {
      const stored = localStorage.getItem('finance_tracker_state_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        let sanitized = sanitizeAppState(parsed, INITIAL_STATE);
        
        // SELF-HEALING: If wallet balances and other asset balances are 0, but they
        // actually have transaction history, recalculate balances from transactions.
        const totalWallets = sanitized.wallets.reduce((sum, w) => sum + w.balance, 0);
        const totalInvestments = sanitized.investments.reduce((sum, inv) => sum + inv.value, 0);
        const totalSavings = sanitized.savingGoals.reduce((sum, g) => sum + g.balance, 0);
        const totalEF = sanitized.emergencyFund.balance;
        
        if (totalWallets === 0 && totalInvestments === 0 && totalSavings === 0 && totalEF === 0 && sanitized.transactions.length > 0) {
          const { wallets, investments, savingGoals, emergencyFund } = recalculateBalances(
            sanitized.transactions,
            sanitized.wallets,
            sanitized.investments,
            sanitized.savingGoals,
            sanitized.emergencyFund
          );
          sanitized = {
            ...sanitized,
            wallets,
            investments,
            savingGoals,
            emergencyFund
          };
        }
        return sanitized;
      }
    } catch (e) {
      console.error('Failed to parse local storage, loading default data', e);
    }
    return INITIAL_STATE;
  });

  // Global Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // UI routing states
  const [activeTab, setActiveTab] = useState<'home' | 'assets' | 'report' | 'history' | 'settings'>('home');
  const [assetsActiveSubTab, setAssetsActiveSubTab] = useState<'wallets' | 'portfolio' | 'savings' | 'emergency' | 'budget'>('wallets');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [prepopulatedParams, setPrepopulatedParams] = useState<{
    type: TransactionType;
    source?: string;
    destination?: string;
  } | null>(null);

  // Syncing states
  const [uploadLoading, setUploadLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [autoSyncing, setAutoSyncing] = useState(false);
  const skipAutoSyncRef = React.useRef(true); // skip on initial render mount

  // Custom Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void | Promise<void>;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
  } | null>(null);

  // Save changes to localStorage on any state change
  useEffect(() => {
    localStorage.setItem('finance_tracker_state_v1', JSON.stringify(appState));
  }, [appState]);

  // Autosync on data changes to remote Google Sheet database
  useEffect(() => {
    if (skipAutoSyncRef.current) {
      skipAutoSyncRef.current = false;
      return;
    }

    if (!appState.gasUrl || appState.autoSync === false) {
      return;
    }

    // SAFEGUARD: Jangan biarkan autosync otomatis mengunggah data kosong ke Google Sheets.
    // Jika data transaksi di HP kosong, jangan lakukan autosync. Ini mencegah
    // HP baru / Shortcut baru yang masih kosong menimpa atau menghapus isi spreadsheet Anda!
    if (appState.transactions.length === 0) {
      return;
    }

    // Debounce the auto sync by 1.5 seconds so we don't trigger multiple requests in quick succession
    const debounceTimer = setTimeout(async () => {
      setAutoSyncing(true);
      try {
        await fetch(appState.gasUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'sync_all',
            transactions: appState.transactions,
            wallets: appState.wallets,
            savingGoals: appState.savingGoals,
            emergencyFund: appState.emergencyFund,
            investments: appState.investments,
            budgets: appState.budgets,
          }),
        });
        console.log('Automated sync to spreadsheet completed');
      } catch (err) {
        console.error('Automated sync failed:', err);
      } finally {
        setAutoSyncing(false);
      }
    }, 1500);

    return () => clearTimeout(debounceTimer);
  }, [
    appState.transactions,
    appState.wallets,
    appState.savingGoals,
    appState.emergencyFund,
    appState.investments,
    appState.budgets,
    appState.gasUrl,
    appState.autoSync
  ]);

  // Theme Controller
  useEffect(() => {
    const applyTheme = () => {
      const isDark = 
        appState.theme === 'dark' || 
        (appState.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    };
    applyTheme();

    // Listen for system theme change events if mode is system
    const systemMedia = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (appState.theme === 'system') {
        applyTheme();
      }
    };
    systemMedia.addEventListener('change', handleSystemChange);
    return () => systemMedia.removeEventListener('change', handleSystemChange);
  }, [appState.theme]);

  const updateState = (newState: Partial<AppState>) => {
    setAppState((prev) => ({ ...prev, ...newState }));
  };

  // Restores mock values
  const handleResetData = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset ke Data Default?',
      description: 'Apakah Anda yakin ingin menyetel ulang data ke awal? Seluruh catatan transaksi dan anggaran saat ini akan dikosongkan dan diganti ke data simulasi bawaan.',
      confirmText: 'Ya, Reset',
      cancelText: 'Batal',
      isDanger: true,
      onConfirm: () => {
        skipAutoSyncRef.current = true; // Avoid pushing empty reset state immediately
        setAppState({
          ...INITIAL_STATE,
          gasUrl: appState.gasUrl, // Retain script API endpointURL
          theme: appState.theme
        });
        setActiveTab('home');
        setSyncFeedback({ type: 'success', message: 'Data berhasil disetel ulang ke pengaturan awal!' });
        setTimeout(() => setSyncFeedback(null), 3000);
        setConfirmDialog(null);
      }
    });
  };

  // Google Apps Script spreadsheets: Push local data to Sheets
  const handleUploadToSpreadsheet = async () => {
    if (!appState.gasUrl) {
      setSyncFeedback({ type: 'error', message: 'Tolong tautkan link URL Apps Script valid di tab Pengaturan.' });
      return;
    }

    setUploadLoading(true);
    setSyncFeedback(null);

    try {
      // POST the current state metadata to Spreadsheet database
      const response = await fetch(appState.gasUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // Serves as simple request to bypass CORS preflight blocks, but delivers full JSON payload
        },
        body: JSON.stringify({
          action: 'sync_all',
          transactions: appState.transactions,
          wallets: appState.wallets,
          savingGoals: appState.savingGoals,
          emergencyFund: appState.emergencyFund,
          investments: appState.investments,
          budgets: appState.budgets,
        }),
      });

      if (response.ok) {
        const resJson = await response.json().catch(() => null);
        if (resJson && resJson.status === 'success') {
          setSyncFeedback({ 
            type: 'success', 
            message: 'Data HP berhasil dicadangkan ke Google Sheet! Silakan cek spreadsheet Anda.' 
          });
        } else {
          // Sometimes Google Apps Script redirects and does not return readable body if CORS is semi-blocked by certain configurations,
          // but if status is 200/OK, usually the script ran successfully. We treat response.ok as success but provide helpful notes.
          setSyncFeedback({ 
            type: 'success', 
            message: 'Sukses mengirim data! Silakan periksa Google Sheet Anda.' 
          });
        }
      } else {
        setSyncFeedback({ 
          type: 'error', 
          message: `Gagal mengirim data. Server rujukan merespon kesalahan (Status: ${response.status}).` 
        });
      }
    } catch (error) {
      console.error('Error uploading to Google Sheets:', error);
      // Fallback: If we got a network/CORS error, since redirects to Googleusercontent from Apps Script sometimes trigger CORS policies on some clients,
      // the sheet might have actually updated. We give a comprehensive diagnostic message.
      setSyncFeedback({ 
        type: 'error', 
        message: 'Gagal verifikasi respon dari Google Sheets. Pastikan Apps Script di-deploy ulang sebagai Web App dengan akses "Anyone/Siapa Saja".' 
      });
    } finally {
      setUploadLoading(false);
      setTimeout(() => setSyncFeedback(null), 5000);
    }
  };

  // Google Apps Script spreadsheets: Pull Sheets data to Local HP
  const handleDownloadFromSpreadsheet = async () => {
    if (!appState.gasUrl) {
      setSyncFeedback({ type: 'error', message: 'Tolong tautkan link URL Apps Script valid di tab Pengaturan.' });
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: 'Tarik Data dari Sheet?',
      description: 'Apakah Anda yakin ingin menarik data dari Google Sheet? Seluruh catatan keuangan di HP saat ini akan ditimpa (overwrite) oleh data dari Google Sheet Anda!',
      confirmText: 'Ya, Tarik Data',
      cancelText: 'Batal',
      isDanger: false,
      onConfirm: async () => {
        setConfirmDialog(null);
        setDownloadLoading(true);
        setSyncFeedback(null);

        try {
          const getRes = await fetch(appState.gasUrl);
          if (getRes.ok) {
            const resJson = await getRes.json();
            if (resJson.status === 'success' && resJson.data) {
              const data = resJson.data;
              
              // Sanitize received data so we never import corruption (e.g. empty states, undefined or NaN values)
              const sanitized = sanitizeAppState({
                transactions: data.transactions,
                wallets: data.wallets,
                savingGoals: data.savingGoals,
                emergencyFund: data.emergencyFund,
                investments: data.investments,
                budgets: data.budgets
              }, INITIAL_STATE);

              // Recalculate balances dynamically from transaction list to prevent "Net worth 0" bugs
              const { wallets, investments, savingGoals, emergencyFund } = recalculateBalances(
                sanitized.transactions,
                sanitized.wallets,
                sanitized.investments,
                sanitized.savingGoals,
                sanitized.emergencyFund
              );

              skipAutoSyncRef.current = true; // prevent instantly autosyncing right back what we just pulled
              setAppState((prev) => ({
                ...prev,
                transactions: sanitized.transactions,
                wallets,
                savingGoals,
                emergencyFund,
                investments,
                budgets: sanitized.budgets,
              }));

              setSyncFeedback({ type: 'success', message: 'Sukses memulihkan data dari Google Sheet ke HP Anda!' });
            } else {
              setSyncFeedback({ type: 'error', message: 'Google Sheet kosong atau rincian data tidak valid.' });
            }
          } else {
            setSyncFeedback({ type: 'error', message: 'Mendapat respon tidak valid dari Apps Script (Bukan OK).' });
          }
        } catch (error) {
          console.error('Error synchronizing Google Sheets download:', error);
          setSyncFeedback({ 
            type: 'error', 
            message: 'Gagal mengunduh data. Pastikan Apps Script di-deploy dan dapat diakses publik.' 
          });
        } finally {
          setDownloadLoading(false);
          setTimeout(() => setSyncFeedback(null), 5000);
        }
      }
    });
  };

  // Prepopulate form triggers
  const openTransactionWithParams = (params: { 
    type: TransactionType; 
    source?: string; 
    destination?: string; 
  }) => {
    setPrepopulatedParams(params);
    setEditingTx(null);
    setIsFormOpen(true);
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTx(tx);
    setPrepopulatedParams(null);
    setIsFormOpen(true);
  };

  const isDarkTheme = appState.theme === 'dark' || 
    (appState.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'} font-sans md:py-6 md:px-4 flex items-center justify-center transition-colors duration-200`}>
      
      {/* Sleek App Shell box responsive on desktop, native layout on mobile */}
      <div className={`w-full max-w-md md:rounded-[36px] md:shadow-2xl md:ring-1 ${isDarkTheme ? 'dark md:ring-slate-800 bg-slate-950' : 'md:ring-slate-200 bg-slate-50'} md:relative md:overflow-hidden min-h-screen md:min-h-[820px] flex flex-col transition-colors`}>
        
        {/* Minimalist Floating Auto-Sync status indicator inside the shell */}
        {autoSyncing && (
          <div className="absolute top-4 right-4 z-40 bg-emerald-500/95 dark:bg-emerald-500/90 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 animate-pulse select-none pointer-events-none transition-all">
            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
            <span>Autosync...</span>
          </div>
        )}

        {/* Tab Header breadcrumb bar (Only show if settings or nested views are loaded) */}
        {activeTab === 'settings' && (
          <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-900 flex items-center gap-2 bg-white dark:bg-slate-900/45 animate-fade-in">
            <button 
              onClick={() => setActiveTab('home')} 
              className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-500"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Kembali ke Dashboard</span>
          </div>
        )}

        {/* Primary View Router Area */}
        <main className="flex-1 overflow-y-auto px-5 pt-3 pb-24 h-full no-scrollbar">
          {activeTab === 'home' && (
            <DashboardTab 
              state={appState} 
              setActiveTab={setActiveTab} 
              onOpenSettings={() => setActiveTab('settings')} 
              setAssetsSubTab={setAssetsActiveSubTab}
            />
          )}

          {activeTab === 'assets' && (
            <AssetsTab 
              state={appState} 
              updateState={updateState} 
              openTransactionWithParams={openTransactionWithParams}
              subTab={assetsActiveSubTab}
              setSubTab={setAssetsActiveSubTab}
            />
          )}

          {activeTab === 'report' && (
            <ReportTab 
              state={appState} 
              updateState={updateState}
              showToast={showToast}
            />
          )}

          {activeTab === 'history' && (
            <HistoryTab 
              state={appState} 
              updateState={updateState} 
              onEditTransaction={handleEditTransaction}
              showToast={showToast}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab 
              state={appState} 
              updateState={updateState} 
              onResetData={handleResetData}
              onUploadToSpreadsheet={handleUploadToSpreadsheet}
              onDownloadFromSpreadsheet={handleDownloadFromSpreadsheet}
              uploadLoading={uploadLoading}
              downloadLoading={downloadLoading}
              autoSyncing={autoSyncing}
            />
          )}
        </main>

        {/* Spreadsheet Sync Status Feedback popover */}
        {syncFeedback && (
          <div className={`fixed top-12 left-1/2 -translate-x-1/2 md:absolute max-w-xs w-[90%] p-3.5 rounded-xl shadow-xl border z-50 flex items-start gap-2.5 animate-fade-in font-sans text-xs font-bold leading-normal ${
            syncFeedback.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-250 text-emerald-850 dark:text-emerald-400' 
              : 'bg-rose-50 dark:bg-rose-955 border-rose-200 text-rose-800'
          }`}>
            {syncFeedback.type === 'success' ? <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />}
            <div className="flex-1">
              <span>{syncFeedback.message}</span>
            </div>
            <button onClick={() => setSyncFeedback(null)} className="text-slate-400 font-normal">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Global Toast Notification */}
        {toast && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold transition-all duration-300 z-50 animate-bounce border border-slate-150 dark:border-slate-800 backdrop-blur-md">
            <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
            <span>{toast.message}</span>
          </div>
        )}

        {/* Global Floating Transaction Form overlay drawer */}
        {isFormOpen && (
          <TransactionForm
            state={appState}
            updateState={updateState}
            onClose={() => {
              setIsFormOpen(false);
              setEditingTx(null);
              setPrepopulatedParams(null);
            }}
            editTransaction={editingTx}
            prepopulatedParams={prepopulatedParams}
            showToast={showToast}
          />
        )}

        {/* Beautiful Custom Native Confirmation Dialog Modal */}
        {confirmDialog && confirmDialog.isOpen && (
          <div className="absolute inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-[2px] flex items-center justify-center p-6 md:rounded-[36px] animate-fade-in">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 w-full max-w-[290px] shadow-2xl space-y-4 text-center transform scale-100 transition-all">
              <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${confirmDialog.isDanger ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-500' : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500'}`}>
                {confirmDialog.isDanger ? (
                  <AlertCircle className="w-6 h-6 stroke-[2.2]" />
                ) : (
                  <RefreshCw className="w-5 h-5 stroke-[2.2]" />
                )}
              </div>
              
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {confirmDialog.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  {confirmDialog.description}
                </p>
              </div>

              <div className="flex gap-2.5 pt-1.5 font-sans">
                <button
                  onClick={() => setConfirmDialog(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-2xl cursor-pointer transition-all active:scale-[0.97]"
                >
                  {confirmDialog.cancelText || 'Batal'}
                </button>
                <button
                  onClick={confirmDialog.onConfirm}
                  className={`flex-1 py-2.5 text-white text-xs font-bold rounded-2xl cursor-pointer transition-all active:scale-[0.97] shadow-sm ${
                    confirmDialog.isDanger 
                      ? 'bg-rose-500 hover:bg-rose-600' 
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {confirmDialog.confirmText || 'Ya'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation bottom deck */}
        <BottomNav 
          activeTab={activeTab === 'settings' ? 'home' : activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setEditingTx(null);
            setPrepopulatedParams(null);
          }} 
          onFloatingClick={() => {
            setEditingTx(null);
            setPrepopulatedParams(null);
            setIsFormOpen(true);
          }}
        />

      </div>
    </div>
  );
}
