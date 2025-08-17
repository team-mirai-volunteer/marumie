const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // チームみらいの政治組織データを作成
    // 既存のデータがあるかチェック
    const existingTeamMirai = await prisma.politicalOrganization.findFirst({
        where: { name: 'チームみらい' }
    });

    let teamMirai;
    if (!existingTeamMirai) {
        teamMirai = await prisma.politicalOrganization.create({
            data: {
                name: 'チームみらい',
                description: 'チームみらい（Team Mirai）は、日本の政党。2024年東京都知事選挙でAIエンジニアの安野貴博のもとに集まった「チーム安野」を前身として、2025年5月8日に設立された。安野が党首を務めている。第27回参議院議員通常選挙において政党要件を満たし、国政政党となった。公職選挙法における略称は「みらい」。',
            },
        });
    } else {
        console.log('Political organization already exists:', existingTeamMirai);
        teamMirai = existingTeamMirai;
    }

    console.log('Created political organization:', teamMirai);
    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });