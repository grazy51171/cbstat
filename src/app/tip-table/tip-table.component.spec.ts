import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';

import { TipTableComponent } from './tip-table.component';
import { Subject } from 'rxjs';

describe('TipTableComponent', () => {
  let component: TipTableComponent;
  let fixture: ComponentFixture<TipTableComponent>;
  let updateSubject: Subject<void>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TipTableComponent],
      imports: [NoopAnimationsModule, MatPaginatorModule, MatSortModule, MatTableModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipTableComponent);
    component = fixture.componentInstance;
    updateSubject = new Subject<void>();
    component.update = updateSubject;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
