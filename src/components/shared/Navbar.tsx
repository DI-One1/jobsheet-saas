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
      <header className="bg-green-dark sticky top-0 z-[1030] shadow-md border-b border-white/10">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex items-center justify-between">
            {/* Logo LACAK Orisinal */}
            <Link
              href="/"
              className="text-2xl font-black text-white tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <span className="text-[#3dbd84]">●</span>
              <span>LACAK</span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/tentang-kami"
                className={`text-xs font-semibold tracking-wide transition-colors ${
                  pathname === "/tentang-kami"
                    ? "text-[#3dbd84] border-b-2 border-[#3dbd84] pb-0.5"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Tentang Kami
              </Link>

              <Link
                href="/beri-saran"
                className={`text-xs font-semibold tracking-wide transition-colors ${
                  pathname === "/beri-saran"
                    ? "text-[#3dbd84] border-b-2 border-[#3dbd84] pb-0.5"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Beri Saran
              </Link>

              {isLoaded && isSignedIn && isPetugas && (
                <Link
                  href="/dashboard"
                  className="text-xs font-semibold tracking-wide text-white/85 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Dashboard Petugas
                </Link>
              )}

              <UserProfile />
            </nav>

            {/* Mobile Actions: Profile + Hamburger */}
            <div className="flex items-center gap-3 md:hidden">
              <UserProfile />

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label="Buka menu navigasi"
                className="flex flex-col items-center justify-center w-8 h-8 rounded-lg border border-white/20 text-white bg-white/10 hover:bg-white/20 transition-colors p-1.5 gap-1"
              >
                <span className="w-4 h-0.5 bg-current rounded-full" />
                <span className="w-4 h-0.5 bg-current rounded-full" />
                <span className="w-4 h-0.5 bg-current rounded-full" />
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pt-3 border-t border-white/15 flex flex-col gap-2 animate-fadeIn pb-2">
              <Link
                href="/tentang-kami"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-xs font-semibold py-2 px-3 rounded-lg transition-colors ${
                  pathname === "/tentang-kami"
                    ? "bg-white/15 text-[#3dbd84]"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                Tentang Kami
              </Link>

              <Link
                href="/beri-saran"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-xs font-semibold py-2 px-3 rounded-lg transition-colors ${
                  pathname === "/beri-saran"
                    ? "bg-white/15 text-[#3dbd84]"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                Beri Saran
              </Link>

              {isLoaded && isSignedIn && isPetugas && (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-semibold py-2 px-3 rounded-lg text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 transition-colors"
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
    <header className="bg-green-dark sticky top-0 z-[1030] shadow-md">
      
      {/* BARIS 1: Logo, SearchBar, Notifikasi & User Profile */}
      <div className="container mx-auto px-4 md:px-8 py-3">
        <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[120px_1fr_auto] gap-4 md:gap-10 items-center">
          
          <Link href="/" className="text-2xl font-bold text-white tracking-wide hover:opacity-90 transition-opacity">
            LACAK
          </Link>

          <div className="w-full">
            <Suspense fallback={<div className="w-full bg-white/10 rounded-full py-2.5 h-[42px] animate-pulse" />}>
              <SearchBar />
            </Suspense>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <Notification />
            <UserProfile />
          </div>

        </div>
      </div>

      {/* BARIS 2: Tab Navigasi (Garis Pembatas Atas) */}
      <div className="border-t border-white/10 bg-green-dark relative z-[1020]">
        <NavTabs />
      </div>

    </header>
  );
}
