import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "brand" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none gap-2";

  let sizeStyles = "h-11 px-4.5 text-xs sm:text-sm";
  if (size === "sm") {
    sizeStyles = "h-9 px-3 text-xs";
  } else if (size === "lg") {
    sizeStyles = "h-12 px-6 text-sm font-bold";
  }

  let variantStyles = "";
  switch (variant) {
    case "primary":
      variantStyles =
        "bg-[#0d7565] hover:bg-[#0a5d50] active:scale-[0.98] text-white shadow-xs hover:shadow-md";
      break;
    case "brand":
      variantStyles =
        "bg-[#0d3b2e] hover:bg-[#1a5c44] active:scale-[0.98] text-white shadow-xs hover:shadow-md";
      break;
    case "secondary":
      variantStyles =
        "bg-[#eef7f4] text-[#0d7565] hover:bg-[#e0f1eb] active:scale-[0.98] border border-[#d2e5df]";
      break;
    case "danger":
      variantStyles =
        "bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white shadow-xs";
      break;
    case "outline":
      variantStyles =
        "border border-[#d2e5df] text-[#142e29] bg-white hover:bg-[#f6faf8] active:scale-[0.98]";
      break;
    case "ghost":
      variantStyles =
        "bg-transparent text-[#526b65] hover:bg-[#f0f5f3] hover:text-[#102824] shadow-none";
      break;
  }

  return (
    <button className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  );
}
