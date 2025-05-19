import { Component } from '@angular/core';
import { TasksComponent } from './components/tasks/tasks.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [TasksComponent], // Import the standalone component
})

export class AppComponent {
  title = 'My To-Do List';
}