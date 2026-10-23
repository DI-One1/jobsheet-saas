"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { User, Activity, Trash2, MoreHorizontal, Phone } from "lucide-react";
import { Warga } from "../types";

interface WargaRowProps {
  item: Warga;
  onHapus: (id: string) => void;
  onRincianProfil: (warga: Warga) => void;
  onRincianAksi: (warga: Warga) => void;
}

/** Jarak antara tombol dan dropdown (px) */
const GAP = 8;
/** Margin aman dari tepi viewport (px) */
const VIEWPORT_MARGIN = 8;

interface DropdownPos {
  top: number;
  left: number;
}

export default function WargaRow({
  item,
  onHapus,
  onRincianProfil,
  onRincianAksi,
}: WargaRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<DropdownPos>({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  // Pastikan portal hanya dirender di client untuk menghindari hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // ---- Hitung posisi dropdown relatif terhadap viewport ----
  const recalcPosition = useCallback(() => {
    const btn = buttonRef.current;
    const dd = dropdownRef.current;
    if (!btn || !dd) return;

    const btnRect = btn.getBoundingClientRect();
    const ddRect = dd.getBoundingClientRect();
    const ddWidth = ddRect.width;
    const ddHeight = ddRect.height;

    // --- Vertikal: default di bawah, flip ke atas jika tidak cukup ---
    const spaceBelow = window.innerHeight - btnRect.bottom - GAP;
    const spaceAbove = btnRect.top - GAP;

    let top: number;
    if (spaceBelow >= ddHeight) {
      top = btnRect.bottom + GAP;
    } else if (spaceAbove >= ddHeight) {
      top = btnRect.top - ddHeight - GAP;
    } else {
      top =
        spaceBelow >= spaceAbove
          ? btnRect.bottom + GAP
          : btnRect.top - ddHeight - GAP;
    }

    // --- Horizontal: align kanan tombol, geser jika mepet ---
    let left = btnRect.right - ddWidth;

    if (left + ddWidth > window.innerWidth - VIEWPORT_MARGIN) {
      left = window.innerWidth - ddWidth - VIEWPORT_MARGIN;
    }
    if (left < VIEWPORT_MARGIN) {
      left = VIEWPORT_MARGIN;
    }

    if (top < VIEWPORT_MARGIN) {
      top = VIEWPORT_MARGIN;
    }
    if (top + ddHeight > window.innerHeight - VIEWPORT_MARGIN) {
      top = window.innerHeight - ddHeight - VIEWPORT_MARGIN;
    }

    setPos({ top, left });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const rafId = requestAnimationFrame(() => {
      recalcPosition();
    });

    const handleScrollOrResize = () => {
      recalcPosition();
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen, recalcPosition]);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target)) return;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // ---- Render dropdown via Portal ----
  const dropdownPortal =
    mounted && isOpen
      ? createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              zIndex: 99999,
            }}
            className="w-44 bg-white border border-[#e2ece8] rounded-xl shadow-lg shadow-black/10 overflow-hidden py-1 animate-fadeIn"
          >
            {/* Rincian Profil */}
            <button
              onClick={() => {
                setIsOpen(false);
                onRincianProfil(item);
              }}
              className="w-full text-left px-3.5 py-2.5 text-xs font-semibold text-[#1c3833] hover:bg-[#eef7f4] hover:text-[#0d7565] transition-colors flex items-center gap-2.5 cursor-pointer"
            >
              <User className="h-4 w-4 text-[#0d7565] shrink-0" />
              <span>Rincian Profil</span>
            </button>

            {/* Rincian Aksi */}
            <button
              onClick={() => {
                setIsOpen(false);
                onRincianAksi(item);
              }}
              className="w-full text-left px-3.5 py-2.5 text-xs font-semibold text-[#1c3833] hover:bg-[#eef7f4] hover:text-[#0d7565] transition-colors flex items-center gap-2.5 cursor-pointer"
            >
              <Activity className="h-4 w-4 text-[#0d7565] shrink-0" />
              <span>Rincian Aksi</span>
            </button>

            {/* Separator */}
            <div className="my-1 border-t border-[#edf4f1]"></div>

            {/* Hapus — Destructive Action */}
            <button
              onClick={() => {
                setIsOpen(false);
                onHapus(item.id);
              }}
              className="w-full text-left px-3.5 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2.5 cursor-pointer"
            >
              <Trash2 className="h-4 w-4 text-red-500 shrink-0" />
              <span>Hapus</span>
            </button>
          </div>,
          document.body
        )
      : null;

  return (
    <tr
      className={
        item.id.startsWith("temp-")
          ? "opacity-50 animate-pulse bg-[#f8faf9]"
          : "hover:bg-[#f4f9f7] transition-colors border-b border-[#edf4f1]"
      }
    >
      <td className="px-6 py-4 text-xs font-bold text-[#0d7565] font-mono">
        {item.id.startsWith("temp-") ? "Generating..." : item.id}
      </td>
      <td className="px-6 py-4 text-xs font-bold text-[#142e29]">
        {item.nama}
      </td>
      <td className="px-6 py-4 text-xs font-semibold">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
            item.peran === "Siswa"
              ? "bg-emerald-100 text-[#0d7565] border border-emerald-200"
              : item.peran === "Guru"
              ? "bg-blue-100 text-blue-700 border border-blue-200"
              : "bg-amber-100 text-amber-800 border border-amber-200"
          }`}
        >
          {item.peran}
        </span>
      </td>
      <td className="px-6 py-4 text-xs text-[#57706a]">
        {item.keterangan_peran || "-"}
      </td>
      <td className="px-6 py-4 text-xs font-mono text-[#57706a]">
        {item.nomor_telepon ? (
          <a
            href={`https://wa.me/${item.nomor_telepon.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noreferrer"
            title={`Hubungi via WhatsApp: ${item.nomor_telepon}`}
            className="inline-flex items-center gap-1.5 hover:text-[#0d7565] transition-colors group cursor-pointer"
          >
            <Phone className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#0d7565] transition-colors shrink-0" />
            <span className="font-semibold text-gray-700 group-hover:text-[#0d7565]">
              {item.nomor_telepon.length > 12
                ? `${item.nomor_telepon.slice(0, 12)}...`
                : item.nomor_telepon}
            </span>
          </a>
        ) : (
          <span className="text-gray-300 font-sans font-medium">—</span>
        )}
      </td>
      <td className="px-6 py-4 text-center w-24">
        <div className="inline-flex items-center justify-center">
          <button
            ref={buttonRef}
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-2 text-[#57706a] hover:text-[#0d7565] hover:bg-[#eef7f4] rounded-full transition-colors disabled:opacity-50 cursor-pointer"
            disabled={item.id.startsWith("temp-")}
            title="Aksi Warga"
            aria-label="Aksi Warga"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {dropdownPortal}
      </td>
    </tr>
  );
}

