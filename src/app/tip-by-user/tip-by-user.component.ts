import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { StatTokenService } from '../stat-token.service';
// import 'chartjs-plugin-colorschemes';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-tip-by-user',
  templateUrl: './tip-by-user.component.html',
  styleUrls: ['./tip-by-user.component.scss'],
})
export class TipByUserComponent implements OnInit {
  public chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      /*  colorschemes: {
        scheme: 'brewer.Paired12',
        override: true
      }*/
    },
  };

  public chartLabels: string[] = [];
  public chartType: ChartType = 'pie';
  public chartLegend = true;

  public chartDataSet: ChartDataset[] = [
    {
      data: [] as number[],
    },
  ];


  public graphOptions: UntypedFormGroup;

  private readonly defaultOptions = {
    typeUser: 'tipper',
    chartType: 'pie' as ChartType,
  };
  constructor(private statToken: StatTokenService, private formBuilder: UntypedFormBuilder) {
    this.graphOptions = formBuilder.group(this.defaultOptions);
  }

  ngOnInit() {
    this.updateGraph(this.defaultOptions);
    this.graphOptions.valueChanges.subscribe((val) => this.updateGraph(val));
  }

  private updateGraph(val: { chartType: ChartType; typeUser: string }) {
    this.chartType = val.chartType;
    this.statToken.sumByUser(val.typeUser !== 'tipper').then((tipByUser) => {
      const tipByUserSorted = Array.from(tipByUser.entries())
        .map(([user, tip]) => ({ user, tip }))
        .sort((a, b) => b.tip - a.tip);

        this.chartLabels = tipByUserSorted.map((ut) => ut.user);
        this.chartDataSet[0].data = tipByUserSorted.map((ut) => ut.tip);
     // this.chartData = tipByUserSorted.map((ut) => ({ user: ut.user, y: ut.tip }));
    });
  }
}
