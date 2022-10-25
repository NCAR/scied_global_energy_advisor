import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleChartModule } from './google-chart/google-chart.module';

import { GoogleChartsModule } from 'angular-google-charts';
import { IntroductionComponent } from './introduction/introduction.component';
import { ResultsComponent } from './results/results.component';
import { InteractiveComponent } from './interactive/interactive.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [
    AppComponent,
    IntroductionComponent,
    ResultsComponent,
    InteractiveComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleChartModule,
    GoogleChartsModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
