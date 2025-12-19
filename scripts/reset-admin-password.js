const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAdminPassword() {
    try {
        const newPassword = 'Admin123!'; // Zmień to hasło po zalogowaniu
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const admin = await prisma.user.upsert({
            where: { email: 'admin@risegen.pl' },
            update: {
                password: hashedPassword,
                roles: JSON.stringify(['SUPERADMIN', 'ADMIN', 'EDITOR']),
                mustChangePassword: true
            },
            create: {
                email: 'admin@risegen.pl',
                name: 'Super Admin',
                password: hashedPassword,
                roles: JSON.stringify(['SUPERADMIN', 'ADMIN', 'EDITOR']),
                mustChangePassword: true
            }
        });

        console.log('✅ Hasło admina zostało zresetowane!');
        console.log('📧 Email: admin@risegen.pl');
        console.log('🔑 Hasło: Admin123!');
        console.log('⚠️  UWAGA: Zmień hasło natychmiast po zalogowaniu!');
        console.log('');
        console.log('Dane użytkownika:', admin);

    } catch (error) {
        console.error('❌ Błąd podczas resetowania hasła:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetAdminPassword();
