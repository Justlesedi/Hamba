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
