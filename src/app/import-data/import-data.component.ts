import { Component, OnInit } from '@angular/core';
import { StatTokenService } from '../stat-token.service';
import { Subject, Observable, from, of } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { TipTableComponent } from '../tip-table/tip-table.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    TipTableComponent,
  ],
})
export class ImportDataComponent implements OnInit {
  public importProgress = false;
  public importFinish = false;
  public linecount: Observable<number>;
  public limits: Observable<{ first: Date; last: Date }>;

  public dataUpdated = new Subject<void>();

  constructor(private statToken: StatTokenService) {
    this.linecount = this.dataUpdated.pipe(mergeMap(() => from(statToken.count())));
    this.limits = this.dataUpdated.pipe(mergeMap(() => from(statToken.limits())));
  }

  ngOnInit() {
    of(null)
      .pipe(delay(1000))
      .subscribe(() => this.dataUpdated.next());
  }

  public onChange(target: EventTarget): void {
    const fileList: FileList = (target as HTMLInputElement).files;
    this.importProgress = true;
    this.importFinish = false;
    const file = fileList[0];
    const fileReader = new FileReader();

    fileReader.onloadend = () => {
      this.statToken.import(fileReader.result as string).subscribe(
        () => {
          this.importFinish = true;
          this.importProgress = false;

          this.dataUpdated.next();
        },
        (error) => {
          console.log(error);
          this.importFinish = true;
          this.importProgress = false;
          this.dataUpdated.next();
        }
      );
    };
    fileReader.readAsText(file);
  }

  public callDeleteData() {
    this.statToken.deleteAll().then(() => this.dataUpdated.next());
  }

  public callExport() {
    this.statToken.export().subscribe();
  }
}
