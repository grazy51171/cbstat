import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { FormGroup, FormBuilder } from '@angular/forms';
import { StatTokenService } from '../stat-token.service';
import { DateTime } from 'luxon';

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

  private readonly defaultOptions = {
    typeUser: 'tipper',
    chartType: 'bar' as ChartType
  };
  constructor(private statToken: StatTokenService, private formBuilder: FormBuilder) {
    this.graphOptions = formBuilder.group(this.defaultOptions);
  }

  ngOnInit() {
    this.updateGraph(this.defaultOptions);
    this.graphOptions.valueChanges.subscribe((val) => this.updateGraph(val));
  }

  private updateGraph(val: { chartType: ChartType; typeUser: string }) {
    this.chartType = val.chartType;
    this.statToken.sumByDay(val.typeUser !== 'tipper').then((tipByDate) => {
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
