"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQ {
    id: string;
    question: string;
    answer: string;
}

export function FaqAccordion({ faqs }: { faqs: FAQ[] }) {
    const [openId, setOpenId] = useState<string | null>(null);

    if (faqs.length === 0) return null;

    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center italic">Często Zadawane Pytania</h2>
            <div className="space-y-3">
                {faqs.map((faq) => (
                    <div
                        key={faq.id}
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all hover:border-indigo-300"
                    >
                        <button
                            onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                            className="w-full flex justify-between items-center p-5 text-left transition-colors"
                        >
                            <span className="font-semibold text-gray-900 pr-4">
                                {faq.question}
                            </span>
                            <ChevronDown
                                className={`h-5 w-5 text-indigo-500 transition-transform duration-300 ${openId === faq.id ? "rotate-180" : ""}`}
                            />
                        </button>

                        <AnimatePresence>
                            {openId === faq.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <div className="p-5 pt-0 text-gray-600 border-t border-gray-100 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}
