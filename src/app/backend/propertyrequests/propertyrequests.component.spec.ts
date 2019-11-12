import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyrequestsComponent } from './propertyrequests.component';

describe('PropertyrequestsComponent', () => {
  let component: PropertyrequestsComponent;
  let fixture: ComponentFixture<PropertyrequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyrequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyrequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
