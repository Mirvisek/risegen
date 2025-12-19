"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
    id: string;
    image: string;
    title: string | null;
    subtitle: string | null;
    link: string | null;
    author: string | null;
    alignment?: string; // Optional for backward compatibility in types, but DB has default
};

export function HomeHeroCarousel({ slides, config }: { slides: Slide[]; config?: any }) {
    const [current, setCurrent] = useState(0);
    const sliderEnabled = config?.enableHeroSlider ?? true;

    // Auto-advance
    useEffect(() => {
        if (!sliderEnabled || slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000); // 5 seconds
        return () => clearInterval(timer);
    }, [slides.length, sliderEnabled]);

    const next = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    // Static Mode
    if (!sliderEnabled) {
        return (
            <div className="relative h-[500px] w-full bg-white overflow-hidden flex items-center justify-center">
                {config?.staticHeroImage && (
                    <Image
                        src={config.staticHeroImage}
                        alt={config.staticHeroTitle || "Hero"}
                        fill
                        className={`object-cover ${config.staticHeroAlignment === "top" ? "object-top" : config.staticHeroAlignment === "bottom" ? "object-bottom" : "object-center"}`}
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-black/40 z-0" />

                <div className="relative z-10 text-center space-y-6 px-4 max-w-4xl mx-auto flex flex-col items-center justify-center h-full">
                    {config?.staticHeroTitle && (
                        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-lg">
                            {config.staticHeroTitle}
                        </h1>
                    )}
                    {config?.staticHeroSubtitle && (
                        <p className="text-lg md:text-2xl font-light text-gray-100 max-w-2xl mx-auto drop-shadow-md whitespace-pre-wrap">
                            {config.staticHeroSubtitle}
                        </p>
                    )}
                    <Link
                        href="/zgloszenia"
                        className="mt-8 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Dołącz do Nas
                    </Link>
                </div>
                {config?.staticHeroAuthor && (
                    <div className="absolute bottom-4 right-4 text-xs text-white/60 bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
                        fot. {config.staticHeroAuthor}
                    </div>
                )}
            </div>
        );
    }

    if (!slides || slides.length === 0) {
        return null;
    }

    return (
        <div className="relative h-[500px] w-full bg-white overflow-hidden group">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    <div className="w-full h-full relative">
                        <Image
                            src={slide.image}
                            alt={slide.title || "Slide"}
                            fill
                            className={`object-cover ${slide.alignment === "top" ? "object-top" : slide.alignment === "bottom" ? "object-bottom" : "object-center"}`}
                            priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-black/30" />

                        {/* Content Overlay - Centered */}
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                            <div className="max-w-4xl animate-in fade-in zoom-in duration-700 space-y-6 flex flex-col items-center">
                                {(slide.title || slide.subtitle) && (
                                    <>
                                        {slide.title && (
                                            <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
                                                {slide.title}
                                            </h2>
                                        )}
                                        {slide.subtitle && (
                                            <p className="text-lg md:text-2xl text-gray-100 drop-shadow-md max-w-2xl mx-auto">
                                                {slide.subtitle}
                                            </p>
                                        )}
                                    </>
                                )}
                                <Link
                                    href="/zgloszenia"
                                    className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    Dołącz do Nas
                                </Link>
                            </div>
                        </div>
                        {slide.author && (
                            <div className="absolute bottom-12 right-4 z-20 text-xs text-white/60 bg-black/20 px-2 py-1 rounded backdrop-blur-sm md:bottom-4">
                                fot. {slide.author}
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.preventDefault(); prev(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Previous Slide"
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); next(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Next Slide"
                    >
                        <ChevronRight className="h-8 w-8" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => { e.preventDefault(); setCurrent(idx); }}
                                className={`w-3 h-3 rounded-full transition-colors box-content border-2 border-transparent ${idx === current ? "bg-white" : "bg-white/50 hover:bg-white/80"
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
