import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seeds...');

    await prisma.client.deleteMany();

    const clients = await prisma.client.createMany({
        data: [
            {
                name: 'João da Silva',
                email: 'joao@gmail.com',
                cpf: '72935552024',
            },
            {
                name: 'Maria da Silva',
                email: 'maria@gmail.com',
                cpf: '84935708000',
            },
            {
                name: 'Pedro da Silva',
                email: 'pedro@gmail.com',
                cpf: '80302935002',
            },
        ],
        skipDuplicates: true,
    });

    console.log(`✅ Created ${clients.count} clients`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
        console.log('🎉 Seed completed!');
    })
    .catch(async (error) => {
        console.error('❌ Seed failed:', error);
        await prisma.$disconnect();
        process.exit(1);
    });
