import { prisma } from "@/lib/prisma";
import type { SiteConfig } from "@prisma/client";

interface SendEmailParams {
    to: string | string[];
    subject: string;
    html: string;
    fromConfigKey: keyof Pick<SiteConfig, "emailFromContact" | "emailFromApplications" | "emailFromSupport" | "emailFromNewsletter">;
    replyTo?: string;
    text?: string;
}

export async function sendEmail({ to, subject, html, fromConfigKey, replyTo, text }: SendEmailParams): Promise<boolean> {
    try {
        const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });
        if (!config) {
            console.error("Missing SiteConfig");
            return false;
        }

        const provider = config.emailProvider || "smtp";
        const fromEmail = (config[fromConfigKey] as string) || "no-reply@risegen.pl";
        const fromName = config.siteName || "RiseGen";

        // Ensure "Name <email>" format if not present
        const fromHeader = fromEmail.includes("<") ? fromEmail : `"${fromName}" <${fromEmail}>`;

        // 1. RESEND
        if (provider === "resend") {
            const apiKey = process.env.RESEND_API_KEY || config.resendApiKey;
            if (!apiKey) {
                console.error("Missing Resend API Key");
                return false;
            }

            const { Resend } = await import("resend");
            const resend = new Resend(apiKey);

            await resend.emails.send({
                from: fromHeader,
                to: to,
                replyTo: replyTo,
                subject: subject,
                html: html,
                text: text
            });
            return true;
        }

        // 2. SMTP (Nodemailer)
        if (provider === "smtp") {
            // Check Env or DB
            const host = process.env.SMTP_HOST || config.smtpHost;
            const port = parseInt(process.env.SMTP_PORT || "") || config.smtpPort || 587;
            const user = process.env.SMTP_USER || config.smtpUser;
            const pass = process.env.SMTP_PASS || config.smtpPassword;

            if (!host || !user || !pass) {
                console.error("Missing SMTP Configuration");
                return false;
            }

            const nodemailer = (await import("nodemailer")).default;
            const transporter = nodemailer.createTransport({
                host,
                port,
                secure: port === 465, // true for 465, false for other ports
                auth: { user, pass },
            });

            await transporter.sendMail({
                from: fromHeader,
                to: Array.isArray(to) ? to.join(",") : to,
                replyTo: replyTo,
                subject: subject,
                html: html,
                text: text
            });
            return true;
        }

        return false;

    } catch (error) {
        console.error("Failed to send email:", error);
        return false;
    }
}
