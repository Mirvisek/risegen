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

            {/* Google Services Section */}
            <div className="space-y-6">
                <div className="border-b dark:border-gray-800 pb-2">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Usługi Google
                    </h3>
                </div>

                {/* reCAPTCHA Configuration */}
                <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-6">
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <span>🛡️</span> Google reCAPTCHA Enterprise
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Ochrona formularzy przed botami i spamem.
                        </p>
                    </div>

                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800/50 text-sm">
                        <h5 className="font-medium text-indigo-900 dark:text-indigo-300 mb-2">Jak skonfigurować?</h5>
                        <ol className="list-decimal list-inside space-y-1 text-indigo-800 dark:text-indigo-400/80">
                            <li>Wejdź na <a href="https://console.cloud.google.com/security/recaptcha" target="_blank" rel="noreferrer" className="underline hover:text-indigo-600">Google Cloud Console › reCAPTCHA Enterprise</a>.</li>
                            <li>Włącz <strong>reCAPTCHA Enterprise API</strong> dla swojego projektu.</li>
                            <li>Utwórz nowy klucz (Key) typu <strong>Score-based (V3)</strong>.</li>
                            <li>Skopiuj <strong>Site Key</strong> (ID klucza) do pola poniżej.</li>
                            <li>W panelu Google Cloud wejdź w „APIs & Services” › „Credentials”, utwórz <strong>API Key</strong> i wklej go w pole "API Key / Secret Key".</li>
                        </ol>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Wersja
                            </label>
                            <select
                                name="recaptchaVersion"
                                id="recaptchaVersion"
                                defaultValue="v3" // Enterprise is basically V3 (score based)
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                            >
                                <option value="v3">reCAPTCHA Enterprise (Score-based)</option>
                                {/* v2 option left for legacy fallback if backend supports it, but UI encourages v3 */}
                                <option value="v2">reCAPTCHA v2 (Legacy Checkbox)</option>
                            </select>
                        </div>

                        <div className="hidden md:block"></div> {/* Spacer */}

                        <div>
                            <label htmlFor="recaptchaSiteKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Site Key (Klucz Witryny)
                            </label>
                            <input
                                type="text"
                                name="recaptchaSiteKey"
                                id="recaptchaSiteKey"
                                placeholder="np. 6Lc..."
                                defaultValue={config?.recaptchaSiteKey || ""}
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
                            />
                            <p className="text-xs text-gray-500 mt-1">Klucz widoczny w kodzie strony (publiczny).</p>
                        </div>

                        <div>
                            <label htmlFor="recaptchaSecretKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                API Key / Secret Key
                            </label>
                            <input
                                type="text"
                                name="recaptchaSecretKey"
                                id="recaptchaSecretKey"
                                placeholder="np. AIza..."
                                defaultValue={config?.recaptchaSecretKey || ""}
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
                            />
                            <p className="text-xs text-gray-500 mt-1">Twój prywatny klucz API Google Cloud (nie Secret Key v2!).</p>
                        </div>
                    </div>
                </div>

                {/* Google Analytics Configuration */}
                <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-6">
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <span>📊</span> Google Analytics 4
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Śledzenie ruchu i statystyk odwiedzin.
                        </p>
                    </div>

                    <div>
                        <label htmlFor="googleAnalyticsId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Measurement ID (Identyfikator Pomiaru)
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">G-</span>
                            </div>
                            <input
                                type="text"
                                name="googleAnalyticsId"
                                id="googleAnalyticsId"
                                defaultValue={config?.googleAnalyticsId?.replace(/^G-/, '') || ""}
                                placeholder="XXXXXXXXXX"
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 pl-8 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Znajdziesz go w: Administracja › Strumienie danych › Szczegóły strumienia.</p>
                    </div>
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
