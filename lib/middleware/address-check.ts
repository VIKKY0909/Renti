"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function requireAddress() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Check if user has an address
  const { data: addresses } = await supabase
    .from("user_addresses")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)

  if (!addresses || addresses.length === 0) {
    redirect("/profile?tab=addresses&require=true")
  }
}

export async function checkAddressAndRedirect(redirectPath: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  // Check if user has an address
  const { data: addresses } = await supabase
    .from("user_addresses")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)

  if (!addresses || addresses.length === 0) {
    redirect(`/profile?tab=addresses&require=true&redirect=${encodeURIComponent(redirectPath)}`)
  }

  return true
}




