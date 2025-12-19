"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function NewUserForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const selectedRoles = formData.getAll('roles'); // Get all checked values

        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
            roles: JSON.stringify(selectedRoles), // Send as JSON string
        };

        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Błąd podczas tworzenia użytkownika");
            }

            router.push("/admin/users");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Wystąpił błąd.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md bg-white p-6 rounded-xl shadow-sm border">
            {error && <div className="text-red-500">{error}</div>}

            <div>
                <label className="block text-sm font-medium text-gray-700">Nazwa wyświetlana</label>
                <input name="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input name="email" type="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Hasło tymczasowe</label>
                <input name="password" type="password" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <div className="space-y-2 border p-3 rounded-md">
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" name="roles" value="ADMIN" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                        <span className="text-sm text-gray-700">Administrator (All except settings)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" name="roles" value="REDAKTOR" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                        <span className="text-sm text-gray-700">Redaktor (News & Projects)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" name="roles" value="REKRUTER" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                        <span className="text-sm text-gray-700">Rekruter (Applications)</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                        * SuperAdmin (admin@risegen.pl) jest przypisywany automatycznie.
                    </p>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
                {loading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : "Dodaj Użytkownika"}
            </button>
        </form>
    );
}
