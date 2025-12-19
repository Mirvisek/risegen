"use client";

import { useState, useEffect } from "react";
import { Accessibility, Type, Sun, Moon, Link as LinkIcon, X, Eye } from "lucide-react";

export function WcagWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");
    const [highContrast, setHighContrast] = useState(false);
    const [underlineLinks, setUnderlineLinks] = useState(false);

    // Load state from localStorage on mount
    useEffect(() => {
        const savedFontSize = localStorage.getItem("wcag-fontsize") as any;
        const savedContrast = localStorage.getItem("wcag-contrast") === "true";
        const savedLinks = localStorage.getItem("wcag-links") === "true";

        if (savedFontSize) setFontSize(savedFontSize);
        if (savedContrast) setHighContrast(savedContrast);
        if (savedLinks) setUnderlineLinks(savedLinks);
    }, []);

    // Apply classes to HTML element
    useEffect(() => {
        const html = document.documentElement;

        // Font Size
        html.classList.remove("wcag-text-large", "wcag-text-xlarge");
        if (fontSize === "large") html.classList.add("wcag-text-large");
        if (fontSize === "xlarge") html.classList.add("wcag-text-xlarge");
        localStorage.setItem("wcag-fontsize", fontSize);

        // Contrast
        if (highContrast) {
            html.classList.add("wcag-contrast-high");
        } else {
            html.classList.remove("wcag-contrast-high");
        }
        localStorage.setItem("wcag-contrast", String(highContrast));

        // Links
        if (underlineLinks) {
            html.classList.add("wcag-links-underline");
        } else {
            html.classList.remove("wcag-links-underline");
        }
        localStorage.setItem("wcag-links", String(underlineLinks));

    }, [fontSize, highContrast, underlineLinks]);

    const resetSettings = () => {
        setFontSize("normal");
        setHighContrast(false);
        setUnderlineLinks(false);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex items-end flex-col gap-2">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="Otwórz narzędzia dostępności"
            >
                {isOpen ? <X className="h-6 w-6" /> : <Accessibility className="h-6 w-6" />}
            </button>

            {/* Menu Panel */}
            {isOpen && (
                <div className="bg-white rounded-lg shadow-xl p-4 w-72 border border-gray-200 animate-in slide-in-from-bottom-5 duration-200">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h3 className="font-semibold text-gray-900">Dostępność (WCAG)</h3>
                        <button onClick={resetSettings} className="text-xs text-red-600 hover:underline">Resetuj</button>
                    </div>

                    <div className="space-y-4">
                        {/* Font Size */}
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Type className="h-4 w-4" /> Rozmiar tekstu
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFontSize("normal")}
                                    className={`flex-1 py-1 text-xs border rounded ${fontSize === "normal" ? "bg-indigo-100 border-indigo-500 text-indigo-700" : "hover:bg-gray-50"}`}
                                >
                                    A
                                </button>
                                <button
                                    onClick={() => setFontSize("large")}
                                    className={`flex-1 py-1 text-sm border rounded ${fontSize === "large" ? "bg-indigo-100 border-indigo-500 text-indigo-700" : "hover:bg-gray-50"}`}
                                >
                                    A+
                                </button>
                                <button
                                    onClick={() => setFontSize("xlarge")}
                                    className={`flex-1 py-1 text-base border rounded ${fontSize === "xlarge" ? "bg-indigo-100 border-indigo-500 text-indigo-700" : "hover:bg-gray-50"}`}
                                >
                                    A++
                                </button>
                            </div>
                        </div>

                        {/* Contrast */}
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Eye className="h-4 w-4" /> Kontrast
                            </p>
                            <button
                                onClick={() => setHighContrast(!highContrast)}
                                className={`w-full py-2 px-3 rounded text-sm text-left flex items-center justify-between border transition ${highContrast ? "bg-black text-yellow-400 border-yellow-400 font-bold" : "bg-white hover:bg-gray-50"}`}
                            >
                                <span>Wysoki Kontrast</span>
                                {highContrast ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </button>
                        </div>

                        {/* Links Underline */}
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <LinkIcon className="h-4 w-4" /> Linki
                            </p>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={underlineLinks}
                                    onChange={(e) => setUnderlineLinks(e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 h-5 w-5"
                                />
                                <span className="text-sm text-gray-700">Podkreśl linki</span>
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
