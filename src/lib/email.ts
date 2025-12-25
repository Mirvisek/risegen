import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export async function sendPasswordChangeEmail(newPassword: string) {
    // Try to get config from DB
    let apiKey = process.env.RESEND_API_KEY;
    let fromEmail = "pomoc@risegen.pl";
    const fromName = "RiseGen Admin";

    try {
        const config = await prisma.siteConfig.findFirst();
        if (config) {
            apiKey = process.env.RESEND_API_KEY || config.resendApiKey || undefined;
            fromEmail = config.emailFromSupport || "pomoc@risegen.pl";
        }
    } catch (e) {
        console.warn("Failed to fetch SiteConfig for email:", e);
    }

    if (!apiKey) {
        console.error("Missing Resend API Key (DB or ENV). Email not sent.");
        return false;
    }

    const resend = new Resend(apiKey);
    const fromHeader = fromEmail.includes("<") ? fromEmail : `"${fromName}" <${fromEmail}>`;

    // Recipients
    const toEmail = "michaldygdon@icloud.com, admin@risegen.pl"; // Hardcoded in original file

    try {
        await resend.emails.send({
            from: fromHeader,
            to: toEmail, // Resend handles comma-separated strings or arrays
            subject: "Zmiana hasła w panelu administratora",
            text: `Twoje hasło do panelu administratora zostało zmienione.\n\nNowe hasło: ${newPassword}\n\nJeśli to nie Ty dokonałeś zmiany, skontaktuj się z administratorem.`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>Hasło zostało zmienione</h2>
                    <p>Twoje hasło do panelu administratora RiseGen zostało pomyślnie zaktualizowane.</p>
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <strong>Nowe hasło:</strong> <code style="font-size: 1.2em; color: #d63384;">${newPassword}</code>
                    </div>
                    <p style="font-size: 0.9em; color: #666;">Jeśli to nie Ty dokonałeś zmiany, niezwłocznie skontaktuj się z administratorem.</p>
                </div>
            `,
        });
        console.log(`Email sent successfully to ${toEmail}`);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
}
