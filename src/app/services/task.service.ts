import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';
  private lastDeletedTask: Task | null = null;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  addTask(task: Task): void {
    this.http.post<Task>(this.apiUrl, task).subscribe();
  }

  deleteTask(id: number): boolean {
    this.http.get<Task>(`${this.apiUrl}/${id}`).subscribe(task => {
      this.lastDeletedTask = task;
      this.http.delete(`${this.apiUrl}/${id}`).subscribe();
    });
    return true;
  }

  undoDelete(): void {
    if (this.lastDeletedTask) {
      this.http.post<Task>(this.apiUrl, this.lastDeletedTask).subscribe();
      this.lastDeletedTask = null;
    }
  }

  toggleReminder(task: Task): void {
    const updatedTask = { ...task, reminder: !task.reminder };
    this.http.put<Task>(`${this.apiUrl}/${task.id}`, updatedTask).subscribe();
  }

  toggleComplete(task: Task): void {
    const updatedTask = { ...task, completed: !task.completed };
    this.http.put<Task>(`${this.apiUrl}/${task.id}`, updatedTask).subscribe();
  }
}