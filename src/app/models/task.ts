export interface Task {
  id?: number;
  text: string;
  dueDate?: string;
  dueTime?: string;
  reminder?: boolean;
  priority: "High" | "Mid" | "Low";
  completed?: boolean;
  dateAdded?: string; // <-- Add this line
}