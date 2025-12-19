"use client";

import { useState, useTransition } from "react";
import { deleteApplication } from "@/app/admin/zgloszenia/actions";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

interface Props {
    id: string;
}

export function DeleteApplicationButton({ id }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = async () => {
        if (!reason.trim()) return;

        startTransition(async () => {
            const result = await deleteApplication(id, reason);
            if (result.success) {
                setIsOpen(false);
                router.refresh();
            } else {
                alert("Wystąpił błąd podczas usuwania.");
            }
        });
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition border border-transparent hover:border-red-100"
            >
                <Trash2 className="h-4 w-4" />
                Usuń zgłoszenie
            </button>

            <DeleteConfirmationModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={handleDelete}
                title="Usuń zgłoszenie"
                description='Ta operacja zmieni status zgłoszenia na "Usunięte". Wpisz powód usunięcia.'
                loading={isPending}
                confirmText="Potwierdź usunięcie"
            >
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Powód usunięcia (np. spam, duplikat, rezygnacja)..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-sm mt-3"
                    rows={3}
                    autoFocus
                />
            </DeleteConfirmationModal>
        </>
    );
}
