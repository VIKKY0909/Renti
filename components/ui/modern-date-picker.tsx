"use client"

import { useState } from "react"
import { format, addDays, differenceInDays, isBefore, isAfter } from "date-fns"
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface ModernDatePickerProps {
  startDate?: Date
  endDate?: Date
  onDateChange: (startDate: Date | undefined, endDate: Date | undefined) => void
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  className?: string
}

export function ModernDatePicker({
  startDate,
  endDate,
  onDateChange,
  minDate = new Date(),
  maxDate = addDays(new Date(), 365),
  disabled = false,
  className
}: ModernDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(startDate)
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(endDate)

  const handleDateSelect = (date: Date) => {
    if (isBefore(date, minDate) || isAfter(date, maxDate)) {
      return // Don't select disabled dates
    }

    // If no start date selected, or if start date is after the selected date, set as start date
    if (!tempStartDate || isAfter(tempStartDate, date)) {
      setTempStartDate(date)
      setTempEndDate(undefined)
    } 
    // If start date exists and selected date is after start date, set as end date
    else if (isAfter(date, tempStartDate)) {
      setTempEndDate(date)
    }
    // If same date is selected, clear selection
    else if (tempStartDate && format(date, 'yyyy-MM-dd') === format(tempStartDate, 'yyyy-MM-dd')) {
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

  const isDateInRange = (date: Date) => {
    if (!tempStartDate || !tempEndDate) return false
    return date >= tempStartDate && date <= tempEndDate
  }

  const isDateStart = (date: Date) => {
    return tempStartDate && format(date, 'yyyy-MM-dd') === format(tempStartDate, 'yyyy-MM-dd')
  }

  const isDateEnd = (date: Date) => {
    return tempEndDate && format(date, 'yyyy-MM-dd') === format(tempEndDate, 'yyyy-MM-dd')
  }

  // Generate calendar days
  const generateCalendarDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const current = new Date(startDate)
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return days
  }

  const currentDate = new Date()
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth())
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear())

  const calendarDays = generateCalendarDays(currentYear, currentMonth)
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    }
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
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-semibold text-lg">Select Rental Dates</h4>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Calendar Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-semibold text-base">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {/* Day headers */}
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {calendarDays.map((date, index) => {
                const isCurrentMonth = date.getMonth() === currentMonth
                const isDisabled = isDateDisabled(date)
                const isInRange = isDateInRange(date)
                const isStart = isDateStart(date)
                const isEnd = isDateEnd(date)
                
                return (
                  <button
                    key={index}
                    onClick={() => handleDateSelect(date)}
                    disabled={isDisabled}
                    className={cn(
                      "h-8 w-8 text-sm rounded-md transition-colors relative",
                      "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20",
                      !isCurrentMonth && "text-muted-foreground/50",
                      isDisabled && "opacity-30 cursor-not-allowed",
                      isInRange && !isStart && !isEnd && "bg-primary/10",
                      isStart && "bg-primary text-primary-foreground rounded-l-md",
                      isEnd && "bg-primary text-primary-foreground rounded-r-md",
                      isStart && isEnd && "rounded-md"
                    )}
                  >
                    {date.getDate()}
                  </button>
                )
              })}
            </div>

            {/* Selection Summary */}
            {tempStartDate && tempEndDate && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
                <div className="text-sm font-medium mb-1">Selected Duration</div>
                <div className="text-sm text-muted-foreground mb-2">
                  {formatDate(tempStartDate)} to {formatDate(tempEndDate)}
                </div>
                <div className="text-sm font-semibold text-primary">
                  {getDuration()}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button onClick={handleApply} className="flex-1" size="sm">
                Apply Dates
              </Button>
              <Button variant="outline" onClick={() => setIsOpen(false)} size="sm">
                Cancel
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
