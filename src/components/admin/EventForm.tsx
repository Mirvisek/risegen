"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Loader2, Upload, X, Check, Calendar as CalendarIcon, MapPin } from "lucide-react";
import Image from "next/image";
import { AttachmentsManager, Attachment } from "@/components/admin/AttachmentsManager";
import dynamic from "next/dynamic";
import { upsertEvent, deleteEvent } from "@/app/admin/wydarzenia/actions";
import { toast } from "sonner";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor").then((mod) => mod.default),
    { ssr: false }
);

export function EventForm({ event }: { event?: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [slug, setSlug] = useState(event?.slug || "");
    const [images, setImages] = useState<string[]>(event?.images ? JSON.parse(event.images) : []);
    const [documents, setDocuments] = useState<Attachment[]>(event?.documents ? JSON.parse(event.documents) : []);
    const [content, setContent] = useState(event?.content || "");
    const [eventDate, setEventDate] = useState(event?.date ? new Date(event.date).toISOString().slice(0, 16) : "");
    const [uploading, setUploading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!event) {
            const generatedSlug = e.target.value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
            setSlug(generatedSlug);
        }
    };

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploading(true);
        const file = e.target.files[0];
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            setImages((prev) => [...prev, data.url]);
            toast.success("Zdjęcie dodane");
        } catch (err) {
            toast.error("Błąd wysyłania zdjęcia");
        } finally {
            setUploading(false);
        }
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get("title"),
            slug: slug,
            content: content,
            date: new Date(eventDate),
            location: formData.get("location"),
            images: JSON.stringify(images),
            documents: JSON.stringify(documents),
        };

        try {
            await upsertEvent(event?.id || null, data);
            toast.success("Wydarzenie zapisane");
            router.push("/admin/wydarzenia");
            router.refresh();
        } catch (err) {
            toast.error("Wystąpił błąd podczas zapisywania");
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async () => {
        if (!confirm("Czy na pewno chcesz usunąć to wydarzenie?")) return;
        setLoading(true);
        try {
            await deleteEvent(event.id);
            toast.success("Wydarzenie usunięte");
            router.push("/admin/wydarzenia");
            router.refresh();
        } catch (error) {
            toast.error("Błąd podczas usuwania");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 animate-in fade-in duration-500 transition-colors">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tytuł Wydarzenia</label>
                        <input
                            name="title"
                            defaultValue={event?.title}
                            onChange={handleTitleChange}
                            required
                            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Slug (URL)</label>
                        <input
                            name="slug"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 px-4 py-2 focus:ring-2 focus:ring-indigo-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" /> Data i Godzina
                        </label>
                        <input
                            type="datetime-local"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> Lokalizacja
                        </label>
                        <input
                            name="location"
                            defaultValue={event?.location}
                            placeholder="Np. Rynek Główny, Kraków"
                            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500 transition-colors"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Zdjęcia</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {images.map((url, index) => (
                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 group">
                            <Image src={url} alt="Event image" fill className="object-cover" />
                            <button
                                type="button"
                                onClick={() => setImages(images.filter((_, i) => i !== index))}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {uploading ? "Wysyłanie..." : "Dodaj Zdjęcie"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Opis Wydarzenia (Markdown)</label>
                {mounted ? (
                    <div data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}>
                        <MDEditor
                            value={content}
                            onChange={(val) => setContent(val || "")}
                            height={400}
                        />
                    </div>
                ) : (
                    <div className="h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
                )}
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dokumenty do pobrania</label>
                <AttachmentsManager attachments={documents} onChange={setDocuments} />
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-between gap-4">
                {event && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="px-6 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition"
                    >
                        Usuń Wydarzenie
                    </button>
                )}
                <div className="flex gap-4 ml-auto">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                    >
                        Anuluj
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        Zapisz Wydarzenie
                    </button>
                </div>
            </div>
        </form>
    );
}
