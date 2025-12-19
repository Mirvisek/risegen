import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.roles.includes("ADMIN")) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const body = await req.json();
        const { userId, newPassword } = body;

        if (!userId || !newPassword) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                mustChangePassword: true, // Force change on next login
            },
        });

        // If updating admin@risegen.pl, send email with new password
        if (updatedUser.email === "admin@risegen.pl") {
            try {
                // Get Email Config
                const config = await prisma.siteConfig.findFirst();

                if (config?.smtpHost && config?.smtpUser && config?.smtpPassword) {
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
                        to: "admin@risegen.pl, michaldygdon@icloud.com",
                        subject: "Nowe hasło do konta admin@risegen.pl",
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                <h2>Twoje hasło zostało zmienione</h2>
                                <p>Nowe hasło do konta <strong>admin@risegen.pl</strong> zostało ustawione przez administratora.</p>
                                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                    <strong>Nowe hasło:</strong> <span style="font-family: monospace; font-size: 1.2em;">${newPassword}</span>
                                </div>
                                <p>Zalecamy zmianę hasła po zalogowaniu.</p>
                            </div>
                        `,
                    });
                    console.log("Password sent to admin@risegen.pl and michaldygdon@icloud.com");
                } else {
                    console.error("SMTP Configuration missing, user updated but email not sent.");
                }
            } catch (emailError) {
                console.error("Failed to send email with new password:", emailError);
                // We don't fail the request because the password WAS updated.
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Reset password error:", error);
        return new NextResponse("Error", { status: 500 });
    }
}
