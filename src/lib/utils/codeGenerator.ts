import { prisma } from "@/lib/prisma";

export async function generateBusinessCode(params: {
  jenisId: string;
  warnaId: string;
  merekId: string;
  lokasiId: string;
}): Promise<string> {
  const { jenisId, warnaId, merekId, lokasiId } = params;

  // 1. Ambil data master dari database secara concurrent (1 round-trip)
  const [jenis, warna, merek, lokasi] = await Promise.all([
    prisma.categoryItem.findUnique({ where: { id: jenisId } }),
    prisma.colorItem.findUnique({ where: { id: warnaId } }),
    prisma.brandItem.findUnique({ where: { id: merekId } }),
    prisma.locationItem.findUnique({ where: { id: lokasiId } }),
  ]);

  // 2. Ambil kode master data (atau nilai default jika kosong)
  const codeJenis = jenis?.code || "X";
  const codeWarna = warna?.code || "0";
  const codeMerek = merek?.code || "0";
  const codeLokasi = lokasi?.code || "0";

  // 3. Gabungkan menjadi prefix (Contoh: "E-H-A1-RK")
  const prefix = `${codeJenis}-${codeWarna}-${codeMerek}-${codeLokasi}`;

  // 4. Hitung jumlah item eksisting dengan prefix persis sama untuk Nomor Urut (Serial)
  const existingCount = await prisma.foundItem.count({
    where: {
      businessCode: {
        startsWith: `${prefix}-`,
      },
    },
  });

  // 5. Generate Serial
  const nextSerial = String(existingCount + 1).padStart(4, "0");

  return `${prefix}-${nextSerial}`;
}
