"use server"

import { createClient } from "@/lib/supabase/server"
import { format, addDays, isBefore, isAfter } from "date-fns"

export interface AvailabilityInfo {
  isAvailable: boolean
  unavailableDates: string[]
  nextAvailableDate?: string
  reason?: string
}

export async function checkProductAvailability(
  productId: string,
  startDate?: string,
  endDate?: string,
  userId?: string
): Promise<AvailabilityInfo> {
  const supabase = await createClient()

  try {
    // Get product details
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("available_from, available_until, is_available, status, owner_id")
      .eq("id", productId)
      .single()

    if (productError || !product) {
      return {
        isAvailable: false,
        unavailableDates: [],
        reason: "Product not found"
      }
    }

    // Check if user is trying to rent their own product
    if (userId && product.owner_id === userId) {
      return {
        isAvailable: false,
        unavailableDates: [],
        reason: "You cannot rent your own products"
      }
    }

    // Check if product is available for rental
    if (!product.is_available || product.status !== 'approved') {
      return {
        isAvailable: false,
        unavailableDates: [],
        reason: "Product is not available for rental"
      }
    }

    // Check if rental dates are within product availability period
    if (startDate && endDate) {
      const rentalStart = new Date(startDate)
      const rentalEnd = new Date(endDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Check if rental start is in the past
      if (rentalStart < today) {
        return {
          isAvailable: false,
          unavailableDates: [],
          reason: "Rental start date cannot be in the past"
        }
      }

      // Check if rental dates are within product availability period
      if (product.available_from && rentalStart < new Date(product.available_from)) {
        return {
          isAvailable: false,
          unavailableDates: [],
          reason: `Rental can only start from ${new Date(product.available_from).toLocaleDateString()}`
        }
      }

      if (product.available_until && rentalEnd > new Date(product.available_until)) {
        return {
          isAvailable: false,
          unavailableDates: [],
          reason: `Rental cannot extend beyond ${new Date(product.available_until).toLocaleDateString()}`
        }
      }
    }

    // Get all existing orders for this product
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("rental_start_date, rental_end_date, status")
      .eq("product_id", productId)
      .in("status", ["pending", "confirmed", "picked_up", "dispatched", "delivered", "picked_up_for_return"])

    if (ordersError) {
      console.error("Error fetching orders:", ordersError)
      return {
        isAvailable: false,
        unavailableDates: [],
        reason: "Error checking availability"
      }
    }

    // Generate list of unavailable dates
    const unavailableDates: string[] = []
    const today = new Date()

    // Add dates from existing orders
    orders?.forEach(order => {
      const start = new Date(order.rental_start_date)
      const end = new Date(order.rental_end_date)
      
      let current = new Date(start)
      while (current <= end) {
        unavailableDates.push(format(current, 'yyyy-MM-dd'))
        current = addDays(current, 1)
      }
    })

    // If checking specific dates
    if (startDate && endDate) {
      const requestedStart = new Date(startDate)
      const requestedEnd = new Date(endDate)

      // Check if any requested dates are unavailable
      let current = new Date(requestedStart)
      while (current <= requestedEnd) {
        const dateString = format(current, 'yyyy-MM-dd')
        
        if (unavailableDates.includes(dateString)) {
          return {
            isAvailable: false,
            unavailableDates,
            reason: `Product is already rented on ${format(current, 'MMM dd, yyyy')}`
          }
        }
        
        current = addDays(current, 1)
      }

      // Check availability window
      if (product.available_from) {
        const availableFrom = new Date(product.available_from)
        if (isBefore(requestedStart, addDays(availableFrom, -1))) {
          return {
            isAvailable: false,
            unavailableDates,
            reason: `Product is not available until ${format(availableFrom, 'MMM dd, yyyy')}`
          }
        }
      }

      if (product.available_until) {
        const availableUntil = new Date(product.available_until)
        if (isAfter(requestedEnd, addDays(availableUntil, 1))) {
          return {
            isAvailable: false,
            unavailableDates,
            reason: `Product is not available after ${format(availableUntil, 'MMM dd, yyyy')}`
          }
        }
      }

      return {
        isAvailable: true,
        unavailableDates
      }
    }

    return {
      isAvailable: true,
      unavailableDates
    }

  } catch (error) {
    console.error("Error checking product availability:", error)
    return {
      isAvailable: false,
      unavailableDates: [],
      reason: "Error checking availability"
    }
  }
}

export async function getProductUnavailableDates(productId: string): Promise<string[]> {
  const availability = await checkProductAvailability(productId)
  return availability.unavailableDates
}

export async function getNextAvailableDate(productId: string): Promise<string | null> {
  const supabase = await createClient()

  try {
    // Get product details
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("available_from, available_until, is_available, status")
      .eq("id", productId)
      .single()

    if (productError || !product || !product.is_available || product.status !== 'approved') {
      return null
    }

    // Get all existing orders
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("rental_start_date, rental_end_date, status")
      .eq("product_id", productId)
      .in("status", ["pending", "confirmed", "picked_up", "dispatched", "delivered", "picked_up_for_return"])
      .order("rental_start_date", { ascending: true })

    if (ordersError || !orders || orders.length === 0) {
      return product.available_from || format(new Date(), 'yyyy-MM-dd')
    }

    // Find the first available date after the last order
    const today = new Date()
    const lastOrderEnd = new Date(orders[orders.length - 1].rental_end_date)
    const nextAvailable = addDays(lastOrderEnd, 1)

    // Make sure it's not in the past
    const finalDate = isAfter(nextAvailable, today) ? nextAvailable : today

    return format(finalDate, 'yyyy-MM-dd')

  } catch (error) {
    console.error("Error getting next available date:", error)
    return null
  }
}
