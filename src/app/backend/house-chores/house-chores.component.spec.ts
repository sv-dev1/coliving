import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseChoresComponent } from './house-chores.component';

describe('HouseChoresComponent', () => {
  let component: HouseChoresComponent;
  let fixture: ComponentFixture<HouseChoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HouseChoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseChoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
