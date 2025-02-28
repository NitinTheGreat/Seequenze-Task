"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SuccessModal() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-lg w-full max-w-xs p-6 text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="bg-black rounded-lg p-4">
            <Check className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="text-lg font-medium mb-6">new task has been created successfully</h2>
        <Button className="w-full bg-black text-white hover:bg-gray-800">Back</Button>
      </motion.div>
    </motion.div>
  )
}

