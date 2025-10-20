"use client"

import { useState, useEffect } from "react"
import { format, addDays, isBefore, isAfter, startOfDay } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface AvailabilityDatePickerProps {
  label: string
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  disabled?: boolean
  placeholder?: string
  className?: string
  product?: {
    available_from?: string
    available_until?: string
    owner_id?: string
  }
  currentUser?: {
    id?: string
    is_admin?: boolean
  }
  unavailableDates?: string[] // Dates when product is already rented
}

export function AvailabilityDatePicker({ 
  label, 
  date, 
  setDate, 
  disabled = false,
  placeholder = "Pick a date",
  className,
  product,
  currentUser,
  unavailableDates = []
}: AvailabilityDatePickerProps) {
  const [open, setOpen] = useState(false)

  // Check if user is owner or admin (they can see all dates)
  const isOwnerOrAdmin = currentUser && (
    currentUser.is_admin || 
    (product?.owner_id && currentUser.id === product.owner_id)
  )

  // Get disabled dates based on availability and existing rentals
  const getDisabledDates = (date: Date) => {
    const today = startOfDay(new Date())
    
    // Disable past dates
    if (isBefore(date, today)) {
      return true
    }

    // If user is owner or admin, don't disable any other dates
    if (isOwnerOrAdmin) {
      return false
    }

    // Check if date is before available_from (with 1 day buffer)
    if (product?.available_from) {
      const availableFrom = addDays(new Date(product.available_from), -1)
      if (isBefore(date, availableFrom)) {
        return true
      }
    }

    // Check if date is after available_until (with 1 day buffer)
    if (product?.available_until) {
      const availableUntil = addDays(new Date(product.available_until), 1)
      if (isAfter(date, availableUntil)) {
        return true
      }
    }

    // Check if date is in unavailable dates (already rented)
    const dateString = format(date, 'yyyy-MM-dd')
    if (unavailableDates.includes(dateString)) {
      return true
    }

    return false
  }

  // Get minimum date for selection
  const getMinDate = () => {
    const today = startOfDay(new Date())
    
    if (isOwnerOrAdmin) {
      return today
    }

    if (product?.available_from) {
      const availableFrom = addDays(new Date(product.available_from), -1)
      return isAfter(availableFrom, today) ? availableFrom : today
    }

    return today
  }

  // Get maximum date for selection
  const getMaxDate = () => {
    if (isOwnerOrAdmin || !product?.available_until) {
      return addDays(new Date(), 365) // 1 year from now
    }

    return addDays(new Date(product.available_until), 1)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={`date-picker-${label.toLowerCase().replace(/\s+/g, '-')}`}>
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              setDate(selectedDate)
              setOpen(false)
            }}
            disabled={getDisabledDates}
            initialFocus
            fromDate={getMinDate()}
            toDate={getMaxDate()}
          />
        </PopoverContent>
      </Popover>
      
      {/* Show availability info for non-owners */}
      {!isOwnerOrAdmin && product && (
        <div className="text-xs text-muted-foreground">
          {product.available_from && product.available_until ? (
            <p>
              Available: {format(new Date(product.available_from), "MMM dd")} - {format(new Date(product.available_until), "MMM dd, yyyy")}
            </p>
          ) : product.available_from ? (
            <p>
              Available from: {format(new Date(product.available_from), "MMM dd, yyyy")}
            </p>
          ) : (
            <p>Available for booking</p>
          )}
        </div>
      )}
    </div>
  )
}




