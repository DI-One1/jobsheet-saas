"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);

  // Sync URL changes back to state (pola resmi React: adjusting state during render)
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
    <form onSubmit={handleSearchSubmit} className="w-full relative" role="search">
      <input
        type="text"
        value={query}
        onChange={handleSearchChange}
        placeholder="Cari data di halaman ini..."
        aria-label="Cari data di halaman ini"
        className="w-full bg-white/10 border border-white/20 rounded-full py-2.5 pl-5 pr-12 text-white placeholder:text-white/50 text-sm focus:outline-none focus:bg-white/20 focus:border-green-accent transition-all"
      />
      <button
        type="submit"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors cursor-pointer"
        aria-label="Cari"
        title="Cari"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
        </svg>
      </button>
    </form>
  );
}
