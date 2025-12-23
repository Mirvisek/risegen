"use client";

import { useState } from "react";
import { FileText, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Document = {
    id: string;
    title: string;
    description: string | null;
    fileUrl: string;
    category: string;
    order: number;
    createdAt: Date;
};

const CATEGORIES = [
    { id: "ALL", label: "Wszystkie" },
    { id: "BASIC", label: "Podstawowe dokumenty" },
    { id: "REPORT", label: "Sprawozdania" },
    { id: "RESOLUTION", label: "Uchwały Zarządu" },
    { id: "OTHER", label: "Inne dokumenty" },
];

export function DocumentList({ initialDocuments }: { initialDocuments: Document[] }) {
    const [filter, setFilter] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const filteredDocuments = initialDocuments.filter((doc) => {
        if (filter === "ALL") return true;
        return doc.category === filter;
    });

    const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
    const paginatedDocuments = filteredDocuments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleFilterChange = (newFilter: string) => {
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
                {/* Filter Tabs */}
                <div className="flex justify-center flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleFilterChange(cat.id)}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium transition-colors relative outline-none",
                                filter === cat.id
                                    ? "text-white shadow-md"
                                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                            )}
                        >
                            {filter === cat.id && (
                                <motion.span
                                    layoutId="document-filter-pill"
                                    className="absolute inset-0 bg-indigo-600 rounded-full -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{cat.label}</span>
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

            {/* Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedDocuments.map((doc, i) => (
                    <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="relative group bg-white dark:bg-gray-800 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
                    >
                        <div>
                            <span className="rounded-lg inline-flex p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 ring-4 ring-white dark:ring-gray-800 transition-colors">
                                <FileText className="h-6 w-6" aria-hidden="true" />
                            </span>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="focus:outline-none">
                                    <span className="absolute inset-0" aria-hidden="true" />
                                    {doc.title}
                                </a>
                            </h3>
                            {doc.description && (
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                                    {doc.description}
                                </p>
                            )}
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Kliknij, aby otworzyć dokument PDF w nowym oknie.
                            </p>

                            <div className="mt-3">
                                <span className="inline-flex items-center rounded-md bg-gray-50 dark:bg-gray-700 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 ring-1 ring-inset ring-gray-500/10 dark:ring-gray-500/20">
                                    {CATEGORIES.find(c => c.id === doc.category)?.label || 'Inne'}
                                </span>
                            </div>
                        </div>
                        <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-indigo-400" aria-hidden="true">
                            <Eye className="h-6 w-6" />
                        </span>

                        <div className="mt-4 flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                            <span className="hover:underline">Czytaj więcej</span>
                        </div>
                    </motion.div>
                ))}

                {filteredDocuments.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 transition-colors">
                        <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Brak dokumentów</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Nie znaleziono dokumentów w tej kategorii.</p>
                    </div>
                )}
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
        </div>
    );
}
