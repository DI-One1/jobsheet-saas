import { auth, clerkClient } from "@clerk/nextjs/server";
import { isPetugasEmail } from "./petugas-access";

export class AuthError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.name = "AuthError";
    this.statusCode = statusCode;
  }
}

/**
 * Memastikan user sedang login dan memiliki hak akses petugas yang sah.
 * Wajib dipanggil pada setiap Server Action mutatif untuk mencegah bypass autorisasi.
 */
export async function requirePetugasAuth() {
  const { userId } = await auth();

  if (!userId) {
    throw new AuthError(
      "Unauthorized: Anda harus masuk (login) terlebih dahulu untuk melakukan aksi ini.",
      401
    );
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  if (!user) {
    throw new AuthError(
      "Unauthorized: Sesi pengguna tidak valid atau akun tidak ditemukan.",
      401
    );
  }

  const emails = user.emailAddresses.map((email) =>
    email.emailAddress.trim().toLowerCase()
  );

  const isAllowed = emails.some(isPetugasEmail);

  if (!isAllowed) {
    throw new AuthError(
      "Forbidden: Akun Anda tidak memiliki hak akses sebagai petugas LACAK.",
      403
    );
  }

  return { userId, user };
}
