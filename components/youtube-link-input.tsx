"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, Youtube } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { extractYouTubeId } from "@/lib/utils"

interface YouTubeLinkInputProps {
  value: string
  onChange: (videoId: string) => void
}

export function YouTubeLinkInput({ value, onChange }: YouTubeLinkInputProps) {
  const [inputValue, setInputValue] = useState(value)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    setError(null)

    // Auto-extract video ID as user types
    const videoId = extractYouTubeId(newValue)
    if (videoId) {
      setPreview(videoId)
      onChange(videoId)
    } else {
      setPreview(null)
    }
  }

  const handleValidate = () => {
    if (!inputValue.trim()) {
      setError("Please enter a YouTube URL")
      return
    }

    const videoId = extractYouTubeId(inputValue)
    if (!videoId) {
      setError("Invalid YouTube URL. Please enter a valid YouTube video link.")
      return
    }

    setPreview(videoId)
    onChange(videoId)
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Youtube className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Enter YouTube video URL (e.g., https://www.youtube.com/watch?v=...)"
            value={inputValue}
            onChange={handleInputChange}
            className="pl-10"
          />
        </div>
        <Button type="button" onClick={handleValidate}>
          Validate
        </Button>
      </div>

      {preview && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="aspect-video max-w-md mx-auto">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${preview}`}
              title="YouTube video preview"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <p className="text-center text-sm text-green-600 mt-2">Video validated successfully!</p>
        </div>
      )}
    </div>
  )
}

