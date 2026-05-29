/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { House, Landmark, Plus, ChartPie, History } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'assets' | 'report' | 'history';
  setActiveTab: (tab: 'home' | 'assets' | 'report' | 'history') => void;
  onFloatingClick: () => void;
}

export default function BottomNav({ activeTab, setActiveTab, onFloatingClick }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800/80 px-4 pb-safe-bottom">
      <div className="max-w-md mx-auto flex items-center justify-between h-20 relative">
        {/* Home Tab */}
        <button
          id="btn-nav-home"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center w-16 h-12 transition-all duration-200 ${
            activeTab === 'home'
              ? 'text-emerald-500 dark:text-emerald-400 scale-110'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <House className="w-6 h-6 stroke-[2.2]" />
          <span className="text-[10px] font-medium mt-1">Beranda</span>
        </button>

        {/* Assets Tab */}
        <button
          id="btn-nav-assets"
          onClick={() => setActiveTab('assets')}
          className={`flex flex-col items-center justify-center w-16 h-12 transition-all duration-200 ${
            activeTab === 'assets'
              ? 'text-emerald-500 dark:text-emerald-400 scale-110'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <Landmark className="w-6 h-6 stroke-[2.2]" />
          <span className="text-[10px] font-medium mt-1">Aset</span>
        </button>

        {/* Center Floating Plus Button */}
        <div className="absolute left-1/2 -top-6 -translate-x-1/2">
          <button
            id="btn-floating-add"
            onClick={onFloatingClick}
            className="w-14 h-14 bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-emerald-500/30 dark:hover:shadow-emerald-600/20 active:scale-95 transition-all duration-200"
          >
            <Plus className="w-8 h-8 stroke-[2.5]" />
          </button>
        </div>

        {/* Dummy spacer for center button */}
        <div className="w-12 h-10" />

        {/* Report Tab */}
        <button
          id="btn-nav-report"
          onClick={() => setActiveTab('report')}
          className={`flex flex-col items-center justify-center w-16 h-12 transition-all duration-200 ${
            activeTab === 'report'
              ? 'text-emerald-500 dark:text-emerald-400 scale-110'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <ChartPie className="w-6 h-6 stroke-[2.2]" />
          <span className="text-[10px] font-medium mt-1">Laporan</span>
        </button>

        {/* History Tab */}
        <button
          id="btn-nav-history"
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center w-16 h-12 transition-all duration-200 ${
            activeTab === 'history'
              ? 'text-emerald-500 dark:text-emerald-400 scale-110'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <History className="w-6 h-6 stroke-[2.2]" />
          <span className="text-[10px] font-medium mt-1">Riwayat</span>
        </button>
      </div>
    </div>
  );
}
