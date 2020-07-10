import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';

import { TipByUserComponent } from './tip-by-user.component';
import { ChartsModule } from 'ng2-charts';

describe('TipByUserComponent', () => {
  let component: TipByUserComponent;
  let fixture: ComponentFixture<TipByUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TipByUserComponent],
      imports: [MatCardModule, MatRadioModule, MatDividerModule, ReactiveFormsModule, ChartsModule]
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
