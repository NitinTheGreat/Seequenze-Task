"use client"

import { motion } from "framer-motion"
import TaskItem from "./task-item"
import type { Task } from "@/lib/types"

interface TaskListProps {
  title: string
  color: string
  tasks: Task[]
  onTaskUpdated: () => void
}

export default function TaskList({ title, color, tasks, onTaskUpdated }: TaskListProps) {
  const getColorClasses = () => {
    switch (color) {
      case "blue":
        return "border-blue-500 text-blue-500"
      case "orange":
        return "border-orange-500 text-orange-500"
      case "green":
        return "border-green-500 text-green-500"
      default:
        return "border-gray-500 text-gray-500"
    }
  }

  const getBgColorClasses = () => {
    switch (color) {
      case "blue":
        return "bg-blue-500"
      case "orange":
        return "bg-orange-500"
      case "green":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-100 rounded-lg p-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${getBgColorClasses()}`}></div>
        <h2 className={`text-sm font-medium ${getColorClasses()}`}>{title}</h2>
        <span className="ml-1 text-xs bg-gray-200 px-2 py-0.5 rounded-full">{tasks.length}</span>
      </div>

      <div className={`w-full h-1 ${getBgColorClasses()} mb-4 rounded-full`}></div>

      {tasks.length > 0 ? (
        <div>
          {tasks.map((task) => (
            <TaskItem key={task._id} task={task} onTaskUpdated={onTaskUpdated} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">No tasks found</div>
      )}
    </motion.div>
  )
}

