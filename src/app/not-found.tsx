import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
            <div className="max-w-2xl w-full text-center space-y-8">
                {/* 404 Animation */}
                <div className="relative">
                    <h1 className="text-[150px] md:text-[200px] font-bold text-gray-200 select-none">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white rounded-full p-8 shadow-2xl">
                            <Search className="h-16 w-16 text-indigo-600 animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Strona nie została znaleziona
                    </h2>
                    <p className="text-lg text-gray-600 max-w-md mx-auto">
                        Przykro nam, ale strona której szukasz nie istnieje lub została przeniesiona.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                    >
                        <Home className="h-5 w-5" />
                        Strona główna
                    </Link>
                    <Link
                        href="/projekty"
                        className="inline-flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition border border-gray-300 shadow hover:shadow-md transform hover:-translate-y-0.5 font-medium"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Zobacz projekty
                    </Link>
                </div>

                {/* Popular Links */}
                <div className="pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-4">Może Cię zainteresują:</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/aktualnosci" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline">
                            Aktualności
                        </Link>
                        <span className="text-gray-300">•</span>
                        <Link href="/o-nas" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline">
                            O nas
                        </Link>
                        <span className="text-gray-300">•</span>
                        <Link href="/kontakt" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline">
                            Kontakt
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
