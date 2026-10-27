"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Search, Home } from "lucide-react";
import { useChromeVisibility } from "@/components/shared/ChromeVisibility";

export default function NotFound() {
  const { setIsNotFound } = useChromeVisibility();

  useEffect(() => {
    setIsNotFound(true);

    return () => setIsNotFound(false);
  }, [setIsNotFound]);

  return (
    <div
      data-not-found
      className="min-h-[75vh] w-full flex items-center justify-center p-6 bg-[#fafcfb]"
    >
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-2xl border border-[#e2eee9] shadow-sm">
        {/* 404 Illustration / Icon Badge */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-[#eaf6f2] flex items-center justify-center border border-[#d2e7df]">
          <Search className="w-9 h-9 text-[#0d7565]" />
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#0d7565] text-[11px] font-bold text-white shadow-xs">
            404
          </span>
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#102d2a]">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-[#52706a] leading-relaxed">
            Maaf, halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d7565] hover:bg-[#07564a] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <Link
            href="/pencarian"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#f1f8f5] text-[#0d7565] border border-[#d2e5df] text-xs font-semibold transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Cari Barang</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
