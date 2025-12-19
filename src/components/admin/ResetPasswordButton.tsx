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
                className="text-indigo-600 hover:text-indigo-900 ml-4"
                title="Resetuj hasło"
            >
                <KeyRound className="h-5 w-5" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-sm relative">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h3 className="text-lg font-bold mb-4">Reset hasła: {userName || "Użytkownik"}</h3>

                        {success ? (
                            <div className="text-green-600 font-medium text-center py-4">Hasło zmienione pomyślnie!</div>
                        ) : (
                            <form onSubmit={handleReset} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Nowe Hasło Tymczasowe</label>
                                    <input
                                        type="text"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full border p-2 rounded mt-1"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-indigo-600 text-white py-2 rounded disabled:opacity-50"
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
