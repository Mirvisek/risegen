"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import { deleteUser } from "@/app/admin/users/actions";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

interface UserListActionsProps {
    userId: string;
    userEmail: string;
    userName?: string | null;
}

export function UserListActions({ userId, userEmail, userName }: UserListActionsProps) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    if (userEmail === "admin@risegen.pl") return null;

    const handleDelete = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("id", userId);
        await deleteUser(formData);
        setLoading(false);
        setIsDeleteOpen(false);
    };

    return (
        <div className="flex items-center justify-end gap-2">
            <Link href={`/admin/users/${userId}`} className="p-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition" title="Edytuj">
                <Edit className="h-5 w-5" />
            </Link>

            <button
                type="button"
                className="p-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition"
                title="Usuń"
                onClick={() => setIsDeleteOpen(true)}
            >
                <Trash2 className="h-5 w-5" />
            </button>

            <DeleteConfirmationModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Usuń użytkownika"
                description={
                    <>
                        Czy na pewno chcesz usunąć użytkownika <span className="font-bold text-gray-800 dark:text-white">{userName || userEmail}</span>?
                        <br />
                        Tej operacji nie można cofnąć.
                    </>
                }
                loading={loading}
            />
        </div>
    );
}
