"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, X, PackageCheck } from "lucide-react";
import PengambilanRow from "./PengambilanRow";
import ConfirmAdminModal from "@/components/shared/ConfirmAdminModal";
import RiwayatFAB from "@/components/shared/RiwayatFAB";
import DeleteConfirmModal from "@/components/riwayat/DeleteConfirmModal";
import RiwayatDetailModal from "@/components/riwayat/RiwayatDetailModal";
import PengambilanDetailContent from "@/components/riwayat/PengambilanDetailContent";
import {
  deleteAllClaimTransactions,
  deleteClaimTransaction,
  getClaimTransactionById,
} from "@/features/claim/actions";
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

interface PengambilanClientProps {
  claims: any[];
}

export default function PengambilanClient({ claims }: PengambilanClientProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";
  const [claimList, setClaimList] = useState<any[]>(claims);
  const [prevClaims, setPrevClaims] = useState<any[]>(claims);
  const [isConfirmAllModalOpen, setIsConfirmAllModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Modal Detail & Hapus Single Row
  const [detailItem, setDetailItem] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeletingSingle, setIsDeletingSingle] = useState(false);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  if (claims !== prevClaims) {
    setPrevClaims(claims);
    setClaimList(claims);
  }

  const supabase = createClient();

  // Supabase Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("pengambilan-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "claim_transactions" },
        async (payload: { new: Record<string, any> }) => {
          if (!payload.new?.id) return;
          const fullClaim = await getClaimTransactionById(payload.new.id);
          if (fullClaim) {
            setClaimList((current) => {
              if (current.some((item) => item.id === fullClaim.id)) {
                return current.map((item) => (item.id === fullClaim.id ? fullClaim : item));
              }
              return [fullClaim, ...current];
            });
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "claim_transactions" },
        (payload: { old: Record<string, any> }) => {
          if (payload.old?.id) {
            setClaimList((current) => current.filter((item) => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Handler Hapus Single Transaksi Pengambilan
  const handleConfirmSingleDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id;
    const itemName = deleteTarget.foundItem?.jenis?.name || "Barang";
    const previousClaims = [...claimList];

    try {
      setIsDeletingSingle(true);
      // Optimistic update
      setClaimList((current) => current.filter((c) => c.id !== targetId));
      await deleteClaimTransaction(targetId);
      showToast(`Transaksi pengambilan untuk "${itemName}" berhasil dihapus.`, "success");
      setDeleteTarget(null);
    } catch {
      setClaimList(previousClaims);
      showToast(`Gagal menghapus transaksi pengambilan "${itemName}".`, "error");
    } finally {
      setIsDeletingSingle(false);
    }
  };

  // Handler Hapus Seluruh Riwayat Pengambilan
  const handleKonfirmasiHapusSemua = async () => {
    const snapshot = [...claimList];
    const count = snapshot.length;
    setClaimList([]);
    try {
      await deleteAllClaimTransactions();
      showToast(`${count} riwayat pengambilan berhasil dihapus.`, "success");
    } catch {
      setClaimList(snapshot);
      showToast("Gagal menghapus riwayat pengambilan. Data dikembalikan.", "error");
      throw new Error("Gagal menghapus semua riwayat pengambilan.");
    }
  };

  const filteredClaims = claimList.filter((item) => {
    return (
      !query ||
      item.claimantName?.toLowerCase().includes(query) ||
      item.claimantIdCard?.toLowerCase().includes(query) ||
      item.warga?.nama?.toLowerCase().includes(query) ||
      item.warga?.id?.toLowerCase().includes(query) ||
      item.foundItem?.businessCode?.toLowerCase().includes(query) ||
      item.foundItem?.jenis?.name?.toLowerCase().includes(query) ||
      item.foundItem?.merek?.name?.toLowerCase().includes(query) ||
      item.foundItem?.warna?.name?.toLowerCase().includes(query) ||
      item.foundItem?.lokasi?.name?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}

      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Menampilkan <strong>{filteredClaims.length}</strong> transaksi pengambilan
        </span>
      </div>

      {/* Tabel Utama Riwayat Pengambilan Barang */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden mb-24">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">ID Pengambil</th>
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
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400 text-sm">
                    Tidak ada riwayat transaksi serah terima.
                  </td>
                </tr>
              ) : (
                filteredClaims.map((item) => (
                  <PengambilanRow
                    key={item.id}
                    item={item}
                    onOpenDetail={(c) => setDetailItem(c)}
                    onOpenDelete={(c) => setDeleteTarget(c)}
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
          title="Detail Pengambilan Barang"
          subtitle={`Kode Barang: ${detailItem.foundItem?.businessCode || "—"}`}
        >
          <PengambilanDetailContent claim={detailItem} onToast={showToast} />
        </RiwayatDetailModal>
      )}

      {/* MODAL KONFIRMASI HAPUS SINGLE PENGAMBILAN */}
      {deleteTarget && (
        <DeleteConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmSingleDelete}
          isLoading={isDeletingSingle}
          title="Hapus Transaksi Pengambilan"
          itemName={`${deleteTarget.foundItem?.jenis?.name || "Barang"} (${deleteTarget.foundItem?.businessCode || "—"})`}
          itemIdentifier={`Pengambil: ${deleteTarget.warga?.nama || deleteTarget.claimantName || "—"} (ID: ${deleteTarget.claimantIdCard || deleteTarget.wargaId || "—"})`}
          description="Menghapus transaksi ini akan mengembalikan status barang temuan terkait menjadi 'Tersedia' (FOUND) kembali di sistem."
        />
      )}

      {/* FAB: Proses Pengambilan Barang -> /ambil | Hapus Riwayat Pengambilan */}
      <RiwayatFAB
        tambahHref="/ambil"
        tambahLabel="Proses Pengambilan Barang"
        tambahIcon={<PackageCheck className="h-5 w-5" />}
        hapusLabel="Hapus Riwayat Pengambilan"
        jumlahData={claimList.length}
        onHapus={() => setIsConfirmAllModalOpen(true)}
      />

      {/* MODAL HAPUS SEMUA DATA */}
      <ConfirmAdminModal
        isOpen={isConfirmAllModalOpen}
        onClose={() => setIsConfirmAllModalOpen(false)}
        onConfirm={handleKonfirmasiHapusSemua}
        title="Hapus Seluruh Riwayat Pengambilan Barang"
        targetName={`seluruh riwayat transaksi serah terima (${claimList.length} data)`}
      />
    </div>
  );
}
