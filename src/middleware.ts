import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Gate the site behind "Coming Soon" for public visitors on vamos.net
// Access the full site via:
//   1. Vercel preview URLs (*.vercel.app)
//   2. Adding ?preview=<secret> to any page (secret = env PREVIEW_SECRET)
//   3. Setting a cookie (persists after first ?preview= visit)
//
// M4 (audit): secret is read from env so it's not committed to git. Rotate
// by changing PREVIEW_SECRET in Vercel project settings. The fallback only
// applies when the env var is unset so local dev keeps working without
// extra setup; deploy environments MUST set PREVIEW_SECRET.
const PREVIEW_SECRET = process.env.PREVIEW_SECRET || "vamos2026";

// Public launch switch. When the site is live, the coming-soon gate is fully
// bypassed for everyone. Default is LIVE. To re-enable the gate (re-hide the
// site), set SITE_LIVE="false" in Vercel project env and redeploy.
const SITE_LIVE = (process.env.SITE_LIVE ?? "true").toLowerCase() !== "false";

export function middleware(request: NextRequest) {
  const { pathname, hostname, searchParams } = request.nextUrl;

  // Site is live: let all traffic through, no coming-soon gate.
  if (SITE_LIVE) {
    return NextResponse.next();
  }

  // Always allow these paths through
  if (
    pathname.startsWith("/coming-soon") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/logo")
  ) {
    return NextResponse.next();
  }

  // Allow Vercel preview URLs (not vamos.net)
  if (hostname.includes("vercel.app") || hostname === "localhost") {
    return NextResponse.next();
  }

  // Check for preview secret in URL params
  if (searchParams.get("preview") === PREVIEW_SECRET) {
    const response = NextResponse.next();
    // Set cookie so they don't need the param every time
    response.cookies.set("vamos_preview", "1", {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    return response;
  }

  // Check for preview cookie
  if (request.cookies.get("vamos_preview")?.value === "1") {
    return NextResponse.next();
  }

  // Redirect public visitors to Coming Soon
  const url = request.nextUrl.clone();
  url.pathname = "/coming-soon";
  const response = NextResponse.rewrite(url);
  response.headers.set("x-coming-soon", "1");
  return response;
}

export const config = {
  // Tightened matcher so middleware only runs on actual page routes that
  // need the soft-launch gate. Static assets, the Next.js image optimizer,
  // the favicon family, brand assets, and the API routes used to live
  // outside the matcher — those will now be cacheable at the edge.
  //
  // The negative lookahead also excludes /coming-soon itself (the gate
  // target) and anything under /brand/ so the new logo SVGs are served
  // directly from the static CDN with no middleware overhead.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicon.svg|robots.txt|sitemap.xml|brand/|images/|logo|api/|coming-soon).*)",
  ],
};
