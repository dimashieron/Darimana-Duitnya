# Panduan Lengkap Keuangan Mandiri: Menjalankan & Men-deploy Finance Tracker Pro 🚀

Selamat! Aplikasi **Finance Tracker Pro** Anda telah sepenuhnya selesai dikembangkan, diuji, dan siap digunakan. 

Aplikasi ini dibuat sebagai **Aplikasi Web (Web App)** berbasis React modern. Memilih format Aplikasi Web adalah langkah yang **paling fleksibel dan cerdas** karena:
1. **Dapat diakses di mana saja**: Otomatis bisa dibuka via Android, iPhone (iOS), iPad, Chromebook, Laptop, MacBook, hingga PC desktop tanpa perlu download file instalasi.
2. **Bebas biaya toko aplikasi**: Anda tidak perlu membayar biaya pendaftaran akun developer Google Play Store ($25) atau Apple App Store ($99/tahun).
3. **Instalasi Instan & Ringan**: Tidak menyita memori ponsel Anda, dan dapat ditambahkan ke Layar Utama ponsel agar tampil estetik mirip aplikasi bawaan.
4. **Pembaruan Otomatis**: Setiap ada pembaruan fitur, seluruh pengguna akan otomatis mendapatkan versi terbaru tanpa perlu melakukan update aplikasi manual.

Buku panduan ini disusun khusus menggunakan **bahasa yang sangat ramah orang awam** agar Anda bisa mempublikasikan aplikasi ini secara mandiri dalam hitungan menit!

---

## 🗺️ DAFTAR ISI PANDUAN
* **CARA 1: Cara Tercepat & Termudah (Melalui Fitur "Publish" / "Share" di AI Studio — Direkomendasikan!)**
* **CARA 2: Cara Hosting Mandiri (Self-Host ke Server Sendiri / GitHub)**
  * *Langkah 1*: Cara Men-download File Kode Aplikasi (ZIP)
  * *Langkah 2*: Cara Deploy ke Netlify Drop (Seret & Lepas — Gratis Selamanya)
  * *Langkah 3*: Cara Deploy ke Vercel via GitHub (Otomatis & Profesional)
* **BAGIAN 3**: Cara Membuat Aplikasi Web Tampil Seperti Aplikasi HP (Android & iOS)
* **BAGIAN 4**: Panduan Integrasi Awan dengan Google Sheets (Menyimpan Data Anda Secara Aman)

---

## ⚡ CARA 1: CARA TERCEPAT & TERMUDA (MENGGUNAKAN "PUBLISH" / "SHARE" DI AI STUDIO)

Anda tidak perlu ribet mengunduh kode atau mendaftar website hosting lain seperti Netlify/Vercel karena **AI Studio sudah otomatis meng-host aplikasi Anda di jaringan awan Google secara gratis!**

### Langkah-langkahnya:
1. Hubungkan database Google Sheets terlebih dahulu jika belum (baca panduan lengkap di **BAGIAN 4**).
2. Di pojok kanan atas layar AI Studio Anda, cukup klik tombol **"Publish"** atau **"Share"**.
3. Sistem online Google AI Studio akan secara otomatis membangun (build) aplikasi Anda ke mode produksi yang aman, cepat, dan stabil.
4. Anda akan diberikan sebuah tautan link web yang siap pakai (misal: `https://ais-share-...run.app`).
5. Selesai! Anda tinggal membuka link tersebut di HP (baca **BAGIAN 3** untuk menjadikannya aplikasi layar utama HP) dan membagikannya ke keluarga atau teman. Aplikasi Anda sudah mengudara secara live!

---

## 📁 CARA 2: CARA HOSTING MANDIRI (SELF-HOST)

Gunakan cara ini jika suatu saat Anda ingin memiliki file mentah kodenya sendiri, memindahkan kodenya ke akun GitHub pribadi, atau ingin menggunakan nama domain custom buatan sendiri (misal: `www.keuanganku.com`).

### Langkah 1: Cara Men-download File Kode Aplikasi (ZIP)
Jika tombol unduh tidak langsung terlihat di bar atas, berikut cara mencarinya:
1. Di bilah menu AI Studio (biasanya di samping kiri atau kanan atas), cari ikon **gigi roda (Settings / Pengaturan)** atau menu dropdown bernama **Export/Download**.
2. Pilih opsi **Export as ZIP / Download Code** untuk menyimpan seluruh kode sumber ke komputer Anda.
3. Ekstrak file ZIP tersebut di komputer Anda. Anda akan melihat berkas-berkas aplikasi lengkap (seperti folder `src`, `package.json`, `index.html`, dan lainnya).

### Langkah 2: Cara Deploy ke Netlify Drop (Seret & Lepas - Paling Praktis)
Jika Anda ingin kode mentah Anda di-host di layanan server gratisan Netlify:

#### 1. Membangun File Website Siap Pakai (Build Project)
Sebelum file diunggah ke internet, kode React perlu diterjemahkan menjadi file website statis (HTML, CSS, JS) standar yang dipahami oleh browser:
* Buka folder aplikasi Anda menggunakan program **Terminal / Command Prompt** bawaan komputer Anda.
* Jalankan perintah instalasi pendukung dengan mengetik: `npm install` lalu tekan Enter.
* Jalankan perintah pembuatan halaman website statis dengan mengetik: `npm run build` lalu tekan Enter.
* Setelah selesai, Anda akan melihat sebuah folder baru bernama **`dist`** muncul di dalam direktori aplikasi Anda. Folder `dist` inilah website statis Anda yang sebenarnya!

#### 2. Mengunggah ke Netlify Drop
1. Buka situs web **[Netlify Drop](https://app.netlify.com/drop)** melalui browser Anda.
2. Tarik (**drag**) folder bernamakan **`dist`** dari komputer Anda, lalu lepaskan (**drop**) ke dalam kotak besar yang tersedia di halaman Netlify Drop tersebut.
3. Tunggu beberapa detik saja untuk proses upload.
4. Viola! Halaman Anda langsung aktif di internet. Netlify akan memberikan Anda sebuah tautan gratis, misalnya: `https://nama-acak.netlify.app`.
5. Anda dapat mendaftarkan akun Netlify gratis untuk mengubah alamat web acak tersebut atau menghubungkan domain khusus Anda di bagian **Domain settings**.

### Langkah 3: Cara Deploy ke Vercel via GitHub (Otomatis & Profesional)
Metode ini sangat disukai oleh programmer profesional karena website Anda akan otomatis terupdate setiap kali Anda mengubah kode di komputer.

#### 1. Unggah Kode ke GitHub (Gudang Kode Aman)
1. Buat akun gratis di **[GitHub](https://github.com/)** jika belum ada.
2. Buat repositori baru dengan memilih tombol **New** (Baru). Beri nama misal: `finance-tracker-pro`, atur akses ke **Private** (agar rahasia), lalu klik **Create repository**.
3. Unduh dan gunakan aplikasi gratis **[GitHub Desktop](https://desktop.github.com/)** (sangat ramah pemula) untuk memasukkan folder kode Anda ke repositori GitHub tersebut.

#### 2. Sambungkan ke Vercel (Hosting Instan & Cepat)
1. Buka situs **[Vercel](https://vercel.com/)** dan daftar (Sign Up) menggunakan akun **GitHub** Anda.
2. Di halaman utama Vercel, pilih tombol **Add New...** di sebelah kanan atas > pilih **Project**.
3. Anda akan melihat nama repositori `finance-tracker-pro` yang baru dibuat di GitHub. Pilih **Import**.
4. Biarkan semua pengaturan tetap seperti bawaan, lalu pilih tombol **Deploy** di bagian bawah.
5. Vercel akan otomatis menyusun website Anda dalam waktu singkat. Selesai! Anda akan mendapatkan tautan website permanen berakhiran `.vercel.app`.

---

## 📱 BAGIAN 3: MENJADIKAN APLIKASI WEB TAMPIL SEPERTI APLIKASI HP

Agar Anda dan pengguna lainnya bisa memantau keuangan harian dengan nyaman seolah menggunakan aplikasi bawaan smartphone (tanpa bilah pencarian browser di bagian atas), lakukan langkah mudah ini:

### 🤖 Untuk Pengguna Android (Google Chrome)
1. Buka peramban **Google Chrome** di ponsel Android Anda.
2. Ketik dan masuk ke tautan website hasil deploy Anda (misal: `https://finance-tracker-pro.vercel.app`).
3. Ketuk tanda **tiga titik vertikal** di sudut kanan atas layar Chrome.
4. Pilih opsi **Tambahkan ke Layar Utama** (atau **Add to Home screen**).
5. Beri nama aplikasi Anda, misal: `Finance Tracker`, lalu klik **Tambahkan**.
6. Ikon aplikasi akan otomatis tampil di halaman aplikasi ponsel Anda dengan mulus!

### 🍏 Untuk Pengguna iPhone / iPad (Safari)
1. Buka peramban **Safari** bawaan iPhone Anda.
2. Akses tautan website hasil deploy Anda.
3. Ketuk ikon **Bagikan** (Share button - gambar kotak beranak panah ke atas) di bagian bawah layar.
4. Gulir sedikit ke bawah dan ketuk pilihan **Tambahkan ke Layar Utama** (atau **Add to Home Screen**).
5. Ketuk **Tambah** di pojok kanan atas layar.
6. Aplikasi akan langsung bertengger di layar beranda ponsel Anda dengan logo ikon yang estetik!

---

## 📊 BAGIAN 4: PANDUAN INTEGRASI DATABASE GOOGLE SHEETS

Untuk memastikan data transaksi keuangan Anda tidak hilang bila berganti perangkat, hubungkan aplikasi web Anda ke Google Spreadsheet Anda sendiri dengan panduan Apps Script berikut:

### 1. Daftar Sheet yang Akan Dibuat Otomatis
Apps Script di bawah ini akan secara otomatis membuat dan menyegarkan sheet berikut di spreadsheet Anda saat sinkronisasi pertama kali dijalankan:
1. **TRANSAKSI** — Menyimpan seluruh riwayat pengeluaran, pemasukan, tabungan, investasi, dan jual aset.
2. **DOMPET** — Menyimpan sisa saldo terbaru dari setiap akun nominal Anda.
3. **TABUNGAN** — Menyimpan target tabungan impian Anda berserta saldonya.
4. **DANA_DARURAT** — Konfigurasi target pengeluaran bulanan dan kesiapan dana darurat.
5. **INVESTASI** — Menyimpan kepemilikan aset (emas, crypto, saham) beserta nilainya.
6. **ANGGARAN** — Menyimpan batasan anggaran bulanan per kategori transaksi.

### 2. Membuat Spreadsheet dan Membuka Apps Script
1. Pergi ke halaman [Google Sheets](https://sheets.google.com/) lalu buat sebuah spreadsheet baru (tekan tombol **+ / Kosong**).
2. Berikan nama spreadsheet Anda sesuai selera, contoh: `Database Keuangan - Finance Tracker Pro`.
3. Pada halaman spreadsheet, klik menu **Ekstensi** > pilih **Apps Script** di bagian atas halaman.
4. Hapus seluruh baris kode default yang ada di dalam editor halaman editor Apps Script tersebut (`function myFunction() { ... }`).

### 3. Salin & Tempel Kode Apps Script Berikut
Salin dan tempelkan seluruh kode JavaScript di bawah ini ke dalam halaman editor Apps Script Anda:

```javascript
/**
 * Apps Script API Gateway untuk Finance Tracker Pro
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

### 4. Men-Deploy Apps Script sebagai Web App
1. Klik logo disket (**Simpan Proyek**) di bagian atas halaman editor Apps Script.
2. Klik tombol **Terapkan (Deploy)** di samping kanan atas halaman > pilih **Penerapan Baru (New Deployment)**.
3. Pada halaman penerapan baru:
   * Klik ikon gerigi (**Jenis Penerapan**) > pilih **Aplikasi Web (Web App)**.
   * Pada kolom deskripsi, tulis: `Finance API v1`.
   * Pada kolom **Grup Aplikasi Sebagai (Execute as)**, pilih: **Saya (Email Anda)**.
   * Pada kolom **Siapa yang memiliki akses (Who has access)**, pilih: **Siapa saja (Anyone)**. *(Bagian ini krusial agar aplikasi Anda dapat mengirimkan data ke sheet)*.
4. Klik tombol **Terapkan (Deploy)**.
5. Google akan meminta otorisasi akun. Klik **Beri Akses / Authorize Access**, lalu pilih akun Google Anda. Jika muncul peringatan *"Google has not verified this app"*, klik **Advanced** (Lanjutan) di kiri bawah, lalu pilih **Go to Untitled Project (unsafe)**. Hal ini 100% aman karena Anda adalah pemilik kode skrip ini secara mandiri.
6. Salin tautan **URL Aplikasi Web (Web App URL)** yang ditampilkan layar. URL akan berakhiran `/exec`.

### 5. Menghubungkan Aplikasi Web Dengan Spreadsheet
1. Buka aplikasi **Finance Tracker Pro** hasil deploy Anda.
2. Masuk ke halaman **Settings** (Pengaturan), dengan mengetuk ikon gerigi.
3. Temukan kolom **URL Google Apps Script**.
4. Tempelkan tautan URL `/exec` yang sudah Anda salin sebelumnya.
5. Klik **Simpan Pengaturan**.
6. Sekarang, uji koneksi dengan menekan tombol **Sinkronisasi ke Spreadsheet**. Seluruh tab sheet akan terbuat secara ajaib dan terisi data-data keuangan Anda secara real-time!

---

## 🔒 KEUNGGULAN UTAMA (offline-first & Kedaulatan Data)
* **Kedaulatan Data**: Semua catatan keuangan Anda tersimpan aman secara lokal di browser dan di Google Sheets milik Anda sendiri. Tidak ada server pihak ketiga yang mengintip, menjual, atau melacak rincian kekayaan Anda.
* **Bekerja Offline**: Meskipun Anda sedang tidak tersambung dengan koneksi internet (seperti di penerbangan atau daerah terpencil), Anda tetap dapat mencatat keuangan dengan lancar. Data Anda akan terakumulasi aman dan siap disinkronkan kembali saat Anda mendapatkan akses internet!

Selesai! Nikmati kebebasan finansial dan mulailah bersenang-senang mengelola kekayaan Anda secara lebih produktif dengan **Finance Tracker Pro**! 🌟
