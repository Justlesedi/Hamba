import { ACCOUNT_EXISTS_LOGIN_PATH, PASSWORD_POLICY, SECURITY_HEADERS } from "@backend/lib/security";
import { jsonWithSecurity } from "@/lib/security-response";

export async function GET() {
  return jsonWithSecurity({
    headers: SECURITY_HEADERS,
    password: PASSWORD_POLICY,
    accountExists: {
      denySignUp: true,
      redirect: ACCOUNT_EXISTS_LOGIN_PATH,
    },
    endpoints: {
      password: { method: ["GET", "POST"], path: "/api/security/password" },
      email: { method: ["POST"], path: "/api/security/email" },
      signUp: { method: ["POST"], path: "/api/auth/sign-up" },
      signIn: { method: ["POST"], path: "/api/auth/sign-in" },
      signOut: { method: ["POST"], path: "/api/auth/sign-out" },
    },
  });
}
