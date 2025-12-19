import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

export async function sendPasswordChangeEmail(newPassword: string) {
    let host = process.env.SMTP_HOST;
    let port = parseInt(process.env.SMTP_PORT || "587");
    let user = process.env.SMTP_USER;
    let pass = process.env.SMTP_PASS;
    let secure = process.env.SMTP_SECURE === "true";
    let fromEmail = process.env.SMTP_FROM || '"RiseGen Admin" <no-reply@risegen.pl>';

    // Try to get config from DB
    try {
        const config = await prisma.siteConfig.findFirst();
        if (config?.smtpHost) {
            host = config.smtpHost;
            port = config.smtpPort || 587;
            user = config.smtpUser || undefined;
            pass = config.smtpPassword || undefined;
            secure = config.smtpPort === 465;
            fromEmail = `"${config.siteName || "RiseGen"}" <${config.smtpFrom || config.smtpUser || "no-reply@risegen.pl"}>`;
        }
    } catch (e) {
        console.warn("Failed to fetch SiteConfig for email:", e);
    }

    // Recipients
    const toEmail = "michaldygdon@icloud.com, admin@risegen.pl";

    if (!host || !user || !pass) {
        console.error("Missing SMTP Configuration (DB or ENV). Email not sent.");
        return false;
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
    });

    const mailOptions = {
        from: fromEmail,
        to: toEmail,
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
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${toEmail}`);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
}
