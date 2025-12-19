import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { logAction } from "@/lib/audit";

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const body = await req.json();
        const beforeUpdate = await prisma.project.findUnique({ where: { id: params.id } });

        // Calculate removed files
        if (beforeUpdate) {
            try {
                const oldImages = JSON.parse(beforeUpdate.images || "[]") as string[];
                const newImages = JSON.parse(body.images || "[]") as string[];

                const oldDocs = JSON.parse(beforeUpdate.documents || "[]") as { url: string }[];
                const newDocs = JSON.parse(body.documents || "[]") as { url: string }[];

                const { deleteFile } = await import("@/lib/file-utils");

                // Find images in old but not in new
                const removedImages = oldImages.filter(img => !newImages.includes(img));
                for (const img of removedImages) await deleteFile(img);

                // Find docs in old but not in new
                const extractedNewUrls = newDocs.map(d => d.url);
                const removedDocs = oldDocs.filter(d => !extractedNewUrls.includes(d.url));
                for (const doc of removedDocs) await deleteFile(doc.url);

            } catch (e) {
                console.error("Error cleaning up updated files:", e);
            }
        }

        const project = await prisma.project.update({
            where: { id: params.id },
            data: body,
        });

        await logAction({
            action: "UPDATE",
            entityType: "Project",
            entityId: project.id,
            details: { before: beforeUpdate, after: project },
        });

        return NextResponse.json(project);
    } catch (error) {
        return new NextResponse("Error", { status: 500 });
    }
}
