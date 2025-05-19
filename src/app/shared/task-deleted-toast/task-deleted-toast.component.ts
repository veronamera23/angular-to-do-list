import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-task-deleted-toast',
  templateUrl: './task-deleted-toast.component.html',
  styleUrls: ['./task-deleted-toast.component.css']
})
export class TaskDeletedToastComponent {
  @Input() message: string = 'Task deleted';
  @Output() undo = new EventEmitter<void>();

  onUndo(): void {
    this.undo.emit();
  }
}