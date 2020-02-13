import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteConfigcomponentComponent } from './site-configcomponent.component';

describe('SiteConfigcomponentComponent', () => {
  let component: SiteConfigcomponentComponent;
  let fixture: ComponentFixture<SiteConfigcomponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteConfigcomponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteConfigcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
