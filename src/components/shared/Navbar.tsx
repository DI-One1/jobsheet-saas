"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import SearchBar from "./SearchBar";
import Notification from "./Notification";
import UserProfile from "./UserProfile";
import NavTabs from "./NavTabs";
import { isPetugasEmail } from "@/lib/petugas-access";

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded, user } = useUser();

  const isPublicPage =
    pathname === "/" ||
    pathname === "/tentang-kami" ||
    pathname === "/beri-saran";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPetugas = user?.emailAddresses.some((email) =>
    isPetugasEmail(email.emailAddress)
  );

  if (isPublicPage) {
    return (
      <header className="bg-white sticky top-0 z-[1030] shadow-xs border-b border-[#e2ece8]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex items-center justify-between">
            {/* Logo LACAK */}
            <Link
              href="/"
              className="text-2xl font-bold text-[#0d7565] tracking-wide hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              LACAK
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-2">
              <Link
                href="/tentang-kami"
                className={`text-xs px-3.5 py-1.5 rounded-xl transition-all no-underline ${
                  pathname === "/tentang-kami"
                    ? "bg-[#eef7f4] text-[#0d7565] font-semibold"
                    : "text-[#526b65] hover:text-[#0d7565] hover:bg-[#f1f7f5]"
                }`}
              >
                Tentang Kami
              </Link>

              <Link
                href="/beri-saran"
                className={`text-xs px-3.5 py-1.5 rounded-xl transition-all no-underline ${
                  pathname === "/beri-saran"
                    ? "bg-[#eef7f4] text-[#0d7565] font-semibold"
                    : "text-[#526b65] hover:text-[#0d7565] hover:bg-[#f1f7f5]"
                }`}
              >
                Beri Saran
              </Link>

              {isLoaded && isSignedIn && isPetugas && (
                <Link
                  href="/dashboard"
                  className="text-xs font-semibold tracking-wide text-[#0d7565] bg-[#eef7f4] hover:bg-[#e0f1eb] border border-[#d2e5df] px-3 py-1.5 rounded-xl transition-colors"
                >
                  Dashboard Petugas
                </Link>
              )}

              <UserProfile />
            </nav>

            {/* Mobile Actions: Profile + Hamburger */}
            <div className="flex items-center gap-2.5 md:hidden">
              <UserProfile />

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label="Buka menu navigasi"
                className="flex flex-col items-center justify-center w-8 h-8 rounded-lg border border-[#d6e5df] text-[#0d7565] bg-white hover:bg-[#eef7f4] transition-colors p-1.5 gap-1 cursor-pointer"
              >
                <span className="w-4 h-0.5 bg-current rounded-full" />
                <span className="w-4 h-0.5 bg-current rounded-full" />
                <span className="w-4 h-0.5 bg-current rounded-full" />
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pt-3 border-t border-[#e2ece8] flex flex-col gap-2 animate-fadeIn pb-2">
              <Link
                href="/tentang-kami"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-xs font-semibold py-2 px-3 rounded-lg transition-colors ${
                  pathname === "/tentang-kami"
                    ? "bg-[#eef7f4] text-[#0d7565]"
                    : "text-[#526b65] hover:bg-[#f1f7f5] hover:text-[#0d7565]"
                }`}
              >
                Tentang Kami
              </Link>

              <Link
                href="/beri-saran"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-xs font-semibold py-2 px-3 rounded-lg transition-colors ${
                  pathname === "/beri-saran"
                    ? "bg-[#eef7f4] text-[#0d7565]"
                    : "text-[#526b65] hover:bg-[#f1f7f5] hover:text-[#0d7565]"
                }`}
              >
                Beri Saran
              </Link>

              {isLoaded && isSignedIn && isPetugas && (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-semibold py-2 px-3 rounded-lg text-[#0d7565] bg-[#eef7f4] border border-[#d2e5df] hover:bg-[#e0f1eb] transition-colors"
                >
                  Dashboard Petugas
                </Link>
              )}
            </div>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-[1030] bg-white border-b border-[#e2ece8] shadow-xs">
      
      {/* BARIS 1: Logo, SearchBar, Notifikasi & User Profile */}
      <div className="container mx-auto px-4 md:px-8 py-3 relative z-30">
        <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[140px_1fr_auto] gap-4 md:gap-8 items-center">
          
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="text-2xl font-bold text-[#0d7565] tracking-wide hover:opacity-90 transition-opacity"
            >
              LACAK
            </Link>
            <span className="hidden sm:inline-block rounded-md bg-[#eef7f4] border border-[#d2e5df] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[#0d7565]">
              Petugas
            </span>
          </div>

          <div className="w-full">
            <Suspense fallback={<div className="w-full bg-[#f8faf9] border border-[#d6e5df] rounded-xl py-2 h-[38px] animate-pulse max-w-lg mx-auto" />}>
              <SearchBar />
            </Suspense>
          </div>

          <div className="flex items-center gap-2.5 justify-end">
            <Notification />
            <UserProfile />
          </div>

        </div>
      </div>

      {/* BARIS 2: Tab Navigasi (Garis Pembatas Atas) */}
      <div className="border-t border-[#edf3f0] bg-[#fafbfb] relative z-10">
        <NavTabs />
      </div>

    </header>
  );
}
