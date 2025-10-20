import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// GET /api/admin/products/[id] - Get specific product with admin details
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

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        profiles!products_owner_id_fkey (
          id,
          full_name,
          email,
          phone,
          city,
          state,
          pincode,
          avatar_url
        ),
        categories!products_category_id_fkey (
          id,
          name,
          slug,
          description
        ),
        approved_by_profile:profiles!products_approved_by_fkey (
          id,
          full_name
        ),
        rejected_by_profile:profiles!products_rejected_by_fkey (
          id,
          full_name
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error in GET /api/admin/products/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/products/[id] - Update product status (approve/reject)
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
      rejection_reason, 
      admin_notes, 
      admin_description,
      availability_status,
      is_available 
    } = body

    // Validate status
    if (!status || !['approved', 'rejected', 'under_review', 'suspended', 'unavailable'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    if (status === 'approved') {
      updateData.approved_by = user.id
      updateData.approved_at = new Date().toISOString()
      updateData.is_available = true
    } else if (status === 'rejected') {
      updateData.rejected_by = user.id
      updateData.rejected_at = new Date().toISOString()
      updateData.rejection_reason = rejection_reason
      updateData.is_available = false
    }

    if (admin_notes) {
      updateData.admin_notes = admin_notes
    }

    if (admin_description) {
      updateData.admin_description = admin_description
    }

    if (availability_status) {
      updateData.availability_status = availability_status
    }

    if (typeof is_available === 'boolean') {
      updateData.is_available = is_available
    }

    const { data: product, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', params.id)
      .select(`
        *,
        profiles!products_owner_id_fkey (
          id,
          full_name,
          email,
          phone
        ),
        categories!products_category_id_fkey (
          id,
          name,
          slug
        )
      `)
      .single()

    if (error) {
      console.error('Error updating product:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Create admin notification (with error handling)
    try {
      const notificationType = status === 'approved' ? 'product_approved' : 'product_rejected'
      
      // Map to valid notification types from schema
      const validType = notificationType === 'product_approved' ? 'new_product' : 'product_rejected'
      
      await supabase.rpc('create_admin_notification', {
        notification_type: validType,
        notification_title: `Product ${status === 'approved' ? 'Approved' : 'Rejected'}`,
        notification_message: `Product "${product.title}" has been ${status === 'approved' ? 'approved' : 'rejected'}${rejection_reason ? ` - Reason: ${rejection_reason}` : ''}`,
        notification_data: { product_id: params.id, product_title: product.title, owner_name: product.profiles?.full_name },
        notification_priority: 'medium'
      })
    } catch (notificationError) {
      console.warn('Failed to create admin notification:', notificationError)
      // Don't fail the entire request if notification creation fails
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error in PUT /api/admin/products/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

