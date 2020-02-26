import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackpageComponent } from './feedbackpage.component';

describe('FeedbackpageComponent', () => {
  let component: FeedbackpageComponent;
  let fixture: ComponentFixture<FeedbackpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
