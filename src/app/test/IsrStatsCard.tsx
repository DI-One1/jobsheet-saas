// src/app/test/IsrStatsCard.tsx
import { unstable_cache } from "next/cache";
import { revalidateIsrDemo } from "./isr-actions";

/**
 * ==============================================================================
 * DEMO ISR (INCREMENTAL STATIC REGENERATION)
 * ==============================================================================
 * Fungsi getCachedPoskoStats dibungkus dengan unstable_cache().
 * - revalidate: 30 detik (Time-based ISR)
 * - tags: ['isr-stats'] (On-Demand ISR)
 *
 * Efek:
 * 1. Saat user refresh halaman atau ketik filter pencarian,
 *    data & timestamp di bawah TIDAK AKAN BERUBAH selama masih dalam jeda 30 detik.
 * 2. Setelah 30 detik, request berikutnya di latar belakang akan me-regenerasi data baru.
 * 3. Jika tombol 'Revalidasi Sekarang' diklik, Server Action akan langsung
 *    menghapus cache (On-Demand Revalidation) dan memperbarui timestamp seketika!
 */
const getCachedPoskoStats = unstable_cache(
  async () => {
    // Simulasi pengambilan data agregat / query database yang berat
    const now = new Date();
    return {
      cachedAt: now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3,
      }),
      totalTemuan: 42,
      sudahDiklaim: 27,
      tersedia: 15,
      versionId: Math.floor(1000 + Math.random() * 9000),
    };
  },
  ["demo-posko-stats"],
  {
    revalidate: 30, // 30 detik time-based ISR
    tags: ["isr-stats"],
  }
);

export default async function IsrStatsCard() {
  const stats = await getCachedPoskoStats();

  return (
    <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-5 shadow-xs transition-all">
      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-200/70 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-sky-600 px-3 py-1 text-xs font-bold text-white shadow-xs">
            🔄 ISR COMPONENT (Cached 30s)
          </span>
          <span className="text-xs font-medium text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md">
            Incremental Static Regeneration
          </span>
        </div>

        <span className="text-xs font-mono font-semibold text-sky-900 bg-white/80 border border-sky-200 px-2.5 py-1 rounded-md">
          ⏱️ Cache Created: {stats.cachedAt} WIB
        </span>
      </div>

      {/* Konten Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl bg-white border border-sky-100 p-3 text-center shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Temuan
          </span>
          <span className="text-xl font-black text-sky-900">{stats.totalTemuan}</span>
        </div>

        <div className="rounded-xl bg-white border border-sky-100 p-3 text-center shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Telah Diambil
          </span>
          <span className="text-xl font-black text-emerald-700">{stats.sudahDiklaim}</span>
        </div>

        <div className="rounded-xl bg-white border border-sky-100 p-3 text-center shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Masih di Posko
          </span>
          <span className="text-xl font-black text-amber-700">{stats.tersedia}</span>
        </div>
      </div>

      {/* Kontrol & Penjelasan Interaktif */}
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-sky-200/60 text-xs">
        <p className="text-sky-900 leading-relaxed text-[11px]">
          💡 <strong>Coba amati:</strong> Saat Anda refresh browser atau mencari barang, jam di widget ini <strong>TETAP DIAM</strong> (di-cache 30 detik), sedangkan jam di Dynamic Catalog di bawah selalu berubah setiap detik!
        </p>

        <form action={revalidateIsrDemo} className="shrink-0">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-semibold px-3 py-1.5 text-xs shadow-xs transition-all cursor-pointer"
          >
            <span>⚡ Revalidasi Sekarang (On-Demand)</span>
          </button>
        </form>
      </div>
    </div>
  );
}
