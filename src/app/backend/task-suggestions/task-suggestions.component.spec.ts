import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSuggestionsComponent } from './task-suggestions.component';

describe('TaskSuggestionsComponent', () => {
  let component: TaskSuggestionsComponent;
  let fixture: ComponentFixture<TaskSuggestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskSuggestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
