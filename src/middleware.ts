import { NextResponse } from "next/server";
import { auth } from "~/server/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const publicRoutes = ["/api/auth/signin"];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (!req.auth) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sw.js).*)"],
};
