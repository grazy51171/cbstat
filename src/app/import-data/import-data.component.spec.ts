import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

import { ImportDataComponent } from './import-data.component';
// import { MaterialFileInputModule } from 'ngx-material-file-input';
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
        // MaterialFileInputModule,
        MatIconModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
      ],
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
