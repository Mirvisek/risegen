"use client";

import { useActionState, useState, useEffect } from "react";
import { updateAboutText } from "@/app/admin/o-nas/actions";
import { Loader2, Save, Check, AlertCircle } from "lucide-react";
import { useFormStatus } from "react-dom";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor").then((mod) => mod.default),
    { ssr: false }
);

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
            {pending ? (
                <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Zapisywanie...
                </>
            ) : (
                <>
                    <Save className="-ml-1 mr-2 h-4 w-4" />
                    Zapisz
                </>
            )}
        </button>
    );
}

function FormFeedback({ state }: { state: any }) {
    if (!state?.message) return null;

    return (
        <div className={`mt-4 p-4 rounded-md ${state.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            <div className="flex">
                <div className="flex-shrink-0">
                    {state.success ? (
                        <Check className="h-5 w-5 text-green-400" aria-hidden="true" />
                    ) : (
                        <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                    )}
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium">{state.message}</p>
                </div>
            </div>
        </div>
    );
}

interface AboutTextFormProps {
    initialText?: string | null;
    initialGoals?: string | null;
    initialJoinText?: string | null;
}

export function AboutTextForm({ initialText, initialGoals, initialJoinText }: AboutTextFormProps) {
    const [state, action] = useActionState(updateAboutText, null);
    const [text, setText] = useState(initialText || "");
    const [goals, setGoals] = useState(initialGoals || "");
    const [joinText, setJoinText] = useState(initialJoinText || "");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (formData: FormData) => {
        formData.set("aboutUsText", text);
        formData.set("aboutUsGoals", goals);
        formData.set("aboutUsJoinText", joinText);
        return action(formData);
    };

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Teksty z menu „O Nas”</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Zarządzaj treściami wyświetlanymi na stronie "O Nas".
                        </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2 space-y-6">
                        <div>
                            <label htmlFor="aboutUsText" className="block text-sm font-medium text-gray-700 mb-2">
                                Treść powitalna
                            </label>
                            {mounted ? (
                                <div data-color-mode="light">
                                    <MDEditor
                                        value={text}
                                        onChange={(val) => setText(val || "")}
                                        height={400}
                                        preview="edit"
                                        hideToolbar={false}
                                        enableScroll={true}
                                        visibleDragbar={false}
                                    />
                                </div>
                            ) : (
                                <div className="border border-gray-300 rounded-md p-4 bg-gray-50 h-[400px] flex items-center justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                </div>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                                Użyj formatowania Markdown dla głównej treści strony O Nas.
                            </p>
                        </div>

                        <div>
                            <label htmlFor="aboutUsGoals" className="block text-sm font-medium text-gray-700 mb-2">
                                Nasze Cele (Lista)
                            </label>
                            {mounted ? (
                                <div className="mt-1" data-color-mode="light">
                                    <MDEditor
                                        value={goals}
                                        onChange={(val) => setGoals(val || "")}
                                        height={300}
                                        preview="edit"
                                        hideToolbar={false}
                                        enableScroll={true}
                                        visibleDragbar={false}
                                    />
                                </div>
                            ) : (
                                <div className="border border-gray-300 rounded-md p-4 bg-gray-50 h-[300px] flex items-center justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                </div>
                            )}
                            <p className="mt-2 text-sm text-gray-500">
                                Użyj formatowania Markdown. Dla listy punktowanej użyj: - element
                            </p>
                        </div>

                        <div>
                            <label htmlFor="aboutUsJoinText" className="block text-sm font-medium text-gray-700 mb-2">
                                Tekst "Dołącz do nas"
                            </label>
                            {mounted ? (
                                <div data-color-mode="light">
                                    <MDEditor
                                        value={joinText}
                                        onChange={(val) => setJoinText(val || "")}
                                        height={300}
                                        preview="edit"
                                        hideToolbar={false}
                                        enableScroll={true}
                                        visibleDragbar={false}
                                    />
                                </div>
                            ) : (
                                <div className="border border-gray-300 rounded-md p-4 bg-gray-50 h-[300px] flex items-center justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                </div>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                                Użyj formatowania Markdown dla sekcji "Dołącz do nas".
                            </p>
                        </div>

                        <div className="flex justify-end">
                            <SubmitButton />
                        </div>

                        <FormFeedback state={state} />
                    </div>
                </div>
            </div>
        </form>
    );
}
