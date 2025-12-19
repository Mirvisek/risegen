
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Starting migration...');
    const members = await prisma.teamMember.findMany();

    for (const member of members) {
        if (member.category) {
            console.log(`Migrating member ${member.name} with category ${member.category}`);
            const categories = JSON.stringify([member.category]);
            await prisma.teamMember.update({
                where: { id: member.id },
                data: { categories },
            });
        }
    }

    console.log('Migration complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
