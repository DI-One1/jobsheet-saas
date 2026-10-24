"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, X, FilePlus } from "lucide-react";
import LaporanRow from "./LaporanRow";
import ConfirmAdminModal from "@/components/shared/ConfirmAdminModal";
import RiwayatFAB from "@/components/shared/RiwayatFAB";
import DeleteConfirmModal from "@/components/riwayat/DeleteConfirmModal";
import RiwayatDetailModal from "@/components/riwayat/RiwayatDetailModal";
import LaporanDetailContent from "@/components/riwayat/LaporanDetailContent";
import { deleteAllLostReports, deleteLostReport, getLostReportById } from "@/features/item/actions/lost-report";
import { createClient } from "@/lib/supabase";

type ToastType = "success" | "error";

function Toast({ message, type, onDismiss }: { message: string; type: ToastType; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      role="alert"
      className={`fixed top-6 right-6 z-[3000] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl border text-xs font-semibold animate-in slide-in-from-top-2 fade-in duration-300 ${
        type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"
      }`}
    >
      {type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
      <span>{message}</span>
      <button onClick={onDismiss} className="ml-2 p-0.5 rounded hover:bg-black/5 transition-colors cursor-pointer" aria-label="Tutup notifikasi">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

interface LaporanClientProps {
  riwayatList: any[];
}

export default function LaporanClient({ riwayatList }: LaporanClientProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";
  const [items, setItems] = useState<any[]>(riwayatList);
  const [prevRiwayatList, setPrevRiwayatList] = useState<any[]>(riwayatList);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [isConfirmAllModalOpen, setIsConfirmAllModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Modal Detail & Hapus Single Row
  const [detailItem, setDetailItem] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeletingSingle, setIsDeletingSingle] = useState(false);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  if (riwayatList !== prevRiwayatList) {
    setPrevRiwayatList(riwayatList);
    setItems(riwayatList);
  }

  const supabase = createClient();

  // Supabase Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("laporan-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "lost_reports" },
        async (payload: { new: Record<string, any> }) => {
          if (!payload.new?.id) return;
          const fullReport = await getLostReportById(payload.new.id);
          if (fullReport) {
            setItems((current) => {
              if (current.some((item) => item.id === fullReport.id)) {
                return current.map((item) => (item.id === fullReport.id ? fullReport : item));
              }
              return [fullReport, ...current];
            });
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "lost_reports" },
        async (payload: { new: Record<string, any> }) => {
          if (!payload.new?.id) return;
          const fullReport = await getLostReportById(payload.new.id);
          if (fullReport) {
            setItems((current) =>
              current.map((item) => (item.id === fullReport.id ? fullReport : item))
            );
          } else {
            setItems((current) =>
              current.map((item) =>
                item.id === payload.new.id ? { ...item, status: payload.new.status } : item
              )
            );
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "lost_reports" },
        (payload: { old: Record<string, any> }) => {
          if (payload.old?.id) {
            setItems((current) => current.filter((item) => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Handler Hapus Single Laporan
  const handleConfirmSingleDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id;
    const itemName = deleteTarget.jenis?.name || "Laporan Kehilangan";
    const previousItems = [...items];

    try {
      setIsDeletingSingle(true);
      // Optimistic update
      setItems((current) => current.filter((i) => i.id !== targetId));
      await deleteLostReport(targetId);
      showToast(`Laporan kehilangan "${itemName}" berhasil dihapus.`, "success");
      setDeleteTarget(null);
    } catch {
      setItems(previousItems);
      showToast(`Gagal menghapus laporan kehilangan "${itemName}".`, "error");
    } finally {
      setIsDeletingSingle(false);
    }
  };

  // Handler Hapus Seluruh Riwayat Laporan
  const handleKonfirmasiHapusSemua = async () => {
    const snapshot = [...items];
    const count = snapshot.length;
    setItems([]);
    try {
      await deleteAllLostReports();
      showToast(`${count} riwayat laporan berhasil dihapus.`, "success");
    } catch {
      setItems(snapshot);
      showToast("Gagal menghapus riwayat laporan. Data dikembalikan.", "error");
      throw new Error("Gagal menghapus semua riwayat laporan.");
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !query ||
      item.reporterName?.toLowerCase().includes(query) ||
      item.reporterIdCard?.toLowerCase().includes(query) ||
      item.warga?.nama?.toLowerCase().includes(query) ||
      item.warga?.id?.toLowerCase().includes(query) ||
      item.jenis?.name?.toLowerCase().includes(query) ||
      item.merek?.name?.toLowerCase().includes(query) ||
      item.warna?.name?.toLowerCase().includes(query) ||
      item.lokasi?.name?.toLowerCase().includes(query);

    const matchesStatus = filterStatus === "ALL" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}

      {/* Filter Status & Counter */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          {["ALL", "DICARI", "SELESAI"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterStatus === status
                  ? "bg-[#0d3b2e] text-white shadow-xs"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {status === "ALL" ? "Semua Laporan" : status === "DICARI" ? "Sedang Dicari" : "Selesai"}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-500">
          Menampilkan <strong>{filteredItems.length}</strong> data
        </span>
      </div>

      {/* Tabel Utama Riwayat Laporan Kehilangan */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden mb-24">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">ID Pelapor</th>
                <th className="px-6 py-4">Jenis Barang</th>
                <th className="px-6 py-4">Merek</th>
                <th className="px-6 py-4">Warna</th>
                <th className="px-6 py-4">Lokasi</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400 text-sm">
                    Tidak ada riwayat laporan kehilangan yang cocok.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <LaporanRow
                    key={item.id}
                    item={item}
                    onOpenDetail={(r) => setDetailItem(r)}
                    onOpenDelete={(r) => setDeleteTarget(r)}
                    onToast={showToast}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL RINCIAN OVERLAY */}
      {detailItem && (
        <RiwayatDetailModal
          isOpen={!!detailItem}
          onClose={() => setDetailItem(null)}
          title="Detail Laporan Kehilangan"
          subtitle={`ID Laporan: ${detailItem.id}`}
        >
          <LaporanDetailContent report={detailItem} onToast={showToast} />
        </RiwayatDetailModal>
      )}

      {/* MODAL KONFIRMASI HAPUS SINGLE LAPORAN */}
      {deleteTarget && (
        <DeleteConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmSingleDelete}
          isLoading={isDeletingSingle}
          title="Hapus Laporan Kehilangan"
          itemName={`${deleteTarget.jenis?.name || "Laporan Kehilangan"} (${deleteTarget.warna?.name || ""} ${deleteTarget.merek?.name || ""})`}
          itemIdentifier={`Pelapor: ${deleteTarget.warga?.nama || deleteTarget.reporterName || "—"} (ID: ${deleteTarget.reporterIdCard || deleteTarget.wargaId || "—"})`}
          description="Menghapus laporan ini akan menghapus riwayat laporan kehilangan dari sistem. Notifikasi terkait juga akan dibersihkan."
        />
      )}

      {/* FAB: Tambah Laporan Kehilangan -> /lapor | Hapus Riwayat Laporan */}
      <RiwayatFAB
        tambahHref="/lapor"
        tambahLabel="Tambah Laporan Kehilangan"
        tambahIcon={<FilePlus className="h-5 w-5" />}
        hapusLabel="Hapus Riwayat Laporan"
        jumlahData={items.length}
        onHapus={() => setIsConfirmAllModalOpen(true)}
      />

      {/* MODAL HAPUS SEMUA DATA */}
      <ConfirmAdminModal
        isOpen={isConfirmAllModalOpen}
        onClose={() => setIsConfirmAllModalOpen(false)}
        onConfirm={handleKonfirmasiHapusSemua}
        title="Hapus Seluruh Riwayat Laporan Kehilangan"
        targetName={`seluruh riwayat laporan kehilangan (${items.length} data)`}
      />
    </div>
  );
}
