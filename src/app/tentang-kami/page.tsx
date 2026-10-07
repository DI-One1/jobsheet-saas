import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami — LACAK",
  description:
    "Mengenal LACAK — Sistem pelacakan barang temuan dan kehilangan berbasis digital di lingkungan Institusi.",
};

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type TeamMember = {
  name: string;
  role: string;
  description: string;
  image: string;
  profile: string;
};

type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1454923634634-bd1614719a7b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGh1bWFuJTIwYmVpbmd8ZW58MHx8MHx8fDA%3D";

const INTRO_IMAGE =
  "https://images.unsplash.com/photo-1749828198068-b224469a39c4?w=1000&h=1250&fit=crop&q=80";

/*
 * LACAK saat ini dikembangkan oleh dua orang.
 * Jangan menambahkan anggota lain tanpa perubahan data yang disengaja.
 */
const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Muhammad Nafis",
    role: "Lead Developer",
    description:
      "Bertanggung jawab atas arsitektur sistem dan pengembangan ide LACAK.",
    image:
      "https://static.vecteezy.com/system/resources/previews/037/336/395/non_2x/user-profile-flat-illustration-avatar-person-icon-gender-neutral-silhouette-profile-picture-free-vector.jpg",
    profile: "#",
  },
  {
    name: "Muhammad Choerul Akbar",
    role: "Full-Stack Developer",
    description:
      "Mengembangkan ide inti, antarmuka dan sistem backend yang menjadi fondasi platform LACAK.",
    image:
      "https://static.vecteezy.com/system/resources/previews/037/336/395/non_2x/user-profile-flat-illustration-avatar-person-icon-gender-neutral-silhouette-profile-picture-free-vector.jpg",
    profile: "#",
  },
];

const STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Lapor Kehilangan",
    description:
      "Pengguna melaporkan barang yang hilang dengan informasi seperti jenis, warna, merek, dan lokasi terakhir.",
  },
  {
    number: "02",
    title: "Catat Temuan",
    description:
      "Barang yang ditemukan dicatat ke dalam sistem dengan informasi yang diperlukan untuk proses pencocokan.",
  },
  {
    number: "03",
    title: "Matching Otomatis",
    description:
      "Sistem membantu mencocokkan laporan kehilangan dengan barang temuan berdasarkan atribut yang tersedia.",
  },
  {
    number: "04",
    title: "Klaim & Ambil",
    description:
      "Pemilik melakukan verifikasi dan mengambil kembali barang yang berhasil ditemukan.",
  },
];

/* ------------------------------------------------------------------ */
/*  Shared primitives                                                  */
/* ------------------------------------------------------------------ */

function ArrowIcon({
  direction = "right",
}: {
  direction?: "right" | "left";
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={`h-4 w-4 ${
        direction === "left" ? "rotate-180" : ""
      }`}
    >
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04 1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function Eyebrow({
  children,
  tone = "light",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  const color =
    tone === "dark" ? "text-green-accent" : "text-green-mid";

  const line =
    tone === "dark" ? "bg-green-accent" : "bg-green-mid";

  return (
    <div className="mb-5 flex items-center gap-3">
      <span className={`h-px w-8 ${line}`} />

      <p
        className={`text-xs font-semibold uppercase tracking-[0.22em] ${color}`}
      >
        {children}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="about-section relative overflow-hidden bg-cream">
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-cream/72" />

        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/10 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-10 pb-28 md:px-10 md:pt-12 md:pb-36 lg:px-12 lg:pt-14 lg:pb-44">
        {/* Tombol Kembali ke Beranda */}
        <div className="mb-10 sm:mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-green-dark/15 bg-white/80 px-4 py-2 text-xs font-semibold text-green-dark backdrop-blur-xs transition-all hover:bg-white hover:border-green-dark/30 hover:shadow-xs group"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        <div className="max-w-4xl">
          <Eyebrow>lacak-v1</Eyebrow>

          <h1 className="font-serif text-6xl leading-[0.95] tracking-[-0.035em] text-green-dark sm:text-7xl md:text-8xl lg:text-[8rem]">
            Tentang
            <br />
            <span className="text-green-dark/55">LACAK</span>
          </h1>

          <div className="mt-10 max-w-2xl border-t border-green-dark/15 pt-7">
            <p className="text-base leading-8 text-green-dark/70 md:text-lg md:leading-9">
              Sistem digital yang membantu lingkungan institusi mencatat,
              menemukan, dan mengembalikan barang yang hilang dengan proses
              yang lebih terstruktur.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Introduction                                                       */
/* ------------------------------------------------------------------ */

function Introduction() {
  return (
    <section className="about-section bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
          <div>
            <Eyebrow>Tentang Aplikasi</Eyebrow>

            <h2 className="max-w-lg font-serif text-4xl leading-[1.08] tracking-[-0.025em] text-green-dark md:text-5xl">
              Membuat proses kehilangan barang menjadi lebih sederhana.
            </h2>

            <p className="mt-8 max-w-xl text-lg leading-8 text-green-dark/75 md:text-xl md:leading-9">
              LACAK merupakan platform digital yang dirancang untuk membantu
              proses pelaporan barang hilang dan barang temuan di lingkungan
              Institusi.
            </p>

            <p className="mt-6 max-w-xl text-base leading-8 text-green-dark/55">
              Dengan pencatatan yang terpusat dan proses pencocokan yang lebih
              terstruktur, informasi mengenai barang tidak lagi tersebar.
              Pengguna dapat melaporkan kehilangan, mencatat barang temuan,
              hingga melakukan proses pengambilan melalui satu sistem.
            </p>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-green-dark/5 lg:aspect-auto">
            <img
              src={INTRO_IMAGE}
              alt="Aktivitas warga sekolah di lingkungan Institusi"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Process                                                            */
/* ------------------------------------------------------------------ */

function ProcessTimeline() {
  return (
    <section className="about-section border-y border-green-dark/10 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-12">
        <div className="mb-20 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>Proses</Eyebrow>

            <h2 className="font-serif text-4xl leading-tight tracking-[-0.025em] text-green-dark md:text-5xl">
              Bagaimana LACAK bekerja
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-green-dark/55">
            Setiap laporan melewati proses yang terstruktur agar informasi
            barang dapat ditemukan dan ditindaklanjuti dengan lebih mudah.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-green-dark/12 md:block" />

          <div className="grid gap-10 sm:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-10">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="group relative"
              >
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-green-mid/40 bg-white font-serif text-lg text-green-mid transition-colors duration-300 group-hover:border-green-mid group-hover:bg-green-mid group-hover:text-white">
                  {step.number}
                </div>

                <h3 className="mt-6 text-lg font-semibold tracking-[-0.01em] text-green-dark">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-green-dark/55">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Vision                                                             */
/* ------------------------------------------------------------------ */

function VisionQuote() {
  return (
    <section className="about-section relative overflow-hidden bg-green-dark">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 select-none font-serif text-[14rem] leading-none text-white/[0.04]"
      >
        &ldquo;
      </span>

      <div className="relative mx-auto max-w-5xl px-6 py-28 text-center md:px-10 md:py-36">
        <div className="mb-8 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-green-accent" />

          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-accent">
            Visi LACAK
          </p>

          <span className="h-px w-8 bg-green-accent" />
        </div>

        <blockquote className="font-serif text-3xl leading-[1.25] tracking-[-0.02em] text-white md:text-5xl lg:text-6xl">
          &ldquo;Setiap barang memiliki pemilik yang menunggu. LACAK hadir
          untuk memperpendek jarak di antara keduanya.&rdquo;
        </blockquote>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Team Card                                                          */
/*                                                                      */
/*  Visual direction:                                                   */
/*  - Poppins, konsisten dengan UI LACAK                                */
/*  - Tidak menggunakan rounded card                                    */
/*  - Editorial / clean profile block                                   */
/*  - Foto 4:3                                                          */
/*  - Subtle hover                                                      */
/* ------------------------------------------------------------------ */

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="group flex flex-col overflow-hidden bg-white ring-1 ring-green-dark/[0.08] transition-all duration-500 hover:-translate-y-1 hover:ring-green-dark/[0.14] hover:shadow-[0_24px_48px_-24px_rgba(15,40,28,0.2)]">
      {/* Photo */}
      <div className="aspect-[4/3] overflow-hidden bg-green-dark/5">
        <img
          src={member.image}
          alt={`Foto ${member.name}`}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Profile Content */}
      <div className="flex flex-1 flex-col p-7 md:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-green-mid">
          {member.role}
        </p>

        <h3 className="mt-2 font-poppins text-2xl font-semibold leading-tight tracking-[-0.025em] text-green-dark md:text-[1.65rem]">
          {member.name}
        </h3>

        <p className="mt-3 flex-1 text-sm leading-7 text-green-dark/60">
          {member.description}
        </p>

        <Link
          href={member.profile}
          className="mt-7 inline-flex w-fit items-center gap-3 text-sm font-semibold text-green-dark"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-dark text-white transition-transform duration-300 group-hover:translate-x-1">
            <ArrowIcon />
          </span>

          <span className="underline decoration-green-dark/25 underline-offset-4 transition-colors duration-300 group-hover:decoration-green-dark">
            Lihat profil
          </span>
        </Link>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Team Section                                                       */
/* ------------------------------------------------------------------ */

function TeamSection() {
  return (
    <section className="about-section bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-12">
        <div className="mb-16 max-w-2xl md:mb-20">
          <Eyebrow>Di Balik Layar</Eyebrow>

          <h2 className="font-serif text-4xl leading-[1.05] tracking-[-0.03em] text-green-dark md:text-6xl">
            Orang-orang di balik LACAK
          </h2>

          <p className="mt-6 max-w-xl text-base leading-8 text-green-dark/55">
            LACAK dikembangkan melalui kolaborasi dua pengembang yang
            berfokus pada teknologi, pengalaman pengguna, dan kualitas
            sistem.
          </p>
        </div>

        {/* 
         * Dua pengembang → dua kolom pada desktop.
         * Tidak menggunakan lg:grid-cols-3 agar tidak meninggalkan
         * satu ruang kosong besar di sisi kanan.
         */}
        <div className="grid gap-x-8 gap-y-10 md:grid-cols-2">
          {TEAM_MEMBERS.map((member) => (
            <TeamCard
              key={member.name}
              member={member}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Closing CTA                                                        */
/* ------------------------------------------------------------------ */

function ClosingCTA() {
  return (
    <section className="about-section bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-12">
        <div className="grid gap-10 border-t border-green-dark/15 pt-12 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <Eyebrow>LACAK</Eyebrow>

            <h2 className="max-w-2xl font-serif text-4xl leading-[1.08] tracking-[-0.025em] text-green-dark md:text-5xl">
              Temukan kembali barang yang berharga bagi Anda.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-green-dark/55">
              Jelajahi LACAK dan gunakan sistem pelaporan barang temuan dan
              kehilangan secara lebih mudah.
            </p>
          </div>

          <Link
            href="/"
            className="group inline-flex w-fit items-center gap-3 rounded-full bg-green-dark px-7 py-4 text-sm font-semibold text-white transition-colors duration-300 hover:bg-green-mid"
          >
            <span>Kembali ke Beranda</span>

            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1">
              <ArrowIcon />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Hero />
      <Introduction />
      <ProcessTimeline />
      <VisionQuote />
      <TeamSection />
      <ClosingCTA />
    </div>
  );
}

