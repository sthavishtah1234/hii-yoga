"use client"

import { Clock } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface TimeSlotPickerProps {
  timeSlot: {
    time: string
    days: string[]
    batchName?: string
  }
  onChange: (field: "time" | "days" | "batchName", value: string | string[]) => void
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function TimeSlotPicker({ timeSlot, onChange }: TimeSlotPickerProps) {
  const handleDayToggle = (day: string) => {
    const newDays = timeSlot.days.includes(day) ? timeSlot.days.filter((d) => d !== day) : [...timeSlot.days, day]

    onChange("days", newDays)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="time">Time (24-hour format)</Label>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <Input
            id="time"
            type="time"
            value={timeSlot.time}
            onChange={(e) => onChange("time", e.target.value)}
            className="w-32 border-green-200 focus-visible:ring-green-500"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Students will access the course at this time in their local timezone
        </p>
      </div>

      <div className="space-y-2">
        <Label>Available Days</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="flex items-center space-x-2">
              <Checkbox
                id={`day-${day}`}
                checked={timeSlot.days.includes(day)}
                onCheckedChange={() => handleDayToggle(day)}
                className="text-green-600 border-green-300 data-[state=checked]:bg-green-600"
              />
              <Label htmlFor={`day-${day}`} className="text-sm font-normal">
                {day}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

