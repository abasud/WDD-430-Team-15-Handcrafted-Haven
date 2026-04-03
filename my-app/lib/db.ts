import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const createPrismaClient = () => {
  // Initialize the LibSQL database connection
  const libsql = createClient({
    url: process.env.DATABASE_URL || "file:./dev.db", // Local fallback
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  const adapter = new PrismaLibSql(libsql as any);
  
  return new PrismaClient({ adapter });
};

// Prevent multiple instances in development (Next.js HMR)
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}