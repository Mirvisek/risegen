"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AppearanceForm } from "@/components/admin/AppearanceForm";
import { PartnersList } from "@/components/admin/PartnersList";
import { AboutTextForm } from "@/components/admin/AboutTextForm";
import { HomeSliderManager } from "@/components/admin/HomeSliderManager";
import { TeamManager } from "@/components/admin/TeamManager";
import { DocumentManager } from "@/components/admin/DocumentManager";
import { EmailConfigForm } from "@/components/admin/EmailConfigForm";
import { CodeInjectionForm } from "@/components/admin/CodeInjectionForm";
import { PrivacyPolicyForm } from "@/components/admin/PrivacyPolicyForm";
import { CookiePolicyForm } from "@/components/admin/CookiePolicyForm";

interface AppearancePageTabsProps {
    config: any;
    partners: any[];
    slides: any[];
    members: any[];
    documents: any[];
}

export function AppearancePageTabs({ config, partners, slides, members, documents }: AppearancePageTabsProps) {
    const [activeTab, setActiveTab] = useState<"general" | "slider" | "team" | "documents" | "partners" | "about-text" | "email-config" | "code-injection" | "privacy-policy" | "cookie-policy">("general");

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 overflow-x-auto">
                <nav className="-mb-px flex space-x-6">
                    <button
                        onClick={() => setActiveTab("general")}
                        className={cn(
                            "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors",
                            activeTab === "general"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        )}
                    >
                        Ogólne
                    </button>
                    <button
                        onClick={() => setActiveTab("slider")}
                        className={cn(
                            "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors",
                            activeTab === "slider"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        )}
                    >
                        Baner
                    </button>
                    <button
                        onClick={() => setActiveTab("about-text")}
                        className={cn(
                            "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors",
                            activeTab === "about-text"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        )}
                    >
                        Teksty O Nas
                    </button>
                    <button
                        onClick={() => setActiveTab("team")}
                        className={cn(
                            "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors",
                            activeTab === "team"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        )}
                    >
                        Zespół
                    </button>
                    <button
                        onClick={() => setActiveTab("documents")}
                        className={cn(
                            "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors",
                            activeTab === "documents"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        )}
                    >
                        Dokumenty
                    </button>
                    <button
                        onClick={() => setActiveTab("email-config")}
                        className={cn(
                            "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors",
                            activeTab === "email-config"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        )}
                    >
                        Konfiguracja E-mail
                    </button>
                    <button
                        onClick={() => setActiveTab("code-injection")}
                        className={cn(
                            "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors",
                            activeTab === "code-injection"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        )}
                    >
                        Kody / Integracje
                    </button>
                    <button
                        onClick={() => setActiveTab("privacy-policy")}
                        className={cn(
                            "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors",
                            activeTab === "privacy-policy"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        )}
                    >
                        Polityka Prywatności
                    </button>
                    <button
                        onClick={() => setActiveTab("cookie-policy")}
                        className={cn(
                            "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors",
                            activeTab === "cookie-policy"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        )}
                    >
                        Polityka Cookies
                    </button>
                    <button
                        onClick={() => setActiveTab("partners")}
                        className={cn(
                            "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors",
                            activeTab === "partners"
                                ? "border-indigo-500 text-indigo-600"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        )}
                    >
                        Partnerzy
                    </button>
                </nav>
            </div>

            <div className="animate-in fade-in duration-300">
                {activeTab === "general" && (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Ustawienia Organizacji i Stopki</h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Edytuj dane kontaktowe i wygląd stopki.
                            </p>
                        </div>
                        <AppearanceForm config={config} />
                    </div>
                )}
                {activeTab === "slider" && (
                    <HomeSliderManager slides={slides} config={config} />
                )}
                {activeTab === "about-text" && (
                    <AboutTextForm
                        initialText={config?.aboutUsText}
                        initialGoals={config?.aboutUsGoals}
                        initialJoinText={config?.aboutUsJoinText}
                    />
                )}
                {activeTab === "team" && (
                    <TeamManager members={members} />
                )}
                {activeTab === "documents" && (
                    <DocumentManager documents={documents} />
                )}
                {activeTab === "email-config" && (
                    <EmailConfigForm config={config} />
                )}
                {activeTab === "code-injection" && (
                    <CodeInjectionForm config={config} />
                )}
                {activeTab === "privacy-policy" && (
                    <PrivacyPolicyForm config={config} />
                )}
                {activeTab === "cookie-policy" && (
                    <CookiePolicyForm config={config} />
                )}
                {activeTab === "partners" && (
                    <PartnersList partners={partners} />
                )}
            </div>
        </div>
    );
}
