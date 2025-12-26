"use client";

import { useActionState, useState, useEffect } from "react";
import { updateCodeInjection } from "@/app/admin/wyglad/actions";
import { verifyRecaptchaConfigAction } from "@/app/admin/wyglad/verify-recaptcha";
import { verifyP24ConnectionAction } from "@/app/admin/wyglad/verify-p24";
import { Loader2, Save, Code, CheckCircle, XCircle, ChevronRight, ExternalLink, ArrowLeft, Shield, BarChart3, HelpCircle, Activity, Trash2, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import clsx from "clsx";

interface Props {
    config: any;
}

type WizardStep =
    | "DASHBOARD"
    | "SELECT_SERVICE"
    | "RECAPTCHA_INTRO"
    | "RECAPTCHA_PROJECT"
    | "RECAPTCHA_API_ENABLE"
    | "RECAPTCHA_SITE_KEY"
    | "RECAPTCHA_API_KEY"
    | "RECAPTCHA_TEST"
    | "RECAPTCHA_REVIEW"
    | "GA4_INPUT"
    | "DISCORD_INTRO"
    | "DISCORD_INPUT"
    | "P24_INTRO"
    | "P24_INPUT"
    | "P24_TEST";

const DiscordIcon = ({ className }: { className?: string }) => (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg"><title>Discord</title><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.5151.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.006.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.699.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" /></svg>
);

export function CodeInjectionForm({ config }: Props) {
    const [state, formAction, isPending] = useActionState(updateCodeInjection, null);
    const router = useRouter();
    const [step, setStep] = useState<WizardStep>("DASHBOARD");

    const [formData, setFormData] = useState({
        recaptchaVersion: config?.recaptchaVersion || "v3",
        recaptchaSiteKey: config?.recaptchaSiteKey || "",
        recaptchaSecretKey: config?.recaptchaSecretKey || "",
        recaptchaProjectId: config?.recaptchaProjectId || "risegen-1765937398889",
        googleAnalyticsId: config?.googleAnalyticsId || "",
        discordWebhookContactUrl: config?.discordWebhookContactUrl || "",
        discordWebhookApplicationUrl: config?.discordWebhookApplicationUrl || "",
        p24MerchantId: config?.p24MerchantId || "",
        p24PosId: config?.p24PosId || "",
        p24ApiKey: config?.p24ApiKey || "",
        p24Crc: config?.p24Crc || "",
        p24IsSandbox: config?.p24IsSandbox || false,
        enableDonations: config?.enableDonations || false,
    });

    const [isTestLoading, setIsTestLoading] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

    useEffect(() => {
        if (state?.message) {
            if (state.success) {
                toast.success(state.message);
                router.refresh();
                setStep("DASHBOARD");
            } else {
                toast.error(state.message);
            }
        }
    }, [state, router]);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setTestResult(null);
    };

    const isRecaptchaConfigured = !!config?.recaptchaSiteKey && !!config?.recaptchaSecretKey && !!config?.recaptchaProjectId;
    const isGa4Configured = !!config?.googleAnalyticsId;
    const isDiscordConfigured = !!config?.discordWebhookContactUrl || !!config?.discordWebhookApplicationUrl;
    const isP24Configured = !!config?.p24MerchantId && !!config?.p24ApiKey && !!config?.p24Crc;

    // --- Recaptcha Test Logic ---
    const loadRecaptchaScript = (siteKey: string): Promise<boolean> => {
        return new Promise((resolve) => {
            const existing = document.getElementById("recaptcha-test-script");
            if (existing) existing.remove();
            const badge = document.querySelector('.grecaptcha-badge');
            if (badge) badge.remove();

            const script = document.createElement("script");
            script.id = "recaptcha-test-script";
            script.src = `https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`;
            script.async = true;
            script.onload = () => {
                if (window.grecaptcha && window.grecaptcha.enterprise) {
                    window.grecaptcha.enterprise.ready(() => resolve(true));
                } else {
                    resolve(false);
                }
            };
            script.onerror = () => resolve(false);
            document.head.appendChild(script);
        });
    };

    const runRecaptchaTest = async () => {
        setIsTestLoading(true);
        setTestResult(null);
        try {
            const scriptLoaded = await loadRecaptchaScript(formData.recaptchaSiteKey);
            if (!scriptLoaded) {
                setTestResult({ success: false, message: "Nie udało się załadować skryptu." });
                setIsTestLoading(false);
                return;
            }
            const token = await window.grecaptcha.enterprise.execute(formData.recaptchaSiteKey, { action: 'config_test' });
            if (!token) {
                setTestResult({ success: false, message: "Błąd generowania tokenu." });
                setIsTestLoading(false);
                return;
            }
            const result = await verifyRecaptchaConfigAction(formData.recaptchaSiteKey, formData.recaptchaSecretKey, token, formData.recaptchaProjectId);
            setTestResult(result);
        } catch (error) {
            console.error(error);
            setTestResult({ success: false, message: "Błąd techniczny." });
        } finally {
            setIsTestLoading(false);
        }
    };

    // --- P24 Test Logic ---
    const runP24Test = async () => {
        setIsTestLoading(true);
        setTestResult(null);
        try {
            const result = await verifyP24ConnectionAction(
                formData.p24MerchantId,
                formData.p24PosId || formData.p24MerchantId,
                formData.p24ApiKey,
                formData.p24Crc
            );
            setTestResult(result);
        } catch (error) {
            console.error(error);
            setTestResult({ success: false, message: "Błąd techniczny." });
        } finally {
            setIsTestLoading(false);
        }
    };

    const renderHiddenInputs = (exclude: string[] = []) => (
        <>
            <input type="hidden" name="recaptchaVersion" value={formData.recaptchaVersion} />
            <input type="hidden" name="recaptchaProjectId" value={formData.recaptchaProjectId} />
            <input type="hidden" name="recaptchaSiteKey" value={formData.recaptchaSiteKey} />
            <input type="hidden" name="recaptchaSecretKey" value={formData.recaptchaSecretKey} />
            <input type="hidden" name="googleAnalyticsId" value={formData.googleAnalyticsId} />
            <input type="hidden" name="discordWebhookContactUrl" value={formData.discordWebhookContactUrl} />
            <input type="hidden" name="discordWebhookApplicationUrl" value={formData.discordWebhookApplicationUrl} />
            <input type="hidden" name="p24MerchantId" value={formData.p24MerchantId} />
            <input type="hidden" name="p24PosId" value={formData.p24PosId} />
            <input type="hidden" name="p24ApiKey" value={formData.p24ApiKey} />
            <input type="hidden" name="p24Crc" value={formData.p24Crc} />
            {!exclude.includes("p24IsSandbox") && formData.p24IsSandbox && <input type="hidden" name="p24IsSandbox" value="on" />}
            {!exclude.includes("enableDonations") && formData.enableDonations && <input type="hidden" name="enableDonations" value="on" />}
        </>
    );

    const renderDashboard = () => (
        <div className="space-y-6">
            <div className="border-b dark:border-gray-800 pb-4 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Code className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Integracje i Kody
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* reCAPTCHA */}
                <div className={clsx("p-6 rounded-xl border transition-all", isRecaptchaConfigured ? "bg-green-50 dark:bg-green-900/10 border-green-200" : "bg-gray-50 dark:bg-gray-800/50 border-gray-200")}>
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={clsx("p-2 rounded-lg", isRecaptchaConfigured ? "bg-green-100 text-green-600" : "bg-white text-gray-400")}><Shield className="h-6 w-6" /></div>
                            <div><h4 className="font-semibold text-gray-900 dark:text-white">reCAPTCHA</h4><p className="text-xs text-gray-500">{isRecaptchaConfigured ? "Aktywna" : "Pusta"}</p></div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isRecaptchaConfigured && (<form action={formAction}>{renderHiddenInputs()}<input type="hidden" name="recaptchaSiteKey" value="" /><input type="hidden" name="recaptchaSecretKey" value="" /><input type="hidden" name="recaptchaProjectId" value="" /><button type="submit" onClick={(e) => !confirm("Usunąć?") && e.preventDefault()} className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="h-5 w-5" /></button></form>)}
                            {isRecaptchaConfigured ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-gray-400" />}
                        </div>
                    </div>
                </div>

                {/* GA4 */}
                <div className={clsx("p-6 rounded-xl border transition-all", isGa4Configured ? "bg-orange-50 dark:bg-orange-900/10 border-orange-200" : "bg-gray-50 dark:bg-gray-800/50 border-gray-200")}>
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={clsx("p-2 rounded-lg", isGa4Configured ? "bg-orange-100 text-orange-600" : "bg-white text-gray-400")}><BarChart3 className="h-6 w-6" /></div>
                            <div><h4 className="font-semibold text-gray-900 dark:text-white">GA4</h4><p className="text-xs text-gray-500">{isGa4Configured ? "Aktywne" : "Puste"}</p></div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isGa4Configured && (<form action={formAction}>{renderHiddenInputs()}<input type="hidden" name="googleAnalyticsId" value="" /><button type="submit" onClick={(e) => !confirm("Usunąć?") && e.preventDefault()} className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="h-5 w-5" /></button></form>)}
                            {isGa4Configured ? <CheckCircle className="h-5 w-5 text-orange-500" /> : <XCircle className="h-5 w-5 text-gray-400" />}
                        </div>
                    </div>
                </div>

                {/* Discord */}
                <div className={clsx("p-6 rounded-xl border transition-all", isDiscordConfigured ? "bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200" : "bg-gray-50 dark:bg-gray-800/50 border-gray-200")}>
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={clsx("p-2 rounded-lg", isDiscordConfigured ? "bg-indigo-100 text-indigo-600" : "bg-white text-gray-400")}><DiscordIcon className="h-6 w-6" /></div>
                            <div><h4 className="font-semibold text-gray-900 dark:text-white">Discord</h4><p className="text-xs text-gray-500">{isDiscordConfigured ? "Powiadomienia OK" : "Brak"}</p></div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isDiscordConfigured && (<form action={formAction}>{renderHiddenInputs()}<input type="hidden" name="discordWebhookContactUrl" value="" /><input type="hidden" name="discordWebhookApplicationUrl" value="" /><button type="submit" onClick={(e) => !confirm("Usunąć?") && e.preventDefault()} className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="h-5 w-5" /></button></form>)}
                            {isDiscordConfigured ? <CheckCircle className="h-5 w-5 text-indigo-500" /> : <XCircle className="h-5 w-5 text-gray-400" />}
                        </div>
                    </div>
                </div>

                {/* Przelewy24 */}
                <div className={clsx("p-6 rounded-xl border transition-all", isP24Configured ? "bg-[#f15a29]/10 border-[#f15a29]/30" : "bg-gray-50 dark:bg-gray-800/50 border-gray-200")}>
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={clsx("p-2 rounded-lg", isP24Configured ? "bg-[#f15a29]/20 text-[#f15a29]" : "bg-white text-gray-400")}><CreditCard className="h-6 w-6" /></div>
                            <div><h4 className="font-semibold text-gray-900 dark:text-white">Przelewy24</h4><p className="text-xs text-gray-500">{isP24Configured ? "Skonfigurowano" : "Brak"} {config?.enableDonations ? "(Włączone)" : "(Wyłączone)"}</p></div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isP24Configured && (<form action={formAction}>{renderHiddenInputs()}<input type="hidden" name="p24MerchantId" value="" /><input type="hidden" name="p24ApiKey" value="" /><input type="hidden" name="enableDonations" value="off" /><button type="submit" onClick={(e) => !confirm("Usunąć?") && e.preventDefault()} className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="h-5 w-5" /></button></form>)}
                            {isP24Configured ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-gray-400" />}
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4 flex justify-center">
                <button onClick={() => setStep("SELECT_SERVICE")} className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/20 font-medium text-lg"><Code className="h-5 w-5" /> Konfiguruj Integracje</button>
            </div>
        </div>
    );

    const WizardWrapper = ({ children, onBack }: { children: React.ReactNode, onBack?: () => void }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
                    <button onClick={onBack || (() => setStep("DASHBOARD"))} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition"><ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" /></button>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Kreator Konfiguracji</span>
                    <div className="w-9" />
                </div>
                <div className="p-8 overflow-y-auto flex-1">{children}</div>
            </div>
        </div>
    );

    // Header helper
    const renderHeader = (title: string, subtitle?: string) => (<div className="mb-8 text-center"><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>{subtitle && <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">{subtitle}</p>}</div>);

    if (step === "DASHBOARD") return renderDashboard();

    if (step === "SELECT_SERVICE") return (
        <WizardWrapper>
            {renderHeader("Co chcesz skonfigurować?")}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {/* ReCAPTCHA */}
                <button onClick={() => setStep("RECAPTCHA_INTRO")} className="p-6 rounded-xl border-2 border-gray-100 dark:border-gray-800 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition group text-left">
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg w-fit mb-4"><Shield className="h-8 w-8" /></div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Google reCAPTCHA</h3>
                    <p className="text-sm text-gray-500">Ochrona przed spamem.</p>
                </button>
                {/* GA4 */}
                <button onClick={() => setStep("GA4_INPUT")} className="p-6 rounded-xl border-2 border-gray-100 dark:border-gray-800 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition group text-left">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg w-fit mb-4"><BarChart3 className="h-8 w-8" /></div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Google Analytics 4</h3>
                    <p className="text-sm text-gray-500">Statystyki odwiedzin.</p>
                </button>
                {/* Discord */}
                <button onClick={() => setStep("DISCORD_INTRO")} className="p-6 rounded-xl border-2 border-gray-100 dark:border-gray-800 hover:border-[#5865F2] hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition group text-left">
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-[#5865F2] rounded-lg w-fit mb-4"><DiscordIcon className="h-8 w-8" /></div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Discord Webhooks</h3>
                    <p className="text-sm text-gray-500">Powiadomienia na serwer.</p>
                </button>
                {/* P24 */}
                <button onClick={() => setStep("P24_INTRO")} className="p-6 rounded-xl border-2 border-gray-100 dark:border-gray-800 hover:border-[#f15a29] hover:bg-orange-50 dark:hover:bg-orange-900/20 transition group text-left">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-[#f15a29] rounded-lg w-fit mb-4"><CreditCard className="h-8 w-8" /></div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Przelewy24</h3>
                    <p className="text-sm text-gray-500">Płatności online (Dla wspierających).</p>
                </button>
            </div>
        </WizardWrapper>
    );

    // ... RECAPTCHA STEPS ...
    if (step === "RECAPTCHA_INTRO") return (<WizardWrapper onBack={() => setStep("SELECT_SERVICE")}><div className="flex flex-col items-center text-center space-y-6"><Shield className="h-16 w-16 text-indigo-600" />{renderHeader("Konfiguracja reCAPTCHA Enterprise", "Będziemy potrzebować dostępu do Google Cloud Console.")}<button onClick={() => setStep("RECAPTCHA_PROJECT")} className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition">Rozpocznij</button></div></WizardWrapper>);
    if (step === "RECAPTCHA_PROJECT") return (<WizardWrapper onBack={() => setStep("RECAPTCHA_INTRO")}>{renderHeader("Projekt Google Cloud")}<div className="space-y-4"><div><label className="block text-sm font-medium">Project ID</label><input type="text" value={formData.recaptchaProjectId} onChange={e => handleInputChange("recaptchaProjectId", e.target.value)} className="w-full p-3 border rounded-lg bg-transparent" placeholder="project-id" /></div><div className="text-center pt-4"><button disabled={!formData.recaptchaProjectId} onClick={() => setStep("RECAPTCHA_API_ENABLE")} className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700">Dalej</button></div></div></WizardWrapper>);
    if (step === "RECAPTCHA_API_ENABLE") return (<WizardWrapper onBack={() => setStep("RECAPTCHA_PROJECT")}>{renderHeader("Włącz API", "Upewnij się, że włączyłeś 'reCAPTCHA Enterprise API' w konsoli.")}<div className="text-center pt-8"><button onClick={() => setStep("RECAPTCHA_SITE_KEY")} className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700">Zrobione, Dalej</button></div></WizardWrapper>);
    if (step === "RECAPTCHA_SITE_KEY") return (<WizardWrapper onBack={() => setStep("RECAPTCHA_API_ENABLE")}>{renderHeader("Site Key", "Utwórz klucz typu Score-based (v3).")}<div className="space-y-4"><div><label className="block text-sm font-medium">Site Key</label><input type="text" value={formData.recaptchaSiteKey} onChange={e => handleInputChange("recaptchaSiteKey", e.target.value)} className="w-full p-3 border rounded-lg bg-transparent" placeholder="6Lc..." /></div><div className="text-center pt-4"><button disabled={!formData.recaptchaSiteKey} onClick={() => setStep("RECAPTCHA_API_KEY")} className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700">Dalej</button></div></div></WizardWrapper>);
    if (step === "RECAPTCHA_API_KEY") return (<WizardWrapper onBack={() => setStep("RECAPTCHA_SITE_KEY")}>{renderHeader("API Key", "Stwórz Credentials -> API Key.")}<div className="space-y-4"><div><label className="block text-sm font-medium">API Key</label><input type="text" value={formData.recaptchaSecretKey} onChange={e => handleInputChange("recaptchaSecretKey", e.target.value)} className="w-full p-3 border rounded-lg bg-transparent" placeholder="AIza..." /></div><div className="text-center pt-4"><button disabled={!formData.recaptchaSecretKey} onClick={() => setStep("RECAPTCHA_TEST")} className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700">Testuj</button></div></div></WizardWrapper>);

    if (step === "RECAPTCHA_TEST") return (
        <WizardWrapper onBack={() => setStep("RECAPTCHA_API_KEY")}>
            {renderHeader("Test Połączenia")}
            <div className="text-center space-y-4">
                {!testResult && !isTestLoading && <button onClick={runRecaptchaTest} className="bg-indigo-600 text-white px-8 py-3 rounded-xl">Sprawdź</button>}
                {isTestLoading && <Loader2 className="animate-spin h-8 w-8 mx-auto text-indigo-600" />}
                {testResult && (<div className={clsx("p-4 rounded-lg", testResult.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}>{testResult.message}</div>)}
                <div className="pt-4"><button disabled={!testResult?.success} onClick={() => setStep("RECAPTCHA_REVIEW")} className="bg-green-600 disabled:opacity-50 text-white px-8 py-3 rounded-xl">Podsumowanie</button></div>
            </div>
        </WizardWrapper>
    );

    if (step === "RECAPTCHA_REVIEW") return (
        <WizardWrapper onBack={() => setStep("RECAPTCHA_TEST")}>
            {renderHeader("Zapisz Zmiany")}
            <div className="mb-6"><code className="block bg-gray-100 p-2 text-sm">{formData.recaptchaProjectId}</code><code className="block bg-gray-100 p-2 text-sm mt-2">{formData.recaptchaSiteKey}</code></div>
            <form action={formAction} className="text-center">
                {renderHiddenInputs()}
                <button type="submit" disabled={isPending} className="bg-green-600 text-white px-8 py-3 rounded-xl flex items-center gap-2 mx-auto">{isPending ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />} Zapisz</button>
            </form>
        </WizardWrapper>
    );

    if (step === "GA4_INPUT") return (
        <WizardWrapper onBack={() => setStep("SELECT_SERVICE")}>
            {renderHeader("Google Analytics 4")}
            <div className="space-y-6">
                <div><label className="block text-sm font-medium">Measurement ID</label><input type="text" value={formData.googleAnalyticsId} onChange={e => handleInputChange("googleAnalyticsId", e.target.value)} className="w-full p-3 border rounded-lg bg-transparent" placeholder="G-XXXXXXXX" /></div>
                <form action={formAction} className="text-center pt-4">{renderHiddenInputs()}<button type="submit" disabled={isPending} className="bg-green-600 text-white px-8 py-3 rounded-xl">{isPending ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />} Zapisz</button></form>
            </div>
        </WizardWrapper>
    );

    if (step === "DISCORD_INTRO") return (<WizardWrapper onBack={() => setStep("SELECT_SERVICE")}><div className="text-center space-y-6"><DiscordIcon className="h-16 w-16 text-[#5865F2] mx-auto" />{renderHeader("Konfiguracja Discord")}<button onClick={() => setStep("DISCORD_INPUT")} className="bg-[#5865F2] text-white px-8 py-3 rounded-xl">Konfiguruj</button></div></WizardWrapper>);

    if (step === "DISCORD_INPUT") return (
        <WizardWrapper onBack={() => setStep("DISCORD_INTRO")}>
            {renderHeader("Webhooki")}
            <div className="space-y-4">
                <div><label className="block text-sm font-medium">Kontakt</label><input type="url" value={formData.discordWebhookContactUrl} onChange={e => handleInputChange("discordWebhookContactUrl", e.target.value)} className="w-full p-3 border rounded-lg bg-transparent" /></div>
                <div><label className="block text-sm font-medium">Zgłoszenia</label><input type="url" value={formData.discordWebhookApplicationUrl} onChange={e => handleInputChange("discordWebhookApplicationUrl", e.target.value)} className="w-full p-3 border rounded-lg bg-transparent" /></div>
                <form action={formAction} className="text-center pt-4">{renderHiddenInputs()}<button type="submit" disabled={isPending} className="bg-[#5865F2] text-white px-8 py-3 rounded-xl">Zapisz</button></form>
            </div>
        </WizardWrapper>
    );

    // --- P24 STEPS ---
    if (step === "P24_INTRO") return (
        <WizardWrapper onBack={() => setStep("SELECT_SERVICE")}>
            <div className="text-center space-y-6">
                <CreditCard className="h-16 w-16 text-[#f15a29] mx-auto" />
                {renderHeader("Konfiguracja Przelewy24", "Przyjmuj wpłaty na cele statutowe (Darowizny).")}
                <p className="text-sm bg-orange-50 p-4 rounded text-orange-800 text-left">
                    Potrzebujesz konta w Przelewy24. Dane znajdziesz w panelu w zakładce <strong>Moje Dane</strong>.
                </p>
                <button onClick={() => setStep("P24_INPUT")} className="bg-[#f15a29] text-white px-8 py-3 rounded-xl hover:bg-orange-600 transition">Rozpocznij</button>
            </div>
        </WizardWrapper>
    );

    if (step === "P24_INPUT") return (
        <WizardWrapper onBack={() => setStep("P24_INTRO")}>
            {renderHeader("Dane Integracyjne")}
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium">Merchant ID</label><input type="text" value={formData.p24MerchantId} onChange={e => handleInputChange("p24MerchantId", e.target.value)} className="w-full p-3 border rounded-lg bg-transparent font-mono" placeholder="12345" /></div>
                    <div><label className="block text-sm font-medium">POS ID</label><input type="text" value={formData.p24PosId} onChange={e => handleInputChange("p24PosId", e.target.value)} className="w-full p-3 border rounded-lg bg-transparent font-mono" placeholder="12345" /></div>
                </div>
                <div><label className="block text-sm font-medium">API Key (REST)</label><input type="password" value={formData.p24ApiKey} onChange={e => handleInputChange("p24ApiKey", e.target.value)} className="w-full p-3 border rounded-lg bg-transparent font-mono" /></div>
                <div><label className="block text-sm font-medium">CRC Key</label><input type="password" value={formData.p24Crc} onChange={e => handleInputChange("p24Crc", e.target.value)} className="w-full p-3 border rounded-lg bg-transparent font-mono" /></div>

                <div className="text-center pt-4">
                    <button disabled={!formData.p24MerchantId || !formData.p24ApiKey} onClick={() => setStep("P24_TEST")} className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700">Dalej (Test Połączenia)</button>
                </div>
            </div>
        </WizardWrapper>
    );

    if (step === "P24_TEST") return (
        <WizardWrapper onBack={() => setStep("P24_INPUT")}>
            {renderHeader("Test Połączenia P24", "Sprawdzamy poprawność kluczy API.")}
            <div className="text-center space-y-6">
                <div className="bg-gray-100 p-3 rounded text-sm text-gray-600">Testujemy połączenie z serwerem produkcyjnym (secure.przelewy24.pl).</div>

                {!testResult && !isTestLoading && (
                    <button onClick={runP24Test} className="bg-[#f15a29] text-white px-8 py-3 rounded-xl hover:bg-orange-600 flex items-center gap-2 mx-auto">
                        <Activity className="h-5 w-5" /> Testuj Połączenie
                    </button>
                )}

                {isTestLoading && <Loader2 className="animate-spin h-10 w-10 text-[#f15a29] mx-auto" />}

                {testResult && (
                    <div className={clsx("p-4 rounded-xl border text-left", testResult.success ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800")}>
                        <div className="flex items-start gap-3">
                            {testResult.success ? <CheckCircle className="h-6 w-6 shrink-0" /> : <XCircle className="h-6 w-6 shrink-0" />}
                            <div>
                                <h4 className="font-bold">{testResult.success ? "Połączono!" : "Błąd"}</h4>
                                <p>{testResult.message}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="border-t pt-6 mt-4">
                    <form action={formAction} className="flex flex-col items-center gap-4">
                        {renderHiddenInputs(["enableDonations", "p24IsSandbox"])}

                        <div className="flex flex-col gap-3 items-start">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="p24IsSandbox" checked={formData.p24IsSandbox} onChange={e => handleInputChange("p24IsSandbox", e.target.checked)} className="h-5 w-5 text-indigo-500 border-gray-300 rounded focus:ring-indigo-500" />
                                <span className="text-gray-700 dark:text-gray-300">Tryb Sandbox (Testowy)</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="enableDonations" checked={formData.enableDonations} onChange={e => handleInputChange("enableDonations", e.target.checked)} className="h-5 w-5 text-[#f15a29] border-gray-300 rounded focus:ring-[#f15a29]" />
                                <span className="font-medium">Włącz przyjmowanie wpłat na stronie</span>
                            </label>
                        </div>

                        <button type="submit" disabled={isPending || (!testResult?.success && !formData.p24MerchantId)} className="bg-green-600 text-white px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-green-700">
                            {isPending ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />} Zapisz Konfigurację
                        </button>
                    </form>
                </div>
            </div>
        </WizardWrapper>
    );

    return null;
}
