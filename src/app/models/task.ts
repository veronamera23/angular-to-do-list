// src/app/models/task.ts
export interface Task {
  id: number;
  text: string;
  dueDate: string;
  dueTime: string;
  reminder: boolean;
  priority: string;
  completed: boolean;
}