import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets, ChartPoint } from 'chart.js';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { ShowStatisticsService } from '../show-statistics.service';
import { map, flatMap, takeUntil, filter, skip } from 'rxjs/operators';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-live-nb-viewer',
  templateUrl: './live-nb-viewer.component.html',
  styleUrls: ['./live-nb-viewer.component.scss']
})
export class LiveNbViewerComponent implements OnInit, OnDestroy {
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
      yAxes: [
        {
          type: 'linear',
          display: true,
          position: 'left',
          id: 'viewer'
        },
        {
          type: 'linear',
          display: true,
          position: 'right',
          id: 'tip',
          gridLines: {
            drawOnChartArea: false // only want the grid lines for one axis to show up
          }
        }
      ]
    },
    plugins: {
      colorschemes: {
        scheme: 'brewer.Paired12',
        override: true
      }
    }
  };

  public viewerData = new Array<ChartPoint>();
  public viewerRegistredData = new Array<ChartPoint>();
  public viewerWithTokenData = new Array<ChartPoint>();
  public tipLastHoursData = new Array<ChartPoint>();
  public viewerDataSet: ChartDataSets = {
    label: 'Viewer',
    data: this.viewerData,
    yAxisID: 'viewer'
  };
  public viewerRegistredDataSet: ChartDataSets = {
    label: 'Viewer enregistré',
    data: this.viewerRegistredData,
    yAxisID: 'viewer'
  };

  public viewerWithTokenDataSet: ChartDataSets = {
    label: 'Viewer avec token',
    data: this.viewerWithTokenData,
    yAxisID: 'viewer'
  };

  public tipLastHoursDataSet: ChartDataSets = {
    label: 'Tips last hours',
    data: this.tipLastHoursData,
    yAxisID: 'tip'
  };
  public chartDataSets: ChartDataSets[] = [
    this.viewerDataSet,
    this.viewerRegistredDataSet,
    this.viewerWithTokenDataSet,
    this.tipLastHoursDataSet
  ];

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
        skip(1),
        filter((v) => !!v),
        map((stat) => ({
          viewer: { t: stat.date, y: stat.numViewers },
          viewerRegistred: { t: stat.date, y: stat.numRegisteredViewers },
          viewerWithToken: { t: stat.date, y: stat.numTokenedViewers },
          tiplasthours: { t: stat.date, y: stat.tipsInLastHour }
        }))
      )
      .subscribe((d) => {
        this.viewerData.push(d.viewer);
        this.viewerRegistredData.push(d.viewerRegistred);
        this.viewerWithTokenData.push(d.viewerWithToken);
        this.tipLastHoursData.push(d.tiplasthours);
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

    this.viewerData.length = 0;
    this.viewerRegistredData.length = 0;
    this.viewerWithTokenData.length = 0;
    this.tipLastHoursData.length = 0;

    this.showStatistics
      .interval(firstDate, lastDate)
      .pipe(
        flatMap((list) => list),
        map((stat) => ({
          viewer: { t: stat.date, y: stat.numViewers },
          viewerRegistred: { t: stat.date, y: stat.numRegisteredViewers },
          viewerWithToken: { t: stat.date, y: stat.numTokenedViewers },
          tiplasthours: { t: stat.date, y: stat.tipsInLastHour }
        }))
      )

      .subscribe((d) => {
        this.viewerData.push(d.viewer);
        this.viewerRegistredData.push(d.viewerRegistred);
        this.viewerWithTokenData.push(d.viewerWithToken);
        this.tipLastHoursData.push(d.tiplasthours);
      });
  }
}
