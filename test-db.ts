import { PrismaClient } from "@prisma/client";

async function main() {
    const prisma = new PrismaClient();
    try {
        const config = await prisma.siteConfig.findUnique({ where: { id: "main" } });
        console.log("Config found:", !!config);
        console.log("Maintenance mode:", config?.isMaintenanceMode);
    } catch (error) {
        console.error("Error accessing DB:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
