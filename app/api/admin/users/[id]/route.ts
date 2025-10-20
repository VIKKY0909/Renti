import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// GET /api/admin/users/[id] - Get specific user with admin details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Check if user is admin or super admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_admin')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { data: targetUser, error } = await supabase
      .from('admin_users_view')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user activity
    const { data: recentActivity } = await supabase
      .from('user_activity')
      .select('*')
      .eq('user_id', params.id)
      .order('created_at', { ascending: false })
      .limit(10)

    // Get user products
    const { data: userProducts } = await supabase
      .from('products')
      .select('id, title, status, created_at')
      .eq('owner_id', params.id)
      .order('created_at', { ascending: false })
      .limit(5)

    // Get user orders
    const { data: userOrders } = await supabase
      .from('orders')
      .select('id, status, total_amount, created_at')
      .eq('user_id', params.id)
      .order('created_at', { ascending: false })
      .limit(5)

    return NextResponse.json({ 
      user: targetUser,
      recentActivity: recentActivity || [],
      userProducts: userProducts || [],
      userOrders: userOrders || []
    })
  } catch (error) {
    console.error('Error in GET /api/admin/users/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/users/[id] - Update user role and status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Check if user is admin or super admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_admin')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { role, is_active, notes } = body

    // Validate role
    const validRoles = ['user', 'admin', 'super_admin']
    if (role && !validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Only super admins can create other super admins
    if (role === 'super_admin' && profile.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only super admins can assign super admin role' }, { status: 403 })
    }

    // Prevent users from demoting themselves
    if (params.id === user.id && role && role !== profile.role) {
      return NextResponse.json({ error: 'You cannot change your own role' }, { status: 403 })
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (role) {
      updateData.role = role
      // Update is_admin field for backward compatibility
      updateData.is_admin = role !== 'user'
    }

    if (typeof is_active === 'boolean') {
      updateData.is_active = is_active
    }

    if (notes !== undefined) {
      updateData.notes = notes
    }

    const { data: updatedUser, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', params.id)
      .select('*')
      .single()

    if (error) {
      console.error('Error updating user:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Log the admin action
    await supabase.rpc('log_user_activity', {
      activity_user_id: user.id,
      activity_type: 'profile_updated',
      activity_description: `Admin ${profile.role} updated user profile`,
      activity_metadata: {
        target_user_id: params.id,
        changes: updateData,
        admin_id: user.id
      }
    })

    // Create admin notification
    await supabase.rpc('create_admin_notification', {
      notification_type: 'system_alert',
      notification_title: 'User Role Updated',
      notification_message: `User ${updatedUser.full_name} role changed to ${updatedUser.role}`,
      notification_data: { 
        user_id: params.id, 
        user_name: updatedUser.full_name,
        new_role: updatedUser.role,
        updated_by: user.id
      },
      notification_priority: 'medium'
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Error in PUT /api/admin/users/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}




