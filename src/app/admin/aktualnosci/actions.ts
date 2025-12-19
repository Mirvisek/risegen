"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAction } from "@/lib/audit";
import { redirect } from "next/navigation";

export async function createNews(prevState: any, formData: FormData) {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const content = formData.get("content") as string;
    const images = formData.get("images") as string; // JSON string

    const isHighlight = formData.get("isHighlight") === "on";

    if (!title || !slug || !content) {
        return { success: false, message: "Wypełnij wymagane pola." };
    }

    try {
        const news = await prisma.news.create({
            data: {
                title,
                slug,
                content,
                images: images || "[]",
                documents: formData.get("documents") as string || "[]",
                isHighlight,
            },
        });

        await logAction({
            action: "CREATE",
            entityType: "News",
            entityId: news.id,
            details: { after: news },
        });

        revalidatePath("/aktualnosci");
        revalidatePath("/admin/aktualnosci");
        revalidatePath("/", "layout");
    } catch (error) {
        console.error("Failed to create news:", error);
        return { success: false, message: "Błąd podczas tworzenia aktualności. Sprawdź czy slug jest unikalny." };
    }

    redirect("/admin/aktualnosci");
}

export async function updateNews(prevState: any, formData: FormData) {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const content = formData.get("content") as string;
    const images = formData.get("images") as string;

    const isHighlight = formData.get("isHighlight") === "on";

    if (!id || !title || !slug || !content) {
        return { success: false, message: "Wypełnij wymagane pola." };
    }

    try {
        const beforeUpdate = await prisma.news.findUnique({ where: { id } });

        // Cleanup removed files
        if (beforeUpdate) {
            try {
                const oldImages = JSON.parse(beforeUpdate.images || "[]") as string[];
                const newImages = images ? JSON.parse(images) as string[] : [];

                const oldDocs = JSON.parse(beforeUpdate.documents || "[]") as { url: string }[];
                const newDocs = formData.get("documents") ? JSON.parse(formData.get("documents") as string) as { url: string }[] : [];

                const { deleteFile } = await import("@/lib/file-utils");

                const removedImages = oldImages.filter(img => !newImages.includes(img));
                for (const img of removedImages) await deleteFile(img);

                const extractedNewUrls = newDocs.map(d => d.url);
                const removedDocs = oldDocs.filter(d => !extractedNewUrls.includes(d.url));
                for (const doc of removedDocs) await deleteFile(doc.url);
            } catch (e) {
                console.error("Error cleaning up news files:", e);
            }
        }

        const news = await prisma.news.update({
            where: { id },
            data: {
                title,
                slug,
                content,
                images: images || "[]",
                documents: formData.get("documents") as string || "[]",
                isHighlight,
            },
        });

        await logAction({
            action: "UPDATE",
            entityType: "News",
            entityId: news.id,
            details: { before: beforeUpdate, after: news },
        });

        revalidatePath("/aktualnosci");
        revalidatePath(`/aktualnosci/${slug}`);
        revalidatePath("/admin/aktualnosci");
        revalidatePath("/", "layout");

    } catch (error) {
        console.error("Failed to update news:", error);
        return { success: false, message: "Błąd podczas aktualizacji." };
    }

    redirect("/admin/aktualnosci");
}

export async function deleteNews(formData: FormData) {
    const id = formData.get("id") as string;
    if (id) {
        const beforeDelete = await prisma.news.findUnique({ where: { id } });
        if (beforeDelete) {
            // Cleanup files
            try {
                const images = JSON.parse(beforeDelete.images || "[]");
                const documents = JSON.parse(beforeDelete.documents || "[]");

                const { deleteFile } = await import("@/lib/file-utils");

                for (const img of images) await deleteFile(img);
                for (const doc of documents) await deleteFile(doc.url);
            } catch (e) {
                console.error("Error cleaning up global news files:", e);
            }

            await prisma.news.delete({ where: { id } });
            await logAction({
                action: "DELETE",
                entityType: "News",
                entityId: id,
                details: { before: beforeDelete },
            });
            revalidatePath("/admin/aktualnosci");
            revalidatePath("/aktualnosci");
            revalidatePath("/", "layout");
        }
    }
}
