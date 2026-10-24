"use client";

import React from "react";
import { Search, UserCheck, MapPin, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import DetailSection from "./DetailSection";
import DetailField from "./DetailField";
import { formatDateTime } from "@/lib/utils/dateFormat";

interface LaporanDetailContentProps {
  report: any;
  onToast?: (message: string, type: "success" | "error") => void;
}

export default function LaporanDetailContent({ report, onToast }: LaporanDetailContentProps) {
  if (!report) return null;

  const reporterId =
    report.reporterIdCard && report.reporterIdCard !== "-"
      ? report.reporterIdCard
      : report.wargaId || report.warga?.id || "—";
  const reporterName = report.warga?.nama || report.reporterName || "—";
  const reporterContact = report.reporterContact && report.reporterContact !== "-" ? report.reporterContact : report.warga?.nomorTelepon || "—";
  const reporterPeran = report.warga?.peran ? `${report.warga.peran}${report.warga.keteranganPeran ? ` (${report.warga.keteranganPeran})` : ""}` : null;

  // Cek relasi barang temuan terkait (jika ada transaksi klaim yang terhubung)
  const matchedClaim = report.claimTransactions?.[0];
  const relatedFoundItem = matchedClaim?.foundItem;
  const relatedItemCode = relatedFoundItem?.businessCode || null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DICARI":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <Search className="w-3.5 h-3.5 text-amber-600" />
            Dicari
          </span>
        );
      case "SELESAI":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Ditemukan
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* BAGIAN 1: INFORMASI BARANG HILANG */}
      <DetailSection
        icon={<Search className="w-4 h-4" />}
        title="Informasi Barang Hilang"
        badge={getStatusBadge(report.status)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <DetailField
            label="Jenis / Nama Barang"
            value={report.jenis?.name}
          />
          <DetailField
            label="Merek Barang"
            value={report.merek?.name}
          />
          <DetailField
            label="Warna Barang"
            value={report.warna?.name}
          />
          <div className="sm:col-span-2 md:col-span-3 pt-1">
            <DetailField
              label="Deskripsi Tambahan"
              value={report.additionalDesc || "Tidak ada deskripsi tambahan"}
            />
          </div>
        </div>
      </DetailSection>

      {/* BAGIAN 2: IDENTITAS PELAPOR */}
      <DetailSection
        icon={<UserCheck className="w-4 h-4" />}
        title="Identitas Pelapor Kehilangan"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <DetailField
            label="Nama Lengkap"
            value={reporterName}
          />
          <DetailField
            label="ID (NIS / NIP)"
            value={reporterId}
            mono
            copyable={reporterId !== "—"}
            copyValue={reporterId}
            onToast={onToast}
          />
          <DetailField
            label="Kontak"
            value={reporterContact}
          />
          {reporterPeran && (
            <div className="sm:col-span-2 md:col-span-3">
              <DetailField
                label="Peran"
                value={reporterPeran}
              />
            </div>
          )}
        </div>
      </DetailSection>

      {/* BAGIAN 3: INFORMASI KEHILANGAN */}
      <DetailSection
        icon={<MapPin className="w-4 h-4" />}
        title="Informasi Kejadian Kehilangan"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailField
            label="Perkiraan Lokasi Kehilangan"
            value={report.lokasi?.name}
          />
          <DetailField
            label="Waktu Pelaporan Dibuat"
            value={formatDateTime(report.createdAt)}
          />
          <div className="sm:col-span-2">
            <DetailField
              label="Status Tindak Lanjut"
              value={
                report.status === "SELESAI"
                  ? "Laporan telah selesai (barang telah ditemukan dan diserahkan)."
                  : "Laporan masih dalam proses pencarian aktif oleh sistem LACAK."
              }
            />
          </div>
        </div>
      </DetailSection>

      {/* BAGIAN 4: REFERENSI DATA & PENCOCOKAN */}
      <DetailSection
        icon={<FileText className="w-4 h-4" />}
        title="Referensi Data & Keterhubungan"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailField
            label="ID Laporan Kehilangan"
            value={report.id}
            mono
            copyable
            copyValue={report.id}
            onToast={onToast}
          />

          {relatedItemCode ? (
            <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 space-y-1">
              <span className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                Kode Barang Temuan Terkait:
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-[#0d3b2e]">
                  {relatedItemCode}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(relatedItemCode);
                    onToast?.(`Kode barang "${relatedItemCode}" berhasil disalin!`, "success");
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold text-[#0d3b2e] bg-white border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  Salin Kode
                </button>
              </div>
              <p className="text-[11px] text-emerald-700 mt-1">
                Laporan ini telah terhubung dengan barang temuan yang diambil.
              </p>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
              <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Kode Barang Temuan Terkait:
              </span>
              <div className="text-xs text-gray-500 italic">
                Belum terhubung dengan barang temuan
              </div>
              <p className="text-[11px] text-gray-400">
                Laporan belum dicocokkan atau barang belum ditemukan di pos piket.
              </p>
            </div>
          )}
        </div>
      </DetailSection>
    </div>
  );
}
