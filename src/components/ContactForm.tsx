"use client";

import { useActionState, useState, useEffect } from "react";
import { sendContactMessage } from "@/app/kontakt/actions";
import { Loader2, Send } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";

export function ContactForm({ recaptchaSiteKey }: { recaptchaSiteKey?: string | null }) {
    const [state, formAction, isPending] = useActionState(sendContactMessage, null);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    useEffect(() => {
        if (state?.message) {
            if (state.success) {
                toast.success(state.message);
            } else {
                toast.error(state.message);
            }
        }
    }, [state]);

    // Fallback if not configured in DB
    const finalSiteKey = recaptchaSiteKey || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (state?.success) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">Dziękujemy!</h3>
                <p className="text-green-700">Twoja wiadomość została wysłana pomyślnie. Postaramy się odpowiedzieć jak najszybciej.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 text-green-600 hover:text-green-800 font-medium underline"
                >
                    Wyślij kolejną wiadomość
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Napisz do nas</h2>

            {state?.message && !state.success && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
                    {state.message}
                </div>
            )}

            <form action={formAction} className="space-y-6">
                <input type="text" name="website_url" className="hidden" aria-hidden="true" autoComplete="off" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Imię i Nazwisko *</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            placeholder="Jan Kowalski"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Adres Email *</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            placeholder="jan@example.com"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Temat</label>
                    <input
                        type="text"
                        name="subject"
                        id="subject"
                        placeholder="Współpraca / Pytanie"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Treść Wiadomości *</label>
                    <textarea
                        name="message"
                        id="message"
                        rows={5}
                        required
                        placeholder="Wpisz swoją wiadomość..."
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                    />
                </div>

                {typeof finalSiteKey === 'string' && finalSiteKey.length > 0 && (
                    <div className="flex justify-center">
                        <ReCAPTCHA
                            sitekey={finalSiteKey}
                            onChange={setCaptchaToken}
                        />
                        <input type="hidden" name="captchaToken" value={captchaToken || ""} />
                    </div>
                )}

                <div className="text-xs text-gray-500">
                    * Pola wymagane. Administratorem danych jest Stowarzyszenie RiseGen.
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {isPending ? <Loader2 className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
                    {isPending ? "Wysyłanie..." : "Wyślij Wiadomość"}
                </button>
            </form>
        </div>
    );
}
