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

export async function createStat(data: { label: string, value: string, order: number, icon: string }) {
    await checkAuth();
    const stat = await prisma.stat.create({ data });
    revalidatePath("/");
    revalidatePath("/admin/stats");
    return stat;
}

export async function updateStat(id: string, data: { label: string, value: string, order: number, icon: string }) {
    await checkAuth();
    const stat = await prisma.stat.update({ where: { id }, data });
    revalidatePath("/");
    revalidatePath("/admin/stats");
    return stat;
}

export async function deleteStat(id: string) {
    await checkAuth();
    await prisma.stat.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/stats");
}
