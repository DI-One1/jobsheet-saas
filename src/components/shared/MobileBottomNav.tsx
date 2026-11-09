"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { Home, Search, PlusCircle, User, ShieldCheck } from "lucide-react";
import { isPetugasEmail } from "@/lib/petugas-access";
import { useChromeVisibility } from "./ChromeVisibility";

const hiddenPaths = new Set([
  "/access-denied",
  "/sign-in",
  "/sign-up",
]);

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded, user } = useUser();
  const { openUserProfile } = useClerk();
  const { isNotFound } = useChromeVisibility();

  if (
    isNotFound ||
    hiddenPaths.has(pathname) ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/test")
  ) {
    return null;
  }

  const isPetugas = user?.emailAddresses?.some((email) =>
    isPetugasEmail(email.emailAddress)
  );

  const isHomeActive = pathname === "/";
  const isSearchActive = pathname === "/pencarian";
  const isLaporActive = pathname === "/lapor";
  const isAccountActive = pathname === "/dashboard" || pathname.startsWith("/dashboard");

  return (
    <nav
      aria-label="Navigasi Bawah Ponsel"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e2ece8] shadow-[0_-4px_16px_rgba(0,0,0,0.04)] px-3 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] transition-transform"
    >
      <div className="grid grid-cols-4 items-center justify-around max-w-md mx-auto">
        {/* 1. Beranda */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 rounded-xl transition-all duration-150 active:scale-95 ${
            isHomeActive
              ? "text-[#0d7565] font-bold"
              : "text-[#526b65] hover:text-[#0d7565] font-medium"
          }`}
        >
          <Home className={`w-5 h-5 mb-0.5 stroke-[2] ${isHomeActive ? "text-[#0d7565]" : "text-[#526b65]"}`} />
          <span className="text-[10px] tracking-tight">Beranda</span>
        </Link>

        {/* 2. Cari / Kategori */}
        <Link
          href="/pencarian"
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 rounded-xl transition-all duration-150 active:scale-95 ${
            isSearchActive
              ? "text-[#0d7565] font-bold"
              : "text-[#526b65] hover:text-[#0d7565] font-medium"
          }`}
        >
          <Search className={`w-5 h-5 mb-0.5 stroke-[2] ${isSearchActive ? "text-[#0d7565]" : "text-[#526b65]"}`} />
          <span className="text-[10px] tracking-tight">Cari</span>
        </Link>

        {/* 3. Lapor */}
        <Link
          href="/lapor"
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 rounded-xl transition-all duration-150 active:scale-95 ${
            isLaporActive
              ? "text-[#0d7565] font-bold"
              : "text-[#526b65] hover:text-[#0d7565] font-medium"
          }`}
        >
          <PlusCircle className={`w-5 h-5 mb-0.5 stroke-[2] ${isLaporActive ? "text-[#0d7565]" : "text-[#526b65]"}`} />
          <span className="text-[10px] tracking-tight">Lapor</span>
        </Link>

        {/* 4. Akun / Dashboard */}
        {isLoaded && isSignedIn ? (
          isPetugas ? (
            <Link
              href="/dashboard"
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 rounded-xl transition-all duration-150 active:scale-95 ${
                isAccountActive
                  ? "text-[#0d7565] font-bold"
                  : "text-[#526b65] hover:text-[#0d7565] font-medium"
              }`}
            >
              <ShieldCheck className={`w-5 h-5 mb-0.5 stroke-[2] ${isAccountActive ? "text-[#0d7565]" : "text-[#526b65]"}`} />
              <span className="text-[10px] tracking-tight">Petugas</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => openUserProfile()}
              className="flex flex-col items-center justify-center min-h-[48px] py-1 rounded-xl text-[#526b65] hover:text-[#0d7565] font-medium transition-all duration-150 active:scale-95 cursor-pointer"
            >
              <User className="w-5 h-5 mb-0.5 stroke-[2] text-[#526b65]" />
              <span className="text-[10px] tracking-tight">Akun</span>
            </button>
          )
        ) : (
          <Link
            href="/sign-in"
            className="flex flex-col items-center justify-center min-h-[48px] py-1 rounded-xl text-[#526b65] hover:text-[#0d7565] font-medium transition-all duration-150 active:scale-95"
          >
            <User className="w-5 h-5 mb-0.5 stroke-[2] text-[#526b65]" />
            <span className="text-[10px] tracking-tight">Masuk</span>
          </Link>
        )}
      </div>
    </nav>
  );
}

