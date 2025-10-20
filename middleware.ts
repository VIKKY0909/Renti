import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Skip middleware for static assets
  if (
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/api/upload-image') ||
    request.nextUrl.pathname.startsWith('/api/categories') ||
    request.nextUrl.pathname.includes('.') ||
    request.nextUrl.pathname === '/favicon.ico'
  ) {
    return
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
