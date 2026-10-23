"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { isPetugasEmail } from "@/lib/petugas-access";
import PublicFooter from "../public/PublicFooter";
import { useChromeVisibility } from "./ChromeVisibility";

const publicPaths = new Set(["/", "/pencarian", "/tentang-kami", "/beri-saran"]);
const noFooterPaths = new Set(["/access-denied"]);

export default function RouteFooter() {
  const pathname = usePathname();
  const { isLoaded, isSignedIn, user } = useUser();
  const { isNotFound } = useChromeVisibility();
  const isPublicPage = publicPaths.has(pathname);

  if (
    isNotFound ||
    pathname === "/test" ||
    pathname.startsWith("/test/") ||
    noFooterPaths.has(pathname)
  ) {
    return null;
  }

  if (isPublicPage) {
    return <PublicFooter />;
  }

  const isPetugas = user?.emailAddresses.some((email) =>
    isPetugasEmail(email.emailAddress)
  );

  if (!isLoaded || !isSignedIn || !isPetugas) {
    return null;
  }

  // Footer petugas hanya ditampilkan pada halaman dashboard
  if (pathname !== "/dashboard") {
    return null;
  }

  return (
    <footer className="bg-[#0d3b2e] text-white/90 py-6 text-center text-xs border-t border-white/10">
      <div className="max-w-[1240px] mx-auto px-4">
        <p className="font-medium tracking-wide">© 2026 LACAK — Sistem Pengelolaan Barang Temuan</p>
        <p className="text-[11px] text-white/60 mt-1">Platform Terintegrasi Lost &amp; Found</p>
      </div>
    </footer>
  );
}