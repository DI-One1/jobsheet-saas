"use client";

import { useState, useEffect, useRef } from "react";
import { searchOldFoundItems } from "@/features/item/actions/search-items";
import { FoundItemMatch, MatchLevelFilter } from "../types";
import { Modal } from "@/components/ui/Modal";

interface SearchableFoundItemProps {
  currentFormState: {
    jenisId?: string;
    warnaId?: string;
    merekId?: string;
    lokasiId?: string;
  };
  onSelect: (foundItem: FoundItemMatch) => void;
}

const TABS: { key: MatchLevelFilter; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "100", label: "100% Sempurna" },
  { key: "75", label: "75% Mendekati" },
];

export default function SearchableFoundItem({ currentFormState, onSelect }: SearchableFoundItemProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoundItemMatch[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<MatchLevelFilter>("all");
  const [detailItem, setDetailItem] = useState<FoundItemMatch | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Menutup dropdown jika klik di luar elemen
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce logic untuk API Call
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const data = await searchOldFoundItems(query, currentFormState, activeTab);
        setResults(data as unknown as FoundItemMatch[]);
      } catch (error) {
        console.error("Gagal mengambil data", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (isOpen) fetchItems();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, currentFormState, isOpen, activeTab]);

  const match100 = results.filter((r) => r.matchScore === 100);
  const match75 = results.filter((r) => r.matchScore === 75);
  const others = results.filter((r) => r.matchScore !== 100 && r.matchScore !== 75);

  const renderItem = (item: FoundItemMatch) => (
    <li
      key={item.id}
      className="p-3 hover:bg-gray-50 transition-colors flex items-center justify-between border-b last:border-0"
    >
      <div className="flex-1 min-w-0 pr-4">
        <p className="font-bold text-sm text-green-dark truncate">
          {item.jenis.name} {item.merek.name}
        </p>
        <p className="text-xs text-gray-500 truncate">
          Kode: <span className="font-mono text-green-mid">{item.businessCode}</span> | Lokasi: {item.lokasi.name}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {item.matchScore >= 75 && (
          <span
            className={`px-2 py-1 text-[10px] font-bold rounded-full ${
              item.matchScore === 100
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-amber-100 text-amber-700 border border-amber-200"
            }`}
          >
            {item.matchScore}% Mirip
          </span>
        )}
        <button
          type="button"
          onClick={() => setDetailItem(item)}
          className="px-3 py-1.5 bg-green-dark hover:bg-green-mid text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer border-none outline-none"
        >
          Lihat Rincian
        </button>
      </div>
    </li>
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Cari di Riwayat Barang Temuan (Opsional)
      </label>

      {/* Input Pencarian */}
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-accent focus:border-transparent outline-none transition-all text-sm"
        placeholder="Ketik kode unik, merek, atau jenis barang..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onClick={() => setIsOpen(true)}
      />

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto">
          {/* Tab filter All / 100% / 75% */}
          <div className="flex p-1.5 gap-1 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-xs z-10">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-2.5 py-1.5 text-[11px] font-bold rounded-md transition-all cursor-pointer border outline-none ${
                  activeTab === tab.key
                    ? "bg-emerald-50/90 text-green-dark border-emerald-300/80 shadow-[0_0_12px_rgba(61,189,132,0.18)]"
                    : "bg-transparent text-gray-500 hover:text-gray-800 border-transparent hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="p-4 text-center text-sm text-gray-500">Mencari...</div>
          ) : results.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {activeTab === "all" ? (
                <>
                  {match100.map(renderItem)}
                  {match100.length > 0 && match75.length > 0 && (
                    <li className="px-3 py-1.5 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      75% mendekati
                    </li>
                  )}
                  {match75.map(renderItem)}
                  {others.map(renderItem)}
                </>
              ) : (
                results.map(renderItem)
              )}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              Tidak ada barang lawas yang cocok.
            </div>
          )}
        </div>
      )}

      {/* Modal Detail Barang Temuan */}
      {detailItem && (
        <Modal
          isOpen={!!detailItem}
          onClose={() => setDetailItem(null)}
          title="Rincian Barang Temuan"
        >
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Kode Unik (Business Code)</p>
              <p className="text-sm font-mono font-bold text-green-mid">{detailItem.businessCode}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Kategori Barang</p>
                <p className="text-sm font-medium text-gray-800">{detailItem.jenis?.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Merek / Warna</p>
                <p className="text-sm font-medium text-gray-800">
                  {detailItem.merek?.name || "-"} ({detailItem.warna?.name || "-"})
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Lokasi Ditemukan</p>
              <p className="text-sm font-medium text-gray-800">{detailItem.lokasi?.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Deskripsi Tambahan</p>
              <p className="text-sm font-medium text-gray-800 p-2 bg-gray-50 border rounded-lg mt-1 whitespace-pre-wrap animate-none">
                {detailItem.additionalDesc || "Tidak ada deskripsi tambahan."}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Status Keaktifan</p>
              <span
                className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold mt-1 ${
                  detailItem.status === "FOUND"
                    ? "bg-blue-100 text-blue-800"
                    : detailItem.status === "CLAIMED"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {detailItem.status}
              </span>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDetailItem(null)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors text-sm font-semibold cursor-pointer border-none outline-none"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => {
                onSelect(detailItem);
                setDetailItem(null);
                setIsOpen(false);
              }}
              className="px-5 py-2 bg-green-accent hover:bg-green-mid hover:scale-105 active:scale-95 text-white rounded-xl transition-all text-sm font-bold cursor-pointer border-none outline-none"
            >
              Pilih & Proses
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
