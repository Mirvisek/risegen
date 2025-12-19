"use client";

import { useTransition } from "react";
import { updateMessageStatus } from "@/app/admin/wiadomosci/actions";
import { Loader2 } from "lucide-react";

const statuses = [
    { value: "NEW", label: "Nowa", color: "bg-blue-100 text-blue-800" },
    { value: "READ", label: "Zapoznana", color: "bg-yellow-100 text-yellow-800" },
    { value: "IN_PROGRESS", label: "W realizacji", color: "bg-purple-100 text-purple-800" },
    { value: "DONE", label: "Zakończona", color: "bg-green-100 text-green-800" },
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
                className={`appearance-none block w-full pl-3 pr-8 py-2 text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-indigo-500 cursor-pointer ${statuses.find(s => s.value === currentStatus)?.color || "bg-gray-100 text-gray-800"
                    }`}
            >
                {statuses.map(s => (
                    <option key={s.value} value={s.value} className="bg-white text-gray-900">
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
