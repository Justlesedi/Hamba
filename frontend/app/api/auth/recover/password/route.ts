import { AuthError } from "@backend/server/users";
import { requestPasswordReset } from "@backend/server/recovery";
import { recoverPasswordSchema } from "@backend/lib/validation";
import { RECOVERY } from "@backend/lib/security";
import { ipFromHeaders } from "@/lib/client-ip";
import { jsonWithSecurity } from "@/lib/security-response";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = recoverPasswordSchema.safeParse(body);

  if (!parsed.success) {
    return jsonWithSecurity(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    await requestPasswordReset({
      email: parsed.data.email,
      origin: new URL(request.url).origin,
      ip: ipFromHeaders(request.headers),
    });
    return jsonWithSecurity({
      message: RECOVERY.sentMessage,
      redirect: "/recover/sent?for=password",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return jsonWithSecurity(
        { message: error.message },
        { status: error.code === "RATE_LIMITED" ? 429 : 400 },
      );
    }
    return jsonWithSecurity(
      { message: "Could not start recovery." },
      { status: 500 },
    );
  }
}
