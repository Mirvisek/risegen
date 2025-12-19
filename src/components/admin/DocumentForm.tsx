"use client";

import { useActionState, useState } from "react";
import { createDocument, updateDocument } from "@/app/admin/o-nas/actions";
import { Loader2, Plus, FileText, Save } from "lucide-react";

const initialState = {
    success: false,
    message: "",
};

type DocumentData = {
    id: string;
    title: string;
    description: string | null;
    fileUrl: string;
    category: string;
    order: number;
};

export function DocumentForm({ initialData, onCancel }: { initialData?: DocumentData; onCancel?: () => void }) {
    const action = initialData ? updateDocument.bind(null, initialData.id) : createDocument;
    const [state, formAction, isPending] = useActionState(action, initialState);
    const [fileName, setFileName] = useState<string | null>(initialData?.fileUrl ? "Plik zapisany" : null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            alert("Plik jest zbyt duży (maks. 10MB)");
            e.target.value = "";
            return;
        }

        setFileName(file.name);

        // Upload to API
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                const hiddenInput = document.getElementById("file-url") as HTMLInputElement;
                if (hiddenInput) hiddenInput.value = data.url;
            }
        } catch (err) {
            console.error("Upload failed", err);
            setFileName("Upload failed");
        }
    };

    return (
        <form action={formAction} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-lg font-medium text-gray-900">
                    {initialData ? "Edytuj Dokument" : "Dodaj Dokument (PDF)"}
                </h3>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Tytuł Dokumentu</label>
                    <input type="text" name="title" id="title" required defaultValue={initialData?.title} placeholder="np. Statut Stowarzyszenia" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" />
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Kategoria</label>
                    <select
                        name="category"
                        id="category"
                        defaultValue={initialData?.category || "OTHER"}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="BASIC">Podstawowe dokumenty</option>
                        <option value="REPORT">Sprawozdania</option>
                        <option value="RESOLUTION">Uchwały Zarządu</option>
                        <option value="OTHER">Inne dokumenty</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Opis (opcjonalnie)</label>
                    <textarea name="description" id="description" rows={3} defaultValue={initialData?.description || ""} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" />
                </div>

                <div>
                    <label htmlFor="order" className="block text-sm font-medium text-gray-700">Kolejność (sortowanie)</label>
                    <input type="number" name="order" id="order" defaultValue={initialData?.order || 0} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Plik PDF</label>
                    <div className="mt-1 flex items-center gap-4">
                        <div className="flex-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-500 transition-colors">
                            <div className="space-y-1 text-center">
                                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                        <span>Wybierz plik</span>
                                        <input id="file-upload" name="file-upload" type="file" accept=".pdf" className="sr-only" onChange={handleFileChange} />
                                    </label>
                                    <p className="pl-1">lub przeciągnij tutaj</p>
                                </div>
                                <p className="text-xs text-gray-500">PDF do 10MB</p>
                                {fileName && <p className="text-sm font-semibold text-indigo-600 mt-2">{fileName}</p>}
                            </div>
                        </div>
                        <input type="hidden" name="fileUrl" id="file-url" defaultValue={initialData?.fileUrl || ""} />
                    </div>
                </div>
            </div>

            {state?.message && (
                <p className={`text-sm ${state.success ? "text-green-600" : "text-red-600"}`}>
                    {state.message}
                </p>
            )}

            <div className="flex justify-end gap-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        Anuluj
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                >
                    {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : (initialData ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />)}
                    {initialData ? "Zapisz Zmiany" : "Dodaj Dokument"}
                </button>
            </div>
        </form>
    );
}
