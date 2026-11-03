"use client";

import Link from "next/link";
import { Warga } from "@/features/warga/types";
import { LostReportItem } from "@/features/item/types";

type Props = {
  selectedWarga: Warga;
  wargaLostReports: LostReportItem[];
  selectedLostReport: LostReportItem | null;
  isLoadingReports: boolean;
  onSelectLostReport: (report: LostReportItem) => void;
};

export default function StepPilihLaporan({
  selectedWarga,
  wargaLostReports,
  selectedLostReport,
  isLoadingReports,
  onSelectLostReport,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-[#e2ece8] p-6 md:p-8 space-y-4 animate-in fade-in duration-300">
      <h3 className="text-base md:text-lg font-bold text-[#102824] flex items-center gap-2.5">
        <span className="w-7 h-7 rounded-full bg-[#0d7565] text-white text-xs flex items-center justify-center font-bold shadow-xs">
          2
        </span>
        <span>Pilih Laporan Kehilangan yang Diselesaikan</span>
      </h3>

      <p className="text-xs text-[#526b65]">
        Pengambilan barang ditujukan untuk menyelesaikan laporan kehilangan yang berstatus aktif (DICARI).
      </p>

      {isLoadingReports ? (
        <div className="p-6 text-center text-xs text-[#526b65] animate-pulse">
          Memuat laporan kehilangan milik {selectedWarga.nama}...
        </div>
      ) : wargaLostReports.length === 0 ? (
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-center">
          <p className="text-sm font-bold text-amber-800">Tidak Ada Laporan Kehilangan Aktif</p>

          <p className="text-xs text-amber-700 mt-1">
            Warga ini belum memiliki laporan kehilangan berstatus DICARI. Jika barang yang dicari sudah ada di sistem, silakan lakukan proses melalui menu{" "}
            <Link href="/lapor" className="underline font-bold hover:text-amber-900">
              Lapor Kehilangan (Jalur 2)
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
          {wargaLostReports.map((report) => (
            <button
              key={report.id}
              type="button"
              onClick={() => onSelectLostReport(report)}
              className={`text-left p-4 rounded-xl border text-xs transition-all cursor-pointer ${
                selectedLostReport?.id === report.id
                  ? "border-[#0d7565] bg-[#eef7f4] shadow-xs ring-2 ring-[#0d7565]/20"
                  : "border-[#e2ece8] hover:border-[#d2e5df] bg-white"
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-[#102824] text-xs md:text-sm truncate">
                  {report.jenis?.name} {report.merek?.name}
                </span>

                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {report.status}
                </span>
              </div>

              <p className="text-[#526b65]">
                Warna: {report.warna?.name} | Lokasi Hilang: {report.lokasi?.name}
              </p>

              {report.additionalDesc && (
                <p className="text-[11px] text-[#526b65]/80 mt-1 italic truncate">
                  &quot;{report.additionalDesc}&quot;
                </p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
