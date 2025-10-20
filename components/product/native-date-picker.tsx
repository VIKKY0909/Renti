"use client"

import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface NativeDatePickerProps {
  label: string
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function NativeDatePicker({ 
  label, 
  date, 
  setDate, 
  disabled = false,
  placeholder = "Pick a date",
  className 
}: NativeDatePickerProps) {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value) {
      setDate(new Date(value))
    } else {
      setDate(undefined)
    }
  }

  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return ""
    return date.toISOString().split('T')[0]
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={`native-date-picker-${label.toLowerCase().replace(/\s+/g, '-')}`}>
        {label}
      </Label>
      
      <div className="relative">
        <input
          id={`native-date-picker-${label.toLowerCase().replace(/\s+/g, '-')}`}
          type="date"
          value={formatDateForInput(date)}
          onChange={handleDateChange}
          min={getMinDate()}
          disabled={disabled}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            "pr-10" // Make room for calendar icon
          )}
        />
        <CalendarIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  )
}




