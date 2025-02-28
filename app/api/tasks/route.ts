import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongoose"
import TaskModel from "@/lib/models/task"

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    const tasks = await TaskModel.find().sort({ createdAt: -1 })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Database Error:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const taskData = await request.json()

    // Validate required fields
    if (!taskData.title || !taskData.description || !taskData.deadline) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newTask = new TaskModel({
      ...taskData,
      deadline: new Date(taskData.deadline),
    })

    const savedTask = await newTask.save()

    return NextResponse.json(savedTask)
  } catch (error) {
    console.error("Database Error:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}

