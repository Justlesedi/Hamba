import { NextResponse } from "next/server";
import { AuthError, authenticateUser } from "@backend/server/users";
import { signInSchema } from "@backend/lib/validation";
import { createSession } from "@/lib/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signInSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const user = await authenticateUser(parsed.data);
    await createSession(user.id);
    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: "Could not sign in." }, { status: 500 });
  }
}
