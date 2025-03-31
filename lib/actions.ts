"use server"

import { revalidatePath } from "next/cache"

// Mock database - in a real app, you would use a database
let courses = [
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
  },
]

export async function getCourses() {
  // In a real app, you would fetch from a database
  return courses
}

export async function getCourseById(id: string) {
  // In a real app, you would fetch from a database
  return courses.find((course) => course.id === id) || null
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
  // In a real app, you would save to a database
  const newCourse = {
    id: Date.now().toString(),
    ...courseData,
  }

  courses = [...courses, newCourse]

  // Revalidate the courses page
  revalidatePath("/courses")
  revalidatePath("/admin")

  return { success: true }
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
}) {
  // In a real app, you would update in a database
  const { id } = courseData
  const courseIndex = courses.findIndex((course) => course.id === id)

  if (courseIndex === -1) {
    throw new Error("Course not found")
  }

  courses[courseIndex] = courseData

  // Revalidate the courses page
  revalidatePath("/courses")
  revalidatePath("/admin")
  revalidatePath(`/courses/${id}`)

  return { success: true }
}

export async function deleteCourse(id: string) {
  // In a real app, you would delete from a database
  courses = courses.filter((course) => course.id !== id)

  // Revalidate the courses page
  revalidatePath("/courses")
  revalidatePath("/admin")

  return { success: true }
}

