import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type ActionType = "CREATE" | "UPDATE" | "DELETE";
export type EntityType = "Project" | "User" | "News" | "Application" | "Partner" | "TeamMember" | "Document" | "HomeHeroSlide" | "Event" | "FAQ" | "Stat" | "SiteConfig";

interface LogActionParams {
    action: ActionType;
    entityType: EntityType;
    entityId: string;
    details: Record<string, any>;
}

export async function logAction(params: LogActionParams) {
    try {
        const session = await getServerSession(authOptions);
        const userEmail = session?.user?.email || "system"; // Fallback for seeds/system actions
        const userId = session?.user?.id || "system";

        await prisma.auditLog.create({
            data: {
                action: params.action,
                entityType: params.entityType,
                entityId: params.entityId,
                userId: userId,
                userEmail: userEmail,
                details: JSON.stringify(params.details),
            },
        });
    } catch (error) {
        // Logging should not break the main flow, so we catch errors silently or log to console
        console.error("Failed to write audit log:", error);
    }
}
