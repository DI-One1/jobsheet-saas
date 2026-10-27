"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateNextNIS } from "@/lib/utils/nisGenerator";
import { requirePetugasAuth } from "@/lib/auth-guard";
import { WargaActivityItem } from "./types";

/**
 * Fungsi Action untuk menyimpan data warga baru dari form client.
 * Mengembalikan objek warga yang berhasil dibuat untuk sinkronisasi optimistic UI.
 */
export async function tambahWarga(formData: FormData) {
  await requirePetugasAuth();

  try {
    const newId = await generateNextNIS();

    const nama = formData.get("nama") as string;
    const peran = formData.get("peran") as string;
    const keterangan_peran = formData.get("keterangan_peran") as string;
    const nomor_telepon = formData.get("nomor_telepon") as string;

    const newWarga = await prisma.warga.create({
      data: {
        id: newId,
        nama,
        peran,
        keteranganPeran: keterangan_peran || null,
        nomorTelepon: nomor_telepon || null,
      },
    });

    // CATATAN: Tidak pakai revalidatePath di sini.
    // INSERT akan dibroadcast oleh Supabase Realtime ke semua client.
    // revalidatePath hanya diperlukan untuk operasi yang tidak di-broadcast
    // (hapus), karena client lain perlu tahu data terbaru saat re-visit.

    return {
      success: true,
      data: {
        id: newWarga.id,
        nama: newWarga.nama,
        peran: newWarga.peran,
        keterangan_peran: newWarga.keteranganPeran,
        nomor_telepon: newWarga.nomorTelepon,
        created_at: newWarga.createdAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Gagal menambah warga:", error);
    throw new Error("Gagal menyimpan data warga.");
  }
}

/**
 * Fungsi Action untuk menghapus satu warga berdasarkan ID (NIS).
 */
export async function hapusWarga(id: string) {
  await requirePetugasAuth();

  try {
    await prisma.warga.delete({
      where: { id },
    });
    revalidatePath("/data-warga");
    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus warga:", error);
    throw new Error("Gagal menghapus data warga.");
  }
}

/**
 * Fungsi Action untuk menghapus seluruh data warga.
 */
export async function hapusSemuaWarga() {
  await requirePetugasAuth();

  try {
    await prisma.$transaction([
      prisma.notification.updateMany({
        where: { wargaId: { not: null } },
        data: { wargaId: null },
      }),
      prisma.lostReport.updateMany({
        data: { wargaId: null },
      }),
      prisma.foundItem.updateMany({
        data: { wargaId: null },
      }),
      prisma.claimTransaction.updateMany({
        data: { wargaId: null },
      }),
      prisma.warga.deleteMany(),
    ]);
    revalidatePath("/data-warga");
    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus semua warga:", error);
    throw new Error("Gagal menghapus semua data warga.");
  }
}

/**
 * Fungsi Action untuk menarik seluruh data warga (untuk dropdown di halaman client).
 */
export async function getSemuaWarga() {
  try {
    const rows = await prisma.warga.findMany({
      orderBy: { createdAt: "desc" },
    });

    return rows.map((w) => ({
      id: w.id,
      nama: w.nama,
      peran: w.peran,
      keterangan_peran: w.keteranganPeran,
      nomor_telepon: w.nomorTelepon,
      created_at: w.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Gagal menarik data warga:", error);
    return [];
  }
}

/**
 * Mengambil Riwayat Aksi Warga secara logical dari lostReports, foundItems, dan claimTransactions
 * tanpa membuat tabel duplikat.
 */
export async function getWargaActivityHistory(wargaId: string): Promise<WargaActivityItem[]> {
  if (!wargaId) return [];

  try {
    const [lostReports, foundItems, claimTransactions] = await Promise.all([
      prisma.lostReport.findMany({
        where: { wargaId },
        include: {
          jenis: true,
          warna: true,
          merek: true,
          lokasi: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.foundItem.findMany({
        where: { wargaId },
        include: {
          jenis: true,
          warna: true,
          merek: true,
          lokasi: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.claimTransaction.findMany({
        where: { wargaId },
        include: {
          foundItem: {
            include: {
              jenis: true,
              warna: true,
              merek: true,
              lokasi: true,
            },
          },
          lostReport: {
            include: {
              jenis: true,
              merek: true,
            },
          },
        },
        orderBy: { claimedAt: "desc" },
      }),
    ]);

    const reportActivities: WargaActivityItem[] = lostReports.map((report) => ({
      id: `report-${report.id}`,
      type: "LAPORAN",
      title: `${report.jenis?.name || "Barang"} ${report.merek?.name || ""}`.trim(),
      category: `Warna: ${report.warna?.name || "-"} | Merek: ${report.merek?.name || "-"}`,
      lokasi: report.lokasi?.name || "-",
      status: report.status,
      date: report.createdAt.toISOString(),
      description: report.additionalDesc,
    }));

    const foundActivities: WargaActivityItem[] = foundItems.map((item) => ({
      id: `found-${item.id}`,
      type: "TARUH",
      title: `${item.jenis?.name || "Barang"} ${item.merek?.name || ""}`.trim(),
      category: `Warna: ${item.warna?.name || "-"} | Merek: ${item.merek?.name || "-"}`,
      businessCode: item.businessCode,
      lokasi: item.lokasi?.name || "-",
      status: item.status,
      date: item.createdAt.toISOString(),
      description: item.additionalDesc,
    }));

    const claimActivities: WargaActivityItem[] = claimTransactions.map((claim) => ({
      id: `claim-${claim.id}`,
      type: "PENGAMBILAN",
      title: `${claim.foundItem?.jenis?.name || "Barang"} ${claim.foundItem?.merek?.name || ""}`.trim(),
      category: `Warna: ${claim.foundItem?.warna?.name || "-"} | Merek: ${claim.foundItem?.merek?.name || "-"}`,
      businessCode: claim.foundItem?.businessCode,
      lokasi: claim.foundItem?.lokasi?.name || "-",
      status: "SELESAI",
      date: claim.claimedAt.toISOString(),
      description: claim.lostReport
        ? `Menyelesaikan laporan kehilangan: ${claim.lostReport.jenis?.name || ""} ${claim.lostReport.merek?.name || ""}`
        : "Pengambilan langsung barang temuan",
    }));

    const allActivities = [...reportActivities, ...foundActivities, ...claimActivities];
    return allActivities.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Gagal mengambil riwayat aksi warga:", error);
    return [];
  }
}
