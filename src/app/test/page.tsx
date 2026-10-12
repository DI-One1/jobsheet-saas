// src/app/test/page.tsx
import Link from 'next/link';
import StaticBanner from './StaticBanner';
import IsrStatsCard from './IsrStatsCard';
import SearchBar from './SearchBar';
import DynamicCatalog from './DynamicCatalog';
import HybridExplanationCard from './HybridExplanationCard';

export const metadata = {
  title: 'Demo Hybrid Rendering Posko Barang | Kelompok 5',
};

interface TestPageProps {
  searchParams: Promise<{ q?: string; kategori?: string }>;
}

export default async function TestPage({ searchParams }: TestPageProps) {
  // Menerima searchParams secara async (Next.js 15+)
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || '';
  const kategori = resolvedParams.kategori || 'Semua';

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 pb-12">
      {/* Top Navigation */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-emerald-800 px-2 py-0.5 text-xs font-bold text-white">
              KELOMPOK 5
            </span>
            <span className="text-xs font-semibold text-slate-600">
              Demo Hybrid Rendering (Mini Posko SaaS)
            </span>
          </div>
          <Link
            href="/tentang-kami"
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-900"
          >
            ← Kembali ke Tentang Kami
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <main className="mx-auto max-w-5xl px-4 pt-6 space-y-5">
        {/* 1. Header Statis (Static Component) */}
        <StaticBanner />

        {/* 2. Statistik Ringkasan Posko (ISR - Cached 30s & On-Demand) */}
        <IsrStatsCard />

        {/* 3. Search & Filter Bar (Client Component "use client") */}
        <SearchBar />

        {/* 4. Katalog Barang Dinamis (Dynamic Server Component) */}
        <DynamicCatalog q={q} kategori={kategori} />

        {/* 5. Kartu Penjelasan Ringkas untuk Siswa */}
        <HybridExplanationCard />
      </main>
    </div>
  );
}