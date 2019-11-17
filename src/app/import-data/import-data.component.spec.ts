import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatCardModule,
  MatDividerModule,
  MatIconModule,
  MatFormFieldModule,
  MatProgressSpinnerModule
} from '@angular/material';

import { ImportDataComponent } from './import-data.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MockComponent } from 'ng-mocks';
import { TipTableComponent } from '../tip-table/tip-table.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ImportDataComponent', () => {
  let component: ImportDataComponent;
  let fixture: ComponentFixture<ImportDataComponent>;

  beforeEach(async(() => {
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
