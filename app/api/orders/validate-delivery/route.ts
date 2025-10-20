import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { isValidPincode, getCityFromPincode } from "@/lib/utils/pincode-validation"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { addressId } = await request.json()

    if (!addressId) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 }
      )
    }

    // Get the address
    const { data: address, error: addressError } = await supabase
      .from("user_addresses")
      .select("*")
      .eq("id", addressId)
      .eq("user_id", user.id)
      .single()

    if (addressError || !address) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      )
    }

    // Validate pincode
    const isValid = isValidPincode(address.pincode)
    const city = getCityFromPincode(address.pincode)

    if (!isValid) {
      return NextResponse.json({
        valid: false,
        error: `Delivery is not available in ${address.city} (${address.pincode}). Our service is currently available only in Khargone MP and Indore MP areas.`,
        city: address.city,
        pincode: address.pincode
      })
    }

    return NextResponse.json({
      valid: true,
      city,
      pincode: address.pincode,
      message: `Delivery available in ${city}!`
    })

  } catch (error) {
    console.error("Error validating delivery:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
