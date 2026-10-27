"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import ItemDetailModal from "./ItemDetailModal";
import type { MasterFilterData, PublicFoundItem } from "@/features/item/utils/public-item-utils";
import {
  getItemTitle,
  getCategoryRepresentativeImage,
  formatIndonesianDate,
  getItemLocalDateString,
  DEFAULT_ITEM_IMAGE,
} from "@/features/item/utils/public-item-utils";

interface PublicSearchPortalProps {
  initialItems: PublicFoundItem[];
  masterData: MasterFilterData;
  initialQuery?: string;
  initialSort?: "newest" | "oldest" | "name";
  initialCategory?: string;
  initialColor?: string;
  initialBrand?: string;
  initialLocation?: string;
  initialFrom?: string;
  initialTo?: string;
}

const ITEMS_PER_PAGE = 20;

export default function PublicSearchPortal({
  initialItems,
  initialQuery = "",
  initialSort = "newest",
  initialCategory = "all",
  initialColor = "all",
  initialBrand = "all",
  initialLocation = "all",
  initialFrom = "",
  initialTo = "",
}: PublicSearchPortalProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [fromDate, setFromDate] = useState(initialFrom);
  const [toDate, setToDate] = useState(initialTo);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModalItem, setActiveModalItem] = useState<PublicFoundItem | null>(null);

  useEffect(() => {
    const handlePublicFilters = (event: Event) => {
      const detail = (event as CustomEvent<{
        searchQuery: string;
        selectedSort: "newest" | "oldest" | "name";
        selectedCategory: string;
        selectedColor: string;
        selectedBrand: string;
        selectedLocation: string;
      }>).detail;
      setSearchQuery(detail.searchQuery);
      setSelectedSort(detail.selectedSort);
      setSelectedCategory(detail.selectedCategory);
      setSelectedColor(detail.selectedColor);
      setSelectedBrand(detail.selectedBrand);
      setSelectedLocation(detail.selectedLocation);
      setFromDate("");
      setToDate("");
      setCurrentPage(1);
    };
    window.addEventListener("lacak:public-filter", handlePublicFilters);
    return () => window.removeEventListener("lacak:public-filter", handlePublicFilters);
  }, []);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return initialItems
      .filter((item) => {
        const searchable = [
          getItemTitle(item),
          item.jenis?.name || "",
          item.merek?.name || "",
          item.warna?.name || "",
          item.lokasi?.name || "",
          item.additionalDesc || "",
        ]
          .join(" ")
          .toLowerCase();

        // Match exact local YYYY-MM-DD date as displayed on the card
        const itemLocalDate = getItemLocalDateString(item.createdAt);

        const matchesFrom = !fromDate || (itemLocalDate !== "" && itemLocalDate >= fromDate);
        const matchesTo = !toDate || (itemLocalDate !== "" && itemLocalDate <= toDate);

        return (
          (!query || searchable.includes(query)) &&
          (selectedCategory === "all" || item.jenis?.name === selectedCategory) &&
          (selectedColor === "all" || item.warna?.name === selectedColor) &&
          (selectedBrand === "all" || item.merek?.name === selectedBrand) &&
          (selectedLocation === "all" || item.lokasi?.name === selectedLocation) &&
          matchesFrom &&
          matchesTo
        );
      })
      .sort((first, second) => {
        if (selectedSort === "name") return getItemTitle(first).localeCompare(getItemTitle(second));
        const firstTime = new Date(first.createdAt).getTime();
        const secondTime = new Date(second.createdAt).getTime();
        const validFirst = isNaN(firstTime) ? 0 : firstTime;
        const validSecond = isNaN(secondTime) ? 0 : secondTime;
        return selectedSort === "oldest" ? validFirst - validSecond : validSecond - validFirst;
      });
  }, [
    initialItems,
    searchQuery,
    selectedSort,
    selectedCategory,
    selectedColor,
    selectedBrand,
    selectedLocation,
    fromDate,
    toDate,
  ]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;
  const pageItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <main className="public-search-page min-h-[75vh] py-6 sm:py-8">
      <section id="semua" className="section search-results mx-auto max-w-[1230px] px-4 sm:px-6">
        {/* Title Header */}
        <div className="section-title mb-6 flex items-end justify-between border-b border-[#e5eeeb] pb-3.5">
          <div className="catalog-heading">
            <div className="result-eyebrow eyebrow text-[#158a76] text-[10px] font-bold tracking-wider uppercase mb-1">
              KATALOG LACAK
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#102d2a]">
              Barang yang ditemukan
            </h2>
          </div>
          <span className="result-count text-xs font-semibold text-[#5a6f6b]">
            {filteredItems.length} barang ditemukan
          </span>
        </div>

        {/* Layout Grid + Sidebar Date Filter */}
        <div className="catalog-results-layout flex flex-col md:flex-row gap-6 items-start relative">
          {/* Tanggal Temuan Sidebar */}
          <aside className="date-range-filter w-full md:w-[175px] shrink-0 p-4 rounded-xl border border-[#dce8e4] bg-[#fbfdfc] flex flex-col gap-2.5 shadow-xs">
            <div className="date-filter-title text-xs font-bold text-[#1b3431] flex items-center gap-1.5 pb-1 border-b border-[#e8f1ee]">
              <svg className="w-3.5 h-3.5 text-[#0d7565]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Tanggal Temuan</span>
            </div>
            <label htmlFor="fromDateFilter" className="text-[11px] font-semibold text-[#5a6f6b]">
              Dari Tanggal
            </label>
            <input
              id="fromDateFilter"
              type="date"
              value={fromDate}
              onChange={(event) => {
                setFromDate(event.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg border border-[#d2e2dd] bg-white text-xs outline-none focus:border-[#0d7565] focus:ring-1 focus:ring-[#0d7565] text-[#20433d]"
            />
            <label htmlFor="toDateFilter" className="text-[11px] font-semibold text-[#5a6f6b] mt-0.5">
              Sampai Tanggal
            </label>
            <input
              id="toDateFilter"
              type="date"
              value={toDate}
              onChange={(event) => {
                setToDate(event.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg border border-[#d2e2dd] bg-white text-xs outline-none focus:border-[#0d7565] focus:ring-1 focus:ring-[#0d7565] text-[#20433d]"
            />
            {fromDate && toDate && fromDate > toDate && (
              <p className="text-[10px] font-semibold text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200/80 leading-tight">
                Tanggal &apos;Dari&apos; tidak boleh melebihi &apos;Sampai&apos;.
              </p>
            )}
            {(fromDate || toDate) && (
              <button
                type="button"
                onClick={() => {
                  setFromDate("");
                  setToDate("");
                  setCurrentPage(1);
                }}
                className="mt-1 text-center text-[10.5px] font-semibold text-[#0d7565] hover:underline cursor-pointer"
              >
                Hapus Rentang
              </button>
            )}
          </aside>

          {/* Cards Grid */}
          <div className="catalog-grid flex-1 w-full min-w-0">
            {pageItems.length === 0 ? (
              <div className="empty-state flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#d8e5e1] bg-[#fbfdfc] py-16 px-4 text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#edf6f3] text-[#0d7565]">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[#142e29]">Barang tidak ditemukan</h3>
                <p className="mt-1 max-w-sm text-xs text-[#637975]">
                  Tidak ada barang temuan yang sesuai dengan kata kunci atau filter pencarian saat ini.
                </p>
              </div>
            ) : (
              <div className="all-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {pageItems.map((item) => {
                  const title = getItemTitle(item);
                  const imageUrl = getCategoryRepresentativeImage(item.jenis.name);
                  const dateStr = formatIndonesianDate(item.createdAt);

                  return (
                    <article
                      key={item.id}
                      onClick={() => setActiveModalItem(item)}
                      className="card group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-[#e2ece8] bg-white text-left shadow-[0_2px_5px_rgba(0,0,0,0.03)] transition-all duration-200 hover:-translate-y-1 hover:border-[#158a76]/50 hover:shadow-[0_12px_24px_rgba(13,59,46,0.1)]"
                    >
                      <div className="card-image relative h-[155px] w-full overflow-hidden bg-[#eef4f1]">
                        <Image
                          src={imageUrl || DEFAULT_ITEM_IMAGE}
                          alt={title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Gradient bottom overlay for contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/35 pointer-events-none" />

                        <span className="card-category absolute left-2 top-2 max-w-[62%] truncate rounded-md bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[9.5px] font-semibold text-white shadow-xs">
                          {item.jenis.name}
                        </span>
                        <span className="card-status absolute right-2 top-2 flex items-center gap-1 rounded-md bg-white/90 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 shadow-xs">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Tersedia
                        </span>
                      </div>

                      <div className="card-body flex flex-1 flex-col p-3">
                        <h3 className="mb-1 line-clamp-2 min-h-[34px] text-[13px] font-bold leading-[1.3] text-[#142e29] transition-colors group-hover:text-[#0d7565]">
                          {title}
                        </h3>
                        <p className="meta mb-2 truncate text-[10.5px] font-medium text-[#657975]">
                          {item.merek.name} · {item.warna.name}
                        </p>
                        <p className="desc mb-2.5 line-clamp-2 text-[11px] leading-[1.4] text-[#4f6460]">
                          {item.additionalDesc || "Barang ditemukan dan diamankan oleh petugas."}
                        </p>
                        <div className="card-footer mt-auto flex items-center justify-between gap-1.5 pt-2 border-t border-[#f0f4f2] text-[10px]">
                          <span className="card-location flex items-center gap-1 max-w-[95px] truncate font-semibold text-[#0b7667]">
                            <svg className="h-3 w-3 shrink-0 text-[#0b7667]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{item.lokasi.name}</span>
                          </span>
                          <span className="date shrink-0 text-[#6e827e] text-[9.5px]">{dateStr}</span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {filteredItems.length > 0 && totalPages > 1 && (
              <div className="catalog-pagination mt-6 flex min-h-[42px] items-center justify-center gap-3 text-xs font-bold text-[#204a43]">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  aria-label="Halaman sebelumnya"
                  className="page-arrow flex h-8 w-8 items-center justify-center rounded-lg border border-[#d6e4df] bg-white text-lg text-[#0d675b] shadow-xs hover:bg-[#eaf6f2] hover:border-[#0d7565] disabled:cursor-not-allowed disabled:opacity-35 transition-all"
                >
                  ‹
                </button>
                <span className="px-2 text-xs font-semibold text-[#44625d]">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  aria-label="Halaman berikutnya"
                  className="page-arrow flex h-8 w-8 items-center justify-center rounded-lg border border-[#d6e4df] bg-white text-lg text-[#0d675b] shadow-xs hover:bg-[#eaf6f2] hover:border-[#0d7565] disabled:cursor-not-allowed disabled:opacity-35 transition-all"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      <ItemDetailModal item={activeModalItem} onClose={() => setActiveModalItem(null)} />
    </main>
  );
}
