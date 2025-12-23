"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Award } from "lucide-react";
import { createStat, updateStat, deleteStat } from "@/app/admin/stats/actions";
import { toast } from "sonner";
import { StatForm } from "./StatForm";

interface Stat {
    id: string;
    label: string;
    value: string;
    icon: string | null;
    order: number;
}

export function StatsManager({ initialStats }: { initialStats: Stat[] }) {
    const [stats, setStats] = useState(initialStats);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingStat, setEditingStat] = useState<Stat | null>(null);

    const handleAdd = () => {
        setEditingStat(null);
        setIsFormOpen(true);
    };

    const handleEdit = (stat: Stat) => {
        setEditingStat(stat);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Czy na pewno chcesz usunąć tę statystykę?")) return;
        try {
            await deleteStat(id);
            setStats(stats.filter(s => s.id !== id));
            toast.success("Usunięto pomyślnie");
        } catch (error) {
            toast.error("Błąd podczas usuwania");
        }
    };

    const onSave = (stat: Stat) => {
        if (editingStat) {
            setStats(stats.map(s => s.id === stat.id ? stat : s).sort((a, b) => a.order - b.order));
        } else {
            setStats([...stats, stat].sort((a, b) => a.order - b.order));
        }
        setIsFormOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={handleAdd}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    <Plus className="h-4 w-4" />
                    Dodaj Statystykę
                </button>
            </div>

            <div className="overflow-hidden bg-white dark:bg-gray-900 shadow sm:rounded-lg border border-gray-200 dark:border-gray-800">
                <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                    {stats.map((stat) => (
                        <li key={stat.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                                    <Award className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white text-lg">{stat.value}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleEdit(stat)}
                                    className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-lg transition"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(stat.id)}
                                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </li>
                    ))}
                    {stats.length === 0 && (
                        <li className="p-8 text-center text-gray-500 dark:text-gray-400">
                            Brak statystyk. Dodaj pierwsze sukcesy!
                        </li>
                    )}
                </ul>
            </div>

            {isFormOpen && (
                <StatForm
                    stat={editingStat as any}
                    onClose={() => setIsFormOpen(false)}
                    onSave={onSave as any}
                />
            )}
        </div>
    );
}
