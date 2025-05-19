import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private deletedTask: Task | null = null;

  constructor() {
    // Load tasks from localStorage on initialization
    this.loadTasks();
  }

  private loadTasks(): void {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
      this.tasksSubject.next([...this.tasks]);
    }
  }

  private saveTasks(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    this.tasksSubject.next([...this.tasks]);
  }

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  addTask(task: Task): void {
    // Generate an ID
    const id = this.tasks.length > 0 
      ? Math.max(...this.tasks.map(t => t.id)) + 1 
      : 1;
    
    const newTask = {
      ...task,
      id,
      dateAdded: new Date()
    };
    
    this.tasks.push(newTask);
    this.saveTasks();
  }

  deleteTask(id: number): Task | null {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      const deletedTask = this.tasks[index];
      this.deletedTask = { ...deletedTask };
      this.tasks.splice(index, 1);
      this.saveTasks();
      return this.deletedTask;
    }
    return null;
  }

  undoDelete(): void {
    if (this.deletedTask) {
      this.tasks.push(this.deletedTask);
      this.deletedTask = null;
      this.saveTasks();
    }
  }

  updateTask(updatedTask: Task): void {
    const index = this.tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.saveTasks();
    }
  }

  toggleComplete(id: number): void {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      this.tasks[index].completed = !this.tasks[index].completed;
      this.saveTasks();
    }
  }

  sortTasks(sortBy: 'dateAdded' | 'dueDate' | 'priority'): void {
    switch (sortBy) {
      case 'dateAdded':
        this.tasks.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
        break;
      case 'dueDate':
        this.tasks.sort((a, b) => {
          const dateA = new Date(`${a.dueDate} ${a.dueTime}`).getTime();
          const dateB = new Date(`${b.dueDate} ${b.dueTime}`).getTime();
          return dateA - dateB;
        });
        break;
      case 'priority':
        const priorityOrder = { 'High': 1, 'Mid': 2, 'Low': 3 };
        this.tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
    }
    this.tasksSubject.next([...this.tasks]);
  }
}