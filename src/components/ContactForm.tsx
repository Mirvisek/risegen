"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { sendContactMessage } from "@/app/kontakt/actions";
import { Loader2, Send } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";

declare global {
    interface Window {
        grecaptcha: any;
    }
}

interface Props {
    recaptchaSiteKey?: string | null;
    recaptchaVersion?: string | null;
}

export function ContactForm({ recaptchaSiteKey, recaptchaVersion }: Props) {
    const [state, formAction, isPending] = useActionState(sendContactMessage, null);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        if (state?.message) {
            if (state.success) {
                toast.success(state.message);
                if (recaptchaRef.current) {
                    recaptchaRef.current.reset();
                }
            } else {
                toast.error(state.message);
            }
        }
    }, [state]);

    // Load reCAPTCHA v3 script
    useEffect(() => {
        if (recaptchaVersion === "v3" && recaptchaSiteKey) {
            const script = document.createElement("script");
            script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
            script.async = true;
            script.onload = () => {
                // Wait for grecaptcha to be ready
                window.grecaptcha.ready(() => {
                    setScriptLoaded(true);
                });
            };
            document.head.appendChild(script);

            return () => {
                try {
                    document.head.removeChild(script);
                } catch (e) {
                    // Script might already be removed
                }
            };
        }
    }, [recaptchaSiteKey, recaptchaVersion]);

    // Handle form submission with v3
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (recaptchaVersion === "v3" && recaptchaSiteKey) {
            e.preventDefault();

            if (!scriptLoaded || !window.grecaptcha) {
                toast.error("Błąd ładowania reCAPTCHA. Spróbuj ponownie.");
                return;
            }

            try {
                const token = await window.grecaptcha.execute(recaptchaSiteKey, { action: 'contact' });
                setCaptchaToken(token);

                // Create FormData and submit
                const formData = new FormData(e.currentTarget);
                formData.set('captchaToken', token);
                formAction(formData);
            } catch (error) {
                console.error("reCAPTCHA error:", error);
                toast.error("Błąd weryfikacji reCAPTCHA. Spróbuj ponownie.");
            }
        }
    };

    const finalSiteKey = recaptchaSiteKey || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    const isV3 = recaptchaVersion === "v3";

    if (state?.success) {
        return (
            <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900 rounded-xl p-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-2">Dziękujemy!</h3>
                <p className="text-green-700 dark:text-green-300">Twoja wiadomość została wysłana pomyślnie. Postaramy się odpowiedzieć jak najszybciej.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium underline"
                >
                    Wyślij kolejną wiadomość
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Napisz do nas</h2>

            {state?.message && !state.success && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6 border border-red-200 dark:border-red-900">
                    {state.message}
                </div>
            )}

            <form
                ref={formRef}
                action={!isV3 ? formAction : undefined}
                onSubmit={isV3 ? handleSubmit : undefined}
                className="space-y-6"
            >
                <input type="text" name="website_url" className="hidden" aria-hidden="true" autoComplete="off" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Imię i Nazwisko *</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            placeholder="Jan Kowalski"
                            className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border transition-colors"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adres Email *</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            placeholder="jan@example.com"
                            className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Temat</label>
                    <input
                        type="text"
                        name="subject"
                        id="subject"
                        placeholder="Współpraca / Pytanie"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border transition-colors"
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Treść Wiadomości *</label>
                    <textarea
                        name="message"
                        id="message"
                        rows={5}
                        required
                        placeholder="Wpisz swoją wiadomość..."
                        className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border transition-colors"
                    />
                </div>

                {/* reCAPTCHA v2 */}
                {!isV3 && typeof finalSiteKey === 'string' && finalSiteKey.length > 0 && (
                    <div className="flex justify-center">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={finalSiteKey}
                            onChange={setCaptchaToken}
                        />
                        <input type="hidden" name="captchaToken" value={captchaToken || ""} />
                    </div>
                )}

                {/* Hidden field for v3 token */}
                {isV3 && <input type="hidden" name="captchaToken" value={captchaToken || ""} />}

                {/* RODO Notice */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        <strong>Ochrona danych:</strong> Administratorem danych osobowych jest Stowarzyszenie RiseGen.
                        Dane будут przetwarzane w celu odpowiedzi na wiadomość.
                        {finalSiteKey && isV3 && (
                            <span className="block mt-2">
                                <strong>Google reCAPTCHA:</strong> Ta strona jest chroniona przez reCAPTCHA i obowiązują:
                                <a
                                    href="https://policies.google.com/privacy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 dark:text-indigo-400 hover:underline ml-1"
                                >
                                    Polityka Prywatności
                                </a>
                                {" "}oraz{" "}
                                <a
                                    href="https://policies.google.com/terms"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    Warunki Użytkowania
                                </a>
                                {" "}Google.
                            </span>
                        )}
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-70 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                >
                    {isPending ? <Loader2 className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
                    {isPending ? "Wysyłanie..." : "Wyślij Wiadomość"}
                </button>
            </form>

            {/* reCAPTCHA v3 Badge Notice */}
            {isV3 && (
                <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
                    Ta strona jest chroniona przez reCAPTCHA. Obowiązują{" "}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
                        Polityka Prywatności
                    </a>
                    {" "}i{" "}
                    <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">
                        Warunki Użytkowania
                    </a>
                    {" "}Google.
                </div>
            )}
        </div>
    );
}
