"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import {
  hapusWarga,
  hapusSemuaWarga,
  tambahWarga,
  getWargaActivityHistory,
} from "../actions";
import { Warga, WargaActivityItem, ActivityType } from "../types";
import { useSearchParams } from "next/navigation";
import WargaRow from "./WargaRow";
import WargaProfileModal from "./WargaProfileModal";
import WargaActivityModal from "./WargaActivityModal";
import ConfirmAdminModal from "@/components/shared/ConfirmAdminModal";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";

import { Users, UserRoundPlus, Trash2, Plus, X, CheckCircle2, AlertCircle } from "lucide-react";

import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

// UI primitives
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Table } from "@/components/ui/Table";

// ─── Toast Notification ────────────────────────────────────────────
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
        type === "success"
          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
          : "bg-red-50 border-red-200 text-red-800"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
      )}
      <span>{message}</span>
      <button
        onClick={onDismiss}
        className="ml-2 p-0.5 rounded hover:bg-black/5 transition-colors cursor-pointer"
        aria-label="Tutup notifikasi"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────
export default function WargaClient({ initialData }: { initialData: Warga[] }) {
  const [dataWarga, setDataWarga] = useState<Warga[]>(initialData);
  const [prevInitialData, setPrevInitialData] = useState<Warga[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDeleteAllOpen, setIsConfirmDeleteAllOpen] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  // State terpisah untuk dua modal
  const [profilWarga, setProfilWarga] = useState<Warga | null>(null);
  const [aksiWarga, setAksiWarga] = useState<Warga | null>(null);

  // Sync state jika server initialData berubah (pola resmi React: adjusting state during render)
  if (initialData !== prevInitialData) {
    setPrevInitialData(initialData);
    setDataWarga((current) => {
      const tempItems = current.filter((w) => Boolean(w && (w.id ?? "").startsWith("temp-")));
      const merged = [...initialData, ...tempItems];
      const seen = new Set<string>();
      return merged.filter((w) => {
        if (!w.id || seen.has(w.id)) return false;
        seen.add(w.id);
        return true;
      });
    });
  }

  // State untuk Riwayat Aksi Warga
  const [activityHistory, setActivityHistory] = useState<WargaActivityItem[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ActivityType>("ALL");

  const formRef = useRef<HTMLFormElement>(null);
  const fabRef = useRef<HTMLDivElement>(null);
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
  if (supabaseRef.current == null) {
    supabaseRef.current = createClient();
  }
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  // FAB: close on click outside
  useClickOutside(fabRef, () => {
    setIsFabOpen(false);
  });

  // FAB: close on Escape
  useKeyboardShortcut("Escape", () => {
    if (isFabOpen) setIsFabOpen(false);
  });

  // Realtime subscription via Supabase
  // Mengikuti pola resmi: https://supabase.com/docs/guides/realtime/subscribing-to-database-changes
  useEffect(() => {
    const supabase = supabaseRef.current;

    /** Map raw DB payload (snake_case) ke tipe Warga */
    const mapPayload = (p: Record<string, unknown>): Warga => ({
      id: (p.id ?? "") as string,
      nama: (p.nama ?? "") as string,
      peran: (p.peran ?? "") as string,
      keterangan_peran: (p.keterangan_peran ?? null) as string | null,
      nomor_telepon: (p.nomor_telepon ?? null) as string | null,
      created_at: (p.created_at ?? new Date().toISOString()) as string,
    });

    /** Hapus duplikat berdasarkan id */
    const dedup = (list: Warga[]) => {
      const seen = new Set<string>();
      return list.filter((w) => {
        if (!w.id || seen.has(w.id)) return false;
        seen.add(w.id);
        return true;
      });
    };

    const channel = supabase
      .channel("warga-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "warga" },
        (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          setDataWarga((current) => {
            if (payload.eventType === "DELETE") {
              const deletedId = (payload.old as Record<string, unknown>)?.id as string;
              return deletedId ? current.filter((w) => w.id !== deletedId) : current;
            }

            const changed = mapPayload(payload.new as Record<string, unknown>);
            if (!changed.id) return current;

            const exists = current.some((w) => w.id === changed.id);

            if (exists) {
              // UPDATE atau INSERT yang sudah ada (optimistic) → replace
              return dedup(current.map((w) => (w.id === changed.id ? changed : w)));
            }

            // INSERT baru → bersihkan temp item dari optimistic update, tambah di atas
            const withoutTemp = current.filter(
              (w) => !(w && (w.id ?? "").startsWith("temp-") && w.nama === changed.nama && w.peran === changed.peran)
            );
            return dedup([changed, ...withoutTemp]);
          });
        }
      )
      .subscribe((status: string) => {
        if (status === "SUBSCRIBED") {
          console.log("[Supabase Realtime] Warga channel connected ✓");
        }
        if (status === "CHANNEL_ERROR") {
          console.error("[Supabase Realtime] Channel error — cek RLS policy & publikasi tabel");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);


  // Load activity history when aksiWarga is selected
  useEffect(() => {
    if (!aksiWarga) return;

    let isMounted = true;
    const loadHistory = async () => {
      setIsLoadingActivities(true);
      try {
        const history = await getWargaActivityHistory(aksiWarga.id);
        if (isMounted) {
          setActivityHistory(history);
        }
      } catch (error) {
        console.error("Gagal memuat riwayat aksi warga:", error);
      } finally {
        if (isMounted) {
          setIsLoadingActivities(false);
        }
      }
    };

    loadHistory();
    return () => {
      isMounted = false;
    };
  }, [aksiWarga]);

  const handleRincianProfil = (warga: Warga) => {
    setProfilWarga(warga);
  };

  const handleRincianAksi = (warga: Warga) => {
    setActivityHistory([]);
    setActiveFilter("ALL");
    setAksiWarga(warga);
  };

  const handleTambahSubmit = async (formData: FormData) => {
    setIsModalOpen(false);

    const newTempWarga: Warga = {
      id: "temp-" + Date.now().toString(),
      nama: formData.get("nama") as string,
      peran: formData.get("peran") as string,
      keterangan_peran: (formData.get("keterangan_peran") as string) || null,
      nomor_telepon: (formData.get("nomor_telepon") as string) || null,
      created_at: new Date().toISOString(),
    };

    // Optimistically insert temporary row
    setDataWarga((current) => [newTempWarga, ...current]);

    try {
      const response = await tambahWarga(formData);
      if (response && response.success && response.data) {
        // Replace temp row with actual saved database row jika belum di-replace oleh realtime
        setDataWarga((current) => {
          const alreadyHasReal = current.some((w) => w.id === (response.data as Warga).id);
          if (alreadyHasReal) {
            return current.filter((w) => w.id !== newTempWarga.id);
          }
          return current.map((w) => (w.id === newTempWarga.id ? (response.data as Warga) : w));
        });
        formRef.current?.reset();
      } else {
        // Fallback cleanup if success wasn't fully verified
        setDataWarga((current) => current.filter((w) => w.id !== newTempWarga.id));
      }
    } catch {
      // Remove temp row on failure
      setDataWarga((current) => current.filter((w) => w.id !== newTempWarga.id));
      showToast("Gagal menambahkan data warga.", "error");
    }
  };

  const handleHapusSatu = async (id: string) => {
    if (confirm("Hapus data warga ini?")) {
      // Simpan snapshot untuk rollback
      const snapshot = dataWarga.find((w) => w.id === id);
      // Optimistic remove
      setDataWarga((current) => current.filter((w) => w.id !== id));
      try {
        await hapusWarga(id);
      } catch {
        // Rollback jika gagal
        if (snapshot) {
          setDataWarga((current) => [snapshot, ...current]);
        }
        showToast("Gagal menghapus data warga.", "error");
      }
    }
  };

  const handleKonfirmasiHapusSemua = async () => {
    const snapshot = [...dataWarga];
    const count = snapshot.length;
    setDataWarga([]);

    try {
      await hapusSemuaWarga();
      showToast(`${count} data warga berhasil dihapus.`, "success");
    } catch {
      // Rollback on failure
      setDataWarga(snapshot);
      showToast("Gagal menghapus data warga. Data dikembalikan.", "error");
      throw new Error("Gagal menghapus semua data warga.");
    }
  };

  const filteredData = dataWarga.filter((warga) => {
    const query = searchQuery.toLowerCase();
    return (
      (warga.nama ?? "").toLowerCase().includes(query) ||
      (warga.peran ?? "").toLowerCase().includes(query) ||
      (warga.keterangan_peran ?? "").toLowerCase().includes(query) ||
      (warga.nomor_telepon ?? "").toLowerCase().includes(query) ||
      (warga.id ?? "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8 relative min-h-screen">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0d7565] flex items-center gap-2.5">
          <Users className="h-6 w-6 text-[#0d7565]" />
          <span>Data Warga</span>
        </h1>

        <span className="text-xs font-semibold text-[#57706a] bg-[#eef7f4] px-3 py-1.5 rounded-full border border-[#d6e5df]">
          {filteredData.length} warga terdaftar
        </span>
      </div>

      <div className="mb-24">
        <Table headers={["NIS / ID", "Nama", "Peran", "Keterangan Peran", "No. Telepon", "Aksi"]}>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                {searchQuery
                  ? `Tidak ada warga dengan kata kunci "${searchQuery}"`
                  : "Belum ada data warga."}
              </td>
            </tr>
          ) : (
            filteredData.map((item) => (
              <WargaRow
                key={item.id + "-" + (item.nama ?? "")}
                item={item}
                onHapus={handleHapusSatu}
                onRincianProfil={handleRincianProfil}
                onRincianAksi={handleRincianAksi}
              />
            ))
          )}
        </Table>
      </div>

      {/* ─── Expandable FAB ──────────────────────────────────────── */}
      <div ref={fabRef} className="fixed bottom-8 right-8 z-[1000] flex flex-col-reverse items-end gap-3">
        {/* Main Toggle Button */}
        <button
          type="button"
          onClick={() => setIsFabOpen((prev) => !prev)}
          aria-expanded={isFabOpen}
          aria-label={isFabOpen ? "Tutup menu aksi" : "Buka menu aksi"}
          className={`flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-all duration-300 cursor-pointer border-none outline-none ${
            isFabOpen
              ? "bg-gray-700 hover:bg-gray-800 rotate-0"
              : "bg-[#0d7565] hover:bg-[#0a5d50]"
          }`}
        >
          <div className="relative w-6 h-6">
            <Plus
              className={`h-6 w-6 text-white absolute inset-0 transition-all duration-300 ${
                isFabOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
              }`}
            />
            <X
              className={`h-6 w-6 text-white absolute inset-0 transition-all duration-300 ${
                isFabOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
              }`}
            />
          </div>
        </button>

        {/* Action: Tambah Data Warga */}
        <div
          className={`flex items-center gap-2.5 transition-all duration-200 ${
            isFabOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-3 pointer-events-none"
          }`}
        >
          <span className="hidden sm:block bg-gray-900/85 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap backdrop-blur-sm">
            Tambah Data Warga
          </span>
          <button
            type="button"
            onClick={() => {
              setIsFabOpen(false);
              setIsModalOpen(true);
            }}
            title="Tambah Data Warga"
            className="flex items-center justify-center w-12 h-12 bg-[#0d7565] text-white rounded-full shadow-lg hover:bg-[#0a5d50] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border-none outline-none"
          >
            <UserRoundPlus className="h-5 w-5" />
          </button>
        </div>

        {/* Action: Hapus Data Warga */}
        {dataWarga.length > 0 && (
          <div
            className={`flex items-center gap-2.5 transition-all duration-200 ${
              isFabOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-3 pointer-events-none"
            }`}
            style={{ transitionDelay: isFabOpen ? "50ms" : "0ms" }}
          >
            <span className="hidden sm:block bg-gray-900/85 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap backdrop-blur-sm">
              Hapus Data Warga ({dataWarga.length})
            </span>
            <button
              type="button"
              onClick={() => {
                setIsFabOpen(false);
                setIsConfirmDeleteAllOpen(true);
              }}
              title="Hapus Data Warga"
              className="flex items-center justify-center w-12 h-12 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border-none outline-none"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* ─── Backdrop saat FAB terbuka (mobile) ──────────────────── */}
      {isFabOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/20 backdrop-blur-[1px] sm:hidden"
          onClick={() => setIsFabOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* MODAL TAMBAH DATA WARGA */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Data Warga">
        <form ref={formRef} action={handleTambahSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Nama Lengkap *</label>
            <Input
              required
              name="nama"
              type="text"
              placeholder="Masukkan nama lengkap..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Peran *</label>
            <Select
              required
              name="peran"
              options={[
                { value: "Siswa", label: "Siswa" },
                { value: "Guru", label: "Guru" },
                { value: "Staf", label: "Staf" },
              ]}
              placeholder="Pilih peran..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Keterangan Peran</label>
            <Input
              name="keterangan_peran"
              placeholder="Contoh: XII-SIJA / Wali Kelas"
              type="text"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Nomor Telepon</label>
            <Input
              name="nomor_telepon"
              type="tel"
              placeholder="Contoh: 08123456789"
            />
          </div>
          <div className="mt-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              Simpan
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL RINCIAN PROFIL */}
      {profilWarga && (
        <WargaProfileModal
          profilWarga={profilWarga}
          isOpen={!!profilWarga}
          onClose={() => setProfilWarga(null)}
        />
      )}

      {/* MODAL RINCIAN AKSI */}
      {aksiWarga && (
        <WargaActivityModal
          aksiWarga={aksiWarga}
          isOpen={!!aksiWarga}
          activityHistory={activityHistory}
          isLoadingActivities={isLoadingActivities}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          onClose={() => setAksiWarga(null)}
        />
      )}

      {/* MODAL KONFIRMASI HAPUS SEMUA DATA WARGA */}
      <ConfirmAdminModal
        isOpen={isConfirmDeleteAllOpen}
        onClose={() => setIsConfirmDeleteAllOpen(false)}
        onConfirm={handleKonfirmasiHapusSemua}
        title="Hapus Seluruh Data Warga"
        targetName={`seluruh data warga (${dataWarga.length} data)`}
      />
    </div>
  );
}
