"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  const profileData = {
    full_name: formData.get("full_name") as string,
    phone: formData.get("phone") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    pincode: formData.get("pincode") as string,
    avatar_url: formData.get("avatar_url") as string,
  }

  const { data, error } = await supabase.from("profiles").update(profileData).eq("id", user.id).select().single()

  if (error) {
    console.error("[v0] Error updating profile:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/profile")
  return { success: true, profile: data }
}

export async function getProfile() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { profile: null, error: "Unauthorized" }
  }

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error) {
    console.error("[v0] Error fetching profile:", error)
    return { profile: null, error: error.message }
  }

  return { profile: data, error: null }
}

export async function getUserListings() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { listings: [], error: "Unauthorized" }
  }

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories!products_category_id_fkey(name)
    `,
    )
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching listings:", error)
    return { listings: [], error: error.message }
  }

  return { listings: data || [], error: null }
}
