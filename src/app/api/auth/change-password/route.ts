import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const body = await req.json();
        const { password } = body;

        if (!password || password.length < 6) {
            return NextResponse.json({ error: "Password does not meet requirements" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                password: hashedPassword,
                mustChangePassword: false,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return new NextResponse("Error", { status: 500 });
    }
}
