import React, { useEffect, useRef } from "react";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className = "" }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useKeyboardShortcut("Escape", () => {
    if (isOpen) onClose();
  });

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const modalElement = modalRef.current;
    if (!modalElement) return;

    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    modalElement.addEventListener("keydown", handleTabKey);
    // Focus first focusable element or modal container
    if (firstElement) {
      firstElement.focus();
    } else {
      modalElement.focus();
    }

    // Add scroll lock
    document.body.classList.add("modal-open");

    return () => {
      modalElement.removeEventListener("keydown", handleTabKey);
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const hasCustomMaxWidth = className.includes("max-w-");

  return (
    <div 
      className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`bg-white w-full ${hasCustomMaxWidth ? "" : "max-w-md"} rounded-2xl shadow-2xl p-5 sm:p-6 relative outline-none modal-animate-in ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          ✕
        </button>
        <h2 id="modal-title" className="text-lg sm:text-xl font-bold mb-4 text-green-dark shrink-0 pr-8">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
