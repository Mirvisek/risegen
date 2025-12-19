"use client";

import { useActionState, useState, useEffect } from "react";
import { createTeamMember, updateTeamMember } from "@/app/admin/o-nas/actions";
import { Loader2, Plus, Upload, Save, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor").then((mod) => mod.default),
    { ssr: false }
);

const initialState = {
    success: false,
    message: "",
};

type TeamMemberData = {
    id: string;
    name: string;
    role: string;
    bio: string | null;
    categories: string;
    image: string | null;
    email: string | null;
    phone: string | null;
    order: number;
    alignment?: string;
};

export function TeamMemberForm({ initialData, onCancel }: { initialData?: TeamMemberData; onCancel?: () => void }) {
    const action = initialData ? updateTeamMember.bind(null, initialData.id) : createTeamMember;
    const [state, formAction, isPending] = useActionState(action, initialState);
    const [preview, setPreview] = useState<string | null>(initialData?.image || null);
    const [bio, setBio] = useState(initialData?.bio || "");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Parse categories from JSON string or default to ["BOARD"] (or empty)
    const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
        if (initialData?.categories) {
            try {
                return JSON.parse(initialData.categories);
            } catch (e) {
                return [];
            }
        }
        return ["BOARD"];
    });

    const categoriesOptions = [
        { id: "BOARD", label: "Zarząd" },
        { id: "OFFICE", label: "Biuro" },
        { id: "COORDINATOR", label: "Koordynatorzy" },
        { id: "COLLABORATOR", label: "Współpracownicy" },
    ];

    const handleCategoryChange = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedCategories(prev => [...prev, id]);
        } else {
            setSelectedCategories(prev => prev.filter(c => c !== id));
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            alert("Plik jest zbyt duży (maks. 10MB)");
            e.target.value = "";
            return;
        }

        // Create local preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

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
                // Set the hidden input value to the uploaded URL
                const hiddenInput = document.getElementById("image-url") as HTMLInputElement;
                if (hiddenInput) hiddenInput.value = data.url;
            }
        } catch (err) {
            console.error("Upload failed", err);
        }
    };

    return (
        <form action={formAction} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-lg font-medium text-gray-900">
                    {initialData ? "Edytuj Członka Zespołu" : "Dodaj Członka Zespołu"}
                </h3>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Zdjęcie</label>
                    <div className="mt-1 flex items-center gap-4">
                        <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                            {preview ? (
                                <Image src={preview} alt="Preview" fill className="object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-400">
                                    <Upload className="h-8 w-8" />
                                </div>
                            )}
                        </div>
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                            />
                            <p className="text-xs text-gray-500 mt-1">Maks. 10MB. Format: JPG, PNG.</p>
                            <p className="text-xs text-gray-400">Rekomendowane: 400x400px (1:1)</p>
                            {/* Initialize hidden input with existing image URL to preserve it if not changed */}
                            <input type="hidden" name="image" id="image-url" defaultValue={initialData?.image || ""} />
                        </div>
                    </div>
                </div>

                <div className="col-span-2 sm:col-span-1 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Imię i Nazwisko</label>
                        <input type="text" name="name" id="name" defaultValue={initialData?.name} required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" />
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rola (stanowisko)</label>
                        <input type="text" name="role" id="role" defaultValue={initialData?.role} required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" id="email" defaultValue={initialData?.email || ""} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefon</label>
                        <input type="text" name="phone" id="phone" defaultValue={initialData?.phone || ""} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                </div>

                <div className="col-span-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">Opis (Biogram)</label>
                    <input type="hidden" name="bio" value={bio} />
                    {mounted ? (
                        <div data-color-mode="light">
                            <MDEditor
                                value={bio}
                                onChange={(val) => setBio(val || "")}
                                height={250}
                                preview="edit"
                                hideToolbar={false}
                                enableScroll={true}
                                visibleDragbar={false}
                            />
                        </div>
                    ) : (
                        <div className="border border-gray-300 rounded-md p-4 bg-gray-50 h-[250px] flex items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">Użyj formatowania Markdown dla lepszej prezentacji biogramu.</p>
                </div>

                <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie</label>
                    <div className="grid grid-cols-2 gap-3">
                        {categoriesOptions.map((opt) => (
                            <div key={opt.id} className="flex items-center">
                                <input
                                    id={`category-${opt.id}`}
                                    type="checkbox"
                                    checked={selectedCategories.includes(opt.id)}
                                    onChange={(e) => handleCategoryChange(opt.id, e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                />
                                <label htmlFor={`category-${opt.id}`} className="ml-2 text-sm text-gray-700 cursor-pointer select-none">
                                    {opt.label}
                                </label>
                            </div>
                        ))}
                    </div>
                    <input type="hidden" name="categories" value={JSON.stringify(selectedCategories)} />
                </div>

                <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="order" className="block text-sm font-medium text-gray-700">Kolejność (sortowanie)</label>
                    <input type="number" name="order" id="order" defaultValue={initialData?.order || 0} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" />
                </div>

                <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="alignment" className="block text-sm font-medium text-gray-700">Wyrównanie zdjęcia (Pion)</label>
                    <select
                        name="alignment"
                        id="alignment"
                        defaultValue={initialData?.alignment || "center"}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm bg-white"
                    >
                        <option value="center">Środek (Center)</option>
                        <option value="top">Góra (Top)</option>
                        <option value="bottom">Dół (Bottom)</option>
                    </select>
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
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
                    {initialData ? "Zapisz Zmiany" : "Dodaj Osobę"}
                </button>
            </div>
        </form>
    );
}
