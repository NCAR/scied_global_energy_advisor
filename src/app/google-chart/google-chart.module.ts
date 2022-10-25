import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineChartComponent } from './line-chart/line-chart.component';
import { ServiceModule } from './service/service.module';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { TableChartComponent } from './table-chart/table-chart.component';
import { StackedChartComponent } from './stacked-chart/stacked-chart.component';


@NgModule({
  declarations: [
    LineChartComponent,
    PieChartComponent,
    TableChartComponent,
    StackedChartComponent
  ],
  imports: [
    CommonModule,
    ServiceModule
  ],
  exports: [LineChartComponent, PieChartComponent, TableChartComponent, StackedChartComponent],
  providers : []
})
export class GoogleChartModule { }
