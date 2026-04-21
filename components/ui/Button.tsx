import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "light" | "glass";
type Size = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20";

const variants: Record<Variant, string> = {
  primary: "bg-zinc-900 text-white hover:bg-zinc-800",
  secondary:
    "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-zinc-200",
  ghost: "hover:bg-zinc-100 text-zinc-900",
  danger: "bg-red-600 text-white hover:bg-red-500",
  light: "bg-white text-zinc-900 hover:bg-zinc-100",
  glass: "border border-white/20 bg-white/10 text-white hover:bg-white/15",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
