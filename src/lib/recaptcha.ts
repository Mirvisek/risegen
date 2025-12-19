import { prisma } from "@/lib/prisma";

export async function verifyCaptcha(token: string | null) {
    if (!token) {
        return false;
    }

    // Fetch config from DB
    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

    // Prefer DB key, fallback to env var
    const secretKey = config?.recaptchaSecretKey || process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
        // If no secret key is configured, we might want to bypass (for dev) or fail secure.
        if (process.env.NODE_ENV === 'development') {
            console.warn("RECAPTCHA_SECRET_KEY not set in DB or ENV. Bypassing captcha verification.");
            return true;
        }
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
