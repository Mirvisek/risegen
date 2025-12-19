"use client";

import { useState } from "react";
import { FileText, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

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

    const filteredDocuments = initialDocuments.filter((doc) => {
        if (filter === "ALL") return true;
        return doc.category === filter;
    });

    return (
        <div className="space-y-8">
            {/* Filter Tabs */}
            <div className="flex justify-center flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setFilter(cat.id)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all",
                            filter === cat.id
                                ? "bg-indigo-600 text-white shadow-md"
                                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                        )}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDocuments.map((doc) => (
                    <div key={doc.id} className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow animate-in fade-in zoom-in duration-300">
                        <div>
                            <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                                <FileText className="h-6 w-6" aria-hidden="true" />
                            </span>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-lg font-medium">
                                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="focus:outline-none">
                                    <span className="absolute inset-0" aria-hidden="true" />
                                    {doc.title}
                                </a>
                            </h3>
                            {doc.description && (
                                <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                                    {doc.description}
                                </p>
                            )}
                            <p className="mt-2 text-sm text-gray-500">
                                Kliknij, aby otworzyć dokument PDF w nowym oknie.
                            </p>

                            <div className="mt-3">
                                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                    {CATEGORIES.find(c => c.id === doc.category)?.label || 'Inne'}
                                </span>
                            </div>
                        </div>
                        <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-indigo-400" aria-hidden="true">
                            <Eye className="h-6 w-6" />
                        </span>

                        <div className="mt-4 flex items-center text-indigo-600 text-sm font-medium">
                            <span className="hover:underline">Czytaj więcej</span>
                        </div>
                    </div>
                ))}

                {filteredDocuments.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">Brak dokumentów</h3>
                        <p className="mt-1 text-sm text-gray-500">Nie znaleziono dokumentów w tej kategorii.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
