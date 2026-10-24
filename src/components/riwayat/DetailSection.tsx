"use client";

import React from "react";

interface DetailSectionProps {
  icon?: React.ReactNode;
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function DetailSection({
  icon,
  title,
  badge,
  children,
  className = "",
}: DetailSectionProps) {
  return (
    <section className={`bg-gray-50/70 rounded-2xl border border-gray-100 p-4 sm:p-5 space-y-4 ${className}`}>
      <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
        <div className="flex items-center gap-2.5">
          {icon && <div className="text-[#0d3b2e]">{icon}</div>}
          <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            {title}
          </h4>
        </div>
        {badge && <div>{badge}</div>}
      </div>
      <div>{children}</div>
    </section>
  );
}
