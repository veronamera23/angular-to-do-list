import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Task } from '../../models/task';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- Add FormsModule here
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})

export class AddTaskComponent implements OnInit {
  public formTitle: string = 'Add Task';
  isEditing: boolean = false;
  @Input() task?: Task;
  @Output() onAddTask = new EventEmitter<Task>();
  @Output() onCloseForm = new EventEmitter();

  id: number = 0;
  text: string = '';
  dueDate: string = '';
  dueTime: string = '';
  reminder: boolean = false;
  priority: "High" | "Mid" | "Low" = 'Mid';
  completed: boolean = false;
  isEditMode: boolean = false;

  ngOnInit(): void {
    if (this.task) {
      this.id = this.task.id;
      this.text = this.task.text;
      this.dueDate = this.task.dueDate;
      this.dueTime = this.task.dueTime;
      this.reminder = this.task.reminder;
      this.priority = (['High', 'Mid', 'Low'].includes(this.task.priority) ? this.task.priority : 'Mid') as "High" | "Mid" | "Low";
      this.completed = this.task.completed;
      this.isEditMode = true;
    }
  }

  onSubmit() {
    if (!this.text) {
      alert('Please add a task!');
      return;
    }

    const newTask: Task = {
      id: this.id || Math.floor(Math.random() * 100000),
      text: this.text,
      dueDate: this.dueDate,
      dueTime: this.dueTime,
      reminder: this.reminder,
      priority: this.priority,
      completed: this.completed
    };

    this.onAddTask.emit(newTask);

    // Reset form
    this.text = '';
    this.dueDate = '';
    this.dueTime = '';
    this.reminder = false;
    this.priority = 'Mid';
    this.completed = false;
    this.isEditMode = false;
  }

  closeForm() {
    this.onCloseForm.emit();
  }
}