import {NextRequest, NextResponse} from "next/server";
import {getSessionCookie} from "better-auth/cookies";

export default function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request)
    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next()

}

export const config = {
    // register is temporary
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|$|login|register).*)']
}