export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Suspense } from "react";
import PengambilanClient from "./PengambilanClient"; // Import Client Component baru

export default async function RiwayatPengambilanPage() {
  const claims = await prisma.claimTransaction.findMany({
    include: {
      foundItem: {
        include: { jenis: true, warna: true, merek: true, lokasi: true },
      },
    },
    orderBy: { claimedAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 max-w-5xl flex-grow">
      <div className="mb-8">
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-[#3dbd84] flex items-center gap-2 w-fit mb-2 transition-colors">
          <span>&larr;</span> Kembali ke Beranda
        </Link>
        <h1 className="text-3xl font-extrabold text-[#0d3b2e]">Riwayat Pengambilan Barang</h1>
      </div>

      {/* Oper data ke Client Component */}
      <Suspense fallback={<div className="text-center py-10 text-gray-500">Memuat riwayat pengambilan...</div>}>
        <PengambilanClient claims={claims} />
      </Suspense>
    </div>
  );
}