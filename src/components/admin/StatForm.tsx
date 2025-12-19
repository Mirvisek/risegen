"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createStat, updateStat } from "@/app/admin/stats/actions";
import { toast } from "sonner";

interface Stat {
    id: string;
    label: string;
    value: string;
    icon: string;
    order: number;
}

export function StatForm({ stat, onClose, onSave }: { stat: Stat | null, onClose: () => void, onSave: (stat: Stat) => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        label: stat?.label || "",
        value: stat?.value || "",
        icon: stat?.icon || "Award",
        order: stat?.order || 0
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (stat) {
                const updated = await updateStat(stat.id, formData);
                onSave(updated as any);
                toast.success("Zapisano zmiany");
            } else {
                const created = await createStat(formData);
                onSave(created as any);
                toast.success("Dodano statystykę");
            }
        } catch (error) {
            toast.error("Błąd podczas zapisywania");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {stat ? "Edytuj Statystykę" : "Nowa Statystyka"}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Wartość (np. "15", "100+", "5 lat")
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.value}
                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            placeholder="Np. 150"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Etykieta (opis)
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.label}
                            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            placeholder="Np. Zrealizowanych projektów"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Kolejność
                        </label>
                        <input
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                        >
                            Anuluj
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            {isLoading ? "Zapisywanie..." : "Zapisz"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
