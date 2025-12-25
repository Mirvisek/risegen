import { prisma } from "@/lib/prisma";

export async function verifyCaptcha(token: string | null, action: string = "contact") {
    if (!token) {
        return false;
    }

    // Fetch config from DB
    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

    // For Enterprise, we need:
    // 1. API Key (we'll assume RECAPTCHA_SECRET_KEY stores the Google Cloud API Key)
    // 2. Project ID (provided by user: risegen-1765937398889)
    // 3. Site Key (we'll use the one from frontend: 6Lc6NDYsAAAAAIhVMaBKLwuAUByuSjR2ZqYUdF7Y)

    const apiKey = config?.recaptchaSecretKey || process.env.RECAPTCHA_SECRET_KEY;

    // We prefer the site key from config if it matches, otherwise fallback to the known hardcoded one
    // to ensure backend verifies against the same key frontend used.
    const siteKey = config?.recaptchaSiteKey || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6Lc6NDYsAAAAAIhVMaBKLwuAUByuSjR2ZqYUdF7Y";
    const projectId = "risegen-1765937398889";

    if (!apiKey) {
        console.warn("reCAPTCHA Enterprise API Key (Secret Key) is missing. Bypassing verification.");
        return true;
    }

    try {
        const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${apiKey}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                event: {
                    token: token,
                    siteKey: siteKey,
                    expectedAction: action, // Must match frontend action
                }
            }),
        });

        const data = await response.json();

        // Enterprise response validation
        // Check if token is valid
        if (!data.tokenProperties?.valid) {
            console.error("reCAPTCHA Enterprise token invalid:", data.tokenProperties?.invalidReason);
            return false;
        }

        // Check if action matches
        if (data.tokenProperties.action !== action) {
            console.error(`reCAPTCHA Enterprise action mismatch: expected ${action}, got ${data.tokenProperties.action}`);
            return false;
        }

        // Optional: Check score if available (0.0 to 1.0)
        // If it's a score-based key, we should check threshold.
        // We'll set a lenient threshold of 0.5 for now, or just log it.
        const score = data.riskAnalysis?.score;
        if (typeof score === 'number') {
            // console.log("reCAPTCHA Score:", score);
            if (score < 0.5) {
                console.warn("reCAPTCHA Enterprise Score too low:", score);
                // return false; // Uncomment to enforce strict scoring
            }
        }

        return true;
    } catch (error) {
        console.error("Recaptcha verification failed:", error);
        // On API error, we might want to allow it to not block users if Google is down, 
        // but explicit failure is safer for security.
        return false;
    }
}
