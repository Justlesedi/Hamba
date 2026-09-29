export const ACCOUNT_EXISTS_LOGIN_PATH = "/sign-in?account=exists";

export const PASSWORD_RULE =
  "Use at least 6 characters with a letter, a number, and a special character.";

export const PASSWORD_POLICY = {
  minLength: 6,
  requires: ["letter", "number", "special"] as const,
  message: PASSWORD_RULE,
};

export const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

export function isSecurePassword(value: string) {
  return (
    value.length >= 6 &&
    /[A-Za-z]/.test(value) &&
    /\d/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  );
}
