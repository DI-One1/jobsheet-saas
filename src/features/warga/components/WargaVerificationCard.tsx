"use client";

import { useState, useRef, useEffect } from "react";
import { Warga } from "../types";

interface WargaVerificationCardProps {
  masterDataWarga: Warga[];
  selectedWarga: Warga | null;
  verified: boolean;
  isScanning: boolean;
  onSelectWarga: (warga: Warga) => void;
  onReset: () => void;
  stepNumber: number;
  title: string;
  roleLabel: string;
}

export default function WargaVerificationCard({
  masterDataWarga,
  selectedWarga,
  verified,
  isScanning,
  onSelectWarga,
  onReset,
  stepNumber,
  title,
  roleLabel,
}: WargaVerificationCardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredWarga = masterDataWarga.filter((warga) =>
    warga.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    warga.id.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 10); // Limit 10 for performance

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-[#e2ece8] p-6 md:p-8 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base md:text-lg font-bold text-[#102824] flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-[#0d7565] text-white text-xs flex items-center justify-center font-bold shadow-xs">
            {stepNumber}
          </span>
          <span>{title}</span>
        </h3>
        {verified && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-[#0d7565] hover:text-[#0a5d50] font-bold px-3 py-1.5 bg-[#eef7f4] hover:bg-[#e0f1eb] border border-[#d2e5df] rounded-lg transition-colors cursor-pointer"
          >
            Ganti {roleLabel}
          </button>
        )}
      </div>

      {!verified ? (
        <div className="space-y-2 relative" ref={dropdownRef}>
          <label htmlFor="wargaSearchInput" className="block text-xs font-semibold text-[#526b65] mb-1">
            Cari & Pilih Data Warga
          </label>
          <input
            id="wargaSearchInput"
            type="text"
            className="w-full border border-[#d2e5df] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#142e29] focus:outline-none focus:border-[#0d7565] focus:ring-3 focus:ring-[#0d7565]/15 bg-white transition-all placeholder:text-[#8ba39c]"
            placeholder="Ketik NIS, NIP, atau Nama Warga..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onClick={() => setIsOpen(true)}
          />

          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-[#d2e5df] rounded-xl shadow-lg max-h-60 overflow-auto">
              {filteredWarga.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#526b65]">Tidak ada data ditemukan.</div>
              ) : (
                <ul className="divide-y divide-[#edf4f1]">
                  {filteredWarga.map((warga) => (
                    <li key={warga.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setIsOpen(false);
                          onSelectWarga(warga);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-[#f4faf8] transition-colors flex justify-between items-center cursor-pointer"
                      >
                        <div>
                          <p className="font-bold text-xs sm:text-sm text-[#102824]">{warga.nama}</p>
                          <p className="text-[11px] text-[#526b65]">{warga.peran} {warga.keterangan_peran ? `(${warga.keterangan_peran})` : ""}</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#0d7565] bg-[#eef7f4] border border-[#d2e5df] px-2 py-0.5 rounded-md">
                          {warga.id}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          
          {isScanning && (
            <div className="mt-4 p-4 text-center text-xs font-semibold text-[#0d7565] animate-pulse bg-[#eef7f4] border border-[#d2e5df] rounded-xl">
              Memverifikasi data...
            </div>
          )}
        </div>
      ) : (
        selectedWarga && (
          <div className="p-4 bg-[#eef7f4] border border-[#d2e5df] rounded-xl flex items-start gap-4 animate-in fade-in duration-300">
            <div className="w-10 h-10 rounded-full bg-[#0d7565] text-white flex items-center justify-center font-bold text-base flex-shrink-0 shadow-xs">
              {selectedWarga.nama.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-sm text-[#102824]">{selectedWarga.nama}</p>
              <p className="text-xs text-[#0d7565] font-mono mt-0.5 font-bold">
                ID: {selectedWarga.id}
              </p>
              <p className="text-xs text-[#526b65] mt-1">
                {selectedWarga.peran} {selectedWarga.keterangan_peran ? `(${selectedWarga.keterangan_peran})` : ""} &bull; {selectedWarga.nomor_telepon || "Tidak ada kontak"}
              </p>
            </div>
            <div className="ml-auto flex items-center justify-center h-full">
               <span className="bg-[#0d7565] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  Terverifikasi
               </span>
            </div>
          </div>
        )
      )}
    </div>
  );
}
