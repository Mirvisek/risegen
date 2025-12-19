"use server";

import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

export async function requestPasswordReset(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;

    if (!email) {
        return { success: false, message: "Proszę podać adres email." };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // Always return success to prevent enumeration
        if (!user) {
            return {
                success: true,
                message: "Jeśli konto istnieje, instrukcje resetowania hasła zostały wysłane."
            };
        }

        // Generate Token
        const token = uuidv4();
        const expiry = new Date(Date.now() + 3600000); // 1 hour

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken: token,
                resetTokenExpiry: expiry,
            },
        });

        const resetLink = `${process.env.NEXTAUTH_URL || "https://risegen.pl"}/auth/nowe-haslo?token=${token}`;

        // Get Email Config
        const config = await prisma.siteConfig.findFirst();

        if (!config?.smtpHost || !config?.smtpUser || !config?.smtpPassword) {
            console.error("SMTP Configuration missing");
            return {
                success: false,
                message: "Błąd konfiguracji serwera pocztowego. Skontaktuj się z administratorem."
            };
        }

        const transporter = nodemailer.createTransport({
            host: config.smtpHost,
            port: config.smtpPort || 587,
            secure: config.smtpPort === 465,
            auth: {
                user: config.smtpUser,
                pass: config.smtpPassword,
            },
        });

        await transporter.sendMail({
            from: `"${config.siteName || "RiseGen"}" <${config.smtpFrom || config.smtpUser}>`,
            to: email,
            subject: "Resetowanie hasła - Panel Admina",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Resetowanie hasła</h2>
                    <p>Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta administratora.</p>
                    <p>Kliknij w poniższy przycisk, aby ustawić nowe hasło (link ważny przez 1 godzinę):</p>
                    <div style="margin: 20px 0;">
                        <a href="${resetLink}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Resetuj hasło</a>
                    </div>
                    <p>Lub skopiuj ten link do przeglądarki:</p>
                    <p><a href="${resetLink}">${resetLink}</a></p>
                    <p style="color: #666; font-size: 12px; margin-top: 30px;">Jeśli to nie Ty prosiłeś o reset hasła, zignoruj tę wiadomość.</p>
                </div>
            `,
        });

        return {
            success: true,
            message: "Jeśli konto istnieje, instrukcje resetowania hasła zostały wysłane."
        };

    } catch (error) {
        console.error("Password reset error:", error);
        return {
            success: false,
            message: "Wystąpił błąd podczas przetwarzania żądania."
        };
    }
}
