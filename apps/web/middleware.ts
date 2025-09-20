import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!api/|_next/|_proxy/|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host") || "";
  const pathname = url.pathname;

  // Handle short link redirects
  if (pathname !== "/" && pathname !== "/login" && !pathname.startsWith("/dashboard")) {
    // This is likely a short link - redirect to API handler
    return NextResponse.rewrite(new URL(`/api/links${pathname}`, req.url));
  }

  return NextResponse.next();
}
