import { PrefetchLink } from "@/components/ui/PrefetchLink";
import { MODULE_CARD_IMAGES } from "@/constants/assets";
import { PackagePlus, PackageCheck, FileSpreadsheet, ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-140px)] bg-[#fafcfb]">
      {/* 🟢 KONTEN UTAMA: Aksi LACAK (3 Modul Utama) */}
      <section className="container mx-auto px-4 md:px-8 my-8 md:my-12 flex-grow">
        <div className="text-center mb-10">
          <span className="text-[#0d7565] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#0d7565]" />
            <span>Layanan Cepat</span>
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#102a24] mt-1 tracking-tight">
            Aksi Utama Petugas
          </h2>
        </div>

        {/* Grid 3 Modul Utama */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-6xl mx-auto pb-8">
          
          {/* Modul 1: Taruh Barang */}
          <div className="group bg-white rounded-2xl shadow-xs border border-[#e2ece8] overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#0d7565]/40">
            <div className="relative h-48 w-full overflow-hidden bg-[#eef5f2]">
              <img 
                src={MODULE_CARD_IMAGES.taruhBarang} 
                alt="Taruh Barang" 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061814]/85 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4 h-10 w-10 rounded-xl bg-white/95 backdrop-blur-md flex items-center justify-center text-[#0d7565] shadow-xs">
                <PackagePlus className="h-5 w-5" />
              </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-[#142e29] mb-2 group-hover:text-[#0d7565] transition-colors">
                Taruh Barang
              </h3>
              <p className="text-[#57706a] text-xs flex-grow leading-relaxed mb-6">
                Scan sidik jari penemu, input data detail barang temuan baru, dan cetak label barcode lokasi penyimpanan.
              </p>
              <PrefetchLink 
                href="/taruh" 
                className="inline-flex items-center justify-center gap-2 bg-[#0d7565] hover:bg-[#0a5d50] active:scale-[0.98] text-white text-center py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                <span>Mulai Input Barang</span>
                <ArrowRight className="h-4 w-4" />
              </PrefetchLink>
            </div>
          </div>

          {/* Modul 2: Ambil Barang */}
          <div className="group bg-white rounded-2xl shadow-xs border border-[#e2ece8] overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#0d7565]/40">
            <div className="relative h-48 w-full overflow-hidden bg-[#eef5f2]">
              <img 
                src={MODULE_CARD_IMAGES.ambilBarang} 
                alt="Ambil Barang" 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061814]/85 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4 h-10 w-10 rounded-xl bg-white/95 backdrop-blur-md flex items-center justify-center text-[#0d7565] shadow-xs">
                <PackageCheck className="h-5 w-5" />
              </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-[#142e29] mb-2 group-hover:text-[#0d7565] transition-colors">
                Ambil Barang
              </h3>
              <p className="text-[#57706a] text-xs flex-grow leading-relaxed mb-6">
                Scan barcode barang temuan dan verifikasi identitas/sidik jari pengambil untuk menyelesaikan serah terima.
              </p>
              <PrefetchLink 
                href="/ambil" 
                className="inline-flex items-center justify-center gap-2 bg-[#0d7565] hover:bg-[#0a5d50] active:scale-[0.98] text-white text-center py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                <span>Proses Pengambilan</span>
                <ArrowRight className="h-4 w-4" />
              </PrefetchLink>
            </div>
          </div>

          {/* Modul 3: Laporan Kehilangan */}
          <div className="group bg-white rounded-2xl shadow-xs border border-[#e2ece8] overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#0d7565]/40">
            <div className="relative h-48 w-full overflow-hidden bg-[#eef5f2]">
              <img 
                src={MODULE_CARD_IMAGES.laporKehilangan} 
                alt="Laporan Kehilangan" 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061814]/85 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4 h-10 w-10 rounded-xl bg-white/95 backdrop-blur-md flex items-center justify-center text-[#0d7565] shadow-xs">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-[#142e29] mb-2 group-hover:text-[#0d7565] transition-colors">
                Laporan Kehilangan
              </h3>
              <p className="text-[#57706a] text-xs flex-grow leading-relaxed mb-6">
                Bantu warga/siswa mencatat detail barang yang hilang agar sistem dapat merekomendasikan kecocokan barang temuan.
              </p>
              <PrefetchLink 
                href="/lapor" 
                className="inline-flex items-center justify-center gap-2 bg-[#0d7565] hover:bg-[#0a5d50] active:scale-[0.98] text-white text-center py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                <span>Buat Laporan Baru</span>
                <ArrowRight className="h-4 w-4" />
              </PrefetchLink>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

