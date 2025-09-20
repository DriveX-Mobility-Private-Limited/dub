import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!api/|_next/|_proxy/|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest).*)",
  ],
};

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
  try {
    const hostname = req.headers.get("host") || "";
    
    // Handle your custom domain specifically
    if (hostname.includes("dubv1.drivex.co.in")) {
      // Import dynamically to catch any module errors
      const { parse } = await import("@/lib/middleware/utils");
      const { AppMiddleware } = await import("@/lib/middleware");
      
      const { domain, path, key, fullKey } = parse(req);
      return AppMiddleware(req);
    }
    
    // For Vercel domains, try the full middleware
    const { parse } = await import("@/lib/middleware/utils");
    const { AppMiddleware, LinkMiddleware } = await import("@/lib/middleware");
    
    const { domain, path, key, fullKey } = parse(req);
    return LinkMiddleware(req, ev);
    
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}
