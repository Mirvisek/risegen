"use client";

import { useTransition, useState } from "react";
import { deleteTeamMember } from "@/app/admin/o-nas/actions";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

export function DeleteTeamMemberButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleDelete = () => {
        startTransition(async () => {
            await deleteTeamMember(id);
            setIsOpen(false);
            router.refresh(); // Ensure list refresh
        });
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                disabled={isPending}
                className="text-red-600 hover:text-red-900 p-1"
            >
                {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
            </button>

            <DeleteConfirmationModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={handleDelete}
                title="Usuń członka zespołu"
                description={
                    <>
                        Czy na pewno chcesz usunąć tę osobę?<br />
                        Tej operacji nie można cofnąć.
                    </>
                }
                loading={isPending}
            />
        </>
    );
}
