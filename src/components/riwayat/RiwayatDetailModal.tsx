"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface RiwayatDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}

export default function RiwayatDetailModal({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
}: RiwayatDetailModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-modal-title"
        className="w-full max-w-2xl sm:max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Sticky Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 id="detail-modal-title" className="text-xl font-extrabold text-[#0d3b2e] tracking-tight">
                {title}
              </h3>
              {badge && <div>{badge}</div>}
            </div>
            {subtitle && (
              <p className="text-xs text-gray-500 font-medium">{subtitle}</p>
            )}
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Tutup popup rincian"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto overscroll-contain flex-grow">
          {children}
        </div>

        {/* Footer */}
        <div className="bg-gray-50/80 border-t border-gray-100 px-6 py-3.5 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
