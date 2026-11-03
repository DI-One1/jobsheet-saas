"use client";

import { FoundItemMatch, FoundItemData } from "../types";

type Props = {
  businessCode: string;
  onBusinessCodeChange: (value: string) => void;
  onScanBarcode: (e: React.FormEvent) => void;
  isCheckingBarcode: boolean;
  matchingFoundItems: FoundItemMatch[];
  isLoadingMatches: boolean;
  selectedFoundItem: FoundItemData | FoundItemMatch | null;
  barcodeScanned: boolean;
  onSelectFoundItem: (item: FoundItemMatch) => void;
};

export default function StepIdentifikasiBarang({
  businessCode,
  onBusinessCodeChange,
  onScanBarcode,
  isCheckingBarcode,
  matchingFoundItems,
  isLoadingMatches,
  selectedFoundItem,
  barcodeScanned,
  onSelectFoundItem,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-[#e2ece8] p-6 md:p-8 space-y-6 animate-in fade-in duration-300">
      <h3 className="text-base md:text-lg font-bold text-[#102824] flex items-center gap-2.5">
        <span className="w-7 h-7 rounded-full bg-[#0d7565] text-white text-xs flex items-center justify-center font-bold shadow-xs">
          3
        </span>
        <span>Identifikasi Barang Temuan yang Diambil</span>
      </h3>

      <p className="text-xs text-[#526b65]">
        Pilih barang temuan yang sesuai melalui pencocokan otomatis rekomendasi sistem atau masukkan kode barcode unik secara manual.
      </p>

      {/* CARA 1: Input / Scan Barcode */}
      <div className="space-y-3 bg-[#fafbfb] p-4 rounded-xl border border-[#e2ece8]">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#526b65]">
          Cara 1: Input / Scan Kode Barcode
        </h4>

        <div className="flex gap-2">
          <input
            id="barcodeBusinessCodeInput"
            type="text"
            value={businessCode}
            onChange={(e) => onBusinessCodeChange(e.target.value)}
            placeholder="Kode unik barang (contoh: A-129-0001)..."
            aria-label="Kode unik barang (barcode)"
            className="flex-1 border border-[#d2e5df] bg-white rounded-xl px-4 py-2.5 text-xs font-mono uppercase focus:outline-none focus:border-[#0d7565] focus:ring-2 focus:ring-[#0d7565]/20 text-[#142e29] transition-all"
          />

          <button
            type="button"
            onClick={onScanBarcode}
            disabled={isCheckingBarcode || !businessCode.trim()}
            className="bg-[#0d7565] hover:bg-[#0a5d50] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shadow-xs border-none"
          >
            {isCheckingBarcode ? "Memeriksa..." : "Cari Kode"}
          </button>
        </div>
      </div>

      {/* CARA 2: Rekomendasi Kecocokan */}
      <div className="space-y-3 bg-[#fafbfb] p-4 rounded-xl border border-[#e2ece8]">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#526b65]">
          Cara 2: Rekomendasi Kecocokan Sistem
        </h4>

        {isLoadingMatches ? (
          <div className="p-4 text-center text-xs text-[#526b65] animate-pulse">
            Mencari kecocokan barang temuan di database...
          </div>
        ) : matchingFoundItems.length === 0 ? (
          <div className="p-4 bg-white border border-dashed border-[#d2e5df] rounded-xl text-center text-xs text-[#526b65]">
            Tidak ada barang temuan yang cocok secara otomatis dengan laporan ini.
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {matchingFoundItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectFoundItem(item)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex justify-between items-center cursor-pointer border-solid ${
                  selectedFoundItem?.id === item.id
                    ? "border-[#0d7565] bg-[#eef7f4] shadow-xs ring-1 ring-[#0d7565]"
                    : "border-[#e2ece8] bg-white hover:border-[#d2e5df]"
                }`}
              >
                <div className="truncate pr-2">
                  <p className="font-bold text-[#102824] truncate">
                    {item.jenis?.name} - {item.merek?.name}
                  </p>

                  <p className="text-[10.5px] text-[#526b65] font-mono mt-0.5">
                    {item.businessCode} &bull; Lokasi: {item.lokasi?.name}
                  </p>
                </div>

                <span
                  className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full flex-shrink-0 ${
                    item.matchScore === 100
                      ? "bg-[#eef7f4] text-[#0d7565] border border-[#d2e5df]"
                      : "bg-amber-50 text-amber-800 border border-amber-200"
                  }`}
                >
                  {item.matchScore}% Cocok
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* PREVIEW BARANG TERPILIH */}
      {barcodeScanned && selectedFoundItem && (
        <div className="p-5 bg-[#eef7f4] rounded-xl border border-[#a8dbc9] animate-in fade-in duration-300">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0d7565]">
              Barang Terpilih untuk Diambil
            </h4>

            <span className="text-[10px] bg-[#0d7565] text-white font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              Terpilih
            </span>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#0d7565] text-xl shadow-xs border border-[#d2e5df] flex-shrink-0">
              📦
            </div>

            <div className="flex-grow min-w-0">
              <h5 className="font-bold text-[#102824] text-base truncate">
                {selectedFoundItem.jenis?.name} {selectedFoundItem.merek?.name}
              </h5>

              <p className="text-xs font-mono font-bold text-[#0d7565] mt-0.5">
                Kode: {selectedFoundItem.businessCode}
              </p>

              <p className="text-xs text-[#526b65] mt-1">
                Warna: {selectedFoundItem.warna?.name} | Lokasi Ditemukan: {selectedFoundItem.lokasi?.name}
              </p>

              {selectedFoundItem.additionalDesc && (
                <p className="text-xs text-[#102824] bg-white border border-[#e2ece8] rounded-lg p-2.5 mt-2 italic">
                  Ciri khusus: &quot;{selectedFoundItem.additionalDesc}&quot;
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
