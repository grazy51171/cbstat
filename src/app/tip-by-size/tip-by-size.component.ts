import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { DateTime } from 'luxon';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StatTokenService } from '../stat-token.service';

@Component({
  selector: 'app-tip-by-size',
  templateUrl: './tip-by-size.component.html',
  styleUrls: ['./tip-by-size.component.scss']
})
export class TipBySizeComponent implements OnInit {
  public maxSum = 1000;
  public chartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'right'
    },
    scales: {
      xAxes: [
        {
          offset: true,
          ticks: {
            // Include a dollar sign in the ticks
            callback: (value, index, values) => {
              return this.chartLabels[index] as string;
            }
          }
        }
      ]
    },
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          return data.datasets[tooltipItem.datasetIndex].label + ' Nb ' + tooltipItem.yLabel || '';
        }
      }
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
  public chartType: ChartType = 'bubble';
  public chartLegend = true;

  public graphOptions: UntypedFormGroup;

  public dateLimits: Observable<{ first: Date; last: Date }>;

  private readonly defaultOptions = {
    typeUser: 'tipper',
    chartType: 'bubble' as ChartType,
    dateMin: null as Date,
    dateMax: null as Date
  };
  constructor(private statToken: StatTokenService, formBuilder: UntypedFormBuilder) {
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
    const sizes = [1, 10, 20, 50, 100, 200, 500, 1000, 1000000];
    this.chartType = val.chartType;
    this.statToken.tipBySize(val.typeUser !== 'tipper', val.dateMin, val.dateMax, sizes).then((tipBySize) => {
      const sizeList = Array.from(tipBySize.keys()).sort((a, b) => a - b);

      const maxSum = Array.from(tipBySize.values())
        .map((v) => v.sum)
        .reduce((a, b) => (a > b ? a : b));

      const maxNb = Array.from(tipBySize.values())
        .map((v) => v.number)
        .reduce((a, b) => (a > b ? a : b));
      this.chartLabels = sizeList.map((v) => `moins de ${v} tk`);

      this.chartDataSets = sizeList.map((u, index) => {
        const s = tipBySize.get(u);
        return {
          label: `<= ${u} tk, total ${s.sum} tk`,

          data: [
            {
              x: index,
              y: s.number,
              r: 2 + (60 * s.sum) / maxSum
            }
          ]
        };
      });
    });
  }
}
