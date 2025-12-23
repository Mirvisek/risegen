"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectGalleryProps {
    images: string[];
    title: string;
}

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-64 md:h-96 w-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                Brak zdjęć
            </div>
        );
    }

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="space-y-4">
            {/* Main Image Stage */}
            <div
                className="relative h-64 md:h-[500px] w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 cursor-zoom-in group"
                onClick={() => setIsLightboxOpen(true)}
            >
                <Image
                    src={images[selectedIndex]}
                    alt={`${title} - zdjęcie ${selectedIndex + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    priority
                />

                {/* Overlay Hint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <ZoomIn className="text-white w-10 h-10 drop-shadow-md" />
                </div>

                {/* Arrows on Main Image (if more than 1) */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 p-2 rounded-full hover:bg-white dark:hover:bg-gray-900 transition opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-800 dark:text-gray-200" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 p-2 rounded-full hover:bg-white dark:hover:bg-gray-900 transition opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-800 dark:text-gray-200" />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedIndex(idx)}
                            className={cn(
                                "relative h-20 w-32 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                                selectedIndex === idx ? "border-indigo-600 dark:border-indigo-400 ring-2 ring-indigo-100 dark:ring-indigo-900/30" : "border-transparent opacity-70 hover:opacity-100"
                            )}
                        >
                            <Image src={img} alt={`Miniatura ${idx}`} fill className="object-cover" />
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox Modal */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
                    {/* Close Button */}
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-[70]"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    {/* Navigation Buttons for Lightbox */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-4 z-[70]"
                            >
                                <ChevronLeft className="w-10 h-10" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-4 z-[70]"
                            >
                                <ChevronRight className="w-10 h-10" />
                            </button>
                        </>
                    )}

                    {/* Image Container */}
                    <div className="relative w-full h-full max-w-7xl max-h-[90vh] p-4 flex items-center justify-center">
                        <div className="relative w-full h-full">
                            <Image
                                src={images[selectedIndex]}
                                alt={`${title} - pełny ekran`}
                                fill
                                className="object-contain"
                                quality={100}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
