"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface NewsItem {
    id: string;
    title: string;
    slug: string;
    content: string;
    images: string;
    createdAt: Date;
}

export function NewsList({ news }: { news: NewsItem[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item, i) => {
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
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col h-full overflow-hidden group">
                            <div className="h-48 bg-gray-100 dark:bg-gray-800 w-full relative overflow-hidden">
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50">
                                        Brak zdjęcia
                                    </div>
                                )}
                            </div>
                            <div className="p-6 flex-grow flex flex-col">
                                <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-3">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(item.createdAt).toLocaleDateString("pl-PL")}
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                                    {item.title}
                                </h2>
                                <div className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 flex-grow prose prose-sm max-w-none dark:prose-invert">
                                    {/* Strip HTML tags for preview */}
                                    {item.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                                </div>
                                <Link
                                    href={`/aktualnosci/${item.slug}`}
                                    className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300 mt-auto inline-flex items-center"
                                >
                                    Czytaj dalej <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
