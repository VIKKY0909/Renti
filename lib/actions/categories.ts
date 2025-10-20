"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getCategories() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching categories:", error)
      return { categories: [], error: error.message }
    }

    return { categories: data || [], error: null }
  } catch (err) {
    console.error("[v0] Network error fetching categories:", err)
    return { categories: [], error: "Network error - please try again" }
  }
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).single()

  if (error) {
    console.error("[v0] Error fetching category:", error)
    return { category: null, error: error.message }
  }

  return { category: data, error: null }
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

  if (!profile?.is_admin) {
    return { success: false, error: "Unauthorized - Admin only" }
  }

  const categoryData = {
    name: formData.get("name") as string,
    slug: (formData.get("name") as string).toLowerCase().replace(/\s+/g, "-"),
    description: formData.get("description") as string,
    image_url: formData.get("image_url") as string,
  }

  const { data, error } = await supabase.from("categories").insert(categoryData).select().single()

  if (error) {
    console.error("[v0] Error creating category:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/categories")
  revalidatePath("/categories")
  return { success: true, category: data }
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

  if (!profile?.is_admin) {
    return { success: false, error: "Unauthorized - Admin only" }
  }

  const categoryData = {
    name: formData.get("name") as string,
    slug: (formData.get("name") as string).toLowerCase().replace(/\s+/g, "-"),
    description: formData.get("description") as string,
    image_url: formData.get("image_url") as string,
  }

  const { data, error } = await supabase.from("categories").update(categoryData).eq("id", id).select().single()

  if (error) {
    console.error("[v0] Error updating category:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/categories")
  revalidatePath("/categories")
  return { success: true, category: data }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

  if (!profile?.is_admin) {
    return { success: false, error: "Unauthorized - Admin only" }
  }

  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting category:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/categories")
  revalidatePath("/categories")
  return { success: true }
}
