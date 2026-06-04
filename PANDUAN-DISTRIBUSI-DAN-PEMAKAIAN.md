# 📘 Panduan Lengkap Distribusi & Panduan Penggunaan Finance Tracker Pro

Dokumen ini ditulis khusus untuk Anda selaku pemilik produk sebagai **buku panduan resmi & siap pakai** yang bisa Anda jadikan bonus penjualan maupun panduan internal Anda. Dokumen ini terbagi menjadi 3 bagian utama:

1. **Bagian 1: Panduan Kompilasi Menjadi Berkas `.apk` (Android) & `.ipa` (iOS)**.
2. **Bagian 2: Panduan Instalasi di HP Pembeli (Perbedaan Android dan iOS secara mendetail)**.
3. **Bagian 3: Panduan Lengkap Cara Penggunaan Aplikasi untuk Pengguna Akhir (Buku Manual)**.

---

## 🏗️ Bagian 1: Cara Kompilasi Menjadi Berkas (.apk & .ipa)

Sebagai developer/pemilik aplikasi, Anda perlu memproduksi file instalasi mentah sebelum bisa dikirim ke pelanggan. Ikuti langkah teknis ini dengan teliti.

### 🤖 1. Memproduksi file `.apk` (Android)
File `.apk` adalah file instalasi yang sangat fleksibel dan dapat dikirim langsung ke pembeli lewat WhatsApp, Google Drive, email, atau Telegram.

1. **Bersihkan & Bangun Web Aset Terbaru:**
   Di terminal proyek Anda, jalankan perintah ini untuk membersihkan sisa build lama dan membangun ulang versi terbaru:
   ```bash
   npm run build
   ```
2. **Sinkronkan dengan Capacitor:**
   Terapkan perubahan visual dan fungsional terbaru dari React ke folder pembungkus native Android:
   ```bash
   npm run cap:sync
   ```
3. **Buka di Android Studio:**
   Jalankan perintah ini untuk membuka project di program Android Studio secara otomatis:
   ```bash
   npm run cap:open-android
   ```
4. **Kompilasi Menjadi APK Jadi (Debug/Ad-Hoc):**
   * Di bar atas Android Studio, klik menu **Build**.
   * Pilih **Build Bundle(s) / APK(s)** > klik **Build APK(s)**.
   * Tunggu beberapa menit hingga proses kompilasi selesai.
   * Di pojok kanan bawah, akan muncul notifikasi pop-up bertuliskan *"Build APK(s): APK(s) generated successfully"*. Klik teks biru **Locate** di pop-up tersebut.
   * Folder penyimpanan akan terbuka otomatis, dan Anda akan menemukan berkas bernama **`app-debug.apk`**. Ganti nama berkas ini (rename) menjadi **`FinanceTrackerPro.apk`**. Berkas ini siap dikirim ke pembeli Anda!
5. **Kompilasi Menjadi File Rilis Google Play Store (AAB):**
   * Jika ingin merilis ke Play Store secara komersial, pilih **Build** > **Generate Signed Bundle / APK**.
   * Pilih **Android App Bundle (AAB)** (format wajib Play Store terbaru) > buat kunci pengaman (*Keystore* baru) > pilih varian **Release** > klik **Finish**.

---

### 🍏 2. Memproduksi file `.ipa` (iOS)
iOS memiliki proteksi keamanan yang sangat kuat, sehingga Anda tidak boleh menginstal file `.ipa` sembarangan seperti di Android. Anda membutuhkan **Laptop Mac** dan **Apple Developer Account** (baik yang berbayar $99/tahun untuk publikasi resmi, maupun gratis untuk instalasi mandiri terbatas).

1. **Pastikan Aset Web Tersinkronisasi:**
   Jalankan perintah sinkronisasi di terminal Mac Anda:
   ```bash
   npm run build
   npm run cap:sync
   ```
2. **Buka di Xcode:**
   Buka proyek native iOS di Xcode dengan perintah:
   ```bash
   npm run cap:open-ios
   ```
3. **Konfigurasi Identitas Aplikasi (Signing):**
   * Pilih folder proyek paling atas berlabel `App` di sebelah kiri.
   * Masuk ke tab **Signing & Capabilities**.
   * Centang opsi **Automatically manage signing**.
   * Di kolom **Team**, hubungkan akun Apple ID (Developer) milik Anda.
4. **Membuat Arsip Kompiliasi:**
   * Di bilah menu paling atas Xcode, pastikan target perangkat diatur ke **Any iOS Device (arm64)** di sebelah nama produk.
   * Klik menu **Product** > pilih **Archive**.
   * Tunggu proses *archiving* selesai (biasanya memakan waktu 1-5 menit).
5. **Ekspor Menjadi Berkas `.ipa`:**
   * Setelah jendela arsip terbuka, klik tombol biru **Distribute App** di sisi kanan.
   * Pilih metode distribusi yang diinginkan:
     * **App Store Connect:** Jika ingin mengunggah ke TestFlight atau rilis publik.
     * **Ad-Hoc:** Jika ingin memproduksi file `.ipa` mentah untuk diuji pada daftar perangkat khusus (memerlukan UDID iPhone pembeli yang didaftarkan di portal Apple Developer).
     * **Development:** Untuk keperluan internal developer.
   * Ikuti wizard hingga Anda diarahkan untuk menyimpan file `.ipa` ke sebuah folder lokal di Mac Anda.

---

## 📲 Bagian 2: Panduan Cara Instalasi di HP Pembeli (Android vs iOS)

Setelah Anda berhasil memproduksi file `.apk` atau `.ipa`, berikan panduan instalasi di bawah ini kepada pembeli Anda berdasarkan jenis ponsel yang mereka gunakan.

---

### 🤖 CARA INSTALASI PADA PONSEL ANDROID (SANGAT MUDAH)

Menginstal aplikasi di Android di luar Play Store sangat mudah dan hanya membutuhkan satu pengaturan izin singkat.

#### Langkah-langkah untuk Pembeli:
1. **Unduh Berkas APK:**
   Unduh file **`FinanceTrackerPro.apk`** yang diberikan oleh penjual ke ponsel Android Anda.
2. **Buka File Manager / Berkas Unduhan:**
   Buka aplikasi File Manager di HP Anda, masuk ke folder **Downloads (Unduhan)**, lalu ketuk berkas `FinanceTrackerPro.apk`.
3. **Izinkan Penginstalan Sumber Tidak Dikenal (Unknown Sources):**
   * Jika ini pertama kalinya Anda menginstal aplikasi dari luar Play Store, Android akan memunculkan pop-up peringatan keamanan keamanan: *"Demi keamanan, ponsel Anda tidak diizinkan menginstal aplikasi tidak dikenal dari sumber ini."*
   * Jangan khawatir, ketuk tombol **Setelan (Settings)** pada pop-up tersebut.
   * Aktifkan tombol geser pada opsi **"Izinkan dari sumber ini" (Allow from this source)**.
4. **Pasang Aplikasi:**
   Kembali ke halaman instalasi, lalu ketuk tombol **Instal (Install)**.
5. **Abaikan Google Play Protect (Jika Muncul):**
   * Karena aplikasi ini dirakit secara mandiri dan eksklusif, Google Play Protect terkadang menampilkan peringatan berwarna kuning bahwa pengembang aplikasi tidak dikenal.
   * Cukup ketuk tombol **"Tetap Instal" (Install anyway)**.
6. **Buka Aplikasi:**
   Setelah proses selesai, aplikasi siap dibuka langsung di HP Anda!

---

### 🍏 CARA INSTALASI PADA PONSEL iOS / iPHONE (CUKUP KETAT)

Karena sistem iOS sangat menjaga keamanannya, pembeli tidak bisa langsung mengetuk berkas `.ipa` untuk dipasang. Berikan 3 pilihan jalur instalasi alternatif ini kepada pembeli Anda:

#### 🌟 Jalur A: Menggunakan Google TestFlight (Sangat Direkomendasikan & Resmi)
Ini adalah jalur terbaik, paling resmi, dan paling aman untuk pembeli Anda tanpa perlu melalui proses review App Store publik yang rumit.

1. **Persiapan Developer (Anda):**
   * Unggah file `.ipa` yang Anda hasilkan dari Xcode ke akun **Apple Developer Program** Anda di App Store Connect.
   * Daftarkan email pelanggan/pembeli Anda ke daftar **External Testers** di menu TestFlight.
2. **Langkah-langkah untuk Pembeli:**
   * Pembeli mengunduh aplikasi gratis bernama **TestFlight** resmi dari App Store di iPhone mereka.
   * Pembeli akan menerima email undangan resmi dari Apple berisi link test.
   * Cukup buka email tersebut lewat iPhone, ketuk tautan undangan, dan TestFlight akan otomatis menawarkan tombol **Instal** untuk aplikasi **Finance Tracker Pro** secara resmi, aman, dan tanpa iklan!

#### 🛠️ Jalur B: Menggunakan Layanan Distribusi Ad-Hoc (Diawi / InstallOnAir)
Cocok apabila Anda ingin menjual aplikasi secara eksklusif ke satu atau beberapa orang klien tanpa mendaftar ke App Store Connect.

1. **Dapatkan UDID Pembeli:**
   * Minta pembeli untuk mengunjungi situs gratis [udid.io](https://get.udid.io/) menggunakan Safari di iPhone mereka untuk mendapatkan kode identitas unik ponsel mereka (UDID).
2. **Hubungkan UDID di Portal Developer:**
   * Daftarkan nomor UDID pembeli tersebut ke dalam akun Apple Developer Anda di portal developer resmi.
   * Buat ulang berkas `.ipa` menggunakan profil Provisioning Profile yang mencakup UDID pembeli tersebut (Distribusi Ad-Hoc).
3. **Upload ke Layanan Pengiriman Instan:**
   * Upload file `.ipa` tersebut ke situs [Diawi](https://www.diawi.com/) atau [InstallOnAir](https://www.installonair.com/).
   * Situs tersebut akan menghasilkan link rahasia dan kode QR khusus.
4. **Instalasi oleh Pembeli:**
   * Pembeli cukup membuka link tersebut menggunakan browser **Safari** di iPhone mereka, lalu mengetuk tombol **Install**. Aplikasi akan meluncur dan siap dipakai di layar utama iPhone mereka secara instan!

#### 💻 Jalur C: Sideloading Mandiri lewat Komputer (Melalui AltStore / Sideloadly)
Jalur ini 100% Gratis untuk pembeli cerdas atau antusias yang tidak keberatan meluangkan sedikit waktu menggunakan laptop/komputer pribadi mereka.

1. **Langkah-langkah untuk Pembeli:**
   * Pasang software pembantu bernama **AltStore** (di PC Windows/Mac) atau gunakan **Sideloadly**. Hubungkan iPhone ke Laptop menggunakan kabel data USB.
   * Masukkan Apple ID pribadi Anda pada program AltStore/Sideloadly (tenang, data dikirim langsung ke server aman Apple untuk verifikasi signature sertifikasi developer gratis).
   * Drag-and-drop berkas `.ipa` yang dibekalkan penjual ke dalam aplikasi Sideloadly atau klik *Install* di AltStore.
   * Aplikasi akan terinstal langsung ke iPhone Anda.
   * **Beri Izin Developer Aman:** Buka menu **Settings (Pengaturan)** di iPhone &gt; **General (Umum)** &gt; **VPN & Device Management** &gt; Ketuk Apple ID Anda &gt; pilih **Trust (Percayai)**.
   * Aplikasi beres terpasang dan siap digunakan gratis! (Harus meluangkan waktu dicolokkan ke laptop 7 hari sekali untuk mereset masa berlaku lisensi gratis).

---

## 📖 Bagian 3: Panduan Penggunaan Aplikasi (Buku Manual Pengguna)

Selamat datang di panduan resmi penggunaan **Finance Tracker Pro**—aplikasi pencatat keuangan mandiri modern, interaktif, dan aman yang menempatkan kendali penuh atas keamanan data keuangan Anda di tangan Anda sendiri!

---

### 💵 Navigasi Halaman Utama (Navigasi Bar Bawah)

Aplikasi ini dibagi menjadi 5 modul navigasi intuitif di bar bagian bawah layar:

1. **Dashboard (Dasbor Utama):** Ringkasan arus keuangan sekilas, status mutasi kas, grafik trend pengeluaran, kategori populer, dan akses cepat form penulisan transaksi.
2. **History (Riwayat Lengkap):** Daftar histori catatan lama Anda yang dilengkapi dengan fitur edit, hapus, filter mutasi cerdas, export spreadsheet, dan pencarian cepat berbasis teks.
3. **Assets (Dompet/Kas):** Atur berbagai dompet digital (Gopay, OVO, ShopeePay), rekening bank (BCA, Mandiri, dll.), maupun uang tunai fisik. Dilengkapi status transfer antar kas!
4. **Report (Modul Laporan Finansial):** Terdiri dari 4 modul perencanaan matang:
   * **Anggaran (Budgeting):** Pantau batasan belanja per kategori.
   * **Target Tabungan (Saving Goals):** Kumpulkan dana impian Anda secara disiplin.
   * **Dana Darurat (Emergency Fund):** Hitung rasio kecukupan kesiapan finansial mendadak.
   * **Portofolio Investasi (Investments):** Pantau naik turunnya aset saham, Crypto, maupun emas Anda.
5. **Settings (Pengaturan & Sinkronisasi):** Ganti tema gelap/terang, backup data lokal, serta kelola sinkronisasi awan menggunakan **Google Spreadsheet**.

---

### 📝 Cara Mencatat Transaksi Baru

Melakukan pencatatan harian adalah fondator utama membangun kesehatan keuangan. Berikut langkah mencatat yang benar:

1. Ketuk tombol **`+ Catat`** yang melayang di dasbor utama, atau masuk ke tab Transaksi.
2. Pilih **Tipe Transaksi** Anda:
   * **Pendapatan:** Uang masuk (misal: Gaji, Hasil jualan, Dividen).
   * **Pengeluaran:** Uang keluar harian (misal: Makan, Transport, Listrik).
   * **Transfer:** Mutasi antar dompet Anda (misal: Uang tunai disetor ke Bank BCA).
   * **Tabungan / Dana Darurat / Investasi:** Mencatat alokasi investasi atau simpanan impian Anda.
3. Masukkan **Nominal Uang** yang akurat.
4. Pilih **Kategori**. Cari kategori belanja yang relevan (misal: Makanan, Belanja, Transportasi, Hiburan).
5. Pilih **Sumber Kas (Dompet)** yang digunakan (misal: Apakah Anda membayarnya pakai Cash? Rekening Bank? Atau Gopay?).
6. Tambahkan **Catatan Pendukung (Opsional):** Beri keterangan seperlunya agar tidak lupa di masa depan.
7. Ketik **Simpan Catatan**. Saldo total di dompet pilihan Anda akan diperbarui secara otomatis secara riil!

---

### 📂 Cara Menggunakan Modul Laporan Tingkat Lanjut (Advance Financials)

Aplikasi kami tidak hanya mencatat belanjaan Anda, tetapi juga membantu Anda merencanakan masa depan keuangan:

#### 1. Menentukan Batas Anggaran (Budgeting)
* Buka tab **Report** &gt; masuk ke sub-tab **Anggaran**.
* Buat atau edit limit anggaran per kategori (Misal: Membatasi pengeluaran kategori *"Makanan"* sebesar Rp 1.500.000 sebulan).
* Setiap kali Anda mencatat pengeluaran makanan, bilah progres bar akan berjalan secara langsung. Warna bar akan berubah menjadi merah jika Anda hampir melampaui batas anggaran bulanan Anda!

#### 2. Kiat Mengumpulkan Target Tabungan (Saving Goals)
* Buka tab **Report** &gt; masuk ke sub-tab **Tabungan**.
* Daftarkan impian baru Anda (Misal: *"Kamera Baru"*, Target: Rp 5.000.000).
* Setiap kali Anda berhasil mengamankan uang sisa, lakukan pencatatan transaksi dengan tipe **Tabungan**, pilih dompet sumber dan tentukan tujuan ke target tabungan Anda.
* Aplikasi akan menunjukkan persentase progres kebulatan target tabungan Anda hingga terisi penuh 100%!

#### 3. Membangun Dana Darurat (Emergency Fund Calculator)
* Pengalokasian dana perlindungan yang ideal adalah 3 hingga 6 bulan pengeluaran bulanan rutin Anda.
* Masukkan nominal rata-rata pengeluaran bulanan wajib Anda dan pilih target bulan perlindungan (misal: 6 bulan).
* Masukkan saldo yang saat ini telah berhasil Anda amankan di lemari dana darurat Anda. Aplikasi akan memberitahu Anda secara presisi seberapa siap kondisi finansial Anda dalam bertahan jika terjadi skenario krisis darurat.

#### 4. Pemantauan Portofolio Investasi (Investments Tracker)
* Masukkan kepemilikan aset investasi Anda di sub-tab **Investasi** (seperti Emas batangan gramasi, aset Saham, maupun Cryptocurrency).
* Masukkan jumlah kepemilikan (Qty) dan estimasi nilai pasarnya saat ini.
* Aplikasi akan menghitung perubahan nilai investasi Anda, sehingga Anda bisa mengukur nilai kekayaan bersih (*Net Worth*) secara komprehensif.

---

### 🔄 Cara Kerja Backup Lokal dan Sinkronisasi Spreadsheet

Kebanyakan aplikasi keuangan menyandera data Anda di database server mereka. **Finance Tracker Pro** menjunjung tinggi hak privasi Anda dengan metode berikut:

#### 1. Backup & Restore File Lokal (Tanpa Internet)
* Masuk ke tab **Settings (Pengaturan)**.
* Di bagian **Kontrol Data Lokal**:
  * Ketuk **Ekspor Data (JSON)**: Aplikasi akan mengemas seluruh catatan keuangan Anda menjadi satu baris kode teks rahasia yang aman. Salin teks ini dan simpan di catatan HP Anda (misal di Google Keep atau WhatsApp Chat Pribadi).
  * Ketuk **Impor Data (JSON)**: Jika Anda ganti ponsel baru, cukup pasang aplikasi di ponsel baru tersebut, buka menu ini, tempelkan file kode teks rahasia tadi, lalu ketuk muat. Seluruh riwayat dan dompet Anda akan pulih seketika!

#### 2. Sinkronisasi Awan 100% Otomatis dengan Google Sheets Anda pribadi
* Dengan menghubungkan URL Google Apps Script yang telah Anda konfigurasi (baca panduan di menu Settings aplikasi secara mandiri atau minta bantuan kami):
* Anda bisa mengaktifkan **"Auto-Backup / Sync Otomatis"** di menu Settings.
* Setiap kali Anda menambahkan transaksi di HP, sistem akan otomatis mengirim salinan datanya ke Google Spreadsheet pribadi Anda sekejap mata!
* Jika suatu saat Anda tidak sengaja menghapus seluruh data di HP Anda, Anda cukup mengetuk tombol **"Sync Sekarang"**, dan aplikasi akan menarik seluruh data riwayat mutasi lama Anda dari Google Spreadsheet kembali ke HP tanpa cacat!

Nikmatilah perjalanan kemerdekaan finansial Anda dengan tenang, aman, dan berdaya guna! 🚀💰
