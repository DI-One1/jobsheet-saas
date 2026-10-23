// src/app/test/DynamicCatalog.tsx
/**
 * 4. DYNAMIC SERVER COMPONENT
 * Komponen ini menerima query dari URL (q & kategori).
 * Karena bergantung pada searchParams, Next.js merender komponen ini
 * secara DYNAMIC di SERVER setiap kali pencarian/kategori berubah.
 */

// Data Dummy Barang Temuan
const DATA_BARANG = [
    { id: 1, nama: 'Dompet Kulit Cokelat', kategori: 'Dompet', lokasi: 'Kantin Sekolah', waktu: '10 Menit lalu' },
    { id: 2, nama: 'Kunci Motor Honda Vario', kategori: 'Kunci', lokasi: 'Parkiran Depan', waktu: '30 Menit lalu' },
    { id: 3, nama: 'Kartu Pelajar a.n Budi', kategori: 'Dokumen', lokasi: 'Perpustakaan', waktu: '1 Jam lalu' },
    { id: 4, nama: 'Earphone TWS Warna Putih', kategori: 'Elektronik', lokasi: 'Lab Komputer 2', waktu: '2 Jam lalu' },
    { id: 5, nama: 'Jaket Hoodie Hitam XL', kategori: 'Pakaian', lokasi: 'Lapangan Basket', waktu: '3 Jam lalu' },
    { id: 6, nama: 'Botol Minum Tumbler Hijau', kategori: 'Lainnya', lokasi: 'Ruang Kelas 12 A', waktu: '5 Jam lalu' },
];

export default async function DynamicCatalog({
    q = '',
    kategori = 'Semua',
}: {
    q?: string;
    kategori?: string;
}) {
    // Waktu render server — berubah setiap request
    const renderTime = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    // Filter barang di SERVER
    const filtered = DATA_BARANG.filter((item) => {
        const matchQ = q ? item.nama.toLowerCase().includes(q.toLowerCase()) : true;
        const matchCat = kategori !== 'Semua' ? item.kategori.toLowerCase() === kategori.toLowerCase() : true;
        return matchQ && matchCat;
    });

    return (
        <section className="border rounded-lg p-4 bg-teal-50">
            <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase text-teal-700 tracking-wider">
                    Dynamic Server Component
                </span>
                <span className="text-[10px] font-mono text-teal-600">
                    Server Render: {renderTime} WIB
                </span>
            </div>

            {/* Daftar Barang */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {filtered.map((item) => (
                        <div key={item.id} className="border rounded p-3 bg-white">
                            <div className="flex justify-between text-[10px]">
                                <span className="font-bold text-teal-700">{item.kategori}</span>
                                <span className="text-slate-400">{item.waktu}</span>
                            </div>
                            <h4 className="text-sm font-bold mt-1">{item.nama}</h4>
                            <p className="text-xs text-slate-500 mt-1">📍 {item.lokasi}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="border border-dashed rounded p-6 text-center text-xs text-slate-500">
                    Tidak ada barang yang cocok dengan pencarian &quot;{q}&quot;.
                </div>
            )}
        </section>
    );
}


