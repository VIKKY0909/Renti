"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface SimpleDatePickerProps {
  label: string
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function SimpleDatePicker({ 
  label, 
  date, 
  setDate, 
  disabled = false,
  placeholder = "Pick a date",
  className 
}: SimpleDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Generate next 30 days
  const generateDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate)
    setIsOpen(false)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={`simple-date-picker-${label.toLowerCase().replace(/\s+/g, '-')}`}>
        {label}
      </Label>
      
      <div className="relative">
        <Button
          id={`simple-date-picker-${label.toLowerCase().replace(/\s+/g, '-')}`}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-transparent",
            !date && "text-muted-foreground"
          )}
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatDate(date) : <span>{placeholder}</span>}
        </Button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
              <div className="p-2">
                <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                  Select a date
                </div>
                {generateDates().map((dateOption, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                      date && date.getTime() === dateOption.getTime() && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => handleDateSelect(dateOption)}
                  >
                    {formatDate(dateOption)}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}




