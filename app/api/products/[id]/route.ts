import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// GET /api/products/[id] - Get specific product for public viewing
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    const { data: product, error } = await supabase
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
        category_id,
        profiles!products_owner_id_fkey (
          id,
          full_name,
          avatar_url,
          city,
          state
        ),
        categories!products_category_id_fkey (
          id,
          name,
          slug
        )
      `)
      .eq('id', params.id)
      .eq('status', 'approved')
      .eq('is_available', true)
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
    console.error('Error in GET /api/products/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
