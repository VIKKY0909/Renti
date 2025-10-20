"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  label: string
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function DatePicker({ 
  label, 
  date, 
  setDate, 
  disabled = false,
  placeholder = "Pick a date",
  className 
}: DatePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={`date-picker-${label.toLowerCase().replace(/\s+/g, '-')}`}>
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={`date-picker-${label.toLowerCase().replace(/\s+/g, '-')}`}
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal bg-transparent",
              !date && "text-muted-foreground"
            )}
            disabled={disabled}
            onClick={() => setOpen(!open)}
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
              setOpen(false) // Close popover after selection
            }}
            initialFocus
            disabled={(date) => {
              // Disable past dates
              return date < new Date(new Date().setHours(0, 0, 0, 0))
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
