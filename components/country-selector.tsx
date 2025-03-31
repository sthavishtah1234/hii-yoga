"use client"

import { Globe } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CountrySelectorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function CountrySelector({ value, onChange, placeholder }: CountrySelectorProps) {
  // Common countries - in a real app, you would have a complete list
  const countries = [
    { code: "IN", name: "India" },
    { code: "OM", name: "Oman" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "SG", name: "Singapore" },
    { code: "MY", name: "Malaysia" },
    { code: "SA", name: "Saudi Arabia" },
  ]

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <SelectValue placeholder={placeholder || "Select your country"} />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Countries</SelectLabel>
          {countries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

