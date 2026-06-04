# 📱 Panduan Mandiri: Sinkronisasi Google Sheets Lewat HP / Laptop (Untuk Pembeli)

Selamat! Anda telah menginstal aplikasi **Finance Tracker Pro**. Untuk membuat data Anda tidak hilang dan aman selamanya di penyimpanan Cloud pribadi milik Anda sendiri, Anda perlu menghubungkan aplikasi ini dengan **Google Spreadsheet Anda**.

Jangan khawatir! Proses ini sangat mudah, gratis selamanya, 100% aman (kami tidak menyimpan data Anda), dan hanya perlu dilakukan **satu kali saja**.

---

## 💻 Cara Terbaik: Melalui Laptop / Komputer (Hanya 3 Menit)
Jika Anda memiliki Akses ke Laptop/PC, ini adalah cara termudah:

1. **Buat Spreadsheet Baru:**
   * Buka browser dan kunjungi [Google Sheets](https://sheets.google.com).
   * Buat spreadsheet baru berupa lembaran kosong dengan mengklik tombol **+ (Kosong)**. Give it a name like `Database Keu-ku`.
2. **Buka Menu Apps Script:**
   * Di dalam spreadsheet Anda, klik menu **Ekstensi** (Extensions) di bagian menu atas > klik **Apps Script**.
   * Hapus seluruh kode kosong bawaan (`function myFunction() { ... }`).
3. **Salin & Tempel Kode:**
   * Salin kode Apps Script yang dibekalkan oleh kami (bisa temukan di file `PENGATURAN_SCRIPT.txt` atau di dalam panduan aplikasi).
   * Paste-kan seluruh kode skrip tersebut ke workspace kosong Apps Script.
   * Klik ikon **Simpan (Disket)** di menu atas.
4. **Deploy / Luncurkan:**
   * Klik tombol **Terapkan (Deploy)** di pojok kanan atas > Pilih **Penerapan Baru (New Deployment)**.
   * Klik ikon **Gerigi** di pojok kiri atas jendela tersebut, pilih **Aplikasi Web (Web App)**.
   * Atur opsi konfigurasi berikut:
     * **Execute as (Jalankan sebagai):** Pilih **Saya (Email Anda)**.
     * **Who has access (Siapa yang memiliki akses):** Pilih **Siapa Saja (Anyone)**. *(Catatan: Ini aman, hanya aplikasi milik Anda yang tahu link rahasianya)*.
   * Klik **Terapkan (Deploy)**.
5. **Otorisasi Keamanan:**
   * Klik **Beri Akses (Authorize Access)**, pilih akun Google Anda.
   * Jika muncul peringatan *"Google hasn't verified this app"*, ketuk tombol **Advanced / Lanjutan** di pojok kiri bawah, lalu klik **Go to Untitled Project (unsafe)**. Ini aman karena Anda menggunakan kode Anda sendiri.
6. **Hubungkan ke Aplikasi:**
   * Salin tautan **URL Aplikasi Web** yang diakhiri kata `/exec`.
   * Kirim link tersebut ke HP Anda (bisa lewat WhatsApp, Email, dsb.).
   * Buka aplikasi **Finance Tracker Pro** di HP Anda, masuk ke **Settings (Pengaturan)**, paste-kan link tersebut ke kolom **URL Google Apps Script**, lalu klik **Simpan** dan ketuk **Sync Sekarang**! Selesai!

---

## 📱 Cara Alternatif: 100% Lewat HP (Tanpa Laptop!)
Jika Anda tidak memiliki komputer, Anda tetap bisa menyiapkannya di HP dengan trik berikut:

### Alat yang Perlu Anda Siapkan di HP:
1. Browser **Google Chrome** atau **Safari** (Pastikan sudah terpasang).
2. Kode Apps Script siap salin (kami berikan).

### Langkah-langkah Detail Lewat HP:

#### Langkah 1: Buka Google Sheets Mode Desktop
1. Buka browser **Google Chrome** di HP Anda.
2. Ketik alamat: [sheets.google.com](https://sheets.google.com).
3. **Penting!** Aktifkan mode desktop di browser HP Anda:
   * **Di Android (Chrome):** Ketuk **titik tiga** di kanan atas, ceklis pilihan **"Situs Desktop" (Desktop site)**.
   * **Di iPhone (Safari):** Ketuk ikon **"aA"** di pojok kiri bawah address bar, pilih **"Minta Situs Web Desktop" (Request Desktop Website)**.
4. Buat spreadsheet kosong baru dengan mengetuk ikon **+ (Kosong)**.

#### Langkah 2: Membuka Apps Script di HP
1. Setelah Spreadsheet Desktop terbuka di layar kecil HP Anda, zoom-in ke menu bar paling atas.
2. Ketuk menu **Ekstensi** (Extensions) > pilih **Apps Script**. Tab baru editor Apps Script akan terbuka.
3. Hapuskan kode bawaan yang sudah ada di kotak putih penulisan dengan menyeleksi semua dan tekan tombol hapus di keyboard HP Anda.

#### Langkah 3: Salin Tempel Kode
1. Salin kode Apps Script yang kami sediakan untuk Anda.
2. Ketuk di dalam editor kode Apps Script di HP Anda, pilih tempel/paste.
3. Zoom-in halaman ke atas, klik ikon **Simpan (Disket)** yang terletak di bar menu atas.

#### Langkah 4: Publikasikan (Deploy) Web App di HP
1. Zoom-in ke pojok kanan atas layar Apps Script, ketuk tombol **Terapkan (Deploy)** > klik **Penerapan Baru (New Deployment)**.
2. Jika diminta memilih tipe, ketuk ikon **Gerigi** di kiri atas, lalu pilih **Aplikasi Web (Web App)**.
3. Atur opsi di HP Anda:
   * **Jalankan sebagai (Execute as):** Pilih **Saya** (email Anda sendiri).
   * **Siapa yang memiliki akses (Who has access):** Pilih **Siapa saja (Anyone)**.
4. Ketuk tombol **Terapkan (Deploy)** di pojok kanan bawah.
5. Ketuk tombol biru **Beri Akses (Authorize Access)** yang muncul. Pilih akun Gmail Anda.
6. Pada pop-up peringatan Google, ketuk teks kecil **Advanced / Lanjutan** di pojok kiri bawah, lalu ketuk teks **Go to Untitled Project (unsafe)** di bagian paling bawah.
7. Izinkan otorisasi dengan mengetuk **Allow / Izinkan**.

#### Langkah 5: Salin URL dan Hubungkan
1. Di layar berikutnya, Anda akan melihat teks **URL Aplikasi Web**.
2. Ketuk tombol **Salin / Copy** di samping URL tersebut (URL yang berakhiran `/exec`).
3. Buka aplikasi **Finance Tracker Pro** di HP Anda.
4. Masuk ke halaman **Settings (Pengaturan)** dengan mengetuk ikon gerigi di bar bawah.
5. Tempelkan (Paste) URL tersebut ke kolom **URL Google Apps Script**.
6. Klik **Simpan Pengaturan**.
7. Sekarang, ketuk tombol hijau **Sync Sekarang**. Seluruh sheet database Anda akan terisi dan tersinkronisasi secara otomatis!

---

## 🌟 Kenapa Cara ini Lebih Bagus daripada Database Cloud Biasa?
* **100% Gratis Selamanya:** Anda tidak perlu berlangganan hosting server bulanan yang mahal.
* **Privasi Mutlak:** Keuangan adalah hal yang sangat pribadi. Dengan metode ini, tidak ada satu orang pun atau developer aplikasi yang bisa mengintip saldo, gaji, maupun pengeluaran Anda. Semua data tetap berada di ekosistem Google Anda pribadi.
* **Mudah Dipantau:** Anda bisa membuka Google Spreadsheet tersebut kapan saja untuk membuat rumus analisis tambahan, mencetak laporan pajak, maupun membagikannya ke pasangan Anda secara praktis!
