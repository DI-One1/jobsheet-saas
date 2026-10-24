"use client";

import React from "react";
import { formatDate } from "@/lib/utils/dateFormat";
import RiwayatActionDropdown from "@/components/riwayat/RiwayatActionDropdown";

interface PengambilanRowProps {
  item: any;
  onOpenDetail: (item: any) => void;
  onOpenDelete: (item: any) => void;
  onToast: (message: string, type: "success" | "error") => void;
}

export default function PengambilanRow({
  item,
  onOpenDetail,
  onOpenDelete,
  onToast,
}: PengambilanRowProps) {
  const claimantId =
    item.claimantIdCard && item.claimantIdCard !== "-"
      ? item.claimantIdCard
      : item.wargaId || item.warga?.id || "—";

  const foundItem = item.foundItem || {};

  return (
    <tr className="hover:bg-gray-50/80 transition-colors border-b border-gray-100">
      {/* 1. ID Pengambil */}
      <td className="px-6 py-4 font-mono font-bold text-xs text-[#0d3b2e]">
        {claimantId}
      </td>

      {/* 2. Jenis Barang */}
      <td className="px-6 py-4 text-sm font-semibold text-gray-800">
        {foundItem.jenis?.name || "—"}
      </td>

      {/* 3. Merek */}
      <td className="px-6 py-4 text-sm text-gray-600">
        {foundItem.merek?.name || "—"}
      </td>

      {/* 4. Warna */}
      <td className="px-6 py-4 text-sm text-gray-600">
        {foundItem.warna?.name || "—"}
      </td>

      {/* 5. Lokasi */}
      <td className="px-6 py-4 text-sm text-gray-600">
        {foundItem.lokasi?.name || "—"}
      </td>

      {/* 6. Status */}
      <td className="px-6 py-4 text-center">
        <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-bold inline-block">
          Diambil
        </span>
      </td>

      {/* 7. Tanggal */}
      <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
        {formatDate(item.claimedAt)}
      </td>

      {/* 8. Aksi */}
      <td className="px-6 py-4 text-right">
        <RiwayatActionDropdown
          onDelete={() => onOpenDelete(item)}
          onDetail={() => onOpenDetail(item)}
          itemCode={foundItem.businessCode}
          onToast={onToast}
        />
      </td>
    </tr>
  );
}
