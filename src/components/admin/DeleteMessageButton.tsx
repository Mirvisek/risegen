"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteMessage } from "@/app/admin/wiadomosci/actions";
import { DeleteConfirmationModal } from "@/components/admin/DeleteConfirmationModal";

export function DeleteMessageButton({ id }: { id: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("id", id);

        await deleteMessage(formData);

        setIsLoading(false);
        setIsModalOpen(false);
    };

    return (
        <>
            <button
                type="button"
                title="Usuń wiadomość"
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                onClick={() => setIsModalOpen(true)}
            >
                <Trash2 className="h-5 w-5" />
            </button>

            <DeleteConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                title="Usuń wiadomość"
                description={
                    <span>
                        Czy na pewno chcesz usunąć tę wiadomość? <br />
                        Tej operacji nie można cofnąć.
                    </span>
                }
                loading={isLoading}
            />
        </>
    );
}
