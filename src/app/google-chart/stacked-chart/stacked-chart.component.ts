import { Component, OnInit } from '@angular/core';
import { GoogleChartService } from '../service/google-chart.service';
import { SharedDataService } from '../service/shared-data.service';

@Component({
  selector: 'app-stacked-chart',
  templateUrl: './stacked-chart.component.html',
  styleUrls: ['./stacked-chart.component.scss']
})
export class StackedChartComponent implements OnInit {

  private gLib: any;
  private sources_list: any;
  private data_table: any;
  private keys:any;

  constructor(private gChartService : GoogleChartService, private sharedData : SharedDataService) {

    this.sources_list = sharedData.getSourcesList();

    this.gLib = this.gChartService.getGoogle();
    this.gLib.charts.load('current', {'packages':['corechart','table']});
    this.gLib.charts.setOnLoadCallback(this.drawChart.bind(this));
  }

  /**
  *
  *
  **/
  private drawChart(){
    let data = this.gLib.visualization.arrayToDataTable([
      [
        'Sources',
        this.sources_list['baseline']['petroleum'].name,
        this.sources_list['baseline']['coal'].name,
        this.sources_list['baseline']['natural_gas'].name,
        this.sources_list['baseline']['nuclear'].name,
        this.sources_list['baseline']['hydro'].name,
        this.sources_list['baseline']['biofuels'].name,
        this.sources_list['baseline']['wind'].name,
        this.sources_list['baseline']['solar'].name,
        this.sources_list['baseline']['geothermal'].name
      ],
      [
        'Baseline',
        this.sources_list['baseline']['petroleum'].amount,
        this.sources_list['baseline']['coal'].amount,
        this.sources_list['baseline']['natural_gas'].amount,
        this.sources_list['baseline']['nuclear'].amount,
        this.sources_list['baseline']['hydro'].amount,
        this.sources_list['baseline']['biofuels'].amount,
        this.sources_list['baseline']['wind'].amount,
        this.sources_list['baseline']['solar'].amount,
        this.sources_list['baseline']['geothermal'].amount
      ],
      [
        'Custom',
        this.sources_list['custom']['petroleum'].amount,
        this.sources_list['custom']['coal'].amount,
        this.sources_list['custom']['natural_gas'].amount,
        this.sources_list['custom']['nuclear'].amount,
        this.sources_list['custom']['hydro'].amount,
        this.sources_list['custom']['biofuels'].amount,
        this.sources_list['custom']['wind'].amount,
        this.sources_list['custom']['solar'].amount,
        this.sources_list['custom']['geothermal'].amount
      ],
    ]);

    var options = {
        width: 600,
        height: 400,
        legend: { position: 'top', maxLines: 3 },
        bar: { groupWidth: '75%' },
        isStacked: true,
        hAxis: {
          minValue: 0,
          maxValue: 150,
          ticks: [0, .25, .5, .75, 1]
        }
      };


    let chart = new this.gLib.visualization.ColumnChart(document.getElementById('divStackedColumnChart'));

    chart.draw(data, options);

    //setInterval(chart.draw(data, options),1000);

      this.sharedData.updateCustomValue('petroleum',120);
  }

  /**
  *
  *
  **/
  ngOnInit(): void {
  }

}
