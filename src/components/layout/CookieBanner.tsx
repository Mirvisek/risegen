"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookieConsent");
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("cookieConsent", "true");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 p-4 md:p-6 animate-in slide-in-from-bottom duration-500 transition-colors">
            <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 md:max-w-3xl">
                    <p>
                        Strona korzysta z plików cookies w celu realizacji usług i zgodnie z{" "}
                        <Link href="/polityka-cookies" className="font-medium text-gray-900 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition underline decoration-gray-300 dark:decoration-gray-700 underline-offset-4">
                            Polityką Plików Cookies
                        </Link>
                        . Możesz określić warunki przechowywania lub dostępu do plików cookies w Twojej przeglądarce.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={acceptCookies}
                        className="bg-indigo-600 dark:bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-500 transition shadow-sm hover:shadow-md"
                    >
                        Akceptuję
                    </button>
                </div>
            </div>
        </div>
    );
}
