"use client";

import { useTransition } from "react";
import { updateApplicationStatus } from "@/app/admin/zgloszenia/actions";
import { Loader2 } from "lucide-react";

interface Props {
    id: string;
    currentStatus: string;
}

const STATUS_OPTIONS = [
    { value: "NEW", label: "Nowe", color: "text-blue-600 bg-blue-50" },
    { value: "READ", label: "Zapoznane", color: "text-yellow-600 bg-yellow-50" },
    { value: "IN_PROGRESS", label: "W realizacji", color: "text-purple-600 bg-purple-50" },
    { value: "DONE", label: "Zakończone", color: "text-green-600 bg-green-50" },
];

export function ApplicationStatusSelect({ id, currentStatus }: Props) {
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        startTransition(async () => {
            await updateApplicationStatus(id, newStatus);
        });
    };

    const currentOption = STATUS_OPTIONS.find(o => o.value === currentStatus) || STATUS_OPTIONS[0];

    return (
        <div className="relative flex items-center gap-2">
            <select
                value={currentStatus}
                onChange={handleChange}
                disabled={isPending}
                className={`block w-full rounded-md border-0 py-1.5 pl-3 pr-8 text-xs font-medium ring-1 ring-inset focus:ring-2 sm:text-sm sm:leading-6 cursor-pointer ${currentOption.color} ${isPending ? 'opacity-50' : ''}`}
            >
                {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-white text-gray-900">
                        {option.label}
                    </option>
                ))}
            </select>
            {isPending && <Loader2 className="absolute right-8 h-3 w-3 animate-spin text-gray-500" />}
        </div>
    );
}
