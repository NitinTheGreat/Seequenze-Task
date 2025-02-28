export interface Task {
  _id: string
  title: string
  description: string
  priority: "low" | "high"
  status: "todo" | "in-progress" | "done"
  deadline: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  count: number
  total?: number
}

export interface CreateTaskInput {
  title: string
  description: string
  priority: string
  status: string
  deadline: string
  assignedTo?: string
}

