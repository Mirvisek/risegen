"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Error occurred:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-red-950/20 dark:via-gray-900 dark:to-orange-950/20 px-4 transition-colors">
            <div className="max-w-2xl w-full text-center space-y-8">
                {/* Error Icon */}
                <div className="flex justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-full p-8 shadow-2xl">
                        <AlertTriangle className="h-20 w-20 text-red-600 dark:text-red-500 animate-pulse" />
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                        Coś poszło nie tak
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        Przepraszamy, wystąpił nieoczekiwany błąd. Nasz zespół został powiadomiony i pracuje nad rozwiązaniem problemu.
                    </p>
                    {process.env.NODE_ENV === "development" && error.message && (
                        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-800 dark:text-red-200 font-mono">{error.message}</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <button
                        onClick={reset}
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                    >
                        <RefreshCcw className="h-5 w-5" />
                        Spróbuj ponownie
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition border border-gray-300 dark:border-gray-700 shadow hover:shadow-md transform hover:-translate-y-0.5 font-medium"
                    >
                        <Home className="h-5 w-5" />
                        Strona główna
                    </Link>
                </div>

                {/* Support */}
                <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Jeśli problem się powtarza,{" "}
                        <Link href="/kontakt" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline font-medium">
                            skontaktuj się z nami
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
