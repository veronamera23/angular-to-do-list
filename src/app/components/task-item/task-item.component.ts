import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() onDelete = new EventEmitter<number>();
  @Output() onEdit = new EventEmitter<Task>();
  
  showConfirmDialog: boolean = false;

  constructor(private taskService: TaskService) {}

  onCheckboxChange(): void {
    this.taskService.toggleComplete(this.task.id);
  }

  onEditTask(): void {
    this.onEdit.emit(this.task);
  }

  onDeleteTask(): void {
    this.showConfirmDialog = true;
  }

  confirmDelete(): void {
    this.showConfirmDialog = false;
    this.onDelete.emit(this.task.id);
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
  }

  getPriorityClass(): string {
    switch (this.task.priority) {
      case 'High': return 'priority-high';
      case 'Mid': return 'priority-mid';
      case 'Low': return 'priority-low';
      default: return '';
    }
  }

  isOverdue(): boolean {
    const now = new Date();
    const dueDateTime = new Date(`${this.task.dueDate} ${this.task.dueTime}`);
    return !this.task.completed && dueDateTime < now;
  }
}