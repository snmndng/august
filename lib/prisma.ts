import { prisma } from './database-config'

// Export the configured Prisma client
export { prisma }

// For global singleton pattern in development
const globalForPrisma = globalThis as unknown as {
  prisma: typeof prisma | undefined
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}