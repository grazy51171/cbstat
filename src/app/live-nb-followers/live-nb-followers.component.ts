import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { UntypedFormGroup, UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, mergeMap, takeUntil, filter, skip } from 'rxjs/operators';
import { DateTime } from 'luxon';
import { BaseChartDirective } from 'ng2-charts';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';

import { ShowStatisticsService } from '../show-statistics.service';

@Component({
  standalone: true,
  selector: 'app-live-nb-followers',
  templateUrl: './live-nb-followers.component.html',
  styleUrls: ['./live-nb-followers.component.scss'],
  imports: [
    CommonModule,
    BaseChartDirective,
    MatCardModule,
    MatDividerModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatExpansionModule,
  ],
})
export class LiveNbFollowersComponent implements OnInit, OnDestroy {
  public chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
      },
    },
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  public followersData = new Array<{ t: Date; y: number }>();
  public followersDataSet: ChartDataset<'line', { t: Date; y: number }[]> = {
    label: 'Followes',
    data: this.followersData,
  };

  public chartDataSets = [this.followersDataSet];

  public chartType: ChartType = 'line';
  public chartLegend = true;

  public graphOptions: UntypedFormGroup;

  public dateLimits: Observable<{ first: Date; last: Date }>;

  private readonly defaultOptions = {
    typeView: '24h',
    dateMin: null as Date,
    dateMax: null as Date,
  };

  private unsubscribe = new Subject<void>();

  constructor(private showStatistics: ShowStatisticsService, formBuilder: UntypedFormBuilder) {
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
            dateMax: DateTime.fromJSDate(v.dateMax).plus({ day: 1 }).toJSDate(),
          })
        )
      )
      .subscribe((val) => this.updateGraph(val));
    this.showStatistics.currentValue
      .pipe(
        takeUntil(this.unsubscribe),
        skip(1),
        filter((v) => !!v),
        map((stat) => ({
          followers: { t: stat.date, y: stat.numFollowers },
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
    const firstDate = val.typeView === '24h' ? DateTime.local().plus({ day: -1 }).toJSDate() : val.dateMin;
    const lastDate = val.typeView === '24h' ? new Date() : val.dateMax;

    this.followersData.length = 0;
    this.showStatistics
      .interval(firstDate, lastDate)
      .pipe(
        mergeMap((list) => list),
        map((stat) => ({
          followers: { t: stat.date, y: stat.numFollowers },
        }))
      )

      .subscribe((d) => {
        this.followersData.push(d.followers);
      });
  }
}
