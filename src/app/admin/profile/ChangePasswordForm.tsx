"use client";

import { useActionState } from "react";
import { changePassword } from "./actions"; // Import from sibling actions.ts
import { Loader2, KeyRound } from "lucide-react";

const initialState = {
    message: "",
    errors: undefined as Record<string, string[] | undefined> | undefined,
    success: false,
};

export function ChangePasswordForm() {
    const [state, formAction, isPending] = useActionState(changePassword, initialState);

    return (
        <form action={formAction} className="bg-white shadow sm:rounded-lg p-6 space-y-6 max-w-xl">
            <div className="flex items-center gap-3 border-b pb-4 mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <KeyRound className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-lg font-medium text-gray-900">Zmiana Hasła</h2>
                    <p className="text-sm text-gray-500">Wprowadź nowe hasło, aby zaktualizować swoje konto.</p>
                </div>
            </div>

            {state?.success && (
                <div className="bg-green-50 text-green-700 p-4 rounded-md text-sm border-l-4 border-green-400">
                    {state.message}
                </div>
            )}

            {state?.message && !state.success && (
                <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm border-l-4 border-red-400">
                    {state.message}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Obecne Hasło</label>
                    <input
                        type="password"
                        name="currentPassword"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        required
                    />
                    {state?.errors?.currentPassword && <p className="text-xs text-red-500 mt-1">{state.errors.currentPassword}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Nowe Hasło</label>
                    <input
                        type="password"
                        name="newPassword"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        required
                        minLength={6}
                    />
                    {state?.errors?.newPassword && <p className="text-xs text-red-500 mt-1">{state.errors.newPassword}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Potwierdź Nowe Hasło</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        required
                        minLength={6}
                    />
                    {state?.errors?.confirmPassword && <p className="text-xs text-red-500 mt-1">{state.errors.confirmPassword}</p>}
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex justify-center items-center gap-2 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {isPending && <Loader2 className="animate-spin h-4 w-4" />}
                    {isPending ? "Zmienianie..." : "Zmień Hasło"}
                </button>
            </div>
        </form>
    );
}
