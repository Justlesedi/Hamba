import { deleteSession } from "@/lib/session";
import { jsonWithSecurity } from "@/lib/security-response";

export async function POST() {
  await deleteSession();
  return jsonWithSecurity({ ok: true, redirect: "/" });
}
