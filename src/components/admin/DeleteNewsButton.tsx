"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteNews } from "@/app/admin/aktualnosci/actions";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

export function DeleteNewsButton({ id }: { id: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("id", id);
        await deleteNews(formData);
        setLoading(false);
        setIsOpen(false);
    };

    return (
        <>
            <button
                type="button"
                className="text-red-600 hover:text-red-900 p-1 transition"
                onClick={() => setIsOpen(true)}
                title="Usuń aktualność"
            >
                <Trash2 className="h-4 w-4" />
            </button>

            <DeleteConfirmationModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={handleDelete}
                title="Usuń aktualność"
                description={
                    <>
                        Czy na pewno chcesz usunąć tę aktualność?<br />
                        Tej operacji nie można cofnąć.
                    </>
                }
                loading={loading}
            />
        </>
    );
}
