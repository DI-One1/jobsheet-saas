"use client";

import React from "react";
import { formatDate } from "@/lib/utils/dateFormat";
import RiwayatActionDropdown from "@/components/riwayat/RiwayatActionDropdown";

interface LaporanRowProps {
  item: any;
  onOpenDetail: (item: any) => void;
  onOpenDelete: (item: any) => void;
  onToast: (message: string, type: "success" | "error") => void;
}

export default function LaporanRow({
  item,
  onOpenDetail,
  onOpenDelete,
  onToast,
}: LaporanRowProps) {
  const reporterId =
    item.reporterIdCard && item.reporterIdCard !== "-"
      ? item.reporterIdCard
      : item.wargaId || item.warga?.id || "—";

  // Kode barang temuan terkait (jika sudah ada relasi valid)
  const relatedItemCode = item.claimTransactions?.[0]?.foundItem?.businessCode || null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DICARI":
        return (
          <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold inline-block">
            Dicari
          </span>
        );
      case "SELESAI":
        return (
          <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold inline-block">
            Selesai
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

  return (
    <tr className="hover:bg-gray-50/80 transition-colors border-b border-gray-100">
      {/* 1. ID Pelapor */}
      <td className="px-6 py-4 font-mono font-bold text-xs text-[#0d3b2e]">
        {reporterId}
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
          itemCode={relatedItemCode}
          copyDisabledReason="Kode barang temuan belum tersedia untuk laporan ini (belum terhubung)"
          onToast={onToast}
        />
      </td>
    </tr>
  );
}
