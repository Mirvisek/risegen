"use client";

import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { Menu } from "lucide-react";

export function AdminShell({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen relative transition-colors duration-300">
            {/* Mobile Header */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-gray-900 flex items-center justify-between px-4 md:hidden z-50 shadow-md">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-gray-300 hover:text-white transition-colors p-1"
                        aria-label="Otwórz menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="text-white font-bold tracking-wide">RiseGen Admin</span>
                </div>
            </div>

            {/* Sidebar Container */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
                md:relative md:translate-x-0 md:inset-auto md:block
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                bg-gray-900 h-screen
            `}>
                <AdminSidebar onClose={() => setSidebarOpen(false)} />
            </aside>

            {/* Backdrop for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen w-full pt-16 md:pt-0 scroll-smooth">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
