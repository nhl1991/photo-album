import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export default async function Middleware(req: NextRequest) {

  if (req.nextUrl.pathname === "/home")
    return NextResponse.redirect(new URL("/", req.url));

  const protectedPaths = [
    "/account",
    "/dashboard",
    "/favorite",
    "/password",
    "/posts/new",
  ];
  
  if (protectedPaths.includes(req.nextUrl.pathname)) {
    const session = (await cookies()).get("session");
    if (!session) return NextResponse.redirect(new URL("/signin", req.url));
  }
  return NextResponse.next();
}
