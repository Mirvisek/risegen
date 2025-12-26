"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { verifyCaptcha } from "@/lib/recaptcha";

export async function sendContactMessage(prevState: any, formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const honeypot = formData.get("website_url") as string; // Honeypot field

    if (honeypot) {
        // Spam detected
        return { success: false, message: "Błąd wysyłania wiadomości." };
    }

    const captchaToken = formData.get("captchaToken") as string;
    const isCaptchaValid = await verifyCaptcha(captchaToken);

    if (!isCaptchaValid) {
        return { success: false, message: "Potwierdź, że nie jesteś robotem (CAPTCHA)." };
    }

    if (!name || !email || !message) {
        return { success: false, message: "Wypełnij wymagane pola." };
    }

    try {
        // Calculate next number
        const lastMsg = await prisma.contactMessage.findFirst({
            orderBy: { number: 'desc' },
            select: { number: true }
        });
        const nextNumber = (lastMsg?.number || 0) + 1;

        await prisma.contactMessage.create({
            data: {
                name,
                email,
                subject,
                message,
                number: nextNumber
            },
        });

        // Send Discord Notification
        try {
            const { sendDiscordNotification, DISCORD_COLORS } = await import("@/lib/discord");
            await sendDiscordNotification({
                title: `📩 Nowa wiadomość: ${subject || "Brak tematu"}`,
                description: message.length > 200 ? message.substring(0, 200) + "..." : message,
                color: DISCORD_COLORS.BLUE,
                fields: [
                    { name: "Nadawca", value: `${name} (${email})`, inline: true },
                    { name: "ID", value: `#${nextNumber}`, inline: true }
                ],
                url: `${process.env.NEXTAUTH_URL}/admin/kontakt`
            });
        } catch (e) { console.error("Discord error:", e); }

        // Send email via mailSender (Resend/SMTP)
        const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });
        const toEmail = config?.emailForContact || config?.email || "kontakt@risegen.pl";

        const { sendEmail } = await import("@/lib/mailSender");
        await sendEmail({
            to: toEmail,
            subject: `[Formularz Kontaktowy] ${subject || "Nowa wiadomość"} (#${nextNumber})`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                    <h2 style="color: #4F46E5;">Nowa wiadomość z formularza kontaktowego</h2>
                    <p><strong>Numer:</strong> #${nextNumber}</p>
                    <p><strong>Nadawca:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
                    <p><strong>Temat:</strong> ${subject}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
                        <p style="margin-top: 0; white-space: pre-wrap;">${message}</p>
                    </div>
                </div>
            `,
            fromConfigKey: "emailFromContact",
            replyTo: email
        });

        return { success: true, message: "Wiadomość została wysłana! Dziękujemy za kontakt." };
    } catch (error) {
        console.error("Contact Error:", error);
        return { success: false, message: "Wystąpił błąd podczas wysyłania wiadomości." };
    }
}
