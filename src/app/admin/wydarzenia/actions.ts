"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logAction } from "@/lib/audit";

async function checkAuth() {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");
    return session;
}

export async function upsertEvent(id: string | null, data: any) {
    const session = await checkAuth();

    // Generate slug if not provided
    if (!data.slug) {
        data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }

    let event;
    if (id) {
        const before = await prisma.event.findUnique({ where: { id } });
        event = await prisma.event.update({ where: { id }, data });
        await logAction({
            action: "UPDATE",
            entityType: "Event",
            entityId: id,
            details: { before, after: event }
        });
    } else {
        event = await prisma.event.create({ data });
        await logAction({
            action: "CREATE",
            entityType: "Event",
            entityId: event.id,
            details: { after: event }
        });
    }

    revalidatePath("/wydarzenia");
    revalidatePath(`/wydarzenia/${event.slug}`);
    revalidatePath("/admin/wydarzenia");
    return event;
}

export async function deleteEvent(id: string) {
    const session = await checkAuth();
    const before = await prisma.event.findUnique({ where: { id } });
    await prisma.event.delete({ where: { id } });
    await logAction({
        action: "DELETE",
        entityType: "Event",
        entityId: id,
        details: { before }
    });

    revalidatePath("/wydarzenia");
    revalidatePath("/admin/wydarzenia");
}
