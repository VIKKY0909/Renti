"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface DebugDatePickerProps {
  label: string
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function DebugDatePicker({ 
  label, 
  date, 
  setDate, 
  disabled = false,
  placeholder = "Pick a date",
  className 
}: DebugDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleButtonClick = () => {
    console.log("Date picker button clicked!")
    setIsOpen(!isOpen)
  }

  const handleDateSelect = (selectedDate: Date) => {
    console.log("Date selected:", selectedDate)
    setDate(selectedDate)
    setIsOpen(false)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={`debug-date-picker-${label.toLowerCase().replace(/\s+/g, '-')}`}>
        {label}
      </Label>
      
      <div className="space-y-2">
        <Button
          id={`debug-date-picker-${label.toLowerCase().replace(/\s+/g, '-')}`}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-transparent",
            !date && "text-muted-foreground"
          )}
          disabled={disabled}
          onClick={handleButtonClick}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? date.toLocaleDateString() : <span>{placeholder}</span>}
        </Button>

        {isOpen && (
          <div className="border border-border rounded-md p-4 bg-popover">
            <div className="text-sm font-medium mb-3">Quick Date Selection</div>
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 14 }, (_, i) => {
                const date = new Date()
                date.setDate(date.getDate() + i)
                return (
                  <button
                    key={i}
                    className={cn(
                      "text-xs px-2 py-1 rounded border text-left hover:bg-accent",
                      date.getTime() === date?.getTime() && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => handleDateSelect(date)}
                  >
                    {date.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Debug info */}
        <div className="text-xs text-muted-foreground">
          Current date: {date ? date.toISOString() : "None"} | 
          Open: {isOpen ? "Yes" : "No"}
        </div>
      </div>
    </div>
  )
}




