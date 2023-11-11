import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { ReactiveFormsModule } from '@angular/forms';

import { TipByUserComponent } from './tip-by-user.component';
import { ChartsModule } from 'ng2-charts';

describe('TipByUserComponent', () => {
  let component: TipByUserComponent;
  let fixture: ComponentFixture<TipByUserComponent>;

  beforeEach(waitForAsync(() => {
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
