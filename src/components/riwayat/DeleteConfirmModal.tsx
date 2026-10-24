"use client";

import React, { useEffect, useRef } from "react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  itemName: string;
  itemIdentifier?: string;
  description?: string;
  isLoading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  itemIdentifier,
  description,
  isLoading = false,
}: DeleteConfirmModalProps) {
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        cancelBtnRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-confirm-title"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-red-100 overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="bg-red-50/70 border-b border-red-100 p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 id="delete-confirm-title" className="text-base font-bold text-gray-900 leading-snug">
                {title}
              </h3>
              <p className="text-xs text-red-600 font-medium mt-0.5">
                Konfirmasi Penghapusan Data
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-black/5 transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Tutup dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-sm text-gray-600">
          <p>
            Apakah Anda yakin ingin menghapus catatan data berikut dari sistem?
          </p>

          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Data yang Dipilih:
            </div>
            <div className="text-sm font-bold text-gray-900">
              {itemName}
            </div>
            {itemIdentifier && (
              <div className="text-xs font-mono text-gray-600">
                {itemIdentifier}
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500 leading-relaxed">
            {description ||
              "Tindakan ini akan menghapus data riwayat dari database secara permanen."}
          </p>
        </div>

        {/* Actions */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-2.5">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Data</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
