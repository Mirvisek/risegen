"use client";

import { useState, useActionState } from "react";
import { updateCompanyData, updateSocialMedia, updateContactData, updateHomepageSettings, updateBranding, updateSeoConfig, updateMaintenanceMode, updateNewsletterSettings, updateCodeInjection } from "@/app/admin/wyglad/actions";
import { AppearanceNavigationForm } from "./AppearanceNavigationForm"; // Added import

import { Loader2, Check, Upload, MapPin, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
    config: {
        orgName?: string | null;
        orgAddress?: string | null;
        orgNip?: string | null;
        orgRegon?: string | null;
        orgBankAccount?: string | null;
        email?: string | null;
        phone?: string | null;
        facebookUrl?: string | null;
        instagramUrl?: string | null;
        tiktokUrl?: string | null;
        discordUrl?: string | null;
        showHero?: boolean;
        showNews?: boolean;
        showProjects?: boolean;
        showPartners?: boolean;
        siteName?: string | null;
        logoUrl?: string | null;
        seoTitle?: string | null;
        seoDescription?: string | null;
        seoKeywords?: string | null;
        seoAuthor?: string | null;
        seoRobots?: string | null;
        faviconUrl?: string | null;
        ogImageUrl?: string | null;
        aboutUsSublinks?: string | null;
        footerDocuments?: string | null;
        accessibilityInfo?: string | null;
        showEvents?: boolean;
        showStats?: boolean;
        showUpcomingEvents?: boolean;
        showActionCenter?: boolean;
        homepageOrder?: string;
        googleCalendarId?: string | null;
        isMaintenanceMode?: boolean;
        maintenanceMessage?: string | null;
        enableNewsletter?: boolean;
        newsletterWelcomeSubject?: string | null;
        newsletterWelcomeContent?: string | null;
        resendApiKey?: string | null;
        contactMapUrl?: string | null;
        contactMapPin?: string | null;
        // Drip
        enableDripCampaign?: boolean;
        dripDay2Delay?: number | null;
        dripDay2Subject?: string | null;
        dripDay2Content?: string | null;
        dripDay5Delay?: number | null;
        dripDay5Subject?: string | null;
        showTaxOnePointFive?: boolean;
        enableDonations?: boolean;
        showBankTransferDetails?: boolean;
        taxKrs?: string | null;
        taxGoal?: string | null;
        p24IsSandbox?: boolean;
        p24MerchantId?: string | null;
        p24PosId?: string | null;
        p24ApiKey?: string | null;
        p24Crc?: string | null;
        recaptchaVersion?: string | null;
        recaptchaSiteKey?: string | null;
        recaptchaSecretKey?: string | null;
        recaptchaProjectId?: string | null;
        googleAnalyticsId?: string | null;
        discordWebhookContactUrl?: string | null;
        discordWebhookApplicationUrl?: string | null;
        dripDay5Content?: string | null;

    } | null;
}

const initialState = {
    success: false,
    message: "",
};

function FormFeedback({ state }: { state: typeof initialState }) {
    if (!state?.message) return null;

    if (state.success) {
        return (
            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 p-4 mb-4 rounded-md flex items-center gap-3">
                <Check className="h-5 w-5 text-green-400" />
                <p className="text-sm text-green-700 dark:text-green-400">{state.message}</p>
            </div>
        );
    }

    return (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 mb-4 rounded-md">
            <p className="text-sm text-red-700 dark:text-red-400">{state.message}</p>
        </div>
    );
}

function SubmitButton({ isPending }: { isPending: boolean }) {
    return (
        <div className="pt-4 flex justify-end">
            <button
                type="submit"
                disabled={isPending}
                className="inline-flex justify-center items-center gap-2 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
                {isPending && <Loader2 className="animate-spin h-4 w-4" />}
                {isPending ? "Zapisywanie..." : "Zapisz"}
            </button>
        </div>
    );
}

export function BrandingForm({ config }: Props) {
    const [state, formAction, isPending] = useActionState(updateBranding, initialState);
    const [preview, setPreview] = useState<string | null>(config?.logoUrl || null);
    const [logoUrl, setLogoUrl] = useState<string>(config?.logoUrl || "");

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            alert("Plik jest zbyt duży (maks. 10MB)");
            e.target.value = "";
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.url) {
                setLogoUrl(data.url);
            }
        } catch (err) { console.error("Upload failed", err); }
    };

    const handleRemoveLogo = () => {
        setPreview(null);
        setLogoUrl("");
    };

    return (
        <form action={formAction} className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6 space-y-6 border border-gray-100 dark:border-gray-800 transition-colors">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white border-b dark:border-gray-800 pb-2">Branding (Logo i Nazwa)</h3>
            <FormFeedback state={state} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logo Strony</label>
                    <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0">
                            {preview ? (
                                <Image src={preview} alt="Logo" fill className="object-contain p-1" />
                            ) : (
                                <Upload className="text-gray-400 h-6 w-6" />
                            )}
                            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <input type="hidden" name="logoUrl" value={logoUrl} />
                            <button type="button" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium relative">
                                Zmień Logo
                                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </button>
                            {preview && (
                                <button type="button" onClick={handleRemoveLogo} className="text-sm text-red-600 dark:text-red-400 hover:text-red-500 font-medium">
                                    Usuń Logo
                                </button>
                            )}
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Format: PNG/SVG. Maks. 10MB.<br />
                        Sugerowany wymiar: <strong>200x50px</strong> (format poziomy).
                    </p>
                </div>
                <div>
                    <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nazwa Strony</label>
                    <input
                        type="text"
                        name="siteName"
                        id="siteName"
                        defaultValue={config?.siteName || "RiseGen"}
                        placeholder="np. RiseGen"
                        className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Wyświetlana w pasku nawigacji (jeśli brak logo) oraz w tytule karty przeglądarki.
                    </p>
                </div>
            </div>
            <SubmitButton isPending={isPending} />
        </form>
    );
}

export function CompanyForm({ config }: Props) {
    const [state, formAction, isPending] = useActionState(updateCompanyData, initialState);

    return (
        <form action={formAction} className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6 space-y-6 border border-gray-100 dark:border-gray-800 transition-colors">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white border-b dark:border-gray-800 pb-2">Dane Stowarzyszenia</h3>
            <FormFeedback state={state} />
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                    <label htmlFor="orgName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nazwa Stowarzyszenia / Firmy</label>
                    <div className="mt-1">
                        <input type="text" name="orgName" id="orgName" defaultValue={config?.orgName || ""} className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors" />
                    </div>
                </div>
                <div className="sm:col-span-3">
                    <label htmlFor="orgNip" className="block text-sm font-medium text-gray-700 dark:text-gray-300">NIP</label>
                    <div className="mt-1">
                        <input type="text" name="orgNip" id="orgNip" defaultValue={config?.orgNip || ""} className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors" />
                    </div>
                </div>
                <div className="sm:col-span-3">
                    <label htmlFor="orgRegon" className="block text-sm font-medium text-gray-700 dark:text-gray-300">REGON</label>
                    <div className="mt-1">
                        <input type="text" name="orgRegon" id="orgRegon" defaultValue={config?.orgRegon || ""} className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors" />
                    </div>
                </div>
                <div className="sm:col-span-6">
                    <label htmlFor="orgBankAccount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Numer Konta Bankowego</label>
                    <div className="mt-1">
                        <input type="text" name="orgBankAccount" id="orgBankAccount" defaultValue={config?.orgBankAccount || ""} className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors" placeholder="00 0000 0000 0000 0000 0000 0000" />
                    </div>
                </div>

                <div className="sm:col-span-6 border-t border-gray-100 dark:border-gray-800 pt-6 mt-2">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Ustawienia Finansowe</h4>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="showBankTransferDetails"
                                id="showBankTransferDetails"
                                defaultChecked={config?.showBankTransferDetails ?? true}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-800"
                            />
                            <label htmlFor="showBankTransferDetails" className="text-sm text-gray-700 dark:text-gray-300 select-none cursor-pointer">
                                Pokaż sekcję &quot;Dane do przelewu&quot;
                            </label>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="showTaxOnePointFive"
                                id="showTaxOnePointFive"
                                defaultChecked={config?.showTaxOnePointFive}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-800"
                            />
                            <label htmlFor="showTaxOnePointFive" className="text-sm text-gray-700 dark:text-gray-300 select-none cursor-pointer">
                                Pokaż sekcję &quot;Przekaż 1.5% podatku&quot;
                            </label>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="enableDonations"
                                id="enableDonations"
                                defaultChecked={config?.enableDonations}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-800"
                            />
                            <label htmlFor="enableDonations" className="text-sm text-gray-700 dark:text-gray-300 select-none cursor-pointer">
                                Włącz wpłaty on-line (Wymaga konfiguracji Przelewy24 w sekcji Integracje)
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 mt-6">
                        <div className="sm:col-span-1">
                            <label htmlFor="taxKrs" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Numer KRS (Dla 1.5%)</label>
                            <div className="mt-1">
                                <input type="text" name="taxKrs" id="taxKrs" defaultValue={config?.taxKrs || ""} className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors" placeholder="0000000000" />
                            </div>
                        </div>
                        <div className="sm:col-span-1">
                            <label htmlFor="taxGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cel Szczegółowy (Opcjonalnie)</label>
                            <div className="mt-1">
                                <input type="text" name="taxGoal" id="taxGoal" defaultValue={config?.taxGoal || ""} className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors" placeholder="Np. Cele Statutowe" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <SubmitButton isPending={isPending} />
        </form>
    );
}

export function SocialMediaForm({ config }: Props) {
    const [state, formAction, isPending] = useActionState(updateSocialMedia, initialState);

    return (
        <form action={formAction} className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6 space-y-6 border border-gray-100 dark:border-gray-800 transition-colors">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white border-b dark:border-gray-800 pb-2">Media Społecznościowe</h3>
            <FormFeedback state={state} />
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                    <label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Facebook URL</label>
                    <div className="mt-1">
                        <input type="url" name="facebookUrl" id="facebookUrl" defaultValue={config?.facebookUrl || ""} placeholder="https://facebook.com/..." className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors" />
                    </div>
                </div>
                <div className="sm:col-span-6">
                    <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Instagram URL</label>
                    <div className="mt-1">
                        <input type="url" name="instagramUrl" id="instagramUrl" defaultValue={config?.instagramUrl || ""} placeholder="https://instagram.com/..." className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors" />
                    </div>
                </div>
                <div className="sm:col-span-6">
                    <label htmlFor="tiktokUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">TikTok URL</label>
                    <div className="mt-1">
                        <input type="url" name="tiktokUrl" id="tiktokUrl" defaultValue={config?.tiktokUrl || ""} placeholder="https://tiktok.com/@..." className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors" />
                    </div>
                </div>
                <div className="sm:col-span-6">
                    <label htmlFor="discordUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Discord URL</label>
                    <div className="mt-1">
                        <input type="url" name="discordUrl" id="discordUrl" defaultValue={config?.discordUrl || ""} placeholder="https://discord.gg/..." className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors" />
                    </div>
                </div>
            </div>
            <SubmitButton isPending={isPending} />
        </form>
    );
}

export function SeoForm({ config }: Props) {
    const [state, formAction, isPending] = useActionState(updateSeoConfig, initialState);

    // Favicon State
    const [faviconPreview, setFaviconPreview] = useState<string | null>(config?.faviconUrl || null);
    const [faviconUrl, setFaviconUrl] = useState<string>(config?.faviconUrl || "");

    const handleFaviconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            alert("Plik jest zbyt duży (maks. 10MB)");
            e.target.value = "";
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setFaviconPreview(objectUrl);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.url) {
                setFaviconUrl(data.url);
            }
        } catch (err) { console.error("Upload failed", err); }
    };
    const handleRemoveFavicon = () => {
        setFaviconPreview(null);
        setFaviconUrl("");
    };

    // OG Image State
    const [ogPreview, setOgPreview] = useState<string | null>(config?.ogImageUrl || null);
    const [ogImageUrl, setOgImageUrl] = useState<string>(config?.ogImageUrl || "");

    const handleOgImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            alert("Plik jest zbyt duży (maks. 10MB)");
            e.target.value = "";
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setOgPreview(objectUrl);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.url) {
                setOgImageUrl(data.url);
            }
        } catch (err) { console.error("Upload failed", err); }
    };
    const handleRemoveOgImage = () => {
        setOgPreview(null);
        setOgImageUrl("");
    };

    return (
        <form action={formAction} className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6 space-y-6 border border-gray-100 dark:border-gray-800 transition-colors">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white border-b dark:border-gray-800 pb-2">Ustawienia SEO (Wyszukiwarka)</h3>
            <FormFeedback state={state} />
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                    <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tytuł Strony (Meta Title)</label>
                    <input type="text" name="seoTitle" id="seoTitle" defaultValue={config?.seoTitle || ""} placeholder="Tytuł w Google..." className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Nadpisuje domyślny tytuł "RiseGen".</p>
                </div>
                <div className="sm:col-span-6">
                    <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Opis Strony (Meta Description)</label>
                    <textarea name="seoDescription" id="seoDescription" rows={3} defaultValue={config?.seoDescription || ""} placeholder="Opis widoczny w wynikach wyszukiwania..." className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors" />
                </div>
                <div className="sm:col-span-6">
                    <label htmlFor="seoKeywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Słowa Kluczowe (Meta Keywords)</label>
                    <input type="text" name="seoKeywords" id="seoKeywords" defaultValue={config?.seoKeywords || ""} placeholder="słowo1, słowo2, słowo3..." className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Oddzielone przecinkami.</p>
                </div>
                <div className="sm:col-span-3">
                    <label htmlFor="seoAuthor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Autor (Meta Author)</label>
                    <input type="text" name="seoAuthor" id="seoAuthor" defaultValue={config?.seoAuthor || ""} placeholder="np. RiseGen" className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors" />
                </div>
                <div className="sm:col-span-3">
                    <label htmlFor="seoRobots" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Indeksowanie (Robots)</label>
                    <select name="seoRobots" id="seoRobots" defaultValue={config?.seoRobots || "index, follow"} className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors">
                        <option value="index, follow">Indeksuj i śledź (index, follow)</option>
                        <option value="noindex, follow">Nie indeksuj, śledź (noindex, follow)</option>
                        <option value="index, nofollow">Indeksuj, nie śledź (index, nofollow)</option>
                        <option value="noindex, nofollow">Nie indeksuj i nie śledź (noindex, nofollow)</option>
                    </select>
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ikona Strony (Favicon)</label>
                    <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0">
                            {faviconPreview ? (
                                <Image src={faviconPreview} alt="Favicon" fill className="object-cover p-1" />
                            ) : (
                                <Upload className="text-gray-400 h-5 w-5" />
                            )}
                            <input type="file" accept="image/*" onChange={handleFaviconChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <input type="hidden" name="faviconUrl" value={faviconUrl} />
                            <button type="button" className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium relative">
                                Zmień
                                <input type="file" accept="image/*" onChange={handleFaviconChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </button>
                            {faviconPreview && (
                                <button type="button" onClick={handleRemoveFavicon} className="text-xs text-red-600 hover:text-red-500 font-medium">
                                    Usuń
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Obrazek Udostępniania (OG Image)</label>
                    <div className="flex items-center gap-4">
                        <div className="relative h-16 w-24 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0">
                            {ogPreview ? (
                                <Image src={ogPreview} alt="OG Image" fill className="object-cover" />
                            ) : (
                                <Upload className="text-gray-400 h-6 w-6" />
                            )}
                            <input type="file" accept="image/*" onChange={handleOgImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <input type="hidden" name="ogImageUrl" value={ogImageUrl} />
                            <button type="button" className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium relative">
                                Zmień
                                <input type="file" accept="image/*" onChange={handleOgImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </button>
                            {ogPreview && (
                                <button type="button" onClick={handleRemoveOgImage} className="text-xs text-red-600 hover:text-red-500 font-medium">
                                    Usuń
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <SubmitButton isPending={isPending} />
        </form>
    );
}

export function CalendarForm({ config }: Props) {
    const [state, formAction, isPending] = useActionState(updateSeoConfig, initialState);

    return (
        <form action={formAction} className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6 space-y-6 border border-gray-100 dark:border-gray-800 transition-colors">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white border-b dark:border-gray-800 pb-2">Kalendarz</h3>
            <FormFeedback state={state} />
            <div className="space-y-4">
                <label htmlFor="googleCalendarId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ID Kalendarza Google</label>
                <input type="text" name="googleCalendarId" id="googleCalendarId" defaultValue={config?.googleCalendarId || ""} placeholder="abc...123@group.calendar.google.com" className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Umożliwia synchronizację i wyświetlanie publicznego kalendarza Google na stronie wydarzeń.</p>
            </div>
            <SubmitButton isPending={isPending} />
        </form>
    );
}

export function ContactForm({ config }: Props) {
    const [state, formAction, isPending] = useActionState(updateContactData, initialState);
    const [pinPreview, setPinPreview] = useState<string | null>(config?.contactMapPin || null);
    const [pinUrl, setPinUrl] = useState<string>(config?.contactMapPin || "");

    const handlePinChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("Plik jest zbyt duży (maks. 5MB)");
            e.target.value = "";
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setPinPreview(objectUrl);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.url) {
                setPinUrl(data.url);
            }
        } catch (err) { console.error("Upload failed", err); }
    };

    const handleRemovePin = () => {
        setPinPreview(null);
        setPinUrl("");
    };

    return (
        <form action={formAction} className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6 space-y-6 border border-gray-100 dark:border-gray-800 transition-colors">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white border-b dark:border-gray-800 pb-2">Dane Kontaktowe i Mapa</h3>
            <FormFeedback state={state} />
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Kontaktowy</label>
                    <div className="mt-1">
                        <input type="email" name="email" id="email" defaultValue={config?.email || ""} className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors" />
                    </div>
                </div>
                <div className="sm:col-span-6">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefon Kontaktowy</label>
                    <div className="mt-1">
                        <input type="text" name="phone" id="phone" defaultValue={config?.phone || ""} className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors" />
                    </div>
                </div>
                <div className="sm:col-span-6">
                    <label htmlFor="orgAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Adres Biura / Korespondencyjny</label>
                    <div className="mt-1">
                        <textarea name="orgAddress" id="orgAddress" rows={3} defaultValue={config?.orgAddress || ""} className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors" />
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Ten adres będzie widoczny na stronie kontaktowej oraz w stopce.</p>
                </div>

                <div className="sm:col-span-6 border-t border-gray-100 dark:border-gray-800 pt-6 mt-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Konfiguracja Mapy</h4>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                            <label htmlFor="contactMapUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Współrzędne Mapy (Lat, Lng)</label>
                            <div className="mt-1">
                                <input type="text" name="contactMapUrl" id="contactMapUrl" defaultValue={config?.contactMapUrl || ""} placeholder="np. 52.2297, 21.0122" className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors" />
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Wpisz szerokość i długość geograficzną oddzielone metodą kopiowania z Google Maps (lat, lng).
                            </p>
                        </div>

                        <div className="sm:col-span-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Własna Pinezka (Ikona)</label>
                            <div className="flex items-center gap-4">
                                <div className="relative h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0">
                                    {pinPreview ? (
                                        <Image src={pinPreview} alt="Pin" fill className="object-contain p-1" />
                                    ) : (
                                        <MapPin className="text-gray-400 h-6 w-6" />
                                    )}
                                    <input type="file" accept="image/*" onChange={handlePinChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <input type="hidden" name="contactMapPin" value={pinUrl} />
                                    <button type="button" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium relative">
                                        Wybierz plik
                                        <input type="file" accept="image/*" onChange={handlePinChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </button>
                                    {pinPreview && (
                                        <button type="button" onClick={handleRemovePin} className="text-sm text-red-600 dark:text-red-400 hover:text-red-500 font-medium text-left">
                                            Usuń
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                Zalecany format .png z przezroczystością. Jeśli puste, użyta zostanie domyślna pinezka.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <SubmitButton isPending={isPending} />
        </form>
    );
}

import { SectionOrderSortable } from "@/components/admin/SectionOrderSortable";

// ... (existing imports)

export function HomepageSettingsForm({ config }: Props) {
    const [state, formAction, isPending] = useActionState(updateHomepageSettings, initialState);
    const [homepageOrder, setHomepageOrder] = useState(config?.homepageOrder || "hero,stats,action,news,events,projects,partners");

    return (
        <form action={formAction} className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6 space-y-6 border border-gray-100 dark:border-gray-800 transition-colors">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white border-b dark:border-gray-800 pb-2">Ustawienia Strony Głównej</h3>
            <FormFeedback state={state} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Widoczność Sekcji</h4>
                    <div className="flex items-center justify-between">
                        <div>
                            <label htmlFor="showHero" className="font-medium text-gray-700 dark:text-gray-300">Sekcja Hero (Baner)</label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Duży baner na górze strony głównej.</p>
                        </div>
                        <div className="flex items-center h-5">
                            <input
                                id="showHero"
                                name="showHero"
                                type="checkbox"
                                defaultChecked={config?.showHero ?? true}
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <label htmlFor="showStats" className="font-medium text-gray-700 dark:text-gray-300">Licznik Sukcesów</label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Wyświetla licznik z sukcesami pod banerem.</p>
                        </div>
                        <div className="flex items-center h-5">
                            <input
                                id="showStats"
                                name="showStats"
                                type="checkbox"
                                defaultChecked={config?.showStats ?? true}
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <label htmlFor="showActionCenter" className="font-medium text-gray-700 dark:text-gray-300">Centrum Akcji</label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Sekcja "Get Involved" (3 karty).</p>
                        </div>
                        <div className="flex items-center h-5">
                            <input
                                id="showActionCenter"
                                name="showActionCenter"
                                type="checkbox"
                                defaultChecked={config?.showActionCenter ?? true}
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <label htmlFor="showNews" className="font-medium text-gray-700 dark:text-gray-300">Ostatnie Aktualności</label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Sekcja wyświetlająca 3 najnowsze aktualności.</p>
                        </div>
                        <div className="flex items-center h-5">
                            <input
                                id="showNews"
                                name="showNews"
                                type="checkbox"
                                defaultChecked={config?.showNews ?? true}
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <label htmlFor="showUpcomingEvents" className="font-medium text-gray-700 dark:text-gray-300">Widget Wydarzeń</label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Wyświetla 3 nadchodzące wydarzenia.</p>
                        </div>
                        <div className="flex items-center h-5">
                            <input
                                id="showUpcomingEvents"
                                name="showUpcomingEvents"
                                type="checkbox"
                                defaultChecked={config?.showUpcomingEvents ?? true}
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <label htmlFor="showProjects" className="font-medium text-gray-700 dark:text-gray-300">Wyróżnione Projekty</label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Sekcja z wybranymi projektami.</p>
                        </div>
                        <div className="flex items-center h-5">
                            <input
                                id="showProjects"
                                name="showProjects"
                                type="checkbox"
                                defaultChecked={config?.showProjects ?? true}
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <label htmlFor="showPartners" className="font-medium text-gray-700 dark:text-gray-300">Partnerzy</label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Sekcja logotypów partnerów.</p>
                        </div>
                        <div className="flex items-center h-5">
                            <input
                                id="showPartners"
                                name="showPartners"
                                type="checkbox"
                                defaultChecked={config?.showPartners ?? true}
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                            />
                        </div>
                    </div>
                    <div className="hidden">
                        <input
                            id="showEvents"
                            name="showEvents"
                            type="checkbox"
                            defaultChecked={config?.showEvents ?? true}
                        />
                        {/* showEvents is technically config flag for the whole module, but let's keep it here hidden to preserve state if needed, or expose it nicely. Actually previous form had it. I'll keep it hidden or just handled in backend to not break */}
                    </div>
                </div>

                <div>
                    <input type="hidden" name="homepageOrder" value={homepageOrder} />
                    <SectionOrderSortable initialOrder={homepageOrder} onOrderChange={setHomepageOrder} />
                </div>
            </div>
            <SubmitButton isPending={isPending} />
        </form>
    );
}

export function MaintenanceModeForm({ config }: Props) {
    const [state, formAction, isPending] = useActionState(updateMaintenanceMode, initialState);

    return (
        <form action={formAction} className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6 space-y-6 border-2 border-amber-100 dark:border-amber-900/30 transition-colors">
            <div className="flex items-center gap-3 border-b dark:border-gray-800 pb-2">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Tryb Przebudowy / Prace Serwisowe</h3>
                {config?.isMaintenanceMode && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 animate-pulse">
                        Aktywny
                    </span>
                )}
            </div>
            <FormFeedback state={state} />

            <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="max-w-xl">
                        <label htmlFor="isMaintenanceMode" className="font-medium text-gray-700 dark:text-gray-300">Włącz tryb serwisowy</label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Po włączeniu, strona będzie niedostępna dla odwiedzających. Wyświetlona zostanie informacja o trwających pracach.
                            <span className="text-amber-600 dark:text-amber-400 font-medium ml-1">Panel admina pozostanie dostępny.</span>
                        </p>
                    </div>
                    <div className="flex items-center h-5">
                        <input
                            id="isMaintenanceMode"
                            name="isMaintenanceMode"
                            type="checkbox"
                            defaultChecked={config?.isMaintenanceMode ?? false}
                            className="focus:ring-amber-500 h-6 w-6 text-amber-600 border-gray-300 dark:border-gray-600 rounded cursor-pointer bg-white dark:bg-gray-800"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="maintenanceMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Wiadomość dla odwiedzających (opcjonalnie)
                    </label>
                    <textarea
                        name="maintenanceMessage"
                        id="maintenanceMessage"
                        rows={3}
                        defaultValue={config?.maintenanceMessage || "Przepraszamy, strona jest obecnie w trakcie prac serwisowych. Zapraszamy wkrótce!"}
                        placeholder="np. Trwa aktualizacja systemu. Wrócimy o 14:00."
                        className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border transition-colors"
                    />
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex justify-center items-center gap-2 rounded-md border border-transparent bg-amber-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {isPending && <Loader2 className="animate-spin h-4 w-4" />}
                    {isPending ? "Zapisywanie..." : "Zapisz ustawienia trybu"}
                </button>
            </div>
        </form>
    );
}
export function NewsletterSettingsForm({ config }: Props) {
    const [state, formAction, isPending] = useActionState(updateNewsletterSettings, initialState);

    return (
        <form action={formAction} className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6 space-y-6 border border-gray-100 dark:border-gray-800 transition-colors">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white border-b dark:border-gray-800 pb-2">Newsletter</h3>
            <FormFeedback state={state} />

            <div className="flex items-start justify-between gap-4">
                <div>
                    <label htmlFor="enableNewsletter" className="font-medium text-gray-700 dark:text-gray-300">Włącz Newsletter</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pokaż formularz zapisu w stopce i uruchom API subskrypcji.
                    </p>
                </div>
                <div className="flex items-center h-5">
                    <input
                        id="enableNewsletter"
                        name="enableNewsletter"
                        type="checkbox"
                        defaultChecked={config?.enableNewsletter ?? false}
                        className="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300 dark:border-gray-600 rounded cursor-pointer bg-white dark:bg-gray-800"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-y-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div>
                    <label htmlFor="resendApiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Resend API Key (Klucz API)
                    </label>
                    <input
                        type="password"
                        name="resendApiKey"
                        id="resendApiKey"
                        defaultValue={config?.resendApiKey || ""}
                        placeholder="re_..."
                        className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors font-mono"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Klucz z <a href="https://resend.com/api-keys" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Resend.com</a>. Jeśli nie podasz tutaj, użyjemy `RESEND_API_KEY` z pliku .env (jeśli istnieje).
                    </p>
                </div>

                <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Konfiguracja Powitania (Email)</h4>
                    <div className="grid grid-cols-1 gap-y-6">
                        <div>
                            <label htmlFor="newsletterWelcomeSubject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Temat maila powitalnego</label>
                            <input type="text" name="newsletterWelcomeSubject" id="newsletterWelcomeSubject" defaultValue={config?.newsletterWelcomeSubject || ""} placeholder="Witaj w RiseGen!" className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors" />
                        </div>
                        <div>
                            <label htmlFor="newsletterWelcomeContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Treść powitania (opcjonalnie)</label>
                            <textarea name="newsletterWelcomeContent" id="newsletterWelcomeContent" rows={4} defaultValue={config?.newsletterWelcomeContent || ""} placeholder="Wpisz własną treść powitania..." className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors" />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Jeśli puste, wyślemy standardowe powitanie.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Drip Campaign Section */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer list-none py-2 px-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="p-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded">Automatyzacja</span>
                            Kampania Drip (Sekwencja Powitalna)
                        </h4>
                        <span className="transform group-open:rotate-180 transition-transform text-gray-400">▼</span>
                    </summary>

                    <div className="mt-4 space-y-8 pl-1">
                        <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-4">
                            <div>
                                <label htmlFor="enableDripCampaign" className="font-medium text-gray-700 dark:text-gray-300">Włącz Kampanię</label>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Jeśli odznaczone, wysyłamy tylko powitanie (Dzień 0).
                                </p>
                            </div>
                            <div className="flex items-center h-5">
                                <input
                                    id="enableDripCampaign"
                                    name="enableDripCampaign"
                                    type="checkbox"
                                    defaultChecked={config?.enableDripCampaign ?? true}
                                    className="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 dark:border-gray-600 rounded cursor-pointer bg-white dark:bg-gray-800"
                                />
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Skonfiguruj automatyczne maile wysyłane po określonym czasie od zapisu. System sprawdza kolejkę co godzinę (gdy strona jest odwiedzana).
                        </p>

                        {/* Day 2 Config */}
                        <div className="space-y-4 border-l-2 border-indigo-200 dark:border-indigo-800 pl-4 py-2">
                            <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Krok 2: Sukcesy</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                                <div className="sm:col-span-1">
                                    <label htmlFor="dripDay2Delay" className="block text-xs font-medium text-gray-500 mb-1">Opóźnienie (dni)</label>
                                    <input type="number" name="dripDay2Delay" id="dripDay2Delay" defaultValue={config?.dripDay2Delay ?? 2} min={1} className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                                </div>
                                <div className="sm:col-span-3">
                                    <label htmlFor="dripDay2Subject" className="block text-xs font-medium text-gray-500 mb-1">Temat</label>
                                    {/* @ts-ignore */}
                                    <input type="text" name="dripDay2Subject" id="dripDay2Subject" defaultValue={config?.dripDay2Subject || ""} placeholder="Poznaj nasze największe sukcesy! 🌟" className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="dripDay2Content" className="block text-xs font-medium text-gray-500 mb-1">Treść (HTML opcjonalny)</label>
                                {/* @ts-ignore */}
                                <textarea name="dripDay2Content" id="dripDay2Content" rows={3} defaultValue={config?.dripDay2Content || ""} placeholder="Minęło kilka dni... (zostaw puste dla domyślnej treści)" className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                            </div>
                        </div>

                        {/* Day 5 Config */}
                        <div className="space-y-4 border-l-2 border-indigo-200 dark:border-indigo-800 pl-4 py-2">
                            <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Krok 3: Wolontariat</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                                <div className="sm:col-span-1">
                                    <label htmlFor="dripDay5Delay" className="block text-xs font-medium text-gray-500 mb-1">Opóźnienie (dni)</label>
                                    <input type="number" name="dripDay5Delay" id="dripDay5Delay" defaultValue={config?.dripDay5Delay ?? 5} min={1} className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                                </div>
                                <div className="sm:col-span-3">
                                    <label htmlFor="dripDay5Subject" className="block text-xs font-medium text-gray-500 mb-1">Temat</label>
                                    {/* @ts-ignore */}
                                    <input type="text" name="dripDay5Subject" id="dripDay5Subject" defaultValue={config?.dripDay5Subject || ""} placeholder="Chcesz dołączyć do działania? 🤝" className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="dripDay5Content" className="block text-xs font-medium text-gray-500 mb-1">Treść (HTML opcjonalny)</label>
                                {/* @ts-ignore */}
                                <textarea name="dripDay5Content" id="dripDay5Content" rows={3} defaultValue={config?.dripDay5Content || ""} placeholder="Szukamy wolontariuszy... (zostaw puste dla domyślnej treści)" className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                            </div>
                        </div>
                    </div>
                </details>
            </div>
            <SubmitButton isPending={isPending} />
        </form>
    );
}

export function CodeInjectionForm({ config }: Props) {
    const [state, formAction, isPending] = useActionState(updateCodeInjection, initialState);

    // Controlled Inputs
    const [recaptchaSiteKey, setRecaptchaSiteKey] = useState(config?.recaptchaSiteKey || "");
    const [recaptchaSecretKey, setRecaptchaSecretKey] = useState(config?.recaptchaSecretKey || "");
    const [gatId, setGatId] = useState(config?.googleAnalyticsId || "");


    return (
        <form action={formAction} className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6 space-y-6 border border-gray-100 dark:border-gray-800 transition-colors">
            <div className="flex items-center gap-3 border-b dark:border-gray-800 pb-2">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Integracje i Kod (reCAPTCHA, Google Analytics)</h3>
            </div>
            <FormFeedback state={state} />

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Google reCAPTCHA (Ochrona formularzy)</h4>
                    <div className="grid grid-cols-1 gap-y-4">
                        <div>
                            <label htmlFor="recaptchaVersion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Wersja</label>
                            <select name="recaptchaVersion" id="recaptchaVersion" defaultValue={config?.recaptchaVersion || "v2"} className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors">
                                <option value="v2">v2 Checkbox ("Nie jestem robotem")</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="recaptchaSiteKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Site Key (Klucz Strony)</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="recaptchaSiteKey"
                                    id="recaptchaSiteKey"
                                    value={recaptchaSiteKey}
                                    onChange={(e) => setRecaptchaSiteKey(e.target.value)}
                                    placeholder="6L..."
                                    className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={() => setRecaptchaSiteKey("")}
                                    disabled={!recaptchaSiteKey}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-md transition-colors border shadow-sm",
                                        recaptchaSiteKey
                                            ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900/40"
                                            : "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600 dark:border-gray-700"
                                    )}
                                    title="Usuń klucz"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="text-sm font-medium">Usuń</span>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="recaptchaSecretKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Secret Key (Klucz Sekretny)</label>
                            <div className="flex gap-2">
                                <input
                                    type="password"
                                    name="recaptchaSecretKey"
                                    id="recaptchaSecretKey"
                                    value={recaptchaSecretKey}
                                    onChange={(e) => setRecaptchaSecretKey(e.target.value)}
                                    placeholder="6L..."
                                    className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={() => setRecaptchaSecretKey("")}
                                    disabled={!recaptchaSecretKey}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-md transition-colors border shadow-sm",
                                        recaptchaSecretKey
                                            ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900/40"
                                            : "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600 dark:border-gray-700"
                                    )}
                                    title="Usuń klucz"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="text-sm font-medium">Usuń</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 text-sm">
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Jak skonfigurować reCAPTCHA Enterprise?</h5>
                        <ol className="list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-400">
                            <li>Utwórz projekt w <a href="https://console.cloud.google.com/security/recaptcha" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Google Cloud Console</a>.</li>
                            <li>Włącz <strong>reCAPTCHA Enterprise API</strong>.</li>
                            <li>Utwórz klucz (Key) typu <strong>Score-based (V3)</strong> i wklej go w pole <em>Site Key</em>.</li>
                            <li>Z zakładki "Credentials" (Dane logowania) pobierz/utwórz <strong>API Key</strong> i wklej go w pole <em>Secret Key</em>.</li>
                        </ol>
                        <p className="mt-2 text-xs text-gray-500">
                            Uwaga: Dla wersji Enterprise, pole "Secret Key" przechowuje klucz Google Cloud API Key (zaczynający się zwykle od "AIza...").
                        </p>
                    </div>
                </div>

                <div className="sm:col-span-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Google Analytics</h4>
                    <div>
                        <label htmlFor="googleAnalyticsId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ID Śledzenia (Measurement ID)</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="googleAnalyticsId"
                                id="googleAnalyticsId"
                                value={gatId}
                                onChange={(e) => setGatId(e.target.value)}
                                placeholder="G-XXXXXXXXXX"
                                className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border transition-colors font-mono"
                            />
                            <button
                                type="button"
                                onClick={() => setGatId("")}
                                disabled={!gatId}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-md transition-colors border shadow-sm",
                                    gatId
                                        ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900/40"
                                        : "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600 dark:border-gray-700"
                                )}
                                title="Usuń klucz"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="text-sm font-medium">Usuń</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <SubmitButton isPending={isPending} />
        </form>
    );
}

export function AppearanceForm({ config }: Props) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <MaintenanceModeForm config={config} />
            <NewsletterSettingsForm config={config} />

            <HomepageSettingsForm config={config} />
            <AppearanceNavigationForm config={config} />
            <CodeInjectionForm config={config} />
            <BrandingForm config={config} />
            <SeoForm config={config} />
            <CompanyForm config={config} />
            <SocialMediaForm config={config} />
            <ContactForm config={config} />
        </div>
    );
}
