import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle admin routes
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    // Check if user is authenticated
    const isAuthenticated = request.cookies.get("adminAuthenticated")?.value === "true"

    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static files)
    "/((?!_next/|api/|images/|favicon.ico).*)",
  ],
}

