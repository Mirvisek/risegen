"use client";

import { useState } from "react";
import { Trash2, X, Loader2 } from "lucide-react";
import { deletePartner } from "@/app/admin/partnerzy/actions";

export function DeletePartnerButton({ id }: { id: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    return (
        <>
            <button
                type="button"
                className="text-red-600 hover:text-red-900 p-1"
                onClick={() => setIsOpen(true)}
                title="Usuń partnera"
            >
                <Trash2 className="h-4 w-4" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full space-y-4 shadow-xl relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Usuń partnera</h3>
                            <p className="text-sm text-gray-500 mt-2">
                                Czy na pewno chcesz usunąć tego partnera?<br />
                                Tej operacji nie można cofnąć.
                            </p>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 text-sm font-medium"
                            >
                                Anuluj
                            </button>
                            <form
                                action={async (formData) => {
                                    setLoading(true);
                                    await deletePartner(formData);
                                    setLoading(false);
                                    setIsOpen(false);
                                }}
                                className="flex-1"
                            >
                                <input type="hidden" name="id" value={id} />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 text-sm font-medium disabled:opacity-50 flex justify-center items-center"
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Usuń"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
