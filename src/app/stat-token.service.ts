import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { from, Observable } from 'rxjs';
import { map, filter, bufferCount, toArray, mergeMap } from 'rxjs/operators';
import * as FileSaver from 'file-saver';
import Dexie from 'dexie';

import { ITransaction, CbStatisticDatabase } from './database/cb-statistic.database';

function isValidDate(d: Date) {
  return d instanceof Date && !isNaN(d.getTime());
}

@Injectable({
  providedIn: 'root',
})
export class StatTokenService {
  private static fileDataRegexp = /"(\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d.\d\d\d)\d\d\d",(-?\d*),(-?\d*),"(.*)","(.*)","(.*)"/u;
  private static allMinDate = new Date(2000, 0);
  private static allMaxDate = new Date(3000, 0);

  private readonly cbTimeZone = 'America/Denver';

  constructor(private cbStatisticDb: CbStatisticDatabase) {}

  public async alls() {
    return this.cbStatisticDb.tipList.toArray();
  }

  public async allPaginate(pageSize: number, pageIndex: number) {
    return this.cbStatisticDb.tipList
      .offset(pageSize * pageIndex)
      .limit(pageSize)
      .toArray();
  }

  public async allPaginateAndSort(pageSize: number, pageIndex: number, sortKey: string, ascending: boolean) {
    let query: Dexie.Collection<ITransaction, Date> | Dexie.Table<ITransaction, Date> = this.cbStatisticDb.tipList;
    if (sortKey) {
      query = query.orderBy(sortKey);
    }

    if (!ascending) {
      query = query.reverse();
    }

    return query
      .offset(pageSize * pageIndex)
      .limit(pageSize)
      .toArray();
  }

  public async sumByUser(positive: boolean) {
    const stat = new Map<string, number>();

    const list = this.cbStatisticDb.tipList.filter((t) => (positive ? t.tokenChange > 0 : t.tokenChange < 0));

    await list.each((transac) => {
      if (stat.has(transac.user)) {
        stat.set(transac.user, (positive ? 1 : -1) * transac.tokenChange + stat.get(transac.user));
      } else {
        stat.set(transac.user, (positive ? 1 : -1) * transac.tokenChange);
      }
    });
    return stat;
  }

  public async sumByDay(positive: boolean, dateMin: Date, dateMax: Date) {
    const stat = new Map<string, Map<string, number>>();
    const dataSelect = this.cbStatisticDb.tipList
      .where('date')
      .inAnyRange([
        [
          isValidDate(dateMin) ? dateMin : StatTokenService.allMinDate,
          isValidDate(dateMax) ? dateMax : StatTokenService.allMaxDate,
        ],
      ]);

    const list = dataSelect.filter((t) => (positive ? t.tokenChange > 0 : t.tokenChange < 0));
    await list.each((transac) => {
      const date = DateTime.fromJSDate(transac.date).startOf('day').toISODate();

      let userStat: Map<string, number>;
      if (stat.has(date)) {
        userStat = stat.get(date);
      } else {
        userStat = new Map<string, number>();
        stat.set(date, userStat);
      }

      if (userStat.has(transac.user)) {
        userStat.set(transac.user, (positive ? 1 : -1) * transac.tokenChange + userStat.get(transac.user));
      } else {
        userStat.set(transac.user, (positive ? 1 : -1) * transac.tokenChange);
      }
    });
    return stat;
  }

  public async sumByDayOfWeek(positive: boolean) {
    const stat = new Map<number, Map<string, number>>();
    const list = this.cbStatisticDb.tipList.filter((t) => (positive ? t.tokenChange > 0 : t.tokenChange < 0));
    await list.each((transac) => {
      const wheekday = DateTime.fromJSDate(transac.date).weekday;

      let userStat: Map<string, number>;
      if (stat.has(wheekday)) {
        userStat = stat.get(wheekday);
      } else {
        userStat = new Map<string, number>();
        stat.set(wheekday, userStat);
      }

      if (userStat.has(transac.user)) {
        userStat.set(transac.user, (positive ? 1 : -1) * transac.tokenChange + userStat.get(transac.user));
      } else {
        userStat.set(transac.user, (positive ? 1 : -1) * transac.tokenChange);
      }
    });
    return stat;
  }

  public async count() {
    return this.cbStatisticDb.tipList.count();
  }

  public async limits() {
    const first = await this.cbStatisticDb.tipList.limit(1).first();
    const last = await this.cbStatisticDb.tipList.reverse().limit(1).first();
    if (first && last) {
      return { first: first.date, last: last.date };
    }
    return null;
  }

  public async deleteAll() {
    await this.cbStatisticDb.tipList.clear();
  }

  public import(csvFile: string) {
    const lines = csvFile.split(/\r\n|\n/);

    // Remove header
    lines.shift();

    return from(lines).pipe(
      map((csvLine) => csvLine.match(StatTokenService.fileDataRegexp)),
      filter((matches) => !!matches),
      map((matches) => ({
        date: DateTime.fromFormat(matches[1], 'yyyy-MM-dd HH:mm:ss.SSS', { zone: this.cbTimeZone })
          .toLocal()
          .toJSDate(),
        tokenChange: parseInt(matches[2], 10),
        tokenBalance: parseInt(matches[3], 10),
        type: matches[4],
        user: matches[5],
        note: matches[6],
      })),
      bufferCount(500),
      mergeMap((val) => from(this.cbStatisticDb.tipList.bulkPut(val)))
    );
  }

  public export() {
    return new Observable<ITransaction>((subcribe) => {
      this.cbStatisticDb.tipList
        .each((obj) => subcribe.next(obj))
        .then(() => {
          subcribe.complete();
        });
    }).pipe(
      map((val) => {
        const dateStr = DateTime.fromJSDate(val.date, { zone: 'local' })
          .setZone(this.cbTimeZone)
          .toFormat('yyyy-MM-dd HH:mm:ss.SSS');
        return `"${dateStr}000",${val.tokenChange},${val.tokenBalance},"${val.type}","${val.user}","${val.note}"\r\n`;
      }),
      toArray(),
      map((lines) => {
        lines.unshift('"Timestamp","Token change","Token balance","Transaction type","User","Note"\r\n');
        return lines.join('');
      }),
      map((fileLines) => new Blob([fileLines], { type: 'text/plain;charset=utf-8' })),
      map((blob) => FileSaver.saveAs(blob, 'transactions-export.csv'))
    );
  }

  public async tipBySize(positive: boolean, dateMin: Date, dateMax: Date, sizeLimit: number[]) {
    const dataSelect = this.cbStatisticDb.tipList
      .where('date')
      .inAnyRange([
        [
          isValidDate(dateMin) ? dateMin : StatTokenService.allMinDate,
          isValidDate(dateMax) ? dateMax : StatTokenService.allMaxDate,
        ],
      ]);

    const stat = new Map<number, { number: number; sum: number }>();
    const limits = sizeLimit.sort((a, b) => a - b);
    limits.forEach((v) => stat.set(v, { number: 0, sum: 0 }));

    const list = dataSelect.filter((t) => (positive ? t.tokenChange > 0 : t.tokenChange < 0));
    await list.each((transac) => {
      const tip = (positive ? 1 : -1) * transac.tokenChange;
      const bucket = limits.find((v) => v >= tip);
      if (bucket) {
        const bucketStat = stat.get(bucket);
        bucketStat.number++;
        bucketStat.sum += tip;
      }
    });
    return stat;
  }
}
