import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Task } from '../../models/task';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  public formTitle: string = 'Add Task';
  @Input() task?: Task;
  @Output() onAddTask = new EventEmitter<Task>();
  @Output() onCloseForm = new EventEmitter();

  text: string = '';
  dueDate: string = '';
  dueTime: string = '';
  reminder: boolean = false;
  priority: "High" | "Mid" | "Low" = 'Mid';
  completed: boolean = false;
  isEditMode: boolean = false;
  id?: number; // Only set when editing

  ngOnInit(): void {
    if (this.task) {
      this.id = this.task.id;
      this.text = this.task.text;
      this.dueDate = this.task.dueDate ?? '';
      this.dueTime = this.task.dueTime ?? '';
      this.reminder = this.task.reminder ?? false;
      this.priority = (['High', 'Mid', 'Low'].includes(this.task.priority) ? this.task.priority : 'Mid') as "High" | "Mid" | "Low";
      this.completed = this.task.completed ?? false;
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
      this.id = undefined;
    }
  }

  onSubmit() {
    if (!this.text) {
      alert('Please add a task!');
      return;
    }

    const now = new Date().toISOString();

    const newTask: Task = this.isEditMode
      ? {
          id: this.id!,
          text: this.text,
          dueDate: this.dueDate,
          dueTime: this.dueTime,
          reminder: this.reminder,
          priority: this.priority,
          completed: this.completed,
          dateAdded: this.task?.dateAdded || now // keep original dateAdded when editing
        }
      : {
          text: this.text,
          dueDate: this.dueDate,
          dueTime: this.dueTime,
          reminder: this.reminder,
          priority: this.priority,
          completed: this.completed,
          dateAdded: now // <-- Add this line for new tasks
        } as Task;

    this.onAddTask.emit(newTask);

    // Reset form for next add
    this.text = '';
    this.dueDate = '';
    this.dueTime = '';
    this.reminder = false;
    this.priority = 'Mid';
    this.completed = false;
    this.isEditMode = false;
    this.id = undefined;
  }

  closeForm() {
    this.onCloseForm.emit();
  }
}