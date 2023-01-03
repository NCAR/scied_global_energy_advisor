import { Component, OnInit } from '@angular/core';
import { GoogleChartService } from '../google-chart/service/google-chart.service';
import { DataService } from '../google-chart/service/data.service';
import { Source } from '../google-chart/service/source';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { SourcesDialogComponent } from '../sources-dialog/sources-dialog.component';
import {MatTooltipModule} from '@angular/material/tooltip'

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  private gLib: any;
  showTable:boolean = true;
  toggleText:string = 'Show';
  visibility:string = 'visibility';
  data_table:any;
  data_table_chart:any;
  options:any;
  sources_column_wrapper:any;
  sources_table_wrapper:any;
  sources_current_list:any;
  sources_sustainable_list:any;
  sources_custom_list:any;
  sources_formatter:any;
  costs_high_current:any;
  costs_low_current:any;
  costs_high_custom:any;
  costs_low_custom:any;
  costs_high_sustain:any;
  costs_low_sustain:any;
  sourcesDialog: MatDialogRef<SourcesDialogComponent>;

  constructor(private dialogModel: MatDialog,
    private dialog: MatDialog,
    private gChartService: GoogleChartService,
    private data: DataService) {
    this.gLib = this.gChartService.getGoogle();
    this.gLib.charts.load('current', {packages:['controls', 'corechart']});

    this.sources_current_list = this.data.default_source_structure;

  }
  ngOnInit(): void {

    this.getSources();
  }

  getSources() {
    let source;
    this.data.getSource()
      .subscribe(resp => {
        for (const d of (resp.body as any)) {
          this.sources_current_list[d.id] = {
            name: d.name,
            currentEnergy: d.currentEnergy,
            sustainableEnergy: d.sustainableEnergy,
            costlow: d.costlow,
            costhigh: d.costhigh
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
      this.data_table = this.gLib.visualization.arrayToDataTable([
        ['Sources', 'Petroleum', 'Coal', 'Natural Gas', 'Nuclear', 'Hydrothermal',
         'Biofuels', 'Wind', 'Solar', 'Geothermal', 'Total'],
        ['Your Mix',
          this.data.custom_source_structure['petroleum'].energy,
          this.data.custom_source_structure['coal'].energy,
          this.data.custom_source_structure['natural_gas'].energy,
          this.data.custom_source_structure['nuclear'].energy,
          this.data.custom_source_structure['hydro'].energy,
          this.data.custom_source_structure['biofuels'].energy,
          this.data.custom_source_structure['wind'].energy,
          this.data.custom_source_structure['solar'].energy,
          this.data.custom_source_structure['geothermal'].energy,
          this.calculateTotalEnergy('custom')
        ],
        [
          'Current Mix',
          this.sources_current_list['petroleum'].currentEnergy,
          this.sources_current_list['coal'].currentEnergy,
          this.sources_current_list['natural_gas'].currentEnergy,
          this.sources_current_list['nuclear'].currentEnergy,
          this.sources_current_list['hydro'].currentEnergy,
          this.sources_current_list['biofuels'].currentEnergy,
          this.sources_current_list['wind'].currentEnergy,
          this.sources_current_list['solar'].currentEnergy,
          this.sources_current_list['geothermal'].currentEnergy,
          this.calculateTotalEnergy('current')
        ],
        ['Sustainable Mix',
          this.sources_current_list['petroleum'].sustainableEnergy,
          this.sources_current_list['coal'].sustainableEnergy,
          this.sources_current_list['natural_gas'].sustainableEnergy,
          this.sources_current_list['nuclear'].sustainableEnergy,
          this.sources_current_list['hydro'].sustainableEnergy,
          this.sources_current_list['biofuels'].sustainableEnergy,
          this.sources_current_list['wind'].sustainableEnergy,
          this.sources_current_list['solar'].sustainableEnergy,
          this.sources_current_list['geothermal'].sustainableEnergy,
          this.calculateTotalEnergy('sustainable')
        ]
      ]);
      this.data_table_chart = this.gLib.visualization.arrayToDataTable([
        ['Sources', 'Petroleum', 'Coal', 'Natural Gas', 'Nuclear', 'Hydrothermal',
         'Biofuels', 'Wind', 'Solar', 'Geothermal'],
        ['Your Mix',
          this.data.custom_source_structure['petroleum'].energy,
          this.data.custom_source_structure['coal'].energy,
          this.data.custom_source_structure['natural_gas'].energy,
          this.data.custom_source_structure['nuclear'].energy,
          this.data.custom_source_structure['hydro'].energy,
          this.data.custom_source_structure['biofuels'].energy,
          this.data.custom_source_structure['wind'].energy,
          this.data.custom_source_structure['solar'].energy,
          this.data.custom_source_structure['geothermal'].energy
        ],
        [
          'Current Mix',
          this.sources_current_list['petroleum'].currentEnergy,
          this.sources_current_list['coal'].currentEnergy,
          this.sources_current_list['natural_gas'].currentEnergy,
          this.sources_current_list['nuclear'].currentEnergy,
          this.sources_current_list['hydro'].currentEnergy,
          this.sources_current_list['biofuels'].currentEnergy,
          this.sources_current_list['wind'].currentEnergy,
          this.sources_current_list['solar'].currentEnergy,
          this.sources_current_list['geothermal'].currentEnergy
        ],
        ['Sustainable Mix',
          this.sources_current_list['petroleum'].sustainableEnergy,
          this.sources_current_list['coal'].sustainableEnergy,
          this.sources_current_list['natural_gas'].sustainableEnergy,
          this.sources_current_list['nuclear'].sustainableEnergy,
          this.sources_current_list['hydro'].sustainableEnergy,
          this.sources_current_list['biofuels'].sustainableEnergy,
          this.sources_current_list['wind'].sustainableEnergy,
          this.sources_current_list['solar'].sustainableEnergy,
          this.sources_current_list['geothermal'].sustainableEnergy
        ]
      ]);

      this.options = {
        width: 900,
        height: 400,
        legend: { position: 'top', maxLines: 3 },
        isStacked: 'percent',
        vAxis: {
          textPosition: 'out',
          title: 'PWh'
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


      this.gLib.charts.setOnLoadCallback(this.drawVisualization.bind(this));



    }
    /**
    *
    **/
    calculateTotalEnergy(type){
      var total = 0;
      if(type == 'custom'){
        total = this.data.custom_source_structure['petroleum'].energy +
        this.data.custom_source_structure['coal'].energy +
        this.data.custom_source_structure['natural_gas'].energy +
        this.data.custom_source_structure['nuclear'].energy +
        this.data.custom_source_structure['hydro'].energy +
        this.data.custom_source_structure['biofuels'].energy +
        this.data.custom_source_structure['wind'].energy +
        this.data.custom_source_structure['solar'].energy +
        this.data.custom_source_structure['geothermal'].energy;
      } else if(type == 'current'){
        total = this.sources_current_list['petroleum'].currentEnergy +
        this.sources_current_list['coal'].currentEnergy +
        this.sources_current_list['natural_gas'].currentEnergy +
        this.sources_current_list['nuclear'].currentEnergy +
        this.sources_current_list['hydro'].currentEnergy +
        this.sources_current_list['biofuels'].currentEnergy +
        this.sources_current_list['wind'].currentEnergy +
        this.sources_current_list['solar'].currentEnergy +
        this.sources_current_list['geothermal'].currentEnergy;
      } else if(type == 'sustainable'){
        total = this.sources_current_list['petroleum'].sustainableEnergy +
        this.sources_current_list['coal'].sustainableEnergy +
        this.sources_current_list['natural_gas'].sustainableEnergy +
        this.sources_current_list['nuclear'].sustainableEnergy +
        this.sources_current_list['hydro'].sustainableEnergy +
        this.sources_current_list['biofuels'].sustainableEnergy +
        this.sources_current_list['wind'].sustainableEnergy +
        this.sources_current_list['solar'].sustainableEnergy +
        this.sources_current_list['geothermal'].sustainableEnergy;
      }
      console.log(total);
      return total;
    }
    /**
    *
    **/
    drawVisualization() {

      this.sources_formatter = new google.visualization.NumberFormat({
        pattern: '# PWh'
      });

      this.formatSources();
      // sources chart
      this.sources_column_wrapper = new google.visualization.ChartWrapper({
        chartType: 'ColumnChart',
        dataTable: this.data_table_chart,
        options: this.options,
        containerId: 'divSourcesChart'
      });
      this.sources_column_wrapper.draw();

      this.sources_table_wrapper = new google.visualization.ChartWrapper({
        chartType: 'Table',
        dataTable: this.data_table,
        options: {showRowNumber: true, width: '100%', height: '100%'},
        containerId: 'divTableChart'
      });
      this.sources_table_wrapper.draw();
    }

    /**
    *
    **/
    formatSources(){
      // format y
      for (var colIndex = 1; colIndex < this.data_table_chart.getNumberOfColumns(); colIndex++) {
        this.sources_formatter.format(this.data_table_chart, colIndex);
      }

      // format y
      for (var colIndex = 1; colIndex < this.data_table.getNumberOfColumns(); colIndex++) {
        this.sources_formatter.format(this.data_table, colIndex);
      }
    }

    toggleTable(){
      this.showTable = !this.showTable;
      if(this.toggleText == 'Show') {
        this.toggleText = 'Hide';
        this.visibility = 'visibility_off';
      } else {
        this.toggleText = 'Show';
        this.visibility = 'visibility';
      }
    }

    /**
    *
    *
    **/
    public openSourcesDialog() {
   this.sourcesDialog = this.dialogModel.open(SourcesDialogComponent);
    }
}
