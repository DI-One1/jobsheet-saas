"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk, SignInButton } from "@clerk/nextjs";
import { isPetugasEmail } from "@/lib/petugas-access";

interface UserProfileProps {
  mode?: "petugas" | "public" | "auto";
}

export default function UserProfile({ mode = "auto" }: UserProfileProps) {
  const { isSignedIn, isLoaded, user } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!profileOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileOpen]);

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-2 p-1 pl-1.5 pr-3 rounded-full border border-[#d6e5df] bg-white animate-pulse">
        <div className="w-7 h-7 rounded-full bg-gray-200" />
        <div className="w-14 h-3 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button className="bg-[#0d7565] hover:bg-[#0a5d50] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-xs cursor-pointer">
          Masuk
        </button>
      </SignInButton>
    );
  }

  const isPetugas = user?.emailAddresses.some((email) =>
    isPetugasEmail(email.emailAddress)
  );

  // Tentukan apakah dropdown saat ini sedang berada di section petugas atau publik
  const isPetugasSection =
    mode === "petugas" ||
    (mode === "auto" &&
      !["/", "/tentang-kami", "/beri-saran", "/pencarian"].includes(pathname));

  const initialLetter = (user?.firstName || user?.fullName || "U").charAt(0).toUpperCase();

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Trigger Button (Pill Rounded) */}
      <button
        type="button"
        onClick={() => setProfileOpen(!profileOpen)}
        className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-[#d6e5df] hover:border-[#0d7565]/40 bg-white hover:bg-[#f6fbf9] transition-all shadow-xs cursor-pointer group"
        aria-expanded={profileOpen}
        aria-label="Menu akun pengguna"
      >
        {user?.imageUrl ? (
          <Image
            src={user.imageUrl}
            alt={user.fullName || "Avatar"}
            width={28}
            height={28}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500/20"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-[#0d7565] text-white flex items-center justify-center font-bold text-xs">
            {initialLetter}
          </div>
        )}
        <span className="text-xs font-semibold text-[#1a3833] max-w-[100px] truncate group-hover:text-[#0d7565] transition-colors">
          {user?.firstName || user?.fullName?.split(" ")[0] || "Akun"}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-[#52706a] transition-transform duration-200 ${
            profileOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Desktop / Petugas Profile Dropdown Panel */}
      {profileOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-[#dbe8e3] bg-white p-2 shadow-2xl z-[1050] animate-fadeIn text-left">
          {/* Header Card: Nama & Email */}
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#f6faf8] mb-1.5 border border-[#e8f2ee]">
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.fullName || "Avatar"}
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover ring-1 ring-emerald-600/20"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#0d7565] text-white flex items-center justify-center font-bold text-sm">
                {initialLetter}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-[#142e29] truncate flex items-center gap-1.5">
                <span className="truncate">{user?.fullName || user?.firstName || "Pengguna"}</span>
                {isPetugas && (
                  <span className="text-[9px] bg-emerald-100 text-[#0d7565] px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                    Petugas
                  </span>
                )}
              </div>
              <div className="text-[10.5px] text-[#617974] truncate">
                {user?.primaryEmailAddress?.emailAddress || ""}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-0.5 text-xs font-medium text-[#203c37]">
            {/* Box Redirect Khusus: Beranda Publik (jika di navbar petugas) atau Dashboard Petugas (jika di publik) */}
            {isPetugasSection ? (
              <Link
                href="/"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#eaf6f2] text-[#0d7565] font-semibold hover:bg-[#d9ede6] transition-colors"
              >
                <svg
                  className="w-4 h-4 text-[#0d7565] shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Beranda Publik</span>
              </Link>
            ) : isPetugas ? (
              <Link
                href="/dashboard"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#eaf6f2] text-[#0d7565] font-semibold hover:bg-[#d9ede6] transition-colors"
              >
                <svg
                  className="w-4 h-4 text-[#0d7565] shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>Dashboard Petugas</span>
              </Link>
            ) : null}

            {/* Kelola Profil Akun (Clerk modal) */}
            <button
              type="button"
              onClick={() => {
                setProfileOpen(false);
                openUserProfile();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#f1f7f5] hover:text-[#0d7565] transition-colors text-left cursor-pointer"
            >
              <svg
                className="w-4 h-4 text-[#5f7d77] shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Kelola Profil Akun</span>
            </button>

            {/* Separator */}
            <div className="my-1 border-t border-[#edf4f1]" />

            {/* Tentang Kami */}
            <Link
              href="/tentang-kami"
              onClick={() => setProfileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                pathname === "/tentang-kami"
                  ? "text-[#0d7565] bg-[#eef7f4] font-semibold"
                  : "hover:bg-[#f1f7f5] hover:text-[#0d7565]"
              }`}
            >
              <svg
                className="w-4 h-4 text-[#5f7d77] shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Tentang Kami</span>
            </Link>

            {/* Beri Saran */}
            <Link
              href="/beri-saran"
              onClick={() => setProfileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                pathname === "/beri-saran"
                  ? "text-[#0d7565] bg-[#eef7f4] font-semibold"
                  : "hover:bg-[#f1f7f5] hover:text-[#0d7565]"
              }`}
            >
              <svg
                className="w-4 h-4 text-[#5f7d77] shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>Beri Saran</span>
            </Link>

            {/* Separator */}
            <div className="my-1 border-t border-[#edf4f1]" />

            {/* Keluar (Logout) */}
            <button
              type="button"
              onClick={() => {
                setProfileOpen(false);
                signOut({ redirectUrl: "/" });
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer font-medium"
            >
              <svg
                className="w-4 h-4 text-red-500 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Keluar (Logout)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
