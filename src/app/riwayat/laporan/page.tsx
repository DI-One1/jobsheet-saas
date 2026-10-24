export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Suspense } from "react";
import LaporanClient from "./LaporanClient";

export default async function RiwayatLaporanPage() {
  // Mengambil data laporan kehilangan dari database beserta relasinya
  const riwayatList = await prisma.lostReport.findMany({
    include: {
      jenis: true,
      warna: true,
      merek: true,
      lokasi: true,
      warga: true,
      claimTransactions: {
        include: {
          foundItem: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 max-w-5xl flex-grow">
      
      {/* Header & Navigasi */}
      <div className="mb-8">
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-[#3dbd84] flex items-center gap-2 w-fit mb-2 transition-colors">
          <span>&larr;</span> Kembali ke Beranda
        </Link>
        <h1 className="text-3xl font-extrabold text-[#0d3b2e]">Riwayat Laporan Kehilangan</h1>
      </div>

      {/* Render Client Component */}
      <Suspense fallback={<div className="text-center py-10 text-gray-500">Memuat riwayat laporan...</div>}>
        <LaporanClient riwayatList={riwayatList} />
      </Suspense>

    </div>
  );
}