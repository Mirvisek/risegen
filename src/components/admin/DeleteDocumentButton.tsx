"use client";

import { useTransition, useState } from "react";
import { deleteDocument } from "@/app/admin/o-nas/actions";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

export function DeleteDocumentButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleDelete = () => {
        startTransition(async () => {
            await deleteDocument(id);
            setIsOpen(false);
            router.refresh();
        });
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                disabled={isPending}
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 transition-colors"
            >
                {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
            </button>

            <DeleteConfirmationModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={handleDelete}
                title="Usuń dokument"
                description={
                    <>
                        Czy na pewno chcesz usunąć ten dokument?<br />
                        Tej operacji nie można cofnąć.
                    </>
                }
                loading={isPending}
            />
        </>
    );
}
