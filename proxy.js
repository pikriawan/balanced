import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const guestRoutes = {
    exact: ["/", "/signin"],
    start: []
};

const userRoutes = {
    exact: ["/companies", "/signout"],
    start: ["/company"]
};

function matchRoute(pathname, routes) {
    return routes.exact.includes(pathname) || routes.start.some((route) => pathname.startsWith(route));
}

export default auth(async function middleware(request) {
    const pathname = request.nextUrl.pathname;
    const isAuthenticated = !!request.auth;

    if (!isAuthenticated && matchRoute(pathname, userRoutes)) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    if (isAuthenticated && matchRoute(pathname, guestRoutes)) {
        return NextResponse.redirect(new URL("/companies", request.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/",
        "/companies",
        "/company/:path*",
        "/signin",
        "/signout"
    ]
};
