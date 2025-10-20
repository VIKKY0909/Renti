import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// GET /api/banners - Get all active banners
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const admin = searchParams.get('admin') === 'true'

    let query = supabase
      .from('banners')
      .select(`
        *,
        banner_categories (
          id,
          name,
          description
        )
      `)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    // If not admin, only get active banners
    if (!admin) {
      query = query.eq('is_active', true)
    }

    // Filter by category if specified
    if (category) {
      query = query.eq('banner_categories.name', category)
    }

    const { data: banners, error } = await query

    if (error) {
      console.error('Error fetching banners:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ banners: banners || [] })
  } catch (error) {
    console.error('Error in GET /api/banners:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/banners - Create a new banner (admin only)
export async function POST(request: NextRequest) {
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
      gradient_from,
      gradient_to,
      gradient_via,
      category_id,
      display_order,
      is_active = true
    } = body

    // Validate required fields
    if (!title || !image_url) {
      return NextResponse.json({ error: 'Title and image_url are required' }, { status: 400 })
    }

    const { data: banner, error } = await supabase
      .from('banners')
      .insert({
        title,
        subtitle,
        description,
        link_text,
        link_url,
        image_url,
        mobile_image_url: image_url,
        category_id,
        display_order: display_order || 0,
        is_active,
        created_by: user.id
      })
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
      console.error('Error creating banner:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ banner }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/banners:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}




