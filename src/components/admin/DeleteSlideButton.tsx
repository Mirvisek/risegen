"use client";

import { useState } from "react";
import { Trash2, X, Loader2 } from "lucide-react";
import { deleteHomeSlide } from "@/app/admin/o-nas/actions";

export function DeleteSlideButton({ slideId }: { slideId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    return (
        <>
            <button
                type="button"
                className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded transition-colors"
                title="Usuń"
                onClick={() => setIsOpen(true)}
            >
                <Trash2 className="h-4 w-4" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-sm w-full space-y-4 shadow-xl relative animate-in fade-in zoom-in duration-200 transition-colors border border-gray-200 dark:border-gray-800">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Usuń slajd</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Czy na pewno chcesz usunąć ten slajd?
                            </p>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
                            >
                                Anuluj
                            </button>
                            <button
                                type="button"
                                onClick={async () => {
                                    setLoading(true);
                                    await deleteHomeSlide(slideId);
                                    setLoading(false);
                                    setIsOpen(false);
                                }}
                                disabled={loading}
                                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 dark:hover:bg-red-500 text-sm font-medium disabled:opacity-50 flex justify-center items-center transition-colors"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Usuń"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
