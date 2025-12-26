import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

// Helper to capitalize first letter
function capitalizeName(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

export async function POST(req: Request) {
    try {
        const { name, email } = await req.json();

        if (!email || !name) {
            return NextResponse.json({ error: "Wymagane imię i email" }, { status: 400 });
        }

        // 1. Check if newsletter is enabled globally
        const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });
        if (!config?.enableNewsletter) {
            return NextResponse.json({ error: "Newsletter disabled" }, { status: 403 });
        }

        // 2. Check if user already exists
        const existing = await prisma.subscriber.findUnique({
            where: { email },
        });

        if (existing) {
            return NextResponse.json({ error: "Ten email jest już zapisany." }, { status: 409 });
        }

        const cleanName = capitalizeName(name.trim());

        // 3. Save to database
        const subscriber = await prisma.subscriber.create({
            data: {
                email,
                name: cleanName,
            },
        });

        // 4. Send Welcome Email via mailSender
        try {
            const { sendEmail } = await import("@/lib/mailSender");
            await sendEmail({
                to: email,
                subject: config.newsletterWelcomeSubject || `Witaj w RiseGen, ${cleanName}!`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #4f46e5;">Cześć ${cleanName}!</h1>
                        <p>Dziękujemy za dołączenie do newslettera Stowarzyszenia RiseGen.</p>
                        ${config.newsletterWelcomeContent ? `<p>${config.newsletterWelcomeContent}</p>` : `
                        <p>Od teraz będziesz otrzymywać powiadomienia o naszych najważniejszych wydarzeniach, sukcesach i nowych projektach.</p>
                        <p>Obiecujemy nie spamować – wysyłamy tylko to, co naprawdę ważne.</p>
                        `}
                        <br/>
                        <p style="color: #666; font-size: 14px;">– Zespół RiseGen</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #999;">
                            Otrzymujesz tę wiadomość, ponieważ zapisałeś się na stronie risegen.pl.
                        </p>
                    </div>
                `,
                fromConfigKey: "emailFromNewsletter"
            });
        } catch (emailError) {
            console.error("Failed to send welcome email:", emailError);
        }

        return NextResponse.json({ success: true, subscriber });

    } catch (error) {
        console.error("Newsletter error:", error);
        return NextResponse.json({ error: "Wystąpił błąd serwera" }, { status: 500 });
    }
}
