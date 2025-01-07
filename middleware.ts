import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    "/signin",
    "/signup",
    "/",
    "/home",]);
const isPrivateRoute = createRouteMatcher([
    "/api/videos",]);

const isPublicApiRoute = createRouteMatcher([
    "/api/videos",]);

//The createRouteMatcher() helper returns a function that, if called with the req object from the Middleware, will return true if the user is trying to access a route that matches one of the routes passed to createRouteMatcher().

export default clerkMiddleware(async (auth, req) => {
    console.log(auth)
    const { userId } = await auth();
    const currentUrl = new URL(req.url)
    const isAccessingDashboard = currentUrl.pathname === "/home"
    const isApiRequest = currentUrl.pathname.startsWith("/api")

    //if user is logged in and accessing a public route but not the dashboard
    if (userId && isPublicRoute(req) && !isAccessingDashboard) {
        return NextResponse.redirect(new URL("/home", req.url))
    }

    // not logged in user
    if (!userId) {
        //if user is not logged in and trying to access a protected route
        if (!isPublicRoute(req) && !isPublicApiRoute) {
            return NextResponse.redirect(new URL("/signin", req.url))
        }
        //if the request is for a protected API and the user is not logged in
        if (isApiRequest && !isPublicRoute(req)) {
            return NextResponse.redirect(new URL("/signin", req.url))
        }

    }
    return NextResponse.next()
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}