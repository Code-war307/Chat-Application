import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const publicRoutes = ["/", "/sign-in", "/sign-up"];
const protectedRoutes = ["/dashboard", "/profile", "/media-preview"];

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const { pathname } = request.nextUrl;

  const isPublic = publicRoutes.some((route) => pathname === route);
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (token && isPublic) {
    return NextResponse.redirect(
      new URL("/dashboard/conversation", request.url)
    );
  }

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/sign-up",
    "/dashboard/:path*",
    "/profile/:path*",
  ],
};
