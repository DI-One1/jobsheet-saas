"use client";

import { LostReportItem } from "@/features/item/types";
import { Warga, FoundItemMatch, FoundItemData } from "../types";
import { Button } from "@/components/ui/Button";

type Props = {
  selectedWarga: Warga;
  selectedLostReport: LostReportItem;
  selectedFoundItem: FoundItemData | FoundItemMatch;
  isSubmitting: boolean;
};

export default function StepKonfirmasiKlaim({
  selectedWarga,
  selectedLostReport,
  selectedFoundItem,
  isSubmitting,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-[#e2ece8] p-6 md:p-8 space-y-6 animate-in fade-in duration-300 relative overflow-hidden">
      <h3 className="text-base md:text-lg font-bold text-[#102824] mb-4 flex items-center gap-2.5 relative z-10">
        <span className="w-7 h-7 rounded-full bg-[#0d7565] text-white text-xs flex items-center justify-center font-bold shadow-xs">
          4
        </span>
        <span>Konfirmasi Serah Terima Barang</span>
      </h3>

      <div className="bg-[#fafbfb] rounded-xl p-5 border border-[#e2ece8] relative z-10 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#526b65] mb-1 tracking-wider">
              Nama Lengkap Pengambil
            </p>

            <p className="text-sm font-semibold text-[#102824]">
              {selectedWarga.nama} ({selectedWarga.id})
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase font-bold text-[#526b65] mb-1 tracking-wider">
              Menyelesaikan Laporan
            </p>

            <p className="text-sm font-semibold text-[#102824]">
              {selectedLostReport.jenis?.name} - {selectedLostReport.merek?.name}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase font-bold text-[#526b65] mb-1 tracking-wider">
              Kode Barang yang Diambil
            </p>

            <p className="text-sm font-mono font-bold text-[#0d7565]">
              {selectedFoundItem.businessCode}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase font-bold text-[#526b65] mb-1 tracking-wider">
              Kontak Pengambil
            </p>

            <p className="text-sm font-semibold text-[#102824]">
              {selectedWarga.nomor_telepon || "Tidak ada data kontak"}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end relative z-10">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <span className="animate-pulse">Memproses...</span>
          ) : (
            <>Selesaikan Serah Terima Barang &rarr;</>
          )}
        </Button>
      </div>
    </div>
  );
}
