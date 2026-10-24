"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal, Trash2, Eye, Copy, Check } from "lucide-react";

interface RiwayatActionDropdownProps {
  onDelete: () => void;
  onDetail: () => void;
  itemCode?: string | null;
  copyDisabledReason?: string;
  onToast?: (message: string, type: "success" | "error") => void;
}

export default function RiwayatActionDropdown({
  onDelete,
  onDetail,
  itemCode,
  copyDisabledReason = "Kode barang belum tersedia",
  onToast,
}: RiwayatActionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 190;
    const menuHeight = 135;

    // Hitung posisi horizontal (prioritaskan align right dengan button)
    let left = rect.right - menuWidth;
    if (left < 10) left = 10;
    if (left + menuWidth > window.innerWidth - 10) {
      left = window.innerWidth - menuWidth - 10;
    }

    // Hitung posisi vertikal (bawah jika cukup, atau ke atas jika mepet bawah layar)
    let top = rect.bottom + 6;
    if (top + menuHeight > window.innerHeight - 10) {
      top = rect.top - menuHeight - 6;
    }

    setMenuPosition({ top, left });
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen) {
      updatePosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Close on outside click, window resize or scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!itemCode) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(itemCode);
      } else {
        // Fallback untuk environment non-HTTPS atau testing
        const textArea = document.createElement("textarea");
        textArea.value = itemCode;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      onToast?.(`Kode barang "${itemCode}" berhasil disalin ke clipboard!`, "success");
      setTimeout(() => {
        setIsCopied(false);
        setIsOpen(false);
      }, 300);
    } catch {
      onToast?.("Gagal menyalin kode barang.", "error");
      setIsOpen(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    onDelete();
  };

  const handleDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    onDetail();
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-label="Menu Aksi"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={`p-1.5 rounded-lg border transition-all cursor-pointer inline-flex items-center justify-center ${
          isOpen
            ? "bg-[#0d3b2e] text-white border-[#0d3b2e] shadow-xs"
            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {isOpen &&
        menuPosition &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-orientation="vertical"
            style={{
              position: "fixed",
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              zIndex: 9999,
            }}
            className="w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 animate-in fade-in zoom-in-95 duration-150 focus:outline-hidden"
          >
            {/* 1. HAPUS */}
            <button
              type="button"
              role="menuitem"
              onClick={handleDelete}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50/80 transition-colors text-left cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>Hapus</span>
            </button>

            {/* 2. RINCIAN */}
            <button
              type="button"
              role="menuitem"
              onClick={handleDetail}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-emerald-50/80 hover:text-[#0d3b2e] transition-colors text-left cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span>Rincian</span>
            </button>

            <div className="my-1 border-t border-gray-100" />

            {/* 3. SALIN KODE BARANG */}
            {itemCode ? (
              <button
                type="button"
                role="menuitem"
                onClick={handleCopy}
                className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5 truncate">
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  )}
                  <span className="truncate">Salin Kode Barang</span>
                </div>
              </button>
            ) : (
              <div
                role="menuitem"
                aria-disabled="true"
                title={copyDisabledReason}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-gray-400 cursor-not-allowed bg-gray-50/60"
              >
                <Copy className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                <span className="truncate">Salin Kode (N/A)</span>
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
