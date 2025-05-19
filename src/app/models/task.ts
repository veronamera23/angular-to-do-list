export interface Task {
  id: number;
  text: string;
  dueDate: string;
  dueTime: string;
  completed: boolean;
  priority: 'High' | 'Mid' | 'Low';
  dateAdded: Date;
}