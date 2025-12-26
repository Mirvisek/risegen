import { sendEmail } from "@/lib/mailSender";

export async function sendPasswordChangeEmail(newPassword: string) {
    const toEmail = "michaldygdon@icloud.com, admin@risegen.pl";

    return await sendEmail({
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
        fromConfigKey: "emailFromSupport"
    });
}
