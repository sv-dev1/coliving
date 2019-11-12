import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDwonloadPageComponent } from './app-dwonload-page.component';

describe('AppDwonloadPageComponent', () => {
  let component: AppDwonloadPageComponent;
  let fixture: ComponentFixture<AppDwonloadPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppDwonloadPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppDwonloadPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
