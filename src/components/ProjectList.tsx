"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

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

    const filteredProjects = projects.filter(p => {
        if (filter === "ALL") return true;
        const status = p.status || "CURRENT"; // Default legacy to CURRENT
        return status === filter;
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-center">
                <div className="inline-flex bg-gray-100 p-1 rounded-full relative">
                    {/* Animated background could be added here but simple conditional styling is easier */}
                    <button
                        onClick={() => setFilter("ALL")}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${filter === "ALL"
                            ? "bg-white text-indigo-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-900"
                            }`}
                    >
                        Wszystkie
                    </button>
                    <button
                        onClick={() => setFilter("CURRENT")}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${filter === "CURRENT"
                            ? "bg-white text-indigo-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-900"
                            }`}
                    >
                        Aktualne
                    </button>
                    <button
                        onClick={() => setFilter("COMPLETED")}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${filter === "COMPLETED"
                            ? "bg-white text-indigo-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-900"
                            }`}
                    >
                        Zrealizowane
                    </button>
                </div>
            </div>

            {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                    {filteredProjects.map((project) => {
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
                            <div key={project.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition border border-gray-100 flex flex-col h-full overflow-hidden">
                                <div className="h-48 bg-gray-100 w-full relative">
                                    {imageUrl ? (
                                        <Image
                                            src={imageUrl}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">Brak zdjęcia</div>
                                    )}
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h2>
                                    <p className="text-gray-600 line-clamp-3 mb-4 flex-grow text-sm">
                                        {project.description || (project.content ? project.content.replace(/<[^>]*>?/gm, '').substring(0, 120) + "..." : "")}
                                    </p>
                                    <Link href={`/projekty/${project.slug}`} className="text-indigo-600 font-medium hover:text-indigo-800 mt-auto inline-flex items-center text-sm">
                                        Czytaj więcej <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                    <p className="text-lg text-gray-500">
                        {filter === "ALL" ? "Brak projektów." : (filter === "CURRENT" ? "Brak aktualnych projektów." : "Brak zrealizowanych projektów.")}
                    </p>
                </div>
            )}
        </div>
    );
}
