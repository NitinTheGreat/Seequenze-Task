"use client"

import { motion } from "framer-motion"
import { Clock, FileText, CheckCircle } from "lucide-react"
import type { Category } from "@/lib/types"

interface CategoryStatsProps {
  category: Category
}

export default function CategoryStats({ category }: CategoryStatsProps) {
  const getIcon = () => {
    switch (category.id) {
      case "expired":
        return <Clock className="h-6 w-6 text-white" />
      case "active":
        return <FileText className="h-6 w-6 text-white" />
      case "completed":
        return <CheckCircle className="h-6 w-6 text-white" />
      default:
        return null
    }
  }

  const getBgColor = () => {
    switch (category.id) {
      case "expired":
        return "bg-red-500"
      case "active":
        return "bg-orange-500"
      case "completed":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg p-4 shadow-sm"
    >
      <div className="flex flex-col h-full">
        <div className={`p-2 rounded-full ${getBgColor()} w-fit mb-4`}>{getIcon()}</div>
        <h3 className="text-sm text-gray-500 mb-1">{category.name}</h3>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold">{category.count}</span>
          {category.total && <span className="text-sm text-gray-500 ml-1">/{category.total}</span>}
        </div>
      </div>
    </motion.div>
  )
}

