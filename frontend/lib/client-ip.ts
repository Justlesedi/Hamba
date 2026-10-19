export function ipFromHeaders(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  if (first) {
    return first;
  }

  return headers.get("x-real-ip")?.trim() || undefined;
}

export async function requestIp() {
  const { headers } = await import("next/headers");
  return ipFromHeaders(await headers());
}

export async function requestOrigin() {
  const { headers } = await import("next/headers");
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") || requestHeaders.get("host");
  if (!host) {
    return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  }

  const forwardedProto = requestHeaders.get("x-forwarded-proto");
  const proto =
    forwardedProto ||
    (host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");
  return `${proto}://${host}`;
}
