"use client";

import { useState } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { useActionState } from "react";
import { requestPasswordReset } from "./actions";

const initialState = {
    message: "",
    success: false,
};

export default function ResetPasswordPage() {
    const [state, formAction, isPending] = useActionState(requestPasswordReset, initialState);

    // We can use state.success to show different UI or redirect

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl">
                <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Resetowanie hasła</h2>
                    <p className="mt-2 text-sm text-gray-600">Podaj email, aby odzyskać dostęp</p>
                </div>

                {state?.message ? (
                    <div className={`p-4 rounded-md text-sm ${state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {state.message}
                    </div>
                ) : null}

                {!state?.success && (
                    <form action={formAction} className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-3 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
                            >
                                {isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Wyślij instrukcje"}
                            </button>
                        </div>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <Link href="/auth/login" className="flex items-center justify-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        <ArrowLeft className="h-4 w-4" />
                        Wróć do logowania
                    </Link>
                </div>
            </div>
        </div>
    );
}
