"use client";

import { DocumentForm } from "@/components/admin/DocumentForm";
import { DeleteDocumentButton } from "@/components/admin/DeleteDocumentButton";
import Link from "next/link";
import { FileText, Plus, Pencil } from "lucide-react";
import { useState } from "react";

type Document = {
    id: string;
    title: string;
    description: string | null;
    fileUrl: string;
    category: string;
    order: number;
    createdAt: Date;
};

export function DocumentManager({ documents }: { documents: Document[] }) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingDocument, setEditingDocument] = useState<Document | null>(null);

    const handleCancel = () => {
        setIsCreating(false);
        setEditingDocument(null);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-end">
                {!isCreating && !editingDocument && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium"
                    >
                        <Plus className="h-4 w-4" /> Dodaj Dokument
                    </button>
                )}
            </div>

            {(isCreating || editingDocument) && (
                <DocumentForm
                    initialData={editingDocument || undefined}
                    onCancel={handleCancel}
                />
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900">Lista Dokumentów</h3>
                </div>
                <ul role="list" className="divide-y divide-gray-200">
                    {documents.map((doc) => (
                        <li key={doc.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-gray-400 font-mono w-4">{doc.order}</span>
                                <div className="h-10 w-10 rounded bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <a
                                        href={doc.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-gray-900 hover:text-indigo-600 hover:underline"
                                    >
                                        {doc.title}
                                    </a>
                                    <p className="text-xs text-gray-500">
                                        Dodano: {new Date(doc.createdAt).toLocaleDateString()}
                                    </p>
                                    {doc.description && <p className="text-xs text-gray-400 italic truncate max-w-xs">{doc.description}</p>}
                                    <span className="inline-flex items-center mt-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                        {doc.category === 'BASIC' ? 'Podstawowe' : doc.category === 'REPORT' ? 'Sprawozdanie' : doc.category === 'RESOLUTION' ? 'Uchwała' : 'Inne'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        setEditingDocument(doc);
                                        setIsCreating(false);
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                    }}
                                    className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                                    title="Edytuj"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <DeleteDocumentButton id={doc.id} />
                            </div>
                        </li>
                    ))}
                    {documents.length === 0 && (
                        <li className="px-6 py-8 text-center text-gray-500">Brak dokumentów.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
