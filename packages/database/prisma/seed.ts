import { PrismaClient, UserRole, AgeGroup, BookStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create admin user
    const admin = await prisma.user.upsert({
        where: { email: 'admin@bribooks.com' },
        update: {},
        create: {
            email: 'admin@bribooks.com',
            username: 'admin',
            firstName: 'Admin',
            lastName: 'User',
            role: UserRole.ADMIN,
            emailVerified: true,
        },
    });

    console.log('✅ Created admin user:', admin.email);

    // Create sample author
    const author = await prisma.user.upsert({
        where: { email: 'author@bribooks.com' },
        update: {},
        create: {
            email: 'author@bribooks.com',
            username: 'author_demo',
            firstName: 'Demo',
            lastName: 'Author',
            role: UserRole.AUTHOR,
            emailVerified: true,
            bio: 'A passionate children\'s book author',
        },
    });

    console.log('✅ Created author user:', author.email);

    // Create sample book
    const book = await prisma.book.create({
        data: {
            title: 'The Adventures of Bri',
            description: 'A magical journey through the land of books and imagination',
            authorId: author.id,
            ageGroup: AgeGroup.EARLY_READER,
            status: BookStatus.PUBLISHED,
            tags: ['adventure', 'magic', 'friendship'],
            publishedAt: new Date(),
            chapters: {
                create: [
                    {
                        title: 'Chapter 1: The Beginning',
                        content: 'Once upon a time, in a land filled with books...',
                        order: 1,
                        illustrationUrls: [],
                    },
                    {
                        title: 'Chapter 2: The Discovery',
                        content: 'Bri discovered a magical library...',
                        order: 2,
                        illustrationUrls: [],
                    },
                ],
            },
        },
    });

    console.log('✅ Created sample book:', book.title);

    console.log('🎉 Seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
