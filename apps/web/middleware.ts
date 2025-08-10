import { NextRequest, NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (request.cookies.get("sid")) {
    if (request.nextUrl.pathname === "/") {
      return NextResponse.redirect(
        new URL("/dashboard", request.nextUrl.origin),
      );
    }
  } else if (request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.nextUrl.origin));
  }
}

export const config = {
  matcher: ["/", "/dashboard"],
};
