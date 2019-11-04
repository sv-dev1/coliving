import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatmateIssuesComponent } from './flatmate-issues.component';

describe('FlatmateIssuesComponent', () => {
  let component: FlatmateIssuesComponent;
  let fixture: ComponentFixture<FlatmateIssuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlatmateIssuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlatmateIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
