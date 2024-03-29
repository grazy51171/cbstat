import { AfterViewInit, Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatHeaderRow, MatTable, MatTableModule } from '@angular/material/table';
import { TipTableDataSource } from './tip-table-datasource';
import { StatTokenService } from '../stat-token.service';
import { ITransaction } from '../database/cb-statistic.database';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-tip-table',
  templateUrl: './tip-table.component.html',
  styleUrls: ['./tip-table.component.scss'],
  imports: [CommonModule, MatPaginatorModule, MatSortModule, MatTableModule],
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
    this.dataLength = this.update.pipe(mergeMap(() => from(this.statTokenService.count())));
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
