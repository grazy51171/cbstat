import { Injectable } from '@angular/core';
import { cbStatisticDb } from './database/cb-statistic.database';
import { DateTime, Zone } from 'luxon';

@Injectable({
  providedIn: 'root'
})
export class StatTokenService {
  private readonly cbTimeZone = 'America/Denver';

  constructor() {}

  public async getAlls() {
    return cbStatisticDb.tipList.toArray();
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
