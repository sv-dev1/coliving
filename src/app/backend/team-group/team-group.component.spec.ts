import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamGroupComponent } from './team-group.component';

describe('TeamGroupComponent', () => {
  let component: TeamGroupComponent;
  let fixture: ComponentFixture<TeamGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
