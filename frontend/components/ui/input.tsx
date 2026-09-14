import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block space-y-1.5" htmlFor={inputId}>
      <span className="text-sm font-medium">{label}</span>
      <input
        id={inputId}
        className={`w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-accent ${className}`}
        {...props}
      />
      {error ? <span className="text-sm text-accent">{error}</span> : null}
    </label>
  );
}
