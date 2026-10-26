"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { isPetugasEmail } from "./petugas-access";

export async function syncUserToDatabase(): Promise<void> {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return;
  }

  const primaryEmailAddress =
    clerkUser.emailAddresses.find(
      (email) => email.id === clerkUser.primaryEmailAddressId
    ) ?? clerkUser.emailAddresses[0];
  const primaryEmail = primaryEmailAddress?.emailAddress
    ?.trim()
    .toLowerCase();

  if (!primaryEmail) {
    throw new Error("User Clerk tidak memiliki alamat email.");
  }

  const fullName =
    `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
    "User Tanpa Nama";

  const userRole = clerkUser.emailAddresses.some((email) =>
    isPetugasEmail(email.emailAddress)
  )
    ? "PETUGAS"
    : "USER";

  try {
    await prisma.user.upsert({
      where: {
        clerkId: clerkUser.id,
      },

      update: {
        name: fullName,
        email: primaryEmail,
        imageUrl: clerkUser.imageUrl,
        role: userRole,
      },

      create: {
        clerkId: clerkUser.id,
        name: fullName,
        email: primaryEmail,
        imageUrl: clerkUser.imageUrl,
        role: userRole,
      },
    });
  } catch (error: unknown) {
    // Jika gagal karena unique constraint pada email (misal: email sudah dipakai
    // user lain, atau race condition saat create), fallback ke update by email.
    const isUniqueConstraintError =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002";

    if (isUniqueConstraintError) {
      await prisma.user.update({
        where: { email: primaryEmail },
        data: {
          clerkId: clerkUser.id,
          name: fullName,
          imageUrl: clerkUser.imageUrl,
          role: userRole,
        },
      });
    } else {
      throw error;
    }
  }
}