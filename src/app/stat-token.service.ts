import { Injectable } from '@angular/core';
import { cbStatisticDb } from './database/cb-statistic.database';
import { DateTime } from 'luxon';
import { state } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class StatTokenService {
  private readonly cbTimeZone = 'America/Denver';

  constructor() {}

  public async alls() {
    return cbStatisticDb.tipList.toArray();
  }

  public async allPaginate(pageSize: number, pageIndex: number) {
    return cbStatisticDb.tipList
      .offset(pageSize * pageIndex)
      .limit(pageSize)
      .toArray();
  }

  public async sumByUser(positive: boolean) {
    const stat = new Map<string, number>();

    const list = cbStatisticDb.tipList.filter((t) => (positive ? t.tokenChange > 0 : t.tokenChange < 0));

    await list.each((transac) => {
      if (stat.has(transac.user)) {
        stat.set(transac.user, (positive ? 1 : -1) * transac.tokenChange + stat.get(transac.user));
      } else {
        stat.set(transac.user, (positive ? 1 : -1) * transac.tokenChange);
      }
    });
    return stat;
  }

  public async sumByDay(positive: boolean) {
    const stat = new Map<string, Map<string, number>>();
    const list = cbStatisticDb.tipList.filter((t) => (positive ? t.tokenChange > 0 : t.tokenChange < 0));
    await list.each((transac) => {
      const date = DateTime.fromJSDate(transac.date)
        .startOf('day')
        .toISODate();

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
    const list = cbStatisticDb.tipList.filter((t) => (positive ? t.tokenChange > 0 : t.tokenChange < 0));
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
    return cbStatisticDb.tipList.count();
  }

  public async limits() {
    const first = await cbStatisticDb.tipList.limit(1).first();
    const last = await cbStatisticDb.tipList
      .reverse()
      .limit(1)
      .first();
    if (first && last) {
      return { first: first.date, last: last.date };
    }
    return null;
  }

  public async deleteAll() {
    await cbStatisticDb.tipList.clear();
  }

  public async import(csvFile: string) {
    const lines = csvFile.split(/\r\n|\n/);

    // Remove header
    lines.shift();
    await Promise.all(lines.map((l) => this.importLine(l)));
  }

  private async importLine(csvLine: string) {
    const matches = csvLine.match(
      /"(\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d.\d\d\d)\d\d\d",(-?\d*),(-?\d*),"(.*)","(.*)","(.*)"/u
    );
    if (matches) {
      const val = {
        date: DateTime.fromFormat(matches[1], 'yyyy-MM-dd HH:mm:ss.SSS', { zone: this.cbTimeZone })
          .toLocal()
          .toJSDate(),
        tokenChange: parseInt(matches[2], 10),
        tokenBalance: parseInt(matches[3], 10),
        type: matches[4],
        user: matches[5],
        note: matches[6]
      };
      await cbStatisticDb.tipList.put(val);
    }
  }
}
