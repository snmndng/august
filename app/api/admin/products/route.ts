
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    // TODO: Add proper authentication check for admin users
    // const session = await getServerSession();
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const category = searchParams.get('category') || 'all';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status !== 'all') {
      where.status = status;
    }

    if (category !== 'all') {
      where.categoryId = category;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          seller: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          category: {
            select: {
              name: true
            }
          },
          images: {
            where: { isPrimary: true },
            take: 1
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    // Get stats
    const stats = await prisma.product.groupBy({
      by: ['status'],
      _count: true
    });

    const statsObj = {
      total,
      active: stats.find(s => s.status === 'active')?._count || 0,
      inactive: stats.find(s => s.status === 'inactive')?._count || 0,
      draft: stats.find(s => s.status === 'draft')?._count || 0,
      lowStock: await prisma.product.count({
        where: {
          stockQuantity: { gt: 0, lt: 10 }
        }
      }),
      outOfStock: await prisma.product.count({
        where: { stockQuantity: 0 }
      })
    };

    return NextResponse.json({
      products: products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        stock: product.stockQuantity,
        category: product.category?.name || 'Uncategorized',
        status: product.status,
        seller: `${product.seller.firstName} ${product.seller.lastName}`,
        sellerEmail: product.seller.email,
        created_at: product.createdAt.toISOString(),
        image_url: product.images[0]?.imageUrl || '/api/placeholder/300/300'
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      stats: statsObj
    });

  } catch (error) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
