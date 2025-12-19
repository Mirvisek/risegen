"use client";

import { useEffect, useState } from "react";
import { Trash2, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
    title: string;
    description: React.ReactNode;
    children?: React.ReactNode;
    loading?: boolean;
    confirmText?: string;
    cancelText?: string;
}

export function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    children,
    loading = false,
    confirmText = "Usuń",
    cancelText = "Anuluj",
}: DeleteConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full space-y-4 shadow-xl relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                        <Trash2 className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                    <div className="text-sm text-gray-500 mt-2">
                        {description}
                    </div>
                    {children && <div className="mt-4 text-left">{children}</div>}
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 text-sm font-medium transition disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 text-sm font-medium disabled:opacity-50 flex justify-center items-center transition"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
