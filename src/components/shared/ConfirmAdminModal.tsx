"use client";

import React, { useState, useEffect, useRef } from "react";
import { AlertTriangle, Trash2, X, Loader2, CheckCircle2 } from "lucide-react";

interface ConfirmAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  targetName?: string;
}

const REQUIRED_TEXT = "ini perintah admin!";

export default function ConfirmAdminModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi Hapus Semua Data",
  targetName = "seluruh data",
}: ConfirmAdminModalProps) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setInputText("");
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      // Auto focus after open
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
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

  const isMatch = inputText.trim() === REQUIRED_TEXT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMatch || isLoading) return;

    try {
      setIsLoading(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Gagal melakukan penghapusan:", error);
      alert("Terjadi kesalahan saat menghapus data. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-red-100 overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="bg-red-50/70 border-b border-red-100 p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 id="confirm-modal-title" className="text-base font-bold text-gray-900 leading-snug">
                {title}
              </h3>
              <p className="text-xs text-red-600 font-medium mt-0.5">
                Tindakan Berbahaya & Permanen
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-white/80 transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="text-xs text-gray-600 leading-relaxed">
            <p>
              Anda akan menghapus <strong className="text-gray-900">{targetName}</strong> secara permanen.
              Data yang telah dihapus tidak dapat dipulihkan kembali.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
              Konfirmasi Teks
            </label>
            <input
              ref={inputRef}
              type="text"
              disabled={isLoading}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ketik "${REQUIRED_TEXT}"`}
              className={`w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border transition-all outline-none ${
                isMatch
                  ? "border-emerald-500 bg-emerald-50/30 text-emerald-900 ring-2 ring-emerald-500/20"
                  : inputText.length > 0
                  ? "border-red-300 bg-red-50/20 text-gray-900 focus:ring-2 focus:ring-red-400/20"
                  : "border-gray-300 bg-white text-gray-900 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
              }`}
            />
            
            {/* Status Feedback */}
            <div className="min-h-[18px]">
              {isMatch ? (
                <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Konfirmasi sesuai. Siap dihapus.
                </span>
              ) : inputText.length > 0 ? (
                <span className="text-[11px] font-medium text-red-500">
                  Teks konfirmasi belum sesuai.
                </span>
              ) : null}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!isMatch || isLoading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-[0.98] transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed shadow-xs cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menghapus...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Semua Sekarang</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
