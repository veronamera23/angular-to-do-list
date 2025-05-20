import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() onDelete = new EventEmitter<number>();
  @Output() onEdit = new EventEmitter<Task>();
  @Output() onToggleReminder = new EventEmitter<Task>();
  @Output() onToggleComplete = new EventEmitter<Task>();

  onDeleteClick() {
    this.onDelete.emit(this.task.id);
  }

  onEditClick() {
    this.onEdit.emit(this.task);
  }

  onToggle() {
    this.onToggleReminder.emit(this.task);
  }

  onComplete() {
    this.task.completed = !this.task.completed; // Toggle locally for instant UI update
    this.onToggleComplete.emit(this.task);
  }

  getPriorityClass(): string {
    return `priority-${this.task.priority}`;
  }

  toggleComplete(task: Task) {
    task.completed = !task.completed;
    this.onToggleComplete.emit(task);
  }
}