"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function checkAuth() {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");
    return session;
}

export async function createFaq(data: { question: string, answer: string, order: number }) {
    await checkAuth();
    const faq = await prisma.fAQ.create({ data });
    revalidatePath("/o-nas");
    revalidatePath("/admin/faq");
    return faq;
}

export async function updateFaq(id: string, data: { question: string, answer: string, order: number }) {
    await checkAuth();
    const faq = await prisma.fAQ.update({ where: { id }, data });
    revalidatePath("/o-nas");
    revalidatePath("/admin/faq");
    return faq;
}

export async function deleteFaq(id: string) {
    await checkAuth();
    await prisma.fAQ.delete({ where: { id } });
    revalidatePath("/o-nas");
    revalidatePath("/admin/faq");
}
