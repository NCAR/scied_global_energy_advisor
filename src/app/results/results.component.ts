import { Component, OnInit } from '@angular/core';
import { ChartType, Row } from "angular-google-charts";
import { SharedDataService } from '../google-chart/service/shared-data.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  title = 'Energy Source Mix (in petawatt-hours)';

  private sources_list: any;
  autoTicks = false;
  disabled = false;
  invert = false;
  max = 175;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = true;
  vertical = true;
  tickInterval = 1;

  type = ChartType.ColumnChart;
  data = [];
  myColumnNames = [];
  options = {
    width: 1080,
    height: 990,
    legend: { position: 'right', maxLines: 3 },
    bar: { groupWidth: '75%' },
    isStacked:'percent'
  };
  width = 1920;
  height = 1080;


  model_data:any = [];

  constructor(public sharedData : SharedDataService) {
    console.log(sharedData.getSourcesList());
    this.sources_list = sharedData.getSourcesList();
    this.myColumnNames = [
      '',
      this.sources_list['baseline']['petroleum'].name,
      this.sources_list['baseline']['coal'].name,
      this.sources_list['baseline']['natural_gas'].name,
      this.sources_list['baseline']['nuclear'].name,
      this.sources_list['baseline']['hydro'].name,
      this.sources_list['baseline']['biofuels'].name,
      this.sources_list['baseline']['wind'].name,
      this.sources_list['baseline']['solar'].name,
      this.sources_list['baseline']['geothermal'].name
    ];

    this.data = [
      [
        'Current Mix',
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
        'Your Mix',
        this.sources_list['custom']['petroleum'].amount,
        this.sources_list['custom']['coal'].amount,
        this.sources_list['custom']['natural_gas'].amount,
        this.sources_list['custom']['nuclear'].amount,
        this.sources_list['custom']['hydro'].amount,
        this.sources_list['custom']['biofuels'].amount,
        this.sources_list['custom']['wind'].amount,
        this.sources_list['custom']['solar'].amount,
        this.sources_list['custom']['geothermal'].amount
      ]
    ];
    // for input model
    this.model_data['petroleum'] = this.sources_list['custom']['petroleum'].amount;
    this.model_data['coal'] = this.sources_list['custom']['coal'].amount;
    this.model_data['natural_gas'] = this.sources_list['custom']['petroleum'].amount;
    this.model_data['nuclear'] = this.sources_list['custom']['nuclear'].amount;
    this.model_data['hydro'] = this.sources_list['custom']['hydro'].amount;
    this.model_data['biofuels'] = this.sources_list['custom']['biofuels'].amount;
    this.model_data['wind'] = this.sources_list['custom']['wind'].amount;
    this.model_data['solar'] = this.sources_list['custom']['solar'].amount;
    this.model_data['geothermal'] = this.sources_list['custom']['geothermal'].amount;
   }
  ngOnInit(): void {
  }
  getKey(source) {
    switch(source){
      case 'petroleum':
        return 1;
        break;
      case 'coal':
        return 2;
        break;
      case 'natural_gas':
        return 3;
        break;
      case 'nuclear':
        return 4;
        break;
      case 'hydro':
        return 5;
        break;
      case 'biofuels':
        return 6;
        break;
      case 'wind':
        return 7;
        break;
      case 'solar':
        return 8;
        break;
      case 'geothermal':
        return 9;
        break;
      }

      return 0;
  }

  /**
   *
   *
  **/
  onSliderInputChange(event,source) {
    this.model_data[source] = event.value;
    this.updateChart(source);
  }
  /**
   *
   *
  **/
  onInputChange(event,source) {
    this.updateChart(source);
  }

  /**
   *
   *
  **/
  updateChart(source) {
    this.sharedData.updateCustomValue(source,parseInt(this.model_data[source]));
    this.data[1][this.getKey(source)] = parseInt(this.model_data[source]);
    this.data = Object.assign([], this.data)
  }
}
