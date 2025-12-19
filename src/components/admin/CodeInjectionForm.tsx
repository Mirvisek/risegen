"use client";

import { useActionState } from "react";
import { updateCodeInjection } from "@/app/admin/wyglad/actions";
import { Loader2, Save, Code, CheckCircle } from "lucide-react";

interface Props {
    config: any;
}

export function CodeInjectionForm({ config }: Props) {
    const [state, formAction, isPending] = useActionState(updateCodeInjection, null);

    return (
        <form action={formAction} className="space-y-6 max-w-4xl bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            {state?.message && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${state.success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    {state.success ? <CheckCircle className="h-5 w-5" /> : <Code className="h-5 w-5" />}
                    {state.message}
                </div>
            )}

            <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Code className="h-5 w-5 text-indigo-600" />
                    Integracje i Kody (Head / Body)
                </h3>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">Google reCAPTCHA v2</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="recaptchaSiteKey" className="block text-sm font-medium text-blue-800 mb-1">
                            Site Key (Klucz Witryny)
                        </label>
                        <input
                            type="text"
                            name="recaptchaSiteKey"
                            id="recaptchaSiteKey"
                            defaultValue={config?.recaptchaSiteKey || ""}
                            className="block w-full rounded-md border-blue-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label htmlFor="recaptchaSecretKey" className="block text-sm font-medium text-blue-800 mb-1">
                            Secret Key (Klucz Tajny)
                        </label>
                        <input
                            type="text"
                            name="recaptchaSecretKey"
                            id="recaptchaSecretKey"
                            defaultValue={config?.recaptchaSecretKey || ""}
                            className="block w-full rounded-md border-blue-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-6">
                <h4 className="font-semibold text-orange-900 mb-2">Google Analytics 4 (GA4)</h4>
                <div>
                    <label htmlFor="googleAnalyticsId" className="block text-sm font-medium text-orange-800 mb-1">
                        Measurement ID (Identyfikator Pomiaru)
                    </label>
                    <input
                        type="text"
                        name="googleAnalyticsId"
                        id="googleAnalyticsId"
                        defaultValue={config?.googleAnalyticsId || ""}
                        placeholder="G-XXXXXXXXXX"
                        className="block w-full rounded-md border-orange-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                    <p className="text-xs text-orange-700 mt-1">Wpisz identyfikator "G-...", aby włączyć Google Analytics.</p>
                </div>
            </div>



            <div className="flex justify-end pt-6 border-t mt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 font-medium shadow-sm"
                >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {isPending ? "Zapisywanie..." : "Zapisz Kody"}
                </button>
            </div>
        </form>
    );
}
