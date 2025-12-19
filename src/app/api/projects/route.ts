import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { logAction } from "@/lib/audit";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const body = await req.json();
        const project = await prisma.project.create({
            data: body,
        });

        await logAction({
            action: "CREATE",
            entityType: "Project",
            entityId: project.id,
            details: { after: project },
        });

        return NextResponse.json(project);
    } catch (error) {
        return new NextResponse("Error", { status: 500 });
    }
}
