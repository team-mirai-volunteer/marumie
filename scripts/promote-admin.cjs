const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function promoteUserToAdmin(email) {
  try {
    if (!email) {
      console.error('Please provide an email address');
      console.log('Usage: node scripts/promote-admin.cjs <email>');
      process.exit(1);
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    if (user.role === 'admin') {
      console.log(`User ${email} is already an admin`);
      process.exit(0);
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'admin' },
    });

    console.log(`Successfully promoted ${email} to admin`);
    console.log(`User ID: ${updatedUser.id}`);
    console.log(`Updated at: ${updatedUser.updatedAt}`);
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line arguments
const email = process.argv[2];
promoteUserToAdmin(email);