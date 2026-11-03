import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "brand" | "primary" | "success" | "warning" | "danger" | "info" | "neutral";
  className?: string;
}

export function Badge({ children, variant = "neutral", className = "" }: BadgeProps) {
  let colorStyles = "";
  switch (variant) {
    case "brand":
      colorStyles = "bg-[#0d7565] text-white border border-[#0d7565]";
      break;
    case "primary":
      colorStyles = "bg-[#eef7f4] text-[#0d7565] border border-[#d2e5df]";
      break;
    case "success":
      colorStyles = "bg-emerald-50 text-emerald-800 border border-emerald-200";
      break;
    case "warning":
      colorStyles = "bg-amber-50 text-amber-800 border border-amber-200";
      break;
    case "danger":
      colorStyles = "bg-red-50 text-red-800 border border-red-200";
      break;
    case "info":
      colorStyles = "bg-sky-50 text-sky-800 border border-sky-200";
      break;
    case "neutral":
      colorStyles = "bg-slate-50 text-slate-700 border border-slate-200";
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide ${colorStyles} ${className}`}>
      {children}
    </span>
  );
}
