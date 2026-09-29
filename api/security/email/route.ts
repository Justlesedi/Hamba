import { findUserByEmail } from "@backend/lib/auth";
import { emailCheckSchema } from "@backend/lib/validation";
import {
  accountExistsConflict,
  jsonWithSecurity,
} from "@/lib/security-response";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = emailCheckSchema.safeParse(body);

  if (!parsed.success) {
    return jsonWithSecurity(
      { errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (findUserByEmail(parsed.data.email)) {
    return accountExistsConflict();
  }

  return jsonWithSecurity({ exists: false });
}
