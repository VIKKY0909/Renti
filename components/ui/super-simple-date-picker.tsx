"use client"

import { useState } from "react"
import { format, addDays, differenceInDays } from "date-fns"
import { Calendar, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface SuperSimpleDatePickerProps {
  startDate?: Date
  endDate?: Date
  onDateChange: (startDate: Date | undefined, endDate: Date | undefined) => void
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  className?: string
}

export function SuperSimpleDatePicker({
  startDate,
  endDate,
  onDateChange,
  minDate = new Date(),
  maxDate = addDays(new Date(), 365),
  disabled = false,
  className
}: SuperSimpleDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(startDate)
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(endDate)

  const handleStartDateChange = (value: string) => {
    if (value) {
      const date = new Date(value)
      setTempStartDate(date)
    } else {
      setTempStartDate(undefined)
    }
  }

  const handleEndDateChange = (value: string) => {
    if (value) {
      const date = new Date(value)
      setTempEndDate(date)
    } else {
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

  const formatInputDate = (date: Date) => {
    return format(date, 'yyyy-MM-dd')
  }

  const getMinDate = () => {
    return formatInputDate(minDate)
  }

  const getMaxDate = () => {
    return formatInputDate(maxDate)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-12 px-4",
              !startDate && !endDate && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed",
              "border-2 hover:border-primary/50 transition-colors"
            )}
            disabled={disabled}
          >
            <Calendar className="mr-3 h-4 w-4" />
            {startDate && endDate ? (
              <div className="flex items-center gap-2 flex-1">
                <span className="font-medium">{formatDate(startDate)}</span>
                <span className="text-muted-foreground">to</span>
                <span className="font-medium">{formatDate(endDate)}</span>
                {getDuration() && (
                  <span className="ml-auto text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {getDuration()}
                  </span>
                )}
              </div>
            ) : (
              <span>Select rental dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-6" align="start">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-lg">Select Rental Dates</h4>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Clear
              </Button>
            </div>
            
            {/* Date Inputs */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date" className="text-sm font-medium">
                  Start Date (Delivery)
                </Label>
                <Input
                  id="start-date"
                  type="date"
                  value={tempStartDate ? formatInputDate(tempStartDate) : ""}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className="h-10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end-date" className="text-sm font-medium">
                  End Date (Return)
                </Label>
                <Input
                  id="end-date"
                  type="date"
                  value={tempEndDate ? formatInputDate(tempEndDate) : ""}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  min={tempStartDate ? formatInputDate(tempStartDate) : getMinDate()}
                  max={getMaxDate()}
                  className="h-10"
                />
              </div>
            </div>

            {/* Selection Summary */}
            {tempStartDate && tempEndDate && (
              <div className="p-4 bg-muted/50 rounded-lg border">
                <div className="text-sm font-medium mb-1">Selected Duration</div>
                <div className="text-sm text-muted-foreground mb-2">
                  {formatDate(tempStartDate)} to {formatDate(tempEndDate)}
                </div>
                <div className="text-sm font-semibold text-primary flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  {getDuration()}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={handleApply} 
                className="flex-1" 
                disabled={!tempStartDate || !tempEndDate}
              >
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
