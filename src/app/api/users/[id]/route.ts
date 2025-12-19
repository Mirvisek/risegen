import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { logAction } from "@/lib/audit";

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user.roles.includes("SUPERADMIN")) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const body = await req.json();
        const { name, roles, email } = body;

        // Validation: Unique email
        if (email) {
            const existing = await prisma.user.findFirst({
                where: {
                    email: email,
                    NOT: { id: params.id }, // Exclude current user
                },
            });
            if (existing) {
                return NextResponse.json({ error: "Ten email jest już zajęty przez innego użytkownika." }, { status: 400 });
            }
        }

        const beforeUpdate = await prisma.user.findUnique({ where: { id: params.id } });

        const updatedUser = await prisma.user.update({
            where: { id: params.id },
            data: {
                name,
                roles: typeof roles === 'string' ? roles : JSON.stringify(roles || []),
                email,
            },
        });

        await logAction({
            action: "UPDATE",
            entityType: "User",
            entityId: updatedUser.id,
            details: {
                before: beforeUpdate ? { ...beforeUpdate, password: "***" } : null,
                after: { ...updatedUser, password: "***" }
            },
        });

        // Exclude password
        const { password, ...result } = updatedUser;
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("User update error:", error);
        if (error.code === 'P2002') {
            // Basic generic error for uniqueness if we missed checks
            const target = error.meta?.target;
            return NextResponse.json({ error: `Wartość pola ${target} jest już zajęta.` }, { status: 400 });
        }
        return NextResponse.json({ error: "Błąd aktualizacji: " + error.message }, { status: 500 });
    }
}
