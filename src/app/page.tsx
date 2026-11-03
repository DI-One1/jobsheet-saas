import type { Metadata } from "next";
import PublicPortal from "@/components/public/PublicPortal";
import { getPublicData } from "@/features/item/services/public-item-service";

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lacak.smktibazma.sch.id";

export const metadata: Metadata = {
  title: "LACAK - Lapak Cari Barang Kembali | Sistem Lost & Found",
  description:
    "Sistem Informasi Pengelolaan Barang Hilang & Temuan Terintegrasi. Cari barang temuan, laporkan kehilangan, dan pantau status barang secara transparan dan aman.",
  alternates: {
    canonical: "/",
  },
};

export default async function LandingPage() {
  const { items, masterData } = await getPublicData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "LACAK",
        description: "Sistem Informasi Pengelolaan Barang Hilang & Temuan Terintegrasi",
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/pencarian?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "LACAK Lost & Found",
        url: siteUrl,
        logo: `${siteUrl}/images/about/hero.jpg`,
      },
      {
        "@type": "ItemList",
        name: "Daftar Barang Temuan Terbaru",
        numberOfItems: items.length,
        itemListElement: items.slice(0, 10).map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${item.jenis.name} - ${item.merek.name} (${item.warna.name})`,
          description: item.additionalDesc || `Ditemukan di ${item.lokasi.name}`,
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#fafbfb]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicPortal initialItems={items} masterData={masterData} />
    </div>
  );
}
