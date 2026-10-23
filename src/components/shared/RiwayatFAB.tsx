"use client";

import { useState, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, X } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";

interface RiwayatFABProps {
  /** Href untuk navigasi Tambah Data */
  tambahHref: string;
  /** Label tooltip tombol Tambah Data */
  tambahLabel: string;
  /** Ikon tombol Tambah Data (ReactNode, mis. <PackagePlus className="h-5 w-5" />) */
  tambahIcon: ReactNode;
  /** Label tooltip tombol Hapus (mis. "Hapus Riwayat Temuan") */
  hapusLabel: string;
  /** Jumlah data aktif — tombol Hapus hanya tampil jika > 0 */
  jumlahData: number;
  /** Callback ketika tombol Hapus ditekan (setelah FAB ditutup) */
  onHapus: () => void;
}

/**
 * Expandable Floating Action Button (FAB) reusable untuk halaman riwayat.
 *
 * Desain dan perilaku identik dengan FAB Data Warga di WargaClient.tsx:
 * - Tombol utama: Plus (tertutup) -> X (terbuka), warna teal/abu-abu.
 * - Tombol Tambah Data: teal, navigasi via router.push().
 * - Tombol Hapus Data: merah, hanya tampil bila jumlahData > 0.
 * - Tutup via klik luar, Escape, atau klik tombol utama.
 * - Backdrop blur tipis di mobile saat FAB terbuka.
 */
export default function RiwayatFAB({
  tambahHref,
  tambahLabel,
  tambahIcon,
  hapusLabel,
  jumlahData,
  onHapus,
}: RiwayatFABProps) {
  const [isFabOpen, setIsFabOpen] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useClickOutside(fabRef, () => setIsFabOpen(false));
  useKeyboardShortcut("Escape", () => {
    if (isFabOpen) setIsFabOpen(false);
  });

  return (
    <>
      <div
        ref={fabRef}
        className="fixed bottom-8 right-8 z-[1000] flex flex-col-reverse items-end gap-3"
      >
        {/* Tombol Utama (Toggle) */}
        <button
          type="button"
          onClick={() => setIsFabOpen((prev) => !prev)}
          aria-expanded={isFabOpen}
          aria-label={isFabOpen ? "Tutup menu aksi" : "Buka menu aksi"}
          className={`flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-all duration-300 cursor-pointer border-none outline-none ${
            isFabOpen
              ? "bg-gray-700 hover:bg-gray-800"
              : "bg-[#0d7565] hover:bg-[#0a5d50]"
          }`}
        >
          <div className="relative w-6 h-6">
            <Plus
              className={`h-6 w-6 text-white absolute inset-0 transition-all duration-300 ${
                isFabOpen
                  ? "opacity-0 rotate-90 scale-75"
                  : "opacity-100 rotate-0 scale-100"
              }`}
            />
            <X
              className={`h-6 w-6 text-white absolute inset-0 transition-all duration-300 ${
                isFabOpen
                  ? "opacity-100 rotate-0 scale-100"
                  : "opacity-0 -rotate-90 scale-75"
              }`}
            />
          </div>
        </button>

        {/* Tombol Tambah Data */}
        <div
          className={`flex items-center gap-2.5 transition-all duration-200 ${
            isFabOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-3 pointer-events-none"
          }`}
        >
          <span className="hidden sm:block bg-gray-900/85 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap backdrop-blur-sm">
            {tambahLabel}
          </span>
          <button
            type="button"
            onClick={() => {
              setIsFabOpen(false);
              router.push(tambahHref);
            }}
            title={tambahLabel}
            className="flex items-center justify-center w-12 h-12 bg-[#0d7565] text-white rounded-full shadow-lg hover:bg-[#0a5d50] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border-none outline-none"
          >
            {tambahIcon}
          </button>
        </div>

        {/* Tombol Hapus Data (hanya bila ada data) */}
        {jumlahData > 0 && (
          <div
            className={`flex items-center gap-2.5 transition-all duration-200 ${
              isFabOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-3 pointer-events-none"
            }`}
            style={{ transitionDelay: isFabOpen ? "50ms" : "0ms" }}
          >
            <span className="hidden sm:block bg-gray-900/85 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap backdrop-blur-sm">
              {hapusLabel} ({jumlahData})
            </span>
            <button
              type="button"
              onClick={() => {
                setIsFabOpen(false);
                onHapus();
              }}
              title={hapusLabel}
              className="flex items-center justify-center w-12 h-12 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border-none outline-none"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Backdrop mobile saat FAB terbuka */}
      {isFabOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/20 backdrop-blur-[1px] sm:hidden"
          onClick={() => setIsFabOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
