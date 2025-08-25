
<old_str>
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
</old_str>
<new_str>
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
</new_str>
