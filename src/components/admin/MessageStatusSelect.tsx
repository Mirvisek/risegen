"use client";

import { useTransition } from "react";
import { updateMessageStatus } from "@/app/admin/wiadomosci/actions";
import { Loader2 } from "lucide-react";

const statuses = [
    { value: "NEW", label: "Nowa", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300" },
    { value: "READ", label: "Zapoznana", color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300" },
    { value: "IN_PROGRESS", label: "W realizacji", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300" },
    { value: "DONE", label: "Zakończona", color: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300" },
];

export function MessageStatusSelect({ id, currentStatus }: { id: string, currentStatus: string }) {
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        startTransition(async () => {
            const formData = new FormData();
            formData.append("id", id);
            formData.append("status", newStatus);
            await updateMessageStatus(formData);
        });
    };

    return (
        <div className="relative">
            <select
                disabled={isPending}
                value={currentStatus}
                onChange={handleChange}
                className={`appearance-none block w-full pl-3 pr-8 py-2 text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors ${statuses.find(s => s.value === currentStatus)?.color || "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
                    }`}
            >
                {statuses.map(s => (
                    <option key={s.value} value={s.value} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                        {s.label}
                    </option>
                ))}
            </select>
            {isPending && (
                <div className="absolute inset-y-0 right-8 flex items-center">
                    <Loader2 className="h-3 w-3 animate-spin text-gray-500" />
                </div>
            )}
        </div>
    );
}
