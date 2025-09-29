import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with conditional configuration
const createPrismaClient = () => {
  const config: ConstructorParameters<typeof PrismaClient>[0] = {
    log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
  }

  // Only add datasources if DATABASE_URL is available
  if (process.env.DATABASE_URL) {
    config.datasources = {
      db: {
        url: process.env.DATABASE_URL,
      },
    }
  }

  return new PrismaClient(config)
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma