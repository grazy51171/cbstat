import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { StatTokenService } from '../stat-token.service';
import 'chartjs-plugin-colorschemes';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { merge } from 'rxjs';

@Component({
  selector: 'app-tip-by-user',
  templateUrl: './tip-by-user.component.html',
  styleUrls: ['./tip-by-user.component.scss']
})
export class TipByUserComponent implements OnInit {
  public chartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'right'
    },
    plugins: {
      colorschemes: {
        scheme: 'brewer.Paired12',
        override: true
      }
    }
  };
  public chartLabels: Label[] = [];
  public chartData: number[] = [];
  public chartType: ChartType = 'pie';
  public chartLegend = true;

  public graphOptions: UntypedFormGroup;

  private readonly defaultOptions = {
    typeUser: 'tipper',
    chartType: 'pie' as ChartType
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
      this.chartData = tipByUserSorted.map((ut) => ut.tip);
    });
  }
}
