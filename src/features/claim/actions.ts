"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkAndExpireItems } from "@/features/item/actions/item-lifecycle";
import { resolveMatchNotificationsByFoundItemId } from "@/features/item/actions/notification";

// 1. Fungsi untuk mengecek keberadaan & status barang ke Database
export async function verifyItemExists(businessCode: string) {
  if (!businessCode) return null;

  const foundItem = await prisma.foundItem.findUnique({
    where: { businessCode },
    include: { jenis: true, warna: true, merek: true, lokasi: true },
  });

  // Jika barang tidak ditemukan atau sudah pernah diklaim atau expired, anggap tidak valid
  if (!foundItem || foundItem.status === "CLAIMED" || foundItem.status === "EXPIRED") {
    return null;
  }

  return foundItem;
}

// 2. Fungsi Eksekusi Klaim / Pengambilan Barang
export async function processClaimItem(formData: FormData) {
  const businessCode = formData.get("businessCode") as string;
  const claimantName = formData.get("claimantName") as string;
  const claimantIdCard = formData.get("claimantIdCard") as string; // NIS / NIP / ID
  const claimantContact = formData.get("claimantContact") as string;
  const wargaId = formData.get("wargaId") as string;
  const lostReportId = formData.get("lostReportId") as string;

  if (!businessCode || !claimantName || !claimantIdCard || !claimantContact) {
    throw new Error("Semua kolom data pengambil dan kode barang wajib diisi!");
  }

  // Run lazy expiration on write
  await checkAndExpireItems();

  // 1. Cari data barang temuan berdasarkan businessCode
  const foundItem = await prisma.foundItem.findUnique({
    where: { businessCode },
  });

  if (!foundItem) {
    throw new Error("Barang dengan kode unik tersebut tidak ditemukan!");
  }

  if (foundItem.status === "CLAIMED") {
    throw new Error("Barang ini sudah pernah diklaim atau diambil sebelumnya!");
  }

  if (foundItem.status === "EXPIRED") {
    throw new Error("Masa klaim biasa barang ini sudah berakhir (Expired)!");
  }

  // 2. Lakukan transaksi: Ubah status barang, update lost report jika ada, dan buat catatan klaim
  await prisma.$transaction([
    prisma.foundItem.update({
      where: { id: foundItem.id },
      data: { status: "CLAIMED" },
    }),
    ...(lostReportId
      ? [
          prisma.lostReport.update({
            where: { id: lostReportId },
            data: { status: "SELESAI" },
          }),
        ]
      : []),
    prisma.claimTransaction.create({
      data: {
        foundItemId: foundItem.id,
        claimantName,
        claimantIdCard,
        claimantContact,
        wargaId: wargaId || undefined,
        lostReportId: lostReportId || undefined,
      },
    }),
  ]);

  // Bersihkan notifikasi match terkait barang yang baru di-claim
  try {
    await resolveMatchNotificationsByFoundItemId(foundItem.id);
  } catch (error) {
    console.error("Gagal membersihkan notifikasi klaim:", error);
  }

  revalidatePath("/");
  revalidatePath("/riwayat/pengambilan");
  revalidatePath("/riwayat/laporan");
  revalidatePath("/riwayat/temuan");
  revalidatePath("/data-warga");
  redirect("/riwayat/pengambilan");
}

/**
 * Mengambil daftar laporan kehilangan aktif (DICARI) dari warga tertentu
 */
export async function getActiveLostReportsOfWarga(wargaId: string) {
  if (!wargaId) return [];
  
  return await prisma.lostReport.findMany({
    where: {
      wargaId,
      status: "DICARI",
    },
    include: {
      jenis: true,
      warna: true,
      merek: true,
      lokasi: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Mencari barang temuan aktif (FOUND) yang cocok dengan detail laporan
 */
export async function getMatchingFoundItemsForReport(reportId: string) {
  if (!reportId) return [];

  const report = await prisma.lostReport.findUnique({
    where: { id: reportId },
  });

  if (!report) return [];

  const foundItems = await prisma.foundItem.findMany({
    where: {
      status: "FOUND",
      jenisId: report.jenisId,
      warnaId: report.warnaId,
      merekId: report.merekId,
    },
    include: {
      jenis: true,
      warna: true,
      merek: true,
      lokasi: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return foundItems
    .map((item) => ({
      ...item,
      matchScore: item.lokasiId === report.lokasiId ? 100 : 75,
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Hapus seluruh data transaksi pengambilan (serah terima).
 * Status barang temuan terkait yang sebelumnya CLAIMED akan dikembalikan ke FOUND.
 */
export async function deleteAllClaimTransactions() {
  try {
    await prisma.$transaction([
      prisma.foundItem.updateMany({
        where: { status: "CLAIMED" },
        data: { status: "FOUND" },
      }),
      prisma.claimTransaction.deleteMany(),
    ]);
    revalidatePath("/riwayat/pengambilan");
    revalidatePath("/riwayat/temuan");
    revalidatePath("/data-warga");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus seluruh transaksi pengambilan:", error);
    throw new Error("Gagal menghapus seluruh transaksi pengambilan.");
  }
}

/**
 * Mengambil satu data transaksi pengambilan beserta relasi lengkap (untuk realtime sync)
 */
export async function getClaimTransactionById(id: string) {
  if (!id) return null;
  try {
    return await prisma.claimTransaction.findUnique({
      where: { id },
      include: {
        foundItem: {
          include: { jenis: true, warna: true, merek: true, lokasi: true },
        },
      },
    });
  } catch (error) {
    console.error("Gagal mengambil data transaksi pengambilan:", error);
    return null;
  }
}

