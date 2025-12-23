"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function LimitSelector({ currentLimit }: { currentLimit: number }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = e.target.value;
        const params = new URLSearchParams(searchParams.toString());
        params.set("limit", newLimit);
        params.set("page", "1"); // Reset to page 1 when limit changes
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Pokaż na stronie:</span>
            <select
                value={currentLimit}
                onChange={handleChange}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900 dark:text-gray-100"
            >
                {[5, 10, 15, 20, 25].map((val) => (
                    <option key={val} value={val}>
                        {val}
                    </option>
                ))}
            </select>
        </div>
    );
}
