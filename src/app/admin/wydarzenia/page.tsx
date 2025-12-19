import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

export default async function AdminEventsPage() {
    const events = await prisma.event.findMany({
        orderBy: { date: 'desc' }
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Wydarzenia</h1>
                <Link
                    href="/admin/wydarzenia/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    <Plus className="h-4 w-4" />
                    Nowe Wydarzenie
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-900 shadow rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tytuł</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lokalizacja</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Opcje</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {events.map((event) => (
                            <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    {event.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {format(new Date(event.date), "dd MMMM yyyy", { locale: pl })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {event.location || "---"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                    <Link href={`/admin/wydarzenia/${event.id}`} className="hover:underline">Edytuj</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
