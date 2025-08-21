import { prisma } from '@/lib/prisma'
import type { Product, Category, ProductImage, ProductVariant } from '@prisma/client'

export type ProductWithDetails = Product & {
  category: Category | null
  images: ProductImage[]
  variants: ProductVariant[]
}

export type ProductWithReviews = ProductWithDetails & {
  _count: {
    reviews: number
  }
  reviews: Array<{
    id: string
    rating: number
    title: string | null
    comment: string | null
    createdAt: Date
    user: {
      firstName: string
      lastName: string
    }
  }>
}

export class ProductsService {
  // Get all active products with basic details
  static async getAllProducts(): Promise<ProductWithDetails[]> {
    try {
      return await prisma.product.findMany({
        where: { status: 'active' },
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: 'asc' }
          },
          variants: {
            orderBy: { name: 'asc' }
          }
        },
        orderBy: [
          { isFeatured: 'desc' },
          { isBestseller: 'desc' },
          { createdAt: 'desc' }
        ]
      })
    } catch (error) {
      console.error('Error fetching products:', error)
      throw new Error('Failed to fetch products')
    }
  }

  // Get featured products
  static async getFeaturedProducts(): Promise<ProductWithDetails[]> {
    try {
      return await prisma.product.findMany({
        where: { 
          status: 'active',
          isFeatured: true 
        },
        include: {
          category: true,
          images: {
            where: { isPrimary: true }
          },
          variants: true
        },
        orderBy: { createdAt: 'desc' },
        take: 8
      })
    } catch (error) {
      console.error('Error fetching featured products:', error)
      throw new Error('Failed to fetch featured products')
    }
  }

  // Get bestseller products
  static async getBestsellerProducts(): Promise<ProductWithDetails[]> {
    try {
      return await prisma.product.findMany({
        where: { 
          status: 'active',
          isBestseller: true 
        },
        include: {
          category: true,
          images: {
            where: { isPrimary: true }
          },
          variants: true
        },
        orderBy: { createdAt: 'desc' },
        take: 6
      })
    } catch (error) {
      console.error('Error fetching bestseller products:', error)
      throw new Error('Failed to fetch bestseller products')
    }
  }

  // Get product by slug with full details
  static async getProductBySlug(slug: string): Promise<ProductWithReviews | null> {
    try {
      return await prisma.product.findUnique({
        where: { slug },
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: 'asc' }
          },
          variants: {
            orderBy: { name: 'asc' }
          },
          reviews: {
            where: { isApproved: true },
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          },
          _count: {
            select: {
              reviews: true
            }
          }
        }
      })
    } catch (error) {
      console.error('Error fetching product:', error)
      throw new Error('Failed to fetch product')
    }
  }

  // Get products by category
  static async getProductsByCategory(categorySlug: string): Promise<ProductWithDetails[]> {
    try {
      return await prisma.product.findMany({
        where: { 
          status: 'active',
          category: { slug: categorySlug }
        },
        include: {
          category: true,
          images: {
            where: { isPrimary: true }
          },
          variants: true
        },
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' }
        ]
      })
    } catch (error) {
      console.error('Error fetching products by category:', error)
      throw new Error('Failed to fetch products by category')
    }
  }

  // Search products
  static async searchProducts(query: string): Promise<ProductWithDetails[]> {
    try {
      return await prisma.product.findMany({
        where: {
          status: 'active',
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { tags: { hasSome: [query.toLowerCase()] } }
          ]
        },
        include: {
          category: true,
          images: {
            where: { isPrimary: true }
          },
          variants: true
        },
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' }
        ]
      })
    } catch (error) {
      console.error('Error searching products:', error)
      throw new Error('Failed to search products')
    }
  }

  // Get all categories
  static async getAllCategories(): Promise<Category[]> {
    try {
      return await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' }
      })
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw new Error('Failed to fetch categories')
    }
  }

  // Get category by slug
  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      return await prisma.category.findUnique({
        where: { slug }
      })
    } catch (error) {
      console.error('Error fetching category:', error)
      throw new Error('Failed to fetch category')
    }
  }

  // Get products with pagination
  static async getProductsWithPagination(
    page: number = 1,
    limit: number = 12,
    categorySlug?: string
  ): Promise<{
    products: ProductWithDetails[]
    total: number
    totalPages: number
    currentPage: number
  }> {
    try {
      const where = {
        status: 'active' as const,
        ...(categorySlug && { category: { slug: categorySlug } })
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            category: true,
            images: {
              where: { isPrimary: true }
            },
            variants: true
          },
          orderBy: [
            { isFeatured: 'desc' },
            { createdAt: 'desc' }
          ],
          skip: (page - 1) * limit,
          take: limit
        }),
        prisma.product.count({ where })
      ])

      return {
        products,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      }
    } catch (error) {
      console.error('Error fetching products with pagination:', error)
      throw new Error('Failed to fetch products')
    }
  }
}
