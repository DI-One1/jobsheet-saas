"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";
import {
  PublicFoundItem,
  getItemTitle,
  getCategoryRepresentativeImage,
  DEFAULT_ITEM_IMAGE,
} from "@/features/item/utils/public-item-utils";

interface LatestItemsTickerProps {
  items: PublicFoundItem[];
  onSelectItem: (item: PublicFoundItem) => void;
  onScrollToCatalog: () => void;
}

export default function LatestItemsTicker({
  items,
  onSelectItem,
  onScrollToCatalog,
}: LatestItemsTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const isDragging = useRef(false);

  if (!items || items.length === 0) return null;

  const displayItems = items.length < 4 ? [...items, ...items, ...items, ...items] : [...items, ...items];

  /* ── Mouse Drag & Touch Swipe Handlers ── */
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    isMouseDown.current = true;
    startX.current = e.clientX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
    isDragging.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isMouseDown.current) return;
    const el = containerRef.current;
    if (!el) return;
    const x = e.clientX - el.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 6) {
      isDragging.current = true;
    }
    el.scrollLeft = scrollLeft.current - walk;
  };

  const handlePointerUp = () => {
    isMouseDown.current = false;
  };

  return (
    <section id="terbaru" className="mx-auto mb-[28px] max-w-[1230px] px-[8px]">
      {/* Section Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="inline-block h-[18px] w-[3.5px] rounded-[2px] bg-[#158a76]" />
          <h2 className="text-[17px] font-bold text-[#101b1b] flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#0d7565]" />
            <span>Barang Temuan Terbaru</span>
          </h2>
        </div>

        <button
          type="button"
          onClick={onScrollToCatalog}
          className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#0c5c52] transition-colors hover:text-[#158a76] hover:underline cursor-pointer"
        >
          <span>Lihat Semua</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Marquee Slider Wrapper with Drag & Touch Support */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="cards-wrap relative overflow-x-auto no-scrollbar touch-pan-x select-none rounded-2xl py-3 px-1 cursor-grab active:cursor-grabbing"
      >
        <div className="latest-marquee py-2">
          {displayItems.map((item, index) => {
            const title = getItemTitle(item);
            const imageUrl = getCategoryRepresentativeImage(item.jenis.name);

            return (
              <button
                key={`${item.id}-${index}`}
                type="button"
                onClick={(e) => {
                  if (isDragging.current) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                  }
                  onSelectItem(item);
                }}
                className="highlight-card group relative flex-shrink-0 overflow-hidden rounded-xl text-left shadow-[0_2px_6px_rgba(0,0,0,0.03)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(13,59,46,0.14)] focus:outline-none cursor-pointer"
              >
                {/* Background Image */}
                <Image
                  src={imageUrl || DEFAULT_ITEM_IMAGE}
                  alt={title}
                  fill
                  sizes="292px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 pointer-events-none"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#061814]/90 via-[#061814]/30 to-black/20 pointer-events-none" />

                {/* Category Badge */}
                <span className="absolute left-3 top-3 z-10 rounded-md border border-white/20 bg-black/50 backdrop-blur-xs px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white pointer-events-none">
                  {item.jenis.name}
                </span>

                {/* Bottom Caption */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 text-white pointer-events-none">
                  <strong className="mb-0.5 block truncate text-[14px] font-bold leading-tight group-hover:text-[#6ee7b7] transition-colors">
                    {title}
                  </strong>
                  <span className="block truncate text-[10px] text-[#c9ede4]">
                    {item.merek.name} · {item.lokasi.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
