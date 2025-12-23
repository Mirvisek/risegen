"use client";

import { useState, useActionState } from "react";
import { updateNavigation } from "@/app/admin/wyglad/actions";
import { Loader2, Plus, Trash2, Check, AlertCircle } from "lucide-react";

interface Sublink {
    name: string;
    href: string;
}

interface Props {
    config: {
        aboutUsSublinks?: string | null;
    } | null;
}

const initialState = {
    success: false,
    message: "",
};

function FormFeedback({ state }: { state: typeof initialState }) {
    if (!state?.message) return null;

    if (state.success) {
        return (
            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 p-4 mb-4 rounded-md flex items-center gap-3">
                <Check className="h-5 w-5 text-green-400" />
                <p className="text-sm text-green-700 dark:text-green-400">{state.message}</p>
            </div>
        );
    }

    return (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 mb-4 rounded-md">
            <p className="text-sm text-red-700 dark:text-red-400">{state.message}</p>
        </div>
    );
}

export function AppearanceNavigationForm({ config }: Props) {
    const [state, formAction, isPending] = useActionState(updateNavigation, initialState);

    // Parse initial links or default
    const defaultLinks: Sublink[] = [
        { name: "Poznaj Nasz Zespół", href: "/o-nas/zespol" },
        { name: "Dokumenty", href: "/o-nas/dokumenty" },
        { name: "Pytania i Odpowiedzi (FAQ)", href: "/o-nas/faq" }
    ];

    const [links, setLinks] = useState<Sublink[]>(() => {
        try {
            return config?.aboutUsSublinks ? JSON.parse(config.aboutUsSublinks) : defaultLinks;
        } catch (e) {
            return defaultLinks;
        }
    });

    const addLink = () => {
        setLinks([...links, { name: "", href: "" }]);
    };

    const removeLink = (index: number) => {
        setLinks(links.filter((_, i) => i !== index));
    };

    const updateLink = (index: number, field: keyof Sublink, value: string) => {
        const newLinks = [...links];
        newLinks[index][field] = value;
        setLinks(newLinks);
    };

    return (
        <form action={formAction} className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6 space-y-6 border border-gray-100 dark:border-gray-800 transition-colors">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white border-b dark:border-gray-800 pb-2">Nawigacja: Menu "O Nas"</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Zarządzaj podzakładkami wyświetlanymi w rozwijanym menu "O Nas".</p>

            <FormFeedback state={state} />

            <input type="hidden" name="aboutUsSublinks" value={JSON.stringify(links)} />

            <div className="space-y-4">
                {links.map((link, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 transition-colors">
                        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Nazwa</label>
                                <input
                                    type="text"
                                    value={link.name}
                                    onChange={(e) => updateLink(index, "name", e.target.value)}
                                    placeholder="np. Nasz Zespół"
                                    required
                                    className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Link (URL)</label>
                                <input
                                    type="text"
                                    value={link.href}
                                    onChange={(e) => updateLink(index, "href", e.target.value)}
                                    placeholder="np. /o-nas/zespol"
                                    required
                                    className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors"
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => removeLink(index)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition self-end sm:self-center"
                            title="Usuń link"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center pt-4">
                <button
                    type="button"
                    onClick={addLink}
                    className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium text-sm transition-colors"
                >
                    <Plus className="h-4 w-4" /> Dodaj kolejną zakładkę
                </button>

                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex justify-center items-center gap-2 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {isPending && <Loader2 className="animate-spin h-4 w-4" />}
                    {isPending ? "Zapisywanie..." : "Zapisz Menu"}
                </button>
            </div>
        </form>
    );
}
