"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAction } from "@/lib/audit";

export async function deleteProject(formData: FormData) {
    const id = formData.get("id") as string;
    if (id) {
        const beforeDelete = await prisma.project.findUnique({ where: { id } });
        if (beforeDelete) {
            // Cleanup files
            try {
                const images = JSON.parse(beforeDelete.images || "[]");
                const documents = JSON.parse(beforeDelete.documents || "[]");

                // Dynamic import to avoid edge runtime issues if any (though this is a server action)
                const { deleteFile } = await import("@/lib/file-utils");

                for (const img of images) await deleteFile(img);
                for (const doc of documents) await deleteFile(doc.url);
            } catch (e) {
                console.error("Error cleaning up project files:", e);
            }

            await prisma.project.delete({ where: { id } });
            await logAction({
                action: "DELETE",
                entityType: "Project",
                entityId: id,
                details: { before: beforeDelete },
            });
            revalidatePath("/admin/projekty");
            revalidatePath("/projekty");
            revalidatePath("/");
        }
    }
}
