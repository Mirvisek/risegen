"use client";

import { useState, useMemo } from "react";
import { Search, X, Filter } from "lucide-react";

type Project = {
    id: string;
    title: string;
    description: string;
    slug: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    isHighlight: boolean;
};

interface SearchAndFilterProps {
    projects: Project[];
    onFilteredResults: (filtered: Project[]) => void;
}

export function SearchAndFilter({ projects, onFilteredResults }: SearchAndFilterProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "CURRENT" | "COMPLETED">("ALL");
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");
    const [showFilters, setShowFilters] = useState(false);

    const filteredAndSortedProjects = useMemo(() => {
        let filtered = projects;

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (project) =>
                    project.title.toLowerCase().includes(term) ||
                    project.description.toLowerCase().includes(term)
            );
        }

        // Status filter
        if (statusFilter !== "ALL") {
            filtered = filtered.filter((project) => project.status === statusFilter);
        }

        // Sort
        filtered = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case "oldest":
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case "title":
                    return a.title.localeCompare(b.title, "pl");
                default:
                    return 0;
            }
        });

        return filtered;
    }, [projects, searchTerm, statusFilter, sortBy]);

    // Update parent component with filtered results
    useMemo(() => {
        onFilteredResults(filteredAndSortedProjects);
    }, [filteredAndSortedProjects, onFilteredResults]);

    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("ALL");
        setSortBy("newest");
    };

    const hasActiveFilters = searchTerm || statusFilter !== "ALL" || sortBy !== "newest";

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-3 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Szukaj projektów..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition ${hasActiveFilters
                        ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                        : "border-gray-300 hover:bg-gray-50"
                        }`}
                >
                    <Filter className="h-5 w-5" />
                    Filtry
                </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-200 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                            >
                                <option value="ALL">Wszystkie</option>
                                <option value="CURRENT">Aktualne</option>
                                <option value="COMPLETED">Zrealizowane</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sortuj według
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                            >
                                <option value="newest">Najnowsze</option>
                                <option value="oldest">Najstarsze</option>
                                <option value="title">Alfabetycznie</option>
                            </select>
                        </div>

                        {/* Clear Button */}
                        <div className="flex items-end">
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Wyczyść filtry
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                    Znaleziono <strong>{filteredAndSortedProjects.length}</strong> z {projects.length} projektów
                </span>
            </div>
        </div>
    );
}
