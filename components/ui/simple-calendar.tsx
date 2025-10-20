"use client"

import { useState } from "react"
import { format, addDays, differenceInDays, isBefore, isAfter, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"
import { Calendar, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SimpleCalendarProps {
  startDate?: Date
  endDate?: Date
  onDateChange: (startDate: Date | undefined, endDate: Date | undefined) => void
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  className?: string
}

export function SimpleCalendar({
  startDate,
  endDate,
  onDateChange,
  minDate = new Date(),
  maxDate = addDays(new Date(), 365),
  disabled = false,
  className
}: SimpleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(startDate)
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(endDate)

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

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

  const handleDateClick = (date: Date) => {
    if (isBefore(date, minDate) || isAfter(date, maxDate)) {
      return
    }

    if (!tempStartDate || (tempEndDate && tempStartDate)) {
      // Start new selection
      setTempStartDate(date)
      setTempEndDate(undefined)
    } else if (tempStartDate && !tempEndDate) {
      // Select end date
      if (isBefore(date, tempStartDate)) {
        // If clicked date is before start date, make it the new start date
        setTempStartDate(date)
        setTempEndDate(undefined)
      } else {
        // Set as end date
        setTempEndDate(date)
      }
    }
  }

  const handleApply = () => {
    onDateChange(tempStartDate, tempEndDate)
  }

  const handleClear = () => {
    setTempStartDate(undefined)
    setTempEndDate(undefined)
    onDateChange(undefined, undefined)
  }

  const getDuration = () => {
    if (tempStartDate && tempEndDate) {
      const days = differenceInDays(tempEndDate, tempStartDate) + 1
      return `${days} day${days > 1 ? 's' : ''}`
    }
    return null
  }

  const isDateInRange = (date: Date) => {
    if (!tempStartDate || !tempEndDate) return false
    return date >= tempStartDate && date <= tempEndDate
  }

  const isDateStart = (date: Date) => {
    return tempStartDate && isSameDay(date, tempStartDate)
  }

  const isDateEnd = (date: Date) => {
    return tempEndDate && isSameDay(date, tempEndDate)
  }

  const isDateDisabled = (date: Date) => {
    return isBefore(date, minDate) || isAfter(date, maxDate)
  }

  // Generate calendar days
  const monthStart = startOfMonth(new Date(currentYear, currentMonth))
  const monthEnd = endOfMonth(new Date(currentYear, currentMonth))
  const calendarStart = new Date(monthStart)
  calendarStart.setDate(calendarStart.getDate() - monthStart.getDay())
  
  const calendarEnd = new Date(monthEnd)
  calendarEnd.setDate(calendarEnd.getDate() + (6 - monthEnd.getDay()))
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  })

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth('prev')}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-semibold text-lg">
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
      <div className="border rounded-lg p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            const isCurrentMonth = date.getMonth() === currentMonth
            const isDisabled = isDateDisabled(date)
            const isInRange = isDateInRange(date)
            const isStart = isDateStart(date)
            const isEnd = isDateEnd(date)
            const isToday = isSameDay(date, new Date())

            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                disabled={isDisabled}
                className={cn(
                  "h-8 w-8 text-sm rounded-md transition-colors relative",
                  "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20",
                  !isCurrentMonth && "text-muted-foreground/50",
                  isDisabled && "opacity-30 cursor-not-allowed",
                  isToday && !isStart && !isEnd && "bg-accent text-accent-foreground",
                  isInRange && !isStart && !isEnd && "bg-primary/10",
                  isStart && "bg-primary text-primary-foreground font-semibold",
                  isEnd && "bg-primary text-primary-foreground font-semibold",
                  isStart && isEnd && "rounded-md"
                )}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selection Summary */}
      {tempStartDate && tempEndDate && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
          <div className="text-sm font-medium mb-2">Selected Rental Period</div>
          <div className="text-sm text-muted-foreground mb-1">
            {format(tempStartDate, 'MMM dd, yyyy')} to {format(tempEndDate, 'MMM dd, yyyy')}
          </div>
          <div className="text-sm font-semibold text-primary flex items-center gap-2">
            <Check className="h-4 w-4" />
            {getDuration()}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        <Button 
          onClick={handleApply} 
          className="flex-1"
          disabled={!tempStartDate || !tempEndDate}
        >
          Apply Dates
        </Button>
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>
    </div>
  )
}
