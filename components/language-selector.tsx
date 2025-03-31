"use client"

import { Languages } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LanguageSelectorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function LanguageSelector({ value, onChange, className }: LanguageSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`w-[140px] ${className || ""}`}>
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4" />
          <SelectValue placeholder="Select language" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="english">English</SelectItem>
        <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
        <SelectItem value="kannada">ಕನ್ನಡ (Kannada)</SelectItem>
        <SelectItem value="all">All Languages</SelectItem>
      </SelectContent>
    </Select>
  )
}

