"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAction } from "@/lib/audit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// --- TEAMS SETTINGS (TOGGLES) ---

export async function updateTeamSettings(prevState: any, formData: FormData) {
    const showBoard = formData.get("showBoard") === "on";
    const showOffice = formData.get("showOffice") === "on";
    const showCoordinators = formData.get("showCoordinators") === "on";
    const showCollaborators = formData.get("showCollaborators") === "on";

    try {
        await prisma.siteConfig.upsert({
            where: { id: "main" },
            update: { showBoard, showOffice, showCoordinators, showCollaborators },
            create: { id: "main", showBoard, showOffice, showCoordinators, showCollaborators },
        });

        revalidatePath("/admin/o-nas");
        revalidatePath("/o-nas/zespol");
        return { success: true, message: "Ustawienia zespołu zaktualizowane." };
    } catch (error) {
        console.error("Failed to update team settings:", error);
        return { success: false, message: "Wystąpił błąd podczas aktualizacji ustawień." };
    }
}

export async function updateAboutText(prevState: any, formData: FormData) {
    const aboutUsText = formData.get("aboutUsText") as string;
    const aboutUsGoals = formData.get("aboutUsGoals") as string;
    const aboutUsJoinText = formData.get("aboutUsJoinText") as string;

    try {
        await prisma.siteConfig.upsert({
            where: { id: "main" },
            update: { aboutUsText, aboutUsGoals, aboutUsJoinText },
            create: { id: "main", aboutUsText, aboutUsGoals, aboutUsJoinText },
        });

        revalidatePath("/o-nas");
        revalidatePath("/admin/o-nas/ustawienia");
        return { success: true, message: "Treść strony 'O Nas' zaktualizowana." };
    } catch (error) {
        console.error("Failed to update about text:", error);
        return { success: false, message: "Wystąpił błąd podczas aktualizacji treści." };
    }
}

// --- TEAM MEMBERS ---

// --- ACTIONS ---

function checkPermission(session: any) {
    return session && session.user && (session.user.roles.includes("ADMIN") || session.user.roles.includes("SUPERADMIN"));
}

export async function createTeamMember(prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!checkPermission(session)) return { success: false, message: "Brak uprawnień." };

    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const bio = formData.get("bio") as string;
    const categories = formData.get("categories") as string; // JSON string
    const image = formData.get("image") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const alignment = (formData.get("alignment") as string) || "center";
    const order = parseInt(formData.get("order") as string || "0");

    try {
        const member = await prisma.teamMember.create({
            data: { name, role, bio, categories, image, email, phone, order, alignment },
        });

        await logAction({
            action: "CREATE",
            entityType: "TeamMember",
            entityId: member.id,
            details: { name, role, categories },
        });

        revalidatePath("/admin/o-nas");
        revalidatePath("/o-nas/zespol");
        return { success: true, message: "Członek zespołu dodany." };
    } catch (error) {
        return { success: false, message: "Błąd dodawania członka zespołu." };
    }
}

export async function updateTeamMember(id: string, prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!checkPermission(session)) return { success: false, message: "Brak uprawnień." };

    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const bio = formData.get("bio") as string;
    const categories = formData.get("categories") as string; // JSON string
    const image = formData.get("image") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const alignment = (formData.get("alignment") as string) || "center";
    const order = parseInt(formData.get("order") as string || "0");

    try {
        // Retrieve existing to see what changed or just update
        const beforeUpdate = await prisma.teamMember.findUnique({ where: { id } });

        if (beforeUpdate && beforeUpdate.image !== image) {
            try {
                const { deleteFile } = await import("@/lib/file-utils");
                await deleteFile(beforeUpdate.image as string);
            } catch (e) {
                console.error("Error cleaning up team member image:", e);
            }
        }

        const member = await prisma.teamMember.update({
            where: { id },
            data: { name, role, bio, categories, image, email, phone, order, alignment },
        });

        await logAction({
            action: "UPDATE",
            entityType: "TeamMember",
            entityId: id,
            details: { name, role, categories }, // Simplification: just log new state details
        });

        revalidatePath("/admin/o-nas");
        revalidatePath("/o-nas/zespol");
        return { success: true, message: "Dane zaktualizowane." };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Błąd aktualizacji członka zespołu." };
    }
}

export async function deleteTeamMember(id: string) {
    const session = await getServerSession(authOptions);
    if (!checkPermission(session)) return;

    try {
        const member = await prisma.teamMember.findUnique({ where: { id } });
        if (!member) return;

        try {
            const { deleteFile } = await import("@/lib/file-utils");
            await deleteFile(member.image as string);
        } catch (e) {
            console.error("Error cleaning up team member image:", e);
        }

        await prisma.teamMember.delete({ where: { id } });

        await logAction({
            action: "DELETE",
            entityType: "TeamMember",
            entityId: id,
            details: { name: member.name },
        });

        revalidatePath("/admin/o-nas");
        revalidatePath("/o-nas/zespol");
    } catch (error) {
        console.error("Error deleting team member:", error);
    }
}

// --- DOCUMENTS ---

export async function createDocument(prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!checkPermission(session)) return { success: false, message: "Brak uprawnień." };

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const fileUrl = formData.get("fileUrl") as string;
    const category = (formData.get("category") as string) || "OTHER";
    const order = parseInt(formData.get("order") as string || "0");

    if (!title || !fileUrl) {
        return { success: false, message: "Tytuł i plik są wymagane." };
    }

    try {
        const doc = await prisma.document.create({
            data: { title, description, fileUrl, category, order },
        });

        await logAction({
            action: "CREATE",
            entityType: "Document",
            entityId: doc.id,
            details: { title, category },
        });

        revalidatePath("/admin/o-nas");
        revalidatePath("/o-nas/dokumenty");
        return { success: true, message: "Dokument dodany." };
    } catch (error) {
        return { success: false, message: "Błąd dodawania dokumentu." };
    }
}

export async function updateDocument(id: string, prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!checkPermission(session)) return { success: false, message: "Brak uprawnień." };

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const fileUrl = formData.get("fileUrl") as string;
    const category = (formData.get("category") as string) || "OTHER";
    const order = parseInt(formData.get("order") as string || "0");

    try {
        const beforeUpdate = await prisma.document.findUnique({ where: { id } });

        if (beforeUpdate && beforeUpdate.fileUrl !== fileUrl) {
            try {
                const { deleteFile } = await import("@/lib/file-utils");
                await deleteFile(beforeUpdate.fileUrl);
            } catch (e) {
                console.error("Error cleaning up old document file:", e);
            }
        }

        await prisma.document.update({
            where: { id },
            data: { title, description, fileUrl, category, order },
        });

        await logAction({
            action: "UPDATE",
            entityType: "Document",
            entityId: id,
            details: { title },
        });

        revalidatePath("/admin/o-nas");
        revalidatePath("/o-nas/dokumenty");
        return { success: true, message: "Dokument zaktualizowany." };
    } catch (error) {
        return { success: false, message: "Błąd aktualizacji dokumentu." };
    }
}

export async function deleteDocument(id: string) {
    const session = await getServerSession(authOptions);
    if (!checkPermission(session)) return;

    try {
        const doc = await prisma.document.findUnique({ where: { id } });
        if (!doc) return;

        try {
            const { deleteFile } = await import("@/lib/file-utils");
            await deleteFile(doc.fileUrl);
        } catch (e) {
            console.error("Error cleaning up document file:", e);
        }

        await prisma.document.delete({ where: { id } });

        await logAction({
            action: "DELETE",
            entityType: "Document",
            entityId: id,
            details: { title: doc.title },
        });

        revalidatePath("/admin/o-nas");
        revalidatePath("/o-nas/jak-dzialamy");
    } catch (error) {
        console.error("Error deleting document:", error);
    }
}

// --- HOME HERO SLIDES ---

export async function createHomeSlide(prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!checkPermission(session)) return { success: false, message: "Brak uprawnień." };

    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const link = formData.get("link") as string;
    const image = formData.get("image") as string;
    const author = formData.get("author") as string;
    const alignment = (formData.get("alignment") as string) || "center";
    const order = parseInt(formData.get("order") as string || "0");

    if (!image) {
        return { success: false, message: "Zdjęcie jest wymagane." };
    }

    try {
        const slide = await prisma.homeHeroSlide.create({
            data: { title, subtitle, link, image, order, author, alignment },
        });

        await logAction({
            action: "CREATE",
            entityType: "HomeHeroSlide", // Using generic string here as type might not be updated yet in AuditLog definition
            entityId: slide.id,
            details: { title, image },
        });

        revalidatePath("/");
        revalidatePath("/admin/wyglad");
        return { success: true, message: "Slajd dodany." };
    } catch (error) {
        return { success: false, message: "Błąd dodawania slajdu." };
    }
}

export async function updateHomeSlide(id: string, prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!checkPermission(session)) return { success: false, message: "Brak uprawnień." };

    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const link = formData.get("link") as string;
    const image = formData.get("image") as string;
    const author = formData.get("author") as string;
    const alignment = (formData.get("alignment") as string) || "center";
    const order = parseInt(formData.get("order") as string || "0");

    try {
        const beforeUpdate = await prisma.homeHeroSlide.findUnique({ where: { id } });

        if (beforeUpdate && beforeUpdate.image !== image) {
            try {
                const { deleteFile } = await import("@/lib/file-utils");
                await deleteFile(beforeUpdate.image);
            } catch (e) {
                console.error("Error cleaning up slide image:", e);
            }
        }

        await prisma.homeHeroSlide.update({
            where: { id },
            data: { title, subtitle, link, image, order, author, alignment },
        });

        await logAction({
            action: "UPDATE",
            entityType: "HomeHeroSlide",
            entityId: id,
            details: { title, image },
        });

        revalidatePath("/");
        revalidatePath("/admin/wyglad");
        return { success: true, message: "Slajd zaktualizowany." };
    } catch (error) {
        return { success: false, message: "Błąd aktualizacji slajdu." };
    }
}

export async function deleteHomeSlide(id: string) {
    const session = await getServerSession(authOptions);
    if (!checkPermission(session)) return;

    try {
        const slide = await prisma.homeHeroSlide.findUnique({ where: { id } });
        if (!slide) return;

        try {
            const { deleteFile } = await import("@/lib/file-utils");
            await deleteFile(slide.image);
        } catch (e) {
            console.error("Error cleaning up slide image:", e);
        }

        await prisma.homeHeroSlide.delete({ where: { id } });

        await logAction({
            action: "DELETE",
            entityType: "HomeHeroSlide",
            entityId: id,
            details: { title: slide.title },
        });

        revalidatePath("/");
        revalidatePath("/admin/wyglad");
    } catch (error) {
        console.error("Error deleting slide:", error);
    }
}
