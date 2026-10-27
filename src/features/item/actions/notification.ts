"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requirePetugasAuth } from "@/lib/auth-guard";

// Tipe untuk notifikasi yang sudah diserialisasi (createdAt menjadi string)
export type SerializedNotification = {
  id: string;
  wargaId: string | null;
  lostReportId: string | null;
  foundItemId: string | null;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  isResolved: boolean;
  link: string | null;
  createdAt: string; // <-- string ISO
};

/**
 * Ambil notifikasi terbaru (urut dari yang paling baru)
 * Hasil dikonversi ke format serializable (createdAt -> string)
 */
export async function getNotifications(limit = 20): Promise<SerializedNotification[]> {
  try {
    await requirePetugasAuth();
    const safeLimit = Math.min(Math.max(1, Number(limit) || 20), 100);
    const notifications = await prisma.notification.findMany({
      where: { isResolved: false },
      orderBy: { createdAt: "desc" },
      take: safeLimit,
    });
    // Konversi Date ke string ISO
    return notifications.map((n) => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Gagal mengambil notifikasi:", error);
    return [];
  }
}

/**
 * Tandai semua notifikasi sebagai sudah dibaca
 */
export async function markAllAsRead() {
  try {
    await requirePetugasAuth();
    await prisma.notification.updateMany({
      data: { isRead: true },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Gagal menandai semua notifikasi:", error);
    return { success: false };
  }
}

/**
 * Hitung jumlah notifikasi yang belum dibaca
 */
export async function getUnreadCount() {
  try {
    await requirePetugasAuth();
    const count = await prisma.notification.count({
      where: { isRead: false, isResolved: false },
    });
    return count;
  } catch (error) {
    console.error("Gagal menghitung notifikasi belum dibaca:", error);
    return 0;
  }
}

/**
 * Tandai satu notifikasi sebagai sudah dibaca
 */
export async function markOneAsRead(notificationId: string) {
  if (!notificationId || typeof notificationId !== "string") {
    return { success: false, error: "ID Notifikasi tidak valid" };
  }

  try {
    await requirePetugasAuth();
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Gagal menandai notifikasi:", error);
    return { success: false };
  }
}

/**
 * Menyelesaikan/me-resolve semua notifikasi kecocokan (type: "match") untuk barang temuan tertentu.
 * Digunakan untuk menonaktifkan notifikasi setelah barang di-claim.
 */
export async function resolveMatchNotificationsByFoundItemId(foundItemId: string) {
  if (!foundItemId || typeof foundItemId !== "string") return { success: false };

  try {
    await requirePetugasAuth();
    const result = await prisma.notification.updateMany({
      where: {
        type: "match",
        foundItemId,
        isResolved: false,
      },
      data: {
        isResolved: true,
      },
    });

    if (result.count > 0) {
      console.log(`[resolveMatchNotificationsByFoundItemId] Resolved ${result.count} notification(s) for item ID ${foundItemId}.`);
    }

    revalidatePath("/");
    return { success: true, count: result.count };
  } catch (error) {
    console.error("Gagal me-resolve notifikasi kecocokan:", error);
    return { success: false, error };
  }
}

