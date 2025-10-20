import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// GET /api/banner-categories - Get all banner categories
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { searchParams } = new URL(request.url)
    const admin = searchParams.get('admin') === 'true'

    let query = supabase
      .from('banner_categories')
      .select('*')
      .order('name', { ascending: true })

    // If not admin, only get active categories
    if (!admin) {
      query = query.eq('is_active', true)
    }

    const { data: categories, error } = await query

    if (error) {
      console.error('Error fetching banner categories:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ categories: categories || [] })
  } catch (error) {
    console.error('Error in GET /api/banner-categories:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/banner-categories - Create a new banner category (admin only)
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
    const { name, description, is_active = true } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const { data: category, error } = await supabase
      .from('banner_categories')
      .insert({
        name,
        description,
        is_active
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating banner category:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/banner-categories:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}




