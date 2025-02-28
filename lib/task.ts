import mongoose, { Schema, type Document } from "mongoose"

export interface ITask extends Document {
  title: string
  description: string
  priority: "low" | "high"
  status: "todo" | "in-progress" | "done"
  deadline: Date
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ["low", "high"], default: "low" },
    status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
    deadline: { type: Date, required: true },
    assignedTo: { type: String },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema)

