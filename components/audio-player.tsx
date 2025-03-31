"use client"

import { useRef, useEffect, useState } from "react"
import { AlertCircle, Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

interface AudioPlayerProps {
  videoId: string
  title: string
  autoExpire?: boolean
  durationMinutes?: number
  batchName?: string
}

export function AudioPlayer({ videoId, title, autoExpire = true, durationMinutes = 60, batchName }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLive, setIsLive] = useState(true)
  const [startTime] = useState(new Date())
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [waitingTime, setWaitingTime] = useState(10)
  const [isWaiting, setIsWaiting] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const waitingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Create audio source URL (in a real app, this would be a server endpoint that converts YouTube to audio)
  const getAudioUrl = (videoId: string) => {
    // This is a placeholder. In a real implementation, you would have a server endpoint
    // that converts YouTube videos to audio streams
    return `/api/audio/${videoId}`
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

  // Auto-expire the audio after the duration
  useEffect(() => {
    if (!autoExpire) return

    const expireTimeout = setTimeout(
      () => {
        setIsLive(false)
        if (audioRef.current) {
          audioRef.current.pause()
        }
      },
      durationMinutes * 60 * 1000,
    )

    return () => clearTimeout(expireTimeout)
  }, [autoExpire, durationMinutes])

  // Prevent seeking/forwarding
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !isLive) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)

      // If audio is trying to seek ahead, reset it to where it should be
      const expectedTime = (new Date().getTime() - startTime.getTime()) / 1000
      const allowedDriftSeconds = 5 // Allow 5 seconds of drift to account for buffering

      if (audio.currentTime > expectedTime + allowedDriftSeconds) {
        audio.currentTime = expectedTime
      }
    }

    const handleSeeking = () => {
      // If user tries to seek forward, prevent it
      const expectedTime = (new Date().getTime() - startTime.getTime()) / 1000
      if (audio.currentTime > expectedTime) {
        audio.currentTime = expectedTime
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("seeking", handleSeeking)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("seeking", handleSeeking)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [isLive, startTime])

  // Simulate audio loading for demo purposes
  useEffect(() => {
    // In a real app, this would be replaced with actual audio loading
    const loadTimeout = setTimeout(() => {
      setIsLoading(false)
      setDuration(durationMinutes * 60)
    }, 2000)

    return () => clearTimeout(loadTimeout)
  }, [durationMinutes])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!audioRef.current) return

    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

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

        {isWaiting ? (
          <div className="p-8 flex flex-col items-center justify-center bg-gray-50">
            <div className="text-2xl font-bold text-green-800 mb-4">Starting in {waitingTime} seconds</div>
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Please wait while we prepare your yoga session...</p>
          </div>
        ) : (
          <div className="p-4">
            {/* Hidden audio element */}
            <audio
              ref={audioRef}
              src={getAudioUrl(videoId)}
              onError={() => setError("There was an error playing this audio. Please try again later.")}
              className="hidden"
            />

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center bg-gray-100 h-40 rounded-lg">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-green-800 mb-2">{formatTime(currentTime)}</div>
                    <div className="text-gray-500">Audio Only Mode</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Progress value={(currentTime / duration) * 100} className="h-2" />

                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button variant="outline" size="icon" onClick={togglePlay} className="h-10 w-10 rounded-full">
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>

                  <Button variant="outline" size="icon" onClick={toggleMute} className="h-10 w-10 rounded-full">
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

