// src/app/test/SearchBar.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

/**
 * 3. CLIENT COMPONENT ("use client")
 * Menangani interaksi browser (mengetik search & klik kategori).
 * Mengubah URL Query Parameter menggunakan useRouter & useSearchParams.
 */
const KATEGORI_LIST = ['Semua', 'Dompet', 'Kunci', 'Dokumen', 'Elektronik', 'Lainnya'];

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentQ = searchParams.get('q') || '';
    const currentCategory = searchParams.get('kategori') || 'Semua';
    const [queryInput, setQueryInput] = useState(currentQ);

    const updateUrl = (newQ: string, newCat: string) => {
        const params = new URLSearchParams();
        if (newQ.trim()) params.set('q', newQ.trim());
        if (newCat && newCat !== 'Semua') params.set('kategori', newCat);
        router.push(`/test?${params.toString()}`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUrl(queryInput, currentCategory);
    };

    return (
        <section className="border rounded-lg p-4 bg-amber-50">
            <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase text-amber-700 tracking-wider">
                    Client Component (&quot;use client&quot;)
                </span>
                <span className="text-[10px] font-mono text-amber-600">
                    Render: Browser (Hooks)
                </span>
            </div>

            {/* Form Pencarian */}
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    placeholder="Cari barang (misal: Dompet, Kunci)..."
                    className="flex-1 border rounded px-3 py-2 text-xs bg-white focus:outline-none focus:border-amber-500"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded hover:bg-amber-700 cursor-pointer"
                >
                    Cari
                </button>
            </form>

            {/* Filter Kategori */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-amber-900">Kategori:</span>
                {KATEGORI_LIST.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => updateUrl(queryInput, cat)}
                        className={`px-3 py-1 text-xs font-medium rounded border cursor-pointer ${currentCategory === cat
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white text-amber-800 border-amber-300 hover:bg-amber-100'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </section>
    );
}