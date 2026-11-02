import React, { useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || (label ? `input-${generatedId}` : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold mb-1.5 text-[#142e29]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          className={`w-full border border-[#d2e5df] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#142e29] placeholder:text-[#8ba39c] bg-white transition-all outline-none focus:border-[#0d7565] focus:ring-3 focus:ring-[#0d7565]/15 ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500/15" : ""
          } ${className}`}
          {...props}
        />
        {error && <p className="text-[11px] font-medium text-red-600 mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
