"use client";

import { useActionState, useEffect } from "react";
import { updateCodeInjection } from "@/app/admin/wyglad/actions";
import { Loader2, Save, Code, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
    config: any; // Could be typed more strictly, but keeping it flexible for now 
}

export function CodeInjectionForm({ config }: Props) {
    const [state, formAction, isPending] = useActionState(updateCodeInjection, null);
    const router = useRouter();

    useEffect(() => {
        if (state?.message) {
            if (state.success) {
                toast.success(state.message);
                router.refresh(); // Force refresh to update config prop
            } else {
                toast.error(state.message);
            }
        }
    }, [state, router]);

    return (
        <form action={formAction} className="space-y-6 max-w-4xl bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
            {/* state message handled by toast, but keeping inline for legacy/backup */}

            <div className="border-b dark:border-gray-700 pb-4 mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <Code className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Integracje i Kody (Head / Body)
                </h3>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-200 dark:border-blue-800/30 mb-6">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">Google reCAPTCHA</h4>

                <div className="mb-4">
                    <label htmlFor="recaptchaVersion" className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                        Wersja reCAPTCHA
                    </label>
                    <select
                        name="recaptchaVersion"
                        id="recaptchaVersion"
                        defaultValue={config?.recaptchaVersion || "v2"}
                        className="block w-full rounded-md border-blue-300 dark:border-blue-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                    >
                        <option value="v2">reCAPTCHA v2 (Checkbox)</option>
                        <option value="v3">reCAPTCHA v3 (Invisible)</option>
                    </select>
                    <p className="text-xs text-blue-700 dark:text-blue-300/70 mt-1">
                        v2: Wymaga kliknięcia "Nie jestem robotem". v3: Działa w tle, ocenia zachowanie użytkownika.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="recaptchaSiteKey" className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                            Site Key (Klucz Witryny)
                        </label>
                        <input
                            type="text"
                            name="recaptchaSiteKey"
                            id="recaptchaSiteKey"
                            defaultValue={config?.recaptchaSiteKey || ""}
                            className="block w-full rounded-md border-blue-300 dark:border-blue-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                        />
                    </div>
                    <div>
                        <label htmlFor="recaptchaSecretKey" className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                            Secret Key (Klucz Tajny)
                        </label>
                        <input
                            type="text"
                            name="recaptchaSecretKey"
                            id="recaptchaSecretKey"
                            defaultValue={config?.recaptchaSecretKey || ""}
                            className="block w-full rounded-md border-blue-300 dark:border-blue-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-lg border border-orange-200 dark:border-orange-800/30 mb-6">
                <h4 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">Google Analytics 4 (GA4)</h4>
                <div>
                    <label htmlFor="googleAnalyticsId" className="block text-sm font-medium text-orange-800 dark:text-orange-200 mb-1">
                        Measurement ID (Identyfikator Pomiaru)
                    </label>
                    <input
                        type="text"
                        name="googleAnalyticsId"
                        id="googleAnalyticsId"
                        defaultValue={config?.googleAnalyticsId || ""}
                        placeholder="G-XXXXXXXXXX"
                        className="block w-full rounded-md border-orange-300 dark:border-orange-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                    />
                    <p className="text-xs text-orange-700 dark:text-orange-300/70 mt-1">Wpisz identyfikator "G-...", aby włączyć Google Analytics.</p>
                </div>
            </div>



            <div className="flex justify-end pt-6 border-t dark:border-gray-700 mt-4">
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
