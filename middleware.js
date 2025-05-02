import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  const response = NextResponse.next();

  // Default to invalid if no token
  if (!token) {
    response.cookies.set("tokenValid", "false", { path: "/" });

    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return response;
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    const userRole = payload?.role;

    // Set cookies for client to read
    response.cookies.set("userRole", userRole || "user", { path: "/" });
    response.cookies.set("tokenValid", "true", { path: "/" });

    // Prevent logged-in users from visiting /login or /signup
    if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return response;
  } catch (err) {
    console.error("Invalid or expired token:", err.message);

    response.cookies.set("tokenValid", "false", { path: "/" });

    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/signup"],
};
