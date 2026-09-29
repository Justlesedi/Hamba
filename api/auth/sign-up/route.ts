import { AuthError, registerUser } from "@backend/server/users";
import { signUpSchema } from "@backend/lib/validation";
import { createSession } from "@/lib/session";
import {
  accountExistsConflict,
  jsonWithSecurity,
} from "@/lib/security-response";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signUpSchema.safeParse(body);

  if (!parsed.success) {
    return jsonWithSecurity(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const user = await registerUser(parsed.data);
    await createSession(user.id);
    return jsonWithSecurity({ user, redirect: "/trips" }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError && error.code === "EMAIL_TAKEN") {
      return accountExistsConflict();
    }
    return jsonWithSecurity(
      { message: "Could not create account." },
      { status: 500 },
    );
  }
}
