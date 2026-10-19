import { AuthError } from "@backend/server/users";
import { resetPasswordWithToken } from "@backend/server/recovery";
import { ACCOUNT_RECOVERED_LOGIN_PATH, RECOVERY } from "@backend/lib/security";
import { resetPasswordSchema } from "@backend/lib/validation";
import { deleteSession } from "@/lib/session";
import { jsonWithSecurity } from "@/lib/security-response";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(body);

  if (!parsed.success) {
    return jsonWithSecurity(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    await resetPasswordWithToken(parsed.data);
    await deleteSession();
    return jsonWithSecurity({
      ok: true,
      redirect: ACCOUNT_RECOVERED_LOGIN_PATH,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return jsonWithSecurity(
        { message: error.message },
        { status: error.code === "INVALID_TOKEN" ? 400 : 429 },
      );
    }
    return jsonWithSecurity(
      { message: RECOVERY.expiredMessage },
      { status: 400 },
    );
  }
}
