"use client";

import { usePathname } from "next/navigation";

export function HideInAdmin({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (pathname.startsWith("/admin")) {
        return null;
    }

    return <>{children}</>;
}
