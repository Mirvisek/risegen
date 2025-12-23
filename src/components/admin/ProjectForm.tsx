"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Loader2, Upload, X, Check } from "lucide-react";
import Image from "next/image";
import { AttachmentsManager, Attachment } from "@/components/admin/AttachmentsManager";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor").then((mod) => mod.default),
    { ssr: false }
);

export function ProjectForm({ project }: { project?: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [slug, setSlug] = useState(project?.slug || "");
    const [images, setImages] = useState<string[]>(project?.images ? JSON.parse(project.images) : []);
    const [documents, setDocuments] = useState<Attachment[]>(project?.documents ? JSON.parse(project.documents) : []);
    const [content, setContent] = useState(project?.content || "");
    const [description, setDescription] = useState(project?.description || "");
    const [uploading, setUploading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Auto-generate slug from title
    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!project) { // Only auto-gen if creating new
            const generatedSlug = e.target.value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
                .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
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
            alert("Błąd wysyłania zdjęcia");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (indexToRemove: number) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get("title"),
            slug: slug,
            description: description,
            content: content,
            isHighlight: formData.get("isHighlight") === "on",
            images: JSON.stringify(images),
            documents: JSON.stringify(documents),
            status: formData.get("status"),
        };

        try {
            const url = project ? `/api/projects/${project.id}` : "/api/projects";
            const method = project ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Błąd zapisu");

            setSuccess(true);
            setTimeout(() => {
                router.push("/admin/projekty");
                router.refresh();
            }, 1000);

        } catch (err) {
            setError("Wystąpił błąd.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 animate-in fade-in duration-500 transition-colors">
            {success && (
                <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-500 p-4 rounded-md flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400 dark:text-green-500" />
                    <p className="text-sm text-green-700 dark:text-green-300 font-medium">Projekt został zapisany pomyślnie! Przekierowywanie...</p>
                </div>
            )}
            {error && <div className="text-red-500">{error}</div>}

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tytuł</label>
                <input
                    name="title"
                    defaultValue={project?.title}
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
                            <Image src={url} alt="Project image" fill className="object-cover" />
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Krótki Opis</label>
                {mounted ? (
                    <div data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}>
                        <MDEditor
                            value={description}
                            onChange={(val) => setDescription(val || "")}
                            height={200}
                            preview="edit"
                            hideToolbar={false}
                            enableScroll={true}
                            visibleDragbar={false}
                        />
                    </div>
                ) : (
                    <div className="border border-gray-300 dark:border-gray-700 rounded-md p-4 bg-gray-50 dark:bg-gray-800 h-[200px] flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Krótki opis wyświetlany na liście projektów i w meta description.</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Treść (Edytor Markdown)</label>
                {mounted ? (
                    <div data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}>
                        <MDEditor
                            value={content}
                            onChange={(val) => setContent(val || "")}
                            height={500}
                            preview="live"
                            hideToolbar={false}
                            enableScroll={true}
                            visibleDragbar={false}
                        />
                    </div>
                ) : (
                    <div className="border border-gray-300 dark:border-gray-700 rounded-md p-4 bg-gray-50 dark:bg-gray-800 h-[500px] flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Pełna treść projektu w formacie Markdown.</p>
            </div>

            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status Projektu</label>
                <select
                    name="status"
                    id="status"
                    defaultValue={project?.status || "CURRENT"}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                >
                    <option value="CURRENT">Aktualne</option>
                    <option value="COMPLETED">Zrealizowane</option>
                </select>
            </div>

            <div className="flex items-center gap-2">
                <input type="checkbox" name="isHighlight" id="isHighlight" defaultChecked={project?.isHighlight} className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-indigo-600 focus:ring-indigo-600 dark:focus:ring-offset-gray-900" />
                <label htmlFor="isHighlight" className="text-sm font-medium text-gray-700 dark:text-gray-300">Wyróżnij na stronie głównej</label>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
                {loading ? "Zapisywanie..." : "Zapisz Projekt"}
            </button>
        </form>
    );
}
