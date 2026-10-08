import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🧹 Mengosongkan seluruh database...");

  // Clear existing operational & transactional data
  await prisma.claimTransaction.deleteMany();
  await prisma.foundItem.deleteMany();
  await prisma.lostReport.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.warga.deleteMany();

  // Clear master data
  await prisma.categoryItem.deleteMany();
  await prisma.colorItem.deleteMany();
  await prisma.brandItem.deleteMany();
  await prisma.locationItem.deleteMany();

  console.log("✅ Database berhasil dikosongkan sepenuhnya.");

  console.log("⏳ Memulai seeding data master (20 Kategori, Warna, Merek, Lokasi)...");

  // 1. Kategori Barang (20 Kategori Lengkap)
  const categoriesData = [
    { name: "Elektronik", code: "EL" },
    { name: "Komputer & Aksesoris", code: "KA" },
    { name: "Handphone & Aksesoris", code: "HA" },
    { name: "Jaket", code: "JK" },
    { name: "Jas Hujan", code: "JH" },
    { name: "Kemeja", code: "KM" },
    { name: "Kaos", code: "KS" },
    { name: "Pakaian Olahraga", code: "PO" },
    { name: "Sepatu", code: "SP" },
    { name: "Tas", code: "TS" },
    { name: "Dompet", code: "DP" },
    { name: "Jam Tangan", code: "JT" },
    { name: "Aksesoris", code: "AK" },
    { name: "Buku & Alat Tulis", code: "BAT" },
    { name: "Botol & Tumbler", code: "BT" },
    { name: "Perlengkapan Makan", code: "PM" },
    { name: "Kacamata", code: "KC" },
    { name: "Perlengkapan Rumah", code: "PR" },
    { name: "Kunci", code: "KN" },
    { name: "Lainnya", code: "LN" },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.categoryItem.create({
      data: { name: cat.name, code: cat.code },
    });
    categoryMap.set(cat.name, created.id);
  }
  console.log("✅ 20 Kategori Barang berhasil dibuat.");

  // 2. Warna
  const colorsData = [
    { name: "Hitam", code: "HTM" },
    { name: "Putih", code: "PTH" },
    { name: "Biru", code: "BRU" },
    { name: "Abu-abu", code: "ABU" },
    { name: "Pink", code: "PNK" },
    { name: "Merah", code: "MRH" },
    { name: "Hijau", code: "HJU" },
    { name: "Cokelat", code: "CKL" },
    { name: "Multi-warna", code: "MLT" },
  ];

  const colorMap = new Map<string, string>();
  for (const col of colorsData) {
    const created = await prisma.colorItem.create({
      data: { name: col.name, code: col.code },
    });
    colorMap.set(col.name, created.id);
  }
  console.log("✅ Data Warna berhasil dibuat.");

  // 3. Merek
  const brandsData = [
    { name: "Gucci", code: "GUC" },
    { name: "Apple", code: "APL" },
    { name: "Nike", code: "NKE" },
    { name: "Adidas", code: "ADS" },
    { name: "Lenovo", code: "LNV" },
    { name: "Prada", code: "PRD" },
    { name: "Tupperware", code: "TPW" },
    { name: "Sony", code: "SNY" },
    { name: "iPhone", code: "IPH" },
    { name: "Ray-Ban", code: "RYB" },
    { name: "Uniqlo", code: "UNQ" },
    { name: "Moleskine", code: "MLS" },
    { name: "Miniso", code: "MNS" },
    { name: "Logitech", code: "LGT" },
    { name: "Pandora", code: "PND" },
    { name: "Anker", code: "ANK" },
    { name: "LocknLock", code: "LNL" },
    { name: "Eiger", code: "EGR" },
    { name: "Casio", code: "CSO" },
    { name: "Lainnya", code: "LNY" },
  ];

  const brandMap = new Map<string, string>();
  for (const brnd of brandsData) {
    const created = await prisma.brandItem.create({
      data: { name: brnd.name, code: brnd.code },
    });
    brandMap.set(brnd.name, created.id);
  }
  console.log("✅ Data Merek berhasil dibuat.");

  // 4. Lokasi
  const locationsData = [
    { name: "Kelas", code: "KLS" },
    { name: "Asrama", code: "ASR" },
    { name: "Masjid", code: "MSJ" },
    { name: "Lapangan", code: "LPG" },
    { name: "Perpustakaan", code: "PRP" },
    { name: "Lab Komputer", code: "LAB" },
    { name: "Kantin", code: "KTN" },
    { name: "Parkiran", code: "PRK" },
    { name: "Lainnya", code: "LKN" },
  ];

  const locationMap = new Map<string, string>();
  for (const loc of locationsData) {
    const created = await prisma.locationItem.create({
      data: { name: loc.name, code: loc.code },
    });
    locationMap.set(loc.name, created.id);
  }
  console.log("✅ Data Lokasi berhasil dibuat.");

  // 5. Data Warga Utama: Ahmad Supriyadi (Siswa / Warga Penemu Utama)
  const warga = await prisma.warga.create({
    data: {
      id: "2025001",
      nama: "Muhammad Choerul Akbar",
      peran: "Siswa",
      keteranganPeran: "XII SIJA",
      nomorTelepon: "085215833182",
    },
  });
  console.log(`✅ Data Warga Penemu (${warga.nama} - ID: ${warga.id}) berhasil dibuat.`);

  // 6. Data 100 Barang Temuan Lengkap Mencakup Seluruh 20 Kategori
  const itemsData = [
    // --- 1. ELEKTRONIK (5 Items) ---
    { name: "Headphone Bluetooth", brand: "Sony", color: "Putih", category: "Elektronik", location: "Kelas", date: "2026-09-15T08:00:00.000Z", desc: "Headphone wireless warna putih dengan bantalan telinga bersih." },
    { name: "Speaker Portable", brand: "Sony", color: "Hitam", category: "Elektronik", location: "Asrama", date: "2026-09-14T09:30:00.000Z", desc: "Speaker bluetooth mini warna hitam dengan tali gantungan merah." },
    { name: "Earphone TWS Wireless", brand: "Anker", color: "Hitam", category: "Elektronik", location: "Perpustakaan", date: "2026-09-13T10:15:00.000Z", desc: "Charging case TWS Anker Soundcore warna hitam." },
    { name: "Powerbank 10000mAh", brand: "Anker", color: "Abu-abu", category: "Elektronik", location: "Kantin", date: "2026-09-12T11:00:00.000Z", desc: "Powerbank Anker abu-abu dengan indikator LED 4 titik." },
    { name: "Flashdisk 64GB", brand: "Lainnya", color: "Merah", category: "Elektronik", location: "Lab Komputer", date: "2026-09-11T14:20:00.000Z", desc: "Flashdisk OTG merah dengan penutup putar stainless." },

    // --- 2. KOMPUTER & AKSESORIS (5 Items) ---
    { name: "Tas Laptop Backpack", brand: "Lenovo", color: "Hitam", category: "Komputer & Aksesoris", location: "Asrama", date: "2026-09-15T16:00:00.000Z", desc: "Tas ransel laptop Lenovo terdapat kompartemen tebal." },
    { name: "Mouse Wireless Silent", brand: "Logitech", color: "Putih", category: "Komputer & Aksesoris", location: "Lab Komputer", date: "2026-09-14T17:10:00.000Z", desc: "Mouse wireless Logitech Pebble warna putih bersih." },
    { name: "Charger Laptop Type-C", brand: "Lenovo", color: "Hitam", category: "Komputer & Aksesoris", location: "Perpustakaan", date: "2026-09-13T11:00:00.000Z", desc: "Adapter charger 65W Lenovo kabel lengkap tergulung rapi." },
    { name: "Keyboard Mechanical", brand: "Logitech", color: "Hitam", category: "Komputer & Aksesoris", location: "Lab Komputer", date: "2026-09-12T13:45:00.000Z", desc: "Keyboard mechanical RGB ukuran kompak 60%." },
    { name: "Sleeve Case Laptop", brand: "Eiger", color: "Abu-abu", category: "Komputer & Aksesoris", location: "Kelas", date: "2026-09-11T15:30:00.000Z", desc: "Softcase laptop 14 inci abu-abu bahan fleksibel." },

    // --- 3. HANDPHONE & AKSESORIS (5 Items) ---
    { name: "Smartphone", brand: "iPhone", color: "Biru", category: "Handphone & Aksesoris", location: "Kelas", date: "2026-09-15T09:00:00.000Z", desc: "iPhone warna biru dengan casing bening bening." },
    { name: "Kabel Data Fast Charge", brand: "Anker", color: "Putih", category: "Handphone & Aksesoris", location: "Perpustakaan", date: "2026-09-14T16:20:00.000Z", desc: "Kabel Type-C to Lightning braided warna putih." },
    { name: "Casing Silicone HP", brand: "Apple", color: "Pink", category: "Handphone & Aksesoris", location: "Kantin", date: "2026-09-13T08:15:00.000Z", desc: "Casing silicone halus warna soft pink." },
    { name: "Kepala Charger 20W", brand: "Apple", color: "Putih", category: "Handphone & Aksesoris", location: "Asrama", date: "2026-09-12T14:00:00.000Z", desc: "Adapter fast charging USB-C Apple original." },
    { name: "Tripod Mini Smartphone", brand: "Miniso", color: "Hitam", category: "Handphone & Aksesoris", location: "Lapangan", date: "2026-09-11T12:30:00.000Z", desc: "Holder tripod lipat mini untuk HP." },

    // --- 4. JAKET (5 Items) ---
    { name: "Hoodie Zipper", brand: "Adidas", color: "Abu-abu", category: "Jaket", location: "Lapangan", date: "2026-09-15T10:00:00.000Z", desc: "Hoodie resleting abu-abu dengan tiga garis khas di lengan." },
    { name: "Jaket Outdoor Windbreaker", brand: "Eiger", color: "Hitam", category: "Jaket", location: "Parkiran", date: "2026-09-14T16:45:00.000Z", desc: "Jaket parasut Eiger tahan angin dengan hoodie." },
    { name: "Sweater Crewneck", brand: "Uniqlo", color: "Hijau", category: "Jaket", location: "Kelas", date: "2026-09-13T11:20:00.000Z", desc: "Sweater bahan katun fleece hijau sage." },
    { name: "Jaket Denim Jeans", brand: "Uniqlo", color: "Biru", category: "Jaket", location: "Asrama", date: "2026-09-12T19:00:00.000Z", desc: "Jaket jeans biru kancing besi." },
    { name: "Cardigan Rajut", brand: "Uniqlo", color: "Cokelat", category: "Jaket", location: "Perpustakaan", date: "2026-09-11T13:00:00.000Z", desc: "Cardigan rajut kancing depan warna cokelat muda." },

    // --- 5. JAS HUJAN (5 Items) ---
    { name: "Jas Hujan Setelan", brand: "Eiger", color: "Biru", category: "Jas Hujan", location: "Parkiran", date: "2026-09-15T15:10:00.000Z", desc: "Jas hujan baju dan celana biru lengkap dengan tas tasnya." },
    { name: "Jas Hujan Ponco", brand: "Lainnya", color: "Hijau", category: "Jas Hujan", location: "Parkiran", date: "2026-09-14T12:15:00.000Z", desc: "Ponco kelelawar warna hijau army berbahan tebal." },
    { name: "Mantel Hujan Transparan", brand: "Miniso", color: "Putih", category: "Jas Hujan", location: "Asrama", date: "2026-09-13T07:45:00.000Z", desc: "Jas hujan bening transparan model kancing." },
    { name: "Jas Hujan Motor High-Vis", brand: "Eiger", color: "Merah", category: "Jas Hujan", location: "Parkiran", date: "2026-09-12T17:00:00.000Z", desc: "Jas hujan merah dengan strip fosfor reflektif." },
    { name: "Jas Hujan Anak/Siswa", brand: "Lainnya", color: "Pink", category: "Jas Hujan", location: "Masjid", date: "2026-09-11T16:00:00.000Z", desc: "Jas hujan lipat parasut pink motif simpel." },

    // --- 6. KEMEJA (5 Items) ---
    { name: "Kemeja Lengan Panjang", brand: "Uniqlo", color: "Putih", category: "Kemeja", location: "Kelas", date: "2026-09-15T08:15:00.000Z", desc: "Kemeja putih seragam lengan panjang ukuran M." },
    { name: "Kemeja Kotak-Kotak Flanel", brand: "Uniqlo", color: "Biru", category: "Kemeja", location: "Asrama", date: "2026-09-14T14:00:00.000Z", desc: "Kemeja flanel motif kotak biru tua." },
    { name: "Kemeja Lengan Pendek", brand: "Uniqlo", color: "Abu-abu", category: "Kemeja", location: "Kantin", date: "2026-09-13T12:30:00.000Z", desc: "Kemeja polos santai warna abu-abu terang." },
    { name: "Kemeja Batik Modern", brand: "Lainnya", color: "Multi-warna", category: "Kemeja", location: "Masjid", date: "2026-09-12T10:00:00.000Z", desc: "Kemeja batik motif kombinasi cokelat hitam." },
    { name: "Kemeja Formal Slim-Fit", brand: "Uniqlo", color: "Hitam", category: "Kemeja", location: "Kelas", date: "2026-09-11T16:45:00.000Z", desc: "Kemeja hitam katun kancing cadangan di leher." },

    // --- 7. KAOS (5 Items) ---
    { name: "Kaos Polos Cotton", brand: "Uniqlo", color: "Putih", category: "Kaos", location: "Lapangan", date: "2026-09-15T16:00:00.000Z", desc: "Kaos oblong putih polos bahan lembut." },
    { name: "Kaos Oversize Streetwear", brand: "Adidas", color: "Hitam", category: "Kaos", location: "Asrama", date: "2026-09-14T11:20:00.000Z", desc: "Kaos ukuran oversize hitam gambar sablon simpel." },
    { name: "Kaos Striped Salur", brand: "Uniqlo", color: "Multi-warna", category: "Kaos", location: "Kelas", date: "2026-09-13T19:00:00.000Z", desc: "Kaos garis-garis mendatar biru putih." },
    { name: "Kaos Sport Dri-Fit", brand: "Nike", color: "Merah", category: "Kaos", location: "Lapangan", date: "2026-09-12T13:00:00.000Z", desc: "Kaos olahraga cepat kering warna merah marun." },
    { name: "Kaos Raglan 3/4", brand: "Lainnya", color: "Abu-abu", category: "Kaos", location: "Kantin", date: "2026-09-11T15:10:00.000Z", desc: "Kaos raglan lengan 3/4 warna abu hitam." },

    // --- 8. PAKAIAN OLAHRAGA (5 Items) ---
    { name: "Topi Baseball Sport", brand: "Nike", color: "Biru", category: "Pakaian Olahraga", location: "Lapangan", date: "2026-09-15T16:45:00.000Z", desc: "Topi olahraga biru dengan logo Nike bordir." },
    { name: "Celana Training Trackpants", brand: "Adidas", color: "Hitam", category: "Pakaian Olahraga", location: "Lapangan", date: "2026-09-14T12:15:00.000Z", desc: "Celana training panjang Adidas pinggang karet." },
    { name: "Jersey Futsal / Tim", brand: "Nike", color: "Hijau", category: "Pakaian Olahraga", location: "Lapangan", date: "2026-09-13T07:45:00.000Z", desc: "Jersey futsal warna hijau stabilo nomor punggung 10." },
    { name: "Wristband Handuk", brand: "Nike", color: "Putih", category: "Pakaian Olahraga", location: "Lapangan", date: "2026-09-12T17:00:00.000Z", desc: "Penyerap keringat pergelangan tangan Nike." },
    { name: "Celana Pendek Sport", brand: "Adidas", color: "Hitam", category: "Pakaian Olahraga", location: "Asrama", date: "2026-09-11T16:00:00.000Z", desc: "Shorts celana pendek hitam berongga sirkulasi." },

    // --- 9. SEPATU (5 Items) ---
    { name: "Sepatu Sneakers Running", brand: "Nike", color: "Putih", category: "Sepatu", location: "Lapangan", date: "2026-09-15T17:10:00.000Z", desc: "Sepatu lari Nike putih sol empuk." },
    { name: "Sandal Slop Casual", brand: "Adidas", color: "Hitam", category: "Sepatu", location: "Masjid", date: "2026-09-14T13:00:00.000Z", desc: "Sandal slop Adidas hitam strip putih." },
    { name: "Sepatu School Canvas", brand: "Lainnya", color: "Hitam", category: "Sepatu", location: "Kelas", date: "2026-09-13T08:00:00.000Z", desc: "Sepatu kain kanvas bertali warna hitam." },
    { name: "Sandal Gunung Outdoor", brand: "Eiger", color: "Cokelat", category: "Sepatu", location: "Asrama", date: "2026-09-12T09:30:00.000Z", desc: "Sandal gunung Eiger tali cokelat kokoh." },
    { name: "Sepatu Olahraga Slip-On", brand: "Nike", color: "Abu-abu", category: "Sepatu", location: "Lapangan", date: "2026-09-11T10:15:00.000Z", desc: "Sepatu tanpa tali warna abu-abu." },

    // --- 10. TAS (5 Items) ---
    { name: "Tas Ransel Designer", brand: "Gucci", color: "Hitam", category: "Tas", location: "Kelas", date: "2026-09-15T08:00:00.000Z", desc: "Tas ransel hitam dengan logo khas di bagian depan." },
    { name: "Tas Selempang Travel", brand: "Eiger", color: "Hitam", category: "Tas", location: "Masjid", date: "2026-09-14T12:00:00.000Z", desc: "Slingbag Eiger kecil untuk HP dan kunci." },
    { name: "Totebag Kanvas", brand: "Miniso", color: "Putih", category: "Tas", location: "Perpustakaan", date: "2026-09-13T14:20:00.000Z", desc: "Tas bahu kanvas putih cetakan tulisan quotes." },
    { name: "Drawstring Bag / Tas Serut", brand: "Nike", color: "Biru", category: "Tas", location: "Lapangan", date: "2026-09-12T16:00:00.000Z", desc: "Tas serut gendong warna biru." },
    { name: "Tas Pouch Organizer", brand: "Miniso", color: "Pink", category: "Tas", location: "Asrama", date: "2026-09-11T17:10:00.000Z", desc: "Pouch tas kosmetik/aksesoris zipper." },

    // --- 11. DOMPET (5 Items) ---
    { name: "Dompet Kulit Pria", brand: "Nike", color: "Hitam", category: "Dompet", location: "Masjid", date: "2026-09-15T12:00:00.000Z", desc: "Dompet lipat dua kulit hitam logo Nike." },
    { name: "Dompet Wanita Elegance", brand: "Prada", color: "Hitam", category: "Dompet", location: "Asrama", date: "2026-09-14T13:45:00.000Z", desc: "Dompet resleting panjang Prada warna hitam." },
    { name: "Dompet Kartu / Cardholder", brand: "Gucci", color: "Cokelat", category: "Dompet", location: "Kantin", date: "2026-09-13T09:00:00.000Z", desc: "Dompet koin dan kartu bahan sintetis cokelat." },
    { name: "Dompet Lipat Tiga", brand: "Eiger", color: "Abu-abu", category: "Dompet", location: "Kelas", date: "2026-09-12T16:20:00.000Z", desc: "Dompet kain velcro abu-abu." },
    { name: "Dompet Koin Silikon", brand: "Miniso", color: "Pink", category: "Dompet", location: "Perpustakaan", date: "2026-09-11T08:15:00.000Z", desc: "Dompet koin karakter imut bahan silikon." },

    // --- 12. JAM TANGAN (5 Items) ---
    { name: "Smartwatch Sport", brand: "Apple", color: "Hitam", category: "Jam Tangan", location: "Asrama", date: "2026-09-15T09:30:00.000Z", desc: "Smartwatch strap karet hitam layar gores tipis." },
    { name: "Jam Tangan Digital G-Shock", brand: "Casio", color: "Hitam", category: "Jam Tangan", location: "Lapangan", date: "2026-09-14T14:00:00.000Z", desc: "Jam tangan sport tahan air Casio warna hitam." },
    { name: "Jam Tangan Analogue Classic", brand: "Casio", color: "Abu-abu", category: "Jam Tangan", location: "Kelas", date: "2026-09-13T12:30:00.000Z", desc: "Jam tangan rantai stainless abu-abu silver." },
    { name: "Jam Tangan Strap Kulit", brand: "Casio", color: "Cokelat", category: "Jam Tangan", location: "Perpustakaan", date: "2026-09-12T10:00:00.000Z", desc: "Jam analog jarum emas tali kulit cokelat." },
    { name: "Smart Band Fitness", brand: "Lainnya", color: "Pink", category: "Jam Tangan", location: "Kantin", date: "2026-09-11T16:45:00.000Z", desc: "Gelang pintar pengukur langkah strap pink." },

    // --- 13. AKSESORIS (5 Items) ---
    { name: "Gelang Charm Love", brand: "Pandora", color: "Putih", category: "Aksesoris", location: "Asrama", date: "2026-09-15T19:00:00.000Z", desc: "Gelang perak dengan mainan bentuk hati." },
    { name: "Kalung Titanium Minimalis", brand: "Pandora", color: "Putih", category: "Aksesoris", location: "Kelas", date: "2026-09-14T15:10:00.000Z", desc: "Rantai kalung silverliontin bulat halus." },
    { name: "Bros Hijab Mutiara", brand: "Lainnya", color: "Putih", category: "Aksesoris", location: "Masjid", date: "2026-09-13T12:15:00.000Z", desc: "Bros peniti jilbab mutiara sintetis." },
    { name: "Gantungan Kunci Character", brand: "Miniso", color: "Multi-warna", category: "Aksesoris", location: "Perpustakaan", date: "2026-09-12T07:45:00.000Z", desc: "Gantungan boneka akrilik gambar animasi." },
    { name: "Ring / Cincin Motif", brand: "Pandora", color: "Putih", category: "Aksesoris", location: "Lab Komputer", date: "2026-09-11T17:00:00.000Z", desc: "Cincin perak polos ukuran jari manis." },

    // --- 14. BUKU & ALAT TULIS (5 Items) ---
    { name: "Buku Catatan Notebook", brand: "Moleskine", color: "Biru", category: "Buku & Alat Tulis", location: "Masjid", date: "2026-09-15T12:30:00.000Z", desc: "Buku jurnal hard cover biru pita pembatas." },
    { name: "Pouch Tempat Pensil", brand: "Miniso", color: "Pink", category: "Buku & Alat Tulis", location: "Kelas", date: "2026-09-14T10:00:00.000Z", desc: "Kotak pensil kain pink isi beberapa pulpen." },
    { name: "Binder Kuliah A5", brand: "Moleskine", color: "Hitam", category: "Buku & Alat Tulis", location: "Perpustakaan", date: "2026-09-13T16:00:00.000Z", desc: "Binder ring 20 warna hitam isi kertas bergaris." },
    { name: "Kalkulator Scientific", brand: "Casio", color: "Abu-abu", category: "Buku & Alat Tulis", location: "Lab Komputer", date: "2026-09-12T11:20:00.000Z", desc: "Kalkulator ilmiah Casio fx-570ES." },
    { name: "Set Drawing Pen / Marker", brand: "Miniso", color: "Multi-warna", category: "Buku & Alat Tulis", location: "Kelas", date: "2026-09-11T19:00:00.000Z", desc: "Kotak spidol warna 12 pcs." },

    // --- 15. BOTOL & TUMBLER (5 Items) ---
    { name: "Botol Minum Flip-Top", brand: "Tupperware", color: "Hitam", category: "Botol & Tumbler", location: "Kelas", date: "2026-09-15T10:15:00.000Z", desc: "Botol minum Tupperware Eco 750ml hitam." },
    { name: "Tumbler Vacuum Insulated", brand: "Tupperware", color: "Hitam", category: "Botol & Tumbler", location: "Kelas", date: "2026-09-14T09:00:00.000Z", desc: "Tumbler stainless panas dingin hitam murni." },
    { name: "Botol Stainless Vacuum", brand: "LocknLock", color: "Biru", category: "Botol & Tumbler", location: "Perpustakaan", date: "2026-09-13T13:00:00.000Z", desc: "Botol tahan panas LocknLock biru metalik." },
    { name: "Tumbler Sport Outdoor", brand: "Eiger", color: "Hijau", category: "Botol & Tumbler", location: "Lapangan", date: "2026-09-12T15:10:00.000Z", desc: "Tumbler adventure hijau dengan pengait carabiner." },
    { name: "Botol Infused Water", brand: "LocknLock", color: "Putih", category: "Botol & Tumbler", location: "Kantin", date: "2026-09-11T12:15:00.000Z", desc: "Botol bening saringan buah transparan." },

    // --- 16. PERLENGKAPAN MAKAN (5 Items) ---
    { name: "Tempat Makan Lunchbox", brand: "LocknLock", color: "Biru", category: "Perlengkapan Makan", location: "Kantin", date: "2026-09-15T12:15:00.000Z", desc: "Kotak bekal 3 sekat warna biru klip rapat." },
    { name: "Set Sendok Garpu Travel", brand: "Miniso", color: "Pink", category: "Perlengkapan Makan", location: "Kantin", date: "2026-09-14T07:45:00.000Z", desc: "Kotak sendok garpu stainless gagang pink." },
    { name: "Mangkok Makanan Tutup", brand: "Tupperware", color: "Hijau", category: "Perlengkapan Makan", location: "Asrama", date: "2026-09-13T17:00:00.000Z", desc: "Mangkok sup kedap udara warna hijau." },
    { name: "Straw Set Reusable", brand: "Lainnya", color: "Abu-abu", category: "Perlengkapan Makan", location: "Kantin", date: "2026-09-12T16:00:00.000Z", desc: "Sedotan stainless + sikat pembersih dalam pouch." },
    { name: "Piring Plastik Bento", brand: "LocknLock", color: "Putih", category: "Perlengkapan Makan", location: "Kantin", date: "2026-09-11T08:00:00.000Z", desc: "Piring sekat bekal plastik tebal." },

    // --- 17. KACAMATA (5 Items) ---
    { name: "Kacamata Sunglasses", brand: "Ray-Ban", color: "Hitam", category: "Kacamata", location: "Lapangan", date: "2026-09-15T16:20:00.000Z", desc: "Kacamata hitam gaya Wayfarer frame hitam." },
    { name: "Kacamata Anti Radiasi", brand: "Ray-Ban", color: "Abu-abu", category: "Kacamata", location: "Lab Komputer", date: "2026-09-14T11:20:00.000Z", desc: "Frame kacamata blueray abu-abu transparan." },
    { name: "Kacamata Baca Frame Tipis", brand: "Ray-Ban", color: "Hitam", category: "Kacamata", location: "Perpustakaan", date: "2026-09-13T19:00:00.000Z", desc: "Kacamata baca frame metal hitam ringan." },
    { name: "Kotak Hardcase Kacamata", brand: "Ray-Ban", color: "Cokelat", category: "Kacamata", location: "Kelas", date: "2026-09-12T13:00:00.000Z", desc: "Wadah kacamata bahan kulit sintetis cokelat." },
    { name: "Kacamata Style Aviator", brand: "Ray-Ban", color: "Putih", category: "Kacamata", location: "Parkiran", date: "2026-09-11T15:10:00.000Z", desc: "Kacamata lensa bening gagang silver." },

    // --- 18. PERLENGKAPAN RUMAH (5 Items) ---
    { name: "Payung Lipat Otomatis", brand: "Lainnya", color: "Biru", category: "Perlengkapan Rumah", location: "Asrama", date: "2026-09-15T08:00:00.000Z", desc: "Payung lipat 3 tombol otomatis biru tua." },
    { name: "Kipas Angin Mini Portable", brand: "Miniso", color: "Pink", category: "Perlengkapan Rumah", location: "Kelas", date: "2026-09-14T09:30:00.000Z", desc: "Kipas genggam elektrik baterai isi ulang." },
    { name: "Bantal Leher Memory Foam", brand: "Miniso", color: "Abu-abu", category: "Perlengkapan Rumah", location: "Asrama", date: "2026-09-13T10:15:00.000Z", desc: "Bantal leher huruf U empuk abu-abu." },
    { name: "Handuk Kecil / Olahraga", brand: "Lainnya", color: "Putih", category: "Perlengkapan Rumah", location: "Lapangan", date: "2026-09-12T11:00:00.000Z", desc: "Handuk muka microfiber putih bersih." },
    { name: "Cermin Lipat Rias", brand: "Miniso", color: "Pink", category: "Perlengkapan Rumah", location: "Asrama", date: "2026-09-11T14:20:00.000Z", desc: "Cermin persegi berdiri lipat warna pink." },

    // --- 19. KUNCI (5 Items) ---
    { name: "Kunci Loker Asrama", brand: "Lainnya", color: "Abu-abu", category: "Kunci", location: "Asrama", date: "2026-09-15T07:45:00.000Z", desc: "Gantungan kunci nomor 24 dengan kunci loker besi." },
    { name: "Kunci Motor & Remote", brand: "Lainnya", color: "Hitam", category: "Kunci", location: "Parkiran", date: "2026-09-14T16:00:00.000Z", desc: "Kunci kontak motor Honda dengan pita gantung." },
    { name: "Gembok & Anak Kunci", brand: "Lainnya", color: "Hitam", category: "Kunci", location: "Kelas", date: "2026-09-13T17:10:00.000Z", desc: "Gembok kuningan dengan 2 anak kunci." },
    { name: "Gantungan Kunci Dompet", brand: "Eiger", color: "Merah", category: "Kunci", location: "Masjid", date: "2026-09-12T11:00:00.000Z", desc: "Gantungan kunci kain Eiger warna merah." },
    { name: "Kunci Rumah / Kamar", brand: "Lainnya", color: "Putih", category: "Kunci", location: "Kantin", date: "2026-09-11T13:45:00.000Z", desc: "Dua anak kunci silver tersambung gantungan silikon." },

    // --- 20. LAINNYA (5 Items) ---
    { name: "Helm Motor SNI", brand: "Lainnya", color: "Hitam", category: "Lainnya", location: "Parkiran", date: "2026-09-15T15:30:00.000Z", desc: "Helm full-face warna hitam kaca kembang." },
    { name: "Id Card & Lanyard Tali", brand: "Lainnya", color: "Hijau", category: "Lainnya", location: "Kelas", date: "2026-09-14T09:00:00.000Z", desc: "Kartu id siswa dengan tali lanyard hijau." },
    { name: "Pouch Serbaguna Zipper", brand: "Miniso", color: "Multi-warna", category: "Lainnya", location: "Asrama", date: "2026-09-13T16:20:00.000Z", desc: "Pouch resleting motif bunga-bunga kecil." },
    { name: "Flashcard Modul Belajar", brand: "Moleskine", color: "Putih", category: "Lainnya", location: "Perpustakaan", date: "2026-09-12T08:15:00.000Z", desc: "Kotak flashcard kosakata bahasa Inggris." },
    { name: "Masker Kain Reusable", brand: "Uniqlo", color: "Abu-abu", category: "Lainnya", location: "Masjid", date: "2026-09-11T14:00:00.000Z", desc: "Masker AIRism warna abu-abu bersih." },
  ];

  console.log(`⏳ Memasukkan ${itemsData.length} data barang temuan ke database...`);

  for (let i = 0; i < itemsData.length; i++) {
    const item = itemsData[i];
    const jenisId = categoryMap.get(item.category) || categoryMap.get("Lainnya")!;
    const warnaId = colorMap.get(item.color) || colorMap.get("Hitam")!;
    const merekId = brandMap.get(item.brand) || brandMap.get("Lainnya")!;
    const lokasiId = locationMap.get(item.location) || locationMap.get("Lainnya")!;

    // Format kode unik bisnis: EL-HTM-SNY-KLS-0001
    const serial = String(i + 1).padStart(4, "0");
    const catCode = categoriesData.find((c) => c.name === item.category)?.code || "LN";
    const colCode = colorsData.find((c) => c.name === item.color)?.code || "HTM";
    const brndCode = brandsData.find((b) => b.name === item.brand)?.code || "LNY";
    const locCode = locationsData.find((l) => l.name === item.location)?.code || "LKN";

    const businessCode = `${catCode}-${colCode}-${brndCode}-${locCode}-${serial}`;

    await prisma.foundItem.create({
      data: {
        businessCode,
        finderName: warga.nama,
        finderIdCard: warga.id,
        finderContact: warga.nomorTelepon || "-",
        wargaId: warga.id,
        jenisId,
        warnaId,
        merekId,
        lokasiId,
        additionalDesc: item.desc,
        status: "FOUND",
        createdAt: new Date(item.date),
      },
    });
  }

  console.log(`✅ 100 Data Barang Temuan atas nama penemu ${warga.nama} berhasil dimasukkan ke database!`);
  console.log("🎉 PROSES SEEDING SELESAI 100% SUKSES!");
}

main()
  .catch((e) => {
    console.error("❌ Terjadi kesalahan saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });