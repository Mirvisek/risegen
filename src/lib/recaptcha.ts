import { prisma } from "@/lib/prisma";

export async function verifyCaptcha(token: string | null) {
    // Fetch config from DB
    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

    // Prefer DB key, fallback to env var
    const secretKey = config?.recaptchaSecretKey || process.env.RECAPTCHA_SECRET_KEY;
    const siteKey = config?.recaptchaSiteKey || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (!secretKey || !siteKey) {
        // If reCAPTCHA is not fully configured, bypass verification so the site remains functional.
        // The frontend will also hide the widget if siteKey is missing.
        console.warn("reCAPTCHA is not fully configured (missing siteKey or secretKey). Bypassing verification.");
        return true;
    }

    if (!token) {
        return false;
    }

    try {
        const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `secret=${secretKey}&response=${token}`,
        });

        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error("Recaptcha verification failed:", error);
        return false;
    }
}
