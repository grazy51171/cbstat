import { AfterViewInit, Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTable as MatTable } from '@angular/material/legacy-table';
import { TipTableDataSource } from './tip-table-datasource';
import { StatTokenService } from '../stat-token.service';
import { ITransaction } from '../database/cb-statistic.database';
import { Observable, from } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-tip-table',
  templateUrl: './tip-table.component.html',
  styleUrls: ['./tip-table.component.scss']
})
export class TipTableComponent implements AfterViewInit, OnInit {
  @Input()
  public update: Observable<void>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<ITransaction>;
  dataSource: TipTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['date', 'tokenChange', 'user', 'note'];

  public dataLength: Observable<number>;

  constructor(private statTokenService: StatTokenService) {}

  ngOnInit() {
    this.dataSource = new TipTableDataSource(this.statTokenService, this.update);
    this.dataLength = this.update.pipe(flatMap(() => from(this.statTokenService.count())));
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
