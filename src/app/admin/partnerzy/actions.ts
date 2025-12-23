"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAction } from "@/lib/audit";
import { redirect } from "next/navigation";

export async function createPartner(prevState: any, formData: FormData) {
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const website = formData.get("website") as string;
    const logo = formData.get("logo") as string;

    if (!name || !type || !logo) {
        return { success: false, message: "Wypełnij wymagane pola (Nazwa, Typ, Logo)." };
    }

    try {
        const partner = await prisma.partner.create({
            data: {
                name,
                type,
                website: website || "",
                logo,
            },
        });

        await logAction({
            action: "CREATE",
            entityType: "Partner",
            entityId: partner.id,
            details: { after: partner },
        });

        revalidatePath("/admin/partnerzy");
        revalidatePath("/admin/wyglad");
        revalidatePath("/", "layout"); // Update home/layout where partners are shown
    } catch (error) {
        console.error("Failed to create partner:", error);
        return { success: false, message: "Błąd podczas tworzenia partnera." };
    }

    redirect("/admin/wyglad?tab=appearance&sub=appearance-partners");
}

export async function updatePartner(prevState: any, formData: FormData) {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const website = formData.get("website") as string;
    const logo = formData.get("logo") as string;

    if (!id || !name || !type || !logo) {
        return { success: false, message: "Wypełnij wymagane pola." };
    }

    try {
        const beforeUpdate = await prisma.partner.findUnique({ where: { id } });

        // Cleanup old file if logo changed
        if (beforeUpdate && beforeUpdate.logo !== logo) {
            try {
                const { deleteFile } = await import("@/lib/file-utils");
                await deleteFile(beforeUpdate.logo);
            } catch (e) {
                console.error("Error cleaning up partner logo:", e);
            }
        }

        const partner = await prisma.partner.update({
            where: { id },
            data: {
                name,
                type,
                website: website || "",
                logo,
            },
        });

        await logAction({
            action: "UPDATE",
            entityType: "Partner",
            entityId: partner.id,
            details: { before: beforeUpdate, after: partner },
        });

        revalidatePath("/admin/partnerzy");
        revalidatePath("/admin/wyglad");
        revalidatePath("/", "layout");
    } catch (error) {
        console.error("Failed to update partner:", error);
        return { success: false, message: "Błąd podczas aktualizacji." };
    }

    redirect("/admin/wyglad?tab=appearance&sub=appearance-partners");
}

export async function deletePartner(formData: FormData) {
    const id = formData.get("id") as string;
    if (id) {
        const beforeDelete = await prisma.partner.findUnique({ where: { id } });
        if (beforeDelete) {
            // Cleanup file
            try {
                const { deleteFile } = await import("@/lib/file-utils");
                await deleteFile(beforeDelete.logo);
            } catch (e) {
                console.error("Error cleaning up partner file:", e);
            }

            await prisma.partner.delete({ where: { id } });
            await logAction({
                action: "DELETE",
                entityType: "Partner",
                entityId: id,
                details: { before: beforeDelete },
            });
            revalidatePath("/admin/partnerzy");
            revalidatePath("/admin/wyglad");
            revalidatePath("/", "layout");
        }
    }
}
