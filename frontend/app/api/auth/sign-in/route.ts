import { AuthError, authenticateUser } from "@backend/server/users";
import { signInSchema } from "@backend/lib/validation";
import { createSession } from "@/lib/session";
import { jsonWithSecurity } from "@/lib/security-response";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signInSchema.safeParse(body);

  if (!parsed.success) {
    return jsonWithSecurity(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const user = await authenticateUser(parsed.data);
    await createSession(user.id);
    return jsonWithSecurity({ user, redirect: "/trips" });
  } catch (error) {
    if (error instanceof AuthError) {
      return jsonWithSecurity({ message: error.message }, { status: 401 });
    }
    return jsonWithSecurity({ message: "Could not sign in." }, { status: 500 });
  }
}
