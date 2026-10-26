import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Key, Lock, Unlock, Copy, Check, ExternalLink,
  MessageSquare, RefreshCw, Trash2, Download, Search, AlertCircle,
  Sparkles, CheckCircle2, UserCheck, ArrowLeft
} from 'lucide-react';
import {
  generateLicenseCode,
  verifyLicenseCode,
  verifyAdminPasscode,
  computeLicenseSignature
} from '../licenseSecurity';

interface LicenseRecord {
  id: string;
  name: string;
  code: string;
  dateStr: string;
  dateFormatted: string;
  note: string;
  createdAt: number;
}

interface SeladityaVaultProps {
  onBackToApp: () => void;
  showToast?: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export default function SeladityaVault({ onBackToApp, showToast }: SeladityaVaultProps) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('seladitya_session_unlocked') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinAttempts, setPinAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutRemaining > 0) {
      const timer = setTimeout(() => {
        setLockoutRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [lockoutRemaining]);

  // Generator State
  const [buyerName, setBuyerName] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [channelNote, setChannelNote] = useState('Transfer Langsung');
  const [generatedResult, setGeneratedResult] = useState<{
    code: string;
    name: string;
    dateFormatted: string;
    oneClickUrl: string;
    waTemplate: string;
  } | null>(null);

  // Vault History State
  const [history, setHistory] = useState<LicenseRecord[]>(() => {
    try {
      const saved = localStorage.getItem('seladitya_license_vault_v1');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [historySearch, setHistorySearch] = useState('');

  // Checker / Verifier State
  const [testCodeInput, setTestCodeInput] = useState('');
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    valid: boolean;
    message: string;
    name?: string;
    dateFormatted?: string;
  } | null>(null);

  // Copy tracking states
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Persist history
  useEffect(() => {
    localStorage.setItem('seladitya_license_vault_v1', JSON.stringify(history));
  }, [history]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;

    if (verifyAdminPasscode(pinInput)) {
      setIsAuthenticated(true);
      sessionStorage.setItem('seladitya_session_unlocked', 'true');
      setPinError('');
      setPinAttempts(0);
      if (showToast) showToast('Akses Vault Seladitya Diberikan!', 'success');
    } else {
      const nextAttempts = pinAttempts + 1;
      setPinAttempts(nextAttempts);
      if (nextAttempts >= 5) {
        setLockoutRemaining(30);
        setPinError('Terlalu banyak percobaan salah! Vault terkunci sementara selama 30 detik.');
      } else {
        setPinError(`PIN salah! Sisa percobaan: ${5 - nextAttempts}`);
      }
    }
  };

  const handleLock = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('seladitya_session_unlocked');
    setPinInput('');
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim()) {
      if (showToast) showToast('Silakan masukkan nama pembeli.', 'error');
      return;
    }

    const { code, name, dateStr, dateFormatted } = generateLicenseCode(buyerName, purchaseDate);
    
    // Build One-Click URL
    const baseUrl = window.location.origin;
    const oneClickUrl = `${baseUrl}/?activate=${encodeURIComponent(code)}`;

    // Build WA Template
    const waTemplate = `Halo Kak ${name}! 👋\n\nTerima kasih banyak atas pembelian aplikasi *Darimana Duitnya PRO*.\n\nBerikut Kode Lisensi Resmi Anda:\n👉 *${code}*\n\n🚀 *Cara Aktivasi Instan (Pilih salah satu):*\n1. Cukup klik link otomatis ini: ${oneClickUrl}\n*(Aplikasi langsung terbuka & aktif permanen!)*\n\nAtau buka aplikasi manual > Tab *Pengaturan* > masukkan kode di atas > Tekan *Aktivasi*.\n\nBatas transaksi langsung dihapus dan seluruh fitur PRO aktif selamanya. Selamat mencatat keuangan tanpa boncos! ✨`;

    const newRecord: LicenseRecord = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      code,
      dateStr,
      dateFormatted,
      note: channelNote,
      createdAt: Date.now()
    };

    setGeneratedResult({
      code,
      name,
      dateFormatted,
      oneClickUrl,
      waTemplate
    });

    setHistory((prev) => [newRecord, ...prev.filter(r => r.code !== code)]);
    if (showToast) showToast(`Lisensi untuk ${name} berhasil dibuat!`, 'success');
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    if (showToast) showToast('Berhasil disalin ke clipboard!', 'info');
    setTimeout(() => {
      setCopiedType(null);
    }, 2500);
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    setConfirmDeleteId(null);
    if (showToast) showToast('Riwayat lisensi berhasil dihapus.', 'info');
  };

  const exportToCsv = () => {
    if (history.length === 0) {
      if (showToast) showToast('Belum ada riwayat lisensi untuk diekspor.', 'info');
      return;
    }

    // Sanitize cells against CSV formula injection
    const sanitizeCsvCell = (val: string) => {
      const clean = String(val || '').replace(/"/g, '""');
      if (/^[=+\-@\t\r]/.test(clean)) {
        return `"'${clean}"`;
      }
      return `"${clean}"`;
    };

    const headers = ['Nama', 'Kode Lisensi', 'Tanggal Beli', 'Catatan/Kanal', 'Waktu Dibuat'];
    const rows = history.map(item => [
      sanitizeCsvCell(item.name),
      sanitizeCsvCell(item.code),
      sanitizeCsvCell(item.dateFormatted),
      sanitizeCsvCell(item.note),
      sanitizeCsvCell(new Date(item.createdAt).toLocaleString('id-ID'))
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lisensi-darimana-duitnya-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTestCode = () => {
    if (!testCodeInput.trim()) return;
    const res = verifyLicenseCode(testCodeInput);
    setTestResult({
      tested: true,
      valid: res.valid,
      message: res.message,
      name: res.name,
      dateFormatted: res.dateFormatted
    });
  };

  // ================= LOCKED PIN SCREEN =================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="w-7 h-7" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
              <span>Seladitya Vault</span>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Portal Rahasia Pembuat & Manajemen Lisensi
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Masukkan Master Passcode / PIN
              </label>
              <input
                type="password"
                value={pinInput}
                disabled={lockoutRemaining > 0}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError('');
                }}
                placeholder={lockoutRemaining > 0 ? `Terkunci (${lockoutRemaining}s)...` : "Passcode pemilik..."}
                autoFocus
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-center text-sm font-mono tracking-widest text-white focus:outline-none focus:border-amber-500/60 transition disabled:opacity-50"
              />
              {lockoutRemaining > 0 ? (
                <p className="text-amber-400 text-xs font-semibold mt-2 text-center animate-pulse">
                  Tunggu {lockoutRemaining} detik sebelum mencoba lagi.
                </p>
              ) : pinError ? (
                <p className="text-rose-400 text-xs font-semibold mt-2 text-center animate-shake">
                  {pinError}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={lockoutRemaining > 0}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              <Unlock className="w-4 h-4" />
              {lockoutRemaining > 0 ? `Terkunci (${lockoutRemaining}s)` : 'Buka Akses Vault'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <button
              onClick={onBackToApp}
              className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 mx-auto transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Aplikasi Utama
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= AUTHENTICATED VAULT DASHBOARD =================
  const filteredHistory = history.filter(item => {
    const q = historySearch.toLowerCase();
    return item.name.toLowerCase().includes(q) || item.code.toLowerCase().includes(q) || item.note.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 pb-24 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Top Navbar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 font-black shadow">
              <Key className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black text-white tracking-wide">SELADITYA LICENSE VAULT</h1>
                <span className="px-1.5 py-0.5 text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
                  SHA-256 SIGNED
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Cryptographic offline key issuer & tamper-proof validator</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLock}
              title="Kunci Vault"
              className="p-2 hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded-xl transition cursor-pointer"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              onClick={onBackToApp}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Ke Aplikasi
            </button>
          </div>
        </div>

        {/* SECTION 1: GENERATE LICENSE FOR CUSTOMER */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              Generate Lisensi Pembeli Baru
            </h2>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  Nama Pembeli (Otomatis Bersih & Kapital)
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Contoh: Dimas Aditya"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/70"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  Tanggal Pembelian
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/70"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">
                Kanal Penjualan / Catatan Pembeli
              </label>
              <input
                type="text"
                value={channelNote}
                onChange={(e) => setChannelNote(e.target.value)}
                placeholder="Contoh: Shopee / Lynk.id Rp 49.000 / Transfer BCA"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/70"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 hover:from-amber-600 hover:to-teal-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Key className="w-4 h-4" />
              Generate Lisensi Asli (Cryptographic Sign)
            </button>
          </form>

          {/* Generated Result Display Card */}
          {generatedResult && (
            <div className="mt-5 p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Lisensi Resmi Berhasil Dibuat
                </span>
                <span className="text-[11px] font-mono text-slate-400">{generatedResult.dateFormatted}</span>
              </div>

              {/* Code display */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-2">
                <span className="font-mono text-base font-black text-emerald-400 tracking-wider break-all select-all">
                  {generatedResult.code}
                </span>
                <button
                  onClick={() => copyToClipboard(generatedResult.code, 'code')}
                  className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  {copiedType === 'code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedType === 'code' ? 'Disalin' : 'Salin Kode'}
                </button>
              </div>

              {/* 1-Click Link */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Link Aktivasi 1-Klik (Otomatis Aktif saat Dibuka Pembeli):
                </label>
                <div className="p-2 bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-center justify-between gap-2 text-xs">
                  <span className="text-slate-300 font-mono text-[11px] truncate">{generatedResult.oneClickUrl}</span>
                  <button
                    onClick={() => copyToClipboard(generatedResult.oneClickUrl, 'url')}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition shrink-0 cursor-pointer"
                    title="Salin Link"
                  >
                    {copiedType === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* WA Template ready button */}
              <button
                onClick={() => copyToClipboard(generatedResult.waTemplate, 'wa')}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                {copiedType === 'wa' ? <Check className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                {copiedType === 'wa' ? 'Pesan WhatsApp Berhasil Disalin!' : 'Salin Pesan WhatsApp Siap Kirim'}
              </button>
            </div>
          )}
        </div>

        {/* SECTION 2: TEST / VERIFY ANY CODE */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              Cek & Verifikasi Keaslian Kode
            </h2>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Masukkan sembarang kode untuk mengecek apakah lisensi asli, siapa pemiliknya, dan tanggal transaksinya.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={testCodeInput}
              onChange={(e) => setTestCodeInput(e.target.value)}
              placeholder="Ketik / paste kode di sini..."
              className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleTestCode}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Verifikasi
            </button>
          </div>

          {testResult && testResult.tested && (
            <div className={`mt-3 p-3 rounded-xl border text-xs ${testResult.valid ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/30 border-rose-500/40 text-rose-300'}`}>
              <div className="font-bold flex items-center gap-1.5">
                {testResult.valid ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                {testResult.valid ? 'LISENSI ASLI & VALID' : 'LISENSI TIDAK VALID'}
              </div>
              <p className="mt-1 text-[11px] text-slate-300">{testResult.message}</p>
            </div>
          )}
        </div>

        {/* SECTION 3: VAULT HISTORY & EXPORT */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                Riwayat Lisensi Terbit ({history.length})
              </h2>
              <p className="text-[11px] text-slate-400">Database lisensi yang pernah Anda cetak di perangkat ini</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportToCsv}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                Ekspor CSV
              </button>
            </div>
          </div>

          {history.length > 0 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Cari nama pembeli / kode..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-700"
              />
            </div>
          )}

          {history.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              Belum ada lisensi yang dibuat. Silakan buat lisensi pertama di atas.
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto no-scrollbar pr-1">
              {filteredHistory.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-xl flex items-center justify-between gap-3 transition"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white truncate">{rec.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({rec.dateFormatted})</span>
                    </div>
                    <div className="text-[11px] font-mono text-emerald-400 truncate select-all">{rec.code}</div>
                    {rec.note && <div className="text-[10px] text-slate-400 truncate">{rec.note}</div>}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => copyToClipboard(rec.code, rec.id)}
                      title="Salin Kode"
                      className="p-2 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 rounded-lg transition cursor-pointer"
                    >
                      {copiedType === rec.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    {confirmDeleteId === rec.id ? (
                      <div className="flex items-center gap-1 bg-slate-900 border border-rose-500/50 rounded-lg p-1">
                        <span className="text-[10px] text-rose-300 font-bold px-1">Hapus?</span>
                        <button
                          onClick={() => handleDeleteHistory(rec.id)}
                          className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[10px] font-bold transition cursor-pointer"
                        >
                          Ya
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] transition cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(rec.id)}
                        title="Hapus dari daftar"
                        className="p-2 hover:bg-slate-800 text-slate-500 hover:text-rose-400 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
