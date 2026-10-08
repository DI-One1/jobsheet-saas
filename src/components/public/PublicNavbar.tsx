"use client";

import Link from "next/link";
import { FormEvent, useState, useEffect, useRef, useMemo } from "react";
import { useClerk, useUser, SignInButton } from "@clerk/nextjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { isPetugasEmail } from "@/lib/petugas-access";

type PublicFilterState = {
  searchQuery: string;
  selectedSort: "newest" | "oldest" | "name";
  selectedCategory: string;
  selectedColor: string;
  selectedBrand: string;
  selectedLocation: string;
};

interface PublicNavbarProps {
  categories: { id: string; name: string }[];
  colors: { id: string; name: string }[];
  brands: { id: string; name: string }[];
  locations: { id: string; name: string }[];
}

export function emitPublicFilters(detail: PublicFilterState) {
  window.dispatchEvent(new CustomEvent<PublicFilterState>("lacak:public-filter", { detail }));
}

export default function PublicNavbar({
  categories,
  colors,
  brands,
  locations,
}: PublicNavbarProps) {
  const { isSignedIn, isLoaded, user } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<PublicFilterState>(() => ({
    searchQuery: searchParams.get("q") || "",
    selectedSort: (searchParams.get("sort") as PublicFilterState["selectedSort"]) || "newest",
    selectedCategory: searchParams.get("category") || "all",
    selectedColor: searchParams.get("color") || "all",
    selectedBrand: searchParams.get("brand") || "all",
    selectedLocation: searchParams.get("location") || "all",
  }));

  // Count active filters (excluding search query and default sort)
  const activeFilterCount = useMemo(() => {
    return [
      filters.selectedSort !== "newest",
      filters.selectedCategory !== "all",
      filters.selectedColor !== "all",
      filters.selectedBrand !== "all",
      filters.selectedLocation !== "all",
    ].filter(Boolean).length;
  }, [filters]);

  // Filter panel: auto-open if there are active filters from URL, otherwise closed
  const [filtersOpen, setFiltersOpen] = useState(() => {
    const hasActiveFromUrl =
      searchParams.has("sort") ||
      searchParams.has("category") ||
      searchParams.has("color") ||
      searchParams.has("brand") ||
      searchParams.has("location");
    return hasActiveFromUrl;
  });

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      const inToggle = mobileMenuRef.current?.contains(event.target as Node);
      const inDrawer = mobileDrawerRef.current?.contains(event.target as Node);
      if (!inToggle && !inDrawer) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Close menus on route changes
  useEffect(() => {
    setProfileOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const updateFilter = <K extends keyof PublicFilterState>(
    key: K,
    value: PublicFilterState[K]
  ) => {
    const next = { ...filters, [key]: value } as PublicFilterState;
    setFilters(next);
    emitPublicFilters(next);
    if (pathname === "/") {
      const params = new URLSearchParams();
      if (next.searchQuery.trim()) params.set("q", next.searchQuery.trim());
      if (next.selectedSort !== "newest") params.set("sort", next.selectedSort);
      if (next.selectedCategory !== "all") params.set("category", next.selectedCategory);
      if (next.selectedColor !== "all") params.set("color", next.selectedColor);
      if (next.selectedBrand !== "all") params.set("brand", next.selectedBrand);
      if (next.selectedLocation !== "all") params.set("location", next.selectedLocation);
      router.push(`/pencarian${params.toString() ? `?${params.toString()}` : ""}`);
    }
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (filters.searchQuery.trim()) params.set("q", filters.searchQuery.trim());
    if (filters.selectedSort !== "newest") params.set("sort", filters.selectedSort);
    if (filters.selectedCategory !== "all") params.set("category", filters.selectedCategory);
    if (filters.selectedColor !== "all") params.set("color", filters.selectedColor);
    if (filters.selectedBrand !== "all") params.set("brand", filters.selectedBrand);
    if (filters.selectedLocation !== "all") params.set("location", filters.selectedLocation);
    router.push(`/pencarian${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const resetFilters = () => {
    const next: PublicFilterState = {
      searchQuery: "",
      selectedSort: "newest",
      selectedCategory: "all",
      selectedColor: "all",
      selectedBrand: "all",
      selectedLocation: "all",
    };
    setFilters(next);
    emitPublicFilters(next);
    router.push(pathname === "/pencarian" ? "/pencarian" : "/");
  };

  const isPetugas = user?.emailAddresses.some((email) =>
    isPetugasEmail(email.emailAddress)
  );

  return (
    <header className="public-navbar">
      <div className="public-nav-inner">
        {/* Main Nav Row: Brand | Desktop Search + Filter Toggle | Profile */}
        <div className="public-nav-main">
          {/* Brand Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-green-dark tracking-wide hover:opacity-90 transition-opacity select-none shrink-0"
          >
            LACAK
          </Link>

          {/* Desktop Search Bar + Filter Toggle (Hidden on mobile/tablet, shown on lg+) */}
          <div className="hidden lg:flex items-center gap-2.5 flex-1">
            <form className="public-nav-search flex flex-1" onSubmit={handleSearch} role="search">
              <svg
                className="w-4 h-4 text-[#0d7565] shrink-0 ml-3.5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={filters.searchQuery}
                onChange={(event) => updateFilter("searchQuery", event.target.value)}
                placeholder="Cari barang, merek, atau kategori..."
                aria-label="Cari barang, merek, atau kategori"
              />
              <button type="submit" aria-label="Cari barang" className="sr-only">Cari</button>
            </form>

            {/* Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`public-filter-toggle ${activeFilterCount > 0 ? "filter-active" : ""}`}
              aria-expanded={filtersOpen}
              aria-label="Toggle filter barang"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className="filter-badge">{activeFilterCount}</span>
              )}
            </button>
          </div>

          {/* Desktop Profile / Masuk (Hidden on mobile, shown on lg+) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {!isLoaded ? (
              <div className="w-24 h-8 rounded-full bg-slate-100 animate-pulse" />
            ) : isSignedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-[#d6e5df] hover:border-green-dark/40 bg-white hover:bg-[#f6fbf9] transition-all shadow-xs cursor-pointer group"
                  aria-expanded={profileOpen}
                  aria-label="Menu akun pengguna"
                >
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.fullName || "Avatar"}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500/20"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-green-dark text-white flex items-center justify-center font-bold text-xs">
                      {(user?.firstName || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-[#1a3833] max-w-[100px] truncate group-hover:text-green-dark transition-colors">
                    {user?.firstName || user?.fullName?.split(" ")[0] || "Akun"}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 text-[#52706a] transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Desktop Profile Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-[#dbe8e3] bg-white p-2 shadow-lg z-50 animate-fadeIn text-left">
                    {/* Header: Nama & Email */}
                    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#f6faf8] mb-1.5 border border-[#e8f2ee]">
                      {user?.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt={user.fullName || "Avatar"}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-emerald-600/20"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-green-dark text-white flex items-center justify-center font-bold text-sm">
                          {(user?.firstName || "U").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#142e29] truncate flex items-center gap-1.5">
                          <span>{user?.fullName || user?.firstName || "Warga"}</span>
                          {isPetugas && (
                            <span className="text-[9px] bg-emerald-100 text-green-dark px-1.5 py-0.5 rounded font-bold uppercase">
                              Petugas
                            </span>
                          )}
                        </div>
                        <div className="text-[10.5px] text-[#617974] truncate">
                          {user?.primaryEmailAddress?.emailAddress || ""}
                        </div>
                      </div>
                    </div>

                    {/* Menu Utama */}
                    <div className="space-y-0.5 text-xs font-medium text-[#203c37]">
                      {isPetugas && (
                        <Link
                          href="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#eaf6f2] text-green-dark font-semibold hover:bg-[#d9ede6] transition-colors"
                        >
                          <svg className="w-4 h-4 text-green-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <span>Dashboard Petugas</span>
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false);
                          openUserProfile();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#f1f7f5] hover:text-green-dark transition-colors text-left cursor-pointer"
                      >
                        <svg className="w-4 h-4 text-[#5f7d77]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Kelola Profil Akun</span>
                      </button>

                      {/* Separator */}
                      <div className="my-1 border-t border-[#edf4f1]" />

                      {/* Menu Informasi (Dipindahkan dari Header) */}
                      <Link
                        href="/tentang-kami"
                        onClick={() => setProfileOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          pathname === "/tentang-kami"
                            ? "text-green-dark bg-[#eef7f4] font-semibold"
                            : "hover:bg-[#f1f7f5] hover:text-green-dark"
                        }`}
                      >
                        <svg className="w-4 h-4 text-[#5f7d77]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Tentang Kami</span>
                      </Link>

                      <Link
                        href="/beri-saran"
                        onClick={() => setProfileOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          pathname === "/beri-saran"
                            ? "text-green-dark bg-[#eef7f4] font-semibold"
                            : "hover:bg-[#f1f7f5] hover:text-green-dark"
                        }`}
                      >
                        <svg className="w-4 h-4 text-[#5f7d77]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>Beri Saran</span>
                      </Link>

                      {/* Separator */}
                      <div className="my-1 border-t border-[#edf4f1]" />

                      {/* Aksi: Logout */}
                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false);
                          signOut({ redirectUrl: "/" });
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer font-medium"
                      >
                        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Keluar (Logout)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest: Hamburger Menu with Masuk, Tentang Kami & Beri Saran in dropdown */
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-all cursor-pointer ${
                    profileOpen
                      ? "border-green-dark bg-green-dark text-white shadow-md"
                      : "border-[#d6e5df] bg-white text-[#4b6660] hover:border-green-dark/40 hover:bg-[#f6fbf9] hover:text-green-dark"
                  }`}
                  aria-expanded={profileOpen}
                  aria-label="Menu navigasi"
                >
                  {profileOpen ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>

                {/* Guest Desktop Dropdown Menu */}
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[#dbe8e3] bg-white p-2 shadow-lg z-50 animate-fadeIn text-left">
                    {/* Primary Action: Masuk / Login */}
                    <SignInButton mode="modal">
                      <button
                        type="button"
                        onClick={() => setProfileOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-green-dark hover:bg-[#164e3e] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                      >
                        <svg className="w-4 h-4 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <span>Masuk / Login</span>
                      </button>
                    </SignInButton>

                    {/* Separator */}
                    <div className="my-1.5 border-t border-[#edf4f1]" />

                    {/* Info Links */}
                    <div className="space-y-0.5 text-xs font-medium text-[#203c37]">
                      <Link
                        href="/tentang-kami"
                        onClick={() => setProfileOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          pathname === "/tentang-kami"
                            ? "text-green-dark bg-[#eef7f4] font-semibold"
                            : "hover:bg-[#f1f7f5] hover:text-green-dark"
                        }`}
                      >
                        <svg className="w-4 h-4 text-[#5f7d77]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Tentang Kami</span>
                      </Link>

                      <Link
                        href="/beri-saran"
                        onClick={() => setProfileOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          pathname === "/beri-saran"
                            ? "text-green-dark bg-[#eef7f4] font-semibold"
                            : "hover:bg-[#f1f7f5] hover:text-green-dark"
                        }`}
                      >
                        <svg className="w-4 h-4 text-[#5f7d77]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>Beri Saran</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Top Controls: Masuk / Profile + Filter Toggle + Hamburger (Hidden on lg+) */}
          <div className="flex lg:hidden items-center gap-2" ref={mobileMenuRef}>
            {/* Mobile Filter Toggle */}
            <button
              type="button"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`public-filter-toggle ${activeFilterCount > 0 ? "filter-active" : ""}`}
              aria-expanded={filtersOpen}
              aria-label="Toggle filter barang"
              style={{ height: 34, padding: "0 10px", fontSize: "11px" }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {activeFilterCount > 0 && (
                <span className="filter-badge" style={{ minWidth: 16, height: 16, fontSize: "9px" }}>{activeFilterCount}</span>
              )}
            </button>

            {/* If signed in: Sleek avatar button that opens drawer */}
            {isLoaded && isSignedIn && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center gap-1.5 p-0.5 pr-2 rounded-full border border-[#d6e5df] bg-white hover:bg-[#f6fbf9] transition-all cursor-pointer"
                aria-label="Profil dan menu"
              >
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || "Avatar"}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500/20"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-green-dark text-white flex items-center justify-center font-bold text-xs">
                    {(user?.firstName || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-[11px] font-semibold text-[#1a3833] max-w-[70px] truncate">
                  {user?.firstName || "Akun"}
                </span>
              </button>
            )}

            {/* If signed out: Compact Masuk button */}
            {isLoaded && !isSignedIn && (
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-dark text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Masuk</span>
                </button>
              </SignInButton>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-colors cursor-pointer ${
                mobileMenuOpen
                  ? "border-green-dark bg-green-dark text-white"
                  : "border-[#d6e5df] bg-white text-green-dark hover:bg-[#f1f7f5]"
              }`}
              aria-expanded={mobileMenuOpen}
              aria-label="Menu navigasi"
            >
              {mobileMenuOpen ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Row 2 on screens < lg) */}
        <form className="public-nav-search public-search-mobile" onSubmit={handleSearch} role="search">
          <svg
            className="w-4 h-4 text-[#0d7565] shrink-0 ml-3.5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={filters.searchQuery}
            onChange={(event) => updateFilter("searchQuery", event.target.value)}
            placeholder="Cari barang, merek, atau kategori..."
            aria-label="Cari barang, merek, atau kategori"
          />
          <button type="submit" aria-label="Cari barang" className="sr-only">Cari</button>
        </form>

        {/* Mobile Drawer Panel (lg:hidden) */}
        {mobileMenuOpen && (
          <div className="lg:hidden w-full mt-2 pt-2.5 pb-1 border-t border-[#edf4f1] animate-fadeIn" ref={mobileDrawerRef}>
            {/* If signed in: Full user profile card */}
            {isLoaded && isSignedIn && (
              <div className="mb-3 p-3 rounded-xl bg-[#f6faf8] border border-[#e2ede8]">
                <div className="flex items-center gap-3 mb-2.5">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.fullName || "Avatar"}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-green-dark text-white flex items-center justify-center font-bold text-sm">
                      {(user?.firstName || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-[#142e29] truncate flex items-center gap-1.5">
                      <span>{user?.fullName || user?.firstName || "Warga"}</span>
                      {isPetugas && (
                        <span className="text-[9px] bg-emerald-100 text-green-dark px-1.5 py-0.5 rounded font-bold uppercase">
                          Petugas
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#617974] truncate">
                      {user?.primaryEmailAddress?.emailAddress || ""}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#e8f1ec]">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openUserProfile();
                    }}
                    className="flex-1 py-1.5 px-2 text-center text-xs font-semibold rounded-lg bg-white border border-[#d6e5df] text-[#1c3d38] hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Kelola Profil
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ redirectUrl: "/" });
                    }}
                    className="py-1.5 px-3 text-center text-xs font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            )}

            {/* Navigation links in mobile drawer */}
            <div className="space-y-1">
              {isPetugas && (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-green-dark bg-[#eef7f4] border border-[#d6e5df] transition-colors mb-2"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#0d7565]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Dashboard Petugas</span>
                  </span>
                  <svg className="w-3.5 h-3.5 text-[#0d7565]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}

              {/* Separator before info links */}
              <div className="my-1.5 border-t border-[#edf4f1]" />

              {/* Menu Informasi (Dipindahkan dari Header) */}
              <Link
                href="/tentang-kami"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  pathname === "/tentang-kami"
                    ? "text-green-dark bg-[#eef7f4]"
                    : "text-[#34514b] hover:bg-[#f1f7f5]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#0d7565]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Tentang Kami</span>
                </span>
                <svg className="w-3.5 h-3.5 text-[#9ab3ad]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/beri-saran"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  pathname === "/beri-saran"
                    ? "text-green-dark bg-[#eef7f4]"
                    : "text-[#34514b] hover:bg-[#f1f7f5]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#0d7565]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Beri Saran</span>
                </span>
                <svg className="w-3.5 h-3.5 text-[#9ab3ad]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              {isLoaded && !isSignedIn && (
                <div className="pt-2">
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-dark text-white text-xs font-semibold shadow-xs cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span>Masuk ke Akun LACAK</span>
                    </button>
                  </SignInButton>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Collapsible Filter Panel */}
        {filtersOpen && (
          <section className="public-filters public-filters-animated" aria-label="Filter barang">
            <PublicFilter label="Urutkan" value={filters.selectedSort} onChange={(value) => updateFilter("selectedSort", value as PublicFilterState["selectedSort"])}>
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="name">Nama A-Z</option>
            </PublicFilter>
            <PublicFilter label="Kategori" value={filters.selectedCategory} onChange={(value) => updateFilter("selectedCategory", value)}>
              <option value="all">Semua Kategori</option>
              {categories.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
            </PublicFilter>
            <PublicFilter label="Warna" value={filters.selectedColor} onChange={(value) => updateFilter("selectedColor", value)}>
              <option value="all">Semua Warna</option>
              {colors.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
            </PublicFilter>
            <PublicFilter label="Merek" value={filters.selectedBrand} onChange={(value) => updateFilter("selectedBrand", value)}>
              <option value="all">Semua Merek</option>
              {brands.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
            </PublicFilter>
            <PublicFilter label="Lokasi" value={filters.selectedLocation} onChange={(value) => updateFilter("selectedLocation", value)}>
              <option value="all">Semua Lokasi</option>
              {locations.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
            </PublicFilter>
            <button className="public-reset group" type="button" onClick={resetFilters} title="Reset semua filter">
              <svg className="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset</span>
            </button>
          </section>
        )}
      </div>
    </header>
  );
}

function PublicFilter({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="public-filter">
      <label>{label}</label>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
    </div>
  );
}