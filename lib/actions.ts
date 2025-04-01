"use server"

import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

// Mock data to use instead of database
const mockCourses = [
  {
    id: "1",
    title: "Morning Energizing Flow",
    description: "Start your day with energy and intention through gentle flowing movements.",
    content: "This course covers morning yoga practices to energize your body and mind...",
    videoId: "dQw4w9WgXcQ", // Example YouTube video ID
    duration: 60,
    languages: ["english", "hindi"],
    timeSlots: [
      { time: "07:00", days: ["Monday", "Wednesday", "Friday"], batchName: "Batch 1" },
      { time: "18:00", days: ["Tuesday", "Thursday"], batchName: "Batch 2" },
    ],
    status: "active",
    viewStats: { "Batch 1": 12, "Batch 2": 8 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "प्राणायाम अभ्यास (Pranayama Practice)",
    description: "श्वास नियंत्रण के माध्यम से अपनी जीवन शक्ति का विस्तार करें।",
    content: "इस पाठ्यक्रम में, हम विभिन्न प्राणायाम तकनीकों का अभ्यास करेंगे...",
    videoId: "inpok4MKVLM", // Example YouTube video ID
    duration: 60,
    languages: ["hindi"],
    timeSlots: [
      { time: "07:00", days: ["Monday", "Wednesday", "Friday"], batchName: "Morning Batch" },
      { time: "18:00", days: ["Tuesday", "Thursday"], batchName: "Evening Batch" },
    ],
    status: "active",
    viewStats: { "Morning Batch": 15, "Evening Batch": 10 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "ಧ್ಯಾನ ಅಭ್ಯಾಸ (Meditation Practice)",
    description: "ಮಾರ್ಗದರ್ಶಿತ ಧ್ಯಾನದ ಮೂಲಕ ಮನಸ್ಸಿನ ಶಾಂತಿ ಮತ್ತು ಸ್ಪಷ್ಟತೆಯನ್ನು ಕಂಡುಕೊಳ್ಳಿ.",
    content: "ಈ ಕೋರ್ಸ್‌ನಲ್ಲಿ, ನಾವು ವಿವಿಧ ಧ್ಯಾನ ತಂತ್ರಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡುತ್ತೇವೆ...",
    videoId: "86m4RC_ADEY", // Example YouTube video ID
    duration: 60,
    languages: ["kannada", "english"],
    timeSlots: [
      { time: "07:00", days: ["Monday", "Wednesday", "Friday"], batchName: "Beginner Batch" },
      { time: "19:30", days: ["Tuesday", "Thursday", "Saturday"], batchName: "Advanced Batch" },
    ],
    status: "active",
    viewStats: { "Beginner Batch": 7, "Advanced Batch": 5 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// In-memory storage for courses
let courses = [...mockCourses]

export interface Course {
  id: string
  title: string
  description: string
  content: string
  videoId: string
  duration: number
  languages: string[]
  timeSlots: { time: string; days: string[]; batchName: string }[]
  status: "active" | "inactive"
  viewStats: { [batchName: string]: number }
  createdAt: string
  updatedAt: string
}

export async function getCourses() {
  try {
    return courses
  } catch (error) {
    console.error("Error in getCourses:", error)
    return []
  }
}

export async function getCourseById(id: string) {
  try {
    const course = courses.find((course) => course.id === id)
    return course || null
  } catch (error) {
    console.error("Error in getCourseById:", error)
    return null
  }
}

export async function uploadCourse(courseData: {
  title: string
  description: string
  content: string
  timeSlots: { time: string; days: string[]; batchName: string }[]
  videoId: string
  duration: number
  languages: string[]
}) {
  try {
    const newCourse = {
      id: uuidv4(),
      ...courseData,
      status: "active" as const,
      viewStats: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    courses.push(newCourse)

    // Revalidate the courses page
    revalidatePath("/courses")
    revalidatePath("/admin")

    return { success: true }
  } catch (error) {
    console.error("Error in uploadCourse:", error)
    throw error
  }
}

export async function updateCourse(courseData: {
  id: string
  title: string
  description: string
  content: string
  timeSlots: { time: string; days: string[]; batchName: string }[]
  videoId: string
  duration: number
  languages: string[]
  status?: "active" | "inactive"
  viewStats?: { [batchName: string]: number }
}) {
  try {
    const { id, ...updateData } = courseData

    const courseIndex = courses.findIndex((course) => course.id === id)
    if (courseIndex === -1) {
      throw new Error("Course not found")
    }

    courses[courseIndex] = {
      ...courses[courseIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    }

    // Revalidate the courses page
    revalidatePath("/courses")
    revalidatePath("/admin")
    revalidatePath(`/courses/${id}`)

    return { success: true }
  } catch (error) {
    console.error("Error in updateCourse:", error)
    throw error
  }
}

export async function deleteCourse(id: string) {
  try {
    courses = courses.filter((course) => course.id !== id)

    // Revalidate the courses page
    revalidatePath("/courses")
    revalidatePath("/admin")

    return { success: true }
  } catch (error) {
    console.error("Error in deleteCourse:", error)
    throw error
  }
}

export async function incrementCourseViews(courseId: string, batchName: string) {
  try {
    const courseIndex = courses.findIndex((course) => course.id === courseId)
    if (courseIndex === -1) {
      throw new Error("Course not found")
    }

    const course = courses[courseIndex]
    const viewStats = course.viewStats || {}
    viewStats[batchName] = (viewStats[batchName] || 0) + 1

    courses[courseIndex] = {
      ...course,
      viewStats,
      updatedAt: new Date().toISOString(),
    }

    return { success: true }
  } catch (error) {
    console.error("Error in incrementCourseViews:", error)
    throw error
  }
}

export async function updateCourseStatus(courseId: string, status: "active" | "inactive") {
  try {
    const courseIndex = courses.findIndex((course) => course.id === courseId)
    if (courseIndex === -1) {
      throw new Error("Course not found")
    }

    courses[courseIndex] = {
      ...courses[courseIndex],
      status,
      updatedAt: new Date().toISOString(),
    }

    // Revalidate the courses page
    revalidatePath("/courses")
    revalidatePath("/admin")

    return { success: true }
  } catch (error) {
    console.error("Error in updateCourseStatus:", error)
    throw error
  }
}

export async function getCourseStats() {
  try {
    // Calculate total views across all courses
    const totalViews = courses.reduce((sum, course) => {
      const courseViews = Object.values(course.viewStats || {}).reduce((a, b) => a + b, 0)
      return sum + courseViews
    }, 0)

    // Count active and inactive courses
    const activeCourses = courses.filter((course) => course.status === "active").length
    const inactiveCourses = courses.filter((course) => course.status === "inactive").length

    // Get most popular course
    let mostPopularCourse = null
    let maxViews = 0

    courses.forEach((course) => {
      const courseViews = Object.values(course.viewStats || {}).reduce((a, b) => a + b, 0)
      if (courseViews > maxViews) {
        maxViews = courseViews
        mostPopularCourse = course
      }
    })

    return {
      totalCourses: courses.length,
      activeCourses,
      inactiveCourses,
      totalViews,
      mostPopularCourse,
    }
  } catch (error) {
    console.error("Error in getCourseStats:", error)
    return null
  }
}

