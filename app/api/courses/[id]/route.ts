import { NextResponse } from "next/server"
import { getCourseById } from "@/lib/actions"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const course = await getCourseById(id)

    if (course) {
      return NextResponse.json(course)
    }

    return new NextResponse(JSON.stringify({ error: "Course not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error in course API:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to fetch course" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

