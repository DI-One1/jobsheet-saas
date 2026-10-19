// src/app/test/HybridExplanationCard.tsx
/**
 * 5. HYBRID RENDERING EXPLANATION (Ringkas untuk Siswa)
 */
export default function HybridExplanationCard() {
  return (
    <section className="border rounded-lg p-4 bg-white">
      <h3 className="text-sm font-bold">
        🧠 Mengapa Ini Disebut Hybrid Rendering?
      </h3>
      <p className="mt-1 text-xs text-slate-600">
        Dalam 1 halaman (<code className="font-mono bg-slate-100 px-1 rounded">/test</code>),
        kita membagi tugas sesuai perannya:
      </p>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
        <div className="border rounded p-3 bg-emerald-50">
          <span className="font-bold text-emerald-800 block mb-1">1. Header (Static SSG)</span>
          <p className="text-[11px] text-emerald-700">
            Dirender 1x saat build. Cepat & instan.
          </p>
        </div>

        <div className="border rounded p-3 bg-sky-50">
          <span className="font-bold text-sky-800 block mb-1">2. Statistik (ISR)</span>
          <p className="text-[11px] text-sky-700">
            Di-cache 30 detik, bisa diregenerasi on-demand.
          </p>
        </div>

        <div className="border rounded p-3 bg-teal-50">
          <span className="font-bold text-teal-800 block mb-1">3. Katalog (Dynamic SSR)</span>
          <p className="text-[11px] text-teal-700">
            Merender ulang di Server setiap request.
          </p>
        </div>

        <div className="border rounded p-3 bg-amber-50">
          <span className="font-bold text-amber-800 block mb-1">4. SearchBar (Client)</span>
          <p className="text-[11px] text-amber-700">
            Interaksi browser via &quot;use client&quot;.
          </p>
        </div>
      </div>
    </section>
  );
}
