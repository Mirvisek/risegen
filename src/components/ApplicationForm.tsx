"use client";

import { useActionState, useState, useEffect } from "react";
import { submitApplication } from "@/app/zgloszenia/actions";
import { Loader2 } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";

const initialState: any = {
    message: "",
    errors: {},
    fields: {},
    success: false,
};

interface Props {
    recaptchaSiteKey?: string | null;
}

export function ApplicationForm({ recaptchaSiteKey }: Props) {
    const [state, formAction, isPending] = useActionState(submitApplication, initialState);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    // Toast feedback
    useEffect(() => {
        if (state?.message) {
            if (state.success) {
                toast.success(state.message);
                // Optional: Scroll to top or reset form logic if keeping form visible
            } else {
                toast.error(state.message);
            }
        }
    }, [state]);

    // Fallback if not configured in DB
    const finalSiteKey = recaptchaSiteKey || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

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
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            {state?.success ? (
                <div className="text-center space-y-4 py-8">
                    <div className="text-green-600 text-xl font-semibold">Dziękujemy!</div>
                    <p className="text-gray-600">{state.message}</p>
                    <button onClick={() => window.location.reload()} className="text-indigo-600 underline hover:text-indigo-800">
                        Wyślij kolejne zgłoszenie
                    </button>
                </div>
            ) : (
                <form action={formAction} className="space-y-6">
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Chcę dołączyć jako: <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="relative flex cursor-pointer bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500 transition has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50">
                                <input
                                    type="radio"
                                    name="type"
                                    value="MEMBER"
                                    defaultChecked={state?.fields?.type === "MEMBER" || true}
                                    className="sr-only"
                                />
                                <div className="flex flex-col items-center text-center w-full">
                                    <span className="font-semibold text-gray-900">Członek Stowarzyszenia</span>
                                    <span className="text-xs text-gray-500 mt-1">Pełne zaangażowanie</span>
                                </div>
                            </label>
                            <label className="relative flex cursor-pointer bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500 transition has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50">
                                <input
                                    type="radio"
                                    name="type"
                                    value="VOLUNTEER"
                                    defaultChecked={state?.fields?.type === "VOLUNTEER"}
                                    className="sr-only"
                                />
                                <div className="flex flex-col items-center text-center w-full">
                                    <span className="font-semibold text-gray-900">Wolontariusz</span>
                                    <span className="text-xs text-gray-500 mt-1">Pomoc doraźna</span>
                                </div>
                            </label>
                        </div>
                        {state?.errors?.type && <p className="text-sm text-red-500">{state.errors.type}</p>}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Imię <span className="text-red-500">*</span></label>
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
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Nazwisko <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="lastName"
                            defaultValue={state?.fields?.lastName}
                            required
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                        />
                        {state?.errors?.lastName && <p className="text-sm text-red-500">{state.errors.lastName}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                        <input
                            type="email"
                            name="email"
                            defaultValue={state?.fields?.email}
                            required
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                        />
                        {state?.errors?.email && <p className="text-sm text-red-500">{state.errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefon <span className="text-red-500">*</span></label>
                        <input
                            type="tel"
                            name="phone"
                            defaultValue={state?.fields?.phone}
                            onChange={(e) => setPhoneValue(e.target.value)}
                            required
                            className={`w-full px-4 py-2 rounded-xl border outline-none transition
                                ${phoneValue.length > 0 && !/^\d{9}$/.test(phoneValue)
                                    ? 'border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50/10'
                                    : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'}
                            `}
                            placeholder="123456789"
                        />
                        {phoneValue.length > 0 && !/^\d{9}$/.test(phoneValue) && (
                            <p className="text-xs text-red-500">Numer musi składać się z dokładnie 9 cyfr.</p>
                        )}
                        {state?.errors?.phone && <p className="text-sm text-red-500">{state.errors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">Instagram (opcjonalnie)</label>
                        <input
                            type="text"
                            name="instagram"
                            defaultValue={state?.fields?.instagram}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                            placeholder="@twoj_profil"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Data Urodzenia <span className="text-red-500">*</span></label>
                        <input
                            type="date"
                            name="birthDate"
                            defaultValue={state?.fields?.birthDate}
                            required
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
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
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Opisz siebie (min. 200 znaków) <span className="text-red-500">*</span></label>
                        <textarea
                            name="description"
                            rows={6}
                            required
                            defaultValue={defaultDesc}
                            onChange={(e) => setDescLength(e.target.value.length)}
                            className={`w-full px-4 py-2 rounded-xl border outline-none transition
                                ${descLength < 200 ? 'border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50/10' : ''}
                                ${descLength >= 200 && descLength < 210 ? 'border-yellow-400 focus:ring-yellow-200 focus:border-yellow-500 bg-yellow-50/10' : ''}
                                ${descLength >= 210 ? 'border-green-400 focus:ring-green-200 focus:border-green-500 bg-green-50/10' : ''}
                            `}
                            placeholder="Twoje zainteresowania, dlaczego chcesz dołączyć..."
                        />
                        <div className="flex justify-between items-center text-xs">
                            <span className={`${descLength < 200 ? 'text-red-500' : 'text-gray-500'}`}>
                                {descLength} / 200 znaków
                            </span>
                            {descLength < 200 && (
                                <span className="text-red-500 font-medium">Napisz jeszcze {200 - descLength} znaków</span>
                            )}
                            {descLength >= 200 && descLength < 210 && (
                                <span className="text-yellow-600 font-medium">Jeszcze trochę...</span>
                            )}
                            {descLength >= 210 && (
                                <span className="text-green-600 font-medium">Świetnie!</span>
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

                    {typeof finalSiteKey === 'string' && finalSiteKey.length > 0 && (
                        <div className="flex justify-center pt-2">
                            <ReCAPTCHA
                                sitekey={finalSiteKey}
                                onChange={setCaptchaToken}
                            />
                            <input type="hidden" name="captchaToken" value={captchaToken || ""} />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-md flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Wyślij zgłoszenie"}
                    </button>
                </form>
            )}
        </div>
    );
}
