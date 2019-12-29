import Dexie from 'dexie';
import { Injectable } from '@angular/core';
import { IShowStatistic } from './show-statistic';
import { IAppConfiguration } from './app-configuration';

export interface ITransaction {
  date: Date;
  tokenChange: number;
  tokenBalance: number;
  type: string;
  user: string;
  note: string;
}

@Injectable({
  providedIn: 'root'
})
export class CbStatisticDatabase extends Dexie {
  public readonly tipList: Dexie.Table<ITransaction, Date>;
  public readonly showStatistic: Dexie.Table<IShowStatistic, Date>;
  public readonly appConfiguration: Dexie.Table<IAppConfiguration, number>;

  constructor() {
    super('CBStaticticDatabase');

    this.version(1).stores({
      tipList: 'date'
    });
    this.version(2).stores({
      tipList: 'date, user, type, tokenChange'
    });

    this.version(3).stores({
      tipList: 'date, user, type, tokenChange',
      showStatistic: 'date, lastBroadcast, timeOnline, tipsInLastHour, numFollowers',
      appConfiguration: 'id'
    });
    this.tipList = this.table('tipList');
    this.showStatistic = this.table('showStatistic');
    this.appConfiguration = this.table('appConfiguration');
  }
}
