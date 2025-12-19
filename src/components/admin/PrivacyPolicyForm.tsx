"use client";

import { useActionState, useState } from "react";
import { updatePrivacyPolicy } from "@/app/admin/wyglad/actions";
import { Loader2, Save, FileText, CheckCircle } from "lucide-react";
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

export function PrivacyPolicyForm({ config }: Props) {
    const [state, formAction, isPending] = useActionState(updatePrivacyPolicy, null);
    const [content, setContent] = useState(config?.privacyPolicyContent || "");

    const handleSubmit = async (formData: FormData) => {
        formData.set("privacyPolicyContent", content);
        return formAction(formData);
    };

    return (
        <form action={handleSubmit} className="space-y-6 max-w-5xl bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            {state?.message && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${state.success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    {state.success ? <CheckCircle className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                    {state.message}
                </div>
            )}

            <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    Polityka Prywatności
                </h3>
                <p className="text-sm text-gray-600">
                    Edytuj treść polityki prywatności wyświetlanej na stronie. Pozostaw puste, aby użyć domyślnej treści.
                </p>
            </div>

            <div>
                <label htmlFor="privacyPolicyContent" className="block text-sm font-medium text-gray-700 mb-2">
                    Treść Polityki Prywatności
                </label>
                <div data-color-mode="light">
                    <MDEditor
                        value={content}
                        onChange={(val) => setContent(val || "")}
                        height={500}
                        preview="edit"
                        hideToolbar={false}
                        enableScroll={true}
                        visibleDragbar={false}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    Użyj formatowania Markdown. Domyślna treść zawiera standardowe informacje RODO.
                </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Wskazówka</h4>
                <p className="text-sm text-blue-800 mb-2">
                    Polityka prywatności jest wymagana prawnie (RODO). Jeśli nie wprowadzisz własnej treści,
                    użyta zostanie domyślna polityka zawierająca podstawowe informacje.
                </p>
                <p className="text-sm text-blue-700">
                    <strong>Formatowanie Markdown:</strong> Możesz użyć nagłówków (#), list (-, *), pogrubienia (**tekst**), kursywy (*tekst*) i innych elementów.
                </p>
            </div>

            <div className="flex justify-end pt-6 border-t mt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 font-medium shadow-sm"
                >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {isPending ? "Zapisywanie..." : "Zapisz Politykę"}
                </button>
            </div>
        </form>
    );
}
