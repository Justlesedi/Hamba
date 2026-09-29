import { passwordSchema } from "@backend/lib/validation";
import { PASSWORD_POLICY } from "@backend/lib/security";
import { jsonWithSecurity } from "@/lib/security-response";

export async function GET() {
  return jsonWithSecurity(PASSWORD_POLICY);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const password =
    body && typeof body === "object" && "password" in body
      ? (body as { password: unknown }).password
      : undefined;
  const parsed = passwordSchema.safeParse(password);

  if (!parsed.success) {
    return jsonWithSecurity(
      {
        ok: false,
        ...PASSWORD_POLICY,
        errors: { password: parsed.error.issues.map((issue) => issue.message) },
      },
      { status: 400 },
    );
  }

  return jsonWithSecurity({ ok: true, ...PASSWORD_POLICY });
}
