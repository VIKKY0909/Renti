import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// GET /api/admin/orders/[id] - Get specific order with admin details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        customer:profiles!orders_user_id_fkey (
          id,
          full_name,
          email,
          phone,
          city,
          state,
          pincode,
          avatar_url
        ),
        owner:profiles!orders_owner_id_fkey (
          id,
          full_name,
          email,
          phone,
          city,
          state,
          pincode,
          avatar_url
        ),
        products!orders_product_id_fkey (
          id,
          title,
          images,
          rental_price,
          security_deposit,
          condition,
          size_guide
        ),
        status_updated_by_profile:profiles!orders_status_updated_by_fkey (
          id,
          full_name
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching order:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Get order status history
    const { data: statusHistory } = await supabase
      .from('order_status_history')
      .select(`
        *,
        updated_by_profile:profiles (
          id,
          full_name
        )
      `)
      .eq('order_id', params.id)
      .order('created_at', { ascending: false })

    // Get payment transactions
    const { data: paymentTransactions } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('order_id', params.id)
      .order('created_at', { ascending: false })

    return NextResponse.json({ 
      order,
      statusHistory: statusHistory || [],
      paymentTransactions: paymentTransactions || []
    })
  } catch (error) {
    console.error('Error in GET /api/admin/orders/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/orders/[id] - Update order status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { 
      status, 
      payment_status,
      admin_notes,
      customer_notes,
      tracking_number,
      pickup_scheduled_date,
      delivery_scheduled_date,
      return_scheduled_date,
      actual_pickup_date,
      actual_delivery_date,
      actual_return_date,
      shipping_cost,
      late_fee,
      damage_fee,
      final_amount,
      refund_amount
    } = body

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'picked_up', 'dispatched', 'delivered', 'picked_up_for_return', 'returned', 'completed', 'cancelled', 'rejected']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Validate payment status
    const validPaymentStatuses = ['pending', 'paid', 'refunded']
    if (payment_status && !validPaymentStatuses.includes(payment_status)) {
      return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 })
    }

    const updateData: any = {
      status_updated_by: user.id,
      status_updated_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    if (status) updateData.status = status
    if (payment_status) updateData.payment_status = payment_status
    if (admin_notes) updateData.admin_notes = admin_notes
    if (customer_notes) updateData.customer_notes = customer_notes
    if (tracking_number) updateData.tracking_number = tracking_number
    if (pickup_scheduled_date) updateData.pickup_scheduled_date = pickup_scheduled_date
    if (delivery_scheduled_date) updateData.delivery_scheduled_date = delivery_scheduled_date
    if (return_scheduled_date) updateData.return_scheduled_date = return_scheduled_date
    if (actual_pickup_date) updateData.actual_pickup_date = actual_pickup_date
    if (actual_delivery_date) updateData.actual_delivery_date = actual_delivery_date
    if (actual_return_date) updateData.actual_return_date = actual_return_date
    if (shipping_cost) updateData.shipping_cost = shipping_cost
    if (late_fee) updateData.late_fee = late_fee
    if (damage_fee) updateData.damage_fee = damage_fee
    if (final_amount) updateData.final_amount = final_amount
    if (refund_amount) updateData.refund_amount = refund_amount

    const { data: order, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', params.id)
      .select(`
        *,
        customer:profiles!orders_user_id_fkey (
          id,
          full_name,
          email,
          phone
        ),
        owner:profiles!orders_owner_id_fkey (
          id,
          full_name,
          email,
          phone
        ),
        products!orders_product_id_fkey (
          id,
          title,
          images
        )
      `)
      .single()

    // Update product availability based on order status
    if (status && order) {
      let productAvailable = true
      
      // If order is confirmed or in progress, make product unavailable
      if (['confirmed', 'picked_up', 'dispatched', 'delivered', 'picked_up_for_return'].includes(status)) {
        productAvailable = false
      }
      
      // If order is completed or cancelled, make product available again
      if (['completed', 'cancelled', 'rejected'].includes(status)) {
        productAvailable = true
      }

      // Update product availability
      await supabase
        .from('products')
        .update({ 
          is_available: productAvailable,
          availability_status: productAvailable ? 'available' : 'rented'
        })
        .eq('id', order.product_id)
    }

    if (error) {
      console.error('Error updating order:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Create admin notification for status change (with error handling)
    if (status) {
      try {
        await supabase.rpc('create_admin_notification', {
          notification_type: 'order_status_change',
          notification_title: `Order Status Updated`,
          notification_message: `Order #${order.id.slice(0, 8)} status changed to "${status}"`,
          notification_data: { 
            order_id: params.id, 
            order_number: order.id.slice(0, 8),
            new_status: status,
            customer_name: order.customer?.full_name,
            product_title: order.products?.title
          },
          notification_priority: 'medium'
        })
      } catch (notificationError) {
        console.warn('Failed to create admin notification:', notificationError)
        // Don't fail the entire request if notification creation fails
      }
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error in PUT /api/admin/orders/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

