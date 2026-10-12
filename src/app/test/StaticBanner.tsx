// src/app/test/StaticBanner.tsx
/**
 * 1. STATIC SERVER COMPONENT
 * Bagian header ini statis: berisi judul & deskripsi portal.
 * Dirender 1x saat build (Build Time) dan tidak tergantung data request.
 */
export default function StaticBanner() {
  return (
    <section className="border rounded-lg p-5 bg-emerald-50">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider">
          Static Component (Prerendered)
        </span>
        <span className="text-[10px] font-mono text-emerald-600">
          Render: Server (Build-Time)
        </span>
      </div>

      <h1 className="text-lg font-bold">📦 Posko Barang Temuan Warga</h1>
      <p className="mt-1 text-xs text-slate-600">
        Selamat datang di portal informasi barang hilang & temuan.
        Bagian ini bersifat <strong>statis</strong> — sama untuk semua pengunjung.
      </p>
    </section>
  );
}