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

  const newUrl = new URL(request.url)
  newUrl.pathname = `/private${path}`
  // Rewrite tất cả các request với tiền tố private

  return NextResponse.rewrite(newUrl)
}

// Cấu hình middleware để chạy trên tất cả các path
export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
}
