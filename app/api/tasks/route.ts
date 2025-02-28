import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const tasks = await db.collection("tasks").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Database Error:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const taskData = await request.json()

    // Validate required fields
    if (!taskData.title || !taskData.description || !taskData.deadline) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newTask = {
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = await db.collection("tasks").insertOne(newTask)
    const createdTask = await db.collection("tasks").findOne({ _id: result.insertedId })

    return NextResponse.json(createdTask)
  } catch (error) {
    console.error("Database Error:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}

