import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { logAction } from "@/lib/audit";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    // User must be SUPERADMIN or ADMIN (though specifically user management is restricted to SuperAdmin in sidebar, let's allow ADMIN too if needed, but per request SuperAdmin does everything, Admin does almost everything. Usually User Management is SuperAdmin only or Admin too?)
    // User request: "Admin ma dostęp do wszystkiego oprócz ustawień". User Management IS often considered settings/admin stuff.
    // Sidebar config: { name: "Użytkownicy", ... roles: ["SUPERADMIN"] } -> ONLY SUPERADMIN can see users page.
    // So API should enforce SUPERADMIN.
    if (!session || !session.user.roles.includes("SUPERADMIN")) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const body = await req.json();

        console.log("Creating user:", { ...body, password: "***" });

        // Check if email exists
        const existing = await prisma.user.findUnique({ where: { email: body.email } });
        if (existing) {
            return NextResponse.json({ error: "Użytkownik z tym adresem email już istnieje." }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);

        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: hashedPassword,
                name: body.name,
                roles: body.roles || "[]", // Default to empty array (but usually form provides "[]" at least)
                mustChangePassword: true,
            },
        });

        await logAction({
            action: "CREATE",
            entityType: "User",
            entityId: user.id,
            details: { after: { ...user, password: "***" } },
        });

        const { password, ...result } = user;
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("User creation error:", error);
        return NextResponse.json({ error: "Błąd serwera: " + error.message }, { status: 500 });
    }
}
