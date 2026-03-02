import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Gate the site behind "Coming Soon" for public visitors on vamos.net
// Access the full site via:
//   1. Vercel preview URLs (*.vercel.app)
//   2. Adding ?preview=vamos2026 to any page
//   3. Setting a cookie (persists after first ?preview= visit)

const PREVIEW_SECRET = "vamos2026";

export function middleware(request: NextRequest) {
  const { pathname, hostname, searchParams } = request.nextUrl;

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
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
