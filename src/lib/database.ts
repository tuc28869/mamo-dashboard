import { PrismaClient } from '@prisma/client';

// Initialize Prisma client for database access
const prisma = new PrismaClient();

// Export database connection
export default prisma;

// Database utility functions
export const getLastMetrics = async () => {
  return prisma.metrics.findFirst({
    orderBy: {
      timestamp: 'desc',
    },
  });
};

export const saveMetrics = async (data: any) => {
  return prisma.metrics.create({
    data: {
      ...data,
      timestamp: new Date(),
    },
  });
};

// Configuration for database connection
export const DB_CONFIG = {
  connectionString: process.env.DATABASE_URL,
  poolSize: 5,
  ssl: process.env.NODE_ENV === 'production',
};