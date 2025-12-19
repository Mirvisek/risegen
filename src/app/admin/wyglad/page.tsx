import { prisma } from "@/lib/prisma";
import { AppearancePageTabs } from "@/components/admin/AppearancePageTabs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminAppearancePage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.roles.includes("SUPERADMIN")) {
        redirect("/admin/dashboard");
    }

    const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });
    const partners = await prisma.partner.findMany({ orderBy: { createdAt: "desc" } });
    const slides = await prisma.homeHeroSlide.findMany({ orderBy: { order: "asc" } });
    const members = await prisma.teamMember.findMany({ orderBy: [{ order: "asc" }] });
    const documents = await prisma.document.findMany({ orderBy: { order: "asc" } });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <AppearancePageTabs
                config={config}
                partners={partners}
                slides={slides}
                members={members}
                documents={documents}
            />
        </div>
    );
}
