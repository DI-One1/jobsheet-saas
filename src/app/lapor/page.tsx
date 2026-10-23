export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import LaporForm from "./LaporForm";

export default async function LaporKehilanganPage() {
  const categories = await prisma.categoryItem.findMany();
  const colors = await prisma.colorItem.findMany();
  const brands = await prisma.brandItem.findMany();
  const locations = await prisma.locationItem.findMany();

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 max-w-4xl flex-grow">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-[#3dbd84] flex items-center gap-2 w-fit mb-4 transition-colors"
        >
          <span>&larr;</span> Kembali ke Beranda
        </Link>

        <h1 className="text-3xl font-extrabold text-[#0d3b2e]">
          Lapor Kehilangan
        </h1>
      </div>

      <LaporForm
        jenisList={categories}
        warnaList={colors}
        merekList={brands}
        lokasiList={locations}
      />
    </div>
  );
}