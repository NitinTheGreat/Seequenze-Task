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
  onTaskUpdated: () => void
}

export default function TaskItem({ task, onTaskUpdated }: TaskItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsUpdating(true)
      await updateTaskStatus(task._id, newStatus)
      onTaskUpdated()
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
      onTaskUpdated()
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  const getPriorityColor = () => {
    return task.priority.toLowerCase() === "high" ? "text-red-500" : "text-blue-500"
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
      className="bg-white rounded-lg p-4 shadow-sm relative mb-4"
    >
      <div className="flex justify-between items-start mb-2">
        <div className={`text-xs ${getPriorityColor()}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </div>
        <button className="text-gray-400 hover:text-gray-600" disabled={isUpdating}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {task.status !== "todo" && (
                <DropdownMenuItem onClick={() => handleStatusChange("todo")}>Move to To Do</DropdownMenuItem>
              )}
              {task.status !== "in-progress" && (
                <DropdownMenuItem onClick={() => handleStatusChange("in-progress")}>
                  Move to In Progress
                </DropdownMenuItem>
              )}
              {task.status !== "done" && (
                <DropdownMenuItem onClick={() => handleStatusChange("done")}>Mark as Done</DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </button>
      </div>

      <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
      <p className="text-sm text-gray-500 mb-3 line-clamp-3">{task.description}</p>

      <div className="flex justify-start items-center text-xs text-gray-500">
        <div>Deadline: {formatDeadline(task.deadline)}</div>
      </div>
    </motion.div>
  )
}

