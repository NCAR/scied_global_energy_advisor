import { Component, OnInit } from '@angular/core';
import { GoogleChartService } from '../google-chart/service/google-chart.service';
import { SharedDataService } from '../google-chart/service/shared-data.service';

@Component({
  selector: 'app-interactive',
  templateUrl: './interactive.component.html',
  styleUrls: ['./interactive.component.scss']
})
export class InteractiveComponent implements OnInit {
  private gLib: any;
  title_sources = 'Energy Source Mix (in petawatt-hours)';
  title_emissions = 'kg of Carbon Dioxide emissions per MWh';

  private sources_list: any;
  private emissions_list: any;

  energyClass = 'energyOver';
  emissionsClass = 'emissionsOver';

  /** sliders **/
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

 /** charts **/
  sources_columns;
  sources_wrapper;
  sources_data;
  emissions_columns;
  emissions_data;
  emissions_wrapper;

  total_energy = 0;
  pctEnergy = 0;
  max_energy = 175; // Petawatt-hours
  total_emissions = 0;
  pctCO2emissions = 0;
  max_emissions = 21; // Gigatons

  options_sources = {
    title: this.title_sources,
    height:400,
    width: 450,
    legend: { position: 'top', maxLines: 3 },
    isStacked: true,
    animation: {
      duration: 1000,
      easing: 'out',
    },
    vAxes: {
      0: {
        textPosition: 'out',
        title: 'Petawatt-hours (PW-h)',
        textStyle: { color: '#000000' },
        minorGridlines: { count: 12, color: '#cc0000' },
        titleTextStyle: { color: '#21C40A' },
      },
    },
    vAxis: {
      minValue: 0,
      ticks: [0, 50, 100, 150, 175, 200]
    },
    chartArea: {
      left: 70,
      top: 100,
      bottom: 10
    }
  };
  options_emissions = {
    title: this.title_emissions,
    height:400,
    width: 450,
    legend: { position: 'top', maxLines: 3 },
    animation: {
      duration: 1000,
      easing: 'out',
    },
    isStacked: true,
    chartArea: {
      left: 70,
      top: 100,
      bottom: 10
    }
  };


  model_data: any = [];

  constructor(private gChartService: GoogleChartService, public sharedData: SharedDataService) {

    this.emissions_list = sharedData.getEmissionsList();

    // set up sources chart
    this.sources_list = sharedData.getSourcesList();
    this.sources_columns = [
      '',
      this.sources_list['custom']['petroleum'].name,
      this.sources_list['custom']['coal'].name,
      this.sources_list['custom']['natural_gas'].name,
      this.sources_list['custom']['nuclear'].name,
      this.sources_list['custom']['hydro'].name,
      this.sources_list['custom']['biofuels'].name,
      this.sources_list['custom']['wind'].name,
      this.sources_list['custom']['solar'].name,
      this.sources_list['custom']['geothermal'].name
    ];

    // for input model
    this.model_data['petroleum'] = parseInt(this.sources_list['custom']['petroleum'].amount);
    this.model_data['coal'] = parseInt(this.sources_list['custom']['coal'].amount);
    this.model_data['natural_gas'] = parseInt(this.sources_list['custom']['petroleum'].amount);
    this.model_data['nuclear'] = parseInt(this.sources_list['custom']['nuclear'].amount);
    this.model_data['hydro'] = parseInt(this.sources_list['custom']['hydro'].amount);
    this.model_data['biofuels'] = parseInt(this.sources_list['custom']['biofuels'].amount);
    this.model_data['wind'] = parseInt(this.sources_list['custom']['wind'].amount);
    this.model_data['solar'] = parseInt(this.sources_list['custom']['solar'].amount);
    this.model_data['geothermal'] = parseInt(this.sources_list['custom']['geothermal'].amount);

    this.sources_data = [
      '',
      this.model_data['petroleum'],
      this.model_data['coal'],
      this.model_data['natural_gas'],
      this.model_data['nuclear'],
      this.model_data['hydro'],
      this.model_data['biofuels'],
      this.model_data['wind'],
      this.model_data['solar'],
      this.model_data['geothermal']
    ];



    // set up emissions
    this.emissions_columns= [
      '',
      this.sources_list['custom']['petroleum'].name,
      this.sources_list['custom']['coal'].name,
      this.sources_list['custom']['natural_gas'].name,
      this.sources_list['custom']['nuclear'].name,
      this.sources_list['custom']['hydro'].name,
      this.sources_list['custom']['biofuels'].name,
      this.sources_list['custom']['wind'].name,
      this.sources_list['custom']['solar'].name,
      this.sources_list['custom']['geothermal'].name
    ];
    this.emissions_data = [
      '',
      parseInt(this.model_data['petroleum']) * parseInt(this.emissions_list['petroleum']),
      parseInt(this.model_data['coal']) * parseInt(this.emissions_list['coal']),
      parseInt(this.model_data['natural_gas']) * parseInt(this.emissions_list['natural_gas']),
      parseInt(this.model_data['nuclear']) * parseInt(this.emissions_list['nuclear']),
      parseInt(this.model_data['hydro']) * parseInt(this.emissions_list['hydro']),
      parseInt(this.model_data['biofuels']) * parseInt(this.emissions_list['biofuels']),
      parseInt(this.model_data['wind']) * parseInt(this.emissions_list['wind']),
      parseInt(this.model_data['solar']) * parseInt(this.emissions_list['solar']),
      parseInt(this.model_data['geothermal']) * parseInt(this.emissions_list['geothermal'])
    ];

    this.gLib = this.gChartService.getGoogle();
    this.gLib.charts.load('current', {packages:['controls', 'corechart']});
    this.gLib.charts.setOnLoadCallback(this.drawVisualization.bind(this));

    this.calculateTotalEnergy();
    this.updateEmissionsData();

  }
  ngOnInit(): void {
  }

  /**
  *
  **/
  drawVisualization() {
    // sources chart
    this.sources_wrapper = new google.visualization.ChartWrapper({
      chartType: 'ColumnChart',
      dataTable: [this.sources_columns, this.sources_data],
      options: this.options_sources,
      containerId: 'divSourcesChart'
    });
    this.sources_wrapper.draw();

    // emissions chart
    this.emissions_wrapper = new google.visualization.ChartWrapper({
      chartType: 'ColumnChart',
      dataTable: [this.emissions_columns, this.emissions_data],
      options: this.options_emissions,
      containerId: 'divEmissionsChart'
    });
    this.emissions_wrapper.draw();

  }

  // FUNCTION TO ROUND FLOATS
  roundNumber(num, dec) {
  	let result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
  	return result;
  }
  /**
  *
  *
  **/
  updateEmissionsData(){
    //
    this.emissions_data = [
        '',
        parseInt(this.model_data['petroleum']) * this.emissions_list['petroleum'],
        parseInt(this.model_data['coal']) * this.emissions_list['coal'],
        parseInt(this.model_data['natural_gas']) * this.emissions_list['natural_gas'],
        parseInt(this.model_data['nuclear']) * this.emissions_list['nuclear'],
        parseInt(this.model_data['hydro']) * this.emissions_list['hydro'],
        parseInt(this.model_data['biofuels']) * this.emissions_list['biofuels'],
        parseInt(this.model_data['wind']) * this.emissions_list['wind'],
        parseInt(this.model_data['solar']) * this.emissions_list['solar'],
        parseInt(this.model_data['geothermal']) * this.emissions_list['geothermal']
    ];


    this.calculateTotalEmissions();
  }

  /**
  *
  *
  **/
  getKey(source) {
    switch(source) {
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
  onSliderInputChange(event, source) {
    this.model_data[source] = event.value;
    this.updateChart(source);
  }
  /**
   *
   *
  **/
  onInputChange(event, source) {
    this.updateChart(source);
  }

  /**
  *
  *
  **/
  calculateTotalEnergy(){
    this.total_energy = parseInt(this.model_data['petroleum'] + this.model_data['coal'] + this.model_data['natural_gas'] + this.model_data['nuclear'] + this.model_data['hydro'] + this.model_data['biofuels'] + this.model_data['wind'] + this.model_data['solar'] + this.model_data['geothermal']);
    this.pctEnergy = this.roundNumber(((this.total_energy/this.max_energy)*100),0);

    if(this.total_energy >= this.max_energy) {
      this.energyClass = 'energyOver';
    } else {
      this.energyClass = 'energyUnder';
    }
  }

  /**
  *
  *
  **/
  calculateTotalEmissions(){
    let temp_emissions = this.emissions_data[1] + this.emissions_data[2] + this.emissions_data[3] + this.emissions_data[4] + this.emissions_data[5];
    this.total_emissions = temp_emissions  * .001;

    // calc % of recommended emissions
  	this.pctCO2emissions = this.roundNumber(((this.total_emissions/this.max_emissions)*100),0);

    if(this.total_emissions >= this.max_emissions) {
      this.emissionsClass = 'emissionsOver';
    } else {
      this.emissionsClass = 'emissionsUnder';
    }
  }

  /**
   *
   *
  **/
  updateChart(source) {
    this.sources_data[this.getKey(source)] = parseInt(this.model_data[source]);
    this.sharedData.updateCustomValue(source, parseInt(this.model_data[source]));

    // redraw sources
    this.sources_wrapper.setDataTable([this.sources_columns, this.sources_data]);
    this.sources_wrapper.draw();

    // redraw emissions
    this.emissions_wrapper.setDataTable([this.emissions_columns, this.emissions_data]);
    this.emissions_wrapper.draw();

    this.calculateTotalEnergy();
    this.updateEmissionsData();
  }

}
