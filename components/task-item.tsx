"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MoreHorizontal } from "lucide-react"
import { format } from "date-fns"
import type { Task } from "@/lib/types"
import { updateTaskStatus, deleteTask } from "@/lib/actions"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TaskItemProps {
  task: Task
}

export default function TaskItem({ task }: TaskItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task>(task)

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsUpdating(true)
      await updateTaskStatus(task._id, newStatus)
      setCurrentTask({ ...currentTask, status: newStatus as any })
    } catch (error) {
      console.error("Failed to update task status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsUpdating(true)
      await deleteTask(task._id)
      // The parent component will handle removing this task from the list
      // through a re-fetch or optimistic UI update
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  const getPriorityColor = () => {
    return task.priority.toLowerCase() === "high" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
  }

  const getStatusColor = () => {
    if (currentTask.status === "done") return "bg-green-100 text-green-600"
    return "bg-gray-100 text-gray-600"
  }

  const formatDeadline = (date: string) => {
    try {
      return format(new Date(date), "M/d/yy")
    } catch (error) {
      return "Invalid date"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm relative"
    >
      <div className="flex justify-between items-start mb-2">
        <div className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor()}`}>{task.priority}</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isUpdating}>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {currentTask.status !== "todo" && (
              <DropdownMenuItem onClick={() => handleStatusChange("todo")}>Move to To Do</DropdownMenuItem>
            )}
            {currentTask.status !== "in-progress" && (
              <DropdownMenuItem onClick={() => handleStatusChange("in-progress")}>Move to In Progress</DropdownMenuItem>
            )}
            {currentTask.status !== "done" && (
              <DropdownMenuItem onClick={() => handleStatusChange("done")}>Mark as Done</DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
      <p className="text-sm text-gray-500 mb-3 line-clamp-3">{task.description}</p>

      <div className="flex justify-between items-center text-xs text-gray-500">
        <div>Deadline: {formatDeadline(task.deadline)}</div>
        {task.assignedTo && <div>Assigned to: {task.assignedTo}</div>}
      </div>
    </motion.div>
  )
}

