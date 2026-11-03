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
      className="p-3 hover:bg-[#fafbfb] transition-colors flex items-center justify-between border-b border-[#e2ece8] last:border-0"
    >
      <div className="flex-1 min-w-0 pr-4">
        <p className="font-bold text-xs md:text-sm text-[#102824] truncate">
          {item.jenis.name} {item.merek.name}
        </p>
        <p className="text-[11px] text-[#526b65] truncate mt-0.5">
          Kode: <span className="font-mono font-semibold text-[#0d7565]">{item.businessCode}</span> | Lokasi: {item.lokasi.name}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {item.matchScore >= 75 && (
          <span
            className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
              item.matchScore === 100
                ? "bg-[#eef7f4] text-[#0d7565] border border-[#d2e5df]"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            {item.matchScore}% Mirip
          </span>
        )}
        <button
          type="button"
          onClick={() => setDetailItem(item)}
          className="px-3 py-1.5 bg-[#0d7565] hover:bg-[#0a5d50] active:scale-[0.98] text-white text-[11px] font-bold rounded-lg transition-all shadow-xs cursor-pointer border-none outline-none"
        >
          Lihat Rincian
        </button>
      </div>
    </li>
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label htmlFor="searchFoundItemInput" className="block text-xs font-semibold text-[#526b65] mb-1.5">
        Cari di Riwayat Barang Temuan (Opsional)
      </label>

      {/* Input Pencarian */}
      <input
        id="searchFoundItemInput"
        type="text"
        className="w-full px-4 py-2.5 border border-[#d2e5df] rounded-xl focus:border-[#0d7565] focus:ring-2 focus:ring-[#0d7565]/20 bg-white transition-all text-xs md:text-sm text-[#142e29] outline-none"
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
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-[#e2ece8] rounded-xl shadow-lg max-h-80 overflow-y-auto">
          {/* Tab filter All / 100% / 75% */}
          <div className="flex p-1.5 gap-1 border-b border-[#e2ece8] sticky top-0 bg-white/95 backdrop-blur-xs z-10">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-2.5 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer border outline-none ${
                  activeTab === tab.key
                    ? "bg-[#eef7f4] text-[#0d7565] border-[#a8dbc9] shadow-xs"
                    : "bg-transparent text-[#526b65] hover:text-[#102824] border-transparent hover:bg-[#fafbfb]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="p-4 text-center text-xs text-[#526b65]">Mencari...</div>
          ) : results.length > 0 ? (
            <ul className="divide-y divide-[#e2ece8]">
              {activeTab === "all" ? (
                <>
                  {match100.map(renderItem)}
                  {match100.length > 0 && match75.length > 0 && (
                    <li className="px-3 py-1.5 bg-[#fafbfb] text-[10px] font-bold text-[#526b65] uppercase tracking-wider">
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
            <div className="p-4 text-center text-xs text-[#526b65]">
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
              <p className="text-[11px] text-[#526b65] uppercase font-bold tracking-wider">Kode Unik (Business Code)</p>
              <p className="text-sm font-mono font-bold text-[#0d7565]">{detailItem.businessCode}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-[#526b65] uppercase font-bold tracking-wider">Kategori Barang</p>
                <p className="text-sm font-semibold text-[#102824]">{detailItem.jenis?.name}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#526b65] uppercase font-bold tracking-wider">Merek / Warna</p>
                <p className="text-sm font-semibold text-[#102824]">
                  {detailItem.merek?.name || "-"} ({detailItem.warna?.name || "-"})
                </p>
              </div>
            </div>
            <div>
              <p className="text-[11px] text-[#526b65] uppercase font-bold tracking-wider">Lokasi Ditemukan</p>
              <p className="text-sm font-semibold text-[#102824]">{detailItem.lokasi?.name}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#526b65] uppercase font-bold tracking-wider">Deskripsi Tambahan</p>
              <p className="text-xs md:text-sm text-[#102824] p-3 bg-[#fafbfb] border border-[#e2ece8] rounded-xl mt-1 whitespace-pre-wrap">
                {detailItem.additionalDesc || "Tidak ada deskripsi tambahan."}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#526b65] uppercase font-bold tracking-wider">Status Keaktifan</p>
              <span
                className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold mt-1 ${
                  detailItem.status === "FOUND"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : detailItem.status === "CLAIMED"
                    ? "bg-[#eef7f4] text-[#0d7565] border border-[#d2e5df]"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {detailItem.status}
              </span>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#e2ece8] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDetailItem(null)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#526b65] rounded-xl transition-colors text-xs font-bold cursor-pointer border-none outline-none"
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
              className="px-5 py-2 bg-[#0d7565] hover:bg-[#0a5d50] active:scale-[0.98] text-white rounded-xl transition-all text-xs font-bold shadow-xs cursor-pointer border-none outline-none"
            >
              Pilih &amp; Proses
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
