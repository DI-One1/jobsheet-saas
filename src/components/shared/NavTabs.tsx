"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, History, ChevronDown, PackagePlus, FileSpreadsheet, PackageCheck } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";

export default function NavTabs() {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname === path;
  const isRiwayatActive = pathname.startsWith("/riwayat");

  // Close on Click Outside
  useClickOutside(dropdownRef, () => {
    setIsDropdownOpen(false);
  });

  // Close on Escape
  useKeyboardShortcut("Escape", () => {
    setIsDropdownOpen(false);
  });

  return (
    <div className="container mx-auto px-4 md:px-5">
      <div className="grid grid-cols-1 md:grid-cols-[140px_1fr_auto] gap-4 md:gap-8 items-center w-full">
        <div className="col-span-1 md:col-start-2 flex flex-wrap items-center gap-1.5 md:gap-2.5 overflow-visible py-2">
          {/* 1. Beranda */}
          <Link
            href="/dashboard"
            className={`whitespace-nowrap text-xs md:text-sm px-3.5 md:px-4 py-2 rounded-xl transition-all no-underline flex items-center gap-2 select-none cursor-pointer ${
              isActive("/dashboard")
                ? "bg-[#eef7f4] text-[#0d7565] font-bold border border-[#cbe4dc] shadow-2xs"
                : "text-[#526b65] hover:text-[#0d7565] hover:bg-[#f1f7f5] font-medium border border-transparent"
            }`}
          >
            <LayoutDashboard className={`h-4 w-4 ${isActive("/dashboard") ? "text-[#0d7565]" : "text-[#526b65]"}`} />
            <span>Beranda</span>
          </Link>

          {/* 2. Data Warga */}
          <Link
            href="/data-warga"
            className={`whitespace-nowrap text-xs md:text-sm px-3.5 md:px-4 py-2 rounded-xl transition-all no-underline flex items-center gap-2 select-none cursor-pointer ${
              isActive("/data-warga")
                ? "bg-[#eef7f4] text-[#0d7565] font-bold border border-[#cbe4dc] shadow-2xs"
                : "text-[#526b65] hover:text-[#0d7565] hover:bg-[#f1f7f5] font-medium border border-transparent"
            }`}
          >
            <Users className={`h-4 w-4 ${isActive("/data-warga") ? "text-[#0d7565]" : "text-[#526b65]"}`} />
            <span>Data Warga</span>
          </Link>

          {/* 3. Dropdown Riwayat */}
          <div className="relative flex-shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              className={`whitespace-nowrap text-xs md:text-sm px-3.5 md:px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 select-none ${
                isRiwayatActive
                  ? "bg-[#eef7f4] text-[#0d7565] font-bold border border-[#cbe4dc] shadow-2xs"
                  : "text-[#526b65] hover:text-[#0d7565] hover:bg-[#f1f7f5] font-medium border border-transparent"
              }`}
            >
              <History className={`h-4 w-4 ${isRiwayatActive ? "text-[#0d7565]" : "text-[#526b65]"}`} />
              <span>Riwayat</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 flex flex-col bg-white rounded-2xl shadow-xl p-2 min-w-[240px] z-[2000] border border-[#e2ece8] text-[#102824] animate-in fade-in zoom-in-95 duration-150">
                <Link
                  href="/riwayat/temuan"
                  onClick={() => setIsDropdownOpen(false)}
                  className={`rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors no-underline flex items-center gap-2.5 ${
                    isActive("/riwayat/temuan")
                      ? "bg-[#0d7565] text-white shadow-xs"
                      : "text-[#1c3833] hover:bg-[#eef7f4] hover:text-[#0d7565]"
                  }`}
                >
                  <PackagePlus className="h-4 w-4" />
                  <span>Taruh Barang</span>
                </Link>
                <Link
                  href="/riwayat/laporan"
                  onClick={() => setIsDropdownOpen(false)}
                  className={`rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors no-underline flex items-center gap-2.5 ${
                    isActive("/riwayat/laporan")
                      ? "bg-[#0d7565] text-white shadow-xs"
                      : "text-[#1c3833] hover:bg-[#eef7f4] hover:text-[#0d7565]"
                  }`}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Laporan Kehilangan</span>
                </Link>
                <Link
                  href="/riwayat/pengambilan"
                  onClick={() => setIsDropdownOpen(false)}
                  className={`rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors no-underline flex items-center gap-2.5 ${
                    isActive("/riwayat/pengambilan")
                      ? "bg-[#0d7565] text-white shadow-xs"
                      : "text-[#1c3833] hover:bg-[#eef7f4] hover:text-[#0d7565]"
                  }`}
                >
                  <PackageCheck className="h-4 w-4" />
                  <span>Pengambilan Barang</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
