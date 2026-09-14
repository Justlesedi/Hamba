import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

const styles = {
  primary:
    "bg-accent text-white hover:bg-accent-hover disabled:opacity-60",
  secondary:
    "border border-border bg-card text-foreground hover:bg-background disabled:opacity-60",
  ghost: "text-muted hover:text-foreground disabled:opacity-60",
};

export function Button({
  variant = "primary",
  className = "",
  type = "submit",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium ${styles[variant]} ${className}`}
      {...props}
    />
  );
}
