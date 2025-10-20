"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getProductReviews(productId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      user:profiles!reviews_user_id_fkey(id, full_name, avatar_url)
    `
    )
    .eq("product_id", productId)
    .eq("status", "approved")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching reviews:", error)
    return { reviews: [], error: error.message }
  }

  return { reviews: data || [], error: null }
}

export async function createReview(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  const reviewData = {
    user_id: user.id,
    product_id: formData.get("product_id") as string,
    order_id: formData.get("order_id") as string,
    rating: Number.parseInt(formData.get("rating") as string),
    comment: formData.get("comment") as string,
    images: formData.get("images") ? JSON.parse(formData.get("images") as string) : [],
    status: "pending",
  }

  const { data, error } = await supabase.from("reviews").insert(reviewData).select().single()

  if (error) {
    console.error("[v0] Error creating review:", error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/products/${reviewData.product_id}`)
  return { success: true, review: data }
}

