import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

import { CbStatisticDatabase } from './database/cb-statistic.database';
import { IAppConfiguration } from './database/app-configuration';

@Injectable({
  providedIn: 'root'
})
export class ApplicationConfigurationService {
  private defaultConfig: IAppConfiguration = {
    id: 0,
    urlStatistic: null
  };

  private current = new BehaviorSubject<IAppConfiguration>(this.defaultConfig);

  constructor(private cbStatisticDb: CbStatisticDatabase) {
    this.cbStatisticDb.appConfiguration.get(0).then(async (val) => {
      if (!val) {
        // define default value
        await this.cbStatisticDb.appConfiguration.add(this.defaultConfig);
        this.current.next(this.defaultConfig);
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
