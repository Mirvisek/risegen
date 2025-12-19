"use client";

import { FileText, Download } from "lucide-react";

interface Attachment {
    name: string;
    url: string;
}

interface AttachmentsListProps {
    documents: string | null | Attachment[]; // Can be JSON string or parsed array
}

export function AttachmentsList({ documents }: AttachmentsListProps) {
    if (!documents) return null;

    let parsedDocuments: Attachment[] = [];

    if (typeof documents === "string") {
        try {
            parsedDocuments = JSON.parse(documents);
        } catch (e) {
            console.error("Failed to parse documents JSON", e);
            return null;
        }
    } else {
        parsedDocuments = documents;
    }

    if (!Array.isArray(parsedDocuments) || parsedDocuments.length === 0) return null;

    return (
        <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pliki do pobrania</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {parsedDocuments.map((doc, index) => (
                    <li key={index}>
                        <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-white hover:border-indigo-300 hover:shadow-sm transition group"
                        >
                            <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div className="ml-4 flex-grow min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition">
                                    {doc.name}
                                </p>
                                <p className="text-xs text-gray-500">Kliknij, aby otworzyć</p>
                            </div>
                            <Download className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition ml-2" />
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
