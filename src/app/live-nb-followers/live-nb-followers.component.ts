import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets, ChartPoint } from 'chart.js';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { ShowStatisticsService } from '../show-statistics.service';
import { map, flatMap, takeUntil, filter } from 'rxjs/operators';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-live-nb-followers',
  templateUrl: './live-nb-followers.component.html',
  styleUrls: ['./live-nb-followers.component.scss']
})
export class LiveNbFollowersComponent implements OnInit, OnDestroy {
  public chartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'right'
    },
    scales: {
      xAxes: [
        {
          type: 'time'
        }
      ],
      yAxes: [{}]
    },
    plugins: {
      colorschemes: {
        scheme: 'brewer.Paired12',
        override: true
      }
    }
  };

  public followersData = new Array<ChartPoint>();
  public followersDataSet: ChartDataSets = {
    label: 'Followes',
    data: this.followersData
  };

  public chartDataSets: ChartDataSets[] = [this.followersDataSet];

  public chartType: ChartType = 'line';
  public chartLegend = true;

  public graphOptions: FormGroup;

  public dateLimits: Observable<{ first: Date; last: Date }>;

  private readonly defaultOptions = {
    typeView: '24h',
    dateMin: null as Date,
    dateMax: null as Date
  };

  private unsubscribe = new Subject<void>();

  constructor(private showStatistics: ShowStatisticsService, formBuilder: FormBuilder) {
    this.graphOptions = formBuilder.group(this.defaultOptions);
  }

  public ngOnInit() {
    this.dateLimits = this.showStatistics.limits();
    this.updateGraph(this.defaultOptions);
    this.graphOptions.valueChanges
      .pipe(
        takeUntil(this.unsubscribe),
        map((v) =>
          Object.assign({}, v, {
            dateMax: DateTime.fromJSDate(v.dateMax)
              .plus({ day: 1 })
              .toJSDate()
          })
        )
      )
      .subscribe((val) => this.updateGraph(val));
    this.showStatistics.currentValue
      .pipe(
        takeUntil(this.unsubscribe),
        filter((v) => !!v),
        map((stat) => ({
          followers: { t: stat.date, y: stat.numFollowers }
        }))
      )
      .subscribe((d) => {
        this.followersData.push(d.followers);
      });
  }

  public ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private updateGraph(val: { typeView: string; dateMin: Date; dateMax: Date }) {
    const firstDate =
      val.typeView === '24h'
        ? DateTime.local()
            .plus({ day: -1 })
            .toJSDate()
        : val.dateMin;
    const lastDate = val.typeView === '24h' ? new Date() : val.dateMax;

    this.followersData.length = 0;
    this.showStatistics
      .interval(firstDate, lastDate)
      .pipe(
        flatMap((list) => list),
        map((stat) => ({
          followers: { t: stat.date, y: stat.numFollowers }
        }))
      )

      .subscribe((d) => {
        this.followersData.push(d.followers);
      });
  }
}
