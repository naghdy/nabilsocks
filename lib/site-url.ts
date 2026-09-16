function stripSlash(url: string) {
  return url.replace(/\/$/, "");
}

export function getSiteUrl(request?: Request) {
  const explicit =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.SITE_URL?.trim();
  if (explicit) return stripSlash(explicit);

  if (request) {
    const origin = request.headers.get("origin");
    if (origin) return stripSlash(origin);
    const host =
      request.headers.get("x-forwarded-host") || request.headers.get("host");
    const proto = request.headers.get("x-forwarded-proto") || "https";
    if (host) return stripSlash(`${proto}://${host}`);
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}
