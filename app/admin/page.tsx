"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Clock, FileUp, Plus, Save, Trash, Edit } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { TimeSlotPicker } from "@/components/time-slot-picker"
import { getCourses, uploadCourse, deleteCourse, updateCourse } from "@/lib/actions"
import { LanguageSelector } from "@/components/language-selector"
import { YouTubeLinkInput } from "@/components/youtube-link-input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

export default function AdminPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [videoId, setVideoId] = useState("")
  const [duration, setDuration] = useState("60")
  const [languages, setLanguages] = useState<string[]>(["english"])
  const [interfaceLanguage, setInterfaceLanguage] = useState("english")
  const [timeSlots, setTimeSlots] = useState<{ time: string; days: string[]; batchName: string }[]>([
    { time: "07:00", days: ["Monday", "Wednesday", "Friday"], batchName: "Batch 1" },
  ])
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [nextBatchNumber, setNextBatchNumber] = useState(2)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const availableLanguages = [
    { id: "english", label: "English" },
    { id: "hindi", label: "हिंदी (Hindi)" },
    { id: "kannada", label: "ಕನ್ನಡ (Kannada)" },
  ]

  useEffect(() => {
    // Check if admin is authenticated (check both sessionStorage and cookies)
    const adminAuthSession = sessionStorage.getItem("adminAuthenticated")
    const adminAuthCookie = document.cookie.includes("adminAuthenticated=true")

    if (adminAuthSession !== "true" && !adminAuthCookie) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
      loadCourses()
    }
    setIsLoading(false)
  }, [router])

  const loadCourses = async () => {
    try {
      const data = await getCourses()
      setCourses(data)
    } catch (error) {
      console.error("Error loading courses:", error)
      toast({
        title: "Error",
        description: "Failed to load courses. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addTimeSlot = () => {
    setTimeSlots([
      ...timeSlots,
      {
        time: "07:00",
        days: ["Monday"],
        batchName: `Batch ${nextBatchNumber}`,
      },
    ])
    setNextBatchNumber((prev) => prev + 1)
  }

  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index))
  }

  const updateTimeSlot = (index: number, field: "time" | "days" | "batchName", value: string | string[]) => {
    const newTimeSlots = [...timeSlots]
    newTimeSlots[index][field] = value as any
    setTimeSlots(newTimeSlots)
  }

  const handleLanguageToggle = (language: string) => {
    setLanguages((prev) => (prev.includes(language) ? prev.filter((l) => l !== language) : [...prev, language]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (languages.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one language for the course.",
        variant: "destructive",
      })
      return
    }

    if (!videoId) {
      toast({
        title: "Error",
        description: "Please add a valid YouTube video.",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingCourse) {
        await updateCourse({
          id: editingCourse.id,
          title,
          description,
          content,
          timeSlots,
          videoId,
          duration: Number.parseInt(duration),
          languages,
        })

        toast({
          title: "Course updated",
          description: "Your course has been successfully updated.",
        })

        setIsEditDialogOpen(false)
      } else {
        await uploadCourse({
          title,
          description,
          content,
          timeSlots,
          videoId,
          duration: Number.parseInt(duration),
          languages,
        })

        toast({
          title: "Course created",
          description: "Your course has been successfully created and scheduled.",
        })
      }

      // Reset form
      resetForm()

      // Refresh courses list
      loadCourses()
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your course.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setContent("")
    setVideoId("")
    setDuration("60")
    setLanguages(["english"])
    setTimeSlots([{ time: "07:00", days: ["Monday", "Wednesday", "Friday"], batchName: "Batch 1" }])
    setNextBatchNumber(2)
    setEditingCourse(null)
  }

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course)
    setTitle(course.title)
    setDescription(course.description)
    setContent(course.content)
    setVideoId(course.videoId)
    setDuration(course.duration.toString())
    setLanguages(course.languages)

    // Ensure all time slots have batch names
    const timeSlotsWithBatch = course.timeSlots.map((slot, index) => ({
      ...slot,
      batchName: slot.batchName || `Batch ${index + 1}`,
    }))

    setTimeSlots(timeSlotsWithBatch)
    setNextBatchNumber(timeSlotsWithBatch.length + 1)
    setIsEditDialogOpen(true)
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      try {
        await deleteCourse(courseId)
        toast({
          title: "Course deleted",
          description: "The course has been successfully deleted.",
        })
        loadCourses()
      } catch (error) {
        toast({
          title: "Error",
          description: "There was an error deleting the course.",
          variant: "destructive",
        })
      }
    }
  }

  const courseForm = (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <Label htmlFor="title">Course Title</Label>
          <Input
            id="title"
            placeholder="Enter course title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border-green-200 focus-visible:ring-green-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Course Description</Label>
          <Textarea
            id="description"
            placeholder="Enter course description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border-green-200 focus-visible:ring-green-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Course Content</Label>
          <Textarea
            id="content"
            placeholder="Enter course content or notes"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] border-green-200 focus-visible:ring-green-500"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="duration">Course Duration (minutes)</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="border-green-200 focus-visible:ring-green-500">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes (1 hour)</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
                <SelectItem value="120">120 minutes (2 hours)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Course Languages</Label>
            <div className="border rounded-md p-3 border-green-200">
              <div className="grid grid-cols-1 gap-2">
                {availableLanguages.map((lang) => (
                  <div key={lang.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`lang-${lang.id}`}
                      checked={languages.includes(lang.id)}
                      onCheckedChange={() => handleLanguageToggle(lang.id)}
                      className="text-green-600 border-green-300 data-[state=checked]:bg-green-600"
                    />
                    <Label htmlFor={`lang-${lang.id}`} className="text-sm font-normal">
                      {lang.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            {languages.length === 0 && <p className="text-xs text-red-500">Please select at least one language</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="youtube">YouTube Video</Label>
          <YouTubeLinkInput value={videoId} onChange={setVideoId} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Global Access Times</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTimeSlot}
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Time Slot
            </Button>
          </div>

          <div className="space-y-4">
            {timeSlots.map((slot, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border border-green-100 rounded-lg bg-green-50/50">
                <div className="flex-1">
                  <div className="mb-4">
                    <Label htmlFor={`batch-${index}`}>Batch Name</Label>
                    <Input
                      id={`batch-${index}`}
                      value={slot.batchName}
                      onChange={(e) => updateTimeSlot(index, "batchName", e.target.value)}
                      className="border-green-200 focus-visible:ring-green-500 mt-1"
                    />
                  </div>
                  <TimeSlotPicker timeSlot={slot} onChange={(field, value) => updateTimeSlot(index, field, value)} />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTimeSlot(index)}
                  disabled={timeSlots.length === 1}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-700">How Global Access Times Work</h4>
                <p className="text-sm text-blue-600 mt-1">
                  When you set a time (e.g., 7:00 AM), students worldwide can access the course at 7:00 AM in their
                  local timezone. This means a student in India will see it at 7:00 AM IST, while a student in Muscat
                  will see it at 7:00 AM Muscat time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-green-100 bg-green-50/50">
        <Button type="submit" className="bg-green-700 hover:bg-green-800">
          <Save className="h-4 w-4 mr-2" />
          {editingCourse ? "Update Course" : "Create Course"}
        </Button>
      </CardFooter>
    </form>
  )

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="bg-gradient-to-b from-green-50 to-blue-50 min-h-screen">
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="h-12 w-12 relative mr-2">
              <Image src="/images/logo.png" alt="STHAVISHTA YOGA AND WELLNESS" fill className="object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-green-800">Admin Dashboard</h1>
              <p className="text-muted-foreground">STHAVISHTA YOGA AND WELLNESS</p>
            </div>
          </div>
          <div className="flex gap-2">
            <LanguageSelector value={interfaceLanguage} onChange={setInterfaceLanguage} className="bg-white" />
            <Button asChild variant="outline">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          <Tabs defaultValue="create">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="create">Create New Course</TabsTrigger>
              <TabsTrigger value="manage">Manage Courses</TabsTrigger>
            </TabsList>

            <TabsContent value="create">
              <Card className="border-green-100 bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-green-100">
                  <CardTitle className="text-green-800">Create New Yoga Course</CardTitle>
                  <CardDescription>
                    Upload course content and set global access times for your students.
                  </CardDescription>
                </CardHeader>
                {courseForm}
              </Card>
            </TabsContent>

            <TabsContent value="manage">
              <Card className="border-green-100 bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-green-100">
                  <CardTitle className="text-green-800">Existing Courses</CardTitle>
                  <CardDescription>Manage your existing yoga courses and their schedules.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {isLoading ? (
                    <div className="text-center py-6">
                      <div className="h-8 w-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading courses...</p>
                    </div>
                  ) : courses.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <FileUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No courses created yet. Create your first yoga course in the "Create New Course" tab.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {courses.map((course) => (
                        <div key={course.id} className="border border-green-100 rounded-lg overflow-hidden">
                          <div className="bg-green-50 p-4 flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-green-800">{course.title}</h3>
                              <p className="text-sm text-muted-foreground">{course.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                onClick={() => handleEditCourse(course)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleDeleteCourse(course.id)}
                              >
                                <Trash className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                          <div className="p-4 bg-white">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Duration</h4>
                                <p>{course.duration} minutes</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Languages</h4>
                                <div className="flex flex-wrap gap-1">
                                  {course.languages.map((lang) => (
                                    <Badge key={lang} variant="outline" className="bg-green-50">
                                      {lang}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Time Slots</h4>
                              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {course.timeSlots.map((slot, index) => (
                                  <div key={index} className="border border-gray-100 rounded p-2 bg-gray-50">
                                    <div className="font-medium text-sm">{slot.batchName || `Batch ${index + 1}`}</div>
                                    <div className="text-xs text-gray-500">
                                      {slot.time} on {slot.days.join(", ")}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Course Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>Make changes to your course. Click save when you're done.</DialogDescription>
          </DialogHeader>
          {courseForm}
        </DialogContent>
      </Dialog>
    </div>
  )
}

