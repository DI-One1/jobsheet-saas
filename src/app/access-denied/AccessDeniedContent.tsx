"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PETUGAS_EMAILS } from "@/lib/petugas-access";

export default function AccessDeniedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const isUnauthorized = reason === "unauthorized";

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center">
          
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-10 w-10 text-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m0 3.75h.008v.008H12v-.008Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Akses Ditolak
          </h1>

          {/* Description */}
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {isUnauthorized
              ? "Sesi login tidak dapat diverifikasi. Silakan login kembali."
              : "Akun Google yang sedang digunakan tidak memiliki izin untuk mengakses aplikasi Lacak."}
          </p>

          {/* Info box */}
          <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-4 text-left">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Akses resmi
            </p>
            <ul className="mt-1 space-y-1 text-sm font-semibold text-slate-800">
              {PETUGAS_EMAILS.map((email) => (
                <li key={email} className="break-all">
                  {email}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-col gap-3">
            <Link
              href="/sign-in"
              className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]"
            >
              Login dengan akun lain
            </Link>

            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
            >
              Kembali ke Beranda
            </Link>
          </div>

          {/* Footer */}
          <p className="mt-7 text-xs text-slate-400">
            Lacak · Sistem Pelaporan & Pemantauan
          </p>
        </div>
      </div>
    </main>
  );
}