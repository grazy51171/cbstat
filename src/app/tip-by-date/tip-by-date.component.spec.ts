import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TipByDateComponent } from './tip-by-date.component';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TipByDateComponent', () => {
  let component: TipByDateComponent;
  let fixture: ComponentFixture<TipByDateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TipByDateComponent],
      imports: [
        MatCardModule,
        MatRadioModule,
        MatDividerModule,
        MatDatepickerModule,
        MatExpansionModule,
        NgChartsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
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
