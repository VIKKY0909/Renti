import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET /api/debug/products - Debug endpoint to check products visibility
export async function GET() {
  try {
    const supabase = await createClient()

    // Get all products with their status
    const { data: allProducts, error: allError } = await supabase
      .from('products')
      .select(`
        id, title, status, is_available, listed_by_admin, created_at, approved_at,
        owner:profiles!products_owner_id_fkey(id, full_name, role)
      `)
      .order('created_at', { ascending: false })

    if (allError) {
      console.error('Error fetching all products:', allError)
      return NextResponse.json({ error: allError.message }, { status: 500 })
    }

    // Get products that should be visible (approved and available)
    const { data: visibleProducts, error: visibleError } = await supabase
      .from('products')
      .select(`
        id, title, status, is_available, listed_by_admin, created_at, approved_at,
        owner:profiles!products_owner_id_fkey(id, full_name, role)
      `)
      .eq('status', 'approved')
      .eq('is_available', true)
      .order('created_at', { ascending: false })

    if (visibleError) {
      console.error('Error fetching visible products:', visibleError)
      return NextResponse.json({ error: visibleError.message }, { status: 500 })
    }

    // Calculate statistics
    const stats = {
      total: allProducts?.length || 0,
      pending: allProducts?.filter(p => p.status === 'pending').length || 0,
      under_review: allProducts?.filter(p => p.status === 'under_review').length || 0,
      approved: allProducts?.filter(p => p.status === 'approved').length || 0,
      rejected: allProducts?.filter(p => p.status === 'rejected').length || 0,
      available: allProducts?.filter(p => p.is_available).length || 0,
      visible: visibleProducts?.length || 0
    }

    return NextResponse.json({
      stats,
      allProducts: allProducts || [],
      visibleProducts: visibleProducts || []
    })
  } catch (error) {
    console.error('Error in debug products endpoint:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}




