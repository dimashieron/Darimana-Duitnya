# 💸 Darimana Duitnya - Pencatat Keuangan Pribadi Modern (Offline-First)

**Darimana Duitnya** adalah aplikasi pencatat keuangan pribadi modern berbasis web (Web App) yang cepat, aman, estetik, dan dioptimalkan secara mendalam untuk kenyamanan pengguna seluler (*mobile-first design*). 

Aplikasi ini dibangun dengan paradigma **Offline-First**, di mana seluruh data transaksi, anggaran, tabungan, dan portofolio keuangan Anda disimpan 100% secara lokal di dalam browser Anda (*LocalStorage*). Tidak ada data Anda yang dikirim ke server pihak ketiga, bebas iklan, dan sepenuhnya independen. Untuk menjamin keamanan data dalam jangka panjang, aplikasi ini menyediakan fitur cadangan (**Backup & Restore**) menggunakan berkas standar industri terbuka yaitu **JSON**.

---

## 🌟 PENJELASAN FITUR UTAMA APLIKASI

Aplikasi **Darimana Duitnya** dilengkapi dengan berbagai modul keuangan komprehensif yang dirancang untuk membantu Anda memantau arus kas dengan sangat presisi:

1. **Dashboard Interaktif & Ringkas**:
   - Menampilkan ringkasan total saldo bersih Anda secara real-time.
   - Ringkasan arus kas masuk (*pemasukan*) dan kas keluar (*pengeluaran*) harian serta bulanan.
   - Grafik interaktif alokasi pengeluaran per kategori guna mempermudah analisis visual.
   - Daftar transaksi terbaru yang diurutkan secara kronologis dengan akses cepat.

2. **Kategori Transaksi yang Lengkap & Kustom**:
   - **Pemasukan**: Mendukung kategori default seperti *Gaji*, *Bonus*, *Freelance*, *Side Hustle*, *Dagang*, *Hibah / Hadiah*, serta kustomisasi tak terbatas.
   - **Pengeluaran**: Dilengkapi dengan visual ikon dan warna unik untuk kategori:
     - *Makanan* 🍔
     - *Transportasi* 🚗
     - *Tagihan* 🧾
     - *Belanja* 🛍️
     - *Kesehatan* 🏥
     - *Hiburan* 🎮 (Baru)
     - *Sedekah* 💖 (Baru)
     - *Pendidikan* 🎓 (Baru)
     - *Cicilan* 💳 (Baru)
     - *Hutang* 🪙 (Baru)
     - *Lainnya* ❓
   - Anda juga dapat menambahkan kategori pengeluaran baru sesuai gaya hidup Anda secara dinamis.

3. **Manajemen Aset & Investasi**:
   - Lacak kepemilikan aset berharga Anda seperti emas batangan, saham, reksadana, mata uang kripto (*crypto*), atau saldo tabungan jangka panjang lainnya.
   - Lengkap dengan kalkulator kepemilikan, nominal nilai investasi, dan perubahan persentase harian untuk memantau performa pertumbuhan aset Anda.

4. **Rencana Tabungan Impian (Saving Goals)**:
   - Buat rencana tabungan untuk tujuan spesifik (seperti membeli gadget baru, dana liburan, atau dana pernikahan).
   - Dilengkapi dengan batas target tanggal, bar progres visual yang dinamis, serta kalkulator persentase pencapaian terkini.

5. **Analisis Kesiapan Dana Darurat (Emergency Fund)**:
   - Kalkulator dana darurat otomatis yang mengukur kesiapan keuangan Anda menghadapi situasi krisis (misal: kehilangan pekerjaan atau tagihan medis mendadak).
   - Menghitung kecukupan dana berdasarkan rata-rata pengeluaran bulanan Anda (default target ideal 6 bulan pengeluaran).

6. **Perencana Anggaran Bulanan (Budgeting per Kategori)**:
   - Batasi pengeluaran untuk setiap kategori (misalnya membatasi kategori *Belanja* atau *Hiburan*) agar Anda tidak mengalami pengeluaran berlebih (*overspending*).
   - Menyediakan indikator visual progres meter dari sisa anggaran yang aman untuk dibelanjakan.

7. **PWA (Progressive Web App)**:
   - Aplikasi dapat dipasang (*install*) langsung ke layar beranda HP Anda dalam sekejap tanpa perlu memakan penyimpanan memori untuk unduhan toko aplikasi.
   - Berjalan dalam mode layar penuh (full-screen) yang mulus layaknya aplikasi bawaan ponsel.

8. **Dukungan Mobile Native (Capacitor ready)**:
   - Arsitektur kode terstruktur rapi dan siap dikompilasi menjadi paket aplikasi native Android (`.apk` / `.aab`) atau iOS (`.ipa`) menggunakan Capacitor.

9. **Sistem Lisensi & Aktivasi Luring (Offline Activation)**:
   - Membatasi pencatatan maksimal **10 transaksi** pada mode belum diaktivasi untuk memelihara performa data luring.
   - Akses tak terbatas (*unlimited*) selamanya dapat dibuka secara instan di perangkat dengan memasukkan kode lisensi gratis seperti **BEBASBONCOS** atau **OFFLINEPRO** langsung di menu pengaturan atau lewat jendela peringatan batas transaksi.

---

## 🗄️ PANDUAN CADANGAN DATA (BACKUP & RESTORE JSON)

Karena data Anda sepenuhnya bersifat privat dan tersimpan secara lokal di perangkat, membersihkan riwayat browser atau melakukan *reset* perangkat berisiko menghapus data Anda. Oleh karena itu, Anda sangat disarankan untuk melakukan ekspor cadangan secara berkala menggunakan format **JSON**.

### Mengapa Menggunakan File JSON?
- **100% Keamanan**: Data Anda tersimpan dalam bentuk file teks terenkripsi ringan yang hanya berada di penyimpanan fisik komputer atau HP Anda sendiri.
- **Portabilitas Tinggi**: Anda dapat dengan mudah memindahkan file cadangan ini ke perangkat lain (misal dari laptop ke HP, atau sebaliknya).
- **Kebebasan Data**: Format JSON adalah format standar terbuka, artinya data Anda tidak dikunci oleh sistem dan dapat dibaca oleh program spreadsheet/text editor lainnya kapan saja.

### Cara Melakukan Backup (Ekspor Data)
1. Buka aplikasi **Darimana Duitnya** di browser Anda.
2. Navigasikan ke tab **Settings** (Pengaturan, ikon roda gigi ⚙️).
3. Cari bagian **Kelola Data & Pemeliharaan**.
4. Klik tombol **Ekspor Data (JSON)** berwarna hijau.
5. Browser Anda akan mengunduh sebuah berkas secara otomatis dengan format nama:  
   `finance-tracker-pro-backup-YYYY-MM-DD.json`
6. Simpan file ini dengan aman di folder pribadi Anda, Google Drive, atau kirimkan ke diri Anda sendiri melalui chat/email untuk pencadangan eksternal.

### Cara Memulihkan Data (Impor Data)
1. Pergi ke tab **Settings** di perangkat atau browser baru yang ingin Anda gunakan.
2. Di bagian **Kelola Data & Pemeliharaan**, ketuk tombol **Impor Data (JSON)** yang berwarna indigo.
3. Jendela pemilihan file akan terbuka. Pilih berkas `.json` cadangan yang sudah Anda unduh sebelumnya.
4. Aplikasi akan membaca, memvalidasi integritas data, dan memulihkan seluruh riwayat transaksi Anda secara instan.
5. Muncul notifikasi sukses: *"Sukses memulihkan data! Berhasil mengimpor X transaksi."*

### Fitur Tambahan: Pemeliharaan & Hitung Ulang Saldo
Terkadang, jika Anda melakukan impor data lama atau memodifikasi daftar riwayat, akumulasi nominal saldo dompet Anda mungkin terlihat sedikit tidak selaras. 
- Anda cukup mengeklik tombol **Hitung Ulang Saldo** pada halaman pengaturan.
- Aplikasi akan menjalankan algoritma kalkulasi runut sequential untuk menyelaraskan kembali semua saldo dompet, dana darurat, anggaran, dan tabungan Anda berdasarkan riwayat transaksi aktual secara otomatis.

---

## 🚀 CARA PENJALANAN LOKAL (DEVELOPMENT)

Bagi Anda yang ingin menguji atau memodifikasi kode program aplikasi ini di komputer lokal:

### Prasyarat
- Komputer Anda telah terinstal **Node.js** (Versi 18+ sangat direkomendasikan).

### Langkah Pengoperasian
1. **Unduh atau Clone Repositori**:
   ```bash
   git clone https://github.com/username/darimana-duitnya.git
   cd darimana-duitnya
   ```
2. **Instal Seluruh Dependensi**:
   ```bash
   npm install
   ```
3. **Jalankan Server Lokal**:
   ```bash
   npm run dev
   ```
4. **Buka Browser**:
   Akses situs lokal di alamat `http://localhost:3000`.

---

## 🗺️ PANDUAN DEPLOYMENT (MEMPUBLIKASIKAN KE INTERNET SECARA GRATIS)

Mempublikasikan aplikasi full-stack (frontend React + backend Express) ini sangatlah mudah dan gratis. Berikut adalah platform terbaik yang direkomendasikan:

### CARA 1: Deploy Gratisan Full-Stack dengan Render (SANGAT DIREKOMENDASIKAN)
**Render** sangat cocok untuk aplikasi ini karena mendukung server Express.js + React secara utuh dengan gratis (Free Tier).

1. Unggah kode proyek Anda ke repositori pribadi (**Private Repository**) di **[GitHub](https://github.com/)** demi menjaga kerahasiaan.
2. Buat akun gratis di **[Render](https://render.com/)** dan hubungkan akun GitHub Anda.
3. Di dashboard Render, klik tombol **New +** dan pilih **Web Service**.
4. Hubungkan repositori GitHub Anda yang berisi kode aplikasi ini.
5. Isi konfigurasi berikut:
   - **Name**: `darimana-duitnya` (atau sesuai keinginan)
   - **Environment / Runtime**: `Node`
   - **Region**: Pilih lokasi terdekat (misal: `Singapore` untuk Indonesia)
   - **Branch**: `main`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
6. Gulir ke bawah, pilih opsi **Free Instance Type**, lalu klik **Create Web Service**.
7. Selesai! Render akan membangun (build) frontend dan backend secara otomatis. Setelah selesai, Anda akan mendapatkan URL web gratis berakhiran `.onrender.com`.

### CARA 2: Deploy Full-Stack dengan Railway (Alternatif Sangat Cepat & Handal)
**Railway** mendeteksi struktur Node.js secara otomatis dan langsung menjalankan build dengan luar biasa cepat.

1. Unggah kode proyek Anda ke **GitHub**.
2. Buat akun di **[Railway](https://railway.app/)** menggunakan akun GitHub Anda.
3. Klik **New Project** > **Deploy from GitHub repo**, lalu pilih repositori proyek ini.
4. Railway akan mendeteksi file `package.json` secara otomatis, mengompilasi kode, dan menjalankan server Express pada port yang sesuai.
5. Buka tab **Settings** pada dashboard Railway Anda, lalu pada bagian **Environment**, buat domain gratis (klik **Generate Domain**).
6. Aplikasi Anda siap diakses lengkap dengan backend aktif!

### CARA 3: Alternatif Frontend Saja (Tanpa Backend) via Vercel / Netlify
Jika Anda hanya mempublikasikan versi client-side (aplikasi web luring tanpa validasi server):
- **Vercel**: Hubungkan GitHub, pilih default Vite, lalu klik **Deploy**.
- **Netlify Drop**: Jalankan `npm run build` secara lokal, lalu seret folder `dist` ke halaman **[Netlify Drop](https://app.netlify.com/drop)**.
*(Catatan: Mode frontend-only tidak akan bisa melakukan panggilan API `/api/activate` ke server).*

---

## 📱 CARA MEMASANG APLIKASI DI LAYAR HP (PWA)

Hilangkan bilah alamat URL peramban untuk merasakan sensasi menggunakan aplikasi mobile yang sesungguhnya:

### 🤖 Pengguna Android (Google Chrome)
1. Buka **Google Chrome** di HP Anda dan kunjungi situs web aplikasi Anda.
2. Ketuk ikon **tiga titik** di pojok kanan atas layar.
3. Pilih opsi **Tambahkan ke Layar Utama** (atau **Add to Home screen**).
4. Klik **Tambahkan**. Ikon estetik aplikasi akan segera bertengger di menu utama ponsel Anda!

### 🍏 Pengguna iPhone & iPad (Safari)
1. Buka peramban **Safari** di perangkat iOS Anda dan kunjungi alamat web aplikasi Anda.
2. Ketuk tombol **Bagikan / Share** (ikon kotak dengan panah mengarah ke atas) di bagian bawah layar.
3. Geser menu ke bawah lalu pilih **Tambahkan ke Layar Utama** (atau **Add to Home Screen**).
4. Klik **Tambah** di pojok kanan atas. Aplikasi Anda siap dijalankan kapan saja langsung dari beranda!

---

Selamat mengelola anggaran keuangan Anda seutuhnya dan nikmati privasi finansial terbaik bersama **Darimana Duitnya**! 💸🌟
