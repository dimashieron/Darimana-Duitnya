# 💸 Darimana Duitnya - Pencatat Keuangan Pribadi Modern

**Darimana Duitnya** adalah aplikasi pencatat keuangan pribadi modern berbasis web (Web App) yang cepat, aman, estetik, dan ramah pengguna seluler (mobile-first). Aplikasi ini didesain khusus untuk memberikan kontrol penuh atas keuangan Anda tanpa iklan dan tanpa melacak data pribadi Anda.

Dengan arsitektur **Offline-First**, semua pencatatan Anda berjalan instan dan aman di perangkat lokal browser Anda. Jika Anda ingin menyinkronkan data antar-perangkat, Anda bisa menghubungkannya langsung ke database awan pribadi Anda menggunakan **Google Sheets** secara gratis!

---

## 🌟 FITUR UTAMA APLIKASI

1. **Dashboard Interaktif & Ringkas**: Pantau total saldo, arus kas masuk/keluar harian, grafik alokasi keuangan, dan riwayat transaksi terbaru dalam satu halaman.
2. **Kategori Transaksi yang Lengkap**:
   - **Pemasukan**: Gaji, Bonus, Freelance, Side Hustle, Dagang, Hibah / Hadiah, dll.
   - **Pengeluaran**: Makanan, Transportasi, Tagihan, Belanja, Kesehatan, **Hiburan**, **Sedekah**, **Pendidikan**, **Cicilan**, **Hutang**, serta kategori kustom lainnya.
3. **Manajemen Aset**: Pantau kepemilikan portofolio aset berharga Anda seperti emas, mata uang kripto (crypto), saham, reksadana, atau instrumen tabungan lainnya.
4. **Rencana Tabungan Impian (Saving Goals)**: Buat dan targetkan tabungan impian Anda (misalnya liburan, gadget baru, atau dana nikah) lengkap dengan bar progres visual yang dinamis.
5. **Analisis Kesiapan Dana Darurat**: Hitung dan kelola dana darurat ideal berdasarkan perkiraan pengeluaran bulanan Anda agar aman dari kondisi tidak terduga.
6. **Perencana Anggaran Bulanan (Budgeting)**: Batasi pengeluaran per kategori agar Anda tidak boncos dan kelola batas anggaran bulanan dengan penunjuk visual yang jelas.
7. **Sinkronisasi Google Sheets Awan**: Sambungkan ke Google Spreadsheet milik Anda sendiri melalui teknologi Google Apps Script. 100% gratis, aman, dan berdaulat penuh atas data Anda sendiri.
8. **PWA (Progressive Web App)**: Pasang aplikasi ini ke layar beranda HP Anda (Android & iOS) dengan satu klik dan rasakan performa mirip aplikasi native tanpa perlu mengunduh dari App Store/Play Store.
9. **Dukungan Mobile Native (Capacitor)**: Siap dikompilasi menjadi aplikasi native untuk Android (.apk) atau iOS (.ipa) menggunakan Capacitor.

---

## 🚀 CARA PENJALANAN LOKAL (DEVELOPMENT)

Bagi pengembang yang ingin mencoba atau mengembangkan aplikasi ini di komputer lokal, ikuti langkah-langkah mudah berikut:

### Prasyarat
- Pastikan komputer Anda sudah terinstal **Node.js** (Versi 18 ke atas direkomendasikan).

### Langkah-langkah
1. **Unduh atau Clone Kode**:
   ```bash
   git clone https://github.com/username/darimana-duitnya.git
   cd darimana-duitnya
   ```
2. **Instalasi Dependensi**:
   ```bash
   npm install
   ```
3. **Jalankan Server Pengembangan**:
   ```bash
   npm run dev
   ```
4. **Buka Aplikasi**:
   Buka browser Anda dan akses halaman `http://localhost:3000` atau alamat IP yang tertera pada terminal Anda.

---

## 🗺️ PANDUAN DEPLOYMENT (MEMPUBLIKASIKAN KE INTERNET)

Anda dapat mengunggah aplikasi ini agar bisa diakses secara online gratis selamanya. Berikut adalah 3 cara paling populer dan direkomendasikan:

### CARA 1: Melalui Vercel via GitHub (Otomatis & Sangat Direkomendasikan)
Metode ini sangat disukai karena setiap kali Anda memperbarui kode di GitHub, website online Anda akan diperbarui secara otomatis.
1. Buat akun gratis di **[GitHub](https://github.com/)**.
2. Buat repositori baru (misal: `darimana-duitnya`), atur visibilitas ke **Private** atau **Public**, lalu unggah kode aplikasi Anda ke sana.
3. Buka situs **[Vercel](https://vercel.com/)** dan masuk (Sign In) menggunakan akun GitHub Anda.
4. Klik tombol **Add New...** > pilih **Project**.
5. Pilih repositori `darimana-duitnya` yang Anda buat, lalu klik **Import**.
6. Biarkan seluruh pengaturan default (Vercel otomatis mendeteksi proyek Vite), lalu klik **Deploy**.
7. Dalam beberapa detik, aplikasi Anda sudah online dengan domain permanen berakhiran `.vercel.app`.

### CARA 2: Melalui Netlify Drop (Seret & Lepas - Tercepat Tanpa Coding)
Jika Anda ingin menerbitkan aplikasi tanpa perlu bersentuhan dengan GitHub:
1. Buka terminal di komputer Anda, lalu buat file produksi siap pakai dengan mengetikkan:
   ```bash
   npm run build
   ```
2. Setelah proses selesai, akan muncul sebuah folder baru bernama **`dist`** di dalam direktori proyek Anda. Folder `dist` ini berisi halaman web statis yang telah dikompres secara optimal.
3. Buka situs web **[Netlify Drop](https://app.netlify.com/drop)** pada browser.
4. Tarik (**drag**) folder **`dist`** dari file explorer komputer Anda, lalu letakkan (**drop**) ke dalam area unggahan di layar Netlify Drop tersebut.
5. Tunggu proses unggahan selesai dan aplikasi Anda akan langsung mengudara di internet secara instan!

---

## 📱 CARA MEMASANG APLIKASI DI HP (ANDROID & IOS)

Agar aplikasi web ini tampil dan berjalan layaknya aplikasi HP sungguhan (tanpa bilah pencarian URL browser yang mengganggu), ikuti panduan berikut:

### 🤖 Pengguna Android (Google Chrome)
1. Buka peramban **Google Chrome** di ponsel Android Anda.
2. Akses alamat website hasil deploy aplikasi Anda (misal: `https://darimana-duitnya.vercel.app`).
3. Ketuk ikon **tiga titik vertikal** di pojok kanan atas layar Chrome.
4. Pilih menu **Tambahkan ke Layar Utama** (atau **Add to Home screen**).
5. Berikan nama, lalu ketuk **Tambahkan**. Ikon aplikasi estetik akan langsung muncul di halaman beranda ponsel Anda!

### 🍏 Pengguna iPhone & iPad (Safari)
1. Buka peramban bawaan **Safari** di iPhone Anda.
2. Akses alamat website hasil deploy aplikasi Anda.
3. Ketuk tombol **Bagikan / Share** (ikon kotak dengan anak panah menunjuk ke atas) di bagian bawah layar.
4. Gulir menu ke bawah lalu pilih opsi **Tambahkan ke Layar Utama** (atau **Add to Home Screen**).
5. Ketuk **Tambah** di pojok kanan atas. Aplikasi akan bertengger manis di beranda iPhone Anda dan siap dibuka kapan saja!

---

## 📊 INTEGRASI DATABASE CLOUD: GOOGLE SHEETS APPS SCRIPT

Aplikasi ini mengusung kedaulatan data penuh. Agar data Anda aman saat berganti browser atau berganti perangkat, hubungkan aplikasi ini dengan Google Spreadsheet Anda sendiri dengan panduan langkah demi langkah di bawah ini:

### 1. Buat Spreadsheet Baru
1. Masuk ke [Google Sheets](https://sheets.google.com/) menggunakan akun Google Anda.
2. Buat lembar kerja kosong baru (blank spreadsheet) dan berikan nama, misalnya: `Database Keuangan - Darimana Duitnya`.

### 2. Pasang Kode Google Apps Script
1. Pada menu navigasi atas spreadsheet, klik **Ekstensi** > pilih **Apps Script**.
2. Hapus seluruh isi kode bawaan (`function myFunction() { ... }`).
3. Salin dan tempelkan seluruh kode berikut ke dalam editor Apps Script Anda:

```javascript
/**
 * Apps Script API Gateway untuk Darimana Duitnya
 * Menghubungkan Webapp dengan Database Google Spreadsheet
 */

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var data = {};
  
  // Ambil data terbaru dari spreadsheet otomatis
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
      // Overwrite/perbarui sheet dengan data terbaru dari web application
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

// === FUNGSI PEMBANTU (HELPERS) ===

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
      // Parsing kembali data array/object JSON jika ada
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
  
  // Cari seluruh kunci (headers) unik secara otomatis
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
}
```

### 3. Deploy sebagai Aplikasi Web
1. Klik tombol **Simpan** (ikon disket) di toolbar atas editor Apps Script.
2. Klik tombol **Terapkan / Deploy** di pojok kanan atas > pilih **Penerapan Baru (New Deployment)**.
3. Konfigurasikan penerapan baru Anda:
   - Klik ikon gerigi (Pilih Jenis) > pilih **Aplikasi Web (Web App)**.
   - Kolom Deskripsi: `Darimana Duitnya Sync Gateway`.
   - Jalankan sebagai (Execute as): **Saya (Email Anda)**.
   - Siapa yang memiliki akses (Who has access): **Siapa saja (Anyone)**. *(Catatan: Ini aman karena transfer data dienkripsi dan hanya dapat diakses melalui endpoint web app terenkripsi Anda).*
4. Klik tombol **Terapkan (Deploy)**.
5. Klik **Beri Akses (Authorize Access)** jika diminta oleh Google, lalu pilih akun Google Anda. Jika muncul peringatan keamanan *"Google has not verified this app"*, pilih **Advanced / Lanjutan** di pojok kiri bawah layar, lalu klik **Go to Untitled Project (unsafe)** untuk menyetujuinya.
6. Salin **URL Aplikasi Web** yang diberikan oleh Google di akhir halaman (URL yang berakhiran dengan `/exec`).

### 4. Hubungkan ke Aplikasi Web "Darimana Duitnya"
1. Buka aplikasi **Darimana Duitnya** yang telah Anda deploy online.
2. Pergi ke tab **Settings** (Pengaturan, ikon roda gigi ⚙️).
3. Cari bidang input bertuliskan **URL Google Apps Script**.
4. Tempelkan URL `/exec` yang sudah Anda salin tadi ke kolom tersebut.
5. Tekan tombol **Simpan Pengaturan**.
6. Uji koneksi dengan mengeklik tombol **Sinkronisasi ke Spreadsheet**.
7. Selamat! Semua sheet transaksi, dompet, tabungan, dana darurat, investasi, dan anggaran bulanan akan secara otomatis terbuat dan terisi secara dinamis dengan data Anda!

---

## 🔒 KEAMANAN & PRIVASI DATA (DATA SOVEREIGNTY)

- **Tanpa Pihak Ketiga**: Data keuangan Anda adalah privasi mutlak Anda. Tidak ada database perantara, server analitik berbayar, atau pengiklan yang dapat melihat transaksi harian Anda.
- **Satu Akun Google**: Semua aliran data hanya berpindah secara langsung antara browser lokal Anda dan Google Drive pribadi Anda via Google Spreadsheet Anda.
- **Bekerja Offline**: Sangat praktis mencatat pengeluaran di mana saja (misal dalam pesawat atau area basement parkiran) tanpa kuota internet. Data akan disimpan aman di browser dan disinkronkan saat jaringan internet telah aktif kembali.

Selamat menggunakan dan nikmati kedaulatan finansial Anda seutuhnya bersama **Darimana Duitnya**! 💸🌟
