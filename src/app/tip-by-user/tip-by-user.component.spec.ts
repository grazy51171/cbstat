import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';

import { TipByUserComponent } from './tip-by-user.component';
import { NgChartsModule } from 'ng2-charts';

describe('TipByUserComponent', () => {
  let component: TipByUserComponent;
  let fixture: ComponentFixture<TipByUserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TipByUserComponent],
      imports: [MatCardModule, MatRadioModule, MatDividerModule, ReactiveFormsModule, NgChartsModule],
    }).compileComponents();
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
