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
                    Dimana dan kapan dilakukan Rendering?: di sisi <strong>Server</strong> (Build-Time / Ketika pertama kali di akses)
                </span>
            </div>

            <h1 className="text-lg font-bold">📦 Tes Barang Temuan</h1>
            <p className="mt-1 text-xs text-slate-600">
                Di bagian/kotak hijau ini adalah komponen yang <strong>statis</strong> — jadi tidak ada perubahan kecuali di sisi produksi.
            </p>
        </section>
    );
}