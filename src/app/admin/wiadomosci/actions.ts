"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateMessageStatus(formData: FormData) {
    const id = formData.get("id") as string;
    const status = formData.get("status") as string;
    try {
        await prisma.contactMessage.update({
            where: { id },
            data: { status },
        });
        revalidatePath("/admin/wiadomosci");
        return { success: true };
    } catch (e) {
        return { success: false };
    }
}

export async function deleteMessage(formData: FormData) {
    const id = formData.get("id") as string;
    try {
        await prisma.contactMessage.delete({ where: { id } });
        revalidatePath("/admin/wiadomosci");
        return { success: true };
    } catch (e) {
        return { success: false };
    }
}
