"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase } from "@/lib/mongodb"
import type { Task, CreateTaskInput } from "@/lib/types"

export async function fetchTasks(): Promise<Task[]> {
  try {
    const { db } = await connectToDatabase()
    const tasks = await db.collection("tasks").find({}).sort({ createdAt: -1 }).toArray()

    return JSON.parse(JSON.stringify(tasks))
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch tasks")
  }
}

export async function fetchTaskById(id: string): Promise<Task> {
  try {
    const { db } = await connectToDatabase()
    const task = await db.collection("tasks").findOne({ _id: id })

    if (!task) {
      throw new Error("Task not found")
    }

    return JSON.parse(JSON.stringify(task))
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch task")
  }
}

export async function createTask(taskData: CreateTaskInput): Promise<Task> {
  try {
    const { db } = await connectToDatabase()

    const newTask = {
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = await db.collection("tasks").insertOne(newTask)

    if (!result.insertedId) {
      throw new Error("Failed to create task")
    }

    const createdTask = await db.collection("tasks").findOne({ _id: result.insertedId })

    revalidatePath("/")
    return JSON.parse(JSON.stringify(createdTask))
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to create task")
  }
}

export async function updateTask(id: string, taskData: Partial<CreateTaskInput>): Promise<Task> {
  try {
    const { db } = await connectToDatabase()

    const updatedTask = {
      ...taskData,
      updatedAt: new Date().toISOString(),
    }

    const result = await db.collection("tasks").updateOne({ _id: id }, { $set: updatedTask })

    if (result.matchedCount === 0) {
      throw new Error("Task not found")
    }

    const task = await db.collection("tasks").findOne({ _id: id })

    revalidatePath("/")
    return JSON.parse(JSON.stringify(task))
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to update task")
  }
}

export async function updateTaskStatus(id: string, status: string): Promise<Task> {
  return updateTask(id, { status })
}

export async function deleteTask(id: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()

    const result = await db.collection("tasks").deleteOne({ _id: id })

    if (result.deletedCount === 0) {
      throw new Error("Task not found")
    }

    revalidatePath("/")
    return true
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to delete task")
  }
}

export async function fetchStreamingData(): Promise<any> {
  try {
    // This is a placeholder for the streaming API endpoint
    // In a real application, you would connect to an actual streaming API
    const response = await fetch("https://api.example.com/streaming", {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch streaming data")
    }

    return response.json()
  } catch (error) {
    console.error("API Error:", error)
    throw new Error("Failed to fetch streaming data")
  }
}

