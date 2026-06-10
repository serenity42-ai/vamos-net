import { NextRequest, NextResponse } from "next/server";
import { getAffiliateLink } from "@/lib/affiliate-links";

/**
 * Affiliate redirect handler — per restructure spec §5.1.
 *
 * GET /go/{slug} → 302 to the registered destination URL.
 *
 * Why a route, not a static link in the post:
 *  - We can swap retailers without editing every post.
 *  - We can count clicks (logged to stdout; Plausible event fired client-side
 *    where applicable).
 *  - We can set rel="sponsored nofollow" centrally.
 *  - Unknown slugs return 404 instead of leaking a broken link.
 *
 * Note: the click event is fired client-side from the link component before
 * navigation. This server route also logs each click so we have a backend
 * audit trail independent of analytics.
 */
export const runtime = "edge";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const link = getAffiliateLink(params.slug);
  if (!link) {
    return new NextResponse("Unknown affiliate link", { status: 404 });
  }

  console.log("[affiliate-click]", {
    slug: link.slug,
    retailer: link.retailer,
    program: link.program ?? "unknown",
    at: new Date().toISOString(),
  });

  return NextResponse.redirect(link.destinationUrl, {
    status: 302,
    headers: {
      // No cache — every click is a real click.
      "Cache-Control": "no-store, must-revalidate",
      // Don't leak the source path to the destination.
      "Referrer-Policy": "no-referrer",
    },
  });
}
