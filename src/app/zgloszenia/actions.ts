"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { verifyCaptcha } from "@/lib/recaptcha";

const ApplicationSchema = z.object({
    firstName: z.string().min(2, "Imię musi mieć co najmniej 2 znaki"),
    lastName: z.string().min(2, "Nazwisko musi mieć co najmniej 2 znaki"),
    email: z.string().email("Nieprawidłowy adres email"),
    phone: z.string().regex(/^\d{9}$/, "Numer telefonu musi składać się z dokładnie 9 cyfr"),
    instagram: z.string().optional(),
    description: z.string().min(200, "Opis musi mieć co najmniej 200 znaków."),
    birthDate: z.coerce.date().refine((date) => !isNaN(date.getTime()), { message: "Nieprawidłowa data urodzenia" }),
    type: z.enum(["MEMBER", "VOLUNTEER"]),
});

export async function submitApplication(prevState: any, formData: FormData) {
    const rawData = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        instagram: formData.get("instagram") as string,
        description: formData.get("description") as string,
        birthDate: formData.get("birthDate") as string,
        type: formData.get("type") as string,
    };

    const captchaToken = formData.get("captchaToken") as string;
    const isCaptchaValid = await verifyCaptcha(captchaToken);

    if (!isCaptchaValid) {
        return {
            message: "Potwierdź, że nie jesteś robotem (CAPTCHA).",
            fields: rawData,
        };
    }

    const validatedFields = ApplicationSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Proszę poprawić błędy w formularzu.",
            fields: rawData, // Return data to preserve input
        };
    }

    try {
        // Calculate next number
        const lastApp = await prisma.application.findFirst({
            orderBy: { number: 'desc' },
            select: { number: true }
        });
        const nextNumber = (lastApp?.number || 0) + 1;

        await prisma.application.create({
            data: {
                ...validatedFields.data,
                number: nextNumber
            },
        });

        // Send email notification
        try {
            const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });
            if (config?.smtpHost && config?.smtpUser && config?.smtpPassword) {
                const nodemailer = (await import("nodemailer")).default;
                const transporter = nodemailer.createTransport({
                    host: config.smtpHost,
                    port: config.smtpPort || 587,
                    secure: config.smtpPort === 465,
                    auth: { user: config.smtpUser, pass: config.smtpPassword },
                });

                const typeLabel = rawData.type === 'MEMBER' ? 'Członek Stowarzyszenia' : 'Wolontariusz';

                await transporter.sendMail({
                    from: `"Rekruter RiseGen" <${config.smtpFrom || config.smtpUser}>`,
                    to: config.emailForApplications || config.email || "rekrutacja@risegen.pl",
                    subject: `[Nowe Zgłoszenie] ${rawData.firstName} ${rawData.lastName} - ${typeLabel} (#${nextNumber})`,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                            <h2 style="color: #4F46E5;">Nowe zgłoszenie rekrutacyjne</h2>
                            <p><strong>Numer:</strong> #${nextNumber}</p>
                            <p><strong>Kandydat:</strong> ${rawData.firstName} ${rawData.lastName}</p>
                            <p><strong>Typ:</strong> ${typeLabel}</p>
                            <p><strong>Email:</strong> <a href="mailto:${rawData.email}">${rawData.email}</a></p>
                            <p><strong>Telefon:</strong> ${rawData.phone}</p>
                            <p><strong>Data urodzenia:</strong> ${rawData.birthDate}</p>
                            <p><strong>Instagram:</strong> ${rawData.instagram || '-'}</p>
                            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                            <h3>Opis / Motywacja:</h3>
                            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
                                <p style="margin-top: 0; white-space: pre-wrap;">${rawData.description}</p>
                            </div>
                            <p style="color: #888; font-size: 12px; margin-top: 20px;"><a href="${process.env.NEXTAUTH_URL}/admin/zgloszenia">Przejdź do panelu admina</a></p>
                        </div>
                    `,
                });
            }
        } catch (e) {
            console.error("Failed to send application email:", e);
        }
        return { success: true, message: "Zgłoszenie zostało wysłane!" };
    } catch (error) {
        console.error("Application error:", error);
        return { message: "Wystąpił błąd podczas wysyłania zgłoszenia." };
    }
}
