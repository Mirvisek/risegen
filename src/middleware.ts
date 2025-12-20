import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth middleware function
const authMiddleware = withAuth(
    function middleware(req: any) {
        const token = req.nextauth.token;
        const isAuth = !!token;
        const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
        const isAdminPage = req.nextUrl.pathname.startsWith("/admin");
        const isChangePasswordPage = req.nextUrl.pathname === "/admin/change-password";

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

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export default async function middleware(req: NextRequest, event: any) {
    const pathname = req.nextUrl.pathname;

    // 1. Handle Admin & Auth pages
    if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
        return (authMiddleware as any)(req, event);
    }

    // 2. Prepare headers with x-pathname for non-admin pages
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-pathname", pathname);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
