import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth middleware function
const authMiddleware = withAuth(
    function middleware(req: any) {
        const token = req.nextauth.token;
        const isAuth = !!token;
        const pathname = req.nextUrl.pathname;
        const isAuthPage = pathname.startsWith("/auth");
        const isAdminPage = pathname.startsWith("/admin");
        const isChangePasswordPage = pathname === "/admin/change-password";

        if (isAuthPage && isAuth) {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }

        if (isAdminPage && !isAuth) {
            return NextResponse.redirect(new URL("/auth/login", req.url));
        }

        // Force password change
        if (isAuth && token?.mustChangePassword && !isChangePasswordPage) {
            return NextResponse.redirect(new URL("/admin/change-password", req.url));
        }

        // Access control
        if (isAdminPage && !isChangePasswordPage) {
            const roles = (token?.roles as string[]) || [];
            const hasAccess = roles.includes("ADMIN") || roles.includes("EDITOR") || roles.includes("SUPERADMIN");
            if (!hasAccess) {
                return NextResponse.redirect(new URL("/", req.url));
            }
        }

        // IMPORTANT: For /admin and /auth pages, we STILL want the x-pathname header
        // so that RootLayout can exclude them from Maintenance Mode.
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("x-pathname", pathname);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    },
    {
        callbacks: {
            authorized: ({ token }) => true, // We handle redirection logic inside the middleware function
        },
    }
);

export default async function middleware(req: NextRequest, event: any) {
    const pathname = req.nextUrl.pathname;

    // 1. Prepare headers with x-pathname
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-pathname", pathname);

    // 2. Handle Admin & Auth pages
    if (pathname.startsWith("/admin") || pathname.startsWith("/auth") || pathname.startsWith("/api/auth")) {
        return (authMiddleware as any)(req, event);
    }

    // 3. For all other pages, return next with modified headers
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: ["/((?!api/admin|api/upload|_next/static|_next/image|favicon.ico).*)"],
};
