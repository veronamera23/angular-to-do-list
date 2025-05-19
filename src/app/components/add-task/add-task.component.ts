import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})

export class AddTaskComponent implements OnInit {
  @Input() task?: Task;
  @Output() closeForm: EventEmitter<void> = new EventEmitter();
  
  text: string = '';
  dueDate: string = '';
  dueTime: string = '';
  priority: 'High' | 'Mid' | 'Low' = 'Mid';
  isEditing: boolean = false;
  formTitle: string = 'Add Task';

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    if (this.task) {
      this.text = this.task.text;
      this.dueDate = this.task.dueDate;
      this.dueTime = this.task.dueTime;
      this.priority = this.task.priority;
      this.isEditing = true;
      this.formTitle = 'Edit Task';
    } else {
      // Set default due date to today
      const today = new Date();
      this.dueDate = today.toISOString().split('T')[0];
      // Set default due time to current time rounded to nearest hour
      const hours = today.getHours();
      const minutes = today.getMinutes() >= 30 ? '30' : '00';
      this.dueTime = `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
  }

  onSubmit() {
    if (!this.text) {
      alert('Please add a task');
      return;
    }

    if (!this.dueDate) {
      alert('Please select a due date');
      return;
    }

    if (!this.dueTime) {
      alert('Please enter a due time');
      return;
    }

    const taskData: Task = {
      id: this.isEditing ? this.task!.id : 0,
      text: this.text,
      dueDate: this.dueDate,
      dueTime: this.dueTime,
      completed: this.isEditing ? this.task!.completed : false,
      priority: this.priority,
      dateAdded: this.isEditing ? this.task!.dateAdded : new Date()
    };

    if (this.isEditing) {
      this.taskService.updateTask(taskData);
    } else {
      this.taskService.addTask(taskData);
    }

    // Reset form
    this.text = '';
    this.dueDate = '';
    this.dueTime = '';
    this.priority = 'Mid';
    
    this.closeForm.emit();
  }
}