import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

// Danh sách các route public không cần kiểm tra token
const publicRoutes = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Kiểm tra nếu là route public
  if (publicRoutes.some((route) => path.startsWith(route) || path === "/")) {
    return NextResponse.next()
  }

  // Kiểm tra token từ cookies
  const token = request.cookies.get("auth_token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Kiểm tra nếu là file tĩnh
  if (path.match(/\.(png|jpg|jpeg|gif|ico|svg|css|js)$/)) {
    return NextResponse.next()
  }

  const newUrl = new URL(request.url)
  newUrl.pathname = `/private${path}`
  // Rewrite tất cả các request với tiền tố private

  return NextResponse.rewrite(newUrl)
}

// Cấu hình middleware để chạy trên tất cả các path
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (manifest file)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.xml).*)",
  ],
}
