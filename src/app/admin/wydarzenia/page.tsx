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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Wydarzenia ({events.length})</h1>
                <Link
                    href="/admin/wydarzenia/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    <Plus className="h-4 w-4" />
                    Nowe Wydarzenie
                </Link>
            </div>

            <div className="overflow-hidden bg-white dark:bg-gray-900 shadow sm:rounded-lg border border-gray-200 dark:border-gray-800 transition-colors">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Tytuł</th>
                            <th scope="col" className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Data</th>
                            <th scope="col" className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Lokalizacja</th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                <span className="sr-only">Opcje</span>
                                Opcje
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                        {events.map((event) => (
                            <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    {event.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {format(new Date(event.date), "dd MMMM yyyy", { locale: pl })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {event.location || "---"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link href={`/admin/wydarzenia/${event.id}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors">
                                        Edytuj
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
