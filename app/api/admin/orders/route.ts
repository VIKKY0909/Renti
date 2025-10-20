import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// GET /api/admin/orders - Get all orders with admin details
export async function GET(request: NextRequest) {
  try {
    console.log('[API] /api/admin/orders - Request received')
    const supabase = await createClient()
    
    // Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('[API] User authenticated:', user?.id, 'Error:', authError)
    
    if (!user) {
      console.warn('[API] Unauthorized - No user found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    
    console.log('[API] Profile check:', { userId: user.id, isAdmin: profile?.is_admin, error: profileError })

    if (!profile?.is_admin) {
      console.warn('[API] Admin access denied for user:', user.id)
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const payment_status = searchParams.get('payment_status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    console.log('[API] Query parameters:', { status, payment_status, page, limit })

    let query = supabase
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
          pincode
        ),
        owner:profiles!orders_owner_id_fkey (
          id,
          full_name,
          email,
          phone,
          city,
          state,
          pincode
        ),
        delivery_address:user_addresses!orders_delivery_address_id_fkey (
          id,
          full_name,
          phone,
          address_line_1,
          address_line_2,
          city,
          state,
          pincode,
          landmark,
          instructions
        ),
        products!orders_product_id_fkey (
          id,
          title,
          images,
          rental_price,
          security_deposit
        ),
        status_updated_by_profile:profiles!orders_status_updated_by_fkey (
          id,
          full_name
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status && status !== '') {
      console.log('[API] Filtering by status:', status)
      query = query.eq('status', status)
    }

    if (payment_status) {
      console.log('[API] Filtering by payment_status:', payment_status)
      query = query.eq('payment_status', payment_status)
    }

    const { data: orders, error, count } = await query

    if (error) {
      console.error('[API] Error fetching orders:', error)
      return NextResponse.json({ 
        error: error.message,
        details: error.details,
        hint: error.hint 
      }, { status: 500 })
    }

    console.log('[API] Orders fetched successfully:', {
      count: orders?.length || 0,
      totalCount: count,
      page,
      status: status || 'all'
    })

    return NextResponse.json({ 
      orders: orders || [], 
      count: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error) {
    console.error('[API] Error in GET /api/admin/orders:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}



