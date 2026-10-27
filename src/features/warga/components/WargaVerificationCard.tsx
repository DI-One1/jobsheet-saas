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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-green-dark flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-green-dark text-white text-xs flex items-center justify-center font-bold">
            {stepNumber}
          </span>
          {title}
        </h3>
        {verified && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-blue-600 hover:text-blue-800 font-bold px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
          >
            Ganti {roleLabel}
          </button>
        )}
      </div>

      {!verified ? (
        <div className="space-y-3 relative" ref={dropdownRef}>
          <label htmlFor="wargaSearchInput" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
            Cari & Pilih Data Warga
          </label>
          <input
            id="wargaSearchInput"
            type="text"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-accent bg-white transition-all"
            placeholder="Ketik NIS, NIP, atau Nama Warga..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onClick={() => setIsOpen(true)}
          />

          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
              {filteredWarga.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">Tidak ada data ditemukan.</div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {filteredWarga.map((warga) => (
                    <li key={warga.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setIsOpen(false);
                          onSelectWarga(warga);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex justify-between items-center cursor-pointer"
                      >
                        <div>
                          <p className="font-bold text-sm text-green-dark">{warga.nama}</p>
                          <p className="text-xs text-gray-500">{warga.peran} {warga.keterangan_peran ? `(${warga.keterangan_peran})` : ""}</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-green-mid bg-green-accent/10 px-2 py-1 rounded">
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
            <div className="mt-4 p-4 text-center text-sm text-gray-500 animate-pulse bg-gray-50 rounded-xl">
              Memverifikasi data...
            </div>
          )}
        </div>
      ) : (
        selectedWarga && (
          <div className="p-4 bg-green-accent/10 border border-green-accent/30 rounded-xl flex items-start gap-4 animate-in fade-in duration-300">
            <div className="w-10 h-10 rounded-full bg-green-mid text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
              {selectedWarga.nama.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-green-dark">{selectedWarga.nama}</p>
              <p className="text-xs text-green-mid font-mono mt-0.5 font-bold">
                ID: {selectedWarga.id}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {selectedWarga.peran} {selectedWarga.keterangan_peran ? `(${selectedWarga.keterangan_peran})` : ""} &bull; {selectedWarga.nomor_telepon || "Tidak ada kontak"}
              </p>
            </div>
            <div className="ml-auto flex items-center justify-center h-full">
               <span className="bg-green-accent text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Terverifikasi
               </span>
            </div>
          </div>
        )
      )}
    </div>
  );
}
