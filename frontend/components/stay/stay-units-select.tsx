"use client";

export function StayUnitsSelect({
  travellers,
  value,
  onChange,
  name = "stayUnits",
  submitOnChange = false,
}: {
  travellers: number;
  value: number;
  onChange: (units: number) => void;
  name?: string;
  submitOnChange?: boolean;
}) {
  const max = Math.max(1, travellers);

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted">Rooms</span>
      <select
        name={name}
        value={value}
        onChange={(event) => {
          onChange(Number(event.target.value));
          if (submitOnChange) {
            event.currentTarget.form?.requestSubmit();
          }
        }}
        className="rounded-full border border-border bg-background px-3 py-1.5 text-sm"
      >
        {Array.from({ length: max }, (_, index) => index + 1).map((count) => (
          <option key={count} value={count}>
            {count} {count === 1 ? "room" : "rooms"}
          </option>
        ))}
      </select>
    </label>
  );
}
