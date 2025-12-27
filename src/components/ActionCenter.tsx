"use client";

import Link from "next/link";
import { ArrowRight, Heart, Users, Handshake } from "lucide-react";

export function ActionCenter() {
    return (
        <section className="hidden md:block container mx-auto px-4 max-w-6xl py-8 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 md:p-12 space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Centrum Akcji</h2>
                    <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
                    <p className="text-gray-600 dark:text-gray-400">Włącz się w działania i zmieniaj rzeczywistość razem z nami.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Wolontariat */}
                    <div className="group relative bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-8 transition-all hover:shadow-lg hover:-translate-y-1 border border-indigo-100 dark:border-indigo-800/50 overflow-hidden">
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                                <Users className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Dołącz do Zespołu</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow leading-relaxed">
                                Chcesz mieć realny wpływ na otoczenie? Dołącz do nas jako wolontariusz lub członek stowarzyszenia.
                            </p>
                            <Link href="/zgloszenia" className="inline-flex items-center text-indigo-700 dark:text-indigo-300 font-bold group-hover:gap-2 transition-all">
                                Wypełnij formularz <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Card 2: Wsparcie */}
                    <div className="group relative bg-pink-50 dark:bg-pink-900/20 rounded-2xl p-8 transition-all hover:shadow-lg hover:-translate-y-1 border border-pink-100 dark:border-pink-800/50 overflow-hidden">
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-pink-600 dark:text-pink-400 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                                <Heart className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Wesprzyj Misję</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow leading-relaxed">
                                Twoje wsparcie finansowe pozwala nam realizować ambitne projekty dla lokalnej społeczności.
                            </p>
                            <Link href="/wesprzyj-nas" className="inline-flex items-center text-pink-700 dark:text-pink-300 font-bold group-hover:gap-2 transition-all">
                                Przekaż darowiznę <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Card 3: Partnerstwo */}
                    <div className="group relative bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-8 transition-all hover:shadow-lg hover:-translate-y-1 border border-teal-100 dark:border-teal-800/50 overflow-hidden">
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                                <Handshake className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Zostań Partnerem</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow leading-relaxed">
                                Jesteś firmą lub instytucją? Nawiążmy współpracę i zróbmy razem coś wielkiego dla regionu.
                            </p>
                            <Link href="/kontakt" className="inline-flex items-center text-teal-700 dark:text-teal-300 font-bold group-hover:gap-2 transition-all">
                                Skontaktuj się <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
