import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

// 📧 Satu-satunya akun utama Lacak
const ADMIN_EMAIL = "mochcomeback@gmail.com";

export async function syncUserToDatabase() {
  try {
    // Ambil user yang sedang login dari Clerk
    const clerkUser = await currentUser();

    // Tidak ada user yang sedang login
    if (!clerkUser) {
      return null;
    }

    // Ambil email utama dari akun Clerk
    const primaryEmail =
      clerkUser.emailAddresses[0]?.emailAddress?.toLowerCase();

    // Kalau user tidak memiliki email, jangan lanjut
    if (!primaryEmail) {
      console.error("User Clerk tidak memiliki alamat email.");
      return null;
    }

    // Nama lengkap user
    const fullName =
      `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
      "User Tanpa Nama";

    // Tentukan role berdasarkan email
    //
    // Hanya akun:
    // lacak.smktibazma@gmail.com
    //
    // yang mendapatkan role PETUGAS.
    const userRole =
      primaryEmail === ADMIN_EMAIL.toLowerCase() ? "PETUGAS" : "USER";

    // Sinkronisasi user Clerk ke database
    const user = await prisma.user.upsert({
      where: {
        clerkId: clerkUser.id,
      },

      // Kalau user sudah ada
      update: {
        name: fullName,
        email: primaryEmail,
        imageUrl: clerkUser.imageUrl,
        role: userRole,
      },

      // Kalau user belum ada
      create: {
        clerkId: clerkUser.id,
        name: fullName,
        email: primaryEmail,
        imageUrl: clerkUser.imageUrl,
        role: userRole,
      },
    });

    return user;
  } catch (error: any) {
    // Abaikan log error saat Next.js melakukan analisis static page / pre-render saat build
    if (
      error?.digest === "DYNAMIC_SERVER_USAGE" ||
      error?.message?.includes("Dynamic server usage")
    ) {
      return null;
    }

    console.error("Gagal melakukan sinkronisasi user:", error);

    return null;
  }
}