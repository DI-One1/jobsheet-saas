export const dynamic = "force-dynamic";

import Link from "next/link";
import { getSemuaWarga } from "@/features/warga/actions";
import { Warga } from "@/features/warga/types";
import AmbilBarangClient from "@/features/claim/components/AmbilBarangClient";

export default async function AmbilBarangPage() {
  let initialDataWarga: Warga[] = [];

  try {
    const data = await getSemuaWarga();

    if (data && data.length > 0) {
      initialDataWarga = data;
    }
  } catch (error) {
    console.error("Gagal memuat DB Warga", error);
  }

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
          Pengambilan Barang
        </h1>
      </div>

      <AmbilBarangClient initialDataWarga={initialDataWarga} />
    </div>
  );
}