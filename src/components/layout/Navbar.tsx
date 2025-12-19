"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown, Facebook, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
    config?: {
        facebookUrl?: string | null;
        instagramUrl?: string | null;
        tiktokUrl?: string | null;
        siteName?: string | null;
        logoUrl?: string | null;
        aboutUsSublinks?: string | null;
        showEvents?: boolean;
    } | null;
}

export function Navbar({ config }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const pathname = usePathname();

    const staticNavigation = [
        { name: "Start", href: "/" },
        {
            name: "O Nas",
            href: "/o-nas",
            children: config?.aboutUsSublinks ? (JSON.parse(config.aboutUsSublinks) as { name: string; href: string }[]) : [
                { name: "Poznaj Nasz Zespół", href: "/o-nas/zespol" },
                { name: "Dokumenty", href: "/o-nas/dokumenty" },
                { name: "Pytania i Odpowiedzi (FAQ)", href: "/o-nas/faq" },
            ]
        },
        { name: "Aktualności", href: "/aktualnosci" },
        ...(config?.showEvents !== false ? [{ name: "Wydarzenia", href: "/wydarzenia" }] : []),
        { name: "Projekty", href: "/projekty" },
        { name: "Zgłoszenia", href: "/zgloszenia" },
        { name: "Kontakt", href: "/kontakt" },
    ];

    if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null;

    return (
        <nav className="bg-white shadow relative z-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex">
                        <div className="flex flex-shrink-0 items-center">
                            <Link href="/" className="flex items-center gap-2">
                                {config?.logoUrl ? (
                                    <div className="relative h-10 w-auto min-w-[40px] aspect-[3/1]">
                                        <div className="relative h-10 w-full">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={config.logoUrl} alt={config.siteName || "RiseGen Logo"} className="h-10 w-auto object-contain" />
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-2xl font-black text-indigo-600 tracking-tighter">
                                        {config?.siteName || "RiseGen"}
                                    </span>
                                )}
                            </Link>
                        </div>
                        <div className="hidden xl:ml-6 xl:flex xl:space-x-8">
                            {staticNavigation.map((item) => {
                                if (item.children) {
                                    return (
                                        <div
                                            key={item.name}
                                            className="relative flex items-center h-full"
                                            onMouseEnter={() => setHoveredItem(item.name)}
                                            onMouseLeave={() => setHoveredItem(null)}
                                        >
                                            <Link
                                                href={item.href}
                                                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-bold text-gray-500 hover:border-indigo-500 hover:text-gray-900 transition-all focus:outline-none"
                                            >
                                                {item.name}
                                                <ChevronDown className="ml-1 h-4 w-4" />
                                            </Link>

                                            {hoveredItem === item.name && (
                                                <div className="absolute left-0 top-full -mt-1 w-64 bg-white shadow-2xl rounded-b-2xl z-50 animate-in fade-in slide-in-from-top-3 duration-300 border border-gray-100">
                                                    <div className="py-2">
                                                        {item.children.map((child) => (
                                                            <Link
                                                                key={child.href}
                                                                href={child.href}
                                                                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                                                onClick={() => setHoveredItem(null)}
                                                            >
                                                                {child.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-bold transition-all h-full",
                                            pathname === item.href
                                                ? "border-indigo-600 text-gray-900"
                                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="hidden xl:flex xl:items-center xl:gap-4 xl:ml-2">
                            {config?.facebookUrl && (
                                <Link href={config.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 transition transform hover:scale-110">
                                    <Facebook className="h-5 w-5" />
                                </Link>
                            )}
                            {config?.instagramUrl && (
                                <Link href={config.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition transform hover:scale-110">
                                    <Instagram className="h-5 w-5" />
                                </Link>
                            )}
                        </div>

                        <div className="-mr-2 flex items-center xl:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isOpen ? (
                                    <X className="block h-6 w-6" aria-hidden="true" />
                                ) : (
                                    <Menu className="block h-6 w-6" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cn("xl:hidden bg-white border-t transition-all duration-300", isOpen ? "max-h-[100vh] opacity-100 pb-6 pt-2" : "max-h-0 opacity-0 overflow-hidden")}>
                <div className="space-y-1 px-4">
                    {staticNavigation.map((item) => {
                        if (item.children) {
                            return (
                                <div key={item.name} className="py-2">
                                    <button
                                        onClick={() => setHoveredItem(hoveredItem === item.name ? null : item.name)}
                                        className="w-full flex justify-between items-center py-2 text-lg font-bold text-gray-900"
                                    >
                                        {item.name}
                                        <ChevronDown className={cn("h-5 w-5 transition-transform", hoveredItem === item.name ? "rotate-180" : "")} />
                                    </button>
                                    <div className={cn("mt-2 pl-4 space-y-2 border-l-2 border-indigo-100", hoveredItem === item.name ? "block" : "hidden")}>
                                        <Link
                                            href={item.href}
                                            className="block py-2 text-base font-bold text-indigo-600"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.name} - Główna
                                        </Link>
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                className="block py-2 text-base font-medium text-gray-600 hover:text-indigo-600"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {child.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "block py-3 text-lg font-bold transition-colors",
                                    pathname === item.href ? "text-indigo-600" : "text-gray-900"
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
