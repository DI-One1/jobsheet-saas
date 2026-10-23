"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkAndExpireItems } from "./item-lifecycle";
import { processNewLostReportMatch } from "./matching";
import { resolveMatchNotificationsByFoundItemId } from "./notification";

/**
 * Membuat LostReport — mendukung DUA jalur:
 *
 * JALUR 1 (Normal):
 *   Hanya buat LostReport → status DICARI.
 *   Sistem menunggu matching di kemudian hari.
 *
 * JALUR 2 (Lapor + Claim Sekaligus):
 *   Jika user memilih FoundItem yang cocok saat melapor:
 *   1. Buat LostReport → status SELESAI
 *   2. FoundItem → CLAIMED
 *   3. Buat ClaimTransaction
 *   Semua dalam satu atomic transaction.
 *
 * checkAndExpireItems() is called here as this is a mutative write operation.
 */
export async function createLostReport(formData: FormData) {
  const reporterName = formData.get("reporterName") as string;
  const reporterIdCard = formData.get("reporterIdCard") as string;
  const reporterContact = formData.get("reporterContact") as string;
  const wargaId = formData.get("wargaId") as string;
  const jenisId = formData.get("jenisId") as string;
  const warnaId = formData.get("warnaId") as string;
  const merekId = formData.get("merekId") as string;
  const lokasiId = formData.get("lokasiId") as string;
  const additionalDesc = formData.get("additionalDesc") as string;
  const claimFoundItemId = formData.get("claimFoundItemId") as string;

  if (!reporterName || !reporterIdCard || !jenisId || !warnaId || !merekId || !lokasiId) {
    throw new Error("Semua kolom wajib harus diisi!");
  }

  // Run lazy expiration on mutative write
  await checkAndExpireItems();

  // JALUR 2: Lapor + Claim sekaligus (atomic transaction)
  if (claimFoundItemId) {
    // Verifikasi FoundItem masih valid
    const foundItem = await prisma.foundItem.findUnique({
      where: { id: claimFoundItemId },
    });

    if (!foundItem) {
      throw new Error("Barang temuan yang dipilih tidak ditemukan di database!");
    }

    if (foundItem.status === "CLAIMED") {
      throw new Error("Barang temuan ini sudah diklaim oleh orang lain!");
    }

    if (foundItem.status === "EXPIRED") {
      throw new Error("Masa klaim barang temuan ini sudah berakhir (Expired)!");
    }

    // Atomic transaction: LostReport SELESAI + FoundItem CLAIMED + ClaimTransaction
    await prisma.$transaction(async (tx) => {
      const lostReport = await tx.lostReport.create({
        data: {
          reporterName,
          reporterIdCard,
          reporterContact: reporterContact || "-",
          wargaId: wargaId || undefined,
          jenisId,
          warnaId,
          merekId,
          lokasiId,
          additionalDesc: additionalDesc || null,
          status: "SELESAI",
        },
      });

      await tx.foundItem.update({
        where: { id: claimFoundItemId },
        data: { status: "CLAIMED" },
      });

      await tx.claimTransaction.create({
        data: {
          foundItemId: claimFoundItemId,
          claimantName: reporterName,
          claimantIdCard: reporterIdCard,
          claimantContact: reporterContact || "-",
          wargaId: wargaId || undefined,
          lostReportId: lostReport.id,
        },
      });
    });

    // Bersihkan notifikasi match terkait barang yang baru di-claim
    try {
      await resolveMatchNotificationsByFoundItemId(foundItem.id);
    } catch (error) {
      console.error("Gagal membersihkan notifikasi klaim:", error);
    }

    revalidatePath("/");
    revalidatePath("/riwayat/laporan");
    revalidatePath("/riwayat/temuan");
    revalidatePath("/riwayat/pengambilan");
    revalidatePath("/data-warga");
    redirect("/riwayat/pengambilan");
  }

  // JALUR 1: Laporan normal — hanya buat LostReport dengan status DICARI
  const newReport = await prisma.lostReport.create({
    data: {
      reporterName,
      reporterIdCard,
      reporterContact: reporterContact || "-",
      wargaId: wargaId || undefined,
      jenisId,
      warnaId,
      merekId,
      lokasiId,
      additionalDesc: additionalDesc || null,
      status: "DICARI",
    },
  });

  // Trigger matching otomatis
  try {
    await processNewLostReportMatch(newReport.id);
  } catch (error) {
    // Matching gagal tidak boleh menggagalkan create
    console.error("[createLostReport] Matching notification error (non-fatal):", error);
  }

  revalidatePath("/");
  revalidatePath("/riwayat/laporan");
  revalidatePath("/data-warga");
  redirect("/riwayat/laporan");
}

/**
 * Hapus satu LostReport berdasarkan ID.
 */
export async function deleteLostReport(id: string) {
  try {
    await prisma.lostReport.delete({ where: { id } });
    revalidatePath("/riwayat/laporan");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus laporan:", error);
    throw new Error("Gagal menghapus laporan kehilangan.");
  }
}

export async function deleteAllLostReports() {
  try {
    await prisma.$transaction([
      prisma.notification.deleteMany({
        where: { lostReportId: { not: null } },
      }),
      prisma.claimTransaction.updateMany({
        data: { lostReportId: null },
      }),
      prisma.lostReport.deleteMany(),
    ]);
    revalidatePath("/riwayat/laporan");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus semua laporan:", error);
    throw new Error("Gagal menghapus semua laporan kehilangan.");
  }
}

/**
 * Mengambil satu data laporan kehilangan beserta relasi lengkap (untuk realtime sync)
 */
export async function getLostReportById(id: string) {
  if (!id) return null;
  try {
    return await prisma.lostReport.findUnique({
      where: { id },
      include: {
        jenis: true,
        lokasi: true,
      },
    });
  } catch (error) {
    console.error("Gagal mengambil data laporan kehilangan:", error);
    return null;
  }
}

