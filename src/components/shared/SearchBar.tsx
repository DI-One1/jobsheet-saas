"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);

  // Sync URL changes back to state
  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setQuery(urlQuery);
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentQ = searchParams.get("q") || "";
    const cleanQuery = query.trim();

    if (cleanQuery !== currentQ.trim()) {
      const params = new URLSearchParams(searchParams.toString());
      if (cleanQuery) {
        params.set("q", cleanQuery);
      } else {
        params.delete("q");
      }
      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="w-full relative max-w-lg mx-auto" role="search">
      <input
        type="search"
        value={query}
        onChange={handleSearchChange}
        placeholder="Cari data di halaman ini..."
        aria-label="Cari data di halaman ini"
        className="w-full bg-[#f8faf9] border border-[#d6e5df] rounded-xl py-2 pl-4 pr-11 text-xs sm:text-sm text-[#102824] placeholder:text-[#8ba39c] focus:outline-none focus:bg-white focus:border-[#0d7565] focus:ring-2 focus:ring-[#0d7565]/15 transition-all shadow-2xs"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0d7565] hover:text-[#0a5d50] transition-colors cursor-pointer p-1"
        aria-label="Cari"
        title="Cari"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </button>
    </form>
  );
}
