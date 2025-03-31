"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Clock, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { YouTubePlayer } from "@/components/youtube-player"
import { getCourseById } from "@/lib/actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

interface Course {
  id: string
  title: string
  description: string
  content: string
  videoId: string
  duration: number
  languages: string[]
  timeSlots: { time: string; days: string[]; batchName: string }[]
}

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [batches, setBatches] = useState<
    {
      batchName: string
      time: string
      days: string[]
      isAccessible: boolean
    }[]
  >([])
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null)

  useEffect(() => {
    const loadCourse = async () => {
      try {
        if (!params.id) return
        const data = await getCourseById(params.id as string)
        setCourse(data)

        // Check which batches are accessible now
        if (data) {
          const batchesData = data.timeSlots.map((slot) => ({
            batchName: slot.batchName || "Default Batch",
            time: slot.time,
            days: slot.days,
            isAccessible: checkAccessibility([slot]),
          }))

          setBatches(batchesData)

          // Auto-select the first accessible batch
          const firstAccessible = batchesData.find((b) => b.isAccessible)
          if (firstAccessible) {
            setSelectedBatch(firstAccessible.batchName)
          } else if (batchesData.length > 0) {
            // If no accessible batches, select the first one
            setSelectedBatch(batchesData[0].batchName)
          }
        }
      } catch (error) {
        console.error("Error loading course:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [params.id])

  const checkAccessibility = (timeSlots: { time: string; days: string[] }[]) => {
    if (!timeSlots || timeSlots.length === 0) return false

    const now = new Date()
    const currentDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][now.getDay()]
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    return timeSlots.some((slot) => {
      const [hours, minutes] = slot.time.split(":").map(Number)

      // Check if current day is in the allowed days
      if (!slot.days.includes(currentDay)) return false

      // Check if current time is within 1 hour of the scheduled time
      if (currentHour === hours) return true
      if (currentHour === hours - 1 && currentMinute >= 30 && minutes <= 30) return true
      if (currentHour === hours + 1 && currentMinute <= 30 && minutes >= 30) return true

      return false
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-[400px] w-full mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container mx-auto py-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className="mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/courses")}>Back to Courses</Button>
        </div>
      </div>
    )
  }

  const selectedBatchData = batches.find((b) => b.batchName === selectedBatch)

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={() => router.push("/courses")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>

          <div className="flex items-center">
            <div className="h-8 w-8 relative mr-2">
              <Image
                src="/images/logo.png"
                alt="STHAVISHTA YOGA AND WELLNESS"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="font-medium text-green-800">STHAVISHTA YOGA AND WELLNESS</span>
          </div>
        </div>

        <Card className="border-green-100 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-green-800">{course.title}</CardTitle>
            <CardDescription>{course.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {batches.length > 0 && (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium text-green-800">Course Batches</h3>
                  </div>

                  <Tabs value={selectedBatch || undefined} onValueChange={setSelectedBatch} className="w-full">
                    <TabsList
                      className="w-full grid"
                      style={{ gridTemplateColumns: `repeat(${batches.length}, minmax(0, 1fr))` }}
                    >
                      {batches.map((batch, index) => (
                        <TabsTrigger
                          key={index}
                          value={batch.batchName}
                          className={batch.isAccessible ? "border-green-200" : ""}
                        >
                          <div className="flex items-center gap-1">
                            {batch.batchName}
                            {!batch.isAccessible && <Lock className="h-3 w-3 ml-1" />}
                          </div>
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {batches.map((batch, index) => (
                      <TabsContent key={index} value={batch.batchName} className="pt-4">
                        {batch.isAccessible ? (
                          <YouTubePlayer
                            videoId={course.videoId}
                            title={course.title}
                            durationMinutes={course.duration}
                            batchName={batch.batchName}
                          />
                        ) : (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                            <Clock className="h-12 w-12 mx-auto mb-4 text-amber-500" />
                            <h3 className="font-medium text-amber-800 text-xl mb-2">
                              This batch is not available right now
                            </h3>
                            <p className="text-amber-700 mb-4">Please check back during the scheduled times:</p>
                            <div className="inline-block bg-white px-4 py-3 rounded-lg border border-amber-200 text-amber-800">
                              <div className="font-bold mb-1">{batch.batchName}</div>
                              <div>
                                {batch.time} on {batch.days.join(", ")}
                              </div>
                            </div>
                          </div>
                        )}
                      </TabsContent>
                    ))}
                  </Tabs>
                </>
              )}
            </div>

            <div className="prose max-w-none">
              <h3 className="text-xl font-medium text-green-800">Course Content</h3>
              <div className="whitespace-pre-line">{course.content}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

