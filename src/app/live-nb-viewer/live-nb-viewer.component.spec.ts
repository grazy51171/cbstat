import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveNbViewerComponent } from './live-nb-viewer.component';

describe('LiveNbViewerComponent', () => {
  let component: LiveNbViewerComponent;
  let fixture: ComponentFixture<LiveNbViewerComponent>;

  beforeEach(async(() => {
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
