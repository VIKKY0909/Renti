"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { isValidPincode, getCityFromPincode } from "@/lib/utils/pincode-validation"

export async function createOrder(formData: FormData) {
  const supabase = await createClient()

  console.log("[Order Creation] Starting order creation process...")

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("[Order Creation] User authenticated:", user?.id)

  if (!user) {
    console.error("[Order Creation] FAILED: No user authenticated")
    return { success: false, error: "Unauthorized" }
  }

  // Get delivery address ID from form data
  const deliveryAddressId = formData.get("delivery_address_id") as string
  console.log("[Order Creation] Delivery address ID:", deliveryAddressId)

  let deliveryAddress = null
  
  if (deliveryAddressId) {
    // Get specific delivery address
    const { data: address, error: addressError } = await supabase
      .from("user_addresses")
      .select("*")
      .eq("id", deliveryAddressId)
      .eq("user_id", user.id)
      .single()

    if (addressError || !address) {
      console.error("[Order Creation] FAILED: Invalid delivery address")
      return { success: false, error: "Invalid delivery address" }
    }

    deliveryAddress = address

    // Validate delivery pincode
    if (!isValidPincode(deliveryAddress.pincode)) {
      console.error("[Order Creation] FAILED: Delivery not available in", deliveryAddress.city, deliveryAddress.pincode)
      return { 
        success: false, 
        error: `Delivery is not available in ${deliveryAddress.city} (${deliveryAddress.pincode}). Our service is currently available only in Khargone MP and Indore MP areas.` 
      }
    }

    console.log("[Order Creation] Valid address found:", deliveryAddress.city, deliveryAddress.pincode)
  } else {
    // Check if user has any valid addresses
    const { data: addresses, error: addressError } = await supabase
      .from("user_addresses")
      .select("id, pincode, city")
      .eq("user_id", user.id)
      .limit(10)

    console.log("[Order Creation] Address check:", addresses?.length || 0)
    
    if (addressError || !addresses || addresses.length === 0) {
      console.error("[Order Creation] FAILED: User has no address")
      return { success: false, error: "Please add a delivery address before placing an order" }
    }

    // Check if any address is in service area
    const validAddress = addresses.find(addr => isValidPincode(addr.pincode))
    if (!validAddress) {
      console.error("[Order Creation] FAILED: No valid delivery addresses")
      return { 
        success: false, 
        error: "None of your addresses are in our service area. Our delivery is currently available only in Khargone MP and Indore MP areas. Please add a valid delivery address." 
      }
    }

    deliveryAddress = validAddress
    console.log("[Order Creation] Valid address found:", deliveryAddress.city, deliveryAddress.pincode)
  }

  const productId = formData.get("product_id") as string
  const rentalStartDate = formData.get("rental_start_date") as string
  const rentalEndDate = formData.get("rental_end_date") as string
  const selectedSize = formData.get("selected_size") as string
  const paymentMethod = (formData.get("payment_method") as string) || "cod"

  console.log("[Order Creation] Order params:", { productId, rentalStartDate, rentalEndDate, selectedSize, paymentMethod })

  // Get product details
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*, owner:profiles!products_owner_id_fkey(id)")
    .eq("id", productId)
    .single()

  if (productError || !product) {
    console.error("[Order Creation] FAILED: Product not found", productError)
    return { success: false, error: "Product not found" }
  }

  console.log("[Order Creation] Product details:", { 
    productId: product.id, 
    title: product.title,
    ownerId: product.owner.id,
    rentalPrice: product.rental_price,
    securityDeposit: product.security_deposit
  })

  // Prevent users from renting their own products
  console.log("[Order Creation] Ownership check - User:", user.id, "Owner:", product.owner.id)
  if (product.owner.id === user.id) {
    console.error("[Order Creation] BLOCKED: User trying to rent their own product")
    return { success: false, error: "You cannot rent your own products" }
  }

  // Check if product is already booked for these dates
  const { data: existingOrders, error: ordersError } = await supabase
    .from("orders")
    .select("id, rental_start_date, rental_end_date, status")
    .eq("product_id", productId)
    .in("status", ["pending", "confirmed", "picked_up", "dispatched", "delivered"])
    .neq("user_id", user.id) // Exclude current user's orders

  console.log("[Order Creation] Existing orders check:", existingOrders?.length || 0)

  if (ordersError) {
    console.error("[Order Creation] FAILED: Error checking existing orders", ordersError)
    return { success: false, error: "Error checking product availability" }
  }

  // Check for date conflicts
  const startDate = new Date(rentalStartDate)
  const endDate = new Date(rentalEndDate)

  if (existingOrders && existingOrders.length > 0) {
    for (const order of existingOrders) {
      const orderStart = new Date(order.rental_start_date)
      const orderEnd = new Date(order.rental_end_date)

      // Check if dates overlap
      if ((startDate <= orderEnd && endDate >= orderStart)) {
        console.error("[Order Creation] FAILED: Date conflict with order", order.id)
        return { 
          success: false, 
          error: `This product is already booked from ${orderStart.toLocaleDateString()} to ${orderEnd.toLocaleDateString()}. Please select different dates.` 
        }
      }
    }
  }

  console.log("[Order Creation] No date conflicts found")

  // Calculate rental days
  const start = new Date(rentalStartDate)
  const end = new Date(rentalEndDate)
  const rentalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

  // Calculate total
  const rentalPrice = product.rental_price * rentalDays
  const securityDeposit = product.security_deposit
  const discount = 0 // Can add discount logic here
  const totalAmount = rentalPrice + securityDeposit - discount

  const orderData = {
    user_id: user.id,
    product_id: productId,
    owner_id: product.owner.id,
    rental_start_date: rentalStartDate,
    rental_end_date: rentalEndDate,
    rental_days: rentalDays,
    rental_price: rentalPrice,
    security_deposit: securityDeposit,
    discount,
    total_amount: totalAmount,
    selected_size: selectedSize,
    delivery_address_id: deliveryAddress?.id || null,
    status: "pending",
    payment_status: "pending",
    payment_method: paymentMethod,
  }

  console.log("[Order Creation] Order data to insert:", orderData)

  const { data, error } = await supabase.from("orders").insert(orderData).select().single()

  if (error) {
    console.error("[Order Creation] FAILED: Database insert error", error)
    console.error("[Order Creation] Error details:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
    return { success: false, error: error.message }
  }

  console.log("[Order Creation] SUCCESS: Order created", data.id)

  revalidatePath("/profile/orders")
  return { success: true, order: data }
}

export async function createMultiItemOrder(formData: FormData) {
  const supabase = await createClient()

  console.log("[Multi-Item Order] Starting order creation process...")

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("[Multi-Item Order] User authenticated:", user?.id)

  if (!user) {
    console.error("[Multi-Item Order] FAILED: No user authenticated")
    return { success: false, error: "Unauthorized" }
  }

  // Get delivery address ID
  const deliveryAddressId = formData.get("delivery_address_id") as string
  console.log("[Multi-Item Order] Delivery address ID:", deliveryAddressId)

  if (!deliveryAddressId) {
    console.error("[Multi-Item Order] FAILED: No delivery address selected")
    return { success: false, error: "Please select a delivery address" }
  }

  // Verify address belongs to user
  const { data: addressCheck, error: addressError } = await supabase
    .from("user_addresses")
    .select("id")
    .eq("id", deliveryAddressId)
    .eq("user_id", user.id)
    .single()

  if (addressError || !addressCheck) {
    console.error("[Multi-Item Order] FAILED: Invalid address", addressError)
    return { success: false, error: "Invalid delivery address" }
  }

  console.log("[Multi-Item Order] Address verified ✓")

  // Parse items from JSON
  const itemsJson = formData.get("items") as string
  const paymentMethod = (formData.get("payment_method") as string) || "cod"
  
  console.log("[Multi-Item Order] Payment method:", paymentMethod)
  console.log("[Multi-Item Order] Items JSON:", itemsJson)

  let items: any[]
  try {
    items = JSON.parse(itemsJson)
    console.log("[Multi-Item Order] Parsed items count:", items.length)
  } catch (e) {
    console.error("[Multi-Item Order] FAILED: Invalid items data", e)
    return { success: false, error: "Invalid order data" }
  }

  if (!items || items.length === 0) {
    console.error("[Multi-Item Order] FAILED: No items in order")
    return { success: false, error: "No items in order" }
  }

  const ordersToInsert = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    console.log(`[Multi-Item Order] Processing item ${i + 1}/${items.length}:`, {
      productId: item.productId,
      title: item.title,
      rentalDays: item.rentalDays
    })

    // Get product details
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*, owner:profiles!products_owner_id_fkey(id)")
      .eq("id", item.productId)
      .single()

    if (productError || !product) {
      console.error(`[Multi-Item Order] FAILED: Product not found for item ${i + 1}`, productError)
      return { success: false, error: `Product "${item.title}" not found` }
    }

    console.log(`[Multi-Item Order] Product details - Owner: ${product.owner.id}, Price: ${product.rental_price}`)

    // Prevent users from renting their own products
    if (product.owner.id === user.id) {
      console.error(`[Multi-Item Order] BLOCKED: User trying to rent own product: ${product.title}`)
      return { success: false, error: `You cannot rent your own product: "${product.title}"` }
    }

    // Check availability using our custom function
    const { checkProductAvailability } = await import("./availability")
    const availability = await checkProductAvailability(
      item.productId,
      item.rentalStartDate,
      item.rentalEndDate,
      user.id
    )

    console.log(`[Multi-Item Order] Availability check for ${product.title}:`, availability)

    if (!availability.isAvailable) {
      console.error(`[Multi-Item Order] FAILED: Product not available - ${product.title}`, availability.reason)
      return { 
        success: false, 
        error: `Product "${product.title}" - ${availability.reason || "not available for selected dates"}` 
      }
    }

    // Calculate total for this item
    const itemRentalPrice = item.rentalPrice
    const itemTotalAmount = item.rentalPrice + item.securityDeposit

    console.log(`[Multi-Item Order] Order item ${i + 1} prepared:`, {
      rentalPrice: itemRentalPrice,
      securityDeposit: item.securityDeposit,
      total: itemTotalAmount
    })

    ordersToInsert.push({
      user_id: user.id,
      product_id: item.productId,
      owner_id: product.owner.id,
      rental_start_date: item.rentalStartDate,
      rental_end_date: item.rentalEndDate,
      rental_days: item.rentalDays,
      rental_price: itemRentalPrice,
      security_deposit: item.securityDeposit,
      discount: 0,
      total_amount: itemTotalAmount,
      selected_size: item.selectedSize,
      status: "pending",
      payment_status: "paid",
      payment_method: paymentMethod,
      delivery_address_id: deliveryAddressId, // ← CRITICAL FIX: Added this!
    })
  }

  console.log(`[Multi-Item Order] Attempting to insert ${ordersToInsert.length} orders...`)
  console.log("[Multi-Item Order] Order data sample:", JSON.stringify(ordersToInsert[0], null, 2))

  const { data, error } = await supabase.from("orders").insert(ordersToInsert).select()

  if (error) {
    console.error("[Multi-Item Order] DATABASE ERROR:", error)
    console.error("[Multi-Item Order] Error details:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
    return { success: false, error: error.message }
  }

  console.log("[Multi-Item Order] ✓✓✓ SUCCESS! Orders created:", data?.length)
  console.log("[Multi-Item Order] Order IDs:", data?.map(o => o.id))

  revalidatePath("/profile/orders")
  return { success: true, orders: data }
}

export async function getUserOrders() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("getUserOrders - User:", user?.id)

  if (!user) {
    return { orders: [], error: "Unauthorized" }
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      product:products(
        id,
        title,
        images,
        category:categories!products_category_id_fkey(name)
      ),
      owner:profiles!orders_owner_id_fkey(id, full_name, phone)
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching orders:", error)
    return { orders: [], error: error.message }
  }

  console.log("getUserOrders - Found orders:", data?.length || 0)
  return { orders: data || [], error: null }
}

export async function getOwnerOrders() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { orders: [], error: "Unauthorized" }
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      product:products(
        id,
        title,
        images,
        category:categories!products_category_id_fkey(name)
      ),
      user:profiles!orders_user_id_fkey(id, full_name, phone, city, state)
    `,
    )
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching owner orders:", error)
    return { orders: [], error: error.message }
  }

  return { orders: data || [], error: null }
}

export async function getOrderById(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { order: null, error: "Unauthorized" }
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      product:products(
        *,
        category:categories!products_category_id_fkey(name, slug)
      ),
      owner:profiles!orders_owner_id_fkey(id, full_name, phone, email, city, state),
      user:profiles!orders_user_id_fkey(id, full_name, phone, email, city, state, pincode)
    `,
    )
    .eq("id", id)
    .single()

  if (error) {
    console.error("[v0] Error fetching order:", error)
    return { order: null, error: error.message }
  }

  // Check if user has access to this order
  if (data.user_id !== user.id && data.owner_id !== user.id) {
    return { order: null, error: "Unauthorized" }
  }

  return { order: data, error: null }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  // Get order to check ownership
  const { data: order } = await supabase.from("orders").select("owner_id, user_id").eq("id", orderId).single()

  if (!order) {
    return { success: false, error: "Order not found" }
  }

  // Only owner or user can update status
  if (order.owner_id !== user.id && order.user_id !== user.id) {
    return { success: false, error: "Unauthorized" }
  }

  const { data, error } = await supabase.from("orders").update({ status }).eq("id", orderId).select().single()

  if (error) {
    console.error("[v0] Error updating order status:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/profile/orders")
  revalidatePath(`/orders/${orderId}`)
  return { success: true, order: data }
}

export async function updatePaymentStatus(orderId: string, paymentStatus: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ payment_status: paymentStatus })
    .eq("id", orderId)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("[v0] Error updating payment status:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/profile/orders")
  revalidatePath(`/orders/${orderId}`)
  return { success: true, order: data }
}

export async function cancelOrder(orderId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("[v0] Error cancelling order:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/profile/orders")
  return { success: true, order: data }
}
