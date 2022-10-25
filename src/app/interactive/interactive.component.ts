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

  sources_columns;
  sources_chart;
  sources_data;
  emissions_chart;
  emissions_list = {};
  emissions_data;
  total_energy = 0;
  max_energy = 175; // Petawatt-hours
  total_emissions = 0;
  max_emissions = 21; // Gigatons
  options_sources = {
    width: 500,
    height: 990,
    legend: { position: 'top', maxLines: 3 },
    bar: { groupWidth: '75%' },
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
      right: 100
    }
  };
  options_emissions = {
    width: 500,
    height: 990,
    legend: { position: 'top', maxLines: 3 },
    animation: {
      duration: 1000,
      easing: 'out',
    },
    isStacked: true
  };
  width = 400;
  height = 300;
  model_data: any = [];

  constructor(private gChartService: GoogleChartService, public sharedData: SharedDataService) {

    this.emissions_list = sharedData.getEmissionsList();

    // set up sources chart
    this.sources_list = sharedData.getSourcesList();

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

    this.gLib = this.gChartService.getGoogle();
    this.gLib.charts.load('current');
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

    console.log(this.sources_data);
    let data_table = [this.sources_columns, this.sources_data];
    var wrapper = new google.visualization.ChartWrapper({
    chartType: 'ColumnChart',
    dataTable: data_table,
    options: this.options_sources,
    containerId: 'divSourcesChart'
  });
    wrapper.draw();
  }


  /**
  *
  *
  **/
  updateEmissionsData(){
    //
    /*this.emissions_data = [
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

    this.calculateTotalEmissions();*/
  }
  /**
   *
   *
  **/
  onSliderInputChange(event, source) {
    this.model_data[source] = event.value;
    this.sources_data[source] = event.value;
    console.log(this.model_data);
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
  }

  /**
  *
  *
  **/
  calculateTotalEmissions(){
    this.total_emissions = this.emissions_data[0][1] + this.emissions_data[0][2] + this.emissions_data[0][3] + this.emissions_data[0][4] + this.emissions_data[0][5] + this.emissions_data[0][6] + this.emissions_data[0][7] + this.emissions_data[0][8] + this.emissions_data[0][9];
  }

  /**
   *
   *
  **/
  updateChart(source) {
    this.sharedData.updateCustomValue(source, parseInt(this.model_data[source]));
    this.calculateTotalEnergy();
    this.updateEmissionsData();


    this.sources_chart.draw(this.sources_data, this.options_sources);
  }

}
