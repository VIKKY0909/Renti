import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    // Get query parameters
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sortBy') || 'featured'
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    console.log('🔍 API: Fetching products with params:', {
      category,
      search,
      minPrice,
      maxPrice,
      sortBy,
      limit,
      offset
    })

    // Build the query step by step
    let query = supabase
      .from('products')
      .select(`
        id, 
        title, 
        description, 
        admin_description,
        short_description, 
        brand, 
        color, 
        fabric, 
        occasion,
        rental_price, 
        security_deposit, 
        original_price, 
        bust, 
        waist, 
        length, 
        sleeve_length,
        images, 
        condition, 
        status, 
        is_available, 
        total_rentals, 
        average_rating,
        available_from, 
        available_until, 
        created_at, 
        updated_at,
        owner_id,
        category_id
      `, { count: 'exact' })

    // Always filter for approved and available products
    query = query
      .eq('status', 'approved')
      .eq('is_available', true)

    // Apply category filter if specified
    if (category && category !== 'all') {
      // First get category ID from slug
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single()
      
      if (categoryData) {
        query = query.eq('category_id', categoryData.id)
      }
    }

    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,admin_description.ilike.%${search}%`)
    }

    // Apply price filters
    if (minPrice) {
      query = query.gte('rental_price', parseFloat(minPrice))
    }
    if (maxPrice) {
      query = query.lte('rental_price', parseFloat(maxPrice))
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        query = query.order('rental_price', { ascending: true })
        break
      case 'price-high':
        query = query.order('rental_price', { ascending: false })
        break
      case 'popular':
        query = query.order('total_rentals', { ascending: false })
        break
      case 'rating':
        query = query.order('average_rating', { ascending: false })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    // Apply pagination
    if (limit && offset) {
      const limitNum = parseInt(limit)
      const offsetNum = parseInt(offset)
      query = query.range(offsetNum, offsetNum + limitNum - 1)
    } else if (limit) {
      query = query.limit(parseInt(limit))
    }

    console.log('🚀 API: Executing query...')
    const { data: products, error, count } = await query

    if (error) {
      console.error('❌ API: Error fetching products:', error)
      return NextResponse.json(
        { error: error.message, details: error.details },
        { status: 500 }
      )
    }

    console.log('✅ API: Success! Found products:', {
      count: products?.length || 0,
      total: count || 0,
      products: products?.map(p => ({ id: p.id, title: p.title }))
    })

    // Now get additional data for each product
    const enrichedProducts = []
    
    for (const product of products || []) {
      // Get owner info
      const { data: owner } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', product.owner_id)
        .single()

      // Get category info
      const { data: category } = await supabase
        .from('categories')
        .select('id, name, slug')
        .eq('id', product.category_id)
        .single()

      enrichedProducts.push({
        ...product,
        owner: owner || null,
        category: category || null
      })
    }

    console.log('🎉 API: Final result:', {
      productsCount: enrichedProducts.length,
      totalCount: count
    })

    return NextResponse.json({
      products: enrichedProducts,
      count: count || 0
    })

  } catch (error) {
    console.error('💥 API: Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
