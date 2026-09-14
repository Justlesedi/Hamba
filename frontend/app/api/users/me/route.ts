import { NextResponse } from "next/server";
import { getUserById } from "@backend/server/users";
import { readSession } from "@/lib/session";

export async function GET() {
  const session = await readSession();
  if (!session?.userId) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await getUserById(session.userId);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}
