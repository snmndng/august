import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { user: { 
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } }
          ]
        }}
      ];
    }

    if (status !== 'all') {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        select: {
          id: true,
          orderNumber: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          totalAmount: true,
          status: true,
          createdAt: true,
          items: {
            select: {
              quantity: true,
              productName: true
            }
          },
          payments: {
            select: {
              status: true,
              method: true
            },
            orderBy: { createdAt: 'desc' },
            take: 1
          },
          shipping: {
            select: {
              address: {
                select: {
                  city: true,
                  state: true
                }
              }
            },
            take: 1
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where })
    ]);

    // Get stats
    const stats = await prisma.order.groupBy({
      by: ['status'],
      _count: true,
      _sum: {
        totalAmount: true
      }
    });

    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: {
        name: `${order.user.firstName} ${order.user.lastName}`,
        email: order.user.email
      },
      total: Number(order.totalAmount),
      status: order.status,
      payment_status: order.payments[0]?.status || 'pending',
      payment_method: order.payments[0]?.method || null,
      items_count: order.items.reduce((sum, item) => sum + item.quantity, 0),
      created_at: order.createdAt.toISOString(),
      shipping_address: order.shipping[0]?.address 
        ? `${order.shipping[0].address.city}, ${order.shipping[0].address.state}`
        : 'Not provided'
    }));


    return NextResponse.json({
      orders: formattedOrders,
      stats: {
        total,
        pending: stats.find(s => s.status === 'pending')?._count || 0,
        shipped: stats.find(s => s.status === 'shipped')?._count || 0,
        totalRevenue: stats.reduce((sum, s) => sum + Number(s._sum.totalAmount || 0), 0)
      },
      pagination: {
        page,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}