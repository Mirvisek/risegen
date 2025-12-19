import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.roles.includes("SUPERADMIN")) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const dbPath = join(process.cwd(), "dev.db");
        const fileBuffer = await readFile(dbPath);

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": "application/x-sqlite3",
                "Content-Disposition": `attachment; filename="risegen-backup-${new Date().toISOString().split('T')[0]}.db"`,
            },
        });
    } catch (error) {
        console.error("Backup failed:", error);
        return NextResponse.json({ error: "Backup failed" }, { status: 500 });
    }
}
