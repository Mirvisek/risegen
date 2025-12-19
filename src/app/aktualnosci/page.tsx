import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";

export const metadata = {
    title: "Aktualności - RiseGen",
};

export default async function NewsPage(props: { searchParams: Promise<{ page?: string }> }) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page) || 1;
    const take = 9;
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
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-gray-900">Aktualności</h1>
                <div className="w-20 h-1 bg-indigo-600 mx-auto rounded-full"></div>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Bądź na bieżąco z życiem naszego stowarzyszenia.
                </p>
            </div>

            {news.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {news.map((item) => {
                            let imageUrl = null;
                            try {
                                const images = JSON.parse(item.images);
                                if (Array.isArray(images) && images.length > 0) {
                                    imageUrl = images[0];
                                }
                            } catch (e) {
                                // ignore json parse error
                            }

                            return (
                                <div key={item.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition border border-gray-100 flex flex-col h-full overflow-hidden group">
                                    <div className="h-48 bg-gray-100 w-full relative overflow-hidden">
                                        {imageUrl ? (
                                            <Image
                                                src={imageUrl}
                                                alt={item.title}
                                                fill
                                                className="object-cover transition duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">Brak zdjęcia</div>
                                        )}
                                    </div>
                                    <div className="p-6 flex-grow flex flex-col">
                                        <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold mb-3">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(item.createdAt).toLocaleDateString("pl-PL")}
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition">{item.title}</h2>
                                        <div className="text-gray-600 line-clamp-3 mb-4 flex-grow prose prose-sm max-w-none">
                                            {/* Strip HTML tags for preview */}
                                            {item.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                                        </div>
                                        <Link href={`/aktualnosci/${item.slug}`} className="text-indigo-600 font-medium hover:text-indigo-800 mt-auto inline-flex items-center">
                                            Czytaj dalej <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-4 mt-12">
                            {page > 1 && (
                                <Link
                                    href={`/aktualnosci?page=${page - 1}`}
                                    className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition"
                                >
                                    Poprzednia
                                </Link>
                            )}
                            <span className="px-4 py-2 text-gray-500 flex items-center">
                                Strona {page} z {totalPages}
                            </span>
                            {page < totalPages && (
                                <Link
                                    href={`/aktualnosci?page=${page + 1}`}
                                    className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition"
                                >
                                    Następna
                                </Link>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                    <p className="text-lg text-gray-500">Brak aktualności do wyświetlenia.</p>
                </div>
            )}
        </div>
    );
}
