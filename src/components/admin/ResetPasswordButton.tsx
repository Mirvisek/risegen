"use client";

import { useState } from "react";
import { KeyRound, Loader2, X } from "lucide-react";

export function ResetPasswordButton({ userId, userName }: { userId: string, userName: string | null }) {
    const [isOpen, setIsOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleReset(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/users/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, newPassword: password }),
            });
            if (!res.ok) throw new Error();
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setIsOpen(false);
                setPassword("");
            }, 2000);
        } catch (err) {
            alert("Błąd resetowania hasła");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 ml-4 transition-colors"
                title="Resetuj hasło"
            >
                <KeyRound className="h-5 w-5" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-sm relative shadow-xl border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in duration-200 transition-colors">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Reset hasła: {userName || "Użytkownik"}</h3>

                        {success ? (
                            <div className="text-green-600 dark:text-green-400 font-medium text-center py-4">Hasło zmienione pomyślnie!</div>
                        ) : (
                            <form onSubmit={handleReset} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nowe Hasło Tymczasowe</label>
                                    <input
                                        type="text"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                >
                                    {loading ? "Zapisywanie..." : "Ustaw nowe hasło"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
