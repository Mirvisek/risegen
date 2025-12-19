"use client";

import { usePathname } from "next/navigation";

export function SkipToContent() {
    const pathname = usePathname();

    // Hide on admin and auth pages
    if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
        return null;
    }

    return (
        <a
            href="#main-content"
            className="absolute left-0 top-[-100px] z-[100] block bg-white p-3 text-black focus:top-0 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
        >
            Przejdź do treści
        </a>
    );
}
