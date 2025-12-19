import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
    log: ['info', 'warn', 'error']
});

async function main() {
    const email = "admin@risegen.pl";
    const password = await bcrypt.hash("risegen2024", 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password,
            name: "Admin",
            roles: "[\"ADMIN\", \"SUPERADMIN\"]"
        }
    });

    console.log({ user });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
