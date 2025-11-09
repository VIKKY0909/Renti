"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getProducts(filters?: {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  limit?: number
  offset?: number
}) {
  try {
    const supabase = await createClient()

    let query = supabase
      .from("products")
      .select(
        `
        id, title, description, admin_description, short_description, brand, color, fabric, occasion,
        rental_price, security_deposit, original_price,
        bust, waist, hip, shoulder, length, sleeve_length,
        bust_min, bust_max, waist_min, waist_max,
        hip_min, hip_max, length_min, length_max,
        sleeve_length_min, sleeve_length_max, shoulder_min, shoulder_max,
        images, condition, status, is_available, total_rentals, average_rating,
        available_from, available_until, created_at, updated_at,
        owner:profiles!products_owner_id_fkey(id, full_name, avatar_url),
        category:categories(id, name, slug)
      `,
        { count: "exact" }
      )
      .eq("status", "approved")
      .eq("is_available", true)

    // ✅ Category filter (fixed relation alias)
    if (filters?.category) {
      query = query.eq("category.slug", filters.category)
    }

    // ✅ Search filter
    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,admin_description.ilike.%${filters.search}%`
      )
    }

    // ✅ Price filters
    if (filters?.minPrice) {
      query = query.gte("rental_price", filters.minPrice)
    }

    if (filters?.maxPrice) {
      query = query.lte("rental_price", filters.maxPrice)
    }

    // ✅ Sorting logic
    switch (filters?.sortBy) {
      case "price-low":
        query = query.order("rental_price", { ascending: true })
        break
      case "price-high":
        query = query.order("rental_price", { ascending: false })
        break
      case "popular":
        query = query.order("total_rentals", { ascending: false })
        break
      case "rating":
        query = query.order("average_rating", { ascending: false })
        break
      default:
        query = query.order("created_at", { ascending: false })
    }

    // ✅ Pagination
    if (filters?.limit && filters?.offset !== undefined) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1
      )
    } else if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    // ✅ Execute query
    const { data, error, count } = await query

    if (error) {
      console.error("[v0] Error fetching products:", error)
      return { products: [], count: 0, error: error.message }
    }

    return { products: data || [], count: count || 0, error: null }
  } catch (err) {
    console.error("[v0] Network error fetching products:", err)
    return {
      products: [],
      count: 0,
      error: "Network error - please try again",
    }
  }
}

export async function getProductById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id, title, description, admin_description, short_description, brand, color, fabric, occasion,
      rental_price, security_deposit, original_price,
      bust, waist, hip, shoulder, length, sleeve_length,
      bust_min, bust_max, waist_min, waist_max,
      hip_min, hip_max, length_min, length_max,
      sleeve_length_min, sleeve_length_max, shoulder_min, shoulder_max,
      images, condition, status, is_available, total_rentals, average_rating,
      available_from, available_until, created_at, updated_at,
      owner_id,
      owner:profiles!products_owner_id_fkey(id, full_name, avatar_url, city, state),
      category:categories!products_category_id_fkey(id, name, slug),
      reviews:reviews(
        id,
        rating,
        comment,
        images,
        created_at,
        user:profiles!reviews_user_id_fkey(id, full_name, avatar_url)
      )
    `,
    )
    .eq("id", id)
    .single()

  if (error) {
    console.error("[v0] Error fetching product:", error)
    return { product: null, error: error.message }
  }

  // Increment view count
  await supabase.rpc("increment_product_views", { product_id: id })

  return { product: data, error: null }
}

export async function createProduct(formData: FormData) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    // === Basic text + numeric fields ===
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const short_description = formData.get("short_description") as string
    const category = formData.get("category") as string
    const rental_price = parseFloat(formData.get("rental_price") as string)
    const original_price = parseFloat(formData.get("original_price") as string)
    const security_deposit = parseFloat(formData.get("security_deposit") as string)
    const fabric = formData.get("fabric") as string
    const color = formData.get("color") as string
    const brand = formData.get("brand") as string
    const occasion = formData.get("occasion") as string
    const sleeve_length = formData.get("sleeve_length") as string
    const available_from = formData.get("available_from") as string
    const available_until = formData.get("available_until") as string

    // === Measurement range fields ===
    const bust_min = formData.get("bust_min")
    const bust_max = formData.get("bust_max")
    const waist_min = formData.get("waist_min")
    const waist_max = formData.get("waist_max")
    const hip_min = formData.get("hip_min")
    const hip_max = formData.get("hip_max")
    const length_min = formData.get("length_min")
    const length_max = formData.get("length_max")
    const sleeve_length_min = formData.get("sleeve_length_min")
    const sleeve_length_max = formData.get("sleeve_length_max")
    const shoulder_min = formData.get("shoulder_min")
    const shoulder_max = formData.get("shoulder_max")

    // === Get category_id ===
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("name", category)
      .single()

    if (categoryError || !categoryData) {
      console.error("[createProduct] Category lookup error:", categoryError)
      return {
        success: false,
        error: `Invalid category: ${category}`,
      }
    }

    // === Parse images from client ===
    const images = JSON.parse(formData.get("images") as string) as string[]

    const productData = {
      owner_id: user.id,
      category_id: categoryData.id,
      title,
      description,
      short_description,
      brand,
      color,
      fabric,
      occasion,
      rental_price,
      security_deposit,
      original_price,
      sleeve_length,
      available_from,
      available_until,
      images,
      condition: "good",
      status: "pending",
      is_available: true,

      // === New measurement fields ===
      bust_min: bust_min ? parseFloat(bust_min as string) : null,
      bust_max: bust_max ? parseFloat(bust_max as string) : null,
      waist_min: waist_min ? parseFloat(waist_min as string) : null,
      waist_max: waist_max ? parseFloat(waist_max as string) : null,
      hip_min: hip_min ? parseFloat(hip_min as string) : null,
      hip_max: hip_max ? parseFloat(hip_max as string) : null,
      length_min: length_min ? parseFloat(length_min as string) : null,
      length_max: length_max ? parseFloat(length_max as string) : null,
      sleeve_length_min: sleeve_length_min ? parseFloat(sleeve_length_min as string) : null,
      sleeve_length_max: sleeve_length_max ? parseFloat(sleeve_length_max as string) : null,
      shoulder_min: shoulder_min ? parseFloat(shoulder_min as string) : null,
      shoulder_max: shoulder_max ? parseFloat(shoulder_max as string) : null,
    }

    // === Insert ===
    const { data, error } = await supabase
      .from("products")
      .insert(productData)
      .select()
      .single()

    if (error) {
      console.error("[createProduct] Insert error:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/manage-listings")
    return { success: true, product: data }
  } catch (err) {
    console.error("[createProduct] Unexpected error:", err)
    return { success: false, error: "Unexpected error occurred" }
  }
}



export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  // Check if product has any active orders (rented)
  const { data: activeOrders, error: ordersError } = await supabase
    .from("orders")
    .select("id")
    .eq("product_id", id)
    .in("status", ["pending", "confirmed", "shipped", "delivered"])
    .limit(1)

  if (ordersError) {
    console.error("[v0] Error checking active orders:", ordersError)
    return { success: false, error: "Failed to check product status" }
  }

  if (activeOrders && activeOrders.length > 0) {
    return { success: false, error: "Cannot edit product that has active rentals" }
  }

  // Helper to parse "12" or "12-18" into { min, max }
  const parseRange = (value: string | null): { min: number | null; max: number | null } => {
    const raw = (value || "").trim()
    if (!raw) return { min: null, max: null }
    const m = raw.match(/^\s*(\d+(?:\.\d+)?)\s*(?:-\s*(\d+(?:\.\d+)?))?\s*$/)
    if (!m) {
      const n = Number.parseFloat(raw)
      return Number.isNaN(n) ? { min: null, max: null } : { min: n, max: null }
    }
    const a = Number.parseFloat(m[1])
    const b = m[2] ? Number.parseFloat(m[2]) : null
    if (Number.isNaN(a)) return { min: null, max: null }
    if (b !== null && Number.isNaN(b)) return { min: null, max: null }
    return b !== null ? { min: Math.min(a, b), max: Math.max(a, b) } : { min: a, max: null }
  }

  const bustRange = parseRange(formData.get("bust_size") as string | null)
  const waistRange = parseRange(formData.get("waist_size") as string | null)
  const lengthRange = parseRange(formData.get("length_size") as string | null)

  const productData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    short_description: formData.get("short_description") as string,
    brand: formData.get("brand") as string,
    color: formData.get("color") as string,
    fabric: formData.get("fabric") as string,
    rental_price: Number.parseFloat(formData.get("rental_price") as string),
    security_deposit: Number.parseFloat(formData.get("security_deposit") as string),
    original_price: formData.get("original_price") ? Number.parseFloat(formData.get("original_price") as string) : null,
    // Ranges into *_min/_max; keep old single columns untouched
    bust_min: bustRange.min,
    bust_max: bustRange.max,
    waist_min: waistRange.min,
    waist_max: waistRange.max,
    length_min: lengthRange.min,
    length_max: lengthRange.max,
    sleeve_length: formData.get("sleeve_length") as string,
    available_from: formData.get("available_from") as string,
    available_until: formData.get("available_until") as string,
    images: JSON.parse(formData.get("images") as string),
  }

  const { data, error } = await supabase
    .from("products")
    .update(productData)
    .eq("id", id)
    .eq("owner_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("[v0] Error updating product:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/profile/listings")
  revalidatePath(`/products/${id}`)
  return { success: true, product: data }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  // Check if product has any orders (rented or not)
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("id")
    .eq("product_id", id)
    .limit(1)

  if (ordersError) {
    console.error("[v0] Error checking orders:", ordersError)
    return { success: false, error: "Failed to check product status" }
  }

  if (orders && orders.length > 0) {
    return { success: false, error: "Cannot delete product that has been rented" }
  }

  const { error } = await supabase.from("products").delete().eq("id", id).eq("owner_id", user.id)

  if (error) {
    console.error("[v0] Error deleting product:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/manage-listings")
  return { success: true }
}

export async function toggleWishlist(productId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  // Check if already in wishlist
  const { data: existing } = await supabase
    .from("wishlist")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single()

  if (existing) {
    // Remove from wishlist
    const { error } = await supabase.from("wishlist").delete().eq("user_id", user.id).eq("product_id", productId)

    if (error) {
      console.error("[v0] Error removing from wishlist:", error)
      return { success: false, error: error.message, inWishlist: true }
    }

    revalidatePath("/wishlist")
    return { success: true, inWishlist: false }
  } else {
    // Add to wishlist
    const { error } = await supabase.from("wishlist").insert({ user_id: user.id, product_id: productId })

    if (error) {
      console.error("[v0] Error adding to wishlist:", error)
      return { success: false, error: error.message, inWishlist: false }
    }

    revalidatePath("/wishlist")
    return { success: true, inWishlist: true }
  }
}

export async function getWishlist() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { wishlist: [], error: "Unauthorized" }
  }

  const { data, error } = await supabase
    .from("wishlist")
    .select(
      `
      id,
      created_at,
      product:products(
        id, title, description, short_description, brand, color, fabric, occasion,
        rental_price, security_deposit, original_price,
        bust, waist, hip, shoulder, length, sleeve_length,
        bust_min, bust_max, waist_min, waist_max,
        hip_min, hip_max, length_min, length_max,
        sleeve_length_min, sleeve_length_max, shoulder_min, shoulder_max,
        images, condition, status, is_available, total_rentals, average_rating,
        available_from, available_until, created_at, updated_at,
        owner:profiles!products_owner_id_fkey(id, full_name, avatar_url),
        category:categories!products_category_id_fkey(id, name, slug)
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching wishlist:", error)
    return { wishlist: [], error: error.message }
  }

  return { wishlist: data || [], error: null }
}

export async function getUserProducts() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { products: [], error: "Unauthorized" }
  }

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id, title, description, short_description, brand, color, fabric, occasion,
      rental_price, security_deposit, original_price,
      bust, waist, hip, shoulder, length, sleeve_length,
      bust_min, bust_max, waist_min, waist_max,
      hip_min, hip_max, length_min, length_max,
      sleeve_length_min, sleeve_length_max, shoulder_min, shoulder_max,
      images, condition, status, is_available, total_rentals, average_rating,
      available_from, available_until, created_at, updated_at,
      category:categories!products_category_id_fkey(id, name, slug),
      owner:profiles!products_owner_id_fkey(id, full_name, avatar_url)
    `,
    )
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching user products:", error)
    return { products: [], error: error.message }
  }

  return { products: data || [], error: null }
}

