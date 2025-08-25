
import { DATABASE_CONFIG, prisma, prismaAdmin } from '../lib/database-config'

async function testConnections() {
  console.log('🧪 Testing Database Connections...\n')

  try {
    // Test pooled connection
    console.log('📱 Testing pooled connection...')
    const pooledResult = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Pooled connection successful:', pooledResult)
  } catch (error) {
    console.error('❌ Pooled connection failed:', error)
  }

  try {
    // Test direct connection
    console.log('\n🔧 Testing direct connection...')
    const directResult = await prismaAdmin.$queryRaw`SELECT 1 as test`
    console.log('✅ Direct connection successful:', directResult)
  } catch (error) {
    console.error('❌ Direct connection failed:', error)
  }

  // Show configuration
  console.log('\n📋 Configuration:')
  console.log('Pooled URL:', DATABASE_CONFIG.pooled ? 'Set' : 'Not set')
  console.log('Direct URL:', DATABASE_CONFIG.direct ? 'Set' : 'Not set')

  // Cleanup
  await prisma.$disconnect()
  await prismaAdmin.$disconnect()
}

testConnections()
