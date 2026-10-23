import { Warga, WargaActivityItem, ActivityType } from "../types";
import { Modal } from "@/components/ui/Modal";
import {
  Clock,
  MapPin,
  Tag,
  FileText,
  Package,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Hash,
  Phone,
  User,
  ShieldCheck,
  Activity,
  Layers,
  ChevronRight,
} from "lucide-react";

interface WargaActivityModalProps {
  aksiWarga: Warga;
  isOpen: boolean;
  activityHistory: WargaActivityItem[];
  isLoadingActivities: boolean;
  activeFilter: ActivityType;
  setActiveFilter: (filter: ActivityType) => void;
  onClose: () => void;
}

export default function WargaActivityModal({
  aksiWarga,
  isOpen,
  activityHistory,
  isLoadingActivities,
  activeFilter,
  setActiveFilter,
  onClose,
}: WargaActivityModalProps) {
  // Filter aktivitas berdasarkan tab yang aktif
  const filteredActivities = activityHistory.filter((item) => {
    if (activeFilter === "ALL") return true;
    return item.type === activeFilter;
  });

  // Hitung statistik riwayat aksi warga
  const totalCount = activityHistory.length;
  const laporanCount = activityHistory.filter((i) => i.type === "LAPORAN").length;
  const taruhCount = activityHistory.filter((i) => i.type === "TARUH").length;
  const pengambilanCount = activityHistory.filter((i) => i.type === "PENGAMBILAN").length;
  const selesaiCount = activityHistory.filter(
    (i) => i.status === "SELESAI" || i.status === "CLAIMED"
  ).length;

  const formatActivityDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  // Helper untuk memecah informasi kategori (misal: "Warna: Putih | Merek: Nike")
  const parseCategoryBadges = (categoryStr: string) => {
    if (!categoryStr) return [];
    if (categoryStr.includes("|")) {
      return categoryStr
        .split("|")
        .map((part) => part.trim())
        .filter((part) => part && !part.endsWith(":-") && !part.endsWith(": -") && part !== "-");
    }
    return [categoryStr];
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Riwayat Aksi Warga"
      className="max-w-4xl w-full h-[90vh] md:h-[84vh] max-h-[850px] flex flex-col overflow-hidden"
    >
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Main Content Layout: 1 kolom di mobile, 2 kolom di desktop (md) */}
        <div className="flex-1 min-h-0 flex flex-col md:grid md:grid-cols-12 gap-5 md:gap-6 overflow-y-auto md:overflow-hidden">
          
          {/* =========================================================================
              KOLOM KIRI: Profil Warga & Ringkasan Statistik
              ========================================================================= */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-4 md:overflow-y-auto md:pr-2 custom-scrollbar">
            {/* Card Profil Warga */}
            <div className="bg-gradient-to-br from-emerald-50/70 via-white to-gray-50/50 rounded-2xl p-4 sm:p-5 border border-emerald-100/80 shadow-xs flex flex-col gap-3.5">
              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0d3b2e] to-[#1a5c44] text-white flex items-center justify-center font-bold text-2xl shadow-md ring-4 ring-emerald-50 shrink-0">
                  {aksiWarga.nama.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-green-dark leading-snug truncate">
                    {aksiWarga.nama}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-white text-green-mid border border-emerald-200/70 shadow-2xs">
                      ID: {aksiWarga.id}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-medium">
                      {aksiWarga.peran}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detail Keterangan & Kontak */}
              <div className="pt-2 border-t border-gray-100/90 text-xs space-y-1.5 text-gray-600">
                {aksiWarga.keterangan_peran && (
                  <div className="flex items-center gap-2 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-gray-500">Keterangan:</span>
                    <span className="font-semibold text-gray-800">{aksiWarga.keterangan_peran}</span>
                  </div>
                )}
                {aksiWarga.nomor_telepon ? (
                  <div className="flex items-center gap-2 text-[11px]">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-gray-500">Telepon:</span>
                    <a
                      href={`https://wa.me/${aksiWarga.nomor_telepon.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                    >
                      {aksiWarga.nomor_telepon}
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[11px] text-gray-400">
                    <Phone className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                    <span>Kontak belum tersedia</span>
                  </div>
                )}
              </div>
            </div>

            {/* Card Ringkasan Statistik / Total Aksi */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-green-mid" />
                  Ringkasan Statistik
                </span>
                <span className="text-[11px] font-semibold text-gray-400">Total Akumulasi</span>
              </div>

              {/* Hero Banner: Total Kontribusi */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-emerald-900">Total Aksi Warga</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Semua riwayat terdata</p>
                </div>
                <div className="text-2xl font-black text-green-dark">
                  {totalCount}
                </div>
              </div>

              {/* Interactive Category Counters */}
              <div className="space-y-2 pt-1">
                {/* Laporan */}
                <button
                  type="button"
                  onClick={() => setActiveFilter("LAPORAN")}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                    activeFilter === "LAPORAN"
                      ? "bg-blue-50/80 border-blue-300 ring-2 ring-blue-100"
                      : "bg-gray-50/60 hover:bg-blue-50/40 border-gray-100 hover:border-blue-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100/80 text-blue-700 flex items-center justify-center shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">Laporan Kehilangan</p>
                      <p className="text-[10px] text-gray-500">Barang dilaporkan hilang</p>
                    </div>
                  </div>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {laporanCount}
                  </span>
                </button>

                {/* Taruh / Temuan */}
                <button
                  type="button"
                  onClick={() => setActiveFilter("TARUH")}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                    activeFilter === "TARUH"
                      ? "bg-teal-50/80 border-teal-300 ring-2 ring-teal-100"
                      : "bg-gray-50/60 hover:bg-teal-50/40 border-gray-100 hover:border-teal-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-100/80 text-teal-700 flex items-center justify-center shrink-0">
                      <Package className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">Barang Temuan</p>
                      <p className="text-[10px] text-gray-500">Barang dititip di posko</p>
                    </div>
                  </div>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                    {taruhCount}
                  </span>
                </button>

                {/* Pengambilan */}
                <button
                  type="button"
                  onClick={() => setActiveFilter("PENGAMBILAN")}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                    activeFilter === "PENGAMBILAN"
                      ? "bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-100"
                      : "bg-gray-50/60 hover:bg-emerald-50/40 border-gray-100 hover:border-emerald-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">Pengambilan / Klaim</p>
                      <p className="text-[10px] text-gray-500">Barang berhasil diambil</p>
                    </div>
                  </div>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {pengambilanCount}
                  </span>
                </button>
              </div>

              {/* Progress Bar Status Selesai */}
              {totalCount > 0 && (
                <div className="mt-1 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="text-gray-500 font-medium">Terselesaikan</span>
                    <span className="font-bold text-green-dark">
                      {selesaiCount} / {totalCount} ({Math.round((selesaiCount / totalCount) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.round((selesaiCount / totalCount) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* =========================================================================
              KOLOM KANAN: Filter Aksi & Daftar Kartu Riwayat Aksi
              ========================================================================= */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col min-h-0 bg-gray-50/50 rounded-2xl p-3 sm:p-4 border border-gray-200/70 overflow-hidden">
            {/* Header Toolbar: Filter Tabs & Counter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 mb-3 border-b border-gray-200/60 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Daftar Aksi
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-green-dark text-xs font-bold">
                  {filteredActivities.length}
                </span>
              </div>

              {/* Filter Tabs Pills */}
              <div className="flex flex-wrap items-center bg-gray-200/70 p-1 rounded-xl gap-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveFilter("ALL")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeFilter === "ALL"
                      ? "bg-white text-green-dark shadow-sm font-bold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Semua
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter("LAPORAN")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeFilter === "LAPORAN"
                      ? "bg-white text-blue-700 shadow-sm font-bold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Laporan
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter("TARUH")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeFilter === "TARUH"
                      ? "bg-white text-teal-700 shadow-sm font-bold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Taruh
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter("PENGAMBILAN")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeFilter === "PENGAMBILAN"
                      ? "bg-white text-emerald-700 shadow-sm font-bold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Ambil
                </button>
              </div>
            </div>

            {/* Scrollable Cards List */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1.5 custom-scrollbar">
              {isLoadingActivities ? (
                <div className="py-16 text-center text-xs text-gray-500 animate-pulse flex flex-col items-center justify-center gap-3">
                  <div className="w-7 h-7 border-3 border-green-dark/20 border-t-green-dark rounded-full animate-spin" />
                  <span className="font-medium">Memuat riwayat aksi warga...</span>
                </div>
              ) : filteredActivities.length === 0 ? (
                <div className="py-16 px-4 text-center bg-white rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-gray-700">Tidak ada riwayat aktivitas</p>
                  <p className="text-xs text-gray-400 max-w-xs">
                    {activeFilter === "ALL"
                      ? "Warga ini belum memiliki riwayat aksi kehilangan, temuan, atau klaim."
                      : "Tidak ada riwayat untuk kategori filter ini."}
                  </p>
                </div>
              ) : (
                filteredActivities.map((act) => {
                  const categoryBadges = parseCategoryBadges(act.category);

                  return (
                    <div
                      key={act.id}
                      className="group bg-white border border-gray-200/90 hover:border-emerald-300 rounded-xl p-4 transition-all duration-200 shadow-2xs hover:shadow-sm space-y-2.5"
                    >
                      {/* Baris 1: Tipe Aksi, Tanggal, Kode Unik & Status */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        {/* Kiri: Tipe & Tanggal */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase border ${
                              act.type === "LAPORAN"
                                ? "bg-blue-50 text-blue-700 border-blue-200/80"
                                : act.type === "TARUH"
                                ? "bg-teal-50 text-teal-700 border-teal-200/80"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                            }`}
                          >
                            {act.type === "LAPORAN" ? (
                              <>
                                <FileText className="w-3 h-3 text-blue-600" />
                                <span>KEHILANGAN</span>
                              </>
                            ) : act.type === "TARUH" ? (
                              <>
                                <Package className="w-3 h-3 text-teal-600" />
                                <span>TEMUAN</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>PENGAMBILAN</span>
                              </>
                            )}
                          </span>

                          <span className="text-gray-400 text-[11px] font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            {formatActivityDate(act.date)}
                          </span>
                        </div>

                        {/* Kanan: Business Code & Status Badge */}
                        <div className="flex items-center gap-1.5">
                          {act.businessCode && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200/80 font-mono text-[10px] font-bold">
                              <Hash className="w-2.5 h-2.5 text-gray-400" />
                              {act.businessCode}
                            </span>
                          )}

                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                              act.status === "SELESAI"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : act.status === "DICARI"
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : act.status === "FOUND"
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : act.status === "CLAIMED"
                                ? "bg-teal-100 text-teal-800 border border-teal-200"
                                : "bg-red-100 text-red-800 border border-red-200"
                            }`}
                          >
                            {act.status}
                          </span>
                        </div>
                      </div>

                      {/* Baris 2: Judul Barang */}
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base leading-snug group-hover:text-green-dark transition-colors">
                          {act.title}
                        </h4>
                      </div>

                      {/* Baris 3: Metadata Atribut (Warna, Merek, Lokasi) */}
                      <div className="flex items-center flex-wrap gap-1.5 text-xs pt-0.5">
                        {categoryBadges.map((badge, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100/80 border border-gray-200/60 text-gray-700 text-[11px] font-medium"
                          >
                            <Tag className="w-3 h-3 text-gray-400" />
                            {badge}
                          </span>
                        ))}

                        {act.lokasi && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50/70 border border-emerald-200/60 text-emerald-900 text-[11px] font-medium">
                            <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>
                              Lokasi: <strong className="font-semibold text-emerald-950">{act.lokasi}</strong>
                            </span>
                          </span>
                        )}
                      </div>

                      {/* Baris 4: Deskripsi Tambahan (jika ada) */}
                      {act.description && (
                        <div className="mt-1 text-xs text-gray-600 bg-gray-50/90 border border-gray-200/70 rounded-lg p-2.5 leading-relaxed">
                          <p className="line-clamp-3">{act.description}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            FOOTER MODAL
            ========================================================================= */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-3 shrink-0">
          <span className="text-[11px] text-gray-500 font-medium bg-gray-100 px-2.5 py-1 rounded-md">
            Menampilkan <strong className="text-gray-800">{filteredActivities.length}</strong> dari <strong className="text-gray-800">{totalCount}</strong> total aksi
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-green-dark hover:bg-green-mid text-white rounded-xl transition-all shadow-xs text-xs font-semibold cursor-pointer active:scale-95"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
}

