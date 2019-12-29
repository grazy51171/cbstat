import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { CbStatisticDatabase } from './database/cb-statistic.database';
import { IAppConfiguration } from './database/app-configuration';

@Injectable({
  providedIn: 'root'
})
export class ApplicationConfigurationService {
  private current = new Subject<IAppConfiguration>();

  constructor(private cbStatisticDb: CbStatisticDatabase) {
    this.cbStatisticDb.appConfiguration.get(0).then(async (val) => {
      if (!val) {
        // define default value
        const config: IAppConfiguration = {
          id: 0,
          urlStatistic: null
        };
        await this.cbStatisticDb.appConfiguration.add(config);
        this.current.next(config);
      } else {
        this.current.next(val);
      }
    });
  }

  public get() {
    return this.current.asObservable();
  }

  public save(newValue: IAppConfiguration) {
    newValue.id = 0;
    this.cbStatisticDb.appConfiguration.put(newValue).then(() => this.current.next(newValue));
  }
}
