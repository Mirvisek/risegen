"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Project = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    content: string;
    images: string;
    documents: string;
    isHighlight: boolean;
    status: string; // "CURRENT" | "COMPLETED"
    createdAt: Date;
    updatedAt: Date;
};

export function ProjectList({ projects }: { projects: Project[] }) {
    const [filter, setFilter] = useState<"ALL" | "CURRENT" | "COMPLETED">("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const filteredProjects = projects.filter(p => {
        if (filter === "ALL") return true;
        const status = p.status || "CURRENT"; // Default legacy to CURRENT
        return status === filter;
    });

    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const paginatedProjects = filteredProjects.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleFilterChange = (newFilter: "ALL" | "CURRENT" | "COMPLETED") => {
        setFilter(newFilter);
        setCurrentPage(1);
    };

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="inline-flex bg-gray-100 dark:bg-gray-800 p-1 rounded-full relative transition-colors gap-1">
                    {[
                        { id: "ALL", label: "Wszystkie" },
                        { id: "CURRENT", label: "Aktualne" },
                        { id: "COMPLETED", label: "Zrealizowane" }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleFilterChange(tab.id as any)}
                            className={cn(
                                "px-6 py-2 rounded-full text-sm font-medium transition-colors relative outline-none",
                                filter === tab.id
                                    ? "text-indigo-600 dark:text-indigo-400 shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                            )}
                        >
                            {filter === tab.id && (
                                <motion.span
                                    layoutId="project-filter-pill"
                                    className="absolute inset-0 bg-white dark:bg-gray-700 rounded-full shadow-sm -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>Pokaż na stronie:</span>
                    <select
                        value={itemsPerPage}
                        onChange={handleLimitChange}
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900 dark:text-gray-100"
                        suppressHydrationWarning
                    >
                        {[5, 10, 15, 20, 25].map((val) => (
                            <option key={val} value={val}>
                                {val}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {paginatedProjects.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {paginatedProjects.map((project, i) => {
                            let imageUrl = null;
                            try {
                                const images = JSON.parse(project.images);
                                if (Array.isArray(images) && images.length > 0) {
                                    imageUrl = images[0];
                                }
                            } catch (e) {
                                // ignore
                            }

                            return (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col h-full overflow-hidden">
                                        <div className="h-48 bg-gray-100 dark:bg-gray-800 w-full relative">
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={project.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">Brak zdjęcia</div>
                                            )}
                                        </div>
                                        <div className="p-6 flex-grow flex flex-col">
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h2>
                                            <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 flex-grow text-sm">
                                                {project.description || (project.content ? project.content.replace(/<[^>]*>?/gm, '').substring(0, 120) + "..." : "")}
                                            </p>
                                            <Link href={`/projekty/${project.slug}`} className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300 mt-auto inline-flex items-center text-sm">
                                                Czytaj więcej <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-4 mt-12">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className={`px-6 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 font-medium transition
                                    ${currentPage === 1
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                            >
                                Poprzednia
                            </button>
                            <span className="px-4 py-2 text-gray-500 dark:text-gray-400 flex items-center">
                                Strona {currentPage} z {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className={`px-6 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 font-medium transition
                                    ${currentPage === totalPages
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                            >
                                Następna
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-24 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                        {filter === "ALL" ? "Brak projektów." : (filter === "CURRENT" ? "Brak aktualnych projektów." : "Brak zrealizowanych projektów.")}
                    </p>
                </div>
            )}
        </div>
    );
}
