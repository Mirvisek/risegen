"use client";

import { useActionState, useState, ChangeEvent } from "react";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { createPartner, updatePartner } from "@/app/admin/partnerzy/actions";

export function PartnerForm({ partner }: { partner?: any }) {
    const initialState = { success: false, message: "" };
    const [state, formAction, isPending] = useActionState(partner ? updatePartner : createPartner, initialState);

    const [logo, setLogo] = useState<string>(partner?.logo || "");
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];

        if (file.size > 10 * 1024 * 1024) {
            alert("Plik jest zbyt duży (maks. 10MB)");
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", e.target.files[0]);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            setLogo(data.url);
        } catch (err) {
            console.error(err);
            alert("Błąd wysyłania zdjęcia");
        } finally {
            setUploading(false);
        }
    };

    return (
        <form action={formAction} className="space-y-6 max-w-xl bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 animate-in fade-in duration-500 transition-colors">
            {partner && <input type="hidden" name="id" value={partner.id} />}
            <input type="hidden" name="logo" value={logo} />

            {state?.message && !state.success && (
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500 p-4 rounded-md">
                    <p className="text-sm text-red-700 dark:text-red-300">{state.message}</p>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nazwa Partnera</label>
                <input
                    name="name"
                    defaultValue={partner?.name}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-colors"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kategoria</label>
                <select
                    name="type"
                    defaultValue={partner?.type || "NGO"}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-colors"
                >
                    <option value="NGO">Organizacje Pozarządowe (NGO)</option>
                    <option value="BUSINESS">Partnerzy Biznesowi</option>
                    <option value="OTHER">Inni Partnerzy</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Strona WWW (opcjonalnie)</label>
                <input
                    name="website"
                    defaultValue={partner?.website}
                    placeholder="https://..."
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-colors"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Logo</label>
                <div className="mt-2 mb-4">
                    {logo ? (
                        <div className="relative group w-40 h-24 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                            <Image src={logo} alt="Partner logo" width={160} height={96} className="object-contain max-h-full" />
                            <button
                                type="button"
                                onClick={() => setLogo("")}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <label className="cursor-pointer bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-md px-6 py-8 flex flex-col items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 w-full">
                            {uploading ? <Loader2 className="h-8 w-8 animate-spin text-gray-400" /> : <Upload className="h-8 w-8 text-gray-400" />}
                            {uploading ? "Wysyłanie..." : "Kliknij, aby dodać logo"}
                            <span className="text-xs text-gray-500 dark:text-gray-400">Maks. 10MB (PNG/SVG/JPG)</span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">Rekomendowane: 400x200px (proporcje 2:1)</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                        </label>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isPending || uploading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center gap-2 transition-colors"
            >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isPending ? "Zapisywanie..." : "Zapisz Partnera"}
            </button>
        </form>
    );
}
