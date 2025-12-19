"use client";

import { motion } from "framer-motion";
import { Award, Zap, Heart, Users } from "lucide-react";

interface Stat {
    id: string;
    label: string;
    value: string;
}

export function ImpactCounter({ stats }: { stats: Stat[] }) {
    if (stats.length === 0) return null;

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="text-center space-y-2 border-r last:border-0 border-gray-100 flex flex-col items-center justify-center p-4 group"
                        >
                            <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 mb-2 transition-transform group-hover:scale-110">
                                <Award className="h-6 w-6" />
                            </div>
                            <span className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tighter">
                                {stat.value}
                            </span>
                            <span className="text-sm font-medium text-gray-500 uppercase tracking-widest px-2">
                                {stat.label}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
