// Simple seed to populate one politician with mixed IN/OUT transactions
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function yen(amount) {
  return Math.round(amount);
}

async function main() {
  const slug = 'hoge';
  const name = 'Hoge';

  const politician = await prisma.politician.upsert({
    where: { slug },
    update: {},
    create: { slug, name },
  });

  const now = new Date();

  const transactions = [
    // IN
    {
      politicianId: politician.id,
      date: new Date(now.getFullYear(), 7, 1, 10, 0, 0),
      value: yen(3000),
      direction: 'IN',
      counterparty: 'Foo Supporter',
      inflowType: 'personal',
      source: 'stripe',
    },
    {
      politicianId: politician.id,
      date: new Date(now.getFullYear(), 7, 2, 9, 30, 0),
      value: yen(12000),
      direction: 'IN',
      counterparty: 'ACME Corp',
      inflowType: 'corporate',
      source: 'bank-transfer',
    },
    // OUT
    {
      politicianId: politician.id,
      date: new Date(now.getFullYear(), 7, 1, 10, 30, 0),
      value: yen(2200),
      direction: 'OUT',
      method: 'card',
      category: 'transport',
      category1: 'taxi',
    },
    {
      politicianId: politician.id,
      date: new Date(now.getFullYear(), 7, 3, 12, 15, 0),
      value: yen(5400),
      direction: 'OUT',
      method: 'cash',
      category: 'meals',
      category1: 'lunch',
    },
    {
      politicianId: politician.id,
      date: new Date(now.getFullYear(), 7, 4, 19, 0, 0),
      value: yen(11000),
      direction: 'OUT',
      method: 'card',
      category: 'travel',
      category1: 'train',
      category2: 'shinkansen',
    },
  ];

  await prisma.transaction.deleteMany({ where: { politicianId: politician.id } });
  await prisma.$transaction(transactions.map((t) => prisma.transaction.create({ data: t })));

  console.log('Seeded sample data for', slug);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


