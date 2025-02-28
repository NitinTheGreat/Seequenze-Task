"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase } from "@/lib/mongoose"
import TaskModel, { type ITask } from "../lib/task"
import type { CreateTaskInput } from "@/lib/types"

export async function fetchTasks(): Promise<ITask[]> {
  try {
    await connectToDatabase()
    const tasks = await TaskModel.find().sort({ createdAt: -1 })

    return JSON.parse(JSON.stringify(tasks))
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch tasks")
  }
}

export async function fetchTaskById(id: string): Promise<ITask> {
  try {
    await connectToDatabase()
    const task = await TaskModel.findById(id)

    if (!task) {
      throw new Error("Task not found")
    }

    return JSON.parse(JSON.stringify(task))
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch task")
  }
}

export async function createTask(taskData: CreateTaskInput): Promise<ITask> {
  try {
    await connectToDatabase()

    const newTask = new TaskModel({
      ...taskData,
      deadline: new Date(taskData.deadline),
    })

    const savedTask = await newTask.save()

    revalidatePath("/")
    return JSON.parse(JSON.stringify(savedTask))
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to create task")
  }
}

export async function updateTask(id: string, taskData: Partial<CreateTaskInput>): Promise<ITask> {
  try {
    await connectToDatabase()

    const updatedTask = {
      ...taskData,
    }

    if (taskData.deadline) {
      updatedTask.deadline = new Date(taskData.deadline).toISOString()
    }

    const task = await TaskModel.findByIdAndUpdate(id, updatedTask, { new: true })

    if (!task) {
      throw new Error("Task not found")
    }

    revalidatePath("/")
    return JSON.parse(JSON.stringify(task))
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to update task")
  }
}

export async function updateTaskStatus(id: string, status: string): Promise<ITask> {
  try {
    await connectToDatabase()

    const task = await TaskModel.findByIdAndUpdate(id, { status }, { new: true })

    if (!task) {
      throw new Error("Task not found")
    }

    revalidatePath("/")
    return JSON.parse(JSON.stringify(task))
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to update task status")
  }
}

export async function deleteTask(id: string): Promise<boolean> {
  try {
    await connectToDatabase()

    const result = await TaskModel.findByIdAndDelete(id)

    if (!result) {
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

