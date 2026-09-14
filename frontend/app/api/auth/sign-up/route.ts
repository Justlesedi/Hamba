import { NextResponse } from "next/server";
import { AuthError, registerUser } from "@backend/server/users";
import { signUpSchema } from "@backend/lib/validation";
import { createSession } from "@/lib/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signUpSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const user = await registerUser(parsed.data);
    await createSession(user.id);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError && error.code === "EMAIL_TAKEN") {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }
    return NextResponse.json({ message: "Could not create account." }, { status: 500 });
  }
}
