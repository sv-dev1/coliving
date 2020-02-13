import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePagecomponentComponent } from './home-pagecomponent.component';

describe('HomePagecomponentComponent', () => {
  let component: HomePagecomponentComponent;
  let fixture: ComponentFixture<HomePagecomponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePagecomponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePagecomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
