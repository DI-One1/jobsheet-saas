import React from "react";

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

export function Table({ headers, children, className = "" }: TableProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto ${className}`}>
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
            {headers.map((h, i) => {
              const isAction = h.toLowerCase() === "aksi";
              return (
                <th
                  key={i}
                  className={`px-6 py-4 ${isAction ? "text-center w-24" : "text-left"}`}
                >
                  {h}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {children}
        </tbody>
      </table>
    </div>
  );
}
