import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-xs border border-[#e2ece8] p-6 md:p-8 transition-all ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
