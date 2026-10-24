# PROMPT REFACTORING UI/UX LACAK — TIGA HALAMAN RIWAYAT

Saya ingin melakukan refactoring UI/UX pada tiga halaman riwayat di aplikasi LACAK (Lost & Found):

1. Riwayat Barang Temuan
2. Riwayat Pengambilan Barang
3. Riwayat Laporan Kehilangan

Gunakan screenshot yang saya lampirkan sebagai referensi desain saat ini. Pertahankan identitas visual LACAK, tetapi perbaiki struktur tabel, menu aksi, dan tampilan rincian agar lebih konsisten, rapi, dan informatif.

**Sebelum mengubah kode, audit implementasi ketiga halaman, komponen yang digunakan, model data, dan relasi database. Setelah itu, implementasikan perubahan dengan mempertahankan business logic yang sudah berjalan.**

## 1. Standar Struktur Tabel

Ketiga halaman wajib menggunakan urutan kolom berikut, sesuai konteks masing-masing riwayat.

### A. Riwayat Barang Temuan

Urutan kolom dari kiri ke kanan:

`[ID Penemu] [Jenis Barang] [Merek] [Warna] [Lokasi] [Status] [Tanggal] [Aksi]`

Ketentuan setiap kolom:

- **ID Penemu:** tampilkan ID personel yang benar-benar terkait dengan penemuan atau penyerahan barang.
- **Jenis Barang:** tampilkan jenis atau nama barang.
- **Merek:** tampilkan merek barang. Jika kosong, gunakan `—`.
- **Warna:** tampilkan warna barang. Jika kosong, gunakan `—`.
- **Lokasi:** tampilkan lokasi barang ditemukan atau lokasi penyimpanan sesuai data yang tersedia.
- **Status:** tampilkan badge berdasarkan status aktual barang, misalnya Tersedia, Sudah Diambil, atau Kedaluwarsa jika status tersebut memang didukung sistem.
- **Tanggal:** tampilkan waktu penemuan atau pendaftaran barang dengan format yang konsisten.
- **Aksi:** sediakan menu aksi yang berisi Hapus, Rincian, dan Salin Kode Barang.

Jangan menambahkan kolom Kode Barang atau Nama Penemu ke tabel utama. Nama lengkap penemu harus tersedia di popup Rincian.

### B. Riwayat Pengambilan Barang

Urutan kolom dari kiri ke kanan:

`[ID Pengambil] [Jenis Barang] [Merek] [Warna] [Lokasi] [Status] [Tanggal] [Aksi]`

Ketentuan setiap kolom:

- **ID Pengambil:** tampilkan ID personel penerima atau pengambil barang.
- **Jenis Barang:** tampilkan jenis atau nama barang yang diambil.
- **Merek:** tampilkan merek barang.
- **Warna:** tampilkan warna barang.
- **Lokasi:** tampilkan lokasi pengambilan atau serah terima yang sesuai dengan data transaksi.
- **Status:** tampilkan status transaksi pengambilan yang sebenarnya.
- **Tanggal:** tampilkan waktu pengambilan atau serah terima barang.
- **Aksi:** sediakan menu aksi yang berisi Hapus, Rincian, dan Salin Kode Barang.

Nama lengkap pengambil, identitas penemu awal, informasi serah terima, dan kode barang tidak perlu dimasukkan ke tabel utama. Informasi tersebut ditampilkan pada popup Rincian.

### C. Riwayat Laporan Kehilangan

Urutan kolom dari kiri ke kanan:

`[ID Pelapor] [Jenis Barang] [Merek] [Warna] [Lokasi] [Status] [Tanggal] [Aksi]`

Ketentuan setiap kolom:

- **ID Pelapor:** tampilkan ID personel yang membuat laporan kehilangan.
- **Jenis Barang:** tampilkan jenis atau nama barang yang dilaporkan hilang.
- **Merek:** tampilkan merek barang jika diketahui.
- **Warna:** tampilkan warna barang jika diketahui.
- **Lokasi:** tampilkan lokasi kehilangan yang dilaporkan.
- **Status:** tampilkan status laporan sesuai business logic, misalnya Sedang Dicari atau Selesai jika status tersebut memang tersedia.
- **Tanggal:** tampilkan waktu laporan dibuat.
- **Aksi:** sediakan menu aksi yang berisi Hapus, Rincian, dan Salin Kode Barang, dengan ketentuan ketersediaan kode yang dijelaskan di bawah.

Nama lengkap pelapor, kontak yang diizinkan untuk ditampilkan, deskripsi kehilangan, dan informasi laporan lainnya harus tersedia pada popup Rincian.

**Catatan penting:** laporan kehilangan belum tentu mempunyai kode barang temuan. Jangan menyamakan ID laporan dengan kode barang. Jika kode barang terkait belum tersedia, opsi Salin Kode Barang harus disembunyikan atau dinonaktifkan dengan penjelasan yang sesuai. Jika terdapat ID laporan, tampilkan identitas tersebut di bagian rincian menggunakan label yang benar.

## 2. Menu Aksi pada Setiap Baris

Gunakan satu pola interaksi yang konsisten pada ketiga halaman.

Di kolom Aksi, tampilkan tombol ikon titik tiga horizontal (`⋯`). Ketika diklik, tampilkan dropdown menu yang berisi tiga tindakan:

1. **Hapus**
2. **Rincian**
3. **Salin Kode Barang**

Urutan tindakan di menu harus konsisten.

Perilaku masing-masing tindakan:

### Hapus
- Tampilkan dialog konfirmasi sebelum penghapusan.
- Jelaskan data yang akan dihapus agar pengguna tidak salah memilih.
- Ikuti mekanisme penghapusan, otorisasi, dan relasi data yang sudah diterapkan proyek.
- Jangan menghapus data terkait secara berantai tanpa dasar business logic yang sudah ada.

### Rincian
- Buka popup atau modal overlay yang menampilkan informasi lengkap untuk baris yang dipilih.
- Jangan lagi mengandalkan baris tambahan yang terbuka di bawah tabel sebagai tampilan utama rincian.
- Popup harus menampilkan data sesuai konteks riwayat.

### Salin Kode Barang
- Salin kode barang yang tepat untuk baris yang dipilih.
- Gunakan mekanisme clipboard yang kompatibel dengan proyek.
- Tampilkan feedback ketika penyalinan berhasil atau gagal.
- Jangan menyalin ID personel atau ID laporan sebagai pengganti kode barang.
- Jika kode barang tidak tersedia, terutama pada laporan kehilangan, tangani kondisi tersebut dengan benar.

Dropdown harus memiliki hover state, focus state, dan posisi yang tidak terpotong oleh container tabel. Dropdown ditutup saat pengguna memilih tindakan, mengklik area di luar, atau menekan Escape.

## 3. Rincian Menggunakan Popup/Modal Overlay

Ini merupakan perubahan utama yang saya inginkan.

Pada screenshot saat ini, informasi rincian muncul sebagai baris tambahan di dalam tabel. **Ubah pola tersebut menjadi popup/modal overlay yang terpisah dari tabel utama.**

Ketika pengguna memilih Rincian, tampilkan modal di tengah layar dengan karakteristik berikut:

- Background overlay gelap transparan untuk membedakan modal dari halaman utama.
- Panel modal berwarna putih dengan sudut membulat dan bayangan halus.
- Header berisi judul sesuai konteks, misalnya Detail Barang Temuan, Detail Pengambilan Barang, atau Detail Laporan Kehilangan.
- Tombol tutup yang mudah ditemukan.
- Konten dibagi menjadi beberapa bagian menggunakan heading, grid, atau kartu informasi.
- Informasi ditata dengan label dan nilai yang mudah dibaca.
- Konten dapat di-scroll jika panjangnya melebihi tinggi layar.
- Modal responsif untuk desktop dan perangkat dengan layar kecil.
- Modal tidak menghilangkan aksesibilitas keyboard dan fokus.
- Ketika modal dibuka, pengguna tetap dapat memahami halaman asal dan data yang sedang dilihat.

Jangan membuat modal yang hanya memperbesar isi tabel. Rancang sebagai panel detail yang terstruktur dan lengkap.

### A. Isi Popup — Riwayat Barang Temuan

Tampilkan informasi yang benar-benar tersedia dari data barang dan relasinya, dikelompokkan sebagai berikut.

**Bagian 1 — Informasi Barang**
- Kode Barang
- Jenis/Nama Barang
- Kategori Barang, jika merupakan field terpisah
- Merek
- Warna
- Lokasi Penemuan
- Status Barang
- Tanggal dan Waktu Ditemukan atau Didaftarkan
- Deskripsi atau Keterangan Tambahan
- Foto Barang, jika tersedia

**Bagian 2 — Identitas Penemu/Penyerah**
- Nama Lengkap
- ID Personel
- Kontak yang memang tersedia dan boleh diakses oleh pengguna
- Informasi identitas relevan lainnya yang sudah tersimpan

**Bagian 3 — Informasi Administratif**
- Waktu pendaftaran
- Informasi pencatatan atau perubahan status yang tersedia
- Informasi penyimpanan atau penyerahan barang jika tersedia

Kode barang harus ditampilkan secara jelas di bagian ini, dengan tombol Salin Kode Barang jika memungkinkan.

Jangan menampilkan field kosong sebagai informasi palsu. Gunakan placeholder `—` atau sembunyikan field opsional yang memang tidak tersedia.

### B. Isi Popup — Riwayat Pengambilan Barang

Tampilkan informasi transaksi dan semua pihak yang terkait dengan serah terima.

**Bagian 1 — Informasi Barang**
- Kode Barang
- Jenis/Nama Barang
- Kategori, jika tersedia
- Merek
- Warna
- Lokasi Penemuan Awal
- Status barang yang relevan
- Foto atau deskripsi barang jika tersedia

**Bagian 2 — Identitas Pengambil/Penerima**
- Nama Lengkap
- ID Personel
- Kontak yang tersedia dan boleh diakses
- Informasi identitas relevan lainnya yang sudah tersimpan

**Bagian 3 — Identitas Penemu/Penyerah Awal**
- Nama Lengkap
- ID Personel
- Kontak yang tersedia dan boleh diakses
- Informasi lain yang relevan

**Bagian 4 — Informasi Serah Terima**
- Tanggal dan Waktu Pengambilan
- Lokasi Serah Terima
- Status Transaksi
- Bukti pengambilan, foto, tanda tangan, atau informasi pendukung lainnya jika memang tersedia pada sistem

Pastikan pengambil tidak tertukar dengan penemu awal. Gunakan relasi transaksi yang benar untuk menampilkan setiap orang.

### C. Isi Popup — Riwayat Laporan Kehilangan

Tampilkan informasi laporan dan identitas pelapor secara lengkap berdasarkan data yang tersedia.

**Bagian 1 — Informasi Barang Hilang**
- Jenis/Nama Barang
- Kategori, jika tersedia
- Merek
- Warna
- Deskripsi atau ciri-ciri barang
- Foto barang, jika tersedia

**Bagian 2 — Identitas Pelapor**
- Nama Lengkap
- ID Personel
- Kontak yang tersedia dan boleh diakses
- Informasi identitas relevan lainnya yang sudah tersimpan

**Bagian 3 — Informasi Kehilangan**
- Lokasi Kehilangan
- Tanggal dan Waktu Kehilangan, jika tersedia
- Tanggal dan Waktu Pelaporan
- Kronologi atau deskripsi kehilangan
- Status Laporan
- Informasi penyelesaian atau pencocokan dengan barang temuan, jika tersedia

**Bagian 4 — Referensi Data**
- ID atau Kode Laporan
- Kode Barang Temuan terkait, hanya jika memang sudah memiliki relasi yang valid
- Informasi pencocokan atau penyelesaian, jika tersedia

Jangan mengarang kronologi, kontak, tanggal kehilangan, atau hubungan antara laporan dan barang temuan. Semua informasi harus berasal dari sumber data yang benar.

## 4. Ketentuan Data dan Identitas

Bedakan tiga peran berikut secara tegas:

- **Penemu/Penyerah:** orang yang menemukan atau menyerahkan barang.
- **Pengambil/Penerima:** orang yang mengambil atau menerima barang.
- **Pelapor:** orang yang membuat laporan kehilangan.

Kolom pertama tabel menampilkan ID sesuai peran masing-masing, bukan kode barang.

Nama lengkap dan informasi detail pihak terkait ditampilkan di modal rincian.

Jika satu orang memiliki lebih dari satu peran dalam transaksi, tampilkan setiap peran sesuai konteks tanpa menduplikasi atau mengarang relasi.

Jika terdapat data historis yang sudah menyimpan snapshot identitas saat transaksi, evaluasi apakah snapshot tersebut harus digunakan untuk menjaga keakuratan riwayat. Jangan sembarangan mengganti identitas historis dengan data profil terbaru jika hal itu mengubah makna catatan transaksi.

## 5. Konsistensi Visual

Pertahankan identitas visual yang sudah ada pada screenshot:

- Navbar hijau tua.
- Latar halaman terang.
- Tabel putih dengan border halus.
- Heading berwarna gelap dengan tipografi tegas.
- Badge status dengan warna yang memiliki makna jelas.
- Spasi dan padding yang rapi.
- Tombol dengan hover dan focus state.
- Komponen yang konsisten di ketiga halaman.

Jangan merombak keseluruhan layout, navbar, atau desain halaman lain yang tidak terkait dengan perubahan ini.

Pada tabel utama, jangan tampilkan rincian panjang dalam bentuk baris tambahan lagi. Informasi tersebut dipindahkan ke modal agar tabel lebih ringkas dan seragam.

Pertahankan filter status yang sudah tersedia, jumlah data, pencarian, pagination, dan mekanisme pemuatan data yang sudah berjalan.

## 6. Implementasi dan Reusability

Audit apakah memungkinkan untuk menggunakan kembali komponen berikut:

- Dropdown menu aksi riwayat.
- Modal rincian riwayat.
- Komponen pasangan label dan nilai.
- Komponen badge status.
- Komponen konfirmasi penghapusan.

Gunakan kembali komponen yang memang memiliki struktur dan perilaku serupa, tetapi jangan memaksakan seluruh rincian tiga jenis riwayat menjadi satu komponen rumit.

Jika membuat modal reusable, gunakan pemisahan yang jelas antara:
- Kerangka modal yang konsisten.
- Konten rincian spesifik setiap jenis riwayat.
- Sumber data dan pemetaan relasi masing-masing.
- Fungsi tindakan dan business logic.

Gunakan library, konvensi kode, dan pola komponen yang sudah ada di repository.

## 7. Batasan Database dan Business Logic

Perubahan ini berfokus pada UI/UX dan penyajian data.

Jangan:
- Menghapus tabel atau kolom database.
- Mereset database atau menghapus data.
- Mengubah schema atau migration tanpa alasan teknis yang terbukti dan persetujuan yang diperlukan.
- Mengganti sumber data nyata dengan mock data.
- Mengubah relasi barang, personel, laporan, dan transaksi pengambilan.
- Mengubah aturan status, pencocokan, atau kedaluwarsa.
- Membuka data pribadi kepada pengguna yang tidak berhak mengaksesnya.
- Mengubah fungsi lain yang tidak terkait.

Jika data yang diperlukan oleh modal belum tersedia di query saat ini, periksa relasi dan sumber datanya terlebih dahulu. Tambahkan pengambilan data yang diperlukan secara terarah tanpa mengubah struktur database secara sepihak.

## 8. Tahapan Pengerjaan

**Tahap 1 — Audit**
Identifikasi ketiga halaman, komponen tabel, model data, relasi personel, query, fungsi penghapusan, dan mekanisme detail yang saat ini digunakan.

**Tahap 2 — Rencana**
Petakan kolom tabel dan seluruh field popup ke sumber data yang tepat. Sebutkan file yang akan diubah dan potensi regresinya.

**Tahap 3 — Implementasi**
Terapkan struktur tabel yang ditetapkan, dropdown aksi yang fungsional, serta modal rincian lengkap untuk ketiga halaman.

**Tahap 4 — Pengujian**
Verifikasi bahwa:
- Urutan kolom setiap halaman sesuai spesifikasi.
- Kode barang tidak menjadi kolom tabel utama.
- ID personel benar dan sesuai peran.
- Dropdown bekerja pada baris yang benar.
- Salin kode barang menyalin nilai yang tepat.
- Modal menampilkan informasi dan relasi yang benar.
- Data kosong ditangani dengan benar.
- Modal dapat ditutup dan digunakan dengan keyboard.
- Filter, pencarian, status, dan pagination tetap bekerja.
- Tidak ada error TypeScript, lint, build, atau runtime yang diperkenalkan.

Jalankan pemeriksaan yang tersedia di repository dan laporkan hasil aktualnya.

## 9. Laporan Akhir

Setelah selesai, jelaskan:
1. File yang diubah.
2. Urutan kolom akhir pada masing-masing halaman.
3. Struktur dan konten modal yang diterapkan.
4. Cara kerja menu Hapus, Rincian, dan Salin Kode Barang.
5. Sumber data dan relasi yang digunakan untuk setiap identitas.
6. Apakah database dan business logic tetap dipertahankan.
7. Hasil pengujian yang benar-benar dijalankan.
8. Batasan atau informasi yang belum tersedia di database.

**Prioritas utama: tabel ringkas dan konsisten, modal rincian benar-benar lengkap sesuai data yang tersedia, identitas setiap pelaku tidak tertukar, dan semua fungsi yang sudah ada tetap berjalan.**