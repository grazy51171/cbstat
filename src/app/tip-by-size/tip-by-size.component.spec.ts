import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipBySizeComponent } from './tip-by-size.component';
import {
  MatCardModule,
  MatRadioModule,
  MatDividerModule,
  MatDatepickerModule,
  MatExpansionModule
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

describe('TipByDateComponent', () => {
  let component: TipBySizeComponent;
  let fixture: ComponentFixture<TipBySizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TipBySizeComponent],
      imports: [
        MatCardModule,
        MatRadioModule,
        MatDividerModule,
        MatDatepickerModule,
        MatExpansionModule,
        ChartsModule,
        ReactiveFormsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipBySizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
