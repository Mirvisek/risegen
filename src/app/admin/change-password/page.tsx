"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";

export default function ChangePasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (!res.ok) throw new Error("Wystąpił błąd");

            // Password changed, simple reload to refresh session or re-login?
            // Usually session update is tricky client side without full reload.
            // Simplest flow: Sign out and ask to login again with new password.
            // Or force session update.
            // Let's try to reload. If session token still has old 'mustChangePassword', middleware will catch.
            // We need to update user session.

            // Actually, signOut and login again is safest for security.
            await signOut({ callbackUrl: "/auth/login" });

        } catch (err) {
            setError("Nie udało się zmienić hasła.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Wymagana zmiana hasła
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Twoje hasło jest tymczasowe lub wygasło. Ustaw nowe hasło, aby kontynuować.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Nowe Hasło
                        </label>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Zmień hasło"}
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                </form>
            </div>
        </div>
    );
}
