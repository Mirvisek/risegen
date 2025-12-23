"use client";

import { useActionState, useState, ChangeEvent } from "react";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { createNews, updateNews } from "@/app/admin/aktualnosci/actions";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { AttachmentsManager, Attachment } from "@/components/admin/AttachmentsManager";

export function NewsForm({ news }: { news?: any }) {
    const initialState = { success: false, message: "" };
    // Using useActionState from React 19
    const [state, formAction, isPending] = useActionState(news ? updateNews : createNews, initialState);

    // Local state for client-side interactivity
    const [slug, setSlug] = useState(news?.slug || "");
    const [images, setImages] = useState<string[]>(news?.images ? JSON.parse(news.images) : []);
    const [documents, setDocuments] = useState<Attachment[]>(news?.documents ? JSON.parse(news.documents) : []);
    const [content, setContent] = useState(news?.content || "");
    const [uploading, setUploading] = useState(false);

    // Auto-generate slug from title (only if creating new)
    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!news) {
            const generatedSlug = e.target.value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
            setSlug(generatedSlug);
        }
    };

    const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSlug(e.target.value);
    };

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploading(true);

        const file = e.target.files[0];

        if (file.size > 10 * 1024 * 1024) {
            alert("Plik jest zbyt duży (maks. 10MB)");
            setUploading(false);
            e.target.value = "";
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            setImages((prev) => [...prev, data.url]);
        } catch (err) {
            console.error(err);
            alert("Błąd wysyłania zdjęcia");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (indexToRemove: number) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    return (
        <form action={formAction} className="space-y-6 max-w-2xl bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 animate-in fade-in duration-500 transition-colors">
            {news && <input type="hidden" name="id" value={news.id} />}
            <input type="hidden" name="images" value={JSON.stringify(images)} />
            <input type="hidden" name="documents" value={JSON.stringify(documents)} />

            {state?.message && !state.success && (
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500 p-4 rounded-md">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-red-700 dark:text-red-300">{state.message}</p>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tytuł</label>
                <input
                    name="title"
                    defaultValue={news?.title}
                    onChange={handleTitleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-colors"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Slug (URL)</label>
                <input
                    name="slug"
                    value={slug}
                    onChange={handleSlugChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white transition-colors"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Automatycznie generowany z tytułu, ale możesz go zmienić.</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Zdjęcia</label>
                <div className="mt-2 grid grid-cols-3 gap-4 mb-4">
                    {images.map((url, index) => (
                        <div key={index} className="relative group aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                            <Image src={url} alt="News image" fill className="object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300">
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        {uploading ? "Wysyłanie..." : "Dodaj Zdjęcie"}
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400">JPG, PNG, WEBP. Maks. 10MB.</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">Rekomendowane: 1200x630px (16:9)</span>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Załączone Dokumenty</label>
                <AttachmentsManager
                    attachments={documents}
                    onChange={setDocuments}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Treść (Edytor Wizualny)</label>
                <input type="hidden" name="content" value={content} />
                <RichTextEditor
                    value={content}
                    onChange={setContent}
                    className="mt-1"
                />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="isHighlight"
                    id="isHighlight"
                    defaultChecked={news?.isHighlight}
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-indigo-600 focus:ring-indigo-600 dark:focus:ring-offset-gray-900"
                />
                <label htmlFor="isHighlight" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Wyróżnij na stronie głównej
                </label>
            </div>

            <button
                type="submit"
                disabled={isPending || uploading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center gap-2 transition-colors"
            >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isPending ? "Zapisywanie..." : "Zapisz Aktualność"}
            </button>
        </form>
    );
}
