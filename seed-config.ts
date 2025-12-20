import { PrismaClient } from "@prisma/client";

async function main() {
    const prisma = new PrismaClient();
    try {
        await prisma.siteConfig.upsert({
            where: { id: "main" },
            update: {},
            create: {
                id: "main",
                siteName: "RiseGen",
                isMaintenanceMode: false,
                maintenanceMessage: "Przepraszamy, strona jest obecnie w trakcie prac serwisowych. Zapraszamy wkrótce!"
            },
        });
        console.log("Initial SiteConfig created.");
    } catch (error) {
        console.error("Error seeding SiteConfig:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
