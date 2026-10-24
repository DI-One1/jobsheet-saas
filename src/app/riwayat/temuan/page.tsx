export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Suspense } from "react";
import TemuanClient from "./TemuanClient";

export default async function RiwayatTemuanPage() {
  const foundItems = await prisma.foundItem.findMany({
    include: {
      jenis: true,
      warna: true,
      merek: true,
      lokasi: true,
      warga: true,
      claim: {
        include: {
          warga: true,
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
        <h1 className="text-3xl font-extrabold text-[#0d3b2e]">Riwayat Barang Temuan</h1>
      </div>

      {/* Render Client Component untuk Interaksi & Tabel */}
      <Suspense fallback={<div className="text-center py-10 text-gray-500">Memuat riwayat barang temuan...</div>}>
        <TemuanClient foundItems={foundItems} />
      </Suspense>
    </div>
  );
}