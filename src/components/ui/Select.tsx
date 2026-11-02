import React, { useId } from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || (label ? `select-${generatedId}` : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold mb-1.5 text-[#142e29]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          aria-invalid={Boolean(error)}
          className={`w-full border border-[#d2e5df] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#142e29] bg-white transition-all outline-none focus:border-[#0d7565] focus:ring-3 focus:ring-[#0d7565]/15 cursor-pointer ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500/15" : ""
          } ${className}`}
          defaultValue=""
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-[11px] font-medium text-red-600 mt-1">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
