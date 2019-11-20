import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DateTime } from 'luxon';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StatTokenService } from '../stat-token.service';

@Component({
  selector: 'app-tip-by-date',
  templateUrl: './tip-by-date.component.html',
  styleUrls: ['./tip-by-date.component.scss']
})
export class TipByDateComponent implements OnInit {
  public chartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'right'
    },
    scales: {
      xAxes: [
        {
          stacked: true
        }
      ],
      yAxes: [
        {
          stacked: true
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
  public chartLabels: Label[] = [];
  public chartDataSets: ChartDataSets[] = [
    {
      label: '',
      stack: '',
      data: []
    }
  ];
  public chartType: ChartType = 'bar';
  public chartLegend = true;

  public graphOptions: FormGroup;

  public dateLimits: Observable<{ first: Date; last: Date }>;

  private readonly defaultOptions = {
    typeUser: 'tipper',
    chartType: 'bar' as ChartType,
    dateMin: null as Date,
    dateMax: null as Date
  };
  constructor(private statToken: StatTokenService, private formBuilder: FormBuilder) {
    this.graphOptions = formBuilder.group(this.defaultOptions);
  }

  ngOnInit() {
    this.dateLimits = from(this.statToken.limits());
    this.updateGraph(this.defaultOptions);
    this.graphOptions.valueChanges
      .pipe(
        map((v) =>
          Object.assign({}, v, {
            dateMax: DateTime.fromJSDate(v.dateMax)
              .plus({ day: 1 })
              .toJSDate()
          })
        )
      )
      .subscribe((val) => this.updateGraph(val));
  }

  private updateGraph(val: { chartType: ChartType; typeUser: string; dateMin: Date; dateMax: Date }) {
    this.chartType = val.chartType;
    this.statToken.sumByDay(val.typeUser !== 'tipper', val.dateMin, val.dateMax).then((tipByDate) => {
      const dateList = Array.from(tipByDate.keys());

      const listUser = Array.from(
        dateList
          .reduce((prev, cur) => {
            const tipsDay = tipByDate.get(cur);
            Array.from(tipsDay.keys()).forEach((name) => prev.add(name));
            return prev;
          }, new Set<string>())
          .keys()
      );
      this.chartDataSets = listUser.map((u) => {
        return {
          label: u,
          data: dateList.map((d) => {
            const tipDate = tipByDate.get(d);
            return tipDate.has(u) ? tipDate.get(u) : 0;
          })
        };
      });
      this.chartLabels = dateList.map((d) => DateTime.fromISO(d).toLocaleString());
    });
  }
}
