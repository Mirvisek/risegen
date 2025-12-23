"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteProject } from "@/app/admin/projekty/actions";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("id", projectId);
        await deleteProject(formData);
        setLoading(false);
        setIsOpen(false);
    };

    return (
        <>
            <button
                type="button"
                className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                onClick={() => setIsOpen(true)}
                title="Usuń projekt"
            >
                <Trash2 className="h-5 w-5" />
            </button>

            <DeleteConfirmationModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={handleDelete}
                title="Usuń projekt"
                description="Czy na pewno chcesz usunąć ten projekt? Tej operacji nie można cofnąć."
                loading={loading}
            />
        </>
    );
}
