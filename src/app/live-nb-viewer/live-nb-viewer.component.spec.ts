import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LiveNbViewerComponent } from './live-nb-viewer.component';

describe('LiveNbViewerComponent', () => {
  let component: LiveNbViewerComponent;
  let fixture: ComponentFixture<LiveNbViewerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveNbViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveNbViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
