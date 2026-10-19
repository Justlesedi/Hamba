export const ACCOUNT_EXISTS_LOGIN_PATH = "/sign-in?account=exists";
export const ACCOUNT_RECOVERED_LOGIN_PATH = "/sign-in?recovered=password";

export const PASSWORD_RULE =
  "Use at least 6 characters with a letter, a number, and a special character.";

export const PASSWORD_POLICY = {
  minLength: 6,
  requires: ["letter", "number", "special"] as const,
  message: PASSWORD_RULE,
};

export const SIGN_IN_LIMIT = {
  maxFailures: 5,
  ipMaxFailures: 20,
  windowMinutes: 15,
  message: "Too many sign-in tries. Wait 15 minutes, then try again.",
};

export const RECOVERY = {
  tokenMinutes: 30,
  mailboxHours: 48,
  maxRequests: 5,
  ipMaxRequests: 20,
  windowMinutes: 15,
  sentMessage:
    "If that matches an account on Hamba, we sent a note to the inbox.",
  limitMessage: "Too many recovery tries. Wait 15 minutes, then try again.",
  expiredMessage: "This link has expired. Request a new one.",
};

export const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(self)",
};

export function isSecurePassword(value: string) {
  return (
    value.length >= 6 &&
    /[A-Za-z]/.test(value) &&
    /\d/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  );
}
