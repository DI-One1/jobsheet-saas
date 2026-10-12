"use client";

import { useEffect, useState, useMemo } from "react";
import {
  PublicFoundItem,
  MasterFilterData,
  getItemTitle,
} from "@/features/item/utils/public-item-utils";
import LatestItemsTicker from "./LatestItemsTicker";
import CategoryCarousel from "./CategoryCarousel";
import CatalogGrid from "./CatalogGrid";
import ItemDetailModal from "./ItemDetailModal";

interface PublicPortalProps {
  initialItems: PublicFoundItem[];
  masterData: MasterFilterData;
}

const ITEMS_PER_PAGE = 24;

export default function PublicPortal({
  initialItems,
  masterData,
}: PublicPortalProps) {
  // State Filter & Pencarian
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState<"newest" | "oldest" | "name">("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // State Modal Detail
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
      setCurrentPage(1);
    };

    window.addEventListener("lacak:public-filter", handlePublicFilters);
    return () => window.removeEventListener("lacak:public-filter", handlePublicFilters);
  }, []);

  // Cek apakah filter sedang aktif
  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedColor !== "all" ||
    selectedBrand !== "all" ||
    selectedLocation !== "all" ||
    selectedSort !== "newest";

  // Reset semua filter
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedSort("newest");
    setSelectedCategory("all");
    setSelectedColor("all");
    setSelectedBrand("all");
    setSelectedLocation("all");
    setCurrentPage(1);
  };

  // Filter & Sort Logic
  const filteredAndSortedItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return initialItems
      .filter((item) => {
        // Filter Kata Kunci
        if (q) {
          const title = getItemTitle(item).toLowerCase();
          const category = item.jenis.name.toLowerCase();
          const brand = item.merek.name.toLowerCase();
          const color = item.warna.name.toLowerCase();
          const location = item.lokasi.name.toLowerCase();
          const desc = (item.additionalDesc || "").toLowerCase();

          const matches =
            title.includes(q) ||
            category.includes(q) ||
            brand.includes(q) ||
            color.includes(q) ||
            location.includes(q) ||
            desc.includes(q);

          if (!matches) return false;
        }

        // Filter Kategori
        if (selectedCategory !== "all" && item.jenis.name !== selectedCategory) {
          return false;
        }

        // Filter Warna
        if (selectedColor !== "all" && item.warna.name !== selectedColor) {
          return false;
        }

        // Filter Merek
        if (selectedBrand !== "all" && item.merek.name !== selectedBrand) {
          return false;
        }

        // Filter Lokasi
        if (selectedLocation !== "all" && item.lokasi.name !== selectedLocation) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (selectedSort === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (selectedSort === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (selectedSort === "name") {
          return getItemTitle(a).localeCompare(getItemTitle(b));
        }
        return 0;
      });
  }, [
    initialItems,
    searchQuery,
    selectedCategory,
    selectedColor,
    selectedBrand,
    selectedLocation,
    selectedSort,
  ]);

  // Pagination Logic
  const totalResults = filteredAndSortedItems.length;
  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedItems, currentPage]);

  // Scroll ke bagian katalog
  const scrollToCatalog = () => {
    const el = document.getElementById("semua");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="public-portal w-full flex flex-col pt-6 sm:pt-8">
      {/* ==================== SECTION 1: BARANG TERBARU (TICKER) ==================== */}
      <LatestItemsTicker
        items={initialItems.slice(0, 4)}
        onSelectItem={(item) => setActiveModalItem(item)}
        onScrollToCatalog={scrollToCatalog}
      />

      {/* ==================== SECTION 2: PILIHAN KATEGORI ==================== */}
      <CategoryCarousel
        categories={masterData.categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(catName) => {
          setSelectedCategory(catName);
          setCurrentPage(1);
          scrollToCatalog();
        }}
      />

      {/* ==================== SECTION 3: SEMUA BARANG (GRID) ==================== */}
      <CatalogGrid
        items={paginatedItems}
        totalResults={totalResults}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          scrollToCatalog();
        }}
        onSelectItem={(item) => setActiveModalItem(item)}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* ==================== MODAL DETAIL BARANG ==================== */}
      <ItemDetailModal
        item={activeModalItem}
        onClose={() => setActiveModalItem(null)}
      />
    </div>
  );
}
