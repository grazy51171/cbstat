import { Injectable } from '@angular/core';
import { CbStatisticDatabase } from './database/cb-statistic.database';
import { IShowStatistic } from './database/show-statistic';
import { DateTime } from 'luxon';
import { HttpClient } from '@angular/common/http';
import { interval, of, Subject } from 'rxjs';
import { startWith, switchMap, catchError, filter, map, distinctUntilChanged, delay, tap } from 'rxjs/operators';
import { ApplicationConfigurationService } from './application-configuration.service';

interface ICBShowStatistic {
  username: string;
  time_online: number;
  tips_in_last_hour: number;
  num_followers: number;
  token_balance: number;
  satisfaction_score: number;
  num_tokened_viewers: number;
  votes_down: number;
  votes_up: number;
  last_broadcast: string;
  num_registered_viewers: number;
  num_viewers: number;
}

@Injectable({
  providedIn: 'root'
})
export class ShowStatisticsService {
  private readonly cbTimeZone = 'America/Denver';

  private lastValue = new Subject<IShowStatistic>();

  constructor(
    applicationConfigurationService: ApplicationConfigurationService,
    private cbStatisticDb: CbStatisticDatabase,
    private http: HttpClient
  ) {
    applicationConfigurationService
      .get()
      .pipe(
        map((v) => 'https://cors-anywhere.herokuapp.com/' + v.urlStatistic),
        switchMap((url) => this.readStatistics(url))
      )
      .subscribe((v) => this.lastValue.next(v));
  }

  public get currentValue() {
    return this.lastValue.asObservable();
  }

  public readStatistics(url: string) {
    return interval(60 * 1000).pipe(
      startWith(0),
      switchMap(() =>
        this.http.get<ICBShowStatistic>(url).pipe(catchError(() => of(null as ICBShowStatistic).pipe(delay(5000))))
      ),
      filter((v) => !!v),
      map((v) => this.convert(v)),
      distinctUntilChanged(this.areSame),
      tap((v) => this.cbStatisticDb.showStatistic.put(v))
    );
  }

  private convert(fromAPI: ICBShowStatistic): IShowStatistic {
    return {
      date: new Date(),
      numFollowers: fromAPI.num_followers,
      numRegisteredViewers: fromAPI.num_registered_viewers,
      numTokenedViewers: fromAPI.num_tokened_viewers,
      numViewers: fromAPI.num_viewers,
      satisfactionScore: fromAPI.satisfaction_score,
      timeOnline: fromAPI.time_online,
      tipsInLastHour: fromAPI.tips_in_last_hour,
      tokenBalance: fromAPI.token_balance,
      username: fromAPI.username,
      votesDown: fromAPI.votes_down,
      votesUp: fromAPI.votes_up,
      lastBroadcast: DateTime.fromISO(fromAPI.last_broadcast, { zone: this.cbTimeZone })
        .toLocal()
        .toJSDate()
    };
  }
  private areSame(a: IShowStatistic, b: IShowStatistic) {
    if (!a || !b) {
      return false;
    }

    return !(
      a.numFollowers !== b.numFollowers ||
      a.numRegisteredViewers !== b.numRegisteredViewers ||
      a.numTokenedViewers !== b.numTokenedViewers ||
      a.numViewers !== b.numViewers ||
      a.satisfactionScore !== b.satisfactionScore ||
      a.tipsInLastHour !== b.tipsInLastHour ||
      a.tokenBalance !== b.tokenBalance ||
      a.votesDown !== b.votesDown ||
      a.votesUp !== b.votesUp
    );
  }
}
