import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongoose"
import TaskModel from "../../../../lib/task"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    await connectToDatabase()

    const task = await TaskModel.findById(id)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("Database Error:", error)
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    await connectToDatabase()
    const taskData = await request.json()

    if (taskData.deadline) {
      taskData.deadline = new Date(taskData.deadline)
    }

    const task = await TaskModel.findByIdAndUpdate(id, taskData, { new: true })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("Database Error:", error)
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    await connectToDatabase()

    const result = await TaskModel.findByIdAndDelete(id)

    if (!result) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Database Error:", error)
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}

