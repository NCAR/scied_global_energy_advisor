import { Component, OnInit } from '@angular/core';
import { GoogleChartService } from '../google-chart/service/google-chart.service';
import { DataService } from '../google-chart/service/data.service';
import { Source } from '../google-chart/service/source';

@Component({
  selector: 'app-interactive',
  templateUrl: './interactive.component.html',
  styleUrls: ['./interactive.component.scss']
})
export class InteractiveComponent implements OnInit {
  private gLib: any;
  title_sources = 'Energy Source Mix (in petawatt-hours)';
  title_emissions = 'kg of Carbon Dioxide emissions per MWh';

  public sources_list: any;
  public emissions_list: any;

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




  constructor(private gChartService: GoogleChartService, private data: DataService) {



  }
  ngOnInit(): void {
    this.sources_list = this.data.default_source_structure;
    this.emissions_list = {};
    this.getSources();
  }


    getSources() {
      let source;
      this.data.getSource()
        .subscribe(resp => {
          for (const d of (resp.body as any)) {
            this.sources_list[d.id] = {
              name: d.name,
              energy: d.energy
            };
            this.emissions_list[d.id]= {
              name: d.name,
              emissions: d.emissions
            };
          }
          this.setupCharts();
        });
    }

  /**
  *
  *
  **/
  setupCharts() {
    // set up sources
    this.sources_columns = [
      '',
      this.sources_list['petroleum'].name,
      this.sources_list['coal'].name,
      this.sources_list['natural_gas'].name,
      this.sources_list['nuclear'].name,
      this.sources_list['hydro'].name,
      this.sources_list['biofuels'].name,
      this.sources_list['wind'].name,
      this.sources_list['solar'].name,
      this.sources_list['geothermal'].name
    ];

    this.sources_data = [
      '',
      this.sources_list['petroleum'].energy,
      this.sources_list['coal'].energy,
      this.sources_list['natural_gas'].energy,
      this.sources_list['nuclear'].energy,
      this.sources_list['hydro'].energy,
      this.sources_list['biofuels'].energy,
      this.sources_list['wind'].energy,
      this.sources_list['solar'].energy,
      this.sources_list['geothermal'].energy
    ];

    // set up emissions
    this.emissions_columns= [
      '',
      this.emissions_list['petroleum'].name,
      this.emissions_list['coal'].name,
      this.emissions_list['natural_gas'].name,
      this.emissions_list['nuclear'].name,
      this.emissions_list['hydro'].name,
      this.emissions_list['biofuels'].name,
      this.emissions_list['wind'].name,
      this.emissions_list['solar'].name,
      this.emissions_list['geothermal'].name
    ];
    this.emissions_data = [
      '',
      parseInt(this.sources_list['petroleum'].energy) * parseInt(this.emissions_list['petroleum'].emissions),
      parseInt(this.sources_list['coal'].energy) * parseInt(this.emissions_list['coal'].emissions),
      parseInt(this.sources_list['natural_gas'].energy) * parseInt(this.emissions_list['natural_gas'].emissions),
      parseInt(this.sources_list['nuclear'].energy) * parseInt(this.emissions_list['nuclear'].emissions),
      parseInt(this.sources_list['hydro'].energy) * parseInt(this.emissions_list['hydro'].emissions),
      parseInt(this.sources_list['biofuels'].energy) * parseInt(this.emissions_list['biofuels'].emissions),
      parseInt(this.sources_list['wind'].energy) * parseInt(this.emissions_list['wind'].emissions),
      parseInt(this.sources_list['solar'].energy) * parseInt(this.emissions_list['solar'].emissions),
      parseInt(this.sources_list['geothermal'].energy) * parseInt(this.emissions_list['geothermal'].emissions)
    ];

    this.gLib = this.gChartService.getGoogle();
    this.gLib.charts.load('current', {packages:['controls', 'corechart']});
    this.gLib.charts.setOnLoadCallback(this.drawVisualization.bind(this));

    this.calculateTotalEnergy();
    this.updateEmissionsData();
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
        parseInt(this.sources_list['petroleum'].energy) * this.emissions_list['petroleum'].emissions,
        parseInt(this.sources_list['coal'].energy) * this.emissions_list['coal'].emissions,
        parseInt(this.sources_list['natural_gas'].energy) * this.emissions_list['natural_gas'].emissions,
        parseInt(this.sources_list['nuclear'].energy) * this.emissions_list['nuclear'].emissions,
        parseInt(this.sources_list['hydro'].energy) * this.emissions_list['hydro'].emissions,
        parseInt(this.sources_list['biofuels'].energy) * this.emissions_list['biofuels'].emissions,
        parseInt(this.sources_list['wind'].energy) * this.emissions_list['wind'].emissions,
        parseInt(this.sources_list['solar'].energy) * this.emissions_list['solar'].emissions,
        parseInt(this.sources_list['geothermal'].energy) * this.emissions_list['geothermal'].emissions
    ];


    this.calculateTotalEmissions();
  }

  /**
   *
   *
  **/
  onSliderInputChange(event, source) {
    this.sources_list[source].energy = event.value;
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
    this.total_energy = parseInt(this.sources_list['petroleum'].energy + this.sources_list['coal'].energy + this.sources_list['natural_gas'].energy + this.sources_list['nuclear'].energy + this.sources_list['hydro'].energy + this.sources_list['biofuels'].energy + this.sources_list['wind'].energy + this.sources_list['solar'].energy + this.sources_list['geothermal'].energy);
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
    let temp_emissions = this.emissions_data[1] + this.emissions_data[2] + this.emissions_data[3] + this.emissions_data[4] + this.emissions_data[5] + this.emissions_data[6] + this.emissions_data[7] + this.emissions_data[8] + this.emissions_data[9];
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

    this.sources_data[this.getKey(source)] = parseInt(this.sources_list[source].energy);
    this.updateEmissionsData();

    // redraw sources
    this.sources_wrapper.setDataTable([this.sources_columns, this.sources_data]);
    this.sources_wrapper.draw();

    // redraw emissions
    this.emissions_wrapper.setDataTable([this.emissions_columns, this.emissions_data]);
    this.emissions_wrapper.draw();

    this.calculateTotalEnergy();
    this.updateEmissionsData();
  }

  getKey(source){
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
  public updateCustomValue(key, value) {
    // update custom shared data
    this.sources_list[key].energy = value;
  }


}
