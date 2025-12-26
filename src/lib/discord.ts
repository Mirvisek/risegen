import { prisma } from "@/lib/prisma";

interface DiscordNotification {
    title: string;
    description: string;
    color?: number; // Decimal color
    fields?: { name: string; value: string; inline?: boolean }[];
    url?: string;
}

// Colors
export const DISCORD_COLORS = {
    BLUE: 5793266,
    GREEN: 5763719,
    RED: 15548997,
    GOLD: 16776960,
    PURPLE: 10181046
};

export async function sendDiscordNotification(notification: DiscordNotification, type: "CONTACT" | "APPLICATION" = "CONTACT") {
    try {
        const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });

        // Select webhook based on type
        const webhookUrl = type === "APPLICATION"
            ? config?.discordWebhookApplicationUrl
            : config?.discordWebhookContactUrl;

        if (!webhookUrl) return; // Silent return if not configured

        const embed = {
            title: notification.title,
            description: notification.description,
            color: notification.color || DISCORD_COLORS.BLUE,
            fields: notification.fields,
            url: notification.url,
            footer: {
                text: "RiseGen System"
            },
            timestamp: new Date().toISOString()
        };

        await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                embeds: [embed]
            })
        });

    } catch (error) {
        console.error("Failed to send Discord notification:", error);
    }
}
