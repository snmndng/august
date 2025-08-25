
import { prisma, prismaAdmin, getPrismaClient } from '../database-config'

// Example 1: Regular app queries (uses pooled connection)
export async function getProducts() {
  return await prisma.product.findMany({
    where: { status: 'active' },
    include: {
      images: true,
      category: true,
    },
  })
}

// Example 2: Admin operations (uses direct connection)
export async function createBulkProducts(products: any[]) {
  return await prismaAdmin.product.createMany({
    data: products,
  })
}

// Example 3: Using context-based client selection
export async function performDatabaseOperation(isAdminTask: boolean) {
  const client = getPrismaClient(isAdminTask ? 'admin' : 'app')
  
  if (isAdminTask) {
    // Heavy admin operations like bulk inserts, schema changes
    return await client.product.createMany({
      data: [], // bulk data
    })
  } else {
    // Regular app queries
    return await client.product.findMany({
      take: 20,
    })
  }
}

// Example 4: Transaction handling
export async function performTransaction() {
  // Use direct connection for complex transactions
  return await prismaAdmin.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email: 'test@example.com', firstName: 'Test', lastName: 'User' }
    })
    
    const order = await tx.order.create({
      data: {
        userId: user.id,
        orderNumber: `ORD-${Date.now()}`,
        subtotal: 100,
        totalAmount: 100,
        status: 'pending'
      }
    })
    
    return { user, order }
  })
}
