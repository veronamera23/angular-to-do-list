import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { CommonModule, NgIf, NgFor, NgTemplateOutlet } from '@angular/common';
import { TaskItemComponent } from '../task-item/task-item.component';
import { AddTaskComponent } from '../add-task/add-task.component';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIf,
    NgFor,
    TaskItemComponent,
    AddTaskComponent,
    HeaderComponent
  ],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  showAddTask: boolean = false;
  taskToEdit: Task | undefined;
  showTaskDeletedToast: boolean = false;
  deletedTaskId: number | null = null;
  confirmDeleteId: number | null = null;
  sortBy: 'dateAdded' | 'dueDate' | 'priority' = 'dateAdded';

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.sortTasks();
    });
  }

  toggleAddTask(): void {
    this.showAddTask = !this.showAddTask;
    this.taskToEdit = undefined;
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id);
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.confirmDeleteId = null;
    this.deletedTaskId = id;
    this.showTaskDeletedToast = true;
    setTimeout(() => {
      this.showTaskDeletedToast = false;
    }, 5000);
  }

  editTask(task: Task): void {
    this.taskToEdit = task;
    this.showAddTask = true;
  }

  closeForm(): void {
    this.showAddTask = false;
    this.taskToEdit = undefined;
  }

  undoDelete(): void {
    this.taskService.undoDelete().subscribe((restoredTask) => {
      if (restoredTask) {
        this.tasks = [restoredTask, ...this.tasks];
        this.sortTasks();
      }
      this.showTaskDeletedToast = false;
      this.deletedTaskId = null;
    });
  }
  
  addTask(task: Task): void {
    if (task.id) {
      this.taskService.updateTask(task).subscribe(() => {
        this.refreshTasks();
        this.closeForm();
      });
    } else {
      this.taskService.addTask(task).subscribe(() => {
        this.refreshTasks();
        this.closeForm();
      });
    }
  }

  refreshTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.sortTasks();
    });
  }
  
  toggleReminder(task: Task): void {
    this.taskService.toggleReminder(task);
  }
  
  toggleComplete(task: Task): void {
    this.taskService.toggleComplete(task);
  }

  setSortBy(sort: 'dateAdded' | 'dueDate' | 'priority') {
    this.sortBy = sort;
    this.sortTasks();
  }

  sortTasks() {
    if (this.sortBy === 'dateAdded') {
      this.tasks = [...this.tasks].sort((a, b) =>
        (b.dateAdded || '').localeCompare(a.dateAdded || '')
      );
    } else if (this.sortBy === 'dueDate') {
      this.tasks = [...this.tasks].sort((a, b) =>
        (a.dueDate || '').localeCompare(b.dueDate || '')
      );
    } else if (this.sortBy === 'priority') {
      const priorityOrder: Record<"High" | "Mid" | "Low", number> = { High: 1, Mid: 2, Low: 3 };
      this.tasks = [...this.tasks].sort(
        (a, b) =>
          (priorityOrder[a.priority as "High" | "Mid" | "Low"] ?? 4) -
          (priorityOrder[b.priority as "High" | "Mid" | "Low"] ?? 4)
      );
    }
  }

  confirmDelete(id: number): void {
    this.confirmDeleteId = id;
  }

  cancelDelete(): void {
    this.confirmDeleteId = null;
  }
}