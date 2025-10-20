"use client"

import { useState } from "react"
import { format, addDays, differenceInDays, isBefore, isAfter, startOfDay } from "date-fns"
import { Calendar, X } from "lucide-react"
import { DayPicker, DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import "react-day-picker/dist/style.css"

interface DateRangePickerProps {
  startDate?: Date
  endDate?: Date
  onDateChange: (startDate: Date | undefined, endDate: Date | undefined) => void
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  className?: string
}

export function DateRangePicker({
  startDate,
  endDate,
  onDateChange,
  minDate = new Date(),
  maxDate = addDays(new Date(), 365),
  disabled = false,
  className
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(startDate)
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(endDate)

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range?.from) {
      setTempStartDate(range.from)
      setTempEndDate(range.to)
    } else {
      setTempStartDate(undefined)
      setTempEndDate(undefined)
    }
  }

  const handleApply = () => {
    onDateChange(tempStartDate, tempEndDate)
    setIsOpen(false)
  }

  const handleClear = () => {
    setTempStartDate(undefined)
    setTempEndDate(undefined)
    onDateChange(undefined, undefined)
    setIsOpen(false)
  }

  const getDuration = () => {
    if (tempStartDate && tempEndDate) {
      const days = differenceInDays(tempEndDate, tempStartDate) + 1
      return `${days} day${days > 1 ? 's' : ''}`
    }
    return null
  }

  const formatDate = (date: Date) => {
    return format(date, 'MMM dd, yyyy')
  }

  const isDateDisabled = (date: Date) => {
    return isBefore(date, minDate) || isAfter(date, maxDate)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-12",
              !startDate && !endDate && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {startDate && endDate ? (
              <div className="flex items-center gap-2">
                <span>{formatDate(startDate)}</span>
                <span className="text-muted-foreground">to</span>
                <span>{formatDate(endDate)}</span>
                {getDuration() && (
                  <span className="ml-2 text-sm text-primary font-medium">
                    ({getDuration()})
                  </span>
                )}
              </div>
            ) : (
              "Select rental dates"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Select Rental Dates</h4>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <DayPicker
              mode="range"
              selected={{
                from: tempStartDate,
                to: tempEndDate
              }}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              numberOfMonths={2}
              fromMonth={minDate}
              toMonth={maxDate}
              className="rdp"
            />
            
            {tempStartDate && tempEndDate && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium">Selected Duration</div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(tempStartDate)} to {formatDate(tempEndDate)}
                </div>
                <div className="text-sm font-medium text-primary">
                  {getDuration()}
                </div>
              </div>
            )}
            
            <div className="flex gap-2 mt-4">
              <Button onClick={handleApply} className="flex-1">
                Apply Dates
              </Button>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
