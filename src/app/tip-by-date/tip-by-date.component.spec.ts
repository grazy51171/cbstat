import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipByDateComponent } from './tip-by-date.component';
import { MatCardModule, MatRadioModule, MatDividerModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

describe('TipByDateComponent', () => {
  let component: TipByDateComponent;
  let fixture: ComponentFixture<TipByDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TipByDateComponent],
      imports: [MatCardModule, MatRadioModule, MatDividerModule, ChartsModule, ReactiveFormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipByDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
