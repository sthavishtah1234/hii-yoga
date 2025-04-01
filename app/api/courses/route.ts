import { NextResponse } from "next/server"
import { getCourses } from "@/lib/actions"

export async function GET() {
  try {
    const courses = await getCourses()
    return NextResponse.json(courses)
  } catch (error) {
    console.error("Error in courses API:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to fetch courses" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

