
import { PrismaClient } from '@prisma/client'

// Database connection configuration
export const DATABASE_CONFIG = {
  // Use pooled connection for application queries (default)
  pooled: process.env.DATABASE_URL_POOLER || process.env.DATABASE_URL,
  // Use direct connection for admin tasks, migrations, seeding
  direct: process.env.DATABASE_URL_DIRECT || process.env.DATABASE_URL,
}

// Create Prisma client with pooled connection (for app usage)
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_CONFIG.pooled,
    },
  },
})

// Create Prisma client with direct connection (for admin tasks)
export const prismaAdmin = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_CONFIG.direct,
    },
  },
})

// Helper function to get the right Prisma client based on context
export function getPrismaClient(context: 'app' | 'admin' = 'app') {
  return context === 'admin' ? prismaAdmin : prisma
}

// Log which connections are being used
if (process.env.NODE_ENV === 'development') {
  console.log('🔗 Database Configuration:')
  console.log(`📱 App queries: ${DATABASE_CONFIG.pooled ? 'Pooled connection' : 'No pooled URL set'}`)
  console.log(`🔧 Admin tasks: ${DATABASE_CONFIG.direct ? 'Direct connection' : 'No direct URL set'}`)
}
