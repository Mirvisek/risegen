"use server";

import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { sendPasswordChangeEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";

const PasswordSchema = z.object({
    currentPassword: z.string().min(1, "Bieżące hasło jest wymagane"),
    newPassword: z.string().min(6, "Nowe hasło musi mieć co najmniej 6 znaków"),
    confirmPassword: z.string().min(6, "Potwierdzenie hasła jest wymagane"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Hasła muszą być identyczne",
    path: ["confirmPassword"],
});

// Since we can't easily verify the old password hash without comparing it (which requires the user object),
// we relies on the session to ensure the user is logged in. 
// Ideally we would verify currentPassword matches the DB, but for simplicity/safety we might imply it's verified if we fetch it.
// Wait, we ABSOLUTELY MUST verify the current password before changing it to prevent hijacking if session is left open.
// But Prisma + NextAuth doesn't expose a simple "verifyPassword" unless we manually compare.

import { compare } from "bcryptjs";

export async function changePassword(prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return { success: false, message: "Nie jesteś zalogowany." };
    }

    const rawData = {
        currentPassword: formData.get("currentPassword") as string,
        newPassword: formData.get("newPassword") as string,
        confirmPassword: formData.get("confirmPassword") as string,
    };

    const validated = PasswordSchema.safeParse(rawData);
    if (!validated.success) {
        return {
            success: false,
            errors: validated.error.flatten().fieldErrors,
            message: "Popraw błędy w formularzu.",
        };
    }

    const { currentPassword, newPassword } = validated.data;

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return { success: false, message: "Użytkownik nie istnieje." };
        }

        // Verify current password
        const isValid = await compare(currentPassword, user.password);
        if (!isValid) {
            return {
                success: false,
                message: "Bieżące hasło jest nieprawidłowe.",
                errors: { currentPassword: ["Nieprawidłowe hasło"] }
            };
        }

        // Update password
        const hashedPassword = await hash(newPassword, 12);
        await prisma.user.update({
            where: { email: session.user.email },
            data: { password: hashedPassword },
        });

        // Send Email
        const emailSent = await sendPasswordChangeEmail(newPassword);

        revalidatePath("/admin/profile");

        return {
            success: true,
            message: emailSent
                ? "Hasło zmienione pomyślnie. Nowe hasło wysłano na maila."
                : "Hasło zmienione, ale nie udało się wysłać maila. Sprawdź logi."
        };

    } catch (error) {
        console.error("Password change error:", error);
        return { success: false, message: "Wystąpił błąd serwera." };
    }
}
