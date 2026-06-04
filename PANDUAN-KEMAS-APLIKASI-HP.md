# 📱 Panduan Mengemas Aplikasi HP (Android & iOS) dengan CapacitorJS

Buku panduan ini dirancang khusus untuk Anda selaku pemilik produk agar bisa mengemas **Finance Tracker Pro** menjadi aplikasi **Native HP (.apk untuk Android dan .ipa untuk iOS)** secara mandiri dan profesional menggunakan teknologi **CapacitorJS**.

Dengan CapacitorJS, aplikasi web berbasis React ini akan dibungkus ke dalam *Web View Container* berkecepatan tinggi yang berjalan langsung di sistem operasi ponsel, sehingga tampil dan terasa seperti aplikasi HP bawaan App Store / Play Store.

---

## 🛠️ Persyaratan Utama (Prerequisites)

Sebelum mulai menjalankan perintah pengemasan, pastikan laptop/komputer Anda telah terpasang software pendukung berikut:

1. **Node.js** (Versi LTS terbaru) – Untuk menjalankan baris perintah NPM.
2. **Android Studio** (Jika ingin membuat file Android `.apk`) – Lengkap dengan Android SDK terbaru.
3. **Xcode** (Hanya jika Anda menggunakan Mac & ingin membuat file iOS `.ipa`) – Tersedia di Mac App Store.

---

## 🚀 Alur Kerja Pengemasan Instan

Seluruh konfigurasi inti CapacitorJS (`capacitor.config.ts`) dan plugin-plugin pendukung telah kami siapkan di dalam folder utama proyek ini. Anda hanya perlu menjalankan langkah-langkah di bawah ini di Terminal/Command Prompt komputer Anda.

### Langkah 1: Bangun File Produksi Web (Build Web Assets)
Sebelum dibungkus ke aplikasi HP, kode mentah React harus disatukan menjadi folder siap pasang bernama `dist`:
```bash
npm run build
```
*(Perintah ini akan membuat folder baru bernama `dist` di komputer Anda).*

### Langkah 2: Tambahkan Platform Android / iOS
Pilih platform mana yang ingin Anda buat projeknya:

* **Untuk Android:**
  ```bash
  npm run cap:add-android
  ```
* **Untuk iOS:** (memerlukan laptop Mac)
  ```bash
  npm run cap:add-ios
  ```
*(Perintah ini akan membuat folder baru `android/` atau `ios/` yang merupakan folder project native).*

### Langkah 3: Sinkronasikan Perubahan Kode (Sync Assets)
Setiap kali Anda mengubah kode React/halaman web Anda di komputer dan ingin melihat perubahannya di aplikasi HP, jalankan kombo perintah ini:
```bash
# 1. Bangun ulang aset web baru
npm run build

# 2. Kirim update ke folder Android / iOS
npm run cap:sync
```

---

## 📐 Membuka Proyek ke Android Studio atau Xcode

Setelah proses sinkronisasi selesai, Anda akan membuka project ini di editor native resmi untuk kompilasi akhir:

### 🤖 1. Mengompilasi Akhir Menjadi APK Android (via Android Studio)
Jalankan perintah ini di komputer Anda untuk membuka Android Studio secara otomatis:
```bash
npm run cap:open-android
```
**Di dalam Android Studio:**
1. Tunggu 1-2 menit hingga proses pendeteksian Gradle (*Gradle Sync*) di bar bawah selesai.
2. Untuk menguji di HP fisik / Emulator: Hubungkan HP Android asli via kabel USB (aktifkan USB Debugging), pilih ikon **Running Device** (Segitiga Hijau) di atas, lalu tekan **Run**.
3. **Untuk memproduksi file instalasi (.apk):**
   * Klik menu **Build** di bar atas.
   * Pilih **Build Bundle(s) / APK(s)** > klik **Build APK(s)**.
   * Setelah selesai, klik teks pop-up **Locate** di pojok kanan bawah. Folder penyimpanan akan terbuka dan Anda akan menemukan berkas file bernama **`app-debug.apk`** yang siap dipasang ke HP pembeli mana saja!
4. **Untuk rilis komersial resmi ke Google Play Store:**
   * Pilih menu **Build** > **Generate Signed Bundle / APK**.
   * Ikuti panduan pembuatan kunci kredensial (*Keystore*) aman, lalu pilih rilis jenis *Release*.

---

### 🍏 2. Mengompilasi Akhir Menjadi iOS App (via Xcode)
Jalankan perintah ini di komputer Mac Anda untuk membuka Xcode secara otomatis:
```bash
npm run cap:open-ios
```
**Di dalam Xcode:**
1. Di bilah navigasi kiri, pilih proyek paling atas berlabel `App`.
2. Masuk ke tab **Signing & Capabilities**.
3. Aktifkan centang **Automatically manage signing**, dan pilih **Team** Anda (Akun Developer Apple).
4. Ubah nama identitas aplikasi ke domain Anda sendiri jika diperlukan (*Bundle Identifier*).
5. Hubungkan iPhone asli Anda via kabel, pilih nama perangkat Anda di bagian atas, lalu klik tombol **Play (Build & Run)**.
6. **Untuk memproduksi file distribusi (.ipa):**
   * Pilih opsi menu **Product** > klik **Archive**.
   * Klik **Distribute App** di panel Archive Utility untuk mendaftarkannya ke TestFlight atau mengekspornya ke format `.ipa`.

---

## 💡 Strategi Monetisasi & Bundling Penjualan Anda

Karena Anda berencana menjual aplikasi ini dengan format **Aplikasi HP Premium langsung ke pembeli (Plus Panduan Google Sheets)**, berikut adalah beberapa tips jitu untuk mematok nilai jual premium:

1. **Jual paket "Self-Persistency Bundle":**
   * Berikan pembeli **File APK jadi** (untuk Android) beserta **Buku panduan integrasi spreadsheet** (Anda bisa menggunakan teks dari `README.md` bagian Google Sheets sync sebagai isinya).
   * **Mengapa ini bernilai mahal?** Pembeli menyukai kepemilikan data penuh (*data sovereignty*). Tidak menggunakan cloud berbayar (seperti Supabase) membuat pembeli 100% merasa datanya tersimpan aman di Google Drive pribadi mereka secara mandiri, tanpa batas kuota!
2. **Tawarkan Jasa Tambahan (Upselling Customization):**
   * Anda bisa mematok harga dasar (misal: Rp 100.000 - Rp 250.000) untuk paket aplikasi + README.
   * Tawarkan jasa **"Setup Google Sheet Beres"** seharga Rp 50.000 - Rp 100.000 tambahan, di mana Anda yang membantu mengerahkan link Apps Script mereka dalam 5 menit.
3. **Integrasikan Logo Custom:**
   * Sebelum melakukan `npm run build`, ganti file logo ikon di `src/assets/` atau rancang ikon khusus di dalam Android Studio pada menu **File** > **New** > **Image Asset** untuk memberi sentuhan personalisasi maksimal sesuai nama pemesan.

Selamat memonetisasi dan mendistribusikan karya keuangan super premium Anda! 🚀💵
