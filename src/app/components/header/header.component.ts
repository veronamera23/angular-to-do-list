import { Component } from '@angular/core';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-header',
  templateUrl: '../header.component.html',
  styleUrls: ['../header.component.css']
})
export class HeaderComponent {
  showAddTask: boolean = false;
  sortBy: 'dateAdded' | 'dueDate' | 'priority' = 'dateAdded';

  constructor(private taskService: TaskService) {}

  toggleAddTask() {
    this.showAddTask = !this.showAddTask;
  }

  onSortChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.sortBy = select.value as 'dateAdded' | 'dueDate' | 'priority';
    this.taskService.sortTasks(this.sortBy);
  }
}