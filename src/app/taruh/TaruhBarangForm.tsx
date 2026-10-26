"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createFoundItem, getBusinessCodePreview } from "@/features/item/actions/found-item";
import { getSemuaWarga } from "@/features/warga/actions";
import { Warga } from "@/features/warga/types";
import WargaVerificationCard from "@/features/warga/components/WargaVerificationCard";

interface MasterItem {
  id: string;
  name: string;
}

interface TaruhBarangFormProps {
  categories: MasterItem[];
  colors: MasterItem[];
  brands: MasterItem[];
  locations: MasterItem[];
}

export default function TaruhBarangForm({
  categories,
  colors,
  brands,
  locations,
}: TaruhBarangFormProps) {
  const [masterDataWarga, setMasterDataWarga] = useState<Warga[]>([]);
  const [selectedWarga, setSelectedWarga] = useState<Warga | null>(null);

  // Atribut barang
  const [jenisId, setJenisId] = useState("");
  const [warnaId, setWarnaId] = useState("");
  const [merekId, setMerekId] = useState("");
  const [lokasiId, setLokasiId] = useState("");
  const [additionalDesc, setAdditionalDesc] = useState("");

  // Preview kode barang
  const [previewCode, setPreviewCode] = useState<string | null>(null);

  // UI States
  const [isScanning, setIsScanning] = useState(false);
  const [verified, setVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchWarga = async () => {
      try {
        const data = await getSemuaWarga();
        if (data && data.length > 0) {
          setMasterDataWarga(data);
        }
      } catch (error) {
        console.error("Gagal memuat DB Warga", error);
      }
    };
    fetchWarga();
  }, []);

  // Update preview code when all 4 attributes are selected
  useEffect(() => {
    let active = true;
    if (jenisId && warnaId && merekId && lokasiId) {
      getBusinessCodePreview({ jenisId, warnaId, merekId, lokasiId }).then((code) => {
        if (active) setPreviewCode(code);
      });
    } else {
      queueMicrotask(() => {
        if (active) setPreviewCode(null);
      });
    }
    return () => {
      active = false;
    };
  }, [jenisId, warnaId, merekId, lokasiId]);

  const handleSelectWarga = (warga: Warga) => {
    setIsScanning(true);
    setErrorMessage("");

    setTimeout(() => {
      setIsScanning(false);
      setVerified(true);
      setSelectedWarga(warga);
    }, 800);
  };

  const handleResetWarga = () => {
    setSelectedWarga(null);
    setVerified(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!verified || !selectedWarga) {
      setErrorMessage("Identitas penemu barang wajib diverifikasi terlebih dahulu!");
      return;
    }

    if (!jenisId || !warnaId || !merekId || !lokasiId) {
      setErrorMessage("Mohon lengkapi seluruh atribut barang temuan!");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.set("finderName", selectedWarga.nama);
    formData.set("finderIdCard", selectedWarga.id);
    formData.set("finderContact", selectedWarga.nomor_telepon || "-");
    formData.set("wargaId", selectedWarga.id);
    formData.set("jenisId", jenisId);
    formData.set("warnaId", warnaId);
    formData.set("merekId", merekId);
    formData.set("lokasiId", lokasiId);
    formData.set("additionalDesc", additionalDesc);

    try {
      await createFoundItem(formData);
    } catch (error) {
      const err = error as Error;
      if (err.message && !err.message.includes("NEXT_REDIRECT")) {
        setErrorMessage(err.message || "Terjadi kesalahan saat menyimpan data.");
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 max-w-4xl flex-grow">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-[#3dbd84] flex items-center gap-2 w-fit mb-2 transition-colors"
        >
          <span>&larr;</span> Kembali ke Beranda
        </Link>
        <h1 className="text-3xl font-extrabold text-[#0d3b2e]">
          Formulir Taruh Barang Temuan
        </h1>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Identitas Penemu */}
        <WargaVerificationCard
          masterDataWarga={masterDataWarga}
          selectedWarga={selectedWarga}
          verified={verified}
          isScanning={isScanning}
          onSelectWarga={handleSelectWarga}
          onReset={handleResetWarga}
          stepNumber={1}
          title="Verifikasi Identitas Penemu"
          roleLabel="Penemu"
        />

        {/* Step 2: Detail Barang Temuan & Aksi
            (Hanya muncul setelah Langkah 1 selesai & terverifikasi) */}
        {verified && selectedWarga && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
              <h3 className="text-lg font-bold text-[#0d3b2e] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0d3b2e] text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                Detail Barang Temuan
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Jenis Barang <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={jenisId}
                    onChange={(e) => setJenisId(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3dbd84] bg-white transition-all"
                  >
                    <option value="">-- Pilih Jenis Barang --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Warna Barang <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={warnaId}
                    onChange={(e) => setWarnaId(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3dbd84] bg-white transition-all"
                  >
                    <option value="">-- Pilih Warna --</option>
                    {colors.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Merek / Karakteristik <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={merekId}
                    onChange={(e) => setMerekId(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3dbd84] bg-white transition-all"
                  >
                    <option value="">-- Pilih Merek --</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Lokasi Ditemukan <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={lokasiId}
                    onChange={(e) => setLokasiId(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3dbd84] bg-white transition-all"
                  >
                    <option value="">-- Pilih Lokasi Ditemukan --</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Deskripsi Tambahan / Ciri Khusus
                </label>
                <textarea
                  rows={3}
                  value={additionalDesc}
                  onChange={(e) => setAdditionalDesc(e.target.value)}
                  placeholder="Contoh: Ada stiker kucing di pojok kanan, ada gantungan kunci huruf A..."
                  className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-[#3dbd84] transition-all"
                />
              </div>

              {/* Preview Kode Unik */}
              {previewCode && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wider">
                      Kode Barang Otomatis (Preview)
                    </p>
                    <p className="text-xl font-mono font-extrabold text-[#0d3b2e] mt-0.5">
                      {previewCode}
                    </p>
                  </div>
                  <span className="text-xs bg-emerald-200/70 text-emerald-800 font-bold px-3 py-1 rounded-full">
                    Auto-Generated
                  </span>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="flex justify-end gap-4 pt-4">
              <Link
                href="/dashboard"
                className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || !verified}
                className="px-8 py-3 bg-[#3dbd84] hover:bg-[#32a873] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer"
              >
                {isSubmitting ? "Menyimpan Data..." : "Simpan Barang Temuan"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
