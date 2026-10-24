"use server";

import { getPublicData } from "@/features/item/services/public-item-service";
import type { PublicFoundItem } from "@/features/item/utils/public-item-utils";

/**
 * Dipanggil oleh PublicPortal (client) setelah Supabase Realtime
 * mendeteksi perubahan pada tabel FoundItem.
 * Mengembalikan daftar item terbaru dengan status FOUND.
 */
export async function fetchPublicItemsAction(): Promise<PublicFoundItem[]> {
  const { items } = await getPublicData();
  return items;
}
