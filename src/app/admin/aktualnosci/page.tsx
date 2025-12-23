import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Edit, Star } from "lucide-react";
import { DeleteNewsButton } from "@/components/admin/DeleteNewsButton";
import { SearchInput } from "@/components/admin/SearchInput";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminNewsPage(props: { searchParams: Promise<{ q?: string }> }) {
    const session = await getServerSession(authOptions);
    // News: SUPERADMIN, ADMIN, REDAKTOR
    if (!session || (!session.user.roles.includes("SUPERADMIN") && !session.user.roles.includes("ADMIN") && !session.user.roles.includes("REDAKTOR"))) {
        redirect("/admin/dashboard");
    }
    const searchParams = await props.searchParams;
    const query = searchParams?.q || "";

    const news = await prisma.news.findMany({
        where: {
            title: {
                contains: query,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Aktualności</h1>
                <SearchInput placeholder="Szukaj aktualności..." />
                <Link
                    href="/admin/aktualnosci/new"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition shrink-0"
                >
                    <Plus className="h-4 w-4" />
                    Nowa Aktualność
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">
                                #
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Tytuł
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
                                Wyróżniony
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Data
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Akcje
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        {news.map((item, index) => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {news.length - index}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    {item.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    {item.isHighlight && <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mx-auto" />}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(item.createdAt).toLocaleDateString("pl-PL")}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                                    <Link
                                        href={`/admin/aktualnosci/${item.id}`}
                                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 p-1"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                    <DeleteNewsButton id={item.id} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {news.length === 0 && (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        Brak aktualności. Dodaj pierwszą!
                    </div>
                )}
            </div>
        </div>
    );
}
