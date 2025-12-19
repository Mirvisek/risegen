"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAction } from "@/lib/audit";

export async function deleteUser(formData: FormData) {
    const id = formData.get("id") as string;
    // Extra security check for the main admin
    const user = await prisma.user.findUnique({ where: { id } });
    if (user && user.email !== "admin@risegen.pl") {
        await prisma.user.delete({ where: { id } });
        await logAction({
            action: "DELETE",
            entityType: "User",
            entityId: id,
            details: { before: { ...user, password: "***" } },
        });
        revalidatePath("/admin/users");
    }
}
