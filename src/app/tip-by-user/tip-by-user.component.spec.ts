import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipByUserComponent } from './tip-by-user.component';

describe('TipByUserComponent', () => {
  let component: TipByUserComponent;
  let fixture: ComponentFixture<TipByUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipByUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
