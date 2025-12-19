"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ResetPasswordButton } from "./ResetPasswordButton";

interface EditUserFormProps {
    user: {
        id: string;
        name: string | null;
        email: string;
        roles: string | string[]; // Can be parsing string or array depending on where it comes from, but Prisma query returns object which might need transformation before passing to client component, OR if we pass raw prisma user it is string.
    };
}

export function EditUserForm({ user }: EditUserFormProps) {
    // Parse roles if it's a string (from Prisma/DB directly)
    // If it's already an array (unlikely unless we transformed it), handle it.
    let userRoles: string[] = [];
    try {
        if (Array.isArray(user.roles)) {
            userRoles = user.roles;
        } else if (typeof user.roles === 'string') {
            userRoles = JSON.parse(user.roles);
        }
    } catch (e) {
        userRoles = [];
    }

    // Replace user.roles usages in JSX with userRoles
    // We need to pass a modified object or just use userRoles variable.
    // I will use userRoles variable in the JSX I just wrote (defaultChecked={userRoles.includes(...)})
    // But since I already wrote user.roles.includes in previous step, I need to fix that or user object.
    // Easiest is to cast `user` or make `user` object have parsed roles.

    // Actually, let's just make the prop type looser or correct and then parse.
    const effectiveRoles = userRoles;
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const selectedRoles = formData.getAll('roles');
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            roles: JSON.stringify(selectedRoles),
        };

        try {
            const res = await fetch(`/api/users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Błąd aktualizacji");
            }

            router.push("/admin/users");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Wystąpił błąd podczas zapisu.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/users" className="text-gray-500 hover:text-gray-700">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Edytuj Użytkownika</h1>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border space-y-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <div className="text-red-500">{error}</div>}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email (Login)</label>
                        <input
                            name="email"
                            defaultValue={user.email}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nazwa wyświetlana</label>
                        <input
                            name="name"
                            defaultValue={user.name || ""}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <div className="space-y-2 border p-3 rounded-md">
                            {/* Calculate derived roles for UI state if needed, but for now assuming user.roles is passed correctly as array (it's string in DB, need to parse in parent or here) */}
                            <label className="flex items-center space-x-2">
                                {/* Note: In this component 'user' prop comes from server page which fetches from prisma. 
                               Prisma with SQLite returns 'roles' as string if we defined it as String. 
                               We need to parse it. */}
                                <input
                                    type="checkbox"
                                    name="roles"
                                    value="ADMIN"
                                    defaultChecked={effectiveRoles.includes("ADMIN")}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700">Administrator (All except settings)</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="roles"
                                    value="REDAKTOR"
                                    defaultChecked={effectiveRoles.includes("REDAKTOR")}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700">Redaktor (News & Projects)</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="roles"
                                    value="REKRUTER"
                                    defaultChecked={effectiveRoles.includes("REKRUTER")}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700">Rekruter (Applications)</span>
                            </label>
                            {(user.email === 'admin@risegen.pl' || effectiveRoles.includes("SUPERADMIN")) && (
                                <p className="text-xs text-indigo-600 mt-2 font-medium">
                                    * Ten użytkownik posiada uprawnienia SuperAdmin (dostęp do wszystkiego).
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Zapisz Zmiany"}
                        </button>
                    </div>
                </form>

                <div className="pt-6 border-t space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Strefa Bezpieczeństwa</h3>
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
                        <div>
                            <p className="font-medium text-gray-900">Reset Hasła</p>
                            <p className="text-sm text-gray-500">Wyślij użytkownikowi nowe hasło tymczasowe.</p>
                        </div>
                        <div className="flex items-center">
                            {/* We reuse the component but styling might need adjustment to fit "button" look? 
                                Actually ResetPasswordButton renders a key icon button. 
                                Let's wrap it or modify it? 
                                User asked to HAVE IT HERE. The logic is encapsulated. 
                                It renders a button icon. Maybe better to render a full button here? 
                                Passing a "customButton" prop or just using it as is for now. */}
                            <ResetPasswordButton userId={user.id} userName={user.name} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
