import Dexie from 'dexie';

export interface ITransaction {
  date: Date;
  tokenChange: number;
  tokenBalance: number;
  type: string;
  user: string;
  note: string;
}

export class CbStatisticDatabase extends Dexie {
  public readonly tipList: Dexie.Table<ITransaction, Date>;

  constructor() {
    super('CBStaticticDatabase');
    this.version(1).stores({
      tipList: 'date'
    });
    this.version(2).stores({
      tipList: 'date, user, type, tokenChange'
    });

    this.tipList = this.table('tipList');
  }
}

export const cbStatisticDb = new CbStatisticDatabase();
