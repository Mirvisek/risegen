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

        // Send email via Resend
        const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });
        const apiKey = process.env.RESEND_API_KEY || config?.resendApiKey;

        if (apiKey) {
            try {
                const resend = (await import("resend")).Resend;
                const client = new resend(apiKey);

                const fromName = "Kontakt RiseGen";
                const fromEmail = config?.emailFromContact || "kontakt@risegen.pl";
                // Ensure proper header format
                const fromHeader = fromEmail.includes("<") ? fromEmail : `"${fromName}" <${fromEmail}>`;

                const toEmail = config?.emailForContact || config?.email || "kontakt@risegen.pl"; // Odbiorca (Admin)

                await client.emails.send({
                    from: fromHeader,
                    to: toEmail,
                    replyTo: email, // Odpowiedz do użytkownika
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
                            <p style="color: #888; font-size: 12px; margin-top: 20px;">Wiadomość wysłana ze strony internetowej.</p>
                        </div>
                    `,
                });
            } catch (emailError) {
                console.error("Failed to send email notification:", emailError);
            }
        } else {
            console.warn("Missing Resend API Key - email not sent.");
        }

        return { success: true, message: "Wiadomość została wysłana! Dziękujemy za kontakt." };
    } catch (error) {
        console.error("Contact Error:", error);
        return { success: false, message: "Wystąpił błąd podczas wysyłania wiadomości." };
    }
}
