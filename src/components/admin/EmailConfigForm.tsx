"use client";

import { useActionState, useState } from "react";
import { updateEmailConfig } from "@/app/admin/wyglad/actions";
import { Loader2, Save, Mail, ShieldAlert, Server } from "lucide-react";

interface Props {
    config: any;
}

export function EmailConfigForm({ config }: Props) {
    const [state, formAction, isPending] = useActionState(updateEmailConfig, null);
    const [provider, setProvider] = useState<string>(config?.emailProvider || "smtp");

    return (
        <form action={formAction} className="space-y-8 max-w-4xl bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
            {state?.message && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${state.success ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"}`}>
                    {state.success ? <Mail className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
                    {state.message}
                </div>
            )}

            <div className="border-b dark:border-gray-700 pb-4 mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <Server className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Wybór Dostawcy Poczty
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Wybierz, w jaki sposób system ma wysyłać wiadomości email.
                </p>
            </div>

            <div className="mb-8">
                <label htmlFor="emailProvider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dostawca Usług Email
                </label>
                <select
                    name="emailProvider"
                    id="emailProvider"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors"
                >
                    <option value="smtp">Tradycyjne SMTP (Hosting, Brevo, SendGrid, Gmail)</option>
                    <option value="resend">Resend API (Dla Programistów)</option>
                </select>
            </div>

            {provider === "resend" && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                    <label htmlFor="resendApiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Resend API Key (Klucz API)
                    </label>
                    <input
                        type="password"
                        name="resendApiKey"
                        id="resendApiKey"
                        defaultValue={config?.resendApiKey || ""}
                        placeholder="re_1234..."
                        className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors font-mono"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Klucz API ze strony <a href="https://resend.com/api-keys" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Resend.com</a>.
                    </p>
                </div>
            )}

            {provider === "smtp" && (
                <div className="mb-6 space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="smtpHost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Host SMTP</label>
                            <input
                                type="text"
                                name="smtpHost"
                                id="smtpHost"
                                defaultValue={config?.smtpHost || ""}
                                placeholder="smtp.example.com"
                                className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                            />
                        </div>
                        <div>
                            <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Port SMTP</label>
                            <input
                                type="number"
                                name="smtpPort"
                                id="smtpPort"
                                defaultValue={config?.smtpPort || "587"}
                                placeholder="587 lub 465"
                                className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                            />
                        </div>
                        <div>
                            <label htmlFor="smtpUser" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Użytkownik SMTP</label>
                            <input
                                type="text"
                                name="smtpUser"
                                id="smtpUser"
                                defaultValue={config?.smtpUser || ""}
                                placeholder="user@example.com"
                                className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                            />
                        </div>
                        <div>
                            <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hasło SMTP</label>
                            <input
                                type="password"
                                name="smtpPassword"
                                id="smtpPassword"
                                defaultValue={config?.smtpPassword || ""}
                                placeholder="••••••••"
                                className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Dla portu 465 używane jest SSL (Secure), dla 587 zazwyczaj TLS.
                    </p>
                </div>
            )}

            <div className="border-b dark:border-gray-700 pb-4 mb-4 mt-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Konfiguracja Nadawców
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Skonfiguruj adresy email, z których będą wysyłane wiadomości systemowe.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="emailFromContact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nadawca - Kontakt
                    </label>
                    <input
                        type="email"
                        name="emailFromContact"
                        id="emailFromContact"
                        defaultValue={config?.emailFromContact || "kontakt@risegen.pl"}
                        placeholder="kontakt@risegen.pl"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Potwierdzenia wysłania formularza kontaktowego.</p>
                </div>

                <div>
                    <label htmlFor="emailFromApplications" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nadawca - Rekrutacja
                    </label>
                    <input
                        type="email"
                        name="emailFromApplications"
                        id="emailFromApplications"
                        defaultValue={config?.emailFromApplications || "rekrutacja@risegen.pl"}
                        placeholder="rekrutacja@risegen.pl"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Potwierdzenia zgłoszeń członkowskich/wolontariatu.</p>
                </div>

                <div>
                    <label htmlFor="emailFromSupport" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nadawca - Pomoc / Hasła
                    </label>
                    <input
                        type="email"
                        name="emailFromSupport"
                        id="emailFromSupport"
                        defaultValue={config?.emailFromSupport || "pomoc@risegen.pl"}
                        placeholder="pomoc@risegen.pl"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Resetowanie haseł i powiadomienia systemowe.</p>
                </div>

                <div>
                    <label htmlFor="emailFromNewsletter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nadawca - Newsletter
                    </label>
                    <input
                        type="email"
                        name="emailFromNewsletter"
                        id="emailFromNewsletter"
                        defaultValue={config?.emailFromNewsletter || "newsletter@risegen.pl"}
                        placeholder="newsletter@risegen.pl"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Wysyłka newslettera i kampanii Drip.</p>
                </div>
            </div>

            <div className="border-t dark:border-gray-700 pt-8 pb-4 mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Adresy Odbiorców (Powiadomienia dla Admina)
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Gdzie mają trafiać wiadomości wysłane przez użytkowników ze strony?
                </p>
            </div>

            <div className="space-y-6">
                <div>
                    <label htmlFor="emailForApplicationsReceiver" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Odbiorca Zgłoszeń
                    </label>
                    <div className="flex gap-2 items-center">
                        <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-2 rounded-l-md border border-r-0 border-indigo-100 dark:border-indigo-900/50 font-medium text-sm whitespace-nowrap min-w-[120px]">
                            Zgłoszenia
                        </div>
                        <input
                            type="email"
                            name="emailForApplications"
                            id="emailForApplicationsReceiver"
                            defaultValue={config?.emailForApplications || ""}
                            placeholder="admin@risegen.pl"
                            className="block w-full rounded-r-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="emailForContactReceiver" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Odbiorca Kontaktu
                    </label>
                    <div className="flex gap-2 items-center">
                        <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-2 rounded-l-md border border-r-0 border-indigo-100 dark:border-indigo-900/50 font-medium text-sm whitespace-nowrap min-w-[120px]">
                            Kontakt
                        </div>
                        <input
                            type="email"
                            name="emailForContact"
                            id="emailForContactReceiver"
                            defaultValue={config?.emailForContact || ""}
                            placeholder="kontakt@risegen.pl"
                            className="block w-full rounded-r-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                        />
                    </div>
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
