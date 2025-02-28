"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Filter } from "lucide-react"
import TaskList from "@/components/task-list"
import TaskForm from "@/components/task-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Task, Category } from "@/lib/types"
import { fetchTasks } from "@/lib/actions"
import CategoryStats from "@/components/category-stats"

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [priorityFilter, setPriorityFilter] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true)
        const data = await fetchTasks()
        setTasks(data)
        setFilteredTasks(data)
      } catch (error) {
        console.error("Failed to fetch tasks:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTasks()
  }, [])

  useEffect(() => {
    let result = tasks

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply priority filter
    if (priorityFilter.length > 0) {
      result = result.filter((task) => priorityFilter.includes(task.priority.toLowerCase()))
    }

    setFilteredTasks(result)
  }, [searchQuery, priorityFilter, tasks])

  const handleTaskAdded = (newTask: Task) => {
    setTasks((prev) => [...prev, newTask])
    setIsAddingTask(false)
  }

  const expiredTasks = filteredTasks.filter((task) => {
    const deadline = new Date(task.deadline)
    return deadline < new Date() && task.status !== "done"
  })

  const activeTasks = filteredTasks.filter((task) => task.status !== "done")

  const completedTasks = filteredTasks.filter((task) => task.status === "done")

  const categories: Category[] = [
    { id: "expired", name: "Expired Tasks", count: expiredTasks.length },
    { id: "active", name: "All Active Tasks", count: activeTasks.length },
    { id: "completed", name: "Completed Tasks", count: completedTasks.length, total: tasks.length },
  ]

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200"
              placeholder="Search Project"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={priorityFilter.includes("low")}
                onCheckedChange={(checked) => {
                  setPriorityFilter((prev) => (checked ? [...prev, "low"] : prev.filter((p) => p !== "low")))
                }}
              >
                Low Priority
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={priorityFilter.includes("high")}
                onCheckedChange={(checked) => {
                  setPriorityFilter((prev) => (checked ? [...prev, "high"] : prev.filter((p) => p !== "high")))
                }}
              >
                High Priority
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {categories.map((category) => (
            <CategoryStats key={category.id} category={category} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <TaskList title="To Do" color="blue" tasks={filteredTasks.filter((task) => task.status === "todo")} />
          <TaskList
            title="On Progress"
            color="orange"
            tasks={filteredTasks.filter((task) => task.status === "in-progress")}
          />
          <TaskList title="Done" color="green" tasks={filteredTasks.filter((task) => task.status === "done")} />
        </div>

        {isAddingTask ? (
          <TaskForm onTaskAdded={handleTaskAdded} onCancel={() => setIsAddingTask(false)} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2"
          >
            <Button
              onClick={() => setIsAddingTask(true)}
              className="bg-black text-white hover:bg-gray-800 rounded-lg px-4 py-2 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Task
            </Button>
          </motion.div>
        )}
      </div>
    </main>
  )
}

