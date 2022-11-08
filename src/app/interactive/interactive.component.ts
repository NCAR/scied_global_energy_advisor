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
  title_sources = 'Energy Source Mix';
  title_emissions = 'Carbon Dioxide Emissions';

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
  sources_datatable;
  sources_formatter;
  emissions_columns;
  emissions_wrapper;
  emissions_data;
  emissions_datatable;
  emissions_formatter;

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
    isStacked: 'percent',
    animation: {
      duration: 1000,
      easing: 'inAndOut',
      startup: true
    },
    enableInteractivity: true,
    vAxis: {
      textPosition: 'out',
      title: 'PWh',
      format: 'percent'
    },
    chartArea: {
      left: 70,
      top: 100,
      bottom: 10
    },
    series: {
      0:{color:'#D55E00'},
      1:{color:'#000000'},
      2:{color:'#E69F00'},
      3:{color:'#CC79A7'},
      4:{color:'#2372B2'},
      5:{color:'#159E74'},
      6:{color:'#56B4E9'},
      7:{color:'#F0E442'},
      8:{color:'#999933'}
    }
  };
  options_emissions = {
    title: this.title_emissions,
    height:400,
    width: 450,
    legend: { position: 'top', maxLines: 3 },
    animation: {
      duration: 1000,
      easing: 'inAndOut',
      startup: true
    },
    vAxis: {
      textPosition: 'out',
      title: 'Gt/PWh',
      format: 'decimal'
    },
    isStacked: true,
    chartArea: {
      left: 70,
      top: 100,
      bottom: 10
    },
    series: {
      0:{color:'#D55E00'},
      1:{color:'#000000'},
      2:{color:'#E69F00'},
      3:{color:'#CC79A7'},
      4:{color:'#2372B2'},
      5:{color:'#159E74'},
      6:{color:'#56B4E9'},
      7:{color:'#F0E442'},
      8:{color:'#999933'}
    }
  };


  constructor(private gChartService: GoogleChartService, private data: DataService) {
    this.gLib = this.gChartService.getGoogle();
    this.gLib.charts.load('current', {packages:['controls', 'corechart']});

    this.sources_list = this.data.default_source_structure;
    this.emissions_list = {};
  }
  ngOnInit(): void {

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
              emissions: d.emissionsgt
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

    this.calculateTotalEnergy();
    this.updateEmissionsData();
    this.gLib.charts.setOnLoadCallback(this.drawVisualization.bind(this));



  }

  /**
  *
  **/
  calcEmissionsPerSource(source){
    return parseInt(this.sources_list[source].energy) * parseFloat(this.emissions_list[source].emissions);
    //return parseInt(this.sources_list[source].energy) * parseInt(this.emissions_list[source].emissions) * .001;
  }

  /**
  *
  **/
  formatSources(){
    // format y
    for (var colIndex = 1; colIndex < this.sources_datatable.getNumberOfColumns(); colIndex++) {
      this.sources_formatter.format(this.sources_datatable, colIndex);
    }
  }
  /**
  *
  **/
  formatEmissions(){
    // format y
    for (var colIndex = 1; colIndex < this.emissions_datatable.getNumberOfColumns(); colIndex++) {
      this.emissions_formatter.format(this.emissions_datatable, colIndex);
    }
  }
  /**
  *
  **/
  drawVisualization() {

    this.sources_datatable = google.visualization.arrayToDataTable(
        [this.sources_columns, this.sources_data]);

    this.sources_formatter = new google.visualization.NumberFormat({
      pattern: '# PWh'
    });

    this.formatSources();

    // sources chart
    this.sources_wrapper = new google.visualization.ChartWrapper({
      chartType: 'ColumnChart',
      dataTable: this.sources_datatable,
      options: this.options_sources,
      containerId: 'divSourcesChart'
    });
    this.sources_wrapper.draw();

    this.emissions_datatable = google.visualization.arrayToDataTable(
        [this.emissions_columns, this.emissions_data]);

    this.emissions_formatter = new google.visualization.NumberFormat({
      pattern: '#.## Gt'
    });

    this.formatEmissions();

    // emissions chart
    this.emissions_wrapper = new google.visualization.ChartWrapper({
      chartType: 'ColumnChart',
      dataTable: this.emissions_datatable,
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
        this.calcEmissionsPerSource('petroleum'),
        this.calcEmissionsPerSource('coal'),
        this.calcEmissionsPerSource('natural_gas'),
        this.calcEmissionsPerSource('nuclear'),
        this.calcEmissionsPerSource('hydro'),
        this.calcEmissionsPerSource('biofuels'),
        this.calcEmissionsPerSource('wind'),
        this.calcEmissionsPerSource('solar'),
        this.calcEmissionsPerSource('geothermal')
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
    this.total_emissions = temp_emissions ;

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
    this.sources_datatable = google.visualization.arrayToDataTable(
        [this.sources_columns, this.sources_data]);
    this.sources_wrapper.setDataTable(this.sources_datatable);
    this.formatSources();
    this.sources_wrapper.draw();

    // redraw emissions
    this.emissions_datatable = google.visualization.arrayToDataTable(
        [this.emissions_columns, this.emissions_data]);
    this.emissions_wrapper.setDataTable(this.emissions_datatable);
    this.formatEmissions();
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
  /**
  *
  *
  **/
  public openDialog() {

  }

}
