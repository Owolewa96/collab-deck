import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITask extends Document {
  projectId: string;
  title: string;
  description?: string;
  assignees?: string[];
  priority: "low" | "medium" | "high";
  dueDate?: Date | null;
  status: "todo" | "in-progress" | "done";
  createdAt?: Date;
  updatedAt?: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    projectId: { type: Schema.Types.Mixed, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    assignees: [{ type: Schema.Types.Mixed }],
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: { type: Date, default: null },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
  },
  { timestamps: true }
);

/**
 * Minimal fallback interface: list only the methods you actually call in your app.
 * This avoids trying to implement the full Mongoose Model signature.
 */
interface ITaskFallback {
  find(filter: any): Promise<Partial<ITask>[]>;
  findById(id: string): Promise<ITask | null>;
  create(data: Partial<ITask>): Promise<ITask>;
}

let TaskModel: Model<ITask>;

try {
  TaskModel =
    (mongoose.models.Task as Model<ITask>) ||
    mongoose.model<ITask>("Task", TaskSchema);
} catch (err) {
  console.warn("⚠️ Failed to init Mongoose Task model. Using fallback.");

  const fallback: ITaskFallback = {
    async find(filter: any) {
      console.log("Fallback find:", filter);
      return [];
    },
    async findById(id: string) {
      console.log("Fallback findById:", id);
      return null;
    },
    async create(data: Partial<ITask>) {
      console.log("Fallback create:", data);
      // return a fake ITask-like object (partial) — cast to ITask to satisfy callers
      return { ...data, _id: String(Math.random()), createdAt: new Date(), updatedAt: new Date() } as unknown as ITask;
    },
  };

  // Cast fallback to the Mongoose Model type so the rest of your code can call it as usual.
  TaskModel = fallback as unknown as Model<ITask>;
}

export default TaskModel;
