import { Component, OnInit } from '@angular/core';
import { StatTokenService } from '../stat-token.service';
import { Subject, Observable, from, of } from 'rxjs';
import { flatMap, delay } from 'rxjs/operators';

@Component({
  selector: 'app-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.scss']
})
export class ImportDataComponent implements OnInit {
  public importFinish = false;
  public linecount: Observable<number>;
  public limits: Observable<{ first: Date; last: Date }>;

  public dataUpdated = new Subject<void>();

  constructor(private statToken: StatTokenService) {
    this.linecount = this.dataUpdated.pipe(flatMap(() => from(statToken.count())));
    this.limits = this.dataUpdated.pipe(flatMap(() => from(statToken.limits())));
  }

  ngOnInit() {
    of(null)
      .pipe(delay(1000))
      .subscribe(() => this.dataUpdated.next());
  }

  public onChange(fileList: FileList): void {
    this.importFinish = false;
    const file = fileList[0];
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      this.statToken.import(fileReader.result as string).then(() => {
        this.importFinish = true;
        this.dataUpdated.next();
      });
    };
    fileReader.readAsText(file);
  }
}
