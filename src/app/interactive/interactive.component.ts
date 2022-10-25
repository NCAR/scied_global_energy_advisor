import { Component, OnInit } from '@angular/core';
import { ChartType, Row } from "angular-google-charts";
import { SharedDataService } from '../google-chart/service/shared-data.service';

@Component({
  selector: 'app-interactive',
  templateUrl: './interactive.component.html',
  styleUrls: ['./interactive.component.scss']
})
export class InteractiveComponent implements OnInit {
  title_sources = 'Energy Source Mix (in petawatt-hours)';
  title_emissions = 'kg of Carbon Dioxide emissions per MWh';

  private sources_list: any;
  autoTicks = false;
  disabled = false;
  invert = false;
  max = 150;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = true;
  vertical = true;
  tickInterval = 1;

  type = ChartType.ColumnChart;
  emissions_list = {};
  data_energy = [];
  columns_energy = [];
  total_energy = 0;
  max_energy = 175; // Petawatt-hours
  total_emissions = 0;
  max_emissions = 21; // Gigatons
  options_sources = {
    width: 500,
    height: 990,
    legend: { position: 'top', maxLines: 3 },
    bar: { groupWidth: '75%' },
    isStacked:true,
    vAxis: {
      minValue: 0,
      ticks: [0,50,100,150,175: {textStyle: {color:'red'}},200]
    }
  };
  options_emissions = {
    width: 500,
    height: 990,
    legend: { position: 'top', maxLines: 3 },
    bar: { groupWidth: '75%' },
    isStacked:true
  };
  width = 400;
  height = 300;

  data_emissions = [];
  columns_emissions = [];


  model_data:any = [];

  constructor(public sharedData : SharedDataService) {
    this.emissions_list = sharedData.getEmissionsList();

    // set up sources chart
    this.sources_list = sharedData.getSourcesList();
    this.columns_energy = [
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

    this.data_energy = [
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


    // set up emissions Chart
    this.columns_emissions = [
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

    this.calculateTotalEnergy();
    this.updateEmissionsData();

   }
  ngOnInit(): void {
  }


  /**
  *
  *
  **/
  updateEmissionsData(){
    this.data_emissions = [
      [
        'Your Mix',
        parseInt(this.model_data['petroleum']) * this.emissions_list['petroleum'],
        parseInt(this.model_data['coal']) * this.emissions_list['coal'],
        parseInt(this.model_data['natural_gas']) * this.emissions_list['natural_gas'],
        parseInt(this.model_data['nuclear']) * this.emissions_list['nuclear'],
        parseInt(this.model_data['hydro']) * this.emissions_list['hydro'],
        parseInt(this.model_data['biofuels']) * this.emissions_list['biofuels'],
        parseInt(this.model_data['wind']) * this.emissions_list['wind'],
        parseInt(this.model_data['solar']) * this.emissions_list['solar'],
        parseInt(this.model_data['geothermal']) * this.emissions_list['geothermal']
      ]
    ];

    this.calculateTotalEmissions();
  }
  /**
  *
  *
  **/
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
  calculateTotalEnergy(){
    this.total_energy = parseInt(this.model_data['petroleum'] + this.model_data['coal'] + this.model_data['natural_gas'] + this.model_data['nuclear'] + this.model_data['hydro'] + this.model_data['biofuels'] + this.model_data['wind'] + this.model_data['solar'] + this.model_data['geothermal']);
  }

  /**
  *
  *
  **/
  calculateTotalEmissions(){
    this.total_emissions = this.data_emissions[0][1] + this.data_emissions[0][2] + this.data_emissions[0][3] + this.data_emissions[0][4] + this.data_emissions[0][5] + this.data_emissions[0][6] + this.data_emissions[0][7] + this.data_emissions[0][8] + this.data_emissions[0][9];
  }

  /**
   *
   *
  **/
  updateChart(source) {
    this.sharedData.updateCustomValue(source,parseInt(this.model_data[source]));
    this.data_energy[0][this.getKey(source)] = parseInt(this.model_data[source]);
    this.data_energy = Object.assign([], this.data_energy);
    this.calculateTotalEnergy();
    this.updateEmissionsData();
  }
}
