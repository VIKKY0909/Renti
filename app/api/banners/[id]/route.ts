import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// GET /api/banners/[id] - Get a specific banner
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    const { data: banner, error } = await supabase
      .from('banners')
      .select(`
        *,
        banner_categories (
          id,
          name,
          description
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching banner:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }

    return NextResponse.json({ banner })
  } catch (error) {
    console.error('Error in GET /api/banners/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/banners/[id] - Update a banner (admin only)
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
      title,
      subtitle,
      description,
      link_text,
      link_url,
      image_url,
      mobile_image_url,
      category_id,
      display_order,
      is_active
    } = body

    // Validate required fields
    if (!title || !image_url) {
      return NextResponse.json({ error: 'Title and image_url are required' }, { status: 400 })
    }

    const { data: banner, error } = await supabase
      .from('banners')
      .update({
        title,
        subtitle,
        description,
        link_text,
        link_url,
        image_url,
        mobile_image_url,
        category_id,
        display_order,
        is_active
      })
      .eq('id', params.id)
      .select(`
        *,
        banner_categories (
          id,
          name,
          description
        )
      `)
      .single()

    if (error) {
      console.error('Error updating banner:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }

    return NextResponse.json({ banner })
  } catch (error) {
    console.error('Error in PUT /api/banners/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/banners/[id] - Delete a banner (admin only)
export async function DELETE(
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

    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting banner:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Banner deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/banners/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}




