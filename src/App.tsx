/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Wifi, ShieldCheck, Database, RefreshCw, AlertCircle, X, Check,
  Sliders, Smartphone, Clock, Settings, ArrowLeft
} from 'lucide-react';
import { AppState, Transaction, Wallet, SavingGoal, EmergencyFund, InvestmentAsset } from './types';
import { INITIAL_STATE } from './data';
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
        if (!parsed.categories || parsed.categories.length === 0) {
          parsed.categories = INITIAL_STATE.categories;
        }
        return parsed;
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
    type: 'investasi' | 'pengeluaran' | 'pendapatan' | 'tabungan' | 'jual_aset';
    source?: string;
    destination?: string;
  } | null>(null);

  // Syncing states
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [autoSyncing, setAutoSyncing] = useState(false);
  const skipAutoSyncRef = React.useRef(true); // skip on initial render mount

  // UTC clock status bar
  const [currentTime, setCurrentTime] = useState('');

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

  // Clock formatter
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // Format as hours & minutes e.g. "09:41"
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000 * 30);
    return () => clearInterval(interval);
  }, []);

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
    const confirmReset = window.confirm('Apakah Anda yakin ingin menyetel ulang data ke awal? Semua catatan transaksi dan anggaran akan dikosongkan.');
    if (confirmReset) {
      skipAutoSyncRef.current = true; // Avoid pushing empty reset state immediately
      setAppState({
        ...INITIAL_STATE,
        gasUrl: appState.gasUrl, // Retain script API endpointURL
        theme: appState.theme
      });
      setActiveTab('home');
      setSyncFeedback({ type: 'success', message: 'Data berhasil disetel ulang ke pengaturan awal!' });
      setTimeout(() => setSyncFeedback(null), 3000);
    }
  };

  // Google Apps Script spreadsheets synchronization callback
  const handleSyncWithSpreadsheet = async () => {
    if (!appState.gasUrl) {
      setSyncFeedback({ type: 'error', message: 'Tolong tautkan link URL Apps Script valid di tab Pengaturan.' });
      return;
    }

    setSyncLoading(true);
    setSyncFeedback(null);

    try {
      // POST the current state metadata to Spreadsheet database
      const response = await fetch(appState.gasUrl, {
        method: 'POST',
        mode: 'no-cors', // Apps Script handles CORS better if JSON values POSTed as standard payloads, but no-cors makes it fire-and-forget.
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

      // Since no-cors makes standard response bodies opaque, we display clear instructions and complete successful feedback.
      setSyncFeedback({ 
        type: 'success', 
        message: 'Berhasil dikirim! Silakan periksa Google Sheet TRANSAKSI, DOMPET, TABUNGAN Anda.' 
      });

      // Quick fallback: Let's also do a standard fetch GET to pull down spreadsheets data if CORS allows it
      try {
        const getRes = await fetch(appState.gasUrl);
        if (getRes.ok) {
          const resJson = await getRes.json();
          if (resJson.status === 'success' && resJson.data) {
            const data = resJson.data;
            skipAutoSyncRef.current = true; // avoid syncing right back what we just pulled
            updateState({
              transactions: data.transactions || appState.transactions,
              wallets: data.wallets || appState.wallets,
              savingGoals: data.savingGoals || appState.savingGoals,
              emergencyFund: data.emergencyFund || appState.emergencyFund,
              investments: data.investments || appState.investments,
              budgets: data.budgets || appState.budgets,
            });
            setSyncFeedback({ type: 'success', message: 'Data spreadsheet berhasil dimuat ke aplikasi!' });
          }
        }
      } catch (getErr) {
         // Gracefully skip standard GET pull if CORS restrictions prevent it, standard POST sync is already complete.
         console.warn('GET skipped due to opaque sandbox rules', getErr);
      }

    } catch (error) {
      console.error('Error synchronizing Google Sheets:', error);
      setSyncFeedback({ 
        type: 'error', 
        message: 'Gagal menghubungkan. Periksa status otorisasi Apps Script atau URL Anda.' 
      });
    } finally {
      setSyncLoading(false);
      setTimeout(() => setSyncFeedback(null), 5000);
    }
  };

  // Prepopulate form triggers
  const openTransactionWithParams = (params: { 
    type: 'investasi' | 'pengeluaran' | 'pendapatan' | 'tabungan' | 'jual_aset'; 
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
      
      {/* Dynamic responsive simulator shell representing luxury iOS outlines */}
      <div className={`w-full max-w-md md:rounded-[40px] md:shadow-2xl md:ring-12 ${isDarkTheme ? 'dark md:ring-slate-800 bg-slate-950' : 'md:ring-slate-900 bg-slate-50'} md:relative md:overflow-hidden md:border-[10px] md:border-slate-800 min-h-screen md:min-h-[820px] flex flex-col transition-colors`}>
        
        {/* Device simulated status bar (09:41, WiFi, Battery style) */}
        <div className="px-6 pt-3 pb-2 flex justify-between items-center text-xs font-bold text-slate-800 dark:text-slate-300 font-sans tracking-wide select-none">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 opacity-80" />
            <span>{currentTime || '09:41'}</span>
            {autoSyncing && (
              <span className="flex items-center gap-1.5 ml-2 text-[9px] text-emerald-600 dark:text-emerald-400 font-bold transition-all animate-pulse">
                <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                <span>Autosync...</span>
              </span>
            )}
          </span>
          <div className="h-4.5 w-24 bg-black dark:bg-slate-800 rounded-full flex justify-center items-center shadow-inner md:block hidden">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800 dark:bg-slate-950 block mx-auto" />
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <Wifi className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px]">LTE</span>
            <div className="w-5.5 h-3 bg-slate-200 dark:bg-slate-800 border border-slate-350 dark:border-slate-700/80 rounded p-0.5 flex items-center">
              <div className="bg-slate-800 dark:bg-emerald-400 h-full w-full rounded" />
            </div>
          </div>
        </div>

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
              onSyncWithSpreadsheet={handleSyncWithSpreadsheet}
              syncLoading={syncLoading}
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
