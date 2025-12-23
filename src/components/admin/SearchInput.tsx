"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function SearchInput({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("q", term);
        } else {
            params.delete("q");
        }
        replace(`?${params.toString()}`);
    }, 300);

    return (
        <div className="flex items-center gap-3 max-w-sm">
            <Search className="h-4 w-4 text-gray-500 dark:text-gray-400 shrink-0" />
            <div className="relative flex-1">
                <label htmlFor="search" className="sr-only">
                    Szukaj
                </label>
                <input
                    id="search"
                    className="block w-full rounded-md border-0 py-1.5 px-0 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 sm:text-sm sm:leading-6 pl-2 pr-2 transition-colors"
                    placeholder={placeholder}
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get("q")?.toString()}
                />
            </div>
        </div>
    );
}
