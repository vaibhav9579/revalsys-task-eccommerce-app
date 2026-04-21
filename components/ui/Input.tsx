import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className = "", ...props }: InputProps) {
  const id = props.id ?? props.name;

  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-zinc-900">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        className={`w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/10 ${className}`}
        {...props}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

