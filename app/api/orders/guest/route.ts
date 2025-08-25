import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerInfo, items, totalAmount, createAccount } = body;

    const supabase = createClient();

    // If creating account, handle user registration
    let userId = null;
    if (createAccount) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: customerInfo.email,
        password: createAccount.password,
        options: {
          data: {
            first_name: customerInfo.firstName,
            last_name: customerInfo.lastName,
            phone: customerInfo.phone,
          }
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        return NextResponse.json(
          { error: 'Failed to create account: ' + authError.message },
          { status: 400 }
        );
      }

      userId = authData.user?.id;
    }

    // Create order
    const orderData = {
      user_id: userId,
      guest_email: customerInfo.email,
      guest_name: customerInfo.firstName ? `${customerInfo.firstName} ${customerInfo.lastName}`.trim() : null,
      guest_phone: customerInfo.phone,
      shipping_address: {
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        address: customerInfo.address,
        city: customerInfo.city,
        postalCode: customerInfo.postalCode,
        phone: customerInfo.phone,
      },
      total_amount: totalAmount,
      status: 'pending' as const,
      payment_status: 'pending' as const,
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (orderError) {
      console.error('Order error:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order: ' + orderError.message },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
      product_name: item.product.name,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items error:', itemsError);
      return NextResponse.json(
        { error: 'Failed to create order items: ' + itemsError.message },
        { status: 500 }
      );
    }

    // TODO: Integrate with M-Pesa STK Push here
    // For now, we'll return success

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: createAccount
        ? 'Account created and order placed successfully!'
        : 'Order placed successfully!',
    });

  } catch (error) {
    console.error('Guest order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}