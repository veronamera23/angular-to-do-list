import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { CommonModule, NgIf, NgFor, NgTemplateOutlet } from '@angular/common';
import { TaskItemComponent } from '../task-item/task-item.component';
import { AddTaskComponent } from '../add-task/add-task.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
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

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  toggleAddTask(): void {
    this.showAddTask = !this.showAddTask;
    this.taskToEdit = undefined;
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id);
    this.tasks = this.tasks.filter(task => task.id !== id); // Instantly remove from UI
    this.deletedTaskId = id;
    this.showTaskDeletedToast = true;
    setTimeout(() => {
      this.showTaskDeletedToast = false;
    }, 5000); // Hide toast after 5 seconds
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
        this.tasks = [restoredTask, ...this.tasks]; // Add restored task to the top of the list
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
    });
  }
  
  toggleReminder(task: Task): void {
    this.taskService.toggleReminder(task);
  }
  
  toggleComplete(task: Task): void {
    this.taskService.toggleComplete(task);
  }
}