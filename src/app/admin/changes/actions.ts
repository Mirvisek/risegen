'use server'

import { prisma } from "@/lib/prisma";

export async function fetchAuditLogs(offset: number, limit: number) {
    return await prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
    });
}
