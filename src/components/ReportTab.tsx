/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileDown, Calendar, Check } from 'lucide-react';
import { AppState } from '../types';
import { formatRupiah, formatReadableDate } from '../utils';

interface ReportTabProps {
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
  showToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export default function ReportTab({ state, updateState, showToast }: ReportTabProps) {
  const [dateFilterType, setDateFilterType] = useState<'semua' | 'today' | '7days' | '30days' | 'custom'>('30days');
  const [customStartDate, setCustomStartDate] = useState('2026-05-01');
  const [customEndDate, setCustomEndDate] = useState('2026-05-29');
  const [showExportToast, setShowExportToast] = useState<string | null>(null);

  const todayStr = '2026-05-29';

  // Compute standard ISO YYYY-MM-DD
  let isoStart = '';
  let isoEnd = '';

  if (dateFilterType === 'today') {
    isoStart = todayStr;
    isoEnd = todayStr;
  } else if (dateFilterType === '7days') {
    isoStart = '2026-05-22';
    isoEnd = todayStr;
  } else if (dateFilterType === '30days') {
    isoStart = '2026-04-29';
    isoEnd = todayStr;
  } else if (dateFilterType === 'custom') {
    isoStart = customStartDate;
    isoEnd = customEndDate;
  } else {
    isoStart = '1970-01-01';
    isoEnd = todayStr;
  }

  // Filter transactions in date range
  const filteredTransactions = state.transactions.filter(tx => {
    return tx.date >= isoStart && tx.date <= isoEnd;
  });

  // Calculate metrics in date range
  const totalPemasukan = filteredTransactions
    .filter(tx => tx.type === 'pendapatan')
    .reduce((acc, tx) => acc + tx.nominal, 0);

  const totalPengeluaran = filteredTransactions
    .filter(tx => tx.type === 'pengeluaran')
    .reduce((acc, tx) => acc + tx.nominal, 0);

  const totalTabungan = filteredTransactions
    .filter(tx => tx.type === 'tabungan')
    .reduce((acc, tx) => acc + tx.nominal, 0);

  const totalInvestasi = filteredTransactions
    .filter(tx => tx.type === 'investasi')
    .reduce((acc, tx) => acc + tx.nominal, 0);

  // Helper real Client-side Export trigger
  const triggerExport = (format: string) => {
    if (filteredTransactions.length === 0) {
      if (showToast) {
        showToast('Tidak ada data transaksi untuk diekspor pada rentang waktu ini.', 'info');
      } else {
        alert('Tidak ada data transaksi untuk diekspor pada rentang waktu ini.');
      }
      return;
    }

    const filenamePrefix = `Laporan_Keuangan_${isoStart}_ke_${isoEnd}`;

    if (format === 'CSV') {
      const headers = ['No', 'Tanggal', 'Jenis', 'Kategori', 'Nominal', 'Sumber Dana', 'Penerima_Tujuan', 'Catatan'];
      const rows = filteredTransactions.map((tx, idx) => {
        const wallet = state.wallets.find(w => w.id === tx.source);
        const sourceName = wallet ? wallet.name : tx.source;
        
        let destName = '-';
        if (tx.type === 'tabungan') {
          const goal = state.savingGoals.find(g => g.id === tx.destination);
          destName = goal ? goal.name : 'Tabungan';
        } else if (tx.type === 'investasi' || tx.type === 'jual_aset') {
          const inv = state.investments.find(i => i.id === tx.destination);
          destName = inv ? inv.name : 'Investasi';
        }

        return [
          idx + 1,
          tx.date,
          tx.type.toUpperCase(),
          tx.category,
          tx.nominal,
          sourceName,
          destName,
          tx.notes || ''
        ];
      });

      // UTF-8 BOM so Excel and Mobile apps read symbols and comma flawlessly
      const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(r => r.map(val => {
        const strVal = String(val).replace(/"/g, '""');
        return strVal.includes(',') || strVal.includes('\n') || strVal.includes('"') ? `"${strVal}"` : strVal;
      }).join(','))].join('\r\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${filenamePrefix}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } else if (format === 'Excel') {
      const rowsHtml = filteredTransactions.map((tx, idx) => {
        const wallet = state.wallets.find(w => w.id === tx.source);
        const sourceName = wallet ? wallet.name : tx.source;
        
        let destName = '-';
        if (tx.type === 'tabungan') {
          const goal = state.savingGoals.find(g => g.id === tx.destination);
          destName = goal ? goal.name : 'Tabungan';
        } else if (tx.type === 'investasi' || tx.type === 'jual_aset') {
          const inv = state.investments.find(i => i.id === tx.destination);
          destName = inv ? inv.name : 'Investasi';
        }

        const typeColor = 
          tx.type === 'pendapatan' ? '#10b981' : 
          tx.type === 'pengeluaran' ? '#ef4444' : 
          tx.type === 'tabungan' ? '#3b82f6' : '#fab005';

        return `
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">${idx + 1}</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">${tx.date}</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold; color: ${typeColor};">${tx.type.toUpperCase()}</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">${tx.category}</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right; font-weight: bold;">${tx.nominal}</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">${sourceName}</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">${destName}</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">${tx.notes || ''}</td>
          </tr>
        `;
      }).join('');

      const excelHtml = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; }
            table { border-collapse: collapse; width: 100%; }
            th { background-color: #10b981; color: white; font-weight: bold; border: 1px solid #94a3b8; padding: 10px; }
            .header-label { background-color: #f1f5f9; font-weight: bold; border: 1px solid #cbd5e1; padding: 8px; }
            .number-sum { text-align: right; font-weight: bold; border: 1px solid #cbd5e1; padding: 8px; }
          </style>
        </head>
        <body>
          <h2>Laporan Aktivitas Keuangan Mandiri</h2>
          <p>
            <strong>Nama Pengguna:</strong> ${state.userName}<br/>
            <strong>Periode Laporan:</strong> ${isoStart} s.d. ${isoEnd}<br/>
            <strong>Tanggal Unduh:</strong> ${new Date().toLocaleDateString('id-ID')}
          </p>

          <table>
            <thead>
              <tr>
                <td colspan="4" class="header-label">TOTAL PENDAPATAN</td>
                <td colspan="4" class="number-sum" style="color: #10b981;">Rp ${totalPemasukan.toLocaleString('id-ID')}</td>
              </tr>
              <tr>
                <td colspan="4" class="header-label">TOTAL PENGELUARAN</td>
                <td colspan="4" class="number-sum" style="color: #ef4444;">Rp ${totalPengeluaran.toLocaleString('id-ID')}</td>
              </tr>
              <tr>
                <td colspan="4" class="header-label">SISA NETTO TABUNGAN / SISA DANA</td>
                <td colspan="4" class="number-sum" style="color: #2563eb;">Rp ${(totalPemasukan - totalPengeluaran).toLocaleString('id-ID')}</td>
              </tr>
              <tr style="height: 25px;"></tr>
              <tr style="background-color: #10b981;">
                <th style="border: 1px solid #94a3b8; color: white;">No</th>
                <th style="border: 1px solid #94a3b8; color: white;">Tanggal</th>
                <th style="border: 1px solid #94a3b8; color: white;">Jenis</th>
                <th style="border: 1px solid #94a3b8; color: white;">Kategori</th>
                <th style="border: 1px solid #94a3b8; color: white;">Nominal (Rp)</th>
                <th style="border: 1px solid #94a3b8; color: white;">Sumber Dana</th>
                <th style="border: 1px solid #94a3b8; color: white;">Tujuan_Penerima</th>
                <th style="border: 1px solid #94a3b8; color: white;">Catatan</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </body>
        </html>
      `;

      const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${filenamePrefix}.xls`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } else if (format === 'PDF') {
      const rowsHtml = filteredTransactions.map((tx, idx) => {
        const wallet = state.wallets.find(w => w.id === tx.source);
        const sourceName = wallet ? wallet.name : tx.source;
        
        let destName = '-';
        if (tx.type === 'tabungan') {
          const goal = state.savingGoals.find(g => g.id === tx.destination);
          destName = goal ? goal.name : 'Tabungan';
        } else if (tx.type === 'investasi' || tx.type === 'jual_aset') {
          const inv = state.investments.find(i => i.id === tx.destination);
          destName = inv ? inv.name : 'Investasi';
        }

        const typeColor = 
          tx.type === 'pendapatan' ? 'color: #10b981;' :
          tx.type === 'pengeluaran' ? 'color: #ef4444;' :
          tx.type === 'tabungan' ? 'color: #3b82f6;' : 'color: #d97706;';

        const typeLabel = 
          tx.type === 'pendapatan' ? 'PENDAPATAN 📈' :
          tx.type === 'pengeluaran' ? 'PENGELUARAN 📉' :
          tx.type === 'tabungan' ? 'TABUNGAN 💰' :
          tx.type === 'investasi' ? 'INVESTASI 🚀' : 'JUAL ASET 🤝';

        return `
          <tr style="border-bottom: 1px solid #e2e8f0; font-size: 11px;">
            <td style="padding: 10px; font-weight: 500;">${idx + 1}</td>
            <td style="padding: 10px; color: #475569;">${tx.date}</td>
            <td style="padding: 10px; font-weight: bold; ${typeColor}">${typeLabel}</td>
            <td style="padding: 10px; font-weight: 600; color: #0fa57c;">${tx.category}</td>
            <td style="padding: 10px; font-weight: bold; text-align: right; color: #1e293b;">Rp ${tx.nominal.toLocaleString('id-ID')}</td>
            <td style="padding: 10px; color: #475569;">${sourceName}</td>
            <td style="padding: 10px; color: #475569;">${destName}</td>
            <td style="padding: 10px; color: #64748b; max-width: 151px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${tx.notes || '-'}</td>
          </tr>
        `;
      }).join('');

      const pdfHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${filenamePrefix}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            body { font-family: 'Inter', sans-serif; background: #fafafa; color: #1e293b; padding: 40px; margin: 0; }
            .card { background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
            @media print {
              body { background: #ffffff; padding: 20px; }
              .card { border: none; box-shadow: none; padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="margin-bottom: 25px; padding: 15px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; font-size: 13px;">
            <div>
              <strong style="color: #1e3a8a;">📄 Dokumen Laporan Siap Dicetak ke PDF!</strong>
              <div style="font-size: 11px; color: #1e40af; margin-top: 3px;">Halaman ini otomatis membuka dialog cetak browser Anda. Silakan pilih "Simpan sebagai PDF / Save as PDF".</div>
            </div>
            <button onclick="window.print()" style="background: #2563eb; color: white; border: none; padding: 8px 16px; font-size: 11px; font-weight: bold; border-radius: 8px; cursor: pointer;">
              🖨️ Cetak PDF
            </button>
          </div>

          <div class="card">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 24px;">
              <div>
                <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #059669;">LAPORAN KEUANGAN MANDIRI</h1>
                <div style="font-size: 11px; color: #64748b; margin-top: 5px;">Diproduksi oleh Aplikasi Manajemen Keuangan Personal</div>
              </div>
              <div style="text-align: right; font-size: 11px;">
                <strong>Pengguna:</strong> ${state.userName}<br/>
                <strong>Periode:</strong> s.d. ${isoEnd}<br/>
                <strong>Dicetak:</strong> ${new Date().toLocaleString('id-ID')}
              </div>
            </div>

            <!-- Stats Ringkasan -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 30px;">
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px;">
                <span style="font-size: 10px; font-weight: bold; color: #166534; text-transform: uppercase;">TOTAL PEMASUKAN</span>
                <div style="font-size: 16px; font-weight: 800; color: #15803d; margin-top: 8px;">Rp ${totalPemasukan.toLocaleString('id-ID')}</div>
              </div>
              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 16px;">
                <span style="font-size: 10px; font-weight: bold; color: #991b1b; text-transform: uppercase;">TOTAL PENGELUARAN</span>
                <div style="font-size: 16px; font-weight: 800; color: #b91c1c; margin-top: 8px;">Rp ${totalPengeluaran.toLocaleString('id-ID')}</div>
              </div>
              <div style="background: #f0fdfa; border: 1px solid #ccfbf1; border-radius: 12px; padding: 16px;">
                <span style="font-size: 10px; font-weight: bold; color: #017163; text-transform: uppercase;">TABUNGAN / INVESTASI</span>
                <div style="font-size: 16px; font-weight: 800; color: #0d9488; margin-top: 8px;">Rp ${(totalTabungan + totalInvestasi).toLocaleString('id-ID')}</div>
              </div>
              <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px;">
                <span style="font-size: 10px; font-weight: bold; color: #1e40af; text-transform: uppercase;">SISA NETTO</span>
                <div style="font-size: 16px; font-weight: 800; color: #1d4ed8; margin-top: 8px;">Rp ${(totalPemasukan - totalPengeluaran).toLocaleString('id-ID')}</div>
              </div>
            </div>

            <!-- Tabel Transaksi -->
            <h3 style="font-size: 13px; font-weight: 700; color: #1e293b; margin-bottom: 12px;">Daftar Rincian Transaksi (${filteredTransactions.length})</h3>
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; font-size: 11px; font-weight: bold; color: #475569;">
                  <th style="padding: 10px;">ID</th>
                  <th style="padding: 10px;">Tanggal</th>
                  <th style="padding: 10px;">Jenis</th>
                  <th style="padding: 10px;">Kategori</th>
                  <th style="padding: 10px; text-align: right;">Nominal</th>
                  <th style="padding: 10px;">Sumber</th>
                  <th style="padding: 10px;">Tujuan</th>
                  <th style="padding: 10px;">Catatan</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>

            <div style="text-align: center; font-size: 10px; color: #94a3b8; margin-top: 40px; border-top: 1px dashed #e2e8f0; padding-top: 15px;">
              Dokumen ini dihasilkan secara otomatis dari aplikasi pintar manajemen keuangan Anda.
            </div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 400);
            }
          </script>
        </body>
        </html>
      `;

      const blob = new Blob([pdfHtml], { type: 'text/html;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${filenamePrefix}_Cetak.html`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    if (showToast) {
      showToast(`Laporan ${format} berhasil diunduh. Silakan buka file hasil unduhan Anda!`, 'success');
    } else {
      setShowExportToast(format);
      setTimeout(() => {
        setShowExportToast(null);
      }, 4000);
    }
  };

  // Generate dynamic line chart dots based on filtered range
  const getLineChartData = () => {
    const txs = filteredTransactions.filter(t => t.type === 'pengeluaran');
    txs.sort((a, b) => a.date.localeCompare(b.date));
    
    const uniqueDates = Array.from(new Set(txs.map(t => t.date))).slice(-7);
    
    if (uniqueDates.length === 0) {
      return [
        { day: 'No Data', val: 0, x: 20, y: 140 },
        { day: 'No Data', val: 0, x: 350, y: 140 },
      ];
    }
    
    const grouped: { [date: string]: number } = {};
    uniqueDates.forEach(d => {
      grouped[d] = txs.filter(t => t.date === d).reduce((sum, t) => sum + t.nominal, 0);
    });
    
    const maxVal = Math.max(...uniqueDates.map(d => grouped[d]), 10000);
    
    return uniqueDates.map((d, index) => {
      const val = grouped[d];
      const x = uniqueDates.length === 1 ? 185 : 20 + (index * (330 / (uniqueDates.length - 1)));
      const pct = val / maxVal;
      const y = 140 - (pct * 90); // keep nodes bounded within 50 to 140
      return {
        day: formatReadableDate(d).substring(0, 6),
        val,
        x,
        y
      };
    });
  };

  const lineChartData = getLineChartData();

  // SVG coordinates path calculations
  const svgPath = lineChartData.reduce((path, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
  }, '');

  // Dynamic Category Proportions Inside Range
  const getCategoryProportions = () => {
    const txs = filteredTransactions.filter(t => t.type === 'pengeluaran');
    const total = txs.reduce((sum, t) => sum + t.nominal, 0);
    if (total === 0) {
      return [
        { name: 'Tidak Ada Transaksi', pct: 100, color: 'bg-slate-400', stroke: '#94a3b8' }
      ];
    }
    
    const cats: { [name: string]: number } = {};
    txs.forEach(t => {
      cats[t.category] = (cats[t.category] || 0) + t.nominal;
    });
    
    const list = Object.keys(cats).map(name => {
      const val = cats[name];
      const pct = Math.round((val / total) * 100);
      return {
        name,
        pct,
        color: name === 'Makanan' ? 'bg-red-500' :
               name === 'Transportasi' ? 'bg-blue-500' :
               name === 'Tagihan' ? 'bg-indigo-500' :
               name === 'Belanja' ? 'bg-pink-500' :
               name === 'Kesehatan' ? 'bg-emerald-500' : 'bg-slate-400',
        stroke: name === 'Makanan' ? '#ef4444' :
                name === 'Transportasi' ? '#3b82f6' :
                name === 'Tagihan' ? '#6366f1' :
                name === 'Belanja' ? '#ec4899' :
                name === 'Kesehatan' ? '#10b981' : '#94a3b8'
      };
    });
    
    return list.sort((a, b) => b.pct - a.pct);
  };

  const categoryProportions = getCategoryProportions();

  // Dynamic Income Proportions Inside Range
  const getIncomeProportions = () => {
    const txs = filteredTransactions.filter(t => t.type === 'pendapatan');
    const total = txs.reduce((sum, t) => sum + t.nominal, 0);
    if (total === 0) {
      return [
        { name: 'Tidak Ada Transaksi', pct: 100, color: 'bg-slate-400', stroke: '#94a3b8' }
      ];
    }
    
    const cats: { [name: string]: number } = {};
    txs.forEach(t => {
      cats[t.category] = (cats[t.category] || 0) + t.nominal;
    });
    
    const list = Object.keys(cats).map(name => {
      const val = cats[name];
      const pct = Math.round((val / total) * 100);
      return {
        name,
        pct,
        color: name === 'Gaji' ? 'bg-emerald-500' :
               name === 'Bonus' ? 'bg-amber-400' : 'bg-slate-400',
        stroke: name === 'Gaji' ? '#10b981' :
                name === 'Bonus' ? '#fbbf24' : '#94a3b8'
      };
    });
    
    return list.sort((a, b) => b.pct - a.pct);
  };

  const incomeProportions = getIncomeProportions();

  return (
    <div className="w-full pb-24 font-sans animate-fade-in relative">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">Analisa Laporan</h2>

      {/* Modern Date Filter Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm mb-5 space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-355 text-slate-650 dark:text-slate-300">
          <span className="font-extrabold text-slate-800 dark:text-slate-200">Rentang Waktu Laporan</span>
          <Calendar className="w-5 h-5 text-slate-400" />
        </div>
        
        {/* Quick select buttons */}
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
                  : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-100/80 dark:border-slate-700 text-slate-600 dark:text-slate-350'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
 
        {/* Dynamic native calendar fields */}
        {dateFilterType === 'custom' && (
          <div className="grid grid-cols-2 gap-3 pt-1 animate-fade-in">
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-400 block mb-1 font-bold">MULAI TANGGAL</span>
              <input
                type="date"
                onClick={(e) => {
                  try { e.currentTarget.showPicker(); } catch (err) {}
                }}
                onFocus={(e) => {
                  try { e.currentTarget.showPicker(); } catch (err) {}
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-150 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100 cursor-pointer block"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-400 block mb-1 font-bold">SAMPAI TANGGAL</span>
              <input
                type="date"
                onClick={(e) => {
                  try { e.currentTarget.showPicker(); } catch (err) {}
                }}
                onFocus={(e) => {
                  try { e.currentTarget.showPicker(); } catch (err) {}
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-150 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100 cursor-pointer block"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="text-[10px] text-slate-400 dark:text-slate-500 italic font-medium pt-0.5 leading-tight">
          {dateFilterType === 'semua' && 'Menampilkan seluruh riwayat transaksi Anda.'}
          {dateFilterType === 'today' && `Hari ini: ${formatReadableDate(todayStr)}`}
          {dateFilterType === '7days' && `Periode 7 hari ke belakang (22 Mei 2026 - 29 Mei 2026).`}
          {dateFilterType === '30days' && `Periode 30 hari ke belakang (29 Apr 2026 - 29 Mei 2026).`}
          {dateFilterType === 'custom' && `Periode custom: ${formatReadableDate(customStartDate)} s/d ${formatReadableDate(customEndDate)}.`}
        </div>
      </div>

      {/* Quad core stat cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-emerald-50/55 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-950 rounded-2xl p-4">
          <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block font-sans tracking-wide">Pemasukan</span>
          <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1 truncate">{formatRupiah(totalPemasukan)}</p>
        </div>
        <div className="bg-rose-50/55 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-950 rounded-2xl p-4">
          <span className="text-[10px] uppercase font-bold text-rose-500 dark:text-rose-450 block font-sans tracking-wide">Pengeluaran</span>
          <p className="text-sm font-black text-rose-600 dark:text-rose-400 mt-1 truncate">{formatRupiah(totalPengeluaran)}</p>
        </div>
        <div className="bg-blue-50/55 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-950 rounded-2xl p-4">
          <span className="text-[10px] uppercase font-bold text-blue-500 block font-sans tracking-wide">Tabungan</span>
          <p className="text-sm font-black text-blue-600 dark:text-blue-400 mt-1 truncate">{formatRupiah(totalTabungan)}</p>
        </div>
        <div className="bg-purple-50/55 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-950 rounded-2xl p-4">
          <span className="text-[10px] uppercase font-bold text-purple-500 block font-sans tracking-wide">Investasi</span>
          <p className="text-sm font-black text-purple-600 dark:text-purple-400 mt-1 truncate">{formatRupiah(totalInvestasi)}</p>
        </div>
      </div>

      {/* LINE CHART: DAILY SPLINE */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-705 rounded-2xl p-5 mb-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 h-5 px-1 flex items-center justify-between">
          <span>Grafik Pengeluaran Harian</span>
          <span className="text-[10px] text-slate-400 font-mono">Berdasarkan Periode</span>
        </h3>
        
        {/* SVG Graphic represent spline */}
        <div className="w-full h-44 relative bg-slate-50 dark:bg-slate-900 border border-slate-100/50 dark:border-slate-800 rounded-xl p-2 select-none overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 380 180" preserveAspectRatio="none">
            {/* Guide Grid Gridlines */}
            <line x1="20" y1="40" x2="350" y2="40" stroke="#f1f5f9" className="dark:stroke-slate-800" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="20" y1="80" x2="350" y2="80" stroke="#f1f5f9" className="dark:stroke-slate-800" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="20" y1="120" x2="350" y2="120" stroke="#f1f5f9" className="dark:stroke-slate-800" strokeWidth="1" strokeDasharray="3 3" />

            {/* Area glow */}
            {svgPath && (
              <path 
                d={`${svgPath} L 350 160 L 20 160 Z`} 
                fill="url(#glowGradient)" 
                opacity="0.12" 
              />
            )}

            {/* Curved stroke line path */}
            {svgPath && (
              <path 
                d={svgPath} 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="2.8" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            )}

            {/* Interactive dot nodes */}
            {lineChartData.map((p, i) => (
              <g key={i} className="group cursor-pointer">
                <circle cx={p.x} cy={p.y} r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" className="dark:stroke-slate-900 dark:fill-emerald-400" />
                <circle cx={p.x} cy={p.y} r="10" fill="#10b981" opacity="0" className="group-hover:opacity-20 transition" />
              </g>
            ))}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="glowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Chart x-axis indices */}
        <div className="flex justify-between px-3 mt-2 text-[9px] text-slate-400 uppercase font-bold font-sans tracking-wide">
          {lineChartData.map((p, i) => (
            <span key={i}>{p.day}</span>
          ))}
        </div>
      </div>

      {/* DONUT CHART 1: PORSI PENGELUARAN */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/85 rounded-2xl p-5 mb-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 px-1">Porsi Pengeluaran</h3>
        
        <div className="flex items-center gap-6">
          {/* Dynamic circle */}
          <div className="relative w-28 h-28 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" className="dark:stroke-slate-700/60" />
              
              {/* Dynamic mathematically perfect circular SVG segments */}
              {(() => {
                let accumulatedPercent = 0;
                return categoryProportions.map((p) => {
                  if (p.pct <= 0) return null;
                  const strokeDasharray = `${p.pct} ${100 - p.pct}`;
                  const strokeDashoffset = 100 - accumulatedPercent;
                  accumulatedPercent += p.pct;

                  return (
                    <circle
                      key={p.name}
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke={p.stroke}
                      strokeWidth="4.2"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300"
                    />
                  );
                });
              })()}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col leading-none">
              <span className="text-[9px] uppercase font-bold text-slate-400">Total</span>
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">100%</span>
            </div>
          </div>

          {/* Segment Checklist Legend */}
          <div className="flex-1 space-y-2 text-xs">
            {categoryProportions.map((p) => (
              <div key={p.name} className="flex items-center justify-between font-sans">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                  <span className="text-slate-600 dark:text-slate-350 font-medium">{p.name}</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-100">{p.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DONUT CHART 2: PORSI PENDAPATAN */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/85 rounded-2xl p-5 mb-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 px-1">Porsi Pendapatan</h3>
        
        <div className="flex items-center gap-6">
          <div className="relative w-28 h-28 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" className="dark:stroke-slate-700/60" />
              
              {/* Dynamic mathematically perfect circular SVG segments for Income */}
              {(() => {
                let accumulatedPercent = 0;
                return incomeProportions.map((p) => {
                  if (p.pct <= 0) return null;
                  const strokeDasharray = `${p.pct} ${100 - p.pct}`;
                  const strokeDashoffset = 100 - accumulatedPercent;
                  accumulatedPercent += p.pct;

                  return (
                    <circle
                      key={p.name}
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke={p.stroke}
                      strokeWidth="4.2"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300"
                    />
                  );
                });
              })()}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col leading-none">
              <span className="text-[9px] uppercase font-bold text-slate-400">Total</span>
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">100%</span>
            </div>
          </div>

          <div className="flex-1 space-y-2 text-xs">
            {incomeProportions.map((p) => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                  <span className="text-slate-600 dark:text-slate-350 font-medium">{p.name}</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-100">{p.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EXPORT DATA BLOCK */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 mb-4">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3 px-1">Export Laporan</h4>
        
        <div className="grid grid-cols-3 gap-2 text-xs select-none">
          <button
            onClick={() => triggerExport('CSV')}
            className="flex flex-col items-center justify-center p-3.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-slate-900 dark:hover:bg-slate-750/90 border border-emerald-100/60 dark:border-slate-700 rounded-2xl text-emerald-600 font-bold transition-all h-20 cursor-pointer"
          >
            <FileDown className="w-5 h-5 mb-1.5" />
            <span>CSV</span>
          </button>
          
          <button
            onClick={() => triggerExport('Excel')}
            className="flex flex-col items-center justify-center p-3.5 bg-blue-50 hover:bg-blue-100 dark:bg-slate-900 dark:hover:bg-slate-750/90 border border-blue-100/60 dark:border-slate-700 rounded-2xl text-blue-600 font-bold transition-all h-20 cursor-pointer"
          >
            <FileDown className="w-5 h-5 mb-1.5" />
            <span>Excel</span>
          </button>
          
          <button
            onClick={() => triggerExport('PDF')}
            className="flex flex-col items-center justify-center p-3.5 bg-rose-50 hover:bg-rose-100 dark:bg-slate-900 dark:hover:bg-slate-750/90 border border-rose-100/60 dark:border-slate-700 rounded-2xl text-rose-500 font-bold transition-all h-20 cursor-pointer"
          >
            <FileDown className="w-5 h-5 mb-1.5" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Interactive download notification toast */}
      {showExportToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold transition-all duration-300 z-50 animate-bounce border border-slate-150/85 dark:border-slate-800 backdrop-blur-md">
          <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
          <span>Laporan berhasil diunduh sebagai {showExportToast}!</span>
        </div>
      )}
    </div>
  );
}
