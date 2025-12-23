import { prisma } from "@/lib/prisma";
import { Mail, Calendar, Trash2 } from "lucide-react";
import { deleteMessage } from "./actions";
import { DeleteMessageButton } from "@/components/admin/DeleteMessageButton";
import { MessageStatusSelect } from "@/components/admin/MessageStatusSelect";
import { SearchInput } from "@/components/admin/SearchInput";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata = {
    title: "Wiadomości - Panel Admina",
};

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MessagesPage(props: { searchParams: Promise<{ q?: string; status?: string }> }) {
    const session = await getServerSession(authOptions);
    // Messages: SUPERADMIN, ADMIN
    if (!session || (!session.user.roles.includes("SUPERADMIN") && !session.user.roles.includes("ADMIN"))) {
        redirect("/admin/dashboard");
    }
    const searchParams = await props.searchParams;
    const query = searchParams?.q || "";
    const statusFilter = searchParams?.status;

    const where: any = {};

    // Status Filter
    if (statusFilter) {
        where.status = statusFilter;
    }

    // Search Query (Number, Name, Email, Subject)
    if (query) {
        const num = parseInt(query);
        if (!isNaN(num)) {
            where.OR = [
                { number: num },
                { subject: { contains: query } },
                { name: { contains: query } },
                { email: { contains: query } }
            ];
        } else {
            where.OR = [
                { subject: { contains: query } },
                { name: { contains: query } },
                { email: { contains: query } }
            ];
        }
    }

    const messages = await prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });

    // Helper map for filters UI - could be extracted constants
    const FILTERS = [
        { label: "Wszystkie", value: undefined },
        { label: "Nowe", value: "NEW" },
        { label: "Przeczytane", value: "READ" },
        { label: "W trakcie", value: "IN_PROGRESS" },
        { label: "Zakończone", value: "DONE" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Wiadomości Kontaktowe</h1>

                {/* Search Bar - reusing the generic SearchInput component */}
                <SearchInput placeholder="Szukaj (nr, email, treść)..." />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 pb-2">
                {FILTERS.map((filter) => {
                    const isActive = statusFilter === filter.value;
                    return (
                        <Link
                            key={filter.label}
                            href={filter.value ? `?status=${filter.value}` : "/admin/wiadomosci"}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                                isActive
                                    ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                            )}
                        >
                            {filter.label}
                        </Link>
                    );
                })}
            </div>

            <div className="bg-white dark:bg-gray-900 shadow rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                {messages.length > 0 ? (
                    <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                        {messages.map((msg) => (
                            <li key={msg.id} className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition ${msg.status === "NEW" ? "bg-indigo-50/30 dark:bg-indigo-900/10" : "bg-white dark:bg-gray-900"}`}>
                                <div className="flex flex-col md:flex-row gap-4 justify-between">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-mono font-bold text-gray-400 dark:text-gray-500">#{msg.number}</span>
                                            <MessageStatusSelect id={msg.id} currentStatus={msg.status} />
                                            <h3 className="font-semibold text-gray-900 dark:text-white ml-2">{msg.subject || "(Bez tematu)"}</h3>
                                        </div>

                                        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
                                            {msg.name} &lt;{msg.email}&gt;
                                        </div>

                                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed max-w-3xl border-l-2 border-indigo-100 dark:border-indigo-900/50 pl-3 py-1">
                                            {msg.message}
                                        </p>

                                        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 pt-2">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(msg.createdAt).toLocaleString("pl-PL", {
                                                day: "2-digit", month: "long", year: "numeric",
                                                hour: "2-digit", minute: "2-digit"
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex md:flex-col gap-2 shrink-0 self-start md:self-center">
                                        <DeleteMessageButton id={msg.id} />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
                        <Mail className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                        <p className="text-lg font-medium">Skrzynka jest pusta</p>
                        <p className="text-sm">Brak wiadomości spełniających kryteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
