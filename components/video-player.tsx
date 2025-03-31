"use client"

import { useRef, useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface VideoPlayerProps {
  src: string
  title: string
  autoExpire?: boolean
  durationMinutes?: number
}

export function VideoPlayer({ src, title, autoExpire = true, durationMinutes = 60 }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLive, setIsLive] = useState(true)
  const [startTime] = useState(new Date())

  // Prevent seeking/forwarding
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      // If video is trying to seek ahead, reset it to where it should be
      const expectedTime = (new Date().getTime() - startTime.getTime()) / 1000
      const allowedDriftSeconds = 5 // Allow 5 seconds of drift to account for buffering

      if (video.currentTime > expectedTime + allowedDriftSeconds) {
        video.currentTime = expectedTime
      }
    }

    const handleSeeking = () => {
      // If user tries to seek forward, prevent it
      const expectedTime = (new Date().getTime() - startTime.getTime()) / 1000
      if (video.currentTime > expectedTime) {
        video.currentTime = expectedTime
      }
    }

    // Auto-expire the video after the duration
    let expireTimeout: NodeJS.Timeout | null = null
    if (autoExpire) {
      expireTimeout = setTimeout(
        () => {
          setIsLive(false)
          video.pause()
        },
        durationMinutes * 60 * 1000,
      )
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("seeking", handleSeeking)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("seeking", handleSeeking)
      if (expireTimeout) clearTimeout(expireTimeout)
    }
  }, [startTime, autoExpire, durationMinutes])

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLive && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Session Ended</AlertTitle>
          <AlertDescription>
            This live session has ended. Please check back for the next scheduled session.
          </AlertDescription>
        </Alert>
      )}

      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        {isLive ? (
          <>
            <video
              ref={videoRef}
              className="w-full h-full"
              controls
              autoPlay
              onError={() => setError("There was an error playing this video. Please try again later.")}
            >
              <source src={src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              LIVE
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            <p>This session has ended</p>
          </div>
        )}
      </div>
      <h3 className="font-medium text-lg">{title}</h3>
    </div>
  )
}

