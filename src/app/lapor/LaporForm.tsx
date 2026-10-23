"use client";

import { useState, useEffect } from "react";
import { createLostReport } from "@/features/item/actions/lost-report";
import { getSemuaWarga } from "@/features/warga/actions";
import { Warga } from "@/features/warga/types";
import { FoundItemMatch } from "@/features/item/types";
import WargaVerificationCard from "@/features/warga/components/WargaVerificationCard";
import StepDetailBarang from "@/features/item/components/StepDetailBarang";

interface MasterItem {
  id: string;
  name: string;
}

interface LaporFormProps {
  jenisList: MasterItem[];
  warnaList: MasterItem[];
  merekList: MasterItem[];
  lokasiList: MasterItem[];
}

export default function LaporForm({
  jenisList,
  warnaList,
  merekList,
  lokasiList,
}: LaporFormProps) {
  // =========================
  // STATE DATA WARGA
  // =========================

  const [masterDataWarga, setMasterDataWarga] = useState<Warga[]>([]);
  const [selectedWarga, setSelectedWarga] = useState<Warga | null>(null);

  // =========================
  // STATE ATRIBUT BARANG
  // =========================

  const [jenisId, setJenisId] = useState("");
  const [warnaId, setWarnaId] = useState("");
  const [merekId, setMerekId] = useState("");
  const [lokasiId, setLokasiId] = useState("");

  // Barang temuan terpilih untuk klaim instan
  const [matchedFoundItem, setMatchedFoundItem] =
    useState<FoundItemMatch | null>(null);

  // =========================
  // STATE UI
  // =========================

  const [isScanning, setIsScanning] = useState(false);
  const [verified, setVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // =========================
  // AMBIL DATA WARGA
  // =========================

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

  // =========================
  // VERIFIKASI WARGA
  // =========================

  const handleSelectWarga = (warga: Warga) => {
    setIsScanning(true);
    setErrorMessage("");

    setTimeout(() => {
      setIsScanning(false);
      setVerified(true);
      setSelectedWarga(warga);
    }, 1000);
  };

  const handleResetWarga = () => {
    setVerified(false);
    setSelectedWarga(null);
    setMatchedFoundItem(null);
  };

  // =========================
  // SUBMIT LAPORAN
  // =========================

  const handleSubmitReport = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!verified || !selectedWarga) {
      setErrorMessage(
        "Verifikasi data pelapor wajib dilakukan terlebih dahulu!"
      );
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    // Data identitas pelapor
    formData.set("reporterName", selectedWarga.nama);
    formData.set("reporterIdCard", selectedWarga.id);
    formData.set(
      "reporterContact",
      selectedWarga.nomor_telepon || "-"
    );
    formData.set("wargaId", selectedWarga.id);

    // Jika memilih barang temuan untuk klaim instan
    if (matchedFoundItem) {
      formData.set("claimFoundItemId", matchedFoundItem.id);
    }

    try {
      await createLostReport(formData);
    } catch (error) {
      const err = error as Error;

      setErrorMessage(
        err.message || "Terjadi kesalahan saat menyimpan laporan."
      );

      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2 shadow-xs animate-in fade-in duration-300">
          <span>⚠️</span>
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmitReport}
        className="space-y-6"
      >
        {/* =====================================
            LANGKAH 1: VERIFIKASI DATA PELAPOR
        ===================================== */}

        <WargaVerificationCard
          masterDataWarga={masterDataWarga}
          selectedWarga={selectedWarga}
          verified={verified}
          isScanning={isScanning}
          onSelectWarga={handleSelectWarga}
          onReset={handleResetWarga}
          stepNumber={1}
          title="Verifikasi Identitas Pelapor"
          roleLabel="Pelapor"
        />

        {/* =====================================
            LANGKAH 2: DETAIL BARANG & SUBMIT
            (Hanya muncul setelah Langkah 1 selesai & terverifikasi)
        ===================================== */}

        {verified && selectedWarga && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <StepDetailBarang
              jenisList={jenisList}
              warnaList={warnaList}
              merekList={merekList}
              lokasiList={lokasiList}
              jenisId={jenisId}
              warnaId={warnaId}
              merekId={merekId}
              lokasiId={lokasiId}
              matchedFoundItem={matchedFoundItem}
              onJenisChange={setJenisId}
              onWarnaChange={setWarnaId}
              onMerekChange={setMerekId}
              onLokasiChange={setLokasiId}
              onSelectFoundItem={setMatchedFoundItem}
              onClearFoundItem={() => setMatchedFoundItem(null)}
            />

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !verified}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  !verified
                    ? "bg-gray-400 cursor-not-allowed opacity-70"
                    : matchedFoundItem
                    ? "bg-[#1a5c44] hover:bg-[#0d3b2e]"
                    : "bg-[#0d3b2e] hover:bg-[#1a5c44]"
                }`}
              >
                {isSubmitting ? (
                  <span className="animate-pulse">
                    Menyimpan...
                  </span>
                ) : matchedFoundItem ? (
                  <>
                    Simpan Laporan & Selesaikan Klaim Sekaligus
                    (Jalur 2) &rarr;
                  </>
                ) : (
                  <>
                    Buat Laporan Kehilangan (Jalur 1) &rarr;
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}