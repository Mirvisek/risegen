import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { LimitSelector } from "@/components/LimitSelector";
import { NewsList } from "@/components/NewsList";

export const metadata = {
    title: "Aktualności - RiseGen",
};

export default async function NewsPage(props: { searchParams: Promise<{ page?: string; limit?: string }> }) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page) || 1;
    const take = Number(searchParams.limit) || 10;
    const skip = (page - 1) * take;

    const [news, total] = await Promise.all([
        prisma.news.findMany({
            orderBy: { createdAt: "desc" },
            take,
            skip,
        }),
        prisma.news.count(),
    ]);

    const totalPages = Math.ceil(total / take);

    return (
        <div className="container mx-auto px-4 py-16 max-w-6xl space-y-12">
            <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-5 duration-700">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Aktualności</h1>
                <div className="w-20 h-1 bg-indigo-600 dark:bg-indigo-500 mx-auto rounded-full"></div>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Bądź na bieżąco z życiem naszego stowarzyszenia.
                </p>
            </div>

            <div className="flex justify-end animate-in fade-in slide-in-from-right-5 duration-700">
                <LimitSelector currentLimit={take} />
            </div>

            {news.length > 0 ? (
                <>
                    <NewsList news={news} />

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-4 mt-12">
                            {page > 1 && (
                                <Link
                                    href={`/aktualnosci?page=${page - 1}&limit=${take}`}
                                    className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium transition"
                                >
                                    Poprzednia
                                </Link>
                            )}
                            <span className="px-4 py-2 text-gray-500 dark:text-gray-400 flex items-center">
                                Strona {page} z {totalPages}
                            </span>
                            {page < totalPages && (
                                <Link
                                    href={`/aktualnosci?page=${page + 1}&limit=${take}`}
                                    className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium transition"
                                >
                                    Następna
                                </Link>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-24 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800">
                    <p className="text-lg text-gray-500 dark:text-gray-400">Brak aktualności do wyświetlenia.</p>
                </div>
            )}
        </div>
    );
}
