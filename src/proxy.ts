import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const ALLOWED_EMAIL = "mochcomeback@gmail.com";

const isPublicRoute = createRouteMatcher([
  "/",
  "/pencarian(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/access-denied(.*)",
  "/tentang-kami(.*)",
  "/beri-saran(.*)",
  "/api/public(.*)",
  "/api/v1/public(.*)",
]);

const handler = clerkMiddleware(async (auth, request) => {
  // ==========================================
  // PUBLIC ROUTES
  // ==========================================
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // ==========================================
  // CEK LOGIN
  // ==========================================
  const { userId } = await auth();

  // Belum login → arahkan ke halaman sign-in
  if (!userId) {
    const signInUrl = new URL("/sign-in", request.url);

    // Setelah login, kembalikan user ke halaman
    // yang sebelumnya ingin dia akses.
    signInUrl.searchParams.set(
      "redirect_url",
      request.nextUrl.pathname + request.nextUrl.search
    );

    return NextResponse.redirect(signInUrl);
  }

  // ==========================================
  // AMBIL USER DARI CLERK
  // ==========================================
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  if (!user) {
    return NextResponse.redirect(
      new URL(
        "/access-denied?reason=unauthorized",
        request.url
      )
    );
  }

  // ==========================================
  // AMBIL EMAIL USER
  // ==========================================
  const emails = user.emailAddresses.map((email) =>
    email.emailAddress.trim().toLowerCase()
  );

  // ==========================================
  // CEK EMAIL YANG DIIZINKAN
  // ==========================================
  const isAllowed = emails.includes(
    ALLOWED_EMAIL.toLowerCase()
  );

  console.log("[LACAK AUTH]", {
    userId,
    emails,
    allowedEmail: ALLOWED_EMAIL,
    isAllowed,
    path: request.nextUrl.pathname,
  });

  // ==========================================
  // EMAIL TIDAK DIIZINKAN
  // ==========================================
  if (!isAllowed) {
    return NextResponse.redirect(
      new URL(
        "/access-denied?reason=not-allowed",
        request.url
      )
    );
  }

  // ==========================================
  // EMAIL DIIZINKAN
  // ==========================================
  return NextResponse.next();
});

export const proxy = handler;
export default handler;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
