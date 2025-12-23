"use client";

import { useActionState, useState } from "react";
import { updateAccessibilityDeclaration } from "@/app/admin/wyglad/actions";
import { Loader2, Save, FileText, CheckCircle, Info } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor").then((mod) => mod.default),
    { ssr: false }
);

interface Props {
    config: any;
}

export function AccessibilityDeclarationForm({ config }: Props) {
    const [state, formAction, isPending] = useActionState(updateAccessibilityDeclaration, null);
    const [content, setContent] = useState(config?.accessibilityDeclarationContent || "");
    const { resolvedTheme } = useTheme();

    const handleSubmit = async (formData: FormData) => {
        formData.set("accessibilityDeclarationContent", content);
        return formAction(formData);
    };

    return (
        <form action={handleSubmit} className="space-y-8 max-w-5xl">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6 transition-colors">
                {state?.message && (
                    <div className={`p-4 rounded-lg flex items-center gap-2 ${state.success ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"}`}>
                        {state.success ? <CheckCircle className="h-5 w-5" /> : <Info className="h-5 w-5" />}
                        {state.message}
                    </div>
                )}

                <div className="border-b dark:border-gray-700 pb-4 mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        Deklaracja Dostępności
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Skonfiguruj dane o dostępności architektonicznej oraz pełną treść deklaracji dostępności zgodną z wymogami prawnymi.
                    </p>
                </div>

                <div className="space-y-4">
                    <label htmlFor="accessibilityInfo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Informacja o Dostępności Architektonicznej (Skrócona)
                    </label>
                    <textarea
                        name="accessibilityInfo"
                        id="accessibilityInfo"
                        rows={4}
                        defaultValue={config?.accessibilityInfo || ""}
                        placeholder="Opisz dostępność architektoniczną siedziby (rampa, winda, szerokie drzwi, itp.)"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Krótki opis techniczny dotyczący fizycznego dostępu do budynku.
                    </p>
                </div>

                <div className="pt-6 border-t dark:border-gray-700">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                        Pełna treść Deklaracji Dostępności (Markdown)
                    </label>
                    <div data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}>
                        <MDEditor
                            value={content}
                            onChange={(val) => setContent(val || "")}
                            height={600}
                            preview="edit"
                        />
                    </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-200 dark:border-amber-800/30">
                    <h4 className="font-semibold text-amber-900 dark:text-amber-400 mb-1 flex items-center gap-2 text-sm">
                        <Info className="h-4 w-4" />
                        Wymagania prawne
                    </h4>
                    <p className="text-xs text-amber-800 dark:text-amber-300/80">
                        Deklaracja dostępności musi być sporządzona zgodnie z ustawą z dnia 4 kwietnia 2019 r. o dostępności cyfrowej stron internetowych i aplikacji mobilnych podmiotów publicznych.
                        Upewnij się, że treść zawiera datę publikacji, datę ostatniego przeglądu oraz kontakt do osoby odpowiedzialnej.
                    </p>
                </div>

                <div className="flex justify-end pt-6 border-t dark:border-gray-700">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 font-medium shadow-sm"
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {isPending ? "Zapisywanie..." : "Zapisz Deklarację"}
                    </button>
                </div>
            </div>
        </form>
    );
}
