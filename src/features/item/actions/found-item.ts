"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { generateBusinessCode } from "@/lib/utils/codeGenerator";
import { processNewFoundItemMatch } from "./matching";
import { checkAndExpireItems } from "./item-lifecycle";

/**
 * Preview kode unik barang (business code) sebelum benar-benar disimpan.
 * Dipanggil secara realtime di form Taruh Barang.
 */
export async function getBusinessCodePreview(params: {
  jenisId: string;
  warnaId: string;
  merekId: string;
  lokasiId: string;
}) {
  if (!params.jenisId || !params.warnaId || !params.merekId || !params.lokasiId) {
    return null;
  }

  try {
    return await generateBusinessCode(params);
  } catch (error) {
    console.error("Gagal generate preview kode:", error);
    return null;
  }
}

/**
 * Membuat FoundItem baru (Taruh Barang).
 * Setelah berhasil, otomatis menjalankan matching terhadap LostReport aktif
 * dan membuat notification jika ada kecocokan.
 *
 * checkAndExpireItems() is called here as this is a mutative write operation.
 */
export async function createFoundItem(formData: FormData) {
  const finderName = formData.get("finderName") as string;
  const finderIdCard = formData.get("finderIdCard") as string;
  const finderContact = formData.get("finderContact") as string;
  const wargaId = formData.get("wargaId") as string;
  const jenisId = formData.get("jenisId") as string;
  const warnaId = formData.get("warnaId") as string;
  const merekId = formData.get("merekId") as string;
  const lokasiId = formData.get("lokasiId") as string;
  const additionalDesc = formData.get("additionalDesc") as string;

  if (!finderName || !finderIdCard || !jenisId || !warnaId || !merekId || !lokasiId) {
    throw new Error("Semua kolom wajib harus diisi!");
  }

  // Run lazy expiration on mutative write
  await checkAndExpireItems();

  // Generate kode unik
  const businessCode = await generateBusinessCode({ jenisId, warnaId, merekId, lokasiId });

  const newItem = await prisma.foundItem.create({
    data: {
      businessCode,
      finderName,
      finderIdCard,
      finderContact: finderContact || "-",
      wargaId: wargaId || undefined,
      jenisId,
      warnaId,
      merekId,
      lokasiId,
      additionalDesc: additionalDesc || null,
      status: "FOUND",
    },
  });

  // Trigger matching otomatis → menghasilkan notifikasi, BUKAN claim
  try {
    await processNewFoundItemMatch(newItem.id);
  } catch (error) {
    // Matching gagal tidak boleh menggagalkan create
    console.error("[createFoundItem] Matching notification error (non-fatal):", error);
  }

  revalidatePath("/");
  revalidatePath("/riwayat/temuan");
  revalidatePath("/data-warga");
  redirect("/riwayat/temuan");
}

/**
 * Hapus satu FoundItem berdasarkan ID.
 */
export async function deleteFoundItem(id: string) {
  try {
    await prisma.foundItem.delete({ where: { id } });
    revalidatePath("/riwayat/temuan");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus barang temuan:", error);
    throw new Error("Gagal menghapus barang temuan.");
  }
}

/**
 * Hapus semua FoundItem yang belum diklaim (status FOUND atau EXPIRED).
 */
export async function deleteAllUnclaimedFoundItems() {
  try {
    await prisma.foundItem.deleteMany({
      where: { status: { in: ["FOUND", "EXPIRED"] } },
    });
    revalidatePath("/riwayat/temuan");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus semua barang temuan:", error);
    throw new Error("Gagal menghapus semua barang temuan.");
  }
}

/**
 * Hapus seluruh riwayat barang temuan (termasuk referensi claim & notifikasi terkait).
 */
export async function deleteAllFoundItems() {
  try {
    await prisma.$transaction([
      prisma.notification.deleteMany({
        where: { foundItemId: { not: null } },
      }),
      prisma.claimTransaction.deleteMany(),
      prisma.foundItem.deleteMany(),
    ]);
    revalidatePath("/riwayat/temuan");
    revalidatePath("/riwayat/pengambilan");
    revalidatePath("/data-warga");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus seluruh barang temuan:", error);
    throw new Error("Gagal menghapus seluruh barang temuan.");
  }
}

/**
 * Mengambil satu data barang temuan beserta relasi lengkap (untuk realtime sync)
 */
export async function getFoundItemById(id: string) {
  if (!id) return null;
  try {
    return await prisma.foundItem.findUnique({
      where: { id },
      include: {
        jenis: true,
        warna: true,
        merek: true,
        lokasi: true,
      },
    });
  } catch (error) {
    console.error("Gagal mengambil data barang temuan:", error);
    return null;
  }
}

