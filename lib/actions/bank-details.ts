"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getBankDetails() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { bankDetails: null, error: "Unauthorized" }
  }

  const { data, error } = await supabase.from("bank_details").select("*").eq("user_id", user.id).single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "not found" error
    console.error("[v0] Error fetching bank details:", error)
    return { bankDetails: null, error: error.message }
  }

  return { bankDetails: data, error: null }
}

export async function updateBankDetails(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  const bankData = {
    user_id: user.id,
    account_holder_name: formData.get("account_holder_name") as string,
    account_number: formData.get("account_number") as string,
    ifsc_code: formData.get("ifsc_code") as string,
    bank_name: formData.get("bank_name") as string,
    branch_name: formData.get("branch_name") as string,
  }

  const { data, error } = await supabase.from("bank_details").upsert(bankData).select().single()

  if (error) {
    console.error("[v0] Error saving bank details:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/profile/earnings")
  return { success: true, bankDetails: data }
}
