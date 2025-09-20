import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!api/|_next/|_proxy/|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest).*)",
  ],
};

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
  try {
    // Import dynamically to catch any module errors
    const { parse } = await import("@/lib/middleware/utils");
    const { AppMiddleware, ApiMiddleware, LinkMiddleware } = await import("@/lib/middleware");
    
    const { domain, path, key, fullKey } = parse(req);
    
    // Basic routing logic
    if (domain.includes("dub.drivex.co.in")) {
      return AppMiddleware(req);
    }
    
    return LinkMiddleware(req, ev);
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}
