"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Users,
    LogOut,
    Settings,
    History,
    Palette,
    Newspaper,
    Handshake,
    FileUser,
    Mail,
    Calendar,
    HelpCircle,
    Award
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { AdminSessionTimer } from "./AdminSessionTimer";

const navigation = [
    { name: "Pulpit", href: "/admin/dashboard", icon: LayoutDashboard, roles: ["SUPERADMIN", "ADMIN", "EDITOR"] },
    { name: "Projekty", href: "/admin/projekty", icon: FileText, roles: ["SUPERADMIN", "ADMIN", "EDITOR"] },
    { name: "Aktualności", href: "/admin/aktualnosci", icon: Newspaper, roles: ["SUPERADMIN", "ADMIN", "EDITOR"] },
    { name: "Wydarzenia", href: "/admin/wydarzenia", icon: Calendar, roles: ["SUPERADMIN", "ADMIN", "EDITOR"] },
    { name: "FAQ", href: "/admin/faq", icon: HelpCircle, roles: ["SUPERADMIN", "ADMIN", "EDITOR"] },
    { name: "Sukcesy", href: "/admin/stats", icon: Award, roles: ["SUPERADMIN", "ADMIN", "EDITOR"] },
    { name: "Wiadomości", href: "/admin/wiadomosci", icon: Mail, roles: ["SUPERADMIN", "ADMIN"] },
    { name: "Zgłoszenia", href: "/admin/zgloszenia", icon: Users, roles: ["SUPERADMIN", "ADMIN", "REKRUTER"] },
    { name: "Ustawienia", href: "/admin/wyglad", icon: Palette, roles: ["SUPERADMIN"] },
    { name: "Zmiany", href: "/admin/changes", icon: History, roles: ["SUPERADMIN", "ADMIN"] },
    { name: "Użytkownicy", href: "/admin/users", icon: Settings, roles: ["SUPERADMIN"] },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const userRoles = session?.user?.roles || [];

    return (
        <div className="flex h-screen flex-col justify-between border-r bg-gray-900 text-white w-64 fixed left-0 top-0 overflow-y-auto">
            <div className="px-4 py-6">
                <span className="grid h-10 w-32 place-content-center rounded-lg bg-gray-800 text-xs text-gray-400 font-bold tracking-widest uppercase">
                    RiseGen Admin
                </span>

                <ul className="mt-6 space-y-1">
                    {navigation.map((item) => {
                        // Check if user has AT LEAST one of the required roles
                        const hasAccess = item.roles.some(r => userRoles.includes(r));
                        if (!hasAccess) return null;

                        const isActive = pathname.startsWith(item.href);
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "block rounded-lg px-4 py-3 text-sm font-medium flex items-center gap-3 transition-colors",
                                        isActive
                                            ? "bg-indigo-600 text-white"
                                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="sticky inset-x-0 bottom-0 border-t border-gray-800">
                <AdminSessionTimer />
                {session?.user && (
                    <Link href="/admin/profile" className="flex items-center gap-3 bg-gray-900 p-4 border-b border-gray-800 hover:bg-gray-800 transition-colors group">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate group-hover:text-indigo-400 transition-colors">
                                {session.user.name || "Użytkownik"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {session.user.email}
                            </p>
                        </div>
                        <Settings className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors" />
                    </Link>
                )}
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-2 bg-gray-900 p-4 hover:bg-gray-800 w-full text-left transition-colors text-gray-400 hover:text-white"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="text-sm font-medium"> Wyloguj się </span>
                </button>
            </div>
        </div>
    );
}
