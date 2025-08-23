import { prisma } from '@/lib/prisma';
import { Product, Category } from '@/types';

export class ProductsService {
  static async getAllProducts() {
    try {
      return await prisma.product.findMany({
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  static async getFeaturedProducts() {
    try {
      return await prisma.product.findMany({
        where: {
          isFeatured: true,
        },
        include: {
          category: true,
        },
        take: 8,
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }

  static async getProductBySlug(slug: string) {
    try {
      return await prisma.product.findUnique({
        where: {
          slug: slug,
        },
        include: {
          category: true,
        },
      });
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      throw error;
    }
  }

  static async getAllCategories() {
    try {
      return await prisma.category.findMany({
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  static async getProductsByCategory(categoryId: string, page = 1, limit = 12) {
    try {
      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where: {
            categoryId: categoryId,
          },
          include: {
            category: true,
          },
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.product.count({
          where: {
            categoryId: categoryId,
          },
        }),
      ]);

      return {
        products,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }

  static async searchProducts(query: string, page = 1, limit = 12) {
    try {
      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where: {
            OR: [
              {
                name: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            ],
          },
          include: {
            category: true,
          },
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.product.count({
          where: {
            OR: [
              {
                name: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            ],
          },
        }),
      ]);

      return {
        products,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  static async getRelatedProducts(productId: string, categoryId: string, limit = 4) {
    try {
      return await prisma.product.findMany({
        where: {
          categoryId: categoryId,
          id: {
            not: productId,
          },
        },
        include: {
          category: true,
        },
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error('Error fetching related products:', error);
      throw error;
    }
  }

  static async getProductsWithPagination(page = 1, limit = 12) {
    try {
      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          include: {
            category: true,
          },
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.product.count(),
      ]);

      return {
        products,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error('Error fetching products with pagination:', error);
      throw error;
    }
  }

  static async getCategoryBySlug(slug: string) {
    try {
      return await prisma.category.findUnique({
        where: {
          slug: slug,
        },
      });
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      throw error;
    }
  }
}