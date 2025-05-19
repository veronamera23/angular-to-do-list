import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDeletedToastComponent } from './task-deleted-toast.component';

describe('TaskDeletedToastComponent', () => {
  let component: TaskDeletedToastComponent;
  let fixture: ComponentFixture<TaskDeletedToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDeletedToastComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskDeletedToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
