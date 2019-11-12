import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { flatMap } from 'rxjs/operators';
import { Observable, merge, from } from 'rxjs';
import { ITransaction } from '../database/cb-statistic.database';
import { StatTokenService } from '../stat-token.service';

/**
 * Data source for the TipTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TipTableDataSource extends DataSource<ITransaction> {
  paginator: MatPaginator;
  sort: MatSort;

  constructor(private statTokens: StatTokenService, private update: Observable<void>) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<ITransaction[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    // observableOf(this.data),
    const dataMutations = [this.update, this.paginator.page, this.sort.sortChange];

    return merge(...dataMutations).pipe(
      flatMap(() => {
        return from(this.statTokens.allPaginate(this.paginator.pageSize, this.paginator.pageIndex));
      })
    );
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}
}
