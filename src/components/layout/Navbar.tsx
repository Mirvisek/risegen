"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown, Facebook, Instagram, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { motion } from "framer-motion";
import { SearchModal } from "./SearchModal";

interface NavbarProps {
    config?: {
        facebookUrl?: string | null;
        instagramUrl?: string | null;
        tiktokUrl?: string | null;
        discordUrl?: string | null;
        siteName?: string | null;
        logoUrl?: string | null;
        aboutUsSublinks?: string | null;
        showEvents?: boolean;
    } | null;
}

export function Navbar({ config }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
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
        {
            name: "Działania",
            href: "/projekty",
            children: [
                ...(config?.showEvents !== false ? [{ name: "Wydarzenia", href: "/wydarzenia" }] : []),
                { name: "Projekty", href: "/projekty" },
                { name: "Zgłoszenia", href: "/zgloszenia" },
            ]
        },
        { name: "Kontakt", href: "/kontakt" },
        { name: "Wesprzyj Nas", href: "/wesprzyj-nas" },
    ];

    if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null;

    return (
        <nav className="bg-white dark:bg-gray-950 shadow dark:border-b dark:border-gray-800 relative z-50 transition-colors duration-300">
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
                                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">
                                        {config?.siteName || "RiseGen"}
                                    </span>
                                )}
                            </Link>
                        </div>
                        <div className="hidden xl:ml-6 xl:flex xl:space-x-8">
                            {staticNavigation.map((item) => {
                                const isActive = pathname === item.href || (item.children && item.children.some(child => pathname === child.href));

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
                                                className={cn(
                                                    "relative inline-flex items-center px-1 pt-1 text-sm font-bold transition-colors h-full focus:outline-none",
                                                    isActive
                                                        ? "text-gray-900 dark:text-white"
                                                        : "text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                                )}
                                            >
                                                {item.name}
                                                <ChevronDown className="ml-1 h-4 w-4" />
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="navbar-indicator"
                                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                                                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                                    />
                                                )}
                                            </Link>

                                            {hoveredItem === item.name && (
                                                <div className="absolute left-0 top-full -mt-1 w-64 bg-white dark:bg-gray-900 shadow-2xl rounded-b-2xl z-50 animate-in fade-in slide-in-from-top-3 duration-300 border border-gray-100 dark:border-gray-800">
                                                    <div className="py-2">
                                                        {item.children.map((child) => (
                                                            <Link
                                                                key={child.href}
                                                                href={child.href}
                                                                className={cn(
                                                                    "block px-4 py-3 text-sm font-medium transition-colors",
                                                                    pathname === child.href
                                                                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold"
                                                                        : "text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400"
                                                                )}
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
                                            "relative inline-flex items-center px-1 pt-1 text-sm font-bold transition-colors h-full",
                                            isActive
                                                ? "text-gray-900 dark:text-white"
                                                : "text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
                                        )}
                                    >
                                        {item.name}
                                        {isActive && (
                                            <motion.div
                                                layoutId="navbar-indicator"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="hidden xl:flex xl:items-center xl:gap-4 xl:ml-2">
                            {/* ... social icons ... */}
                            {config?.facebookUrl && (
                                <Link href={config.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition transform hover:scale-110">
                                    <Facebook className="h-5 w-5" />
                                </Link>
                            )}
                            {config?.instagramUrl && (
                                <Link href={config.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition transform hover:scale-110">
                                    <Instagram className="h-5 w-5" />
                                </Link>
                            )}
                            {config?.tiktokUrl && (
                                <Link href={config.tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black dark:hover:text-white transition transform hover:scale-110">
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                    </svg>
                                </Link>
                            )}
                            {config?.discordUrl && (
                                <Link href={config.discordUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition transform hover:scale-110">
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                    </svg>
                                </Link>
                            )}
                            <div className="border-l pl-4 border-gray-200 dark:border-gray-700 h-6 flex items-center ml-2 gap-3">
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                                    aria-label="Szukaj"
                                >
                                    <Search className="h-5 w-5" />
                                </button>
                                <ThemeToggle />
                            </div>
                        </div>
                        <SearchModal open={isSearchOpen} setOpen={setIsSearchOpen} />

                        <div className="-mr-2 flex items-center gap-2 xl:hidden">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            >
                                <Search className="h-6 w-6" />
                            </button>
                            <ThemeToggle />
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
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

            <div className={cn("xl:hidden bg-white dark:bg-gray-950 border-t dark:border-gray-800 transition-all duration-300", isOpen ? "max-h-[100vh] opacity-100 pb-6 pt-2" : "max-h-0 opacity-0 overflow-hidden")}>
                <div className="space-y-1 px-4">
                    {staticNavigation.map((item) => {
                        if (item.children) {
                            return (
                                <div key={item.name} className="py-2">
                                    <button
                                        onClick={() => setHoveredItem(hoveredItem === item.name ? null : item.name)}
                                        className={cn(
                                            "w-full flex justify-between items-center py-2 text-lg font-bold transition-colors",
                                            (pathname === item.href || item.children.some(child => pathname === child.href))
                                                ? "text-indigo-600 dark:text-indigo-400"
                                                : "text-gray-900 dark:text-gray-100"
                                        )}
                                    >
                                        {item.name}
                                        <ChevronDown className={cn("h-5 w-5 transition-transform", hoveredItem === item.name ? "rotate-180" : "")} />
                                    </button>
                                    <div className={cn("mt-2 pl-4 space-y-2 border-l-2 border-indigo-100 dark:border-gray-800", hoveredItem === item.name ? "block" : "hidden")}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "block py-2 text-base font-bold transition-colors",
                                                pathname === item.href ? "text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                                            )}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.name} - Główna
                                        </Link>
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                className={cn(
                                                    "block py-2 text-base font-medium transition-colors",
                                                    pathname === child.href ? "text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                                                )}
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
                                    pathname === item.href ? "text-indigo-600 dark:text-indigo-400" : "text-gray-900 dark:text-gray-100"
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
