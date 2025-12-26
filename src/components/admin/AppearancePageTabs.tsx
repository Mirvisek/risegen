"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    BrandingForm,
    CompanyForm,
    SocialMediaForm,
    SeoForm,
    ContactForm,
    HomepageSettingsForm,
    MaintenanceModeForm,
    CalendarForm,
    NewsletterSettingsForm
} from "@/components/admin/AppearanceForm";
import { AppearanceNavigationForm } from "@/components/admin/AppearanceNavigationForm";
import { SiteConfig, Partner, HomeHeroSlide, TeamMember, Document as PrismaDocument } from "@prisma/client";


import { PartnersList } from "@/components/admin/PartnersList";
import { AboutTextForm } from "@/components/admin/AboutTextForm";
import { HomeSliderManager } from "@/components/admin/HomeSliderManager";
import { TeamManager } from "@/components/admin/TeamManager";
import { DocumentManager } from "@/components/admin/DocumentManager";
import { EmailConfigForm } from "@/components/admin/EmailConfigForm";
import { CodeInjectionForm } from "@/components/admin/CodeInjectionForm";
import { PrivacyPolicyForm } from "@/components/admin/PrivacyPolicyForm";
import { CookiePolicyForm } from "@/components/admin/CookiePolicyForm";
import { AccessibilityDeclarationForm } from "@/components/admin/AccessibilityDeclarationForm";
import { TeamSettingsForm } from "@/components/admin/TeamSettingsForm";
import {
    Settings,
    Palette,
    ShieldCheck,
    Terminal,
    Layout,
    Image as ImageIcon,
    Users,
    FileText,
    Share2,
    Calendar,
    Hammer,
    Mail,
    Code,
    Search,
    Menu,
    Eye,
    Handshake,
    Newspaper
} from "lucide-react";

interface AppearancePageTabsProps {
    config: SiteConfig | null;
    partners: Partner[];
    slides: HomeHeroSlide[];
    members: TeamMember[];
    documents: PrismaDocument[];
}

type MainTab = "general" | "appearance" | "policies" | "config";

export function AppearancePageTabs({ config, partners, slides, members, documents }: AppearancePageTabsProps) {
    const searchParams = useSearchParams();
    const [activeMainTab, setActiveMainTab] = useState<MainTab>((searchParams.get("tab") as MainTab) || "general");
    const [activeSubTab, setActiveSubTab] = useState<string>(searchParams.get("sub") || "general-org");

    const mainTabs = [
        { id: "general", label: "Ogólne", icon: Settings },
        { id: "appearance", label: "Wygląd", icon: Palette },
        { id: "policies", label: "Polityki", icon: ShieldCheck },
        { id: "config", label: "Konfiguracja", icon: Terminal },
    ];

    const subTabs: Record<MainTab, { id: string, label: string, icon: any }[]> = {
        general: [
            { id: "general-org", label: "Dane Stowarzyszenia", icon: Settings },
            { id: "general-contact", label: "Dane kontaktowe", icon: Mail },
            { id: "general-socials", label: "Media społecznościowe", icon: Share2 },
        ],
        appearance: [
            { id: "appearance-home", label: "Ustawienia Strony Głównej", icon: Layout },
            { id: "appearance-nav", label: "Nawigacja: Menu „O Nas”", icon: Menu },
            { id: "appearance-branding", label: "Branding", icon: ImageIcon },
            { id: "appearance-banner", label: "Baner (Slider)", icon: ImageIcon },
            { id: "appearance-team", label: "Zespół", icon: Users },
            { id: "appearance-docs", label: "Dokumenty", icon: FileText },
            { id: "appearance-about", label: "Teksty z menu „O Nas”", icon: FileText },
            { id: "appearance-partners", label: "Partnerzy", icon: Handshake },
        ],
        policies: [
            { id: "policies-privacy", label: "Polityka prywatności", icon: ShieldCheck },
            { id: "policies-cookies", label: "Polityka cookies", icon: ShieldCheck },
            { id: "policies-accessibility", label: "Deklaracja dostępności", icon: Eye },
        ],
        config: [
            { id: "config-newsletter", label: "Newsletter", icon: Newspaper },
            { id: "config-seo", label: "Ustawienia SEO", icon: Search },
            { id: "config-email", label: "Konfiguracja E-Mail", icon: Mail },
            { id: "config-codes", label: "Kody / integracje", icon: Code },
            { id: "config-calendar", label: "Kalendarz", icon: Calendar },
            { id: "config-maintenance", label: "Tryb przebudowy", icon: Hammer },
        ]
    };

    const handleMainTabChange = (tabId: MainTab) => {
        setActiveMainTab(tabId);
        setActiveSubTab(subTabs[tabId][0].id);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm transition-colors duration-300">
            {/* Main Tabs Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 pt-4 sm:pt-6 shrink-0 z-20 transition-colors duration-300">
                <nav className="-mb-px flex space-x-6 sm:space-x-8 overflow-x-auto scrollbar-hide pb-1">
                    {mainTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeMainTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleMainTabChange(tab.id as MainTab)}
                                className={cn(
                                    "flex items-center gap-2 py-3 sm:py-4 px-1 border-b-2 font-medium text-sm transition-all whitespace-nowrap",
                                    isActive
                                        ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
                                )}
                            >
                                <Icon className={cn("h-4 w-4", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500")} />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-[500px] sm:min-h-[700px]">
                {/* Sub-tabs Sidebar */}
                <aside className="w-full lg:w-64 bg-white dark:bg-gray-900 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 p-3 lg:p-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto shrink-0 z-10 scrollbar-hide lg:scrollbar-default transition-colors duration-300">
                    <p className="hidden lg:block px-3 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Sekcje</p>
                    {subTabs[activeMainTab].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeSubTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveSubTab(tab.id)}
                                className={cn(
                                    "flex-shrink-0 lg:flex-shrink lg:w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                                    isActive
                                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 shadow-sm border border-indigo-100/50 dark:border-indigo-800/50"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 border border-transparent"
                                )}
                            >
                                <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500")} />
                                <span className="">{tab.label}</span>
                            </button>
                        );
                    })}
                </aside>

                {/* Content Area */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm transition-colors duration-300">
                    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                        {/* Ogólne Content */}
                        {activeSubTab === "general-org" && <CompanyForm config={config} />}
                        {activeSubTab === "general-contact" && <ContactForm config={config} />}
                        {activeSubTab === "general-socials" && <SocialMediaForm config={config} />}

                        {/* Wygląd Content */}
                        {activeSubTab === "appearance-home" && <HomepageSettingsForm config={config} />}
                        {activeSubTab === "appearance-nav" && <AppearanceNavigationForm config={config} />}
                        {activeSubTab === "appearance-branding" && <BrandingForm config={config} />}
                        {activeSubTab === "appearance-banner" && <HomeSliderManager slides={slides} config={config} />}
                        {activeSubTab === "appearance-team" && (
                            <div className="space-y-12">
                                <TeamSettingsForm config={config} />
                                <div className="border-t pt-12">
                                    <TeamManager members={members} />
                                </div>
                            </div>
                        )}
                        {activeSubTab === "appearance-docs" && <DocumentManager documents={documents} />}
                        {activeSubTab === "appearance-about" && (
                            <AboutTextForm
                                initialText={config?.aboutUsText}
                                initialGoals={config?.aboutUsGoals}
                                initialJoinText={config?.aboutUsJoinText}
                            />
                        )}
                        {activeSubTab === "appearance-partners" && <PartnersList partners={partners} />}

                        {/* Polityki Content */}
                        {activeSubTab === "policies-privacy" && <PrivacyPolicyForm config={config} />}
                        {activeSubTab === "policies-cookies" && <CookiePolicyForm config={config} />}
                        {activeSubTab === "policies-accessibility" && <AccessibilityDeclarationForm config={config} />}

                        {/* Konfiguracja Content */}
                        {activeSubTab === "config-newsletter" && <NewsletterSettingsForm config={config} />}
                        {activeSubTab === "config-seo" && <SeoForm config={config} />}
                        {activeSubTab === "config-email" && <EmailConfigForm config={config} />}
                        {activeSubTab === "config-codes" && (
                            <CodeInjectionForm config={config} />
                        )}
                        {activeSubTab === "config-calendar" && (
                            <CalendarForm config={config} />
                        )}
                        {activeSubTab === "config-maintenance" && <MaintenanceModeForm config={config} />}
                    </div>
                </main>
            </div>
        </div>
    );
}
