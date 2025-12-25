"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { submitApplication } from "@/app/zgloszenia/actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

declare global {
    interface Window {
        grecaptcha: any;
    }
}

const initialState: any = {
    message: "",
    errors: {},
    fields: {},
    success: false,
};

interface Props {
    recaptchaSiteKey?: string | null;
    recaptchaVersion?: string | null;
}

export function ApplicationForm({ recaptchaSiteKey, recaptchaVersion }: Props) {
    const [state, formAction, isPending] = useActionState(submitApplication, initialState);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    // Toast feedback
    useEffect(() => {
        if (state?.message) {
            if (state.success) {
                toast.success(state.message);
                // Reset logic not needed for invisible/enterprise
            } else {
                toast.error(state.message);
            }
        }
    }, [state]);

    // Load reCAPTCHA Enterprise script
    useEffect(() => {
        const keyToUse = "6Lc6NDYsAAAAAIhVMaBKLwuAUByuSjR2ZqYUdF7Y";

        const script = document.createElement("script");
        script.src = `https://www.google.com/recaptcha/enterprise.js?render=${keyToUse}`;
        script.async = true;
        script.onload = () => {
            // Wait for grecaptcha to be ready
            if (window.grecaptcha && window.grecaptcha.enterprise) {
                window.grecaptcha.enterprise.ready(() => {
                    setScriptLoaded(true);
                });
            }
        };
        document.head.appendChild(script);

        return () => {
            try {
                document.head.removeChild(script);
            } catch (e) {
                // Script might already be removed
            }
        };
    }, []);

    // Handle form submission with Enterprise
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        const keyToUse = "6Lc6NDYsAAAAAIhVMaBKLwuAUByuSjR2ZqYUdF7Y";

        e.preventDefault();

        if (!scriptLoaded || !window.grecaptcha || !window.grecaptcha.enterprise) {
            toast.error("Ładowanie zabezpieczeń... Spróbuj za chwilę.");
            return;
        }

        try {
            const token = await window.grecaptcha.enterprise.execute(keyToUse, { action: 'apply' });
            setCaptchaToken(token);

            // Create FormData and submit
            const formData = new FormData(e.currentTarget);
            formData.set('captchaToken', token);
            formAction(formData);
        } catch (error) {
            console.error("reCAPTCHA error:", error);
            toast.error("Błąd weryfikacji reCAPTCHA. Spróbuj ponownie.");
        }
    };

    // Force invisible/enterprise flow layout
    const isV3 = true;
    const finalSiteKey = "6Lc6NDYsAAAAAIhVMaBKLwuAUByuSjR2ZqYUdF7Y";

    // Controlled state only for description to handle live validation/colors
    // For other fields, we rely on defaultValue from server state for preservation
    const [descValue, setDescValue] = useState("");

    // Sync description with server state if available (initial load after error)
    // We use a key trick or just defaultValue, but since we need live count, we might need useEffect or just initialize lazy
    const defaultDesc = state?.fields?.description || "";

    // Ensure we start with the preserved value if present and we haven't typed yet
    // Actually simpler: just use defaultValue for the textarea and onChange to update a counter state
    // But to change border color dynamically, we need the current length.

    const [descLength, setDescLength] = useState(defaultDesc.length);
    const [phoneValue, setPhoneValue] = useState(state?.fields?.phone || "");

    return (
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 transition-colors">
            {state?.success ? (
                <div className="text-center space-y-4 py-8">
                    <div className="text-green-600 dark:text-green-400 text-xl font-semibold">Dziękujemy!</div>
                    <p className="text-gray-600 dark:text-gray-300">{state.message}</p>
                    <button onClick={() => window.location.reload()} className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-800 dark:hover:text-indigo-300">
                        Wyślij kolejne zgłoszenie
                    </button>
                </div>
            ) : (
                <>
                    <form
                        ref={formRef}
                        action={!isV3 ? formAction : undefined}
                        onSubmit={isV3 ? handleSubmit : undefined}
                        className="space-y-6"
                    >
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Chcę dołączyć jako: <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="relative flex cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500 transition has-[:checked]:border-indigo-600 dark:has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 dark:has-[:checked]:bg-indigo-900/20">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="MEMBER"
                                        defaultChecked={state?.fields?.type === "MEMBER" || true}
                                        className="sr-only"
                                    />
                                    <div className="flex flex-col items-center text-center w-full">
                                        <span className="font-semibold text-gray-900 dark:text-white">Członek Stowarzyszenia</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pełne zaangażowanie</span>
                                    </div>
                                </label>
                                <label className="relative flex cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500 transition has-[:checked]:border-indigo-600 dark:has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 dark:has-[:checked]:bg-indigo-900/20">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="VOLUNTEER"
                                        defaultChecked={state?.fields?.type === "VOLUNTEER"}
                                        className="sr-only"
                                    />
                                    <div className="flex flex-col items-center text-center w-full">
                                        <span className="font-semibold text-gray-900 dark:text-white">Wolontariusz</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pomoc doraźna</span>
                                    </div>
                                </label>
                            </div>
                            {state?.errors?.type && <p className="text-sm text-red-500">{state.errors.type}</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Imię <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="firstName"
                                defaultValue={state?.fields?.firstName}
                                required
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                            />
                            {state?.errors?.firstName && <p className="text-sm text-red-500">{state.errors.firstName}</p>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nazwisko <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="lastName"
                                defaultValue={state?.fields?.lastName}
                                required
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                            />
                            {state?.errors?.lastName && <p className="text-sm text-red-500">{state.errors.lastName}</p>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                name="email"
                                defaultValue={state?.fields?.email}
                                required
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                            />
                            {state?.errors?.email && <p className="text-sm text-red-500">{state.errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefon <span className="text-red-500">*</span></label>
                            <input
                                type="tel"
                                name="phone"
                                defaultValue={state?.fields?.phone}
                                onChange={(e) => setPhoneValue(e.target.value)}
                                required
                                className={`w-full px-4 py-2 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition
                                ${phoneValue.length > 0 && !/^\d{9}$/.test(phoneValue)
                                        ? 'border-red-300 dark:border-red-700 focus:ring-red-200 focus:border-red-500 bg-red-50/10 dark:bg-red-900/20'
                                        : 'border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'}
                            `}
                                placeholder="123456789"
                            />
                            {phoneValue.length > 0 && !/^\d{9}$/.test(phoneValue) && (
                                <p className="text-xs text-red-500">Numer musi składać się z dokładnie 9 cyfr.</p>
                            )}
                            {state?.errors?.phone && <p className="text-sm text-red-500">{state.errors.phone}</p>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Instagram (opcjonalnie)</label>
                            <input
                                type="text"
                                name="instagram"
                                defaultValue={state?.fields?.instagram}
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                placeholder="@twoj_profil"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data Urodzenia <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                name="birthDate"
                                defaultValue={state?.fields?.birthDate}
                                required
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                            />
                            {state?.errors?.birthDate && (
                                <div className="text-sm text-red-500 space-y-1">
                                    {Array.isArray(state.errors.birthDate)
                                        ? state.errors.birthDate.map((e: string) => <p key={e}>{e}</p>)
                                        : <p>{state.errors.birthDate}</p>}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Opisz siebie (min. 200 znaków) <span className="text-red-500">*</span></label>
                            <textarea
                                name="description"
                                rows={6}
                                required
                                defaultValue={defaultDesc}
                                onChange={(e) => setDescLength(e.target.value.length)}
                                className={`w-full px-4 py-2 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition
                                ${descLength < 200 ? 'border-red-300 dark:border-red-700 focus:ring-red-200 focus:border-red-500 bg-red-50/10 dark:bg-red-900/20' : ''}
                                ${descLength >= 200 && descLength < 210 ? 'border-yellow-400 dark:border-yellow-600 focus:ring-yellow-200 focus:border-yellow-500 bg-yellow-50/10 dark:bg-yellow-900/20' : ''}
                                ${descLength >= 210 ? 'border-green-400 dark:border-green-600 focus:ring-green-200 focus:border-green-500 bg-green-50/10 dark:bg-green-900/20' : ''}
                            `}
                                placeholder="Twoje zainteresowania, dlaczego chcesz dołączyć..."
                            />
                            <div className="flex justify-between items-center text-xs">
                                <span className={`${descLength < 200 ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {descLength} / 200 znaków
                                </span>
                                {descLength < 200 && (
                                    <span className="text-red-500 dark:text-red-400 font-medium">Napisz jeszcze {200 - descLength} znaków</span>
                                )}
                                {descLength >= 200 && descLength < 210 && (
                                    <span className="text-yellow-600 dark:text-yellow-400 font-medium">Jeszcze trochę...</span>
                                )}
                                {descLength >= 210 && (
                                    <span className="text-green-600 dark:text-green-400 font-medium">Świetnie!</span>
                                )}
                            </div>

                            {state?.errors?.description && (
                                <p className="text-sm text-red-500">{state.errors.description}</p>
                            )}
                        </div>

                        {state?.message && !state?.success && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                {state.message}
                            </div>
                        )}

                        {/* reCAPTCHA v2 removed - standardized on Enterprise/Invisible */}

                        {/* Hidden field for v3 token */}
                        {isV3 && <input type="hidden" name="captchaToken" value={captchaToken || ""} />}

                        {/* RODO/GDPR Notice */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                <strong>Ochrona danych:</strong> Administratorem danych osobowych jest Stowarzyszenie RiseGen.
                                Dane będą przetwarzane w celu rozpatrzenia zgłoszenia.
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
                            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-md flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Wyślij zgłoszenie"}
                        </button>
                    </form>

                    {/* reCAPTCHA v3 Badge Notice */}
                    {isV3 && finalSiteKey && (
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
                </>
            )}
        </div>
    );
}
