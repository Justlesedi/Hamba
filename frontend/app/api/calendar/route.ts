import { NextResponse } from "next/server";
import { listBusyDays } from "@backend/server/calendar";
import { readSession } from "@/lib/session";

function dateParam(value: string | null) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

export async function GET(request: Request) {
  const session = await readSession();
  if (!session?.userId) {
    return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  }

  const url = new URL(request.url);
  const destination = url.searchParams.get("destination")?.trim() ?? "";
  const start = dateParam(url.searchParams.get("start"));
  const end = dateParam(url.searchParams.get("end"));
  const kind = url.searchParams.get("kind");
  const stayKind = url.searchParams.get("stayKind") ?? undefined;
  const name = url.searchParams.get("name")?.trim() || undefined;

  if (!destination || !start || !end || end < start) {
    return NextResponse.json(
      { message: "Destination and dates are required." },
      { status: 400 },
    );
  }

  const days = await listBusyDays({
    destination,
    start,
    end,
    name,
    kind:
      kind === "stay" || kind === "activity" || kind === "food"
        ? kind
        : "destination",
    stayKind,
  });

  return NextResponse.json({ days });
}
