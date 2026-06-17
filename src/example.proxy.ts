import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    // Better Auth recommends page-level authorization for real security.
    // This proxy only performs a fast cookie presence check to keep redirects
    // snappy without hitting the database in edge-like runtimes.
    const sessionCookie = getSessionCookie(req);

    if ((pathname.includes("/admin") || pathname.includes("/user")) && !sessionCookie) {
        return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/user/:path*", "/admin/:path*"],
};
