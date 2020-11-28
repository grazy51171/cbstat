import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LiveNbFollowersComponent } from './live-nb-followers.component';

describe('LiveNbFollowersComponent', () => {
  let component: LiveNbFollowersComponent;
  let fixture: ComponentFixture<LiveNbFollowersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveNbFollowersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveNbFollowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
