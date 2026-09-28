import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[1.5rem] border border-border bg-card p-6 shadow-[0_12px_40px_rgb(28_22_16_/_0.06)] ${className}`}
    >
      {children}
    </div>
  );
}
