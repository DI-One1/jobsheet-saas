"use client";

import React from "react";
import { formatDate } from "@/lib/utils/dateFormat";
import RiwayatActionDropdown from "@/components/riwayat/RiwayatActionDropdown";

interface TemuanRowProps {
  item: any;
  onOpenDetail: (item: any) => void;
  onOpenDelete: (item: any) => void;
  onToast: (message: string, type: "success" | "error") => void;
}

export default function TemuanRow({
  item,
  onOpenDetail,
  onOpenDelete,
  onToast,
}: TemuanRowProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "FOUND":
        return (
          <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold inline-block">
            Tersedia
          </span>
        );
      case "CLAIMED":
        return (
          <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-bold inline-block">
            Diambil
          </span>
        );
      case "EXPIRED":
        return (
          <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full font-bold inline-block">
            Kedaluwarsa
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full font-bold inline-block">
            {status}
          </span>
        );
    }
  };

  const finderId =
    item.finderIdCard && item.finderIdCard !== "-"
      ? item.finderIdCard
      : item.wargaId || item.warga?.id || "—";

  return (
    <tr className="hover:bg-gray-50/80 transition-colors border-b border-gray-100">
      {/* 1. ID Penemu */}
      <td className="px-6 py-4 font-mono font-bold text-xs text-[#0d3b2e]">
        {finderId}
      </td>

      {/* 2. Jenis Barang */}
      <td className="px-6 py-4 text-sm font-semibold text-gray-800">
        {item.jenis?.name || "—"}
      </td>

      {/* 3. Merek */}
      <td className="px-6 py-4 text-sm text-gray-600">
        {item.merek?.name || "—"}
      </td>

      {/* 4. Warna */}
      <td className="px-6 py-4 text-sm text-gray-600">
        {item.warna?.name || "—"}
      </td>

      {/* 5. Lokasi */}
      <td className="px-6 py-4 text-sm text-gray-600">
        {item.lokasi?.name || "—"}
      </td>

      {/* 6. Status */}
      <td className="px-6 py-4 text-center">
        {getStatusBadge(item.status)}
      </td>

      {/* 7. Tanggal */}
      <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
        {formatDate(item.createdAt)}
      </td>

      {/* 8. Aksi */}
      <td className="px-6 py-4 text-right">
        <RiwayatActionDropdown
          onDelete={() => onOpenDelete(item)}
          onDetail={() => onOpenDetail(item)}
          itemCode={item.businessCode}
          onToast={onToast}
        />
      </td>
    </tr>
  );
}
