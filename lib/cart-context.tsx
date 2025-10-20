"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

interface CartItem {
  productId: string
  title: string
  image: string
  rentalPrice: number
  securityDeposit: number
  rentalStartDate: string
  rentalEndDate: string
  rentalDays: number
  selectedSize?: string
  deliveryPincode?: string
  deliveryCity?: string
  deliveryAddressId?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateItem: (productId: string, updates: Partial<CartItem>) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalDeposit: () => number
  getGrandTotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  // Remove localStorage effects for faster navigation

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      // Check if item already exists
      const existingIndex = prev.findIndex((i) => i.productId === item.productId)
      if (existingIndex >= 0) {
        // Update existing item
        const newItems = [...prev]
        newItems[existingIndex] = item
        return newItems
      }
      // Add new item
      return [...prev, item]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId))
  }

  const updateItem = (productId: string, updates: Partial<CartItem>) => {
    setItems((prev) => prev.map((item) => (item.productId === productId ? { ...item, ...updates } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.rentalPrice * item.rentalDays, 0)
  }

  const getTotalDeposit = () => {
    return items.reduce((total, item) => total + item.securityDeposit, 0)
  }

  const getGrandTotal = () => {
    return getTotalPrice() + getTotalDeposit()
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItem,
        clearCart,
        getTotalPrice,
        getTotalDeposit,
        getGrandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
