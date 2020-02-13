import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqPagecomponentComponent } from './faq-pagecomponent.component';

describe('FaqPagecomponentComponent', () => {
  let component: FaqPagecomponentComponent;
  let fixture: ComponentFixture<FaqPagecomponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqPagecomponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqPagecomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
