"use server"

import { createClient } from "@/lib/supabase/server"

export async function getOwnerEarnings() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { earnings: [], stats: null, error: "Unauthorized" }
  }

  const { data: earnings, error } = await supabase
    .from("earnings")
    .select(
      `
      *,
      order:orders(
        id,
        rental_start_date,
        rental_end_date,
        product:products(title, images)
      )
    `,
    )
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching earnings:", error)
    return { earnings: [], stats: null, error: error.message }
  }

  // Calculate stats
  const stats = {
    totalEarnings: earnings?.reduce((sum, e) => sum + Number(e.amount), 0) || 0,
    pendingEarnings: earnings?.filter((e) => e.status === "pending").reduce((sum, e) => sum + Number(e.amount), 0) || 0,
    paidEarnings: earnings?.filter((e) => e.status === "paid").reduce((sum, e) => sum + Number(e.amount), 0) || 0,
    processingEarnings:
      earnings?.filter((e) => e.status === "processing").reduce((sum, e) => sum + Number(e.amount), 0) || 0,
  }

  return { earnings: earnings || [], stats, error: null }
}

export async function requestPayout(earningIds: string[]) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  // Check if user has bank details
  const { data: bankDetails } = await supabase.from("bank_details").select("*").eq("user_id", user.id).single()

  if (!bankDetails) {
    return { success: false, error: "Please add your bank details first" }
  }

  // Update earnings status to processing
  const { error } = await supabase
    .from("earnings")
    .update({ status: "processing" })
    .in("id", earningIds)
    .eq("owner_id", user.id)
    .eq("status", "pending")

  if (error) {
    console.error("[v0] Error requesting payout:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
