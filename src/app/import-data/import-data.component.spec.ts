import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ImportDataComponent } from './import-data.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MockComponent } from 'ng-mocks';
import { TipTableComponent } from '../tip-table/tip-table.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ImportDataComponent', () => {
  let component: ImportDataComponent;
  let fixture: ComponentFixture<ImportDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ImportDataComponent, MockComponent(TipTableComponent)],
      imports: [
        NoopAnimationsModule,
        MatCardModule,
        MatDividerModule,
        MaterialFileInputModule,
        MatIconModule,
        MatFormFieldModule,
        MatProgressSpinnerModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
