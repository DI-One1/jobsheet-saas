"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface DetailFieldProps {
  label: string;
  value?: string | number | null | React.ReactNode;
  mono?: boolean;
  copyable?: boolean;
  copyValue?: string;
  onToast?: (message: string, type: "success" | "error") => void;
  className?: string;
}

export default function DetailField({
  label,
  value,
  mono = false,
  copyable = false,
  copyValue,
  onToast,
  className = "",
}: DetailFieldProps) {
  const [copied, setCopied] = useState(false);

  const displayValue = value === null || value === undefined || value === "" ? "—" : value;
  const isPlaceholder = displayValue === "—";

  const handleCopy = async () => {
    const textToCopy = copyValue || (typeof value === "string" ? value : "");
    if (!textToCopy) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      onToast?.(`"${textToCopy}" disalin ke clipboard!`, "success");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      onToast?.("Gagal menyalin teks.", "error");
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
        {label}
      </span>
      <div className="flex items-center gap-1.5 min-h-[22px]">
        <div
          className={`text-sm ${
            isPlaceholder
              ? "text-gray-400 font-normal italic"
              : mono
              ? "font-mono font-semibold text-gray-900"
              : "font-semibold text-gray-900"
          }`}
        >
          {displayValue}
        </div>
        {copyable && !isPlaceholder && (
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 rounded text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
            title="Salin nilai"
            aria-label={`Salin ${label}`}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
