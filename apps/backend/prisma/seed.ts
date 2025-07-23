// apps/backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user1 = await prisma.user.create({
    data: {
      email: 'aksh@example.com',
      username: 'akshdev',
      password: hashedPassword,
      firstName: 'Aksh',
      lastName: 'Raj',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'aman@example.com',
      username: 'amanxboat',
      password: hashedPassword,
      firstName: 'Aman',
      lastName: 'Gupta',
    },
  });

  console.log('Seed data created:', { user1, user2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });