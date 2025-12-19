"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAction } from "@/lib/audit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function updateApplicationStatus(id: string, newStatus: string) {
    try {
        const beforeUpdate = await prisma.application.findUnique({ where: { id } });

        if (!beforeUpdate) return { success: false, error: "Application not found" };

        const updatedApplication = await prisma.application.update({
            where: { id },
            data: { status: newStatus },
        });

        await logAction({
            action: "UPDATE",
            entityType: "Application",
            entityId: id,
            details: {
                before: { status: beforeUpdate.status },
                after: { status: updatedApplication.status },
            },
        });

        revalidatePath("/admin/zgloszenia");
        revalidatePath(`/admin/zgloszenia/${id}`); // Revalidate details page too
        return { success: true };
    } catch (error) {
        console.error("Failed to update status:", error);
        return { success: false, error: "Failed to update" };
    }
}

export async function deleteApplication(id: string, reason: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const beforeUpdate = await prisma.application.findUnique({ where: { id } });
        if (!beforeUpdate) return { success: false, error: "Application not found" };

        await prisma.application.update({
            where: { id },
            data: {
                status: "DELETED",
                deletionReason: reason,
            },
        });

        await logAction({
            action: "DELETE", // Log as DELETE even though it's soft delete, or UPDATE with details
            entityType: "Application",
            entityId: id,
            details: {
                reason: reason,
                statusChange: { from: beforeUpdate.status, to: "DELETED" }
            },
        });

        revalidatePath("/admin/zgloszenia");
        revalidatePath(`/admin/zgloszenia/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to delete application:", error);
        return { success: false, error: "Failed to delete" };
    }
}

export async function deleteApplicationPermanently(id: string) {
    const session = await getServerSession(authOptions);
    // User request: "Admin ma dostęp do wszystkiego oprócz ustawień. Może usuwać trwale zgłoszenia."
    // So ADMIN and SUPERADMIN can delete permanently.
    if (!session || (!session.user.roles.includes("SUPERADMIN") && !session.user.roles.includes("ADMIN"))) {
        return { success: false, error: "Unauthorized. Tylko Administrator może usuwać trwale." };
    }

    try {
        const strId = String(id);
        const beforeDelete = await prisma.application.findUnique({ where: { id: strId } });
        if (!beforeDelete) return { success: false, error: "Application not found" };

        await prisma.application.delete({
            where: { id: strId },
        });

        await logAction({
            action: "DELETE",
            entityType: "Application",
            entityId: strId,
            details: {
                type: "PERMANENT_DELETE",
                user: session.user.email,
                applicationSnapshot: beforeDelete // Keep a snapshot in audit log just in case
            },
        });

        revalidatePath("/admin/zgloszenia");
        return { success: true };
    } catch (error) {
        console.error("Failed to permanently delete application:", error);
        return { success: false, error: "Failed to delete permanently" };
    }
}
