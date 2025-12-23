"use client";

import { useState, useActionState } from "react";
import { updateCompanyData, updateSocialMedia, updateContactData, updateHomepageSettings, updateBranding, updateSeoConfig, updateMaintenanceMode } from "@/app/admin/wyglad/actions";
import { AppearanceNavigationForm } from "./AppearanceNavigationForm"; // Added import
import { Loader2, Check, Upload } from "lucide-react";
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
        googleCalendarId?: string | null;
        isMaintenanceMode?: boolean;
        maintenanceMessage?: string | null;
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

    return (
        <form action={formAction} className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6 space-y-6 border border-gray-100 dark:border-gray-800 transition-colors">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white border-b dark:border-gray-800 pb-2">Dane Kontaktowe (Strona Kontakt)</h3>
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
            </div>
            <SubmitButton isPending={isPending} />
        </form>
    );
}

export function HomepageSettingsForm({ config }: Props) {
    const [state, formAction, isPending] = useActionState(updateHomepageSettings, initialState);

    return (
        <form action={formAction} className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6 space-y-6 border border-gray-100 dark:border-gray-800 transition-colors">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white border-b dark:border-gray-800 pb-2">Ustawienia Strony Głównej</h3>
            <FormFeedback state={state} />
            <div className="space-y-4">
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
                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="showEvents" className="font-medium text-gray-700 dark:text-gray-300">Wydarzenia</label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Włącza/wyłącza zakładkę i sekcję Wydarzeń.</p>
                    </div>
                    <div className="flex items-center h-5">
                        <input
                            id="showEvents"
                            name="showEvents"
                            type="checkbox"
                            defaultChecked={config?.showEvents ?? true}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="showStats" className="font-medium text-gray-700 dark:text-gray-300">Licznik Sukcesów (Statystyki)</label>
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

export function AppearanceForm({ config }: Props) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <MaintenanceModeForm config={config} />
            <HomepageSettingsForm config={config} />
            <AppearanceNavigationForm config={config} />
            <BrandingForm config={config} />
            <SeoForm config={config} />
            <CompanyForm config={config} />
            <SocialMediaForm config={config} />
            <ContactForm config={config} />
        </div>
    );
}
