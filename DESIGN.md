# 🎨 PANDUAN DESAIN (DESIGN DIRECTION) — LACAK

> **Dokumen Panduan Gaya & Arah Desain Resmi Proyek LACAK**  
> Digunakan bersamaan dengan filter kualitas *Anti-Slop* untuk menjaga identitas visual, estetika, dan konsistensi antarmuka.

---

## 1. Identitas Brand & Filosofi Visual

* **Nama Produk**: **LACAK** (Sistem Pelacakan Barang Temuan dan Kehilangan).
* **Karakter Desain**: Bersih, terpercaya, modern, tenang, dan efisien layaknya katalog marketplace profesional (bukan dashboard korporat yang kaku dan bukan desain AI yang penuh gradasi ungu/glow berlebihan).
* **Fokus Pengguna**: Siswa, staf institusi, warga sekolah, dan petugas lost & found.

---

## 2. Palet Warna Resmi (Color Tokens)

| Peran Warna | Kode HEX | Penggunaan |
|---|---|---|
| **Primary Brand (Teal)** | `#0d7565` | Tombol aksi utama, aksen logo, badge aktif, tautan penting |
| **Primary Hover / Deep** | `#0a5d50` | Status hover dan active state pada tombol utama |
| **Mint Tint / Soft Background**| `#eef7f4` | Background tab aktif, badge kategori/status, hover card |
| **Page Background** | `#fafbfb` | Latar belakang kanvas seluruh halaman |
| **Surface / Card Background** | `#ffffff` | Kontainer kartu katalog, form panel, modal |
| **Border / Divider Utama** | `#e2ece8` | Garis pembatas kartu, navbar, footer, dan tabel |
| **Border Halus / Input** | `#d6e5df` | Garis batas input search bar, pill filter, modal dialog |
| **Teks Utama (Headings/Body)**| `#102824` | Judul, nama barang temuan, teks navigasi utama |
| **Teks Sekunder (Muted)** | `#526b65` | Deskripsi tambahan, tanggal, info lokasi |
| **Destructive / Danger** | `#ef4444` / `#dc2626` | Tombol hapus, alert error (selalu di urutan paling bawah) |

---

## 3. Tipografi & Gaya Bahasa (*Copywriting*)

* **Font Utama**: **Inter** (Modern sans-serif dengan legibilitas tinggi).
* **Gaya Bahasa**:
  * Bahasa Indonesia yang ramah, ringkas, santun, dan jelas.
  * Hindari kata-kata klise robot khas AI (contoh dilarang: *"Elevate your experience"*, *"Revolusioner"*, *"Seamless workflow"*).
  * Gunakan kalimat to-the-point (contoh dianjurkan: *"Laporkan Barang Hilang"*, *"100 barang temuan tersedia"*).

---

## 4. Pola Antarmuka & Komponen (*UI Patterns*)

1. **Bentuk Sudut (*Border Radius*)**:
   * Kapsul / Pill (`rounded-full`): Search bar, category chips, tombol filter, avatar badge.
   * Kontainer Kartu (`rounded-xl` atau `rounded-2xl`): Kartu barang, panel dialog, modal.
2. **Bayangan (*Shadows*)**:
   * Halus dan tidak pekat: Gunakan `shadow-xs` atau `shadow-sm` dengan batas `border border-[#e2ece8]`. Hindari shadow hitam pekat.
3. **Ergonomi Mobile-First**:
   * **Touch Targets**: Semua tombol aksi di layar HP wajib memiliki area sentuh minimal **44×44px**.
   * **Bottom Navigation**: Navigasi jempol di bawah layar untuk smartphone.
   * **Horizontal Scroll**: Filter kategori disajikan dalam bentuk deretan kapsul yang bisa digeser menyamping (*overflow-x-auto*).
   * **Bottom Sheet**: Detail barang di HP meluncur dari bawah layar, bukan popup kaku di tengah.

