// src/app/test/isr-actions.ts
"use server";

import { updateTag, revalidatePath } from "next/cache";

/**
 * Server Action untuk On-Demand Revalidation.
 * Ketika dipanggil, Next.js akan menghapus/memperbarui cache tag 'isr-stats'
 * dan meregenerasi halaman /test di server.
 */
export async function revalidateIsrDemo() {
  try {
    updateTag("isr-stats");
  } catch {
    // fallback jika tag cache tidak terdaftar
  }
  revalidatePath("/test");
}
