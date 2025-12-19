"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { createFaq, updateFaq, deleteFaq } from "@/app/admin/faq/actions";
import { toast } from "sonner";
import { FAQForm } from "./FAQForm";

interface FAQ {
    id: string;
    question: string;
    answer: string;
    order: number;
}

export function FAQManager({ initialFaqs }: { initialFaqs: FAQ[] }) {
    const [faqs, setFaqs] = useState(initialFaqs);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

    const handleAdd = () => {
        setEditingFaq(null);
        setIsFormOpen(true);
    };

    const handleEdit = (faq: FAQ) => {
        setEditingFaq(faq);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Czy na pewno chcesz usunąć to pytanie?")) return;
        try {
            await deleteFaq(id);
            setFaqs(faqs.filter(f => f.id !== id));
            toast.success("Usunięto pomyślnie");
        } catch (error) {
            toast.error("Błąd podczas usuwania");
        }
    };

    const onSave = (faq: FAQ) => {
        if (editingFaq) {
            setFaqs(faqs.map(f => f.id === faq.id ? faq : f).sort((a, b) => a.order - b.order));
        } else {
            setFaqs([...faqs, faq].sort((a, b) => a.order - b.order));
        }
        setIsFormOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={handleAdd}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    <Plus className="h-4 w-4" />
                    Dodaj Pytanie
                </button>
            </div>

            <div className="overflow-hidden bg-white shadow sm:rounded-lg border border-gray-200">
                <ul className="divide-y divide-gray-200">
                    {faqs.map((faq) => (
                        <li key={faq.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                    {faq.order}
                                </span>
                                <div>
                                    <p className="font-medium text-gray-900">{faq.question}</p>
                                    <p className="text-sm text-gray-500 line-clamp-1">{faq.answer}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleEdit(faq)}
                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(faq.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </li>
                    ))}
                    {faqs.length === 0 && (
                        <li className="p-8 text-center text-gray-500">
                            Brak pytań. Dodaj pierwsze pytanie!
                        </li>
                    )}
                </ul>
            </div>

            {isFormOpen && (
                <FAQForm
                    faq={editingFaq}
                    onClose={() => setIsFormOpen(false)}
                    onSave={onSave}
                />
            )}
        </div>
    );
}
