"use client";

import { useState, useTransition } from "react";
import { deleteApplicationPermanently } from "@/app/admin/zgloszenia/actions";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

interface Props {
    id: string;
}

export function PermanentDeleteButton({ id }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = async () => {
        startTransition(async () => {
            const result = await deleteApplicationPermanently(id);
            if (result.success) {
                router.push("/admin/zgloszenia");
                router.refresh();
            } else {
                alert("Błąd: " + (result.error || "Wystąpił błąd."));
                setIsOpen(false);
            }
        });
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-700 hover:bg-red-800 rounded-md transition disabled:opacity-50 w-full justify-center shadow-sm"
            >
                <Trash2 className="h-4 w-4" />
                USUŃ TRWALE (ADMIN)
            </button>

            <DeleteConfirmationModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={handleDelete}
                title="TRWAŁE usunięcie zgłoszenia"
                description={
                    <>
                        Tej operacji <strong>nie można cofnąć</strong>.<br />
                        Zgłoszenie zostanie całkowicie wymazane z bazy danych.<br />
                        Czy na pewno chcesz to zrobić?
                    </>
                }
                loading={isPending}
                confirmText="TAK, USUŃ NA ZAWSZE"
            />
        </>
    );
}
