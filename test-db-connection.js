
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test basic query
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} users in database`);
    
    const productCount = await prisma.product.count();
    console.log(`✅ Found ${productCount} products in database`);
    
    const categoryCount = await prisma.category.count();
    console.log(`✅ Found ${categoryCount} categories in database`);
    
    console.log('🎉 All database operations working correctly!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
