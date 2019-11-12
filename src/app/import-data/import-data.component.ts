import { Component, OnInit } from '@angular/core';
import { StatTokenService } from '../stat-token.service';

@Component({
  selector: 'app-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.scss']
})
export class ImportDataComponent implements OnInit {
  public importFinish = false;
  constructor(private statToken: StatTokenService) {}

  ngOnInit() {}

  public onChange(fileList: FileList): void {
    this.importFinish = false;
    const file = fileList[0];
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      this.statToken.import(fileReader.result as string).then(() => {
        this.importFinish = true;
      });
    };
    fileReader.readAsText(file);
  }
}
