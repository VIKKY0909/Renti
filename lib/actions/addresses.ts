"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface Address {
  id: string
  user_id: string
  address_type: "home" | "work" | "other"
  full_name: string
  phone: string
  address_line_1: string
  address_line_2?: string
  city: string
  state: string
  pincode: string
  landmark?: string
  instructions?: string
  is_default: boolean
  created_at: string
  updated_at: string
}

// Export as UserAddress for backward compatibility
export type UserAddress = Address

export async function getUserAddresses() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { addresses: [], error: "Unauthorized" }
  }

  const { data, error } = await supabase
    .from("user_addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching addresses:", error)
    return { addresses: [], error: error.message }
  }

  return { addresses: data || [], error: null }
}

export async function createAddress(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  const addressType = (formData.get("address_type") || formData.get("type")) as "home" | "work" | "other"
  const fullName = (formData.get("full_name") || formData.get("name")) as string
  const phone = formData.get("phone") as string
  const addressLine1 = formData.get("address_line_1") as string
  const addressLine2 = formData.get("address_line_2") as string
  const city = formData.get("city") as string
  const state = formData.get("state") as string
  const pincode = formData.get("pincode") as string
  const landmark = formData.get("landmark") as string
  const instructions = formData.get("instructions") as string
  const isDefault = formData.get("is_default") === "true"

  // Validate required fields
  if (!addressType || !fullName || !phone || !addressLine1 || !city || !state || !pincode) {
    return { success: false, error: "Please fill in all required fields" }
  }

  // If this is being set as default, unset other default addresses
  if (isDefault) {
    await supabase
      .from("user_addresses")
      .update({ is_default: false })
      .eq("user_id", user.id)
  }

  const { data, error } = await supabase
    .from("user_addresses")
    .insert({
      user_id: user.id,
      address_type: addressType,
      full_name: fullName,
      phone,
      address_line_1: addressLine1,
      address_line_2: addressLine2 || null,
      city,
      state,
      pincode,
      landmark: landmark || null,
      instructions: instructions || null,
      is_default: isDefault,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating address:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/profile")
  return { success: true, address: data }
}

export async function updateAddress(addressId: string, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  const addressType = (formData.get("address_type") || formData.get("type")) as "home" | "work" | "other"
  const fullName = (formData.get("full_name") || formData.get("name")) as string
  const phone = formData.get("phone") as string
  const addressLine1 = formData.get("address_line_1") as string
  const addressLine2 = formData.get("address_line_2") as string
  const city = formData.get("city") as string
  const state = formData.get("state") as string
  const pincode = formData.get("pincode") as string
  const landmark = formData.get("landmark") as string
  const instructions = formData.get("instructions") as string
  const isDefault = formData.get("is_default") === "true"

  // Validate required fields
  if (!addressType || !fullName || !phone || !addressLine1 || !city || !state || !pincode) {
    return { success: false, error: "Please fill in all required fields" }
  }

  // If this is being set as default, unset other default addresses
  if (isDefault) {
    await supabase
      .from("user_addresses")
      .update({ is_default: false })
      .eq("user_id", user.id)
      .neq("id", addressId)
  }

  const { data, error } = await supabase
    .from("user_addresses")
    .update({
      address_type: addressType,
      full_name: fullName,
      phone,
      address_line_1: addressLine1,
      address_line_2: addressLine2 || null,
      city,
      state,
      pincode,
      landmark: landmark || null,
      instructions: instructions || null,
      is_default: isDefault,
      updated_at: new Date().toISOString(),
    })
    .eq("id", addressId)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating address:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/profile")
  return { success: true, address: data }
}

export async function deleteAddress(addressId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  const { error } = await supabase
    .from("user_addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error deleting address:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/profile")
  return { success: true }
}

export async function setDefaultAddress(addressId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  // First unset all default addresses
  await supabase
    .from("user_addresses")
    .update({ is_default: false })
    .eq("user_id", user.id)

  // Then set the selected one as default
  const { error } = await supabase
    .from("user_addresses")
    .update({ is_default: true })
    .eq("id", addressId)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error setting default address:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/profile")
  return { success: true }
}

export async function getDefaultAddress() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { address: null, error: "Unauthorized" }
  }

  const { data, error } = await supabase
    .from("user_addresses")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_default", true)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching default address:", error)
    return { address: null, error: error.message }
  }

  return { address: data || null, error: null }
}

export async function checkUserHasAddress() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { hasAddress: false, error: "Unauthorized" }
  }

  const { count, error } = await supabase
    .from("user_addresses")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  if (error) {
    console.error("Error checking user addresses:", error)
    return { hasAddress: false, error: error.message }
  }

  return { hasAddress: (count || 0) > 0, error: null }
}