"use client"

import { useRef, useEffect, useState } from "react"
import { AlertCircle, Maximize, Minimize } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface YouTubePlayerProps {
  videoId: string
  title: string
  autoExpire?: boolean
  durationMinutes?: number
  batchName?: string
}

export function YouTubePlayer({
  videoId,
  title,
  autoExpire = true,
  durationMinutes = 60,
  batchName,
}: YouTubePlayerProps) {
  const playerRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLive, setIsLive] = useState(true)
  const [startTime] = useState(new Date())
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [waitingTime, setWaitingTime] = useState(10)
  const [isWaiting, setIsWaiting] = useState(true)
  const waitingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Create a safe embed URL with restricted features
  const createSafeEmbedUrl = (videoId: string) => {
    // Parameters to restrict YouTube functionality:
    // - modestbranding=1: Reduce YouTube branding
    // - rel=0: Don't show related videos
    // - fs=0: Disable fullscreen (we'll handle it ourselves)
    // - disablekb=1: Disable keyboard controls
    return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&fs=0&disablekb=1&controls=1`
  }

  // Handle waiting period
  useEffect(() => {
    if (!isWaiting) return

    waitingIntervalRef.current = setInterval(() => {
      setWaitingTime((prev) => {
        if (prev <= 1) {
          clearInterval(waitingIntervalRef.current!)
          setIsWaiting(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (waitingIntervalRef.current) {
        clearInterval(waitingIntervalRef.current)
      }
    }
  }, [isWaiting])

  // Auto-expire the video after the duration
  useEffect(() => {
    if (!autoExpire) return

    const expireTimeout = setTimeout(
      () => {
        setIsLive(false)
        if (playerRef.current) {
          try {
            // Try to pause the video when session ends
            const iframe = playerRef.current
            const iframeSrc = iframe.src
            iframe.src = iframeSrc
          } catch (e) {
            console.error("Error pausing video:", e)
          }
        }
      },
      durationMinutes * 60 * 1000,
    )

    return () => clearTimeout(expireTimeout)
  }, [autoExpire, durationMinutes])

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

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

      <div className="bg-white border rounded-lg overflow-hidden shadow-md">
        <div className="p-4 bg-green-50 border-b flex justify-between items-center">
          <div>
            <h3 className="font-medium text-lg text-green-800">{title}</h3>
            {batchName && <div className="text-sm text-green-600">{batchName}</div>}
          </div>
          <div className="text-red-600 text-xs px-2 py-1 bg-red-100 rounded-full animate-pulse">LIVE</div>
        </div>

        <div ref={containerRef} className={`relative bg-black ${isFullscreen ? "w-screen h-screen" : "aspect-video"}`}>
          {isWaiting ? (
            <div className="p-8 flex flex-col items-center justify-center bg-gray-50 h-full">
              <div className="text-2xl font-bold text-green-800 mb-4">Starting in {waitingTime} seconds</div>
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Please wait while we prepare your yoga session...</p>
              <Progress value={(10 - waitingTime) * 10} className="w-64 mt-4" />
            </div>
          ) : (
            <>
              <iframe
                ref={playerRef}
                className="w-full h-full"
                src={createSafeEmbedUrl(videoId)}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen={false}
                onError={() => setError("There was an error playing this video. Please try again later.")}
              ></iframe>
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {/* Overlay to prevent clicking YouTube links */}
                <div className="absolute inset-0 bg-transparent"></div>

                {/* Custom controls */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent flex justify-between items-center pointer-events-auto">
                  <div className="text-white text-xs px-2 py-1 bg-red-600 rounded-full animate-pulse">LIVE</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

