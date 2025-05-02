"use-server";

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req?.cookies?.get("token")?.value;

  if (pathname.startsWith("/admin") && !token) {
    console.log("Unauthorized access attempt to /admin");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    if (token) {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      const userRole = payload?.role;

      // Restrict access to /admin for non-admin users
      /*       if (pathname.startsWith("/admin") && userRole !== "admin") {
        console.log("Access denied: User is not an admin");
        return NextResponse.redirect(new URL("/", req.url));
      } */

      // Redirect logged-in users away from /login or /signup
      if (
        (token && pathname.startsWith("/login")) ||
        pathname.startsWith("/signup")
      ) {
        console.log("You're already authorized");
        return NextResponse.redirect(new URL("/", req.url));
      }
      const response = NextResponse.next();
      response.cookies.set("userRole", userRole, { path: "/" });
      return response;
    }
  } catch (err) {
    console.error("Token verification failed:", err.message);

    // Redirect to /login if the token is invalid or expired
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

// Middleware configuration
export const config = {
  matcher: ["/admin/:path*", "/login", "/signup"],
};
