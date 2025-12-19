"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminAboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const tabs = [
        { name: "Ustawienia Sekcji", href: "/admin/o-nas/ustawienia" },
        { name: "Zespół", href: "/admin/o-nas/zespol" },
        { name: "Dokumenty", href: "/admin/o-nas/dokumenty" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Zarządzanie sekcją "O Nas"</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Konfiguruj podstrony, zarządzaj zespołem i dokumentami.
                </p>
            </div>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => {
                        const isActive = pathname.startsWith(tab.href);
                        return (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className={cn(
                                    "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors",
                                    isActive
                                        ? "border-indigo-500 text-indigo-600"
                                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                )}
                                aria-current={isActive ? "page" : undefined}
                            >
                                {tab.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="animate-in fade-in duration-300">
                {children}
            </div>
        </div>
    );
}
