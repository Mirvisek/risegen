"use client";

import { useActionState } from "react";
import { updateTeamSettings } from "@/app/admin/o-nas/actions";
import { Loader2, Save } from "lucide-react";

interface Props {
    config: {
        showBoard: boolean;
        showOffice: boolean;
        showCoordinators: boolean;
        showCollaborators: boolean;
    } | null;
}

const initialState = {
    success: false,
    message: "",
};

export function TeamSettingsForm({ config }: Props) {
    const [state, formAction, isPending] = useActionState(updateTeamSettings, initialState);

    return (
        <form action={formAction} className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 transition-colors">
            <div className="space-y-4">
                <div className="flex items-start">
                    <div className="flex h-5 items-center">
                        <input
                            id="showBoard"
                            name="showBoard"
                            type="checkbox"
                            defaultChecked={config?.showBoard ?? true}
                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-indigo-600 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="showBoard" className="font-medium text-gray-700 dark:text-gray-300">Zarząd</label>
                        <p className="text-gray-500 dark:text-gray-400">Sekcja z prezesem i wiceprezesami.</p>
                    </div>
                </div>

                <div className="flex items-start">
                    <div className="flex h-5 items-center">
                        <input
                            id="showOffice"
                            name="showOffice"
                            type="checkbox"
                            defaultChecked={config?.showOffice ?? true}
                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-indigo-600 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="showOffice" className="font-medium text-gray-700 dark:text-gray-300">Biuro</label>
                        <p className="text-gray-500 dark:text-gray-400">Sekcja pracowników administracyjnych.</p>
                    </div>
                </div>

                <div className="flex items-start">
                    <div className="flex h-5 items-center">
                        <input
                            id="showCoordinators"
                            name="showCoordinators"
                            type="checkbox"
                            defaultChecked={config?.showCoordinators ?? true}
                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-indigo-600 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="showCoordinators" className="font-medium text-gray-700 dark:text-gray-300">Koordynatorzy</label>
                        <p className="text-gray-500 dark:text-gray-400">Osoby odpowiedzialne za projekty.</p>
                    </div>
                </div>

                <div className="flex items-start">
                    <div className="flex h-5 items-center">
                        <input
                            id="showCollaborators"
                            name="showCollaborators"
                            type="checkbox"
                            defaultChecked={config?.showCollaborators ?? true}
                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-indigo-600 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="showCollaborators" className="font-medium text-gray-700 dark:text-gray-300">Współpracownicy</label>
                        <p className="text-gray-500 dark:text-gray-400">Partnerzy i inni członkowie zespołu.</p>
                    </div>
                </div>
            </div>

            {state?.message && (
                <p className={`text-sm ${state.success ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {state.message}
                </p>
            )}

            <div className="pt-4 flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 transition-colors"
                >
                    {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                    Zapisz ustawienia
                </button>
            </div>
        </form>
    );
}
