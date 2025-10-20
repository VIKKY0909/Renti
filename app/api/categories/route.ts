import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Cache categories for 1 hour
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds
let categoriesCache: any = null
let cacheTimestamp: number = 0

export async function GET(request: NextRequest) {
  try {
    // Check if we have cached data that's still valid
    const now = Date.now()
    if (categoriesCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return NextResponse.json({ categories: categoriesCache })
    }

    const supabase = await createClient()
    
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching categories:", error)
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
    }

    // Update cache
    categoriesCache = categories || []
    cacheTimestamp = now

    return NextResponse.json({ categories: categoriesCache })
  } catch (error) {
    console.error("Error in categories API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
