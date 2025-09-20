import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!api/|_next/|_proxy/|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|login|register|dashboard).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host") || "";
  const pathname = url.pathname;

  // Skip root path
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Extract the potential short link key
  const key = pathname.slice(1); // Remove leading slash

  if (key && key.length > 0) {
    // Check if this is a short link by making an API call
    try {
      const response = await fetch(`${url.origin}/api/links/${key}/exists`, {
        headers: {
          'Authorization': `Bearer ${process.env.API_SECRET || ''}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.exists && data.url) {
          // Redirect to the target URL
          return NextResponse.redirect(data.url);
        }
      }
    } catch (error) {
      console.error('Link lookup error:', error);
    }
  }

  // If not a valid short link, return 404
  return NextResponse.rewrite(new URL('/404', req.url));
}
