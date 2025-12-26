"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { copyFile, stat } from "fs/promises";
import { z } from "zod";
import { join } from "path";
import sharp from "sharp";

function checkPermission(session: any) {
    return session?.user?.roles && Array.isArray(session.user.roles) && session.user.roles.includes("SUPERADMIN");
}

export async function updateCompanyData(prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!checkPermission(session)) return { success: false, message: "Brak uprawnień." };

    const orgName = formData.get("orgName") as string;
    const orgNip = formData.get("orgNip") as string;
    const orgRegon = formData.get("orgRegon") as string;
    const orgBankAccount = formData.get("orgBankAccount") as string;

    const showTaxOnePointFive = formData.get("showTaxOnePointFive") === "on";
    const enableDonations = formData.get("enableDonations") === "on";
    const showBankTransferDetails = formData.get("showBankTransferDetails") === "on";
    const taxKrs = formData.get("taxKrs") as string;
    const taxGoal = formData.get("taxGoal") as string;

    try {
        await prisma.siteConfig.upsert({
            where: { id: "main" },
            update: { orgName, orgNip, orgRegon, orgBankAccount, showTaxOnePointFive, enableDonations, showBankTransferDetails, taxKrs, taxGoal },
            create: { id: "main", orgName, orgNip, orgRegon, orgBankAccount, showTaxOnePointFive, enableDonations, showBankTransferDetails, taxKrs, taxGoal },
        });

        revalidatePath("/");
        revalidatePath("/admin/wyglad");
        return { success: true, message: "Dane firmowe zaktualizowane." };
    } catch (error) {
        console.error("Failed to update company data:", error);
        return { success: false, message: error instanceof Error ? error.message : "Wystąpił błąd." };
    }
}

export async function updateSocialMedia(prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!checkPermission(session)) return { success: false, message: "Brak uprawnień." };

    const facebookUrl = formData.get("facebookUrl") as string;
    const instagramUrl = formData.get("instagramUrl") as string;
    const tiktokUrl = formData.get("tiktokUrl") as string;
    const discordUrl = formData.get("discordUrl") as string;

    try {
        await prisma.siteConfig.upsert({
            where: { id: "main" },
            update: { facebookUrl, instagramUrl, tiktokUrl, discordUrl },
            create: { id: "main", facebookUrl, instagramUrl, tiktokUrl, discordUrl },
        });

        revalidatePath("/");
        revalidatePath("/admin/wyglad");
        return { success: true, message: "Media społecznościowe zaktualizowane." };
    } catch (error) {
        console.error("Failed to update social media:", error);
        return { success: false, message: error instanceof Error ? error.message : "Wystąpił błąd." };
    }
}

export async function updateContactData(prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!checkPermission(session)) return { success: false, message: "Brak uprawnień." };

    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const orgAddress = formData.get("orgAddress") as string;
    const contactMapUrl = formData.get("contactMapUrl") as string;
    const contactMapPin = formData.get("contactMapPin") as string;

    try {
        await prisma.siteConfig.upsert({
            where: { id: "main" },
            update: { email, phone, orgAddress, contactMapUrl, contactMapPin },
            create: { id: "main", email, phone, orgAddress, contactMapUrl, contactMapPin },
        });

        revalidatePath("/");
        revalidatePath("/admin/wyglad");
        return { success: true, message: "Dane kontaktowe zaktualizowane." };
    } catch (error) {
        console.error("Failed to update contact data:", error);
        return { success: false, message: error instanceof Error ? error.message : "Wystąpił błąd." };
    }
}

export async function updateHomepageSettings(prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!checkPermission(session)) return { success: false, message: "Brak uprawnień." };

    const showHero = formData.get("showHero") === "on";
    const showNews = formData.get("showNews") === "on";
    const showProjects = formData.get("showProjects") === "on";
    const showPartners = formData.get("showPartners") === "on";
    const showEvents = formData.get("showEvents") === "on";
    const showStats = formData.get("showStats") === "on";
    const showUpcomingEvents = formData.get("showUpcomingEvents") === "on";
    const showActionCenter = formData.get("showActionCenter") === "on";
    const homepageOrder = formData.get("homepageOrder") as string;

    try {
        await prisma.siteConfig.upsert({
            where: { id: "main" },
            update: { showHero, showNews, showProjects, showPartners, showEvents, showStats, showUpcomingEvents, showActionCenter, homepageOrder },
            create: { id: "main", showHero, showNews, showProjects, showPartners, showEvents, showStats, showUpcomingEvents, showActionCenter, homepageOrder },
        });

        revalidatePath("/");
        revalidatePath("/admin/wyglad");
        return { success: true, message: "Ustawienia strony głównej zaktualizowane." };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Błąd aktualizacji ustawień." };
    }
}

export async function updateSupportPageOrder(prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!checkPermission(session)) return { success: false, message: "Brak uprawnień." };

    const supportPageOrder = formData.get("supportPageOrder") as string;

    try {
        await prisma.siteConfig.upsert({
            where: { id: "main" },
            update: { supportPageOrder },
            create: { id: "main", supportPageOrder },
        });

        revalidatePath("/");
        revalidatePath("/wesprzyj-nas");
        revalidatePath("/admin/wyglad");
        return { success: true, message: "Układ strony Wesprzyj Nas zaktualizowany." };
    } catch (error) {
        console.error("Failed to update support page order:", error);
        return { success: false, message: "Błąd aktualizacji układu." };
    }
}

export async function updateHeroConfig(prevState: any, formData: FormData) {
    try {
        const session = await getServerSession(authOptions);
        if (!checkPermission(session)) return { success: false, message: "Brak uprawnień." };

        const enableHeroSlider = formData.get("enableHeroSlider") === "on";
        const staticHeroTitle = formData.get("staticHeroTitle") as string;
        const staticHeroSubtitle = formData.get("staticHeroSubtitle") as string;
        const staticHeroImage = formData.get("staticHeroImage") as string;
        const staticHeroAlignment = (formData.get("staticHeroAlignment") as string) || "center";
        const staticHeroAuthor = formData.get("staticHeroAuthor") as string;

        await prisma.siteConfig.upsert({
            where: { id: "main" },
            update: { enableHeroSlider, staticHeroTitle, staticHeroSubtitle, staticHeroImage, staticHeroAlignment, staticHeroAuthor },
            create: { id: "main", enableHeroSlider, staticHeroTitle, staticHeroSubtitle, staticHeroImage, staticHeroAlignment, staticHeroAuthor },
        });

        revalidatePath("/");
        revalidatePath("/admin/wyglad");
        return { success: true, message: "Konfiguracja banera zaktualizowana." };
    } catch (error) {
        console.error("Failed to update hero config:", error);
        return { success: false, message: error instanceof Error ? error.message : "Błąd aktualizacji banera." };
    }
}

export async function updateBranding(prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!checkPermission(session)) return { success: false, message: "Brak uprawnień." };

    const siteName = (formData.get("siteName") as string) || null;
    const logoUrl = (formData.get("logoUrl") as string) || null;

    try {
        await prisma.siteConfig.upsert({
            where: { id: "main" },
            update: { siteName, logoUrl },
            create: { id: "main", siteName, logoUrl },
        });

        revalidatePath("/");
        revalidatePath("/admin/wyglad");
        return { success: true, message: "Branding zaktualizowany." };
    } catch (error) {
        console.error("Failed to update branding:", error);
        return { success: false, message: "Błąd aktualizacji brandingu." };
    }
}

export async function updateSeoConfig(prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!checkPermission(session)) return { success: false, message: "Brak uprawnień." };

    const seoTitle = (formData.get("seoTitle") as string) || null;
    const seoDescription = (formData.get("seoDescription") as string) || null;
    const seoKeywords = (formData.get("seoKeywords") as string) || null;
    const seoAuthor = (formData.get("seoAuthor") as string) || null;
    const seoRobots = (formData.get("seoRobots") as string) || null;
    let faviconUrl = (formData.get("faviconUrl") as string) || null;
    const ogImageUrl = (formData.get("ogImageUrl") as string) || null;
    const accessibilityInfo = (formData.get("accessibilityInfo") as string) || null;
    const googleCalendarId = (formData.get("googleCalendarId") as string) || null;

    try {
        // 1. Detect if new icon uploaded (starts with /uploads/)
        if (faviconUrl && faviconUrl.startsWith("/uploads/")) {
            try {
                const publicDir = join(process.cwd(), "public");
                // Remove leading slash for path joining
                const relativePath = faviconUrl.startsWith("/") ? faviconUrl.slice(1) : faviconUrl;

                // Construct source path (public/uploads/...)
                const sourcePath = join(process.cwd(), "public", relativePath.replace("public/", ""));
                const destPath = join(publicDir, "favicon.ico");

                // 2. Convert to ICO (size 32x32) using Sharp
                try {
                    // Browsers support PNG in .ico extension often, but ideally real ICO.
                    // Sharp might need 'libvips' with ico support.
                    // Safe bet: resize to 32x32 PNG and save with .ico extension (common web trick)
                    await sharp(sourcePath)
                        .resize(32, 32)
                        .toFile(destPath);
                } catch (sharpError) {
                    console.error("Favicon conversion failed, trying simple copy:", sharpError);
                    // Fallback: simple copy
                    await copyFile(sourcePath, destPath);
                }

                // 3. Verify existence
                await stat(destPath);

                // 4. Force DB value to /favicon.ico
                faviconUrl = "/favicon.ico";

            } catch (err) {
                console.error("Failed to process favicon:", err);
                return { success: false, message: "Błąd podczas przetwarzania ikony (konwersja/kopiowanie nie powiodło się)." };
            }
        }

        await prisma.siteConfig.upsert({
            where: { id: "main" },
            update: { seoTitle, seoDescription, seoKeywords, seoAuthor, seoRobots, faviconUrl, ogImageUrl, accessibilityInfo, googleCalendarId },
            create: { id: "main", seoTitle, seoDescription, seoKeywords, seoAuthor, seoRobots, faviconUrl, ogImageUrl, accessibilityInfo, googleCalendarId },
        });

        revalidatePath("/");
        revalidatePath("/admin/wyglad");
        revalidatePath("/deklaracja-dostepnosci");
        return { success: true, message: "SEO i Favicon zaktualizowane pomyślnie." };
    } catch (error) {
        return { success: false, message: "Błąd zapisu w bazie danych." };
    }
}

export async function updateNavigation(prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!checkPermission(session)) return { success: false, message: "Brak uprawnień." };

    const aboutUsSublinks = formData.get("aboutUsSublinks") as string;

    try {
        await prisma.siteConfig.upsert({
            where: { id: "main" },
            update: { aboutUsSublinks },
            create: { id: "main", aboutUsSublinks },
        });

        revalidatePath("/");
        revalidatePath("/admin/wyglad");
        return { success: true, message: "Menu nawigacji zaktualizowane." };
    } catch (error) {
        console.error("Failed to update navigation:", error);
        return { success: false, message: "Błąd aktualizacji nawigacji." };
    }
}


export async function updateEmailConfig(prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!checkPermission(session)) return { success: false, message: "Brak uprawnień." };
    // This function had 'void' return in catch, inconsistent with others, but let's keep it robust.

    const emailProvider = formData.get("emailProvider") as string;
    const resendApiKey = formData.get("resendApiKey") as string;

    // SMTP Fields
    const smtpHost = formData.get("smtpHost") as string;
    const smtpPort = parseInt(formData.get("smtpPort") as string) || 587;
    const smtpUser = formData.get("smtpUser") as string;
    const smtpPassword = formData.get("smtpPassword") as string;

    const emailFromContact = formData.get("emailFromContact") as string;
    const emailFromApplications = formData.get("emailFromApplications") as string;
    const emailFromSupport = formData.get("emailFromSupport") as string;
    const emailFromNewsletter = formData.get("emailFromNewsletter") as string;

    const emailForApplications = formData.get("emailForApplications") as string;
    const emailForContact = formData.get("emailForContact") as string;

    try {
        await prisma.siteConfig.upsert({
            where: { id: "main" },
            update: {
                emailProvider,
                resendApiKey,
                smtpHost, smtpPort, smtpUser, smtpPassword,
                emailFromContact,
                emailFromApplications,
                emailFromSupport,
                emailFromNewsletter,
                emailForApplications,
                emailForContact
            },
            create: {
                id: "main",
                emailProvider,
                resendApiKey,
                smtpHost, smtpPort, smtpUser, smtpPassword,
                emailFromContact,
                emailFromApplications,
                emailFromSupport,
                emailFromNewsletter,
                emailForApplications,
                emailForContact
            },
        });

        revalidatePath("/");
        revalidatePath("/admin/wyglad");
        return { success: true, message: "Konfiguracja email zaktualizowana." };
    } catch (error) {
        console.error("Failed to update email config:", error);
        return { success: false, message: "Błąd aktualizacji email." };
    }
}

const UpdateCodeInjectionSchema = z.object({
    recaptchaSiteKey: z.string().optional().nullable(),
    recaptchaSecretKey: z.string().optional().nullable(),
    recaptchaVersion: z.enum(["v2", "v3", "enterprise"]).optional().nullable(),
    recaptchaProjectId: z.string().optional().nullable(),
    googleAnalyticsId: z.string().optional().nullable(),
    // Discord Integration
    discordWebhookContactUrl: z.string().url().optional().nullable().or(z.literal("")),
    discordWebhookApplicationUrl: z.string().url().optional().nullable().or(z.literal("")),
    // Przelewy24 Integration
    p24MerchantId: z.string().optional().nullable(),
    p24PosId: z.string().optional().nullable(),
    p24ApiKey: z.string().optional().nullable(),
    p24Crc: z.string().optional().nullable(),
    p24IsSandbox: z.boolean().optional(),
    enableDonations: z.boolean().optional(),
});

export async function updateCodeInjection(prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!checkPermission(session)) return { success: false, message: "Brak uprawnień." };

    const getVal = (key: string) => {
        const val = formData.get(key) as string;
        return val && val.trim() !== "" ? val.trim() : null;
    };

    const rawData = {
        recaptchaSiteKey: getVal("recaptchaSiteKey"),
        recaptchaSecretKey: getVal("recaptchaSecretKey"),
        recaptchaVersion: formData.get("recaptchaVersion") as string || "v2",
        recaptchaProjectId: getVal("recaptchaProjectId"),
        googleAnalyticsId: getVal("googleAnalyticsId"),
        discordWebhookContactUrl: getVal("discordWebhookContactUrl"),
        discordWebhookApplicationUrl: getVal("discordWebhookApplicationUrl"),
        p24MerchantId: getVal("p24MerchantId"),
        p24PosId: getVal("p24PosId"),
        p24ApiKey: getVal("p24ApiKey"),
        p24Crc: getVal("p24Crc"),
        p24IsSandbox: formData.get("p24IsSandbox") === "on",
        enableDonations: formData.get("enableDonations") === "on",
    };

    const parsed = UpdateCodeInjectionSchema.safeParse(rawData);

    if (!parsed.success) {
        console.error("Validation error for updateCodeInjection:", parsed.error);
        return { success: false, message: "Błąd walidacji danych. Sprawdź poprawność URL." };
    }

    const data = parsed.data;

    const updateData: any = {
        recaptchaSiteKey: data.recaptchaSiteKey,
        recaptchaSecretKey: data.recaptchaSecretKey,
        recaptchaVersion: data.recaptchaVersion,
        recaptchaProjectId: data.recaptchaProjectId,
        googleAnalyticsId: data.googleAnalyticsId,
        discordWebhookContactUrl: data.discordWebhookContactUrl,
        discordWebhookApplicationUrl: data.discordWebhookApplicationUrl,
        p24MerchantId: data.p24MerchantId,
        p24PosId: data.p24PosId,
        p24ApiKey: data.p24ApiKey,
        p24Crc: data.p24Crc,
        p24IsSandbox: data.p24IsSandbox,
        enableDonations: data.enableDonations,
    };

    try {
        await prisma.siteConfig.upsert({
            where: { id: "main" },
            update: updateData,
            create: { id: "main", ...updateData },
        });

        revalidatePath("/", "layout");
        revalidatePath("/admin/wyglad");
        return { success: true, message: "Konfiguracja integracji zaktualizowana." };
    } catch (error) {
        console.error("Failed to update integration config:", error);
        return { success: false, message: error instanceof Error ? error.message : "Błąd aktualizacji konfiguracji." };
    }
}

export async function updatePrivacyPolicy(prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!checkPermission(session)) return { success: false, message: "Brak uprawnień." };

    const privacyPolicyContent = (formData.get("privacyPolicyContent") as string) || null;

    try {
        await prisma.siteConfig.upsert({
            where: { id: "main" },
            update: { privacyPolicyContent },
            create: { id: "main", privacyPolicyContent },
        });

        revalidatePath("/");
        revalidatePath("/admin/wyglad");
        revalidatePath("/polityka-prywatnosci");
        return { success: true, message: "Polityka prywatności zaktualizowana pomyślnie." };
    } catch (error) {
        console.error("Failed to update privacy policy:", error);
        return { success: false, message: error instanceof Error ? error.message : "Błąd aktualizacji polityki prywatności." };
    }
}

export async function updateCookiePolicy(prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!checkPermission(session)) return { success: false, message: "Brak uprawnień." };

    const cookiePolicyContent = (formData.get("cookiePolicyContent") as string) || null;

    try {
        await prisma.siteConfig.upsert({
            where: { id: "main" },
            update: { cookiePolicyContent },
            create: { id: "main", cookiePolicyContent },
        });

        revalidatePath("/");
        revalidatePath("/admin/wyglad");
        revalidatePath("/polityka-cookies");
        return { success: true, message: "Polityka cookies zaktualizowana pomyślnie." };
    } catch (error) {
        console.error("Failed to update cookie policy:", error);
        return { success: false, message: error instanceof Error ? error.message : "Błąd aktualizacji polityki cookies." };
    }
}

export async function updateMaintenanceMode(prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!checkPermission(session)) return { success: false, message: "Brak uprawnień." };

    const isMaintenanceMode = formData.get("isMaintenanceMode") === "on";
    const maintenanceMessage = (formData.get("maintenanceMessage") as string) || null;

    try {
        await prisma.siteConfig.upsert({
            where: { id: "main" },
            update: { isMaintenanceMode, maintenanceMessage },
            create: { id: "main", isMaintenanceMode, maintenanceMessage },
        });

        revalidatePath("/", "layout");
        revalidatePath("/admin/wyglad");
        return { success: true, message: `Tryb serwisowy ${isMaintenanceMode ? "włączony" : "wyłączony"}.` };
    } catch (error) {
        console.error("Failed to update maintenance mode:", error);
        return { success: false, message: "Błąd aktualizacji trybu serwisowego." };
    }
}

export async function updateAccessibilityDeclaration(prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!checkPermission(session)) return { success: false, message: "Brak uprawnień." };

    const accessibilityInfo = formData.get("accessibilityInfo") as string;
    const accessibilityDeclarationContent = formData.get("accessibilityDeclarationContent") as string;

    try {
        await prisma.siteConfig.upsert({
            where: { id: "main" },
            update: { accessibilityInfo, accessibilityDeclarationContent },
            create: { id: "main", accessibilityInfo, accessibilityDeclarationContent },
        });

        revalidatePath("/deklaracja-dostepnosci");
        revalidatePath("/admin/wyglad");
        return { success: true, message: "Deklaracja dostępności zaktualizowana." };
    } catch (error) {
        console.error("Failed to update accessibility declaration:", error);
        return { success: false, message: "Błąd zapisu w bazie danych." };
    }
}

export async function updateNewsletterSettings(prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!checkPermission(session)) return { success: false, message: "Brak uprawnień." };

    const enableNewsletter = formData.get("enableNewsletter") === "on";
    const newsletterWelcomeSubject = (formData.get("newsletterWelcomeSubject") as string) || null;
    const newsletterWelcomeContent = (formData.get("newsletterWelcomeContent") as string) || null;
    const resendApiKey = (formData.get("resendApiKey") as string) || null;

    // Drip Campaign
    const enableDripCampaign = formData.get("enableDripCampaign") === "on";
    const dripDay2Delay = parseInt((formData.get("dripDay2Delay") as string) || "2");
    const dripDay2Subject = (formData.get("dripDay2Subject") as string) || null;
    const dripDay2Content = (formData.get("dripDay2Content") as string) || null;

    const dripDay5Delay = parseInt((formData.get("dripDay5Delay") as string) || "5");
    const dripDay5Subject = (formData.get("dripDay5Subject") as string) || null;
    const dripDay5Content = (formData.get("dripDay5Content") as string) || null;

    try {
        await prisma.siteConfig.upsert({
            where: { id: "main" },
            update: {
                enableNewsletter,
                newsletterWelcomeSubject,
                newsletterWelcomeContent,
                resendApiKey,
                enableDripCampaign,
                dripDay2Delay,
                dripDay2Subject,
                dripDay2Content,
                dripDay5Delay,
                dripDay5Subject,
                dripDay5Content
            },
            create: {
                id: "main",
                enableNewsletter,
                newsletterWelcomeSubject,
                newsletterWelcomeContent,
                resendApiKey,
                enableDripCampaign,
                dripDay2Delay,
                dripDay2Subject,
                dripDay2Content,
                dripDay5Delay,
                dripDay5Subject,
                dripDay5Content
            },
        });

        revalidatePath("/");
        revalidatePath("/admin/wyglad");
        return { success: true, message: "Ustawienia newslettera i kampanii Drip zaktualizowane." };
    } catch (error) {
        console.error("Failed to update newsletter settings:", error);
        return { success: false, message: "Błąd aktualizacji ustawień newslettera." };
    }
}

// Deprecated: updateIntegrationsConfig moved to updateCodeInjection
