"use client";

import { useState, ChangeEvent } from "react";
import { FileText, Upload, X, Loader2, Download } from "lucide-react";

export interface Attachment {
    name: string;
    url: string;
}

interface AttachmentsManagerProps {
    attachments: Attachment[];
    onChange: (attachments: Attachment[]) => void;
}

export function AttachmentsManager({ attachments, onChange }: AttachmentsManagerProps) {
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
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

            // Add new attachment
            onChange([...attachments, { name: file.name, url: data.url }]);
        } catch (err) {
            console.error(err);
            alert("Błąd wysyłania pliku");
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = "";
        }
    };

    const removeAttachment = (indexToRemove: number) => {
        onChange(attachments.filter((_, index) => index !== indexToRemove));
    };

    const handleNameChange = (index: number, newName: string) => {
        const newAttachments = [...attachments];
        newAttachments[index].name = newName;
        onChange(newAttachments);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <label className="cursor-pointer bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {uploading ? "Wysyłanie..." : "Dodaj Dokument"}
                    <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOC, DOCX, XLS. Maks. 10MB</p>
            </div>

            {attachments.length > 0 && (
                <ul className="divide-y divide-gray-100 dark:divide-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    {attachments.map((file, index) => (
                        <li key={index} className="flex items-center justify-between p-3 gap-3">
                            <div className="flex items-center gap-3 flex-grow min-w-0">
                                <div className="h-8 w-8 rounded bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <input
                                        type="text"
                                        value={file.name}
                                        onChange={(e) => handleNameChange(index, e.target.value)}
                                        className="block w-full text-sm border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        placeholder="Nazwa pliku"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                                    title="Pobierz / Zobacz"
                                >
                                    <Download className="h-4 w-4" />
                                </a>
                                <button
                                    type="button"
                                    onClick={() => removeAttachment(index)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
                                    title="Usuń"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
