// app/test/page.tsx
import Link from 'next/link';
import StaticBanner from './StaticBanner';
import DynamicUserWidget from './DynamicUserWidget';

function ArrowLoh({
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

function Testing() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-2 text-gray-800">
        Dashboard SaaS (Hybrid Rendering)
      </h1>
      <p className="text-gray-600 mb-6">
        Demonstrasi gabungan Static Site Generation & Dynamic Server Rendering dalam satu halaman Next.js.
      </p>

      {/* Komponen Statis */}
      <StaticBanner />

      {/* Komponen Dinamis */}
      <DynamicUserWidget />
    </main>
  );
}

function Latest() {
  return (
    <section className="about-section bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32 lg:px-12">
        <div className="grid gap-10 border-t border-green-dark/15 pt-12 md:grid-cols-[1fr_auto] md:items-end">
          <Link
            href="/tentang-kami"
            className="group inline-flex w-fit items-center gap-3 rounded-full bg-green-dark px-7 py-4 text-sm font-semibold text-white transition-colors duration-300 hover:bg-green-mid"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1">
              <ArrowLoh />
            </span>
            <span>Menuju tentang kami</span>

          </Link>
        </div>
      </div>
    </section>
  );
}

export default function TestPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Testing />
      <Latest />
    </div>
  );
}