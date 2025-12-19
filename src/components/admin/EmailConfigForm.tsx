"use client";

import { useActionState } from "react";
import { updateEmailConfig } from "@/app/admin/wyglad/actions";
import { Loader2, Save, Mail, ShieldAlert } from "lucide-react";

interface Props {
    config: any;
}

export function EmailConfigForm({ config }: Props) {
    const [state, formAction, isPending] = useActionState(updateEmailConfig, null);

    return (
        <form action={formAction} className="space-y-8 max-w-4xl bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            {state?.message && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${state.success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    {state.success ? <Mail className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
                    {state.message}
                </div>
            )}

            <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Mail className="h-5 w-5 text-indigo-600" />
                    Ustawienia SMTP
                </h3>
                <p className="text-sm text-gray-500">
                    Skonfiguruj serwer pocztowy do wysyłania powiadomień ze strony.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="smtpHost" className="block text-sm font-medium text-gray-700 mb-1">
                        Host SMTP
                    </label>
                    <input
                        type="text"
                        name="smtpHost"
                        id="smtpHost"
                        defaultValue={config?.smtpHost || ""}
                        placeholder="np. smtp.gmail.com"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                </div>

                <div>
                    <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700 mb-1">
                        Port SMTP
                    </label>
                    <input
                        type="number"
                        name="smtpPort"
                        id="smtpPort"
                        defaultValue={config?.smtpPort || 587}
                        placeholder="587"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                </div>

                <div>
                    <label htmlFor="smtpUser" className="block text-sm font-medium text-gray-700 mb-1">
                        Użytkownik SMTP
                    </label>
                    <input
                        type="text"
                        name="smtpUser"
                        id="smtpUser"
                        defaultValue={config?.smtpUser || ""}
                        placeholder="np. twoj@email.com"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                </div>

                <div>
                    <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Hasło SMTP
                    </label>
                    <input
                        type="password"
                        name="smtpPassword"
                        id="smtpPassword"
                        defaultValue={config?.smtpPassword || ""}
                        placeholder="••••••••"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                    <p className="text-xs text-gray-500 mt-1">Hasło jest bezpiecznie przechowywane w bazie danych.</p>
                </div>

                <div className="md:col-span-2">
                    <label htmlFor="smtpFrom" className="block text-sm font-medium text-gray-700 mb-1">
                        Adres Email Nadawcy (From)
                    </label>
                    <input
                        type="email"
                        name="smtpFrom"
                        id="smtpFrom"
                        defaultValue={config?.smtpFrom || ""}
                        placeholder="np. no-reply@twojadomena.pl"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                    <p className="text-xs text-gray-500 mt-1">To ten adres będzie widoczny jako nadawca wiadomości generowanych przez system.</p>
                </div>
            </div>

            <div className="border-t pt-8 pb-4 mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Mail className="h-5 w-5 text-indigo-600" />
                    Adresy Doręczenia Powiadomień
                </h3>
                <p className="text-sm text-gray-500">
                    Gdzie mają trafiać wiadomości z formularzy na stronie?
                </p>
            </div>

            <div className="space-y-6">
                <div>
                    <label htmlFor="emailForApplications" className="block text-sm font-medium text-gray-700 mb-1">
                        Email dla Zgłoszeń
                    </label>
                    <div className="flex gap-2 items-center">
                        <div className="bg-indigo-50 text-indigo-600 px-3 py-2 rounded-l-md border border-r-0 border-indigo-100 font-medium text-sm whitespace-nowrap min-w-[120px]">
                            Zgłoszenia
                        </div>
                        <input
                            type="email"
                            name="emailForApplications"
                            id="emailForApplications"
                            defaultValue={config?.emailForApplications || ""}
                            placeholder="osoba.od.zgłoszeń@example.com"
                            className="block w-full rounded-r-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-[120px]">Na ten adres będą wysyłane powiadomienia o nowych zgłoszeniach (rekrutacja/wolontariat).</p>
                </div>

                <div>
                    <label htmlFor="emailForContact" className="block text-sm font-medium text-gray-700 mb-1">
                        Email dla Kontaktu
                    </label>
                    <div className="flex gap-2 items-center">
                        <div className="bg-indigo-50 text-indigo-600 px-3 py-2 rounded-l-md border border-r-0 border-indigo-100 font-medium text-sm whitespace-nowrap min-w-[120px]">
                            Kontakt
                        </div>
                        <input
                            type="email"
                            name="emailForContact"
                            id="emailForContact"
                            defaultValue={config?.emailForContact || ""}
                            placeholder="biuro@example.com"
                            className="block w-full rounded-r-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-[120px]">Na ten adres będą trafiać wiadomości z ogólnego formularza kontaktowego.</p>
                </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 mt-6">
                <ShieldAlert className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Resetowanie haseł</p>
                    <p>
                        Wiadomości z linkiem do resetowania hasła (lub dane logowania dla nowych użytkowników) będą wysyłane z adresu skonfigurowanego powyżej jako <strong>Adres Email Nadawcy (From)</strong> na adres email przypisany do konta użytkownika w panelu "Użytkownicy".
                    </p>
                </div>

            </div>

            <div className="flex justify-end pt-6">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 font-medium shadow-sm"
                >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {isPending ? "Zapisywanie..." : "Zapisz Ustawienia Email"}
                </button>
            </div>
        </form>
    );
}
