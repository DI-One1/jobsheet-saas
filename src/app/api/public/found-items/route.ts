import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawLimit = searchParams.get("limit");
    const parsedLimit = rawLimit ? parseInt(rawLimit, 10) : 10;
    const limit =
      Number.isInteger(parsedLimit) && parsedLimit > 0
        ? Math.min(parsedLimit, 50)
        : 10;

    const items = await prisma.foundItem.findMany({
      where: { status: "FOUND" },
      select: {
        id: true,
        businessCode: true,
        jenis: { select: { id: true, name: true, code: true } },
        warna: { select: { id: true, name: true, code: true } },
        merek: { select: { id: true, name: true, code: true } },
        lokasi: { select: { id: true, name: true, code: true } },
        additionalDesc: true,
        activeDaysCount: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const serialized = items.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
    }));

    return NextResponse.json(serialized, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Gagal mengambil data barang temuan publik:", error);
    return NextResponse.json(
      { error: "Gagal memuat data barang temuan." },
      { status: 500 }
    );
  }
}