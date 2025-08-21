import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create categories
  console.log('📂 Creating categories...')
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Shoes',
        slug: 'shoes',
        description: 'Premium footwear for all occasions',
        sortOrder: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Trendy clothing and accessories',
        sortOrder: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Laptops',
        slug: 'laptops',
        description: 'High-performance computing devices',
        sortOrder: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest gadgets and devices',
        sortOrder: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Home & Living',
        slug: 'home-living',
        description: 'Comfort and style for your home',
        sortOrder: 5,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sports & Fitness',
        slug: 'sports-fitness',
        description: 'Equipment for active lifestyle',
        sortOrder: 6,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Beauty & Health',
        slug: 'beauty-health',
        description: 'Personal care and wellness',
        sortOrder: 7,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Books & Media',
        slug: 'books-media',
        description: 'Knowledge and entertainment',
        sortOrder: 8,
      },
    }),
  ])

  console.log(`✅ Created ${categories.length} categories`)

  // Create a sample seller user
  console.log('👤 Creating sample seller user...')
  const seller = await prisma.user.create({
    data: {
      email: 'seller@luxiormall.com',
      firstName: 'Sample',
      lastName: 'Seller',
      role: 'seller',
      isVerified: true,
    },
  })

  console.log(`✅ Created seller user: ${seller.email}`)

  // Create sample products
  console.log('🛍️ Creating sample products...')
  
  // Helper function to safely get category ID
  const getCategoryId = (slug: string) => {
    const category = categories.find(c => c.slug === slug)
    return category?.id || null
  }
  
  const products = await Promise.all([
    // Shoes
    prisma.product.create({
      data: {
        sellerId: seller.id,
        categoryId: getCategoryId('shoes'),
        name: 'Premium Leather Sneakers',
        slug: 'premium-leather-sneakers',
        description: 'High-quality leather sneakers with comfortable cushioning and stylish design. Perfect for casual and semi-formal occasions.',
        shortDescription: 'Premium leather sneakers with comfort and style',
        price: 89.99,
        comparePrice: 129.99,
        stockQuantity: 50,
        status: 'active',
        isFeatured: true,
        isBestseller: true,
        tags: ['leather', 'sneakers', 'comfortable', 'stylish'],
        images: {
          create: [
            {
              imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d114d2c36?w=500&h=500&fit=crop',
              altText: 'Premium Leather Sneakers - Front View',
              isPrimary: true,
              sortOrder: 1,
            },
            {
              imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop',
              altText: 'Premium Leather Sneakers - Side View',
              isPrimary: false,
              sortOrder: 2,
            },
          ],
        },
      },
    }),

    // Running Shoes
    prisma.product.create({
      data: {
        sellerId: seller.id,
        categoryId: getCategoryId('shoes'),
        name: 'Running Shoes Pro',
        slug: 'running-shoes-pro',
        description: 'Professional running shoes with advanced cushioning technology and breathable mesh upper.',
        shortDescription: 'Professional running shoes for athletes',
        price: 149.99,
        comparePrice: 199.99,
        stockQuantity: 30,
        status: 'active',
        isFeatured: false,
        isBestseller: true,
        tags: ['running', 'athletic', 'breathable', 'cushioned'],
        images: {
          create: [
            {
              imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop',
              altText: 'Running Shoes Pro - Front View',
              isPrimary: true,
              sortOrder: 1,
            },
          ],
        },
      },
    }),

    // Fashion
    prisma.product.create({
      data: {
        sellerId: seller.id,
        categoryId: getCategoryId('fashion'),
        name: 'Classic Denim Jacket',
        slug: 'classic-denim-jacket',
        description: 'Timeless denim jacket with modern fit and durable construction. Perfect for layering in any season.',
        shortDescription: 'Classic denim jacket with modern fit',
        price: 79.99,
        comparePrice: 99.99,
        stockQuantity: 25,
        status: 'active',
        isFeatured: true,
        isBestseller: false,
        tags: ['denim', 'jacket', 'classic', 'versatile'],
        images: {
          create: [
            {
              imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&h=500&fit=crop',
              altText: 'Classic Denim Jacket - Front View',
              isPrimary: true,
              sortOrder: 1,
            },
          ],
        },
      },
    }),

    // Laptops
    prisma.product.create({
      data: {
        sellerId: seller.id,
        categoryId: getCategoryId('laptops'),
        name: 'Gaming Laptop Pro',
        slug: 'gaming-laptop-pro',
        description: 'High-performance gaming laptop with RTX graphics, fast processor, and premium display for ultimate gaming experience.',
        shortDescription: 'High-performance gaming laptop with RTX graphics',
        price: 1299.99,
        comparePrice: 1599.99,
        stockQuantity: 15,
        status: 'active',
        isFeatured: true,
        isBestseller: true,
        tags: ['gaming', 'laptop', 'RTX', 'high-performance'],
        images: {
          create: [
            {
              imageUrl: 'https://images.unsplash.com/photo-1603302576830-6c6b9a1a6b12?w=500&h=500&fit=crop',
              altText: 'Gaming Laptop Pro - Front View',
              isPrimary: true,
              sortOrder: 1,
            },
          ],
        },
      },
    }),

    // Electronics
    prisma.product.create({
      data: {
        sellerId: seller.id,
        categoryId: getCategoryId('electronics'),
        name: 'Wireless Bluetooth Headphones',
        slug: 'wireless-bluetooth-headphones',
        description: 'Premium wireless headphones with noise cancellation, long battery life, and crystal clear sound quality.',
        shortDescription: 'Premium wireless headphones with noise cancellation',
        price: 199.99,
        comparePrice: 249.99,
        stockQuantity: 40,
        status: 'active',
        isFeatured: false,
        isBestseller: true,
        tags: ['wireless', 'bluetooth', 'noise-cancellation', 'premium'],
        images: {
          create: [
            {
              imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
              altText: 'Wireless Bluetooth Headphones - Front View',
              isPrimary: true,
              sortOrder: 1,
            },
          ],
        },
      },
    }),
  ])

  console.log(`✅ Created ${products.length} products`)

  // Create product variants for some products
  console.log('🔧 Creating product variants...')
  const variants = await Promise.all([
    // Sneaker sizes
    prisma.productVariant.create({
      data: {
        productId: products.find(p => p.slug === 'premium-leather-sneakers')?.id!,
        name: 'Size',
        value: '42',
        stockQuantity: 10,
        sku: 'PLS-42',
      },
    }),
    prisma.productVariant.create({
      data: {
        productId: products.find(p => p.slug === 'premium-leather-sneakers')?.id!,
        name: 'Size',
        value: '43',
        stockQuantity: 15,
        sku: 'PLS-43',
      },
    }),
    prisma.productVariant.create({
      data: {
        productId: products.find(p => p.slug === 'premium-leather-sneakers')?.id!,
        name: 'Size',
        value: '44',
        stockQuantity: 20,
        sku: 'PLS-44',
      },
    }),

    // Jacket sizes
    prisma.productVariant.create({
      data: {
        productId: products.find(p => p.slug === 'classic-denim-jacket')?.id!,
        name: 'Size',
        value: 'M',
        stockQuantity: 8,
        sku: 'CDJ-M',
      },
    }),
    prisma.productVariant.create({
      data: {
        productId: products.find(p => p.slug === 'classic-denim-jacket')?.id!,
        name: 'Size',
        value: 'L',
        stockQuantity: 12,
        sku: 'CDJ-L',
      },
    }),
    prisma.productVariant.create({
      data: {
        productId: products.find(p => p.slug === 'classic-denim-jacket')?.id!,
        name: 'Size',
        value: 'XL',
        stockQuantity: 5,
        sku: 'CDJ-XL',
      },
    }),
  ])

  console.log(`✅ Created ${variants.length} product variants`)

  console.log('🎉 Database seeding completed successfully!')
  console.log(`📊 Summary:`)
  console.log(`   - Categories: ${categories.length}`)
  console.log(`   - Products: ${products.length}`)
  console.log(`   - Variants: ${variants.length}`)
  console.log(`   - Seller: ${seller.email}`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
