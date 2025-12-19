import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
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
            const roles = (token?.roles as string[]) || []; // Safely cast roles

            // Check if user has at least one required role
            const hasAccess = roles.includes("ADMIN") || roles.includes("EDITOR") || roles.includes("SUPERADMIN");

            if (!hasAccess) {
                // If user doesn't have required role, redirect to home or login
                // Returning 403 or redirecting to home is better than login loop
                return NextResponse.redirect(new URL("/", req.url));
            }
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/admin/:path*"],
};
