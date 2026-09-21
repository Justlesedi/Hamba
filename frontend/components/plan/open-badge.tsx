import type { OpenStatus } from "@backend/lib/hours";

export function OpenBadge({ status }: { status: OpenStatus }) {
  if (status.state === "unknown") {
    return <span className="text-sm text-muted">{status.label}</span>;
  }

  return (
    <span
      suppressHydrationWarning
      className={
        status.state === "open" ? "hamba-hours hamba-open" : "hamba-hours hamba-closed"
      }
    >
      {status.label}
    </span>
  );
}
