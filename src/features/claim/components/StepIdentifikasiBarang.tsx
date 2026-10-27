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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6 animate-in fade-in duration-300">
      <h3 className="text-lg font-bold text-green-dark flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-green-dark text-white text-xs flex items-center justify-center font-bold">
          3
        </span>
        Identifikasi Barang Temuan yang Diambil
      </h3>

      <p className="text-xs text-gray-500">
        Pilih barang temuan yang sesuai melalui pencocokan otomatis rekomendasi sistem atau masukkan kode barcode unik secara manual.
      </p>

      <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
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
            className="flex-1 border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-xs font-mono uppercase focus:outline-none focus:border-green-accent transition-all"
          />

          <button
            type="button"
            onClick={onScanBarcode}
            disabled={isCheckingBarcode || !businessCode.trim()}
            className="bg-green-mid hover:bg-green-dark disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer border-none"
          >
            {isCheckingBarcode ? "Memeriksa..." : "Cari Kode"}
          </button>
        </div>
      </div>

      <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Cara 2: Rekomendasi Kecocokan Sistem
        </h4>

        {isLoadingMatches ? (
          <div className="p-4 text-center text-xs text-gray-400 animate-pulse">
            Mencari kecocokan barang temuan di database...
          </div>
        ) : matchingFoundItems.length === 0 ? (
          <div className="p-4 bg-white border border-dashed rounded-xl text-center text-xs text-gray-400">
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
                    ? "border-green-mid bg-green-accent/15 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="truncate pr-2">
                  <p className="font-bold text-green-dark truncate">
                    {item.jenis?.name} - {item.merek?.name}
                  </p>

                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                    {item.businessCode} &bull; Lokasi: {item.lokasi?.name}
                  </p>
                </div>

                <span
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-full flex-shrink-0 ${
                    item.matchScore === 100
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {item.matchScore}% Cocok
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {barcodeScanned && selectedFoundItem && (
        <div className="p-5 bg-green-accent/10 rounded-xl border border-green-accent/30 animate-in fade-in duration-300">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-green-mid">
              Barang Terpilih untuk Diambil
            </h4>

            <span className="text-[10px] bg-green-mid text-white font-bold px-2 py-0.5 rounded-full">
              Terpilih
            </span>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-green-mid text-xl shadow-sm">
              📦
            </div>

            <div className="flex-grow">
              <h5 className="font-bold text-green-dark text-base">
                {selectedFoundItem.jenis?.name} {selectedFoundItem.merek?.name}
              </h5>

              <p className="text-xs font-mono font-bold text-green-mid mt-0.5">
                Kode: {selectedFoundItem.businessCode}
              </p>

              <p className="text-xs text-gray-600 mt-1">
                Warna: {selectedFoundItem.warna?.name} | Lokasi Ditemukan: {selectedFoundItem.lokasi?.name}
              </p>

              {selectedFoundItem.additionalDesc && (
                <p className="text-xs text-gray-500 bg-white border rounded-lg p-2 mt-2 italic">
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
