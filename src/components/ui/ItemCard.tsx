import React from "react";
import NextImage from "next/image";
import { MapPin, Calendar, CheckCircle2 } from "lucide-react";
import {
  PublicFoundItem,
  getItemTitle,
  getCategoryRepresentativeImage,
  formatIndonesianDate,
  DEFAULT_ITEM_IMAGE,
} from "@/features/item/utils/public-item-utils";

interface ItemCardProps {
  item: PublicFoundItem;
  onClick?: () => void;
  className?: string;
}

export function ItemCard({ item, onClick, className = "" }: ItemCardProps) {
  const title = getItemTitle(item);
  const imageUrl = getCategoryRepresentativeImage(item.jenis.name);
  const dateStr = formatIndonesianDate(item.createdAt);

  const handleMouseEnter = () => {
    // Preload item image for instant modal rendering
    if (typeof window !== "undefined" && imageUrl) {
      const img = new window.Image();
      img.src = imageUrl;
    }
  };

  return (
    <article
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleMouseEnter}
      className={`group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-[#e2ece8] bg-white text-left shadow-[0_2px_6px_rgba(0,0,0,0.03)] transition-all duration-250 hover:-translate-y-1 hover:border-[#158a76]/60 hover:shadow-[0_12px_24px_rgba(13,59,46,0.12)] active:scale-[0.99] ${className}`}
    >
      {/* Image Banner */}
      <div className="relative h-[155px] w-full overflow-hidden bg-[#eef4f1]">
        <NextImage
          src={imageUrl || DEFAULT_ITEM_IMAGE}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-108"
        />


        {/* Gradient Overlay for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* Category Pill */}
        <span className="absolute left-2.5 top-2.5 max-w-[65%] truncate rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9.5px] font-semibold text-white shadow-xs">
          {item.jenis.name}
        </span>

        {/* Status Pill */}
        <span className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-md bg-white/95 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-emerald-700 shadow-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Tersedia
        </span>
      </div>

      {/* Card Details */}
      <div className="flex flex-1 flex-col p-3">
        <h3 className="mb-1 line-clamp-2 min-h-[36px] text-[13px] font-bold leading-[1.35] text-[#142e29] transition-colors group-hover:text-[#0d7565]">
          {title}
        </h3>

        {/* Meta Details */}
        <p className="mb-2 truncate text-[10.5px] font-medium text-[#5f7571]">
          {item.merek.name} · {item.warna.name}
        </p>

        {/* Clamped Description */}
        <p className="mb-3 line-clamp-2 text-[11px] leading-[1.4] text-[#4f6460]">
          {item.additionalDesc || "Barang ditemukan dan telah diamankan oleh petugas."}
        </p>

        {/* Card Footer */}
        <div className="mt-auto flex items-center justify-between gap-1.5 border-t border-[#f0f4f2] pt-2 text-[10px]">
          <span className="flex items-center gap-1 max-w-[100px] truncate font-semibold text-[#0b7667]">
            <MapPin className="h-3 w-3 shrink-0 text-[#0b7667]" />
            <span className="truncate">{item.lokasi.name}</span>
          </span>

          <span className="flex items-center gap-1 shrink-0 text-[#6e827e] text-[9.5px]">
            <Calendar className="h-2.5 w-2.5 shrink-0 text-[#8ba09b]" />
            <span>{dateStr}</span>
          </span>
        </div>
      </div>
    </article>
  );
}

export default ItemCard;
